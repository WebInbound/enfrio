import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import type { BlockDef, Content, PageDef } from "@/content/types";

/**
 * Kiwi Network headless CMS — read side.
 *
 * Texts and main images live in the Kiwi panel as blocks
 * (`web_static_blocks`, company = Enfrio Srl); photo galleries and project
 * references as collections. This module reads them for the Server
 * Components with three hard rules:
 *
 * 1. The site never waits on Kiwi for a visitor. Pages are static (ISR):
 *    Kiwi is only called while a page is being (re)generated in the
 *    background, never in the request path.
 * 2. Kiwi slow, down or rate-limiting = the site renders the last good
 *    value (unstable_cache keeps it when a revalidation fails) or, if it
 *    never had one, the registry default, which is the text the site had
 *    before the integration. Short timeout, small concurrency, and a
 *    circuit breaker so one failure doesn't turn into hundreds of requests.
 * 3. No time-based expiry on the data: values change only when Kiwi calls
 *    /api/revalidate (the panel's "Pubblica"), which marks the `kiwi` tag
 *    stale.
 *
 * Reading blocks: all of them in one request from GET /api/site/blocks when
 * Kiwi offers it, otherwise (and for any slug missing from that answer) one
 * request per block via GET /api/site/block, the get-or-create endpoint
 * (120 req/min per IP+company). Either way every value sits in the data
 * cache, so a publish refetches once and every other render is a cache hit.
 * The only network code is kiwiGet(); switching strategy touches readBlock().
 */

const COMPANY_ID = (process.env.KIWI_COMPANY_ID ?? "").trim();
const API_BASE = (process.env.KIWI_API_BASE ?? "https://app.kiwienterprise.it")
  .trim()
  .replace(/\/+$/, "");

const IS_BUILD = process.env.NEXT_PHASE === "phase-production-build";
const TIMEOUT_MS = 2500;
const MAX_IN_FLIGHT = IS_BUILD ? 2 : 4;
const BREAKER_MS = IS_BUILD ? 60_000 : 30_000;

export const KIWI_TAG = "kiwi";
export const kiwiEnabled = COMPANY_ID.length > 0;

/* ---------------------------------------------------------------- */
/* Transport: concurrency limit + circuit breaker (per server process) */
/* ---------------------------------------------------------------- */

let breakerOpenUntil = 0;
let inFlight = 0;
const waiting: Array<() => void> = [];

class KiwiUnavailableError extends Error {}

function tripBreaker(reason: string) {
  if (Date.now() >= breakerOpenUntil) {
    console.warn(`[kiwi] unavailable (${reason}) — using cached/default content for ${BREAKER_MS / 1000}s`);
  }
  breakerOpenUntil = Date.now() + BREAKER_MS;
}

function assertBreakerClosed() {
  if (Date.now() < breakerOpenUntil) throw new KiwiUnavailableError("circuit open");
}

async function withSlot<T>(fn: () => Promise<T>): Promise<T> {
  if (inFlight >= MAX_IN_FLIGHT) {
    await new Promise<void>((resolve) => waiting.push(resolve));
  }
  inFlight += 1;
  try {
    return await fn();
  } finally {
    inFlight -= 1;
    waiting.shift()?.();
  }
}

/** The only function that talks to Kiwi (GET). */
async function kiwiGet(url: URL, opts: { allow404?: boolean } = {}): Promise<Response> {
  assertBreakerClosed();
  // Kiwi's public GETs are CDN-cached for 30-90 s: right after a publish the
  // CDN would still hand back the old value, and the site would cache it
  // with no expiry. The site caches on its own, so always go to the origin.
  url.searchParams.set("_kv", Date.now().toString(36));
  return withSlot(async () => {
    assertBreakerClosed();
    let res: Response;
    try {
      res = await fetch(url, {
        cache: "no-store",
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: { accept: "application/json" },
      });
    } catch (err) {
      tripBreaker(err instanceof Error ? err.name : "network");
      throw new KiwiUnavailableError("fetch failed");
    }
    if (res.status === 429 || res.status >= 500) {
      tripBreaker(`HTTP ${res.status}`);
      throw new KiwiUnavailableError(`HTTP ${res.status}`);
    }
    if (res.status === 404 && opts.allow404) return res;
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res;
  });
}

/* ---------------------------------------------------------------- */
/* Blocks                                                             */
/* ---------------------------------------------------------------- */

