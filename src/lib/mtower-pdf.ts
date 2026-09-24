import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFImage, type PDFPage } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import sharp from "sharp";

// PDF summary of an M Tower quote request (proposal KW-2026-002, A.5): one A4
// page with the Enfrio brand, the design inputs, the sized build and the
// "indicative" disclaimer. Every text comes from the Kiwi panel; nothing the
// visitor typed is printed (the same file is emailed to the address they gave).

export type QuotePdfRow = { label: string; value: string };

export type QuotePdfData = {
  title: string;
  refLabel: string;
  ref: string;
  dateLabel: string;
  date: string;
  buildKicker: string;
  units: number;
  unitsLabel: string;
  spare: string | null;
  buildLine: string;
  statusLine: string;
  inputsTitle: string;
  inputs: QuotePdfRow[];
  resultsTitle: string;
  results: QuotePdfRow[];
  nextTitle: string;
  nextText: string;
  disclaimer: string;
  footer: string;
  /** Panel image values: a site path ("/assets/...") or a Kiwi storage URL. */
  logo: string;
  render: string;
};

const BRAND = rgb(0xad / 255, 0xd9 / 255, 0x34 / 255);
const BRAND_DEEP = rgb(0x7f / 255, 0x9f / 255, 0x22 / 255);
const NAVY = rgb(0x07 / 255, 0x0f / 255, 0x19 / 255);
const NAVY_2 = rgb(0x0b / 255, 0x16 / 255, 0x23 / 255);
const INK = rgb(0.1, 0.13, 0.17);
const MUTED = rgb(0.4, 0.44, 0.49);
const RULE = rgb(0.84, 0.86, 0.89);
const PANEL = rgb(0.94, 0.95, 0.96);
const WHITE = rgb(1, 1, 1);
const NAVY_HEX = "#070f19";

const ASSETS = path.join(process.cwd(), "src", "assets", "pdf");
const PUBLIC = path.join(process.cwd(), "public");
const LOCAL_IMAGE_RE = /^\/assets\/[\w\-/.]+\.(png|jpe?g|webp)$/i;
const KIWI_STORAGE_RE = /^https:\/\/qvswzthlruowjjlxioas\.supabase\.co\/storage\/v1\/object\/public\/[^\s"'<>]+$/i;
const MAX_REMOTE_BYTES = 8 * 1024 * 1024;

/** Image bytes of a panel value; the default file when it can't be read. */
async function imageBytes(value: string, fallback: string): Promise<Buffer> {
  const v = value.trim();
  if (LOCAL_IMAGE_RE.test(v) && !v.includes("..")) {
    try {
      return await readFile(path.join(PUBLIC, v));
    } catch {
      /* fall through to the default */
    }
  } else if (KIWI_STORAGE_RE.test(v)) {
    try {
      const res = await fetch(v, { signal: AbortSignal.timeout(4000), cache: "no-store" });
      const len = Number(res.headers.get("content-length") ?? 0);
      if (res.ok && len <= MAX_REMOTE_BYTES) {
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length <= MAX_REMOTE_BYTES) return buf;
      }
    } catch {
      /* fall through to the default */
    }
  }
  return readFile(path.join(PUBLIC, fallback));
}

/**
 * Flattened onto the background it sits on and shrunk: a JPEG of a few tens
 * of KB instead of the site's full-size PNGs (the PDF travels by email).
 */
async function flat(bytes: Buffer, background: string, height: number): Promise<Buffer> {
  return sharp(bytes)
    .flatten({ background })
    .resize({ height, withoutEnlargement: true })
    .jpeg({ quality: 84, mozjpeg: true })
    .toBuffer();
}

// Characters a font can't draw (a "≈" typed in the panel) would make pdf-lib
// throw: replace them, so a panel text can never break the PDF.
const SUBSTITUTES: Record<string, string> = { "≈": "~", "→": "->", "←": "<-", "−": "-", "≤": "<=", "≥": ">=" };
function drawable(font: PDFFont, text: string): string {
  const set = new Set(font.getCharacterSet());
  let out = "";
  for (const ch of text.replace(/\r/g, "")) {
    const cp = ch.codePointAt(0) ?? 0;
    if (ch === "\n" || set.has(cp)) out += ch;
    else {
      const sub = SUBSTITUTES[ch];
      out += sub && [...sub].every((c) => set.has(c.codePointAt(0) ?? 0)) ? sub : "?";
    }
  }
  return out;
}

function wrap(font: PDFFont, text: string, size: number, width: number): string[] {
  const lines: string[] = [];
  for (const para of drawable(font, text).split("\n")) {
    let line = "";
    for (const word of para.split(/\s+/).filter(Boolean)) {
      const next = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(next, size) <= width || !line) line = next;
      else {
        lines.push(line);
        line = word;
      }
    }
    lines.push(line);
  }
  return lines;
}

