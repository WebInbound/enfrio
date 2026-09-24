#!/usr/bin/env node
// Builds the SQL that registers every editable text/image of the site in the
// Kiwi panel (web_static_blocks) and the lists as collections
// (web_content_collections + web_content_items), from src/content/*.ts.
//
//   node scripts/kiwi-seed-sql.mjs > seed.sql        (Node >= 22.18: loads .ts natively)
//   node scripts/kiwi-seed-sql.mjs --check            (prints counts per group only)
//
// Idempotent: a block edited by the client keeps its value; label, group,
// type and default are refreshed, and an untouched block follows the new
// default. Collection items are inserted only into an empty collection.
// Every row is scoped to the Enfrio company_id.
//
//   node scripts/kiwi-seed-sql.mjs --part 1           (one statement group per call)

import { GLOBAL, NOT_FOUND } from "../src/content/global.ts";
import { HOME } from "../src/content/home.ts";
import { SOLUTIONS } from "../src/content/solutions.ts";
import { TECHNOLOGY } from "../src/content/technology.ts";
import { INDUSTRIES } from "../src/content/industries.ts";
import { PROJECTS_PAGE } from "../src/content/projects.ts";
import { COMPANY } from "../src/content/company.ts";
import { CONTACT, CONTACT_FORM } from "../src/content/contact.ts";
import { QHSE } from "../src/content/qhse.ts";
import { LEGAL } from "../src/content/legal.ts";
import { TOWER_M, SIZER, QUOTE } from "../src/content/tower-m.ts";
import { COLLECTIONS } from "../src/content/collections.ts";

const COMPANY_ID = "9f5b766d-d5f6-4f0d-8195-da13dd435aac"; // Enfrio Srl
const SITE = "https://www.enfrio.it";

const PAGES = [GLOBAL, NOT_FOUND, HOME, SOLUTIONS, TECHNOLOGY, INDUSTRIES, PROJECTS_PAGE, COMPANY, CONTACT, CONTACT_FORM, QHSE, LEGAL, TOWER_M, SIZER, QUOTE];

// SQL string literal, pure ASCII: E'...' with \uXXXX escapes for anything
// outside printable ASCII (non-breaking spaces, arrows, "›" ...), so the SQL
// survives copy/paste into any console unchanged.
const q = (v) => {
  if (v === null) return "null";
  const body = String(v).replace(/[\\'\u0000-\u001f\u007f-\uffff]/g, (ch) => {
    if (ch === "\\") return "\\\\";
    if (ch === "'") return "''";
    return "\\u" + ch.charCodeAt(0).toString(16).padStart(4, "0");
  });
  return body.includes("\\") ? `E'${body}'` : `'${body}'`;
};
// Local paths are stored as absolute URLs so the panel can preview them; the
// site maps them back to the same local path.
const abs = (type, v) => ((type === "image" || type === "url") && v.startsWith("/") ? SITE + v : v);

// --page <id>: only the blocks of that registry (e.g. "quote"), no collections.
const pageArg = process.argv.indexOf("--page");
const onlyPage = pageArg > 0 ? process.argv[pageArg + 1] : null;
if (onlyPage && !PAGES.some((p) => p.id === onlyPage)) throw new Error(`no registry with id ${onlyPage}`);

const rows = [];
const slugs = new Set();
for (const page of PAGES) {
  if (onlyPage && page.id !== onlyPage) continue;
  for (const [sectionKey, section] of Object.entries(page.sections)) {
    for (const [key, def] of Object.entries(section.blocks)) {
      const slug = `${page.id}_${sectionKey}_${key}`;
      if (!/^[a-z0-9_]{1,80}$/.test(slug)) throw new Error(`invalid slug: ${slug}`);
      if (slugs.has(slug)) throw new Error(`duplicate slug: ${slug}`);
      slugs.add(slug);
      const type = def.type ?? "text";
      const value = abs(type, def.default);
      rows.push({ slug, type, value, label: def.label, group: section.group });
    }
  }
}

