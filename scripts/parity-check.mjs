#!/usr/bin/env node
// Markup parity check: compares the HTML of the local build (`npm run build`
// first) with a live site, page by page, after normalising what legitimately
// differs between two builds (script/chunk hashes, RSC payload, preload links).
// What is compared: every tag, class, attribute and text of <body>, plus the
// SEO tags of <head> and the JSON-LD.
//
//   node scripts/parity-check.mjs                    (vs https://www.enfrio.it)
//   node scripts/parity-check.mjs https://preview-url  (local build vs that site)
//   node scripts/parity-check.mjs https://preview-url https://www.enfrio.it
//                                   (two live sites: the first one takes the place of the local build;
//                                    PARITY_COOKIE="_vercel_jwt=..." is sent to it, for a protected preview)
//
// Exit code 1 when any page differs, or when a JSON-LD block of the checked build
// contains a raw "<" or is not valid JSON (a "</script" from a panel value
// would close the tag); the diffs are written to .parity/.
import fs from "node:fs";
import path from "node:path";

const trim = (u) => u.replace(/\/+$/, "");
const SITE = process.argv[3] ? trim(process.argv[2]) : null;
const BASE = trim(process.argv[3] ?? process.argv[2] ?? "https://www.enfrio.it");
const COOKIE = process.env.PARITY_COOKIE ?? "";
const APP = path.join(process.cwd(), ".next", "server", "app");
const OUT = path.join(process.cwd(), ".parity");
const PAGES = [
  ["", "index.html"],
  ["solutions", "solutions.html"],
  ["technology", "technology.html"],
  ["tower-m", "tower-m.html"],
  ["industries", "industries.html"],
  ["projects", "projects.html"],
  ["company", "company.html"],
  ["contact", "contact.html"],
  ["qhse", "qhse.html"],
  ["legal", "legal.html"],
  ["this-page-does-not-exist", "_not-found.html"],
];

function normalize(html) {
  const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] ?? "";
  const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/)?.[1] ?? "";
  const keep = [];
  const tagRe = /<(title)>([\s\S]*?)<\/title>|<(meta|link)\b([^>]*)\/?>/g;
  let m;
  while ((m = tagRe.exec(head))) {
    if (m[1]) keep.push(`<title>${m[2]}</title>`);
    else {
      const attrs = m[4];
      if (m[3] === "link" && /rel="(stylesheet|preload|expect)"/.test(attrs)) continue;
      if (/charSet|name="next-size-adjust"/.test(attrs)) continue;
      keep.push(`<${m[3]}${attrs.replace(/\s+$/, "")}>`);
    }
  }
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((x) => `LDJSON ${x[1]}`);
  const b = body
    .replace(/<script\b[\s\S]*?<\/script>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\/_next\/static\/[^"')\s]+/g, "/_next/static/HASH")
    .replace(/ data-precedence="[^"]*"/g, "")
    .replace(/<link [^>]*>/g, "")
    .replace(/<br\s*\/?>/g, "<br/>")
    .replace(/></g, ">\n<");
  return [...keep, ...ld, "----BODY----", b].join("\n").split("\n");
}

fs.mkdirSync(OUT, { recursive: true });
let failed = 0;
for (const [route, file] of PAGES) {
  const local = path.join(APP, file);
  if (!SITE && !fs.existsSync(local)) {
    console.log(`${route || "/"}: MISSING local ${file}`);
    failed++;
    continue;
  }
  const remote = await (await fetch(`${BASE}/${route}`)).text();
  const a = normalize(remote);
  const candidate = SITE
    ? await (await fetch(`${SITE}/${route}`, { headers: COOKIE ? { cookie: COOKIE } : {} })).text()
    : fs.readFileSync(local, "utf8");
  const b = normalize(candidate);
  for (const [, json] of candidate.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let ok = !json.includes("<");
    try {
      JSON.parse(json);
    } catch {
      ok = false;
    }
    if (!ok) {
      console.log(`${route || "/"}: UNSAFE or invalid JSON-LD: ${json.slice(0, 120)}`);
      failed++;
    }
  }
  const diff = [];
  const n = Math.max(a.length, b.length);
  for (let i = 0; i < n; i++) if (a[i] !== b[i]) diff.push(`@${i}\n- ${a[i] ?? ""}\n+ ${b[i] ?? ""}`);
  console.log(`${(route || "/").padEnd(26)} ${diff.length === 0 ? "identical" : `${diff.length} differing lines`}`);
  if (diff.length) {
    failed++;
    fs.writeFileSync(path.join(OUT, `${route || "home"}.diff`), diff.join("\n"));
  }
}
process.exit(failed ? 1 : 0);