type Fonts = { head: PDFFont; headBold: PDFFont; body: PDFFont; bodyBold: PDFFont; mono: PDFFont };

// Rajdhani has no "²" and a thin "°": those (and anything else it can't draw)
// go out in Helvetica, the rest in the brand font.
// Keyed by font instance: each PDF has its own fonts (concurrent requests on
// the same server instance never share one).
const FALLBACK_CHARS = new Set(["°", "²", "³"]);
const fallbackOf = new WeakMap<PDFFont, PDFFont>();

type Run = { font: PDFFont; text: string };
function runs(font: PDFFont, s: string): Run[] {
  const fb = fallbackOf.get(font);
  if (!fb) return [{ font, text: drawable(font, s) }];
  const own = new Set(font.getCharacterSet());
  const out: Run[] = [];
  for (const ch of s) {
    const useFb = FALLBACK_CHARS.has(ch) || !own.has(ch.codePointAt(0) ?? 0);
    const f = useFb ? fb : font;
    const last = out[out.length - 1];
    if (last && last.font === f) last.text += ch;
    else out.push({ font: f, text: ch });
  }
  return out.map((r) => ({ font: r.font, text: drawable(r.font, r.text) }));
}

function widthOf(font: PDFFont, s: string, size: number): number {
  return runs(font, s).reduce((w, r) => w + r.font.widthOfTextAtSize(r.text, size), 0);
}

function text(page: PDFPage, font: PDFFont, s: string, x: number, y: number, size: number, color = INK) {
  let cx = x;
  for (const r of runs(font, s)) {
    page.drawText(r.text, { x: cx, y, size, font: r.font, color });
    cx += r.font.widthOfTextAtSize(r.text, size);
  }
}

function textRight(page: PDFPage, font: PDFFont, s: string, right: number, y: number, size: number, color = INK) {
  text(page, font, s, right - widthOf(font, s, size), y, size, color);
}

/** Label/value rows with hairlines; returns the y below the table. */
function table(page: PDFPage, f: Fonts, title: string, rows: QuotePdfRow[], x: number, y: number, w: number): number {
  text(page, f.headBold, title.toUpperCase(), x, y, 10, BRAND_DEEP);
  y -= 10;
  page.drawLine({ start: { x, y }, end: { x: x + w, y }, thickness: 1, color: BRAND });
  for (const row of rows) {
    y -= 22;
    text(page, f.body, row.label, x, y + 2, 8.5, MUTED);
    textRight(page, f.headBold, row.value, x + w, y + 1, 12.5, INK);
    y -= 8;
    page.drawLine({ start: { x, y }, end: { x: x + w, y }, thickness: 0.5, color: RULE });
  }
  return y;
}

/** Up to five module renders side by side, "+N" for the rest. */
function moduleBank(page: PDFPage, f: Fonts, img: PDFImage, units: number, x: number, y: number, w: number, h: number) {
  const shown = Math.min(units, 5);
  const gap = 10;
  const extra = units - shown;
  const extraW = extra > 0 ? 44 : 0;
  const ratio = img.width / img.height;
  const maxW = (w - extraW - gap * (shown - 1)) / shown;
  const iw = Math.min(maxW, h * ratio);
  const ih = iw / ratio;
  const total = shown * iw + gap * (shown - 1) + extraW;
  let cx = x + (w - total) / 2;
  const cy = y + (h - ih) / 2;
  for (let i = 0; i < shown; i++) {
    page.drawImage(img, { x: cx, y: cy, width: iw, height: ih });
    cx += iw + gap;
  }
  if (extra > 0) text(page, f.headBold, `+${extra}`, cx, cy + ih / 2 - 8, 22, BRAND);
}

