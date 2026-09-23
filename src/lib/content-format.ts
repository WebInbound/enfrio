// Helpers to turn block values (plain strings from the Kiwi panel) into what
// the components render. Isomorphic: no server-only imports.

/**
 * "12000 kW" → { value: 12000, suffix: " kW" } for <AnimatedNumber>.
 * Returns null when the text doesn't start with a number, so the caller can
 * render it as plain text instead of animating it.
 */
export function parseStat(text: string): { value: number; suffix: string } | null {
  const m = /^\s*([-−]?\d+(?:[.,]\d+)*)([\s\S]*)$/.exec(text);
  if (!m) return null;
  const value = parseNumberToken(m[1]);
  if (!Number.isFinite(value)) return null;
  return { value, suffix: m[2] };
}

/**
 * "12,000" / "1.500" (thousands) → 12000 / 1500; "0,85" / "1.5" → decimals.
 * A separator followed by exactly three digits is read as thousands.
 */
function parseNumberToken(token: string): number {
  const t = token.replace("−", "-");
  if (/^-?\d{1,3}([.,]\d{3})+$/.test(t)) return Number(t.replace(/[.,]/g, ""));
  if (/^-?\d+([.,]\d+)?$/.test(t)) return Number(t.replace(",", "."));
  return NaN;
}

/**
 * Numeric coefficient from a block: decimal comma or point ("0,85" / "0.85"),
 * no thousands separators. Out of range or invalid → fallback.
 */
export function toNumber(text: string, fallback: number, opts: { min?: number; max?: number } = {}): number {
  const t = String(text).trim().replace(/\s/g, "").replace("−", "-");
  const n = /^-?\d+([.,]\d+)?$/.test(t) ? Number(t.replace(",", ".")) : NaN;
  if (!Number.isFinite(n)) return fallback;
  if (opts.min !== undefined && n < opts.min) return fallback;
  if (opts.max !== undefined && n > opts.max) return fallback;
  return n;
}

/** Replace {name} placeholders in a plain-text block. */
export function fill(text: string, vars: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? vars[k] : m));
}

/** Lines of a multi-line block, trimmed, empties dropped. */
export function lines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const RICH_TAGS = new Set(["strong", "b", "em", "i", "br", "a"]);
const SAFE_HREF_RE = /^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i;

/**
 * Minimal allow-list sanitiser for richtext blocks (defence in depth: Kiwi
 * already sanitises on write and on read). Keeps strong/b/em/i/br and links
 * with a safe href; drops every other tag and attribute.
 */
export function sanitizeRich(html: string): string {
  return html
    .replace(/<\s*(script|style|iframe|object|embed|svg|math|template)\b[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\s*(\/?)\s*([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g, (_m, close: string, rawTag: string, attrs: string) => {
      const tag = rawTag.toLowerCase();
      if (!RICH_TAGS.has(tag)) return "";
      if (close) return tag === "br" ? "" : `</${tag}>`;
      if (tag === "br") return "<br/>";
      if (tag !== "a") return `<${tag}>`;
      const href = /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)')/i.exec(attrs);
      const value = (href?.[1] ?? href?.[2] ?? "").trim();
      if (!value || !SAFE_HREF_RE.test(value)) return "<a>";
      const blank = /\btarget\s*=\s*["']_blank["']/i.test(attrs);
      return `<a href="${escapeHtml(value)}"${blank ? ' target="_blank" rel="noopener noreferrer"' : ""}>`;
    });
}

/** Richtext block → sanitized HTML, with {placeholders} filled (escaped). */
export function richHtml(text: string, vars: Record<string, string> = {}): { __html: string } {
  const filled = text.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? escapeHtml(vars[k]) : m));
  return { __html: sanitizeRich(filled) };
}