async function fetchBlockValue(
  companyId: string,
  slug: string,
  fallback: string,
  label: string,
  group: string,
  type: string,
): Promise<string> {
  const url = new URL(`${API_BASE}/api/site/block`);
  url.searchParams.set("company_id", companyId);
  url.searchParams.set("slug", slug);
  // Kiwi uses these only to auto-register a block that doesn't exist yet.
  url.searchParams.set("default", fallback);
  url.searchParams.set("label", label);
  url.searchParams.set("group", group);
  url.searchParams.set("type", type);

  const res = await kiwiGet(url);
  // /api/site/block answers 200 + the default (and no cacheable header) when
  // its own database read fails. That value is not the stored one: treat it
  // as a failure so the last good value is kept instead of the default.
  const cacheControl = res.headers.get("cache-control") ?? "";
  if (/no-store/i.test(cacheControl) || /max-age=0\b/i.test(cacheControl)) {
    tripBreaker("block read not confirmed by Kiwi");
    throw new KiwiUnavailableError("unconfirmed value");
  }
  const json = (await res.json()) as { value?: unknown };
  if (typeof json?.value !== "string") throw new Error("invalid block payload");
  return json.value;
}

// `.bind(null)`: unstable_cache keys on cb.toString(); a bound function always
// stringifies to "function () { [native code] }", so the cache key depends only
// on the key parts below and survives rebuilds and deploys (the source of the
// minified function would change them, and every deploy would start cold).
// Bump the "-vN" part if what the function returns changes.
const cachedBlockValue = unstable_cache(fetchBlockValue.bind(null), ["kiwi-block-v1"], {
  tags: [KIWI_TAG],
  revalidate: false,
});

/* All blocks in one request (GET /api/site/blocks), when Kiwi has it. */

class BulkUnsupportedError extends Error {}
let bulkUnsupportedUntil = 0;

/** Accepts `{ blocks: [{ slug, value }] }`, `{ blocks: { slug: value } }` and close variants. */
function parseBulk(json: unknown): Record<string, string> {
  const root = json as Record<string, unknown> | unknown[] | null;
  const list = Array.isArray(root) ? root : root && (root.blocks ?? root.items ?? root.data);
  const out: Record<string, string> = {};
  if (Array.isArray(list)) {
    for (const row of list as Array<Record<string, unknown>>) {
      if (row && typeof row.slug === "string" && typeof row.value === "string") out[row.slug] = row.value;
    }
  } else if (list && typeof list === "object") {
    for (const [slug, v] of Object.entries(list as Record<string, unknown>)) {
      if (typeof v === "string") out[slug] = v;
      else if (v && typeof (v as { value?: unknown }).value === "string") out[slug] = (v as { value: string }).value;
    }
  }
  if (Object.keys(out).length === 0) throw new Error("bulk blocks: empty or unknown payload");
  return out;
}

async function fetchAllBlocks(companyId: string): Promise<Record<string, string>> {
  const url = new URL(`${API_BASE}/api/site/blocks`);
  url.searchParams.set("company_id", companyId);
  const res = await kiwiGet(url, { allow404: true });
  if (res.status === 404) throw new BulkUnsupportedError("no bulk endpoint");
  return parseBulk(await res.json());
}

const cachedAllBlocks = unstable_cache(fetchAllBlocks.bind(null), ["kiwi-blocks-all-v1"], {
  tags: [KIWI_TAG],
  revalidate: false,
});

/** Map slug → value, once per render; null if the bulk read isn't available. */
const allBlocks = cache(async (): Promise<Record<string, string> | null> => {
  if (!kiwiEnabled || Date.now() < bulkUnsupportedUntil) return null;
  try {
    // Always through unstable_cache: a no-store fetch made directly in a
    // render would turn the page dynamic (or abort its prerender).
    return await cachedAllBlocks(COMPANY_ID);
  } catch (err) {
    // Endpoint missing: don't ask again for 10 minutes, use per-block reads.
    if (err instanceof BulkUnsupportedError) bulkUnsupportedUntil = Date.now() + 10 * 60_000;
    else if (!(err instanceof KiwiUnavailableError)) {
      console.warn(`[kiwi] bulk blocks: ${err instanceof Error ? err.message : err}`);
    }
    return null;
  }
});