export async function buildQuotePdf(d: QuotePdfData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  doc.setTitle(`${d.title} ${d.ref}`);
  doc.setAuthor("Enfrio Srl");
  doc.setSubject(d.title);
  doc.setCreator("www.enfrio.it");
  doc.setProducer("Kiwi Network");

  const [semi, bold, logoRaw, renderRaw] = await Promise.all([
    readFile(path.join(ASSETS, "Rajdhani-SemiBold.ttf")),
    readFile(path.join(ASSETS, "Rajdhani-Bold.ttf")),
    imageBytes(d.logo, "/assets/images/logo-enfrio.png"),
    imageBytes(d.render, "/assets/images/site/mtower-render.png"),
  ]);
  const [logoJpg, renderJpg] = await Promise.all([flat(logoRaw, "#ffffff", 180), flat(renderRaw, NAVY_HEX, 520)]);

  const f: Fonts = {
    head: await doc.embedFont(semi, { subset: true }),
    headBold: await doc.embedFont(bold, { subset: true }),
    body: await doc.embedFont(StandardFonts.Helvetica),
    bodyBold: await doc.embedFont(StandardFonts.HelveticaBold),
    mono: await doc.embedFont(StandardFonts.Courier),
  };
  fallbackOf.set(f.head, f.bodyBold);
  fallbackOf.set(f.headBold, f.bodyBold);
  const logo = await doc.embedJpg(logoJpg);
  const render = await doc.embedJpg(renderJpg);

  const page = doc.addPage([595.28, 841.89]);
  const W = page.getWidth();
  const M = 40;
  const CW = W - M * 2;

  // Header: logo, title, reference and date.
  let y = 841.89 - M;
  const logoH = 40;
  const logoW = (logo.width / logo.height) * logoH;
  page.drawImage(logo, { x: M, y: y - logoH, width: logoW, height: logoH });
  textRight(page, f.headBold, d.title.toUpperCase(), W - M, y - 14, 15, NAVY);
  textRight(page, f.body, `${d.refLabel}  ${d.ref}     ${d.dateLabel}  ${d.date}`, W - M, y - 32, 9, MUTED);
  y -= logoH + 14;
  page.drawRectangle({ x: M, y, width: CW, height: 2.5, color: BRAND });

  // Build card: navy band with the module count and the renders.
  const cardH = 268;
  y -= 18 + cardH;
  page.drawRectangle({ x: M, y, width: CW, height: cardH, color: NAVY });
  page.drawRectangle({ x: M, y, width: CW, height: 34, color: NAVY_2 });
  const tx = M + 24;
  text(page, f.headBold, d.buildKicker.toUpperCase(), tx, y + cardH - 34, 10, BRAND);
  const big = String(d.units);
  text(page, f.headBold, big, tx, y + cardH - 108, 66, BRAND);
  const bigW = widthOf(f.headBold, big, 66);
  text(page, f.head, d.unitsLabel.toUpperCase(), tx + bigW + 10, y + cardH - 104, 15, WHITE);
  let ly = y + cardH - 132;
  for (const line of wrap(f.body, d.buildLine, 10, 190)) {
    text(page, f.body, line, tx, ly, 10, rgb(0.8, 0.84, 0.88));
    ly -= 14;
  }
  if (d.spare) text(page, f.body, d.spare, tx, ly - 2, 9, BRAND);
  page.drawCircle({ x: tx + 3, y: y + 17, size: 3, color: BRAND });
  text(page, f.mono, d.statusLine.toUpperCase(), tx + 12, y + 14, 8.5, BRAND);
  moduleBank(page, f, render, d.units, M + 240, y + 44, CW - 260, cardH - 60);

  // Inputs and results, two columns.
  y -= 34;
  const colW = (CW - 28) / 2;
  const yInputs = table(page, f, d.inputsTitle, d.inputs, M, y, colW);
  const yResults = table(page, f, d.resultsTitle, d.results, M + colW + 28, y, colW);
  y = Math.min(yInputs, yResults) - 28;

  // What happens next.
  const nextLines = wrap(f.body, d.nextText, 9.5, CW - 32);
  const boxH = 34 + nextLines.length * 13;
  y -= boxH;
  page.drawRectangle({ x: M, y, width: CW, height: boxH, color: PANEL });
  page.drawRectangle({ x: M, y, width: 3, height: boxH, color: BRAND });
  text(page, f.headBold, d.nextTitle.toUpperCase(), M + 16, y + boxH - 18, 10, NAVY);
  let ny = y + boxH - 34;
  for (const line of nextLines) {
    text(page, f.body, line, M + 16, ny, 9.5, INK);
    ny -= 13;
  }

  // Disclaimer and company footer at the bottom of the page.
  const footLines = wrap(f.body, d.footer, 7.5, CW);
  let fy = M - 4 + footLines.length * 10;
  const discLines = wrap(f.body, d.disclaimer, 7.5, CW);
  let dy = fy + 14 + discLines.length * 10;
  for (const line of discLines) {
    text(page, f.body, line, M, dy, 7.5, MUTED);
    dy -= 10;
  }
  page.drawLine({ start: { x: M, y: fy + 10 }, end: { x: W - M, y: fy + 10 }, thickness: 0.5, color: RULE });
  for (const line of footLines) {
    text(page, f.body, line, M, fy, 7.5, MUTED);
    fy -= 10;
  }
  page.drawRectangle({ x: 0, y: 0, width: W, height: 6, color: BRAND });

  return doc.save();
}