if (process.argv.includes("--check")) {
  const byGroup = {};
  for (const r of rows) byGroup[r.group] = (byGroup[r.group] ?? 0) + 1;
  for (const [g, n] of Object.entries(byGroup).sort()) console.log(String(n).padStart(4), g);
  console.log(String(rows.length).padStart(4), "TOTAL blocks");
  for (const c of COLLECTIONS) console.log(String(c.items.length).padStart(4), `collection ${c.slug}`);
  process.exit(0);
}

// --part N (1-based) prints only the Nth statement group, for SQL consoles
// with a size limit; without it everything is printed in one transaction.
const partArg = process.argv.indexOf("--part");
const part = partArg > 0 ? Number(process.argv[partArg + 1]) : 0;

const statements = [];
const CHUNK = 170;
const groupNames = [...new Set(rows.map((r) => r.group))];
for (let i = 0; i < rows.length; i += CHUNK) {
  const chunk = rows.slice(i, i + CHUNK);
  const used = [...new Set(chunk.map((r) => r.group))];
  const groups = used.map((g) => `(${groupNames.indexOf(g)}, ${q(g)})`).join(",\n");
  const values = chunk
    .map((r) => `(${q(r.slug)}, ${q(r.value)}, ${q(r.type)}, ${q(r.label)}, ${groupNames.indexOf(r.group)})`)
    .join(",\n");
  statements.push(`with g(k, name) as (values
${groups}
), v(slug, value, type, label, gk) as (values
${values}
)
insert into public.web_static_blocks (company_id, slug, value, default_value, field_type, label, group_name)
select '${COMPANY_ID}'::uuid, v.slug, v.value, v.value, v.type, v.label, g.name from v join g on g.k = v.gk
on conflict (company_id, slug) do update set
  -- value follows the new default only if nobody ever edited the block
  value = case
    when web_static_blocks.updated_by is null
      and web_static_blocks.last_user_edit_at is null
      and web_static_blocks.value = web_static_blocks.default_value
    then excluded.value
    else web_static_blocks.value
  end,
  label = excluded.label,
  group_name = excluded.group_name,
  field_type = excluded.field_type,
  default_value = excluded.default_value;`);
}

const collectionSql = [];
COLLECTIONS.forEach((c, idx) => {
  collectionSql.push(`insert into public.web_content_collections (company_id, slug, label, singular_label, site_path, display_order, active)
values (${q(COMPANY_ID)}, ${q(c.slug)}, ${q(c.label)}, ${q(c.singular)}, ${q(c.sitePath)}, ${idx + 1}, true)
on conflict (company_id, slug) do update set label = excluded.label, singular_label = excluded.singular_label, site_path = excluded.site_path;`);
  const items = c.items
    .map(
      (it, i) =>
        `('${COMPANY_ID}'::uuid, ${q(c.slug)}, ${q(it.title)}, ${q(it.body ?? null)}, ${q(SITE + it.image)}, ${q(JSON.stringify({ alt: it.alt }))}::jsonb, true, ${i})`,
    )
    .join(",\n");
  collectionSql.push(`insert into public.web_content_items (company_id, collection_slug, title, body, image_url, metadata, published, display_order)
select * from (values
${items}
) as v(company_id, collection_slug, title, body, image_url, metadata, published, display_order)
where not exists (select 1 from public.web_content_items w where w.company_id = ${q(COMPANY_ID)} and w.collection_slug = ${q(c.slug)});`);
});
if (!onlyPage) statements.push(collectionSql.join("\n\n"));

if (part > 0) {
  if (!statements[part - 1]) throw new Error(`no part ${part} (parts: ${statements.length})`);
  console.log(statements[part - 1]);
} else {
  console.log(["begin;", ...statements, "commit;"].join("\n\n"));
}
