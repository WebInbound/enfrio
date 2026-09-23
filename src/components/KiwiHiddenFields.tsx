"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { sanitizeRich } from "@/lib/content-format";

export type EditorField = { slug: string; label: string; group: string; type: string; value: string };

/**
 * Kiwi editor only: a floating panel with the blocks of this page that can't
 * be clicked on the page itself — SEO texts, image descriptions, form
 * messages, sizer coefficients, numbers that animate, texts of hidden
 * states. Every value carries the same data-kiwi-* markers as the page, so
 * the overlay edits it in place (texts) or opens the image library (images),
 * and the Kiwi editor saves it like any other block.
 *
 * The panel is always in the DOM (hidden when closed) so its blocks are part
 * of the inventory the overlay sends to the editor.
 */
export default function KiwiHiddenFields({ fields }: { fields: EditorField[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [query, setQuery] = useState("");
  const [onPage, setOnPage] = useState<Set<string> | null>(null);

  // Slugs already clickable on the page (outside this panel).
  useEffect(() => {
    function scan() {
      const found = new Set<string>();
      document.querySelectorAll<HTMLElement>("[data-kiwi-block]").forEach((el) => {
        if (root.current?.contains(el)) return;
        const slug = el.dataset.kiwiBlock;
        if (slug) found.add(slug);
      });
      setOnPage(found);
    }
    const t = setTimeout(scan, 300);
    return () => clearTimeout(t);
  }, [open, fields]);

  const hiddenCount = onPage ? fields.filter((f) => !onPage.has(f.slug)).length : fields.length;

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const out = new Map<string, { f: EditorField; show: boolean }[]>();
    for (const f of fields) {
      const visible = showAll || !onPage || !onPage.has(f.slug);
      const matches = !q || `${f.group} ${f.label} ${f.value}`.toLowerCase().includes(q);
      // Filtered-out fields stay in the DOM (hidden) so the inventory is stable.
      const key = f.group || "Altro";
      if (!out.has(key)) out.set(key, []);
      out.get(key)!.push({ f, show: visible && matches });
    }
    return [...out.entries()];
  }, [fields, onPage, showAll, query]);

  return (
    <div ref={root} className="kiwi-hf" data-kiwi-hidden-fields="">
      <style>{CSS}</style>
      <button type="button" className="kiwi-hf-toggle" data-kiwi-allow-click="" onClick={() => setOpen((o) => !o)}>
        {open ? "Chiudi" : `Altri testi della pagina (${hiddenCount})`}
      </button>
      <div className="kiwi-hf-panel" hidden={!open} data-lenis-prevent="">
        <div className="kiwi-hf-head">
          <strong>Testi che non si cliccano sulla pagina</strong>
          <span>Clicca un valore per modificarlo, una foto per sostituirla.</span>
          <input
            className="kiwi-hf-search"
            type="search"
            placeholder="Cerca…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <label className="kiwi-hf-all">
            <input type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} /> Mostra anche quelli
            già cliccabili sulla pagina
          </label>
        </div>
        {groups.map(([group, list]) => {
          const anyShown = list.some((x) => x.show);
          return (
            <section key={group} className="kiwi-hf-group" hidden={!anyShown}>
              <p className="kiwi-hf-group-title">{group}</p>
              {list.map(({ f, show }) => (
                <Field key={f.slug} field={f} show={show} />
              ))}
            </section>
          );
        })}
      </div>
    </div>
  );
}

function Field({ field: f, show }: { field: EditorField; show: boolean }) {
  const marks = {
    "data-kiwi-block": f.slug,
    "data-kiwi-type": f.type,
    "data-kiwi-label": f.label,
    "data-kiwi-group": f.group,
    "data-kiwi-no-drag": "1",
  };
  return (
    <div className="kiwi-hf-field" hidden={!show}>
      <p className="kiwi-hf-label">{f.label}</p>
      {f.type === "image" ? (
        f.value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="kiwi-hf-img" src={f.value} alt="" {...marks} />
        ) : (
          <div className="kiwi-hf-img kiwi-hf-img-empty" {...marks}>
            Nessuna immagine
          </div>
        )
      ) : f.type === "richtext" ? (
        <div className="kiwi-hf-value" {...marks} dangerouslySetInnerHTML={{ __html: sanitizeRich(f.value) }} />
      ) : (
        <div className="kiwi-hf-value" {...marks}>
          {f.value}
        </div>
      )}
    </div>
  );
}

const CSS = `
.kiwi-hf { font-family: system-ui, -apple-system, "Segoe UI", sans-serif; }
.kiwi-hf-toggle {
  position: fixed; left: 16px; bottom: 16px; z-index: 2147483000;
  background: #0f172a; color: #fbbf24; border: 1px solid #fbbf24; border-radius: 999px;
  padding: 10px 16px; font: 600 13px/1 system-ui, sans-serif; cursor: pointer;
  box-shadow: 0 6px 20px rgba(0,0,0,.35);
}
.kiwi-hf-panel {
  position: fixed; left: 16px; bottom: 64px; z-index: 2147483000;
  width: min(420px, calc(100vw - 32px)); max-height: min(72vh, 760px); overflow: auto;
  background: #0f172a; color: #e2e8f0; border-radius: 12px; padding: 0 14px 14px;
  box-shadow: 0 16px 48px rgba(0,0,0,.45); font-size: 13px; line-height: 1.4; text-align: left;
}
.kiwi-hf-panel[hidden], .kiwi-hf-group[hidden], .kiwi-hf-field[hidden] { display: none; }
.kiwi-hf-head {
  position: sticky; top: 0; background: #0f172a; padding: 14px 0 10px; display: grid; gap: 6px; z-index: 1;
}
.kiwi-hf-head strong { color: #fbbf24; font-size: 14px; }
.kiwi-hf-head span { color: #94a3b8; }
.kiwi-hf-search {
  width: 100%; padding: 7px 10px; border-radius: 8px; border: 1px solid #334155;
  background: #1e293b; color: #e2e8f0; font: inherit;
}
.kiwi-hf-all { color: #94a3b8; display: flex; gap: 6px; align-items: center; }
.kiwi-hf-group { border-top: 1px solid #1e293b; padding-top: 8px; margin-top: 8px; }
.kiwi-hf-group-title { margin: 0 0 6px; color: #fbbf24; font-weight: 600; font-size: 12px; letter-spacing: .02em; }
.kiwi-hf-field { margin: 0 0 10px; }
.kiwi-hf-label { margin: 0 0 3px; color: #94a3b8; font-size: 12px; }
.kiwi-hf-value {
  white-space: pre-wrap; word-break: break-word; min-height: 1.6em;
  background: #1e293b; border: 1px solid #334155; border-radius: 6px; padding: 6px 8px;
  color: #f8fafc; cursor: text; text-transform: none; letter-spacing: normal; font: 13px/1.4 system-ui, sans-serif;
}
.kiwi-hf-value:empty::before { content: "(vuoto)"; color: #64748b; font-style: italic; }
.kiwi-hf-img {
  display: block; max-width: 100%; max-height: 140px; border-radius: 6px; border: 1px solid #334155;
  background: #1e293b; object-fit: contain; cursor: pointer;
}
.kiwi-hf-img-empty { padding: 20px; color: #64748b; text-align: center; }
`;