const SITE_ORIGIN_RE = /^https?:\/\/(www\.)?enfrio\.(it|eu)(?=\/)/i;
const SAFE_IMAGE_RE = /^(\/(?!\/)|https:\/\/)[^\s"'<>]*$/i;
const SAFE_URL_RE = /^(\/(?!\/)|https?:\/\/|mailto:|tel:|#)[^\s"'<>]*$/i;

/** Normalise a raw block value according to its type. */
function finalize(def: BlockDef, raw: string): string {
  const type = def.type ?? "text";
  if (type === "image") {
    // Same-site absolute URLs (stored like that so the panel can preview
    // them) are served as local paths, exactly like before.
    const v = raw.trim().replace(SITE_ORIGIN_RE, "");
    return v && SAFE_IMAGE_RE.test(v) ? v : def.default;
  }
  if (type === "url") {
    // Empty → default (an optional link like the datasheet has "" as default).
    const v = raw.trim();
    if (!v) return def.default;
    return SAFE_URL_RE.test(v) ? v.replace(SITE_ORIGIN_RE, "") : def.default;
  }
  return raw;
}

async function readBlock(slug: string, group: string, def: BlockDef): Promise<string> {
  if (!kiwiEnabled) return def.default;
  try {
    const all = await allBlocks();
    if (all && typeof all[slug] === "string") return finalize(def, all[slug]);
    // No bulk read, or a block Kiwi doesn't have yet: single get-or-create.
    const raw = await cachedBlockValue(
      COMPANY_ID,
      slug,
      def.default,
      def.label,
      group,
      def.type ?? "text",
    );
    return finalize(def, raw);
  } catch (err) {
    if (!(err instanceof KiwiUnavailableError)) {
      console.warn(`[kiwi] block ${slug}: ${err instanceof Error ? err.message : err}`);
    }
    return def.default;
  }
}

export type BlockMeta = { label?: string; group?: string; type?: BlockDef["type"] };

/**
 * One block, skill-compatible signature. Never throws: Kiwi unavailable →
 * last good value or `fallback`.
 */
export async function getBlock(slug: string, fallback: string, meta: BlockMeta = {}): Promise<string> {
  return readBlock(slug, meta.group ?? "", { label: meta.label ?? slug, default: fallback, type: meta.type });
}

export function blockSlug(page: PageDef, section: string, key: string): string {
  return `${page.id}_${section}_${key}`;
}

/** Load every block of a page definition. Never throws. */
export async function getContent<P extends PageDef>(page: P): Promise<Content<P>> {
  const entries = await Promise.all(
    Object.entries(page.sections).map(async ([sectionKey, section]) => {
      const values = await Promise.all(
        Object.entries(section.blocks).map(async ([key, def]) => [
          key,
          await readBlock(blockSlug(page, sectionKey, key), section.group, def),
        ] as const),
      );
      return [sectionKey, Object.fromEntries(values)] as const;
    }),
  );
  return Object.fromEntries(entries) as Content<P>;
}

/* ---------------------------------------------------------------- */
/* Collections                                                        */
/* ---------------------------------------------------------------- */

export type KiwiItem = {
  id: string;
  title: string;
  subtitle: string | null;
  body: string | null;
  image_url: string | null;
  metadata: Record<string, unknown>;
  display_order: number;
};

async function fetchCollectionItems(companyId: string, slug: string): Promise<KiwiItem[]> {
  const url = new URL(`${API_BASE}/api/site/collections/${encodeURIComponent(slug)}`);
  url.searchParams.set("company_id", companyId);
  url.searchParams.set("limit", "50");
  const res = await kiwiGet(url);
  const json = (await res.json()) as { items?: unknown };
  if (!Array.isArray(json?.items)) throw new Error("invalid collection payload");
  return json.items as KiwiItem[];
}

const cachedCollectionItems = unstable_cache(fetchCollectionItems.bind(null), ["kiwi-collection-v1"], {
  tags: [KIWI_TAG],
  revalidate: false,
});

/**
 * Load a collection and map its items. An empty or unreadable collection
 * renders the fallback list (the site's original content), so a section
 * can never end up empty by accident.
 */
export async function getCollection<T>(
  slug: string,
  fallback: T[],
  map: (item: KiwiItem) => T | null,
): Promise<T[]> {
  if (!kiwiEnabled) return fallback;
  try {
    const items = await cachedCollectionItems(COMPANY_ID, slug);
    const mapped = items.map(map).filter((x): x is T => x !== null);
    return mapped.length > 0 ? mapped : fallback;
  } catch (err) {
    if (!(err instanceof KiwiUnavailableError)) {
      console.warn(`[kiwi] collection ${slug}: ${err instanceof Error ? err.message : err}`);
    }
    return fallback;
  }
}

/** Image URL from a collection item, same rules as image blocks. */
export function itemImage(item: KiwiItem, fallback = ""): string {
  const v = (item.image_url ?? "").trim().replace(SITE_ORIGIN_RE, "");
  return v && SAFE_IMAGE_RE.test(v) ? v : fallback;
}

/** String field from item.metadata. */
export function itemMeta(item: KiwiItem, key: string, fallback = ""): string {
  const v = item.metadata?.[key];
  return typeof v === "string" ? v : fallback;
}

/* ---------------------------------------------------------------- */
/* Contact submissions                                                */
/* ---------------------------------------------------------------- */

export type KiwiContact = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  source: string;
  metadata?: Record<string, unknown>;
};

/** Store a contact form submission in the Kiwi panel ("Messaggi"). */
export async function sendKiwiContact(contact: KiwiContact): Promise<boolean> {
  if (!kiwiEnabled) return false;
  try {
    const res = await fetch(`${API_BASE}/api/site/contact`, {
      method: "POST",
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ company_id: COMPANY_ID, ...contact }),
    });
    const json = (await res.json().catch(() => null)) as { success?: boolean; error?: string } | null;
    if (!res.ok || json?.success !== true) {
      console.error("[contact] Kiwi not stored", res.status, json?.error ?? "<no body>");
      return false;
    }
    return true;
  } catch (err) {
    console.error("[contact] Kiwi unreachable", err instanceof Error ? err.name : err);
    return false;
  }
}
