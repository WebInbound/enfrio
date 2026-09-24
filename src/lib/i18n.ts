// Languages of the site (proposal KW-2026-002, A.6): English at the root
// ("/tower-m"), Italian under "/it" ("/it/tower-m"). English is the original
// and the fallback: an Italian text missing from the panel shows the English
// one. Isomorphic: no server-only imports.

export type Lang = "en" | "it";

export const LANGS: readonly Lang[] = ["en", "it"];

export function isLang(v: unknown): v is Lang {
  return v === "en" || v === "it";
}

/** "/tower-m#x" → "/it/tower-m#x" for Italian; English paths are unchanged. */
export function localePath(lang: Lang, path: string): string {
  if (lang === "en") return path;
  if (path === "/" || path === "") return "/it";
  if (/^[?#]/.test(path)) return `/it${path}`;
  return `/it${path.startsWith("/") ? path : `/${path}`}`;
}

/** Number formatting of the site: "3,000" in English, "3.000" in Italian. */
export function numberLocale(lang: Lang): string {
  return lang === "it" ? "it-IT" : "en-US";
}

/** Open Graph locale. */
export function ogLocale(lang: Lang): string {
  return lang === "it" ? "it_IT" : "en_US";
}

/**
 * Italian slugs in the Kiwi panel: the English slug with this prefix. Images,
 * links, numbers and company data have no Italian copy (shared).
 */
export const IT_SLUG_PREFIX = "it_";
/** Panel group of the Italian texts: "Italiano › Home › 1. Hero". */
export const IT_GROUP_PREFIX = "Italiano › ";
