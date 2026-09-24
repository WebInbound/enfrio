import "server-only";
import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { draftMode } from "next/headers";
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
 *    before the integration. Bounded timeout (8 s in the background, 2.5 s
 *    in the editor), small concurrency, and a circuit breaker so one
 *    failure doesn't turn into hundreds of requests.
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
// Build and background regeneration: no visitor waits, so wait as long as
// Kiwi's own budget (/api/site/blocks gives up on its DB after 6 s) — a
// shorter timeout would throw away slow-but-good answers and keep a publish
// off the site for as long as Kiwi stays slow.
const TIMEOUT_MS = 8000;
// Kiwi editor (draft mode): someone is waiting for the page to render.
const EDIT_TIMEOUT_MS = 2500;
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
async function kiwiGet(url: URL, opts: { allow404?: boolean; timeoutMs?: number } = {}): Promise<Response> {
  assertBreakerClosed();
  // Cache-buster: Kiwi's public GETs used to be CDN-cached for 30-90 s (the
  // site would have cached a stale value with no expiry). They are no-store
  // since 23 Sep 2026; the parameter is ignored by Kiwi and kept as a guard.
  url.searchParams.set("_kv", Date.now().toString(36));
  return withSlot(async () => {
    assertBreakerClosed();
    let res: Response;
    try {
      res = await fetch(url, {
        cache: "no-store",
        signal: AbortSignal.timeout(opts.timeoutMs ?? TIMEOUT_MS),
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

/** A block as read from Kiwi: raw value + the style set in the editor toolbar. */
type BlockEntry = { value: string; style: Record<string, unknown> | null };

function styleObject(v: unknown): Record<string, unknown> | null {
  return v && typeof v === "object" && !Array.isArray(v) && Object.keys(v).length > 0
    ? (v as Record<string, unknown>)
    : null;
}

async function fetchBlockEntry(
  companyId: string,
  slug: string,
  fallback: string,
  label: string,
  group: string,
  type: string,
  timeoutMs?: number,
): Promise<BlockEntry> {
  const url = new URL(`${API_BASE}/api/site/block`);
  url.searchParams.set("company_id", companyId);
  url.searchParams.set("slug", slug);
  // Kiwi uses these only to auto-register a block that doesn't exist yet.
  url.searchParams.set("default", fallback);
  url.searchParams.set("label", label);
  url.searchParams.set("group", group);
  url.searchParams.set("type", type);

  // Since kiwi-network PR #245/#246 (23 Sep 2026) a failed database read is a
  // 503 (kiwiGet trips the breaker, the last good value is kept) and every
  // answer is `no-store`: a 200 is always the stored value.
  const res = await kiwiGet(url, { timeoutMs });
  const json = (await res.json()) as { value?: unknown; styleOverrides?: unknown };
  if (typeof json?.value !== "string") throw new Error("invalid block payload");
  return { value: json.value, style: styleObject(json.styleOverrides) };
}

// `.bind(null)`: unstable_cache keys on cb.toString(); a bound function always
// stringifies to "function () { [native code] }", so the cache key depends only
// on the key parts below and survives rebuilds and deploys (the source of the
// minified function would change them, and every deploy would start cold).
// Bump the "-vN" part if what the function returns changes.
const cachedBlockEntry = unstable_cache(fetchBlockEntry.bind(null), ["kiwi-block-v2"], {
  tags: [KIWI_TAG],
  revalidate: false,
});

/* All blocks in one request (GET /api/site/blocks), when Kiwi has it. */

class BulkUnsupportedError extends Error {}
let bulkUnsupportedUntil = 0;

type BulkBlocks = { blocks: Record<string, string>; styles: Record<string, Record<string, unknown>> };

/**
 * Kiwi answers `{ blocks: { slug: value }, styles: { slug: styleOverrides }, count }`;
 * `{ blocks: [{ slug, value }] }` is accepted too. Maps without a prototype:
 * a slug like "constructor" must not hit Object.prototype.
 */
function parseBulk(json: unknown): BulkBlocks {
  const root = json as Record<string, unknown> | unknown[] | null;
  const list = Array.isArray(root) ? root : root && (root.blocks ?? root.items ?? root.data);
  const blocks: Record<string, string> = Object.create(null);
  const styles: Record<string, Record<string, unknown>> = Object.create(null);
  if (Array.isArray(list)) {
    for (const row of list as Array<Record<string, unknown>>) {
      if (row && typeof row.slug === "string" && typeof row.value === "string") blocks[row.slug] = row.value;
    }
  } else if (list && typeof list === "object") {
    for (const [slug, v] of Object.entries(list as Record<string, unknown>)) {
      if (typeof v === "string") blocks[slug] = v;
      else if (v && typeof (v as { value?: unknown }).value === "string") blocks[slug] = (v as { value: string }).value;
    }
  }
  const rawStyles = !Array.isArray(root) && root ? root.styles : null;
  if (rawStyles && typeof rawStyles === "object") {
    for (const [slug, s] of Object.entries(rawStyles as Record<string, unknown>)) {
      const o = styleObject(s);
      if (o) styles[slug] = o;
    }
  }
  if (Object.keys(blocks).length === 0) throw new Error("bulk blocks: empty or unknown payload");
  return { blocks, styles };
}

async function fetchAllBlocks(companyId: string, timeoutMs?: number): Promise<BulkBlocks> {
  const url = new URL(`${API_BASE}/api/site/blocks`);
  url.searchParams.set("company_id", companyId);
  const res = await kiwiGet(url, { allow404: true, timeoutMs });
  if (res.status === 404) throw new BulkUnsupportedError("no bulk endpoint");
  return parseBulk(await res.json());
}

const cachedAllBlocks = unstable_cache(fetchAllBlocks.bind(null), ["kiwi-blocks-all-v2"], {
  tags: [KIWI_TAG],
  revalidate: false,
});

// No fresh read of Kiwi per build or per deploy, on purpose: the Kiwi editor
// saves drafts straight into the block value before "Pubblica", so any read
// outside the publish webhook would put every saved draft online. Builds and
// regenerations use the stable key above only; new values arrive when the
// webhook marks the `kiwi` tag stale. Known gap (HANDOFF-kiwi-panel.md): the
// Vercel build doesn't find this key in its cache and reads the DB, so a
// deploy's prerender (and the static 404) can carry drafts until regenerated.

// Draft mode (Kiwi editor) skips unstable_cache: every render, and every
// router prefetch of the menu links, would read Kiwi again (the bulk endpoint
// allows 60 requests/min). Inside the editor, reads of one server instance are
// shared for a couple of seconds, and the last good answer covers a refusal
// (429/5xx), so the editor never shows the registry defaults by mistake.
const EDIT_SHARE_MS = 2000;
let editRead: { at: number; promise: Promise<BulkBlocks> } | null = null;
let lastGoodBulk: BulkBlocks | null = null;

async function inDraftMode(): Promise<boolean> {
  try {
    return (await draftMode()).isEnabled;
  } catch {
    return false; // outside a request (build worker): not the editor
  }
}

async function readAllBlocks(): Promise<BulkBlocks> {
  if (!(await inDraftMode())) return cachedAllBlocks(COMPANY_ID);
  if (!editRead || Date.now() - editRead.at > EDIT_SHARE_MS) {
    // Short timeout: the editor is waiting (the cache is skipped in draft mode).
    editRead = { at: Date.now(), promise: cachedAllBlocks(COMPANY_ID, EDIT_TIMEOUT_MS) };
  }
  try {
    return await editRead.promise;
  } catch (err) {
    editRead = null;
    if (lastGoodBulk && !(err instanceof BulkUnsupportedError)) return lastGoodBulk;
    throw err;
  }
}

/** All blocks, once per render; null if the bulk read isn't available. */
const allBlocks = cache(async (): Promise<BulkBlocks | null> => {
  if (!kiwiEnabled || Date.now() < bulkUnsupportedUntil) return null;
  try {
    // Always through unstable_cache: a no-store fetch made directly in a
    // render would turn the page dynamic (or abort its prerender). In draft
    // mode (Kiwi editor) unstable_cache skips the cache: fresh values.
    const all = await readAllBlocks();
    lastGoodBulk = all;
    // unstable_cache hands back plain JSON: restore null-prototype maps.
    return {
      blocks: Object.assign(Object.create(null), all.blocks),
      styles: Object.assign(Object.create(null), all.styles),
    };
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

/**
 * Value (normalised) + style of one block. Never throws. Once per render and
 * slug (getContent, getEntries and the editor panel read the same blocks; in
 * draft mode unstable_cache would not dedupe them).
 */
const readBlockEntry = cache(async (slug: string, group: string, def: BlockDef): Promise<BlockEntry> => {
  if (!kiwiEnabled) return { value: def.default, style: null };
  try {
    const all = await allBlocks();
    if (all && typeof all.blocks[slug] === "string") {
      return { value: finalize(def, all.blocks[slug]), style: all.styles[slug] ?? null };
    }
    // No bulk read, or a block Kiwi doesn't have yet: single get-or-create.
    const args = [COMPANY_ID, slug, def.default, def.label, group, def.type ?? "text"] as const;
    const entry = (await inDraftMode())
      ? await cachedBlockEntry(...args, EDIT_TIMEOUT_MS)
      : await cachedBlockEntry(...args); // same arguments as before = same cache key
    return { value: finalize(def, entry.value), style: entry.style };
  } catch (err) {
    if (!(err instanceof KiwiUnavailableError)) {
      console.warn(`[kiwi] block ${slug}: ${err instanceof Error ? err.message : err}`);
    }
    return { value: def.default, style: null };
  }
});

export type BlockMeta = { label?: string; group?: string; type?: BlockDef["type"] };

/**
 * One block, skill-compatible signature. Never throws: Kiwi unavailable →
 * last good value or `fallback`.
 */
export async function getBlock(slug: string, fallback: string, meta: BlockMeta = {}): Promise<string> {
  const entry = await readBlockEntry(slug, meta.group ?? "", {
    label: meta.label ?? slug,
    default: fallback,
    type: meta.type,
  });
  return entry.value;
}

export function blockSlug(page: PageDef, section: string, key: string): string {
  return `${page.id}_${section}_${key}`;
}

async function mapPage<P extends PageDef, T>(
  page: P,
  fn: (slug: string, group: string, def: BlockDef) => Promise<T>,
): Promise<Record<string, Record<string, T>>> {
  const sections = await Promise.all(
    Object.entries(page.sections).map(async ([sectionKey, section]) => {
      const values = await Promise.all(
        Object.entries(section.blocks).map(
          async ([key, def]) => [key, await fn(blockSlug(page, sectionKey, key), section.group, def)] as const,
        ),
      );
      return [sectionKey, Object.fromEntries(values)] as const;
    }),
  );
  return Object.fromEntries(sections);
}

/** Load every block of a page definition. Never throws. */
export async function getContent<P extends PageDef>(page: P): Promise<Content<P>> {
  return (await mapPage(page, async (slug, group, def) => (await readBlockEntry(slug, group, def)).value)) as Content<P>;
}

/** Same as getContent, with each block's editor style (null when none). */
export async function getEntries<P extends PageDef>(
  page: P,
): Promise<{ [S in keyof P["sections"]]: { [B in keyof P["sections"][S]["blocks"]]: BlockEntry & { slug: string; group: string; def: BlockDef } } }> {
  return (await mapPage(page, async (slug, group, def) => ({
    ...(await readBlockEntry(slug, group, def)),
    slug,
    group,
    def,
  }))) as never;
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

async function fetchCollectionItems(companyId: string, slug: string, timeoutMs?: number): Promise<KiwiItem[]> {
  const url = new URL(`${API_BASE}/api/site/collections/${encodeURIComponent(slug)}`);
  url.searchParams.set("company_id", companyId);
  url.searchParams.set("limit", "50");
  const res = await kiwiGet(url, { timeoutMs });
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
    const items = (await inDraftMode())
      ? await cachedCollectionItems(COMPANY_ID, slug, EDIT_TIMEOUT_MS)
      : await cachedCollectionItems(COMPANY_ID, slug);
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
  /**
   * Copy for the requester (the quote request's PDF summary): Kiwi emails it
   * to `email`, only when the call carries the signed visitor IP, i.e. comes
   * from this server. Texts come from the panel, never from the visitor.
   */
  requesterCopy?: { subject: string; text: string; filename: string; pdfBase64: string };
};

/**
 * stored: the lead is in the Kiwi panel. requesterCopy: what happened to the
 * copy for the requester — "unsupported" when this Kiwi doesn't know the
 * field yet (older platform: nothing was emailed), "none" when none was asked.
 */
export type KiwiContactResult = { stored: boolean; requesterCopy: "sent" | "failed" | "unsupported" | "none" };

export type KiwiVisitor = { ip: string; userAgent: string };

/**
 * The visitor's IP, signed for Kiwi (kiwi-network src/lib/site-contact-ip.ts):
 * the form posts from our server, so without it Kiwi's per-IP limit on
 * /api/site/contact (5/min) would apply to the whole site. Signature =
 * hex(HMAC-SHA256(KIWI_REVALIDATE_SECRET, ip + "." + ts + "." + company_id)).
 * No secret or no valid IP → no headers (Kiwi then behaves as before).
 */
function signedVisitorHeaders(visitor?: KiwiVisitor): Record<string, string> {
  const secret = process.env.KIWI_REVALIDATE_SECRET ?? "";
  const ip = visitor?.ip.trim() ?? "";
  if (!secret || !ip || ip.length > 45 || isIP(ip) === 0) return {};
  const ts = String(Math.floor(Date.now() / 1000));
  const sig = createHmac("sha256", secret).update(`${ip}.${ts}.${COMPANY_ID}`).digest("hex");
  const ua = (visitor?.userAgent ?? "").trim().slice(0, 300);
  return {
    "x-kiwi-client-ip": ip,
    "x-kiwi-client-ts": ts,
    "x-kiwi-client-sig": sig,
    ...(ua ? { "x-kiwi-client-ua": ua } : {}),
  };
}

/** Store a contact form submission in the Kiwi panel ("Messaggi"). Never throws. */
export async function sendKiwiContact(contact: KiwiContact, visitor?: KiwiVisitor): Promise<KiwiContactResult> {
  const { requesterCopy, ...lead } = contact;
  const asked = requesterCopy ? "failed" : "none";
  if (!kiwiEnabled) return { stored: false, requesterCopy: asked };
  try {
    const res = await fetch(`${API_BASE}/api/site/contact`, {
      method: "POST",
      cache: "no-store",
      // Kiwi sends the requester's copy (up to 2 MB) before answering: allow
      // for the email, or the visitor would read "not sent" after it went out.
      signal: AbortSignal.timeout(requesterCopy ? 20_000 : 6000),
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        ...signedVisitorHeaders(visitor),
      },
      body: JSON.stringify({
        company_id: COMPANY_ID,
        ...lead,
        ...(requesterCopy
          ? {
              requester_copy: {
                subject: requesterCopy.subject,
                text: requesterCopy.text,
                filename: requesterCopy.filename,
                pdf_base64: requesterCopy.pdfBase64,
              },
            }
          : {}),
      }),
    });
    const json = (await res.json().catch(() => null)) as
      | { success?: boolean; error?: string; requester_copy?: unknown }
      | null;
    if (!res.ok || json?.success !== true) {
      console.error("[contact] Kiwi not stored", res.status, json?.error ?? "<no body>");
      return { stored: false, requesterCopy: asked };
    }
    if (!requesterCopy) return { stored: true, requesterCopy: "none" };
    const copy = json.requester_copy;
    if (copy === "sent") return { stored: true, requesterCopy: "sent" };
    if (copy === undefined) return { stored: true, requesterCopy: "unsupported" };
    console.warn("[contact] Kiwi did not email the requester's copy:", String(copy).slice(0, 60));
    return { stored: true, requesterCopy: "failed" };
  } catch (err) {
    console.error("[contact] Kiwi unreachable", err instanceof Error ? err.name : err);
    return { stored: false, requesterCopy: asked };
  }
}
