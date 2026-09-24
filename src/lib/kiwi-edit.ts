import "server-only";
import { cache } from "react";
import type { CSSProperties } from "react";
import { cookies, draftMode } from "next/headers";
import { getEntries } from "@/lib/kiwi";
import type { BlockDef, PageDef } from "@/content/types";
import type { Lang } from "@/lib/i18n";

/**
 * Kiwi editor (edit-in-place) — server side.
 *
 * The Kiwi editor loads the real site in an iframe with a short-lived JWT
 * (`?kiwi_edit=1&token=`, HS256, KIWI_EDIT_SHARED_SECRET shared with Kiwi).
 * src/proxy.ts hands the token to /api/kiwi-edit/init, which checks it and
 * turns on Next's draft mode + the `kiwi_edit_token` cookie. Only then:
 *  - pages render per request (draft mode) with fresh Kiwi content;
 *  - editable elements carry the `data-kiwi-*` attributes read by the
 *    overlay (src/components/KiwiEditOverlay.tsx);
 *  - the overlay is mounted.
 *
 * For every visitor nothing changes: draftMode() does not make a static page
 * dynamic, the attribute helpers return {} (or only the editor's saved
 * style, if any), and nothing edit-related is sent to the browser. Without
 * the secret the whole feature is a no-op.
 */

const SECRET = process.env.KIWI_EDIT_SHARED_SECRET ?? "";
const COMPANY_ID = (process.env.KIWI_COMPANY_ID ?? "").trim().toLowerCase();
export const EDIT_COOKIE = "kiwi_edit_token";
export const editModeConfigured = SECRET.length > 0 && COMPANY_ID.length > 0;

export type EditPayload = { companyId: string; userId: string; projectId: string; iat: number; exp: number };

function b64UrlDecode(input: string): Uint8Array {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  const raw = atob((input + pad).replace(/-/g, "+").replace(/_/g, "/"));
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

/** Verify a Kiwi edit JWT (same format as kiwi-network src/lib/kiwiweb-edit-token.ts). */
export async function verifyEditToken(token: string | undefined | null): Promise<EditPayload | null> {
  if (!editModeConfigured || !token || typeof token !== "string" || token.length > 4096) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, sigB64] = parts;
  try {
    const header = JSON.parse(new TextDecoder().decode(b64UrlDecode(headerB64))) as { alg?: string; typ?: string };
    if (header.alg !== "HS256" || header.typ !== "JWT") return null;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", enc.encode(SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    // crypto.subtle.verify compares in constant time.
    const ok = await crypto.subtle.verify(
      "HMAC",
      key,
      b64UrlDecode(sigB64) as BufferSource,
      enc.encode(`${headerB64}.${payloadB64}`) as BufferSource,
    );
    if (!ok) return null;
    const payload = JSON.parse(new TextDecoder().decode(b64UrlDecode(payloadB64))) as EditPayload;
    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.exp !== "number" || payload.exp < now - 5) return null;
    if (typeof payload.iat !== "number" || payload.iat > now + 60) return null;
    if (!payload.userId || !payload.projectId) return null;
    if (String(payload.companyId ?? "").toLowerCase() !== COMPANY_ID) return null;
    return payload;
  } catch {
    return null;
  }
}

/**
 * True only inside the Kiwi editor: draft mode on AND a valid edit token.
 * cookies() is read only when draft mode is already on, so static pages
 * stay static for visitors.
 */
export const isEditing = cache(async (): Promise<boolean> => {
  if (!editModeConfigured) return false;
  const dm = await draftMode();
  if (!dm.isEnabled) return false;
  const token = (await cookies()).get(EDIT_COOKIE)?.value;
  return (await verifyEditToken(token)) !== null;
});

/* ---------------------------------------------------------------- */
/* Attributes for editable elements                                   */
/* ---------------------------------------------------------------- */

const STYLE_KEYS = [
  "fontSize",
  "fontFamily",
  "color",
  "textAlign",
  "fontWeight",
  "fontStyle",
  "textDecoration",
  "lineHeight",
  "letterSpacing",
  "textTransform",
  "backgroundColor",
] as const;
const STYLE_VALUE_RE = /^[#(),.%\-\w\s'"]{1,80}$/;

/** Editor toolbar style (Kiwi `style_overrides`) → safe inline style. */
export function toStyle(style: Record<string, unknown> | null | undefined): CSSProperties | null {
  if (!style) return null;
  const out: Record<string, string> = {};
  for (const k of STYLE_KEYS) {
    const v = style[k];
    if (typeof v === "string" && STYLE_VALUE_RE.test(v.trim())) out[k] = v.trim();
  }
  return Object.keys(out).length ? (out as CSSProperties) : null;
}

export type EditAttrs = { style?: CSSProperties } & { [key: `data-${string}`]: string };

function attrsFor(
  editing: boolean,
  entry: { slug: string; group: string; def: BlockDef; style: Record<string, unknown> | null },
): EditAttrs {
  const style = toStyle(entry.style);
  const attrs: EditAttrs = style ? { style } : {};
  if (!editing) return attrs;
  attrs["data-kiwi-block"] = entry.slug;
  attrs["data-kiwi-type"] = entry.def.type ?? "text";
  attrs["data-kiwi-label"] = entry.def.label;
  attrs["data-kiwi-group"] = entry.group;
  // The layout is designed to the pixel: edit texts and swap images, no
  // dragging or resizing (the overlay honours this attribute).
  attrs["data-kiwi-no-drag"] = "1";
  if (style) attrs["data-kiwi-style-overrides"] = JSON.stringify(style);
  return attrs;
}

export type EditMap<P extends PageDef> = {
  [S in keyof P["sections"]]: { [B in keyof P["sections"][S]["blocks"]]: EditAttrs };
};

/**
 * Attributes to spread on the element that renders each block:
 * `<h1 {...e.hero.title}>{hero.title}</h1>`. Visitors get {} (or the saved
 * editor style); inside the editor, the data-kiwi-* markers.
 */
export async function getEdit<P extends PageDef>(page: P, lang: Lang = "en"): Promise<EditMap<P>> {
  const [editing, entries] = await Promise.all([isEditing(), getEntries(page, lang)]);
  const out: Record<string, Record<string, EditAttrs>> = {};
  for (const [section, blocks] of Object.entries(entries as Record<string, Record<string, Parameters<typeof attrsFor>[1]>>)) {
    out[section] = {};
    for (const [key, entry] of Object.entries(blocks)) out[section][key] = attrsFor(editing, entry);
  }
  return out as EditMap<P>;
}

/** Same map for client components: undefined for visitors without styles (keeps the RSC payload lean). */
export async function getEditForClient<P extends PageDef>(page: P, lang: Lang = "en"): Promise<EditMap<P> | undefined> {
  const map = await getEdit(page, lang);
  const hasAny = Object.values(map as Record<string, Record<string, EditAttrs>>).some((s) =>
    Object.values(s).some((a) => Object.keys(a).length > 0),
  );
  return hasAny ? map : undefined;
}

/** Every block of the given pages, for the editor's "hidden fields" panel. */
export async function getEditorFields(pages: PageDef[], lang: Lang = "en") {
  const lists = await Promise.all(
    pages.map(async (page) => {
      const entries = (await getEntries(page, lang)) as Record<string, Record<string, Parameters<typeof attrsFor>[1] & { value: string }>>;
      return Object.values(entries).flatMap((section) =>
        Object.values(section).map((e) => ({
          slug: e.slug,
          label: e.def.label,
          group: e.group,
          type: e.def.type ?? "text",
          value: e.value,
        })),
      );
    }),
  );
  return lists.flat();
}
