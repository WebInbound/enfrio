'use client';

/**
 * KIWI EDIT-IN-PLACE — overlay client-side
 *
 * ENFRIO: copy of the Kiwi platform template
 * (kiwi-network/public/skill-templates/edit-mode/KiwiEditOverlay.tsx, v2.11.1 +
 * v2.12 token refresh) with local patches marked `ENFRIO:`
 *  - several allowed parent origins (app./www./apex kiwienterprise.it);
 *  - nav links with data-kiwi-page keep navigating;
 *  - image swap drops next/image srcset so the new picture shows at once;
 *  - text is read with CSS text-transform off (uppercase kickers stay as typed);
 *  - KIWI_BLOCK_UPDATE updates every element showing the block;
 *  - data-kiwi-no-drag="1" (set on every Enfrio block) also disables image
 *    dragging and the precision/text drag handles: texts and images can be
 *    changed, the layout can't be moved.
 * Mounted only inside the Kiwi editor (see src/components/KiwiEditMount.tsx).
 *
 * Posizione: src/components/KiwiEditOverlay.tsx
 *
 * QUESTO COMPONENTE E LE SUE FEATURE SI APPLICANO A TUTTE LE PAGINE DEL SITO.
 * ─────────────────────────────────────────────────────────────────────────
 * Monta questo Client Component dentro src/app/layout.tsx (ROOT layout, non
 * un layout di gruppo), condizionalmente quando isEditMode() è true. Una
 * volta montato a livello root, l'overlay scansiona automaticamente il DOM
 * di QUALUNQUE pagina su cui il cliente naviga (home, /contatti, /chi-siamo,
 * /prodotti/[slug], ...).
 *
 * REQUISITO CRITICO: l'overlay scopre i contenuti editabili tramite i data
 * attributes (`data-kiwi-block`, `data-kiwi-section`, `data-kiwi-type=...`)
 * emessi dai wrapper `<Editable>`/`<EditableSection>`/`editableImageProps`/
 * `<EditableVideo>`/`<EditableIcon>`/`<EditableLink>`/`<EditableSocialLink>`/
 * `<EditableHeroBg>`/`<EditableParagraph>`/`<EditableHeading>`. Una pagina
 * che NON usa questi wrapper appare nell'editor ma è INERTE (nessun click
 * apre selezione, nessun hover, nessun drag). Per coprire tutto il sito,
 * ogni file `src/app/<route>/page.tsx` deve wrappare i suoi contenuti.
 *
 * Vedi `multiPageGuide` nel manifest.json per la struttura completa app
 * router + checklist.
 *
 * v2.7.3 — Cosa fa:
 *  1. Scansiona il DOM per [data-kiwi-block] e [data-kiwi-section].
 *  2. Click su block testo: contentEditable + emit selezione + drag handle
 *     top-left per riposizionare via transform: translate (KIWI_TEXT_MOVED).
 *  3. Click su block immagine: apre la libreria (drag se >4px). HOVER su
 *     immagine/video = 8 maniglie di resize SEMPRE visibili (no dblclick
 *     richiesto) — l'utente puo` prendere uno spigolo qualsiasi al primo
 *     contatto. Doppio click = precision mode (selezione persistente +
 *     drag locale).
 *  4. Click su block video: stessa UX immagini, doppio click apre
 *     VideoEditorModal del parent (kind='video').
 *  5. Listener KIWI_BLOCK_STYLE: applica style inline live (con !important
 *     per override CSS sito) al target corretto (parent block-level per
 *     text-align quando il wrapper e` inline).
 *  6. Drag su .kiwi-section-drag-handle: riordina sezioni.
 *  7. Drag su .kiwi-section-resize-handle: resize altezza sezione.
 *  8. Origin check stretto in entrambe le direzioni.
 */

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// ENFRIO: several allowed parent origins; the target is the one the iframe was opened from.
const ALLOWED_PARENT_ORIGINS = (
  process.env.NEXT_PUBLIC_KIWI_EDIT_PARENT_ORIGIN ||
  'https://app.kiwienterprise.it https://kiwienterprise.it https://www.kiwienterprise.it'
)
  .split(/\s+/)
  .map((s) => s.trim())
  .filter(Boolean);
function getParentOrigin(): string {
  if (typeof document !== 'undefined' && document.referrer) {
    try {
      const o = new URL(document.referrer).origin;
      if (ALLOWED_PARENT_ORIGINS.includes(o)) return o;
    } catch {
      /* ignore */
    }
  }
  return ALLOWED_PARENT_ORIGINS[0];
}

const STYLE_KEYS = [
  'fontSize',
  'fontFamily',
  'color',
  'textAlign',
  'fontWeight',
  'fontStyle',
  'textDecoration',
  'lineHeight',
  'letterSpacing',
  'textTransform',
] as const;
type StyleKey = (typeof STYLE_KEYS)[number];

const CSS_KEY: Record<StyleKey, string> = {
  fontSize: 'font-size',
  fontFamily: 'font-family',
  color: 'color',
  textAlign: 'text-align',
  fontWeight: 'font-weight',
  fontStyle: 'font-style',
  textDecoration: 'text-decoration',
  lineHeight: 'line-height',
  letterSpacing: 'letter-spacing',
  textTransform: 'text-transform',
};

// Stili che vanno applicati al parent block-level quando il wrapper Editable
// e` inline (es. <span>) — in particolare text-align non funziona su inline.
const PARENT_TARGET_KEYS = new Set<StyleKey>(['textAlign']);

// v2.7.0: tipi di block che sono testuali (drag-vs-edit gesture controller).
const TEXT_DRAG_TYPES = new Set(['text', 'textarea', 'email', 'tel', 'url', 'richtext']);

// v2.7.0: threshold (px e ms) per discriminare click puro da drag.
const DRAG_THRESHOLD_PX = 4;
const HOLD_TO_EDIT_MS = 250;

/**
 * Discovery pagine: il sito puo` esporre <a data-kiwi-page>...</a> nei nav.
 * Fallback a sola "Home" se nessun marker trovato.
 */
function discoverPages() {
  const nodes = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[data-kiwi-page]'));
  if (nodes.length === 0) {
    return [{ slug: 'home', title: 'Home', path: '/', isHome: true }];
  }
  // v2.11.1: dedupe per `path`. Senza, un sito con logo+nav che linkano alla
  // home produceva due voci "Home" duplicate nel pannello pagine. Mantenuta
  // la prima occorrenza (di solito quella nel nav, con titolo migliore).
  const seen = new Set<string>();
  const pages: Array<{ slug: string; title: string; path: string; isHome: boolean }> = [];
  for (const a of nodes) {
    const href = a.getAttribute('href') || '/';
    const path = href.startsWith('/') ? href : '/' + href;
    if (seen.has(path)) continue;
    seen.add(path);
    pages.push({
      slug:
        a.dataset.kiwiPage ||
        path
          .replace(/^\//, '')
          .replace(/[^a-z0-9]+/gi, '_')
          .toLowerCase() ||
        'home',
      title: a.dataset.kiwiPageTitle || a.textContent?.trim() || path,
      path,
      isHome: path === '/' || a.dataset.kiwiPageHome === 'true',
    });
  }
  return pages;
}

type SelectionState =
  | { kind: 'none' }
  | { kind: 'text'; el: HTMLElement; slug: string }
  // v2.7.0: image/video accettano qualsiasi HTMLElement (incluso <div> con
  // background-image via <EditableHeroBg>).
  | { kind: 'image'; el: HTMLElement; slug: string }
  | { kind: 'video'; el: HTMLElement; slug: string }
  | { kind: 'section'; el: HTMLElement; id: string }
  // v2.10.0: sub-blocco column dentro una section.
  | { kind: 'column'; el: HTMLElement; id: string };

/**
 * Risolve l'URL "src" di un elemento immagine: <img>, <picture><img>, oppure
 * <div> con backgroundImage CSS (caso EditableHeroBg).
 */
function resolveImageSrc(el: HTMLElement): string {
  if (el instanceof HTMLImageElement) return el.src;
  const innerImg = el.querySelector<HTMLImageElement>('img');
  if (innerImg) return innerImg.src;
  const bg = (typeof window !== 'undefined' ? getComputedStyle(el).backgroundImage : '') || '';
  const m = bg.match(/url\(["']?([^"')]+)["']?\)/);
  return m ? m[1] : '';
}

/** Stesso per video: <video> nativo o wrapper con figlio <video>. */
function resolveVideoSrc(el: HTMLElement): string {
  if (el instanceof HTMLVideoElement) return el.currentSrc || el.src || '';
  const inner = el.querySelector<HTMLVideoElement>('video');
  return inner ? inner.currentSrc || inner.src || '' : '';
}

function readStyleOverrides(el: HTMLElement): Record<string, string> {
  const raw = el.dataset.kiwiStyleOverrides;
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed as Record<string, string>;
  } catch {
    /* ignore */
  }
  return {};
}

/**
 * Legge il VERO style attualmente renderizzato dal browser (computed) e lo
 * normalizza per la toolbar. Per text-align risale al parent block-level
 * perche` lo span inline eredita.
 *
 * Why: senza questo la toolbar mostra sempre 16px / 400 / nero come default,
 * indipendentemente dal vero stato visivo del testo (es. <h1> a 56px). I
 * controlli (select size, weight, color, align) devono partire dal valore
 * realmente visibile per essere intuitivi e modificabili.
 *
 * Gli override salvati (data-kiwi-style-overrides) sovrascrivono i computed
 * cosi` lo stato editor riflette lo stato persistito.
 */
function readEffectiveStyle(el: HTMLElement): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const overrides = readStyleOverrides(el);
  const computed = window.getComputedStyle(el);

  // Per text-align serve il parent block-level (lo span inline lo eredita).
  const alignTarget = (() => {
    const isInline = computed.display.startsWith('inline');
    if (!isInline) return el;
    return (
      el.closest<HTMLElement>('p, h1, h2, h3, h4, h5, h6, div, section, article, li, blockquote') ||
      el
    );
  })();
  const alignComputed = window.getComputedStyle(alignTarget).textAlign;

  // Normalizzo color rgb() -> hex (la toolbar lo confronta con preset hex)
  function rgbToHex(rgb: string): string {
    const m = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (!m) return rgb;
    const r = parseInt(m[1], 10);
    const g = parseInt(m[2], 10);
    const b = parseInt(m[3], 10);
    return (
      '#' +
      [r, g, b]
        .map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0'))
        .join('')
    );
  }

  // Normalizzo font-size es. "56px" lasciandolo cosi`. Se "16px" ok.
  const fontSize = computed.fontSize;
  const fontFamily = computed.fontFamily;
  const fontWeight = computed.fontWeight;
  const fontStyle = computed.fontStyle;
  const textDecoration = computed.textDecorationLine || computed.textDecoration;
  const color = rgbToHex(computed.color);

  // 'start' / 'end' non li usa la toolbar; mappo a left/right (LTR default)
  let textAlign: string = alignComputed || 'left';
  if (textAlign === 'start') textAlign = 'left';
  if (textAlign === 'end') textAlign = 'right';

  // v2.7.0 nuovi campi: lineHeight (computed e` sempre px o 'normal'),
  // letterSpacing (px o 'normal'), textTransform.
  const computedLh = computed.lineHeight;
  const lineHeight = computedLh && computedLh !== 'normal' ? computedLh : '';
  const computedLs = computed.letterSpacing;
  const letterSpacing = computedLs && computedLs !== 'normal' ? computedLs : '';
  const computedTt = computed.textTransform;
  const textTransform = computedTt && computedTt !== 'none' ? computedTt : '';

  const baseline: Record<string, string> = {
    fontSize,
    fontFamily,
    fontWeight,
    fontStyle,
    textDecoration: textDecoration && textDecoration !== 'none' ? textDecoration : '',
    color,
    textAlign,
    lineHeight,
    letterSpacing,
    textTransform,
  };

  // Le override salvate vincono sul computed
  return { ...baseline, ...overrides };
}

/**
 * Risolve il target su cui applicare lo style inline. Se l'utente ha specificato
 * `data-kiwi-style-target="parent-block"` oppure la chiave e` nel set
 * PARENT_TARGET_KEYS (default per text-align) e l'elemento e` inline, sale al
 * primo block-level ancestor (p/h1-h6/div/section/article/li). Altrimenti torna
 * sull'elemento stesso.
 */
/**
 * Classi CSS che indicano "selezione attiva" per ogni tipo di block. Usate
 * dal helper `clearAllMediaSelections` per garantire che la selezione di un
 * tipo (es. immagine) tolga la selezione di tutti gli altri tipi (text/video/
 * icon/social/section). Senza questo set centralizzato i 5+ blocchi inline
 * che cancellano le selezioni vanno fuori sync (uno dimenticato, hover doppio).
 */
const SELECTION_CLASSES = [
  'kiwi-image-selected',
  'kiwi-video-selected',
  'kiwi-icon-selected',
  'kiwi-social-selected',
  'kiwi-text-selected',
] as const;

function clearAllMediaSelections(except?: Element | null) {
  const sel = SELECTION_CLASSES.map((c) => '.' + c).join(', ');
  document.querySelectorAll<HTMLElement>(sel).forEach((el) => {
    if (except && el === except) return;
    for (const c of SELECTION_CLASSES) el.classList.remove(c);
  });
}

/**
 * Parser inverso di `transform: translate(Xpx, Ypx)` -> { x, y }. Usato dai
 * componenti drag (image/video/text). Estratto top-level per eliminare la
 * duplicazione tra MediaResizeAndDrag e TextDragHandle.
 */
function parseTranslate(el: HTMLElement): { x: number; y: number } {
  const m = (el.style.transform || '').match(
    /translate\(\s*(-?\d+(?:\.\d+)?)px\s*,\s*(-?\d+(?:\.\d+)?)px\s*\)/,
  );
  if (m) return { x: parseFloat(m[1]), y: parseFloat(m[2]) };
  return { x: 0, y: 0 };
}

/**
 * Costruisce l'inventory (blocks + sections + pages + currentPath + title +
 * v2.9.0: images + links + headings) da inviare al parent via KIWI_EDIT_READY,
 * KIWI_REQUEST_INVENTORY o KIWI_PAGE_SCAN_REQUEST (pannello SEO).
 *
 * v2.9.0: aggiunti images/links/headings per popolare le tab del pannello SEO
 * modale (Audit -> alt text mancanti, link rotti, gerarchia heading H1/H2/...).
 */
function buildInventory() {
  const blocks = Array.from(document.querySelectorAll<HTMLElement>('[data-kiwi-block]')).map(
    (el) => ({
      slug: el.dataset.kiwiBlock || '',
      type: el.dataset.kiwiType || 'text',
      label: el.dataset.kiwiLabel || el.dataset.kiwiBlock || '',
      group: el.dataset.kiwiGroup || '',
    }),
  );
  const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-kiwi-section]')).map(
    (el) => ({
      id: el.dataset.kiwiSection || '',
      slug: el.dataset.kiwiSectionSlug || '',
      label: el.dataset.kiwiSectionLabel || '',
    }),
  );

  // v2.10.0 — COLUMNS: sub-div selezionabili dentro le sezioni (es.
  // pannello-sinistro grigio scuro di una sezione split).
  const columns = Array.from(document.querySelectorAll<HTMLElement>('[data-kiwi-column]')).map(
    (el) => ({
      id: el.dataset.kiwiColumn || '',
      slug: el.dataset.kiwiColumnSlug || '',
      label: el.dataset.kiwiColumnLabel || '',
    }),
  );

  // v2.9.0 — IMAGES: scansione globale <img> escludendo decoration / no-drag.
  const images: Array<{
    src: string;
    alt: string;
    blockSlug: string;
    width: number;
    height: number;
  }> = [];
  Array.from(document.querySelectorAll<HTMLImageElement>('img')).forEach((img) => {
    if (img.hasAttribute('data-kiwi-decoration')) return;
    const noDrag = img.closest('[data-kiwi-no-drag="1"]');
    if (noDrag && !noDrag.hasAttribute('data-kiwi-block')) return; // ENFRIO
    const blockEl = img.closest<HTMLElement>('[data-kiwi-block]');
    images.push({
      src: img.currentSrc || img.src || '',
      alt: img.getAttribute('alt') || '',
      blockSlug: blockEl?.dataset.kiwiBlock || '',
      width: img.clientWidth,
      height: img.clientHeight,
    });
  });

  // v2.9.0 — LINKS: scansione globale <a> escludendo i nav data-kiwi-page.
  const links: Array<{
    href: string;
    text: string;
    type: 'internal' | 'external' | 'email' | 'tel' | 'anchor';
    rel: string;
  }> = [];
  const currentHost = window.location.host;
  Array.from(document.querySelectorAll<HTMLAnchorElement>('a')).forEach((a) => {
    if (a.hasAttribute('data-kiwi-page')) return;
    const href = a.getAttribute('href') || '';
    if (!href) return;
    let type: 'internal' | 'external' | 'email' | 'tel' | 'anchor' = 'internal';
    if (href.startsWith('mailto:')) type = 'email';
    else if (href.startsWith('tel:')) type = 'tel';
    else if (href.startsWith('#')) type = 'anchor';
    else if (/^https?:\/\//i.test(href)) {
      try {
        const u = new URL(href);
        type = u.host === currentHost ? 'internal' : 'external';
      } catch {
        type = 'external';
      }
    }
    links.push({
      href,
      text: (a.textContent || '').trim().slice(0, 200),
      type,
      rel: a.getAttribute('rel') || '',
    });
  });

  // v2.11.0 — MAPS: <iframe data-kiwi-type='map'> Google Maps editabili.
  // Popolano la sidebar Pagine -> Mappe e permettono al pannello di editarle
  // anche senza dover prima cliccare l'iframe nella pagina.
  const maps: Array<{ slug: string; src: string; address: string; label: string }> = [];
  Array.from(document.querySelectorAll<HTMLIFrameElement>('iframe[data-kiwi-type="map"]')).forEach(
    (el) => {
      maps.push({
        slug: el.dataset.kiwiBlock || '',
        src: el.dataset.kiwiMapSrc || el.src || '',
        address: el.dataset.kiwiMapAddress || '',
        label: el.dataset.kiwiLabel || el.dataset.kiwiBlock || '',
      });
    },
  );

  // v2.9.0 — HEADINGS: <h1>-<h6> non vuoti / non decorativi.
  const headings: Array<{ level: 1 | 2 | 3 | 4 | 5 | 6; text: string }> = [];
  Array.from(document.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6')).forEach((h) => {
    if (h.hasAttribute('data-kiwi-decoration')) return;
    const text = (h.textContent || '').trim();
    if (!text) return;
    const lvl = Number(h.tagName.charAt(1));
    if (lvl < 1 || lvl > 6) return;
    headings.push({ level: lvl as 1 | 2 | 3 | 4 | 5 | 6, text: text.slice(0, 200) });
  });

  return {
    blocks,
    sections,
    columns,
    pages: discoverPages(),
    currentPath: window.location.pathname + window.location.search,
    title: document.title,
    images,
    links,
    headings,
    maps,
  };
}

/**
 * Hook condiviso per tracciare il bounding rect di un elemento con scroll/resize/
 * ResizeObserver. Eliminava la duplicazione tra SectionResizeHandle,
 * MediaResizeAndDrag e TextDragHandle.
 */
function useElementRect(target: HTMLElement | null) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  useEffect(() => {
    if (!target) {
      setRect(null);
      return;
    }
    function update() {
      if (target) setRect(target.getBoundingClientRect());
    }
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    const ro =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    ro?.observe(target);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
      ro?.disconnect();
    };
  }, [target]);
  return rect;
}

/**
 * v2.7.2: auto-detect overlay decorativi (gradient, color tints) che bloccano
 * il click su media editabili sotto. Heuristic: elemento con `position:absolute`
 * + `inset:0` (o all 0 di top/right/bottom/left) + nessun figlio `[data-kiwi-block]`.
 * Marca con `data-kiwi-auto-decoration="true"`. Il CSS edit-mode applica
 * `pointer-events:none`. Sblocca template legacy senza marker espliciti.
 */
// ENFRIO: innerText applies CSS text-transform (kickers and buttons are
// uppercase in globals.css): read the text with transforms switched off, or
// "Contact us" would be saved as "CONTACT US".
let rawReadStyle = false;
function readRawText(el: HTMLElement): string {
  if (!rawReadStyle) {
    const st = document.createElement('style');
    st.textContent = '.kiwi-raw-read, .kiwi-raw-read * { text-transform: none !important; }';
    document.head.appendChild(st);
    rawReadStyle = true;
  }
  el.classList.add('kiwi-raw-read');
  const text = el.innerText;
  el.classList.remove('kiwi-raw-read');
  return text;
}

function autoDetectDecorations(root: ParentNode = document) {
  const candidates = root.querySelectorAll<HTMLElement>('div, span');
  candidates.forEach((el) => {
    if (el.hasAttribute('data-kiwi-block')) return;
    if (el.hasAttribute('data-kiwi-section')) return;
    if (el.hasAttribute('data-kiwi-decoration')) return;
    if (el.hasAttribute('data-kiwi-auto-decoration')) return;
    if (el.querySelector('[data-kiwi-block]')) return; // ha figli editabili: NO
    const cs = window.getComputedStyle(el);
    if (cs.position !== 'absolute' && cs.position !== 'fixed') return;
    // inset:0 = tutti 0px, oppure shorthand top:0; right:0; bottom:0; left:0
    const allZero =
      cs.top === '0px' && cs.right === '0px' && cs.bottom === '0px' && cs.left === '0px';
    if (!allZero) return;
    el.setAttribute('data-kiwi-auto-decoration', 'true');
  });
}

/**
 * v2.10.0 — helper unificato che applica style overrides di section/column
 * a un elemento DOM. Usato sia da KIWI_SECTION_STYLE_UPDATE che da
 * KIWI_COLUMN_STYLE_UPDATE.
 *
 * `opts.allowFullWidth` (default true) controlla se la chiave `fullWidth`
 * imposta max-width 1200px / margin auto. Per le column passa false (la
 * colonna eredita la larghezza dalla section padre).
 *
 * Sanitize whitelist:
 *  - backgroundColor: hex 3/6 o 'transparent'
 *  - backgroundImage: URL https assoluto (max 800ch)
 *  - backgroundMode: 'cover' | 'contain' | 'repeat'
 *  - overlayOpacity: '0'..'80' (percentuale)
 *  - paddingY/paddingX: '0'..'200' (px)
 *  - borderTop/borderBottom: { style: 'none'|'solid'|'dashed'|'dotted', color: hex }
 *  - fullWidth: boolean (solo se allowFullWidth)
 *  - animation: 'none'|'fade-in'|'slide-up'|'zoom-in'
 *
 * Tutti gli style sono applicati con `!important` per battere CSS del sito
 * (Tailwind padding/bg utilities che vincono per specificita\` / cascata).
 */
function applyContainerStyleOverrides(
  target: HTMLElement,
  overrides: Record<string, unknown>,
  opts: { allowFullWidth?: boolean } = {},
) {
  const allowFullWidth = opts.allowFullWidth !== false;

  const COLOR_RX_LIVE = /^(?:#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?|transparent)$/;
  const URL_RX_LIVE = /^https?:\/\/[^\s"<>']{1,800}$/;
  const NUM_0_200_RX_LIVE = /^(?:[0-9]|[1-9][0-9]|1[0-9]{2}|200)$/;
  const NUM_0_80_RX_LIVE = /^(?:[0-9]|[1-7][0-9]|80)$/;
  const BORDER_OK = new Set(['none', 'solid', 'dashed', 'dotted']);
  const BG_MODE_OK = new Set(['cover', 'contain', 'repeat']);
  const ANIM_OK = new Set(['none', 'fade-in', 'slide-up', 'zoom-in']);

  // Background color
  const bgColor = overrides.backgroundColor;
  if (typeof bgColor === 'string' && COLOR_RX_LIVE.test(bgColor.trim())) {
    target.style.setProperty('background-color', bgColor.trim(), 'important');
  } else if (bgColor === '' || bgColor === undefined) {
    if (bgColor === '') target.style.removeProperty('background-color');
  }

  // Background image + mode
  const bgImage = overrides.backgroundImage;
  if (typeof bgImage === 'string') {
    const v = bgImage.trim();
    if (v === '') {
      target.style.removeProperty('background-image');
      target.style.removeProperty('background-size');
      target.style.removeProperty('background-repeat');
      target.style.removeProperty('background-position');
    } else if (URL_RX_LIVE.test(v)) {
      target.style.setProperty('background-image', `url("${v}")`, 'important');
      const mode = overrides.backgroundMode;
      const m = typeof mode === 'string' && BG_MODE_OK.has(mode) ? mode : 'cover';
      if (m === 'repeat') {
        target.style.setProperty('background-repeat', 'repeat', 'important');
        target.style.removeProperty('background-size');
      } else {
        target.style.setProperty('background-size', m, 'important');
        target.style.setProperty('background-repeat', 'no-repeat', 'important');
        target.style.setProperty('background-position', 'center', 'important');
      }
    }
  }

  // Overlay scuro: inset box-shadow (no DOM extra)
  const overlay = overrides.overlayOpacity;
  if (typeof overlay === 'string' && NUM_0_80_RX_LIVE.test(overlay.trim())) {
    const pct = Number(overlay) / 100;
    if (pct === 0) {
      target.style.removeProperty('box-shadow');
    } else {
      target.style.setProperty(
        'box-shadow',
        `inset 0 0 0 9999px rgba(0,0,0,${pct})`,
        'important',
      );
    }
  }

  // Padding Y/X
  const padY = overrides.paddingY;
  if (typeof padY === 'string' && NUM_0_200_RX_LIVE.test(padY.trim())) {
    target.style.setProperty('padding-top', `${padY}px`, 'important');
    target.style.setProperty('padding-bottom', `${padY}px`, 'important');
  }
  const padX = overrides.paddingX;
  if (typeof padX === 'string' && NUM_0_200_RX_LIVE.test(padX.trim())) {
    target.style.setProperty('padding-left', `${padX}px`, 'important');
    target.style.setProperty('padding-right', `${padX}px`, 'important');
  }

  // Border top/bottom
  for (const which of ['borderTop', 'borderBottom'] as const) {
    const raw = overrides[which];
    if (raw && typeof raw === 'object') {
      const r = raw as Record<string, unknown>;
      const style = typeof r.style === 'string' ? r.style : '';
      const color = typeof r.color === 'string' ? r.color : '';
      if (BORDER_OK.has(style) && (style === 'none' || /^#[0-9a-fA-F]{3,6}$/.test(color))) {
        const cssProp = which === 'borderTop' ? 'border-top' : 'border-bottom';
        if (style === 'none') {
          target.style.removeProperty(cssProp);
        } else {
          target.style.setProperty(cssProp, `1px ${style} ${color}`, 'important');
        }
      }
    }
  }

  // Full width vs centrato (max-width 1200 + auto margin) — solo section
  if (allowFullWidth && typeof overrides.fullWidth === 'boolean') {
    if (overrides.fullWidth) {
      target.style.removeProperty('max-width');
      target.style.removeProperty('margin-left');
      target.style.removeProperty('margin-right');
    } else {
      target.style.setProperty('max-width', '1200px', 'important');
      target.style.setProperty('margin-left', 'auto', 'important');
      target.style.setProperty('margin-right', 'auto', 'important');
    }
  }

  // Animazione di entrata: marker classe + keyframes globali (1 sola volta)
  const anim = overrides.animation;
  if (typeof anim === 'string' && ANIM_OK.has(anim)) {
    target.classList.remove(
      'kiwi-anim-fade-in',
      'kiwi-anim-slide-up',
      'kiwi-anim-zoom-in',
    );
    if (anim !== 'none') {
      const animId = 'kiwi-section-anims';
      if (!document.getElementById(animId)) {
        const styleEl = document.createElement('style');
        styleEl.id = animId;
        styleEl.textContent = `
          @keyframes kiwi-fade-in { from { opacity: 0; } to { opacity: 1; } }
          @keyframes kiwi-slide-up { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes kiwi-zoom-in { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
          .kiwi-anim-fade-in { animation: kiwi-fade-in 600ms ease-out both; }
          .kiwi-anim-slide-up { animation: kiwi-slide-up 600ms ease-out both; }
          .kiwi-anim-zoom-in { animation: kiwi-zoom-in 600ms ease-out both; }
        `;
        document.head.appendChild(styleEl);
      }
      target.classList.add(`kiwi-anim-${anim}`);
    }
  }
}

function resolveStyleTarget(el: HTMLElement, key: StyleKey): HTMLElement {
  const explicit = el.dataset.kiwiStyleTarget;
  if (explicit === 'self') return el;
  const wantsParent = explicit === 'parent-block' || PARENT_TARGET_KEYS.has(key);
  if (!wantsParent) return el;

  // Se l'elemento e` gia` block-level non serve risalire
  const computed = typeof window !== 'undefined' ? getComputedStyle(el).display : '';
  if (computed && !computed.startsWith('inline')) return el;

  const parent = el.closest<HTMLElement>('p, h1, h2, h3, h4, h5, h6, div, section, article, li, blockquote');
  return parent || el;
}

function applyStyleToElement(el: HTMLElement, overrides: Record<string, string | null>) {
  // Aggiorna data-kiwi-style-overrides per stato consistente
  const current = readStyleOverrides(el);
  for (const k of STYLE_KEYS) {
    if (k in overrides) {
      const v = overrides[k];
      if (v === null || v === '') delete current[k];
      else current[k] = v as string;
    }
  }
  if (Object.keys(current).length > 0) {
    el.dataset.kiwiStyleOverrides = JSON.stringify(current);
  } else {
    el.dataset.kiwiStyleOverrides = '';
  }

  // v2.7.0 BUG FIX font-size: lo `<style>` scoped server-rendered emesso da
  // <Editable> / <EditableLink> ha `!important` con il VECCHIO valore. Inline
  // batte per specificita`, MA se React re-renderizza l'elemento (es. SWR
  // refetch, group navigation) il vecchio <style> torna attivo e l'inline e`
  // perso. Allineiamo il <style> scoped al nuovo valore live cercandolo via
  // [data-kiwi-styled-css="<id>"] (emesso da v2.7.0 della lib editable).
  const styledId = el.dataset.kiwiStyled;
  if (styledId) {
    const sel = `style[data-kiwi-styled-css="${CSS.escape(styledId)}"]`;
    let styleEl = document.querySelector<HTMLStyleElement>(sel);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.dataset.kiwiStyledCss = styledId;
      document.head.appendChild(styleEl);
    }
    const parts: string[] = [];
    for (const k of STYLE_KEYS) {
      const v = current[k];
      if (v) parts.push(`${CSS_KEY[k]}: ${v} !important;`);
    }
    styleEl.textContent = parts.length
      ? `[data-kiwi-styled="${styledId}"]{${parts.join(' ')}}`
      : '';
  }

  // Applica gli stili (con !important per battere il CSS del sito)
  for (const k of STYLE_KEYS) {
    if (!(k in overrides)) continue;
    const v = overrides[k];
    const target = resolveStyleTarget(el, k);
    const cssKey = CSS_KEY[k];
    if (v === null || v === '') {
      target.style.removeProperty(cssKey);
    } else {
      target.style.setProperty(cssKey, v as string, 'important');
    }
  }
}

/**
 * v2.7.3: hover state per media editabili. Quando il mouse e` sopra
 * un'immagine/video editabile (e nessuna selezione precision e` attiva), le
 * 8 maniglie di resize compaiono subito senza richiedere doppio click.
 * Permette al cliente di prendere uno spigolo qualsiasi al primo contatto.
 */
type HoveredMedia = { el: HTMLElement; slug: string; kind: 'image' | 'video' } | null;

export default function KiwiEditOverlay() {
  const [selection, setSelection] = useState<SelectionState>({ kind: 'none' });
  const [hoveredMedia, setHoveredMedia] = useState<HoveredMedia>(null);
  const dirtyTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const dragSourceId = useRef<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // === Helper postMessage ====================================================

  function send(type: string, data: Record<string, unknown> = {}) {
    if (typeof window === 'undefined' || window.parent === window) return;
    // CRITICAL: spread `data` PRIMA cosi` `source` e `type` del messaggio non
    // vengono mai sovrascritti da chiavi omonime nel payload (es. activateImage
    // passa `type: 'image'` per indicare il field_type del block — quel `type`
    // sovrascriverebbe il `type` del messaggio rompendo lo switch del parent).
    window.parent.postMessage({ ...data, source: 'kiwi-site', type }, getParentOrigin());
  }

  // === Inventory + READY al mount ============================================

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.parent === window) return; // not in iframe

    document.documentElement.classList.add('kiwi-edit-mode');
    autoDetectDecorations();

    // v2.11.1 BUG FIX cliente: "navigo via, torno, editor non funziona piu`".
    // Causa root: setTimeout(80) emetteva KIWI_EDIT_READY PRIMA che i Server
    // Components della pagina di destinazione fossero hydrated nel DOM. Il
    // parent memorizzava `inventory.blocks = []` e da li` ogni click su un
    // testo veniva interpretato come click su section (fallback) → si apriva
    // la SECTION drawer invece della FloatingTextToolbar.
    //
    // Fix: emettiamo KIWI_EDIT_READY al primo settle, poi ascoltiamo il DOM
    // con MutationObserver per re-emettere se compaiono nuovi blocks (Next.js
    // streaming SSR + RSC payload completion). Cap di 8 emissioni per evitare
    // loop su pagine molto dinamiche, debounce 120ms per coalescing.
    let lastBlocksCount = -1;
    let lastSectionsCount = -1;
    let emitsRemaining = 8;
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    function emitReadyIfChanged() {
      if (emitsRemaining <= 0) return;
      autoDetectDecorations();
      const inv = buildInventory();
      const bCount = inv.blocks.length;
      const sCount = inv.sections.length;
      if (bCount === lastBlocksCount && sCount === lastSectionsCount) return;
      lastBlocksCount = bCount;
      lastSectionsCount = sCount;
      emitsRemaining -= 1;
      send('KIWI_EDIT_READY', inv);
    }

    function scheduleEmit() {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(emitReadyIfChanged, 120);
    }

    // Prima emissione al settle iniziale (mantiene comportamento legacy).
    const initialT = setTimeout(emitReadyIfChanged, 80);

    // MutationObserver: se vengono aggiunti/rimossi nodi con data-kiwi-block o
    // data-kiwi-section (o ancestor che ne contengono), re-emetti l'inventory.
    const observer = new MutationObserver((mutations) => {
      let shouldEmit = false;
      for (const m of mutations) {
        if (m.type !== 'childList') continue;
        for (const node of [
          ...Array.from(m.addedNodes),
          ...Array.from(m.removedNodes),
        ]) {
          if (!(node instanceof HTMLElement)) continue;
          if (
            node.matches?.('[data-kiwi-block], [data-kiwi-section], [data-kiwi-column]') ||
            node.querySelector?.('[data-kiwi-block], [data-kiwi-section], [data-kiwi-column]')
          ) {
            shouldEmit = true;
            break;
          }
        }
        if (shouldEmit) break;
      }
      if (shouldEmit) scheduleEmit();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(initialT);
      if (debounceTimer) clearTimeout(debounceTimer);
      observer.disconnect();
    };
  }, [pathname]);

  // === Click handler =========================================================

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Ignora click su handle/UI overlay
      if (target.closest('.kiwi-overlay-handle')) return;
      // (selettore .kiwi-resize-handle gestito altrove — quello immagine non esiste)
      if (target.closest('.kiwi-section-resize-handle')) return;
      if (target.closest('.kiwi-section-drag-handle')) return;
      if (target.closest('.kiwi-text-drag-handle')) return;
      if (target.closest('.kiwi-media-hover-overlay')) return;

      // Block testo / immagine / video / icona / social link / mappa
      const blockEl = target.closest<HTMLElement>('[data-kiwi-block]');
      if (blockEl) {
        const type = blockEl.dataset.kiwiType || 'text';
        const slug = blockEl.dataset.kiwiBlock || '';
        // v2.11.0 — Map: <iframe> Google Maps editabile. Click apre il pannello
        // "Modifica mappa" del parent (cambia URL embed + indirizzo). Riusa il
        // canale `kind: 'image'` per la SelectionState (e` un media container
        // selezionato — niente drag/resize, solo edit URL).
        if (type === 'map') {
          e.preventDefault();
          e.stopPropagation();
          blurAllEditable();
          clearAllMediaSelections();
          setSelection({ kind: 'image', el: blockEl, slug });
          send('KIWI_BLOCK_SELECTED', {
            kind: 'map',
            slug,
            value: blockEl.dataset.kiwiMapSrc || '',
            address: blockEl.dataset.kiwiMapAddress || '',
            label: blockEl.dataset.kiwiLabel || slug,
            group: blockEl.dataset.kiwiGroup || '',
            rect: blockEl.getBoundingClientRect().toJSON(),
          });
          return;
        }
        // v2.7.0: image/video sono gestiti dal gesture controller "press-and-
        // decide" (mousedown/move/up con threshold 4px) e dal dblclick handler.
        // Qui inghiottiamo l'evento per evitare che parent (es. <a>) navighi.
        if (type === 'image' || type === 'video') {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        // v2.7.0: text/textarea/email/tel/url/richtext sono gestiti dal text
        // gesture controller (drag-vs-edit threshold). Lasciamo passare il
        // click puro per attivare il flusso edit alla `mouseup` standard
        // residue (compatibilita`: il gesture controller chiama activateText
        // su mouseup sotto soglia, ma se non e` partito, anche il click
        // handler puo` ancora fare activateText).
        if (TEXT_DRAG_TYPES.has(type)) {
          e.preventDefault();
          e.stopPropagation();
          activateText(blockEl, slug, type);
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        if (type === 'icon') {
          activateIcon(blockEl, slug);
        } else if (type === 'social') {
          activateSocial(blockEl, slug);
        } else {
          activateText(blockEl, slug, type);
        }
        return;
      }

      // v2.10.0 — Column click (selezione, no edit). Pattern identico a section.
      // CHECK PRIMA della section: la column e\` piu\` specifica (sub-div annidato
      // dentro la section). Se l'utente clicca un blocco editabile dentro la
      // column (es. <EditableHeading>) quello vince comunque, perche\` il check
      // [data-kiwi-block] e\` gia\` PRIMA di questo blocco.
      const columnEl = target.closest<HTMLElement>('[data-kiwi-column]');
      if (columnEl) {
        const id = columnEl.dataset.kiwiColumn || '';
        // Cleanup di tutte le altre selezioni (text/image/video/icon/social/section)
        clearAllMediaSelections();
        document
          .querySelectorAll<HTMLElement>('.kiwi-section-selected')
          .forEach((el) => el.classList.remove('kiwi-section-selected'));
        document
          .querySelectorAll<HTMLElement>('.kiwi-column-selected')
          .forEach((el) => el.classList.remove('kiwi-column-selected'));
        columnEl.classList.add('kiwi-column-selected');
        setSelection({ kind: 'column', el: columnEl, id });
        send('KIWI_BLOCK_SELECTED', {
          kind: 'column',
          id,
          slug: columnEl.dataset.kiwiColumnSlug || '',
          label: columnEl.dataset.kiwiColumnLabel || '',
          rect: columnEl.getBoundingClientRect().toJSON(),
        });
        return;
      }

      // Section click (selezione, no edit)
      const sectionEl = target.closest<HTMLElement>('[data-kiwi-section]');
      if (sectionEl) {
        const id = sectionEl.dataset.kiwiSection || '';
        setSelection({ kind: 'section', el: sectionEl, id });
        send('KIWI_BLOCK_SELECTED', {
          kind: 'section',
          id,
          slug: sectionEl.dataset.kiwiSectionSlug || '',
          label: sectionEl.dataset.kiwiSectionLabel || '',
          rect: sectionEl.getBoundingClientRect().toJSON(),
        });
        return;
      }

      // v2.11.0 — Click su QUALUNQUE <a> non wrappato come <EditableLink>:
      // emit `KIWI_LINK_CLICKED_UNWRAPPED` con href/text/target/rel/sourcePath.
      // Il parent apre un popover "Modifica link" (NON apre il link). Comporta-
      // mento: ovunque ci sia un link, cliccandoci nell'editor non si naviga
      // ma si modifica.
      //
      // Eccezioni che NON intercettiamo (lasciamo native):
      //  - Link dentro [data-kiwi-block] / [data-kiwi-section] (sono editabili
      //    dai loro handler dedicati).
      //  - Link con [data-kiwi-allow-click] (opt-out esplicito).
      //  - tel:/mailto:/sms: -> gia` editabili tramite <EditableLink linkType=
      //    'tel|mailto'>; lasciamo passare al fallback KIWI_NON_EDITABLE_CLICKED.
      //  - Submit/reset di form (gestiti dal flusso form).
      const anchorEl = target.closest<HTMLAnchorElement>('a');
      if (
        anchorEl &&
        !anchorEl.closest('[data-kiwi-block]') &&
        !anchorEl.closest('[data-kiwi-section]') &&
        !anchorEl.hasAttribute('data-kiwi-allow-click') &&
        !anchorEl.closest('[data-kiwi-allow-click]') &&
        !anchorEl.hasAttribute('data-kiwi-page')
      ) {
        const href = anchorEl.getAttribute('href') || '';
        // Skip tel:/mailto:/sms: -> li gestiamo come prima (KIWI_NON_EDITABLE_
        // CLICKED via fallback sotto, oppure click nativo dentro un form).
        if (href && !/^(tel|mailto|sms):/i.test(href)) {
          e.preventDefault();
          e.stopPropagation();
          const label =
            anchorEl.getAttribute('aria-label') ||
            anchorEl.textContent?.trim().slice(0, 60) ||
            href;
          send('KIWI_LINK_CLICKED_UNWRAPPED', {
            href,
            text: label,
            target: anchorEl.target || '_self',
            rel: anchorEl.rel || '',
            sourcePath: window.location.pathname,
            rect: anchorEl.getBoundingClientRect().toJSON(),
          });
          return;
        }
      }

      // Click su elemento "interattivo" non editabile (button/img/video/iframe
      // non-Maps + <a> con tel:/mailto:/sms: residui) -> fallback emit
      // KIWI_NON_EDITABLE_CLICKED. I link http(s) sono gia` stati intercettati
      // sopra dal branch v2.11.0 KIWI_LINK_CLICKED_UNWRAPPED.
      const interactive = target.closest<HTMLElement>('a, button, img, video, iframe');
      if (
        interactive &&
        // ENFRIO: nav links (data-kiwi-page) keep navigating.
        !interactive.hasAttribute('data-kiwi-page') &&
        !interactive.closest('[data-kiwi-block]') &&
        !interactive.closest('[data-kiwi-section]') &&
        !interactive.hasAttribute('data-kiwi-allow-click') &&
        !interactive.closest('[data-kiwi-allow-click]') &&
        !(
          interactive instanceof HTMLButtonElement &&
          (interactive.type === 'submit' || interactive.type === 'reset')
        ) &&
        !interactive.closest('form') &&
        !(
          interactive instanceof HTMLAnchorElement &&
          /^(tel|mailto|sms):/i.test(interactive.getAttribute('href') || '')
        )
      ) {
        e.preventDefault();
        e.stopPropagation();
        const label =
          interactive.getAttribute('aria-label') ||
          interactive.textContent?.trim().slice(0, 60) ||
          interactive.tagName.toLowerCase();
        send('KIWI_NON_EDITABLE_CLICKED', {
          tag: interactive.tagName.toLowerCase(),
          label,
          rect: interactive.getBoundingClientRect().toJSON(),
        });
        return;
      }

      // Click fuori → deselect
      setSelection({ kind: 'none' });
      blurAllEditable();
      clearAllMediaSelections();
      document
        .querySelectorAll<HTMLElement>('.kiwi-section-selected')
        .forEach((el) => el.classList.remove('kiwi-section-selected'));
      document
        .querySelectorAll<HTMLElement>('.kiwi-column-selected')
        .forEach((el) => el.classList.remove('kiwi-column-selected'));
      document.querySelectorAll<HTMLElement>('.kiwi-image-hint').forEach((el) => el.remove());
      send('KIWI_DESELECT');
    }

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  // === Doppio click su immagine/video → modalita` "precision" (8 maniglie) =
  // v2.7.0 UX shift: il click singolo apre la libreria (gestito dal gesture
  // controller below). Il doppio click attiva la modalita` precision per
  // mostrare le 8 maniglie resize + drag handle dedicato.

  useEffect(() => {
    function onDblClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const blockEl = target.closest<HTMLElement>('[data-kiwi-block]');
      if (!blockEl) return;
      const type = blockEl.dataset.kiwiType || '';
      const slug = blockEl.dataset.kiwiBlock || '';
      if (type === 'image') {
        e.preventDefault();
        e.stopPropagation();
        // Cancella la libreria appena aperta dal click precedente
        send('KIWI_CLOSE_ASSET_LIBRARY');
        activateImage(blockEl, slug);
      } else if (type === 'video') {
        e.preventDefault();
        e.stopPropagation();
        send('KIWI_CLOSE_ASSET_LIBRARY');
        activateVideo(blockEl, slug);
      }
    }
    document.addEventListener('dblclick', onDblClick, true);
    return () => document.removeEventListener('dblclick', onDblClick, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // === v2.7.0 Image/Video press-and-decide gesture ===========================
  // Mouse down su image/video block:
  //  - mouse spostato > 4px o tenuto fermo > 250ms = drag mode
  //  - mouse rilasciato sotto soglia = click puro = apre libreria
  // Niente piu` "click = selezione" — la selezione (8 maniglie) si attiva
  // solo via dblclick (vedi sopra).
  useEffect(() => {
    let armed: {
      el: HTMLElement;
      slug: string;
      kind: 'image' | 'video';
      startX: number;
      startY: number;
      baseTx: number;
      baseTy: number;
      dragging: boolean;
    } | null = null;

    function onMouseDown(e: MouseEvent) {
      if (e.button !== 0) return;
      const t = e.target as HTMLElement | null;
      if (!t) return;
      // ignora UI overlay
      if (t.closest('.kiwi-overlay-handle')) return;
      if (t.closest('.kiwi-resize-handle')) return;
      if (t.closest('.kiwi-section-resize-handle')) return;
      if (t.closest('.kiwi-section-drag-handle')) return;
      if (t.closest('.kiwi-text-drag-handle')) return;
      if (t.closest('.kiwi-media-hover-overlay')) return;

      const blockEl = t.closest<HTMLElement>('[data-kiwi-block]');
      if (!blockEl) return;
      const kind = blockEl.dataset.kiwiType;
      if (kind !== 'image' && kind !== 'video') return;

      // v2.7.1 BUG FIX: se l'immagine/video e` gia` selezionata in precision
      // mode (dblclick precedente -> 8 maniglie), lascia gestire il drag al
      // listener locale di MediaResizeAndDrag. Senza, click sul corpo del
      // media in precision mode riapriva la libreria.
      if (
        (kind === 'image' || kind === 'video') &&
        blockEl.classList.contains(kind === 'image' ? 'kiwi-image-selected' : 'kiwi-video-selected')
      ) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      const cur = parseTranslate(blockEl);
      armed = {
        el: blockEl,
        slug: blockEl.dataset.kiwiBlock || '',
        kind: kind as 'image' | 'video',
        startX: e.clientX,
        startY: e.clientY,
        baseTx: cur.x,
        baseTy: cur.y,
        dragging: false,
      };
    }

    function onMouseMove(e: MouseEvent) {
      if (!armed) return;
      // ENFRIO: fixed layout — never start dragging a no-drag image.
      if (armed.el.dataset.kiwiNoDrag === '1') return;
      const dx = e.clientX - armed.startX;
      const dy = e.clientY - armed.startY;
      const dist = Math.hypot(dx, dy);
      if (!armed.dragging) {
        if (dist > DRAG_THRESHOLD_PX) {
          armed.dragging = true;
          armed.el.classList.add('kiwi-media-dragging');
          document.body.style.cursor = 'grabbing';
          // Nasconde l'hover overlay durante il drag
          document
            .querySelector('.kiwi-media-hover-overlay')
            ?.classList.remove('kiwi-media-hover-visible');
        } else {
          return;
        }
      }
      // v2.7.2: snap to grid 8px. Shift = micro 1px per posizionamento fine.
      const SNAP = e.shiftKey ? 1 : 8;
      const tx = Math.round((armed.baseTx + dx) / SNAP) * SNAP;
      const ty = Math.round((armed.baseTy + dy) / SNAP) * SNAP;
      armed.el.style.transform = `translate(${tx}px, ${ty}px)`;
    }

    function onMouseUp(e: MouseEvent) {
      if (!armed) return;
      const a = armed;
      armed = null;
      document.body.style.cursor = '';
      a.el.classList.remove('kiwi-media-dragging');

      if (a.dragging) {
        const cur = parseTranslate(a.el);
        send(a.kind === 'image' ? 'KIWI_IMAGE_MOVED' : 'KIWI_VIDEO_MOVED', {
          slug: a.slug,
          x: Math.round(cur.x),
          y: Math.round(cur.y),
        });
      } else {
        // Click puro sotto soglia → apre libreria
        e.preventDefault();
        e.stopPropagation();
        send('KIWI_MEDIA_DOUBLECLICK', { kind: a.kind, slug: a.slug });
      }
    }

    function onMouseLeave() {
      if (armed && armed.dragging) {
        document.body.style.cursor = '';
        armed.el.classList.remove('kiwi-media-dragging');
      }
      armed = null;
    }

    document.addEventListener('mousedown', onMouseDown, true);
    document.addEventListener('mousemove', onMouseMove, true);
    document.addEventListener('mouseup', onMouseUp, true);
    document.addEventListener('mouseleave', onMouseLeave);
    return () => {
      document.removeEventListener('mousedown', onMouseDown, true);
      document.removeEventListener('mousemove', onMouseMove, true);
      document.removeEventListener('mouseup', onMouseUp, true);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // === v2.7.0 Text drag-vs-edit gesture ======================================
  // Mouse down su text block:
  //  - threshold 4px = drag mode (transform translate)
  //  - hold 250ms senza muovere = drag mode (entra anche se l'utente esita
  //    prima di trascinare). Questo allinea il comportamento al manifest
  //    ("hold 250ms = drag mode") — la versione precedente faceva l'opposto
  //    (hold = activateText) impedendo di fatto il drag.
  //  - rilascio sotto soglia E prima del HOLD = activateText (caret)
  //  - se gia` in edit mode (.kiwi-edit-active) = passthrough (selezione caret)
  //
  // FIX v2.7.3: contentEditable e` impostato a 'false' IMMEDIATAMENTE su
  // mousedown e ripristinato su mouseup-sotto-soglia. Senza questo passo, il
  // browser inizia la text-selection nativa sui paragrafi multi-riga e
  // l'utente percepisce che il drag "non parte". Il valore originale viene
  // memorizzato in `prevContentEditable` per ripristino fedele.
  useEffect(() => {
    let pending: {
      blockEl: HTMLElement;
      slug: string;
      type: string;
      startX: number;
      startY: number;
      baseTx: number;
      baseTy: number;
      dragging: boolean;
      pressTimer: number | null;
      prevContentEditable: string;
    } | null = null;

    function startDrag() {
      if (!pending) return;
      pending.dragging = true;
      document.body.style.cursor = 'grabbing';
      // contentEditable e` gia` 'false' da onDown — manteniamo idempotenza.
      pending.blockEl.contentEditable = 'false';
      pending.blockEl.classList.add('kiwi-text-dragging');
      pending.blockEl.style.transition = 'none';
      // Sopprime selezione testo nativa eventualmente iniziata prima.
      window.getSelection()?.removeAllRanges();
    }

    function onDown(e: MouseEvent) {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement | null;
      if (!target) return;
      // Escape: UI handle, hover overlay
      if (target.closest('.kiwi-overlay-handle')) return;
      // (selettore .kiwi-resize-handle gestito altrove — quello immagine non esiste)
      if (target.closest('.kiwi-section-resize-handle')) return;
      if (target.closest('.kiwi-section-drag-handle')) return;
      if (target.closest('.kiwi-text-drag-handle')) return;
      if (target.closest('.kiwi-resize-handle')) return;
      if (target.closest('.kiwi-media-hover-overlay')) return;

      const blockEl = target.closest<HTMLElement>('[data-kiwi-block]');
      if (!blockEl) return;
      const type = blockEl.dataset.kiwiType || 'text';
      if (!TEXT_DRAG_TYPES.has(type)) return;
      if (blockEl.dataset.kiwiNoDrag === '1') return;

      // Gia` in edit mode: passthrough per selezione caret
      if (blockEl.classList.contains('kiwi-edit-active')) return;

      // Widget interattivi nested (input, button, ...): rispetta
      const interactiveInside = target.closest('a, button, input, textarea, select');
      if (interactiveInside && interactiveInside !== blockEl) return;

      e.preventDefault();

      // FIX v2.7.3: disabilita contentEditable IMMEDIATAMENTE per impedire al
      // browser di iniziare la text-selection nativa. Salva il valore
      // originale per ripristino fedele in onUp (se l'utente non draggava).
      const prevContentEditable = blockEl.contentEditable;
      blockEl.contentEditable = 'false';

      const cur = parseTranslate(blockEl);
      pending = {
        blockEl,
        slug: blockEl.dataset.kiwiBlock || '',
        type,
        startX: e.clientX,
        startY: e.clientY,
        baseTx: cur.x,
        baseTy: cur.y,
        dragging: false,
        prevContentEditable,
        pressTimer: window.setTimeout(() => {
          // FIX v2.7.3: hold senza muovere = ENTRA IN DRAG (allinea manifest).
          // Versione precedente entrava in edit mode qui — bug semantico.
          if (pending && !pending.dragging) {
            startDrag();
          }
        }, HOLD_TO_EDIT_MS),
      };
    }

    function onMove(e: MouseEvent) {
      if (!pending) return;
      if (!pending.dragging) {
        const dx = e.clientX - pending.startX;
        const dy = e.clientY - pending.startY;
        if (Math.hypot(dx, dy) > DRAG_THRESHOLD_PX) {
          if (pending.pressTimer) {
            window.clearTimeout(pending.pressTimer);
            pending.pressTimer = null;
          }
          startDrag();
        } else {
          return;
        }
      }
      e.preventDefault();
      const dx = e.clientX - pending.startX;
      const dy = e.clientY - pending.startY;
      // v2.7.2: snap to grid 8px (Shift = 1px micro)
      const SNAP = e.shiftKey ? 1 : 8;
      const tx = Math.round((pending.baseTx + dx) / SNAP) * SNAP;
      const ty = Math.round((pending.baseTy + dy) / SNAP) * SNAP;
      pending.blockEl.style.transform = `translate(${tx}px, ${ty}px)`;
    }

    function onUp(e: MouseEvent) {
      if (!pending) return;
      if (pending.pressTimer) {
        window.clearTimeout(pending.pressTimer);
        pending.pressTimer = null;
      }
      if (pending.dragging) {
        e.preventDefault();
        e.stopPropagation();
        document.body.style.cursor = '';
        pending.blockEl.classList.remove('kiwi-text-dragging');
        pending.blockEl.style.transition = '';
        const cur = parseTranslate(pending.blockEl);
        send('KIWI_TEXT_MOVED', {
          slug: pending.slug,
          x: Math.round(cur.x),
          y: Math.round(cur.y),
        });
        // Sopprimi il prossimo `click` post-drag (one-shot capture)
        const swallow = (ev: MouseEvent) => {
          ev.preventDefault();
          ev.stopPropagation();
          document.removeEventListener('click', swallow, true);
        };
        document.addEventListener('click', swallow, true);
      } else {
        // FIX v2.7.3: NON draggava = click puro o tap breve.
        // Ripristina contentEditable allo stato precedente PRIMA che il click
        // handler primario (riga 472+) chiami activateText, cosi` il flusso
        // standard puo` ri-abilitare contentEditable='true'.
        pending.blockEl.contentEditable = pending.prevContentEditable;
      }
      pending = null;
    }

    function onLeave() {
      if (pending) {
        if (pending.pressTimer) window.clearTimeout(pending.pressTimer);
        if (pending.dragging) {
          document.body.style.cursor = '';
          pending.blockEl.classList.remove('kiwi-text-dragging');
          pending.blockEl.style.transition = '';
        } else {
          // Ripristina contentEditable se l'utente esce dalla finestra senza
          // mouseup (es. drag fuori dall'iframe). Senza, il blocco resta
          // permanentemente non-editabile.
          pending.blockEl.contentEditable = pending.prevContentEditable;
        }
        pending = null;
      }
    }

    // Listener in CAPTURE phase per battere eventuali handler nested
    // (link, contenitori con stopPropagation) e per intercettare prima che
    // il browser inizi la text-selection nativa.
    document.addEventListener('mousedown', onDown, true);
    document.addEventListener('mousemove', onMove, true);
    document.addEventListener('mouseup', onUp, true);
    document.addEventListener('mouseleave', onLeave);
    return () => {
      document.removeEventListener('mousedown', onDown, true);
      document.removeEventListener('mousemove', onMove, true);
      document.removeEventListener('mouseup', onUp, true);
      document.removeEventListener('mouseleave', onLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function blurAllEditable() {
    document.querySelectorAll<HTMLElement>('[contenteditable="true"]').forEach((el) => {
      el.contentEditable = 'false';
      el.classList.remove('kiwi-edit-active');
    });
  }

  // === Activate text =========================================================

  function activateText(el: HTMLElement, slug: string, type: string) {
    blurAllEditable();
    clearAllMediaSelections(el);
    el.contentEditable = 'true';
    el.classList.add('kiwi-edit-active');
    el.classList.add('kiwi-text-selected');
    el.focus();

    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);

    setSelection({ kind: 'text', el, slug });

    send('KIWI_BLOCK_SELECTED', {
      kind: 'text',
      slug,
      type,
      value: readRawText(el),
      label: el.dataset.kiwiLabel || slug,
      group: el.dataset.kiwiGroup || '',
      rect: el.getBoundingClientRect().toJSON(),
      currentStyle: readEffectiveStyle(el),
      // Per <EditableLink>: il blocco testo include anche i metadati del link
      // (hrefSlug + linkType + linkHref attuale) cosi` il parent puo` aprire
      // il LinkEditorPopover insieme alla FloatingTextToolbar.
      linkHrefSlug: el.dataset.kiwiLinkHrefSlug || '',
      linkType: el.dataset.kiwiLinkType || '',
      linkHref: el.dataset.kiwiLinkHref || '',
    });

    // Marker per evitare listener leak: se l'utente seleziona piu` volte lo
    // stesso testo senza che `blur` parta nel mezzo (focus rubato da altre
    // cause), gli onInput/onBlur si accumulerebbero. Salto la registrazione
    // se gia` wirato.
    if (el.dataset.kiwiTextWired === '1') return;
    el.dataset.kiwiTextWired = '1';

    const onInput = () =>
      debouncedDirty(slug, type === 'richtext' ? el.innerHTML : readRawText(el));
    const onBlur = () => {
      el.contentEditable = 'false';
      el.classList.remove('kiwi-edit-active');
      flushDirty(slug, type === 'richtext' ? el.innerHTML : readRawText(el));
      el.removeEventListener('input', onInput);
      el.removeEventListener('blur', onBlur);
      delete el.dataset.kiwiTextWired;
    };
    el.addEventListener('input', onInput);
    el.addEventListener('blur', onBlur);
  }

  function debouncedDirty(slug: string, value: string) {
    const existing = dirtyTimers.current.get(slug);
    if (existing) clearTimeout(existing);
    const t = setTimeout(() => flushDirty(slug, value), 500);
    dirtyTimers.current.set(slug, t);
  }

  function flushDirty(slug: string, value: string) {
    dirtyTimers.current.delete(slug);
    send('KIWI_BLOCK_DIRTY', { slug, value });
  }

  // === Activate image (selezione + maniglie resize + drag posizione) ========

  function activateImage(el: HTMLElement, slug: string) {
    blurAllEditable();
    clearAllMediaSelections(el);
    el.classList.add('kiwi-image-selected');

    setSelection({ kind: 'image', el, slug });
    send('KIWI_BLOCK_SELECTED', {
      kind: 'image',
      slug,
      type: 'image',
      value: resolveImageSrc(el),
      label: el.dataset.kiwiLabel || slug,
      group: el.dataset.kiwiGroup || '',
      rect: el.getBoundingClientRect().toJSON(),
      width: el.clientWidth,
      height: el.clientHeight,
    });
  }

  // === Activate video ========================================================

  function activateVideo(el: HTMLElement, slug: string) {
    blurAllEditable();
    clearAllMediaSelections(el);
    el.classList.add('kiwi-video-selected');

    setSelection({ kind: 'video', el, slug });
    const innerVideo = el instanceof HTMLVideoElement ? el : el.querySelector<HTMLVideoElement>('video');
    send('KIWI_BLOCK_SELECTED', {
      kind: 'video',
      slug,
      type: 'video',
      value: resolveVideoSrc(el),
      label: el.dataset.kiwiLabel || slug,
      group: el.dataset.kiwiGroup || '',
      rect: el.getBoundingClientRect().toJSON(),
      width: el.clientWidth,
      height: el.clientHeight,
      poster: innerVideo?.poster || '',
    });
  }

  // === Activate icon =========================================================

  function activateIcon(el: HTMLElement, slug: string) {
    blurAllEditable();
    clearAllMediaSelections(el);
    el.classList.add('kiwi-icon-selected');

    // Se l'icona e` annidata dentro un <EditableLink> (es. icona telefono
    // dentro la CTA "Chiama ora"), allega il contesto del link in modo che il
    // parent possa aprire ANCHE il LinkEditorPopover (oltre all'IconPicker)
    // per modificare il numero/email/url associato.
    const linkAncestor = el.closest<HTMLElement>('[data-kiwi-link-href-slug]');
    let linkContext:
      | {
          hrefSlug: string;
          linkType: 'url' | 'tel' | 'mailto' | 'email';
          currentHref: string;
          textSlug: string;
          label: string;
        }
      | undefined;
    if (linkAncestor) {
      const rawType = linkAncestor.dataset.kiwiLinkType || 'url';
      const linkType: 'url' | 'tel' | 'mailto' | 'email' =
        rawType === 'tel' || rawType === 'mailto' || rawType === 'email'
          ? rawType
          : 'url';
      linkContext = {
        hrefSlug: linkAncestor.dataset.kiwiLinkHrefSlug || '',
        linkType,
        currentHref: linkAncestor.dataset.kiwiLinkHref || '',
        textSlug: linkAncestor.dataset.kiwiBlock || '',
        label: linkAncestor.dataset.kiwiLabel || linkAncestor.dataset.kiwiBlock || '',
      };
    }

    send('KIWI_BLOCK_SELECTED', {
      kind: 'icon',
      slug,
      type: 'icon',
      value: el.dataset.kiwiIconName || '',
      iconName: el.dataset.kiwiIconName || '',
      label: el.dataset.kiwiLabel || slug,
      group: el.dataset.kiwiGroup || '',
      rect: el.getBoundingClientRect().toJSON(),
      ...(linkContext ? { linkContext } : {}),
    });
  }

  // === Activate social =======================================================

  function activateSocial(el: HTMLElement, slug: string) {
    blurAllEditable();
    clearAllMediaSelections(el);
    el.classList.add('kiwi-social-selected');

    send('KIWI_BLOCK_SELECTED', {
      kind: 'social',
      slug,
      type: 'social',
      value: el.dataset.kiwiLinkHref || '',
      socialPlatform: el.dataset.kiwiSocialPlatform || '',
      linkHref: el.dataset.kiwiLinkHref || '',
      label: el.dataset.kiwiLabel || slug,
      group: el.dataset.kiwiGroup || '',
      rect: el.getBoundingClientRect().toJSON(),
    });
  }

  // === Section drag-drop reorder =============================================

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      const handle = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        '.kiwi-section-drag-handle',
      );
      if (!handle) return;
      e.preventDefault();
      const sectionEl = handle.closest<HTMLElement>('[data-kiwi-section]');
      if (!sectionEl) return;
      dragSourceId.current = sectionEl.dataset.kiwiSection || null;
      sectionEl.classList.add('kiwi-section-dragging');
      document.body.style.cursor = 'grabbing';
    }

    function onMouseMove(e: MouseEvent) {
      if (!dragSourceId.current) return;
      document
        .querySelectorAll<HTMLElement>('[data-kiwi-section]')
        .forEach((el) => el.classList.remove('kiwi-section-drop-target'));
      const overEl = document
        .elementsFromPoint(e.clientX, e.clientY)
        .find((n) =>
          (n as HTMLElement).hasAttribute?.('data-kiwi-section'),
        ) as HTMLElement | undefined;
      if (overEl && overEl.dataset.kiwiSection !== dragSourceId.current) {
        overEl.classList.add('kiwi-section-drop-target');
      }
    }

    function onMouseUp(e: MouseEvent) {
      if (!dragSourceId.current) return;
      document.body.style.cursor = '';
      const overEl = document
        .elementsFromPoint(e.clientX, e.clientY)
        .find((n) =>
          (n as HTMLElement).hasAttribute?.('data-kiwi-section'),
        ) as HTMLElement | undefined;
      const dropId = overEl?.dataset.kiwiSection;
      const sourceId = dragSourceId.current;
      dragSourceId.current = null;
      document.querySelectorAll<HTMLElement>('[data-kiwi-section]').forEach((el) => {
        el.classList.remove('kiwi-section-dragging');
        el.classList.remove('kiwi-section-drop-target');
      });

      if (dropId && dropId !== sourceId && sourceId) {
        const all = Array.from(document.querySelectorAll<HTMLElement>('[data-kiwi-section]'));
        const ordered = all.map((el) => el.dataset.kiwiSection!);
        const fromIdx = ordered.indexOf(sourceId);
        const toIdx = ordered.indexOf(dropId);
        if (fromIdx >= 0 && toIdx >= 0) {
          const [moved] = ordered.splice(fromIdx, 1);
          ordered.splice(toIdx, 0, moved);
          send('KIWI_SECTIONS_REORDERED', { orderedIds: ordered });
        }
      }
    }

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  // === Image/Video hover overlay PREMIUM (centrale, icona grossa) ===========
  // Pattern Wix/Squarespace/italiaonline: hover su media editabile = overlay
  // scuro full-image con icona swap GROSSA al centro + label "Cambia immagine"
  // / "Cambia video". L'overlay e` pointer-events:none cosi` il click
  // attraversa al media sotto. Outline tratteggiato giallo brand (CSS hover)
  // resta presente per perimetrarlo. Animazione 160ms scale+opacity.

  useEffect(() => {
    let overlayEl: HTMLDivElement | null = null;
    let currentEl: HTMLElement | null = null;
    let currentKind: 'image' | 'video' = 'image';
    let rafId: number | null = null;

    function ensureOverlay(): HTMLDivElement {
      if (overlayEl) return overlayEl;
      const el = document.createElement('div');
      el.className = 'kiwi-media-hover-overlay';
      el.innerHTML = [
        '<div class="kiwi-media-hover-inner">',
        '<div class="kiwi-media-hover-icon">',
        '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">',
        '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>',
        '<circle cx="9" cy="9" r="2"/>',
        '<path d="M21 15l-5-5L5 21"/>',
        '</svg>',
        '</div>',
        '<div class="kiwi-media-hover-label">Cambia immagine</div>',
        '</div>',
      ].join('');
      document.body.appendChild(el);
      overlayEl = el;
      return el;
    }

    function positionOverlay(el: HTMLElement) {
      if (!overlayEl) return;
      const r = el.getBoundingClientRect();
      overlayEl.style.left = `${r.left}px`;
      overlayEl.style.top = `${r.top}px`;
      overlayEl.style.width = `${r.width}px`;
      overlayEl.style.height = `${r.height}px`;
      // Adatta dimensione icona alle media piccole (es. avatar 64x64)
      const min = Math.min(r.width, r.height);
      const iconBox = overlayEl.querySelector<HTMLDivElement>('.kiwi-media-hover-icon');
      const label = overlayEl.querySelector<HTMLDivElement>('.kiwi-media-hover-label');
      if (iconBox) {
        const iconSize = Math.max(40, Math.min(72, Math.round(min * 0.22)));
        iconBox.style.width = `${iconSize}px`;
        iconBox.style.height = `${iconSize}px`;
        const svg = iconBox.querySelector<SVGElement>('svg');
        if (svg) {
          const svgSize = Math.round(iconSize * 0.5);
          svg.setAttribute('width', String(svgSize));
          svg.setAttribute('height', String(svgSize));
        }
      }
      if (label) {
        // Su media molto piccoli nascondo la label, lascio solo l'icona
        label.style.display = min < 140 ? 'none' : 'block';
      }
    }

    function show(el: HTMLElement, kind: 'image' | 'video') {
      const o = ensureOverlay();
      currentEl = el;
      currentKind = kind;
      const label = o.querySelector<HTMLDivElement>('.kiwi-media-hover-label');
      if (label) label.textContent = kind === 'video' ? 'Cambia video' : 'Cambia immagine';
      positionOverlay(el);
      o.classList.add('kiwi-media-hover-visible');
    }

    function hide() {
      if (overlayEl) overlayEl.classList.remove('kiwi-media-hover-visible');
      currentEl = null;
    }

    function onMouseOver(e: MouseEvent) {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const blockEl = t.closest<HTMLElement>(
        '[data-kiwi-block][data-kiwi-type="image"], [data-kiwi-block][data-kiwi-type="video"]',
      );
      if (blockEl) {
        const k = (blockEl.dataset.kiwiType === 'video' ? 'video' : 'image') as 'image' | 'video';
        if (blockEl !== currentEl || k !== currentKind) show(blockEl, k);
      }
    }

    function onMouseOut(e: MouseEvent) {
      const related = e.relatedTarget as HTMLElement | null;
      if (!currentEl) return;
      if (related && currentEl.contains(related)) return;
      hide();
    }

    function onScrollOrResize() {
      if (!currentEl || !overlayEl) return;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => positionOverlay(currentEl!));
    }

    document.addEventListener('mouseover', onMouseOver, true);
    document.addEventListener('mouseout', onMouseOut, true);
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);

    return () => {
      document.removeEventListener('mouseover', onMouseOver, true);
      document.removeEventListener('mouseout', onMouseOut, true);
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
      if (rafId) cancelAnimationFrame(rafId);
      overlayEl?.remove();
      overlayEl = null;
    };
  }, []);

  // === v2.7.3 Hover-resize tracking ==========================================
  // Setta `hoveredMedia` quando il mouse entra su un'immagine/video editabile.
  // Le 8 maniglie di resize si mostrano SEMPRE (anche senza precision selection),
  // cosi` il cliente puo` prendere uno spigolo al primo contatto. Le maniglie
  // sono `position: fixed` fuori dal block tree: il mouse che si muove SU una
  // maniglia genera mouseout sul block ma `relatedTarget` e` la maniglia stessa
  // — riconosciuta via class `.kiwi-resize-handle` e l'hover NON viene perso.

  useEffect(() => {
    function onMouseOver(e: MouseEvent) {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      // Mouse sopra una maniglia o overlay: mantieni l'hover corrente
      if (t.closest('.kiwi-resize-handle')) return;
      const blockEl = t.closest<HTMLElement>(
        '[data-kiwi-block][data-kiwi-type="image"], [data-kiwi-block][data-kiwi-type="video"]',
      );
      if (!blockEl) return;
      // Rispetta no-drag (es. media in widget interattivi che non vanno mossi)
      if (blockEl.dataset.kiwiNoDrag === '1') return;
      const slug = blockEl.dataset.kiwiBlock || '';
      const kind = (blockEl.dataset.kiwiType === 'video' ? 'video' : 'image') as
        | 'image'
        | 'video';
      setHoveredMedia((prev) => {
        if (prev && prev.el === blockEl && prev.kind === kind) return prev;
        return { el: blockEl, slug, kind };
      });
    }

    function onMouseOut(e: MouseEvent) {
      const related = e.relatedTarget as HTMLElement | null;
      // Se il mouse si sposta su una maniglia di resize, NON perdere l'hover
      if (related && related.closest && related.closest('.kiwi-resize-handle')) return;
      // Se il mouse e` ancora dentro lo stesso block, ignora
      const t = e.target as HTMLElement | null;
      const fromBlock = t?.closest<HTMLElement>(
        '[data-kiwi-block][data-kiwi-type="image"], [data-kiwi-block][data-kiwi-type="video"]',
      );
      if (fromBlock && related && fromBlock.contains(related)) return;
      // Mouse uscito completamente dal media (e non su una maniglia)
      setHoveredMedia(null);
    }

    document.addEventListener('mouseover', onMouseOver, true);
    document.addEventListener('mouseout', onMouseOut, true);
    return () => {
      document.removeEventListener('mouseover', onMouseOver, true);
      document.removeEventListener('mouseout', onMouseOut, true);
    };
  }, []);

  // Pulisci hovered se il media viene smontato (cambio pagina SPA, ecc.)
  useEffect(() => {
    if (!hoveredMedia) return;
    if (!document.contains(hoveredMedia.el)) {
      setHoveredMedia(null);
    }
  }, [hoveredMedia, pathname]);

  // === Section resize handle (bordo basso, drag = altezza) ==================

  useEffect(() => {
    if (selection.kind !== 'section') return;
    const sec = selection.el;
    const id = selection.id;
    sec.classList.add('kiwi-section-selected');
    let startY = 0;
    let startH = 0;

    function onHandleMouseDown(e: MouseEvent) {
      e.preventDefault();
      e.stopPropagation();
      startY = e.clientY;
      startH = sec.clientHeight;
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    }
    function onMove(e: MouseEvent) {
      const dy = e.clientY - startY;
      const newH = Math.max(120, Math.min(4000, startH + dy));
      sec.style.minHeight = `${newH}px`;
    }
    function onUp() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      const finalH = sec.style.minHeight || `${sec.clientHeight}px`;
      send('KIWI_SECTION_RESIZED', { sectionId: id, height: finalH });
    }

    const handle = document.querySelector<HTMLElement>('.kiwi-section-resize-handle');
    handle?.addEventListener('mousedown', onHandleMouseDown);
    return () => {
      handle?.removeEventListener('mousedown', onHandleMouseDown);
      sec.classList.remove('kiwi-section-selected');
    };
  }, [selection]);

  // === Column selection visual feedback (v2.10.0) ============================
  // Gestione simmetrica a section: applica la classe `.kiwi-column-selected`
  // quando una column e\` selezionata e la rimuove al cleanup (cambio selezione,
  // unmount). Il click handler applica la classe in modo sincrono, ma questo
  // effect garantisce il cleanup anche se la selezione cambia da postMessage.
  useEffect(() => {
    if (selection.kind !== 'column') return;
    const col = selection.el;
    col.classList.add('kiwi-column-selected');
    return () => {
      col.classList.remove('kiwi-column-selected');
    };
  }, [selection]);

  // === postMessage IN dal parent =============================================

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (!ALLOWED_PARENT_ORIGINS.includes(e.origin)) return;
      const msg = e.data;
      if (!msg || typeof msg !== 'object' || msg.source !== 'kiwi-editor') return;

      switch (msg.type) {
        case 'KIWI_BLOCK_UPDATE': {
          const slug = String(msg.slug || '');
          const value = String(msg.value ?? '');
          // ENFRIO: update every element showing this block, not only the first.
          const els = Array.from(
            document.querySelectorAll<HTMLElement>(`[data-kiwi-block="${CSS.escape(slug)}"]`),
          );
          if (!els.length) return;
          for (const el of els) {
          // v2.7.0: image puo` essere <img>, wrapper con <img> figlio, oppure
          // <div> con backgroundImage CSS (EditableHeroBg).
          if (el.dataset.kiwiType === 'image') {
            if (el instanceof HTMLImageElement) {
              // ENFRIO: drop next/image srcset/sizes, or the old picture stays.
              el.removeAttribute('srcset');
              el.removeAttribute('sizes');
              el.src = value;
            } else {
              const innerImg = el.querySelector<HTMLImageElement>('img');
              if (innerImg) {
                innerImg.removeAttribute('srcset');
                innerImg.removeAttribute('sizes');
                innerImg.src = value;
              }
              else el.style.backgroundImage = value ? `url("${value}")` : '';
            }
          } else if (el.dataset.kiwiType === 'video') {
            // Aggiorna src del video. <video> nativo o wrapper.
            if (el instanceof HTMLVideoElement) {
              el.src = value;
              try { el.load(); } catch { /* ignore */ }
            } else {
              const innerVid = el.querySelector<HTMLVideoElement>('video');
              if (innerVid) {
                innerVid.src = value;
                try { innerVid.load(); } catch { /* ignore */ }
              }
            }
          } else if (el.dataset.kiwiType === 'richtext') {
            el.innerHTML = value;
          } else {
            el.innerText = value;
          }
          }
          break;
        }
        case 'KIWI_ICON_UPDATE': {
          // v2.6.0: rimosso `send('KIWI_BLOCK_DIRTY', ...)` — il parent
          // salva direttamente via PATCH by-slug in applyIconSelection.
          // Questo handler aggiorna SOLO il DOM live.
          const slug = String(msg.slug || '');
          const iconName = String(msg.iconName || '');
          if (!slug) return;
          const el = document.querySelector<HTMLElement>(
            `[data-kiwi-block="${CSS.escape(slug)}"]`,
          );
          if (el) el.dataset.kiwiIconName = iconName;
          break;
        }
        case 'KIWI_LINK_HREF_UPDATE': {
          // v2.6.0: rimosso doppio salvataggio (vedi KIWI_ICON_UPDATE).
          const href = String(msg.href || '');
          const textSlug = String(msg.textSlug || '');
          if (!textSlug) return;
          const el = document.querySelector<HTMLElement>(
            `[data-kiwi-block="${CSS.escape(textSlug)}"]`,
          );
          if (el instanceof HTMLAnchorElement) el.href = href;
          if (el) el.dataset.kiwiLinkHref = href;
          break;
        }
        case 'KIWI_SOCIAL_URL_UPDATE': {
          // v2.6.0: rimosso doppio salvataggio (vedi KIWI_ICON_UPDATE).
          const slug = String(msg.slug || '');
          const url = String(msg.url || '');
          if (!slug) return;
          const el = document.querySelector<HTMLElement>(
            `[data-kiwi-block="${CSS.escape(slug)}"]`,
          );
          if (el) el.dataset.kiwiLinkHref = url;
          break;
        }
        case 'KIWI_BLOCK_STYLE': {
          // Applica live style overrides al block + flush al parent.
          const slug = String(msg.slug || '');
          const overrides = (msg.overrides || {}) as Record<string, string | null>;
          if (!slug) return;
          const el = document.querySelector<HTMLElement>(
            `[data-kiwi-block="${CSS.escape(slug)}"]`,
          );
          if (!el) return;
          applyStyleToElement(el, overrides);
          send('KIWI_BLOCK_STYLE_DIRTY', { slug, overrides });
          break;
        }
        case 'KIWI_THEME_UPDATE': {
          // v2.6.0: validazione anche del VALORE oltre alla chiave. Whitelist
          // pragmatica: hex color (#rgb / #rrggbb), pixel value (es. 8px),
          // numero, oppure stringa di font-family alfanum + virgole + spazi.
          // Senza questo, il sito si fida del parent per il valore CSS — e
          // un trust boundary teoricamente attaccabile.
          const tokens = msg.tokens as Record<string, string> | undefined;
          if (!tokens) return;
          const KEY_RX = /^[a-z\-]+$/;
          const VAL_RX =
            /^(#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?|-?\d+(?:\.\d+)?(?:px|rem|em|%)?|[a-zA-Z0-9 ,'"\-]+)$/;
          const root = document.documentElement;
          for (const [k, v] of Object.entries(tokens)) {
            if (!KEY_RX.test(k)) continue;
            const value = String(v).trim();
            if (!VAL_RX.test(value) || value.length > 80) continue;
            root.style.setProperty(`--kiwi-${k}`, value);
          }
          break;
        }
        case 'KIWI_NAVIGATE': {
          const path = String(msg.path || '/');
          if (path.startsWith('/') && !path.startsWith('//')) {
            router.push(path);
          }
          break;
        }
        case 'KIWI_DESELECT': {
          blurAllEditable();
          clearAllMediaSelections();
          document
            .querySelectorAll<HTMLElement>('.kiwi-section-selected')
            .forEach((el) => el.classList.remove('kiwi-section-selected'));
          document
            .querySelectorAll<HTMLElement>('.kiwi-column-selected')
            .forEach((el) => el.classList.remove('kiwi-column-selected'));
          document.querySelectorAll<HTMLElement>('.kiwi-image-hint').forEach((el) => el.remove());
          setSelection({ kind: 'none' });
          break;
        }
        case 'KIWI_SET_SECTION_VISIBILITY': {
          const sectionId = String(msg.sectionId || '');
          const visible = msg.visible !== false;
          if (!sectionId) return;
          const el = document.querySelector<HTMLElement>(
            `[data-kiwi-section="${CSS.escape(sectionId)}"]`,
          );
          if (!el) return;
          if (visible) el.classList.remove('kiwi-section-hidden');
          else el.classList.add('kiwi-section-hidden');
          break;
        }
        case 'KIWI_SECTIONS_REORDER': {
          const orderedIds = Array.isArray(msg.orderedIds) ? msg.orderedIds : [];
          if (orderedIds.length === 0) break;
          const allSections = Array.from(
            document.querySelectorAll<HTMLElement>('[data-kiwi-section]'),
          );
          if (allSections.length === 0) break;
          const parent = allSections[0].parentElement;
          if (!parent) break;
          const map = new Map(allSections.map((el) => [el.dataset.kiwiSection || '', el]));
          for (const id of orderedIds) {
            const el = map.get(String(id));
            if (el) parent.appendChild(el);
          }
          break;
        }
        case 'KIWI_SECTION_STYLE_UPDATE': {
          // v2.7+: applica live gli style override (backgroundColor,
          // backgroundImage, paddingY, paddingX, borderTop/borderBottom,
          // fullWidth, animation, overlayOpacity) su [data-kiwi-section=id].
          // v2.10.0: estratto helper top-level applyContainerStyleOverrides
          // riusato anche da KIWI_COLUMN_STYLE_UPDATE.
          const sectionId = String(msg.sectionId || '');
          const overrides = msg.overrides as Record<string, unknown> | undefined;
          if (!sectionId || !overrides || typeof overrides !== 'object') break;
          const target = document.querySelector<HTMLElement>(
            `[data-kiwi-section="${CSS.escape(sectionId)}"]`,
          );
          if (!target) break;
          applyContainerStyleOverrides(target, overrides, { allowFullWidth: true });
          break;
        }
        case 'KIWI_COLUMN_STYLE_UPDATE': {
          // v2.10.0 — applica live gli style override su [data-kiwi-column=id].
          // Stessa whitelist + sanitize di KIWI_SECTION_STYLE_UPDATE, esclusa
          // `fullWidth` (la column eredita la larghezza dalla section padre).
          const columnId = String(msg.columnId || '');
          const overrides = msg.overrides as Record<string, unknown> | undefined;
          if (!columnId || !overrides || typeof overrides !== 'object') break;
          const target = document.querySelector<HTMLElement>(
            `[data-kiwi-column="${CSS.escape(columnId)}"]`,
          );
          if (!target) break;
          applyContainerStyleOverrides(target, overrides, { allowFullWidth: false });
          break;
        }
        case 'KIWI_MAP_URL_UPDATE': {
          // v2.11.0 — Live update di un <iframe data-kiwi-type='map'>.
          // Whitelist: solo URL Google Maps embed (https://www.google.<tld>/
          // maps/embed?...). Tutto il resto e\` rifiutato silenziosamente per
          // evitare iframe ostili da postMessage manomesso.
          const slug = String(msg.slug || '');
          const src = String(msg.src || '');
          if (!slug || !src) break;
          if (!/^https?:\/\/(?:www\.)?google\.[a-z.]+\/maps\/embed\?/i.test(src)) break;
          const el = document.querySelector<HTMLElement>(
            `iframe[data-kiwi-block="${CSS.escape(slug)}"]`,
          );
          if (!el || !(el instanceof HTMLIFrameElement)) break;
          el.src = src;
          el.dataset.kiwiMapSrc = src;
          // Aggiorna anche l'address dataset se fornito (pannello lo edita).
          if (typeof msg.address === 'string') {
            el.dataset.kiwiMapAddress = msg.address;
            el.title = msg.address ? `Mappa: ${msg.address}` : 'Mappa';
          }
          break;
        }
        case 'KIWI_REQUEST_INVENTORY': {
          send('KIWI_EDIT_READY', buildInventory());
          break;
        }
        case 'KIWI_PAGE_SCAN_REQUEST': {
          // v2.9.0 — Pannello SEO: scansione on-demand della pagina corrente.
          // Il parent invia questo dopo KIWI_NAVIGATE + KIWI_EDIT_READY per
          // raccogliere images/links/headings di OGNI pagina sequenzialmente.
          const inventory = buildInventory();
          send('KIWI_PAGE_SCAN_RESULT', {
            path: window.location.pathname + window.location.search,
            inventory,
          });
          break;
        }
        case 'KIWI_EDIT_TOKEN_REFRESH': {
          // v2.12: il parent ha ri-emesso un JWT short-lived (il precedente
          // sta per scadere). Il cookie `kiwi_edit_token` e` HttpOnly, quindi
          // JS non puo` riscriverlo: deleghiamo al server POST /api/kiwi-edit/
          // init che valida il token e re-setta il cookie con la nuova exp.
          // Senza questo, dopo ~5 min il cookie scade, l'SSR torna non-edit e
          // l'overlay si "spegne" finche` l'utente non ricarica.
          const token = typeof msg.token === 'string' ? msg.token : '';
          if (!token) break;
          fetch('/api/kiwi-edit/init', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            keepalive: true,
            body: JSON.stringify({ token }),
          }).catch(() => {
            /* best-effort: al prossimo refresh il parent riproverà */
          });
          break;
        }
        case 'KIWI_TERMINATE': {
          // v2.6.1: il parent ci dice "l'utente sta chiudendo l'editor".
          // Pulisci il cookie subito (no attesa beforeunload che potrebbe
          // non scattare se il parent fa solo unmount dell'iframe senza
          // navigazione del top window).
          try {
            if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
              navigator.sendBeacon('/api/kiwi-edit/logout');
            } else {
              fetch('/api/kiwi-edit/logout', { method: 'POST', keepalive: true }).catch(() => {});
            }
          } catch {
            /* silent */
          }
          break;
        }
      }
    }

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // === Logout cookie su uscita / chiusura tab ================================
  // v2.6.1: BUG FIX critico. Senza questo, il cookie HttpOnly `kiwi_edit_token`
  // resta valido ~5 min anche dopo aver chiuso l'editor. Il cliente che apre
  // il sito pubblico nello stesso browser vede SSR-render edit mode (tutti i
  // `data-kiwi-*` attributes esposti nel DOM, i wrapper `<Editable>` ecc.
  // riconoscono `isEditMode() === true`).
  //
  // Soluzione: navigator.sendBeacon a `/api/kiwi-edit/logout` su pagehide/
  // beforeunload (chiusura tab, refresh, navigazione fuori). Il browser
  // garantisce che il beacon parta anche se la pagina sta unloading.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.parent === window) return; // not in iframe — niente cookie da pulire
    function bye() {
      try {
        if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
          navigator.sendBeacon('/api/kiwi-edit/logout');
        } else {
          // Fallback per browser senza Beacon API (raro). fetch keepalive.
          fetch('/api/kiwi-edit/logout', { method: 'POST', keepalive: true }).catch(() => {});
        }
      } catch {
        /* silent */
      }
    }
    window.addEventListener('pagehide', bye);
    window.addEventListener('beforeunload', bye);
    return () => {
      window.removeEventListener('pagehide', bye);
      window.removeEventListener('beforeunload', bye);
    };
  }, []);

  // === Notifica nav change al parent =========================================
  // v2.6.0: rimosso il setInterval(500ms) — ora reagiamo a `pathname` di
  // next/navigation che si aggiorna automaticamente al router.push. Quando il
  // pathname cambia inviamo KIWI_NAV_CHANGE + ricostruiamo l'inventory (effect
  // mount-time piu` su).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.parent === window) return;
    send('KIWI_NAV_CHANGE', { path: window.location.pathname + window.location.search });
  }, [pathname]);

  // === Render markup overlay (handles + style) ===============================

  return (
    <>
      <style jsx global>{`
        /* v2.7.0: hover testo = cursor grab (segnala spostabile come immagini).
           Quando il blocco entra in edit mode, cursor torna a text.
           v2.7.3: !important per battere stili Tailwind/inline cursor:auto del
           sito, e selettore esplicito :not(.kiwi-edit-active) per evitare
           conflitto con la regola edit-active sotto. */
        .kiwi-edit-mode [data-kiwi-block][data-kiwi-type='text']:not(.kiwi-edit-active):hover,
        .kiwi-edit-mode [data-kiwi-block][data-kiwi-type='textarea']:not(.kiwi-edit-active):hover,
        .kiwi-edit-mode [data-kiwi-block][data-kiwi-type='email']:not(.kiwi-edit-active):hover,
        .kiwi-edit-mode [data-kiwi-block][data-kiwi-type='tel']:not(.kiwi-edit-active):hover,
        .kiwi-edit-mode [data-kiwi-block][data-kiwi-type='url']:not(.kiwi-edit-active):hover,
        .kiwi-edit-mode [data-kiwi-block][data-kiwi-type='richtext']:not(.kiwi-edit-active):hover {
          outline: 2px dashed #fbbf24;
          outline-offset: 2px;
          cursor: text !important; /* ENFRIO: no drag, no position change */
        }
        /* v2.7.3: handle visivo "≡" top-left su hover testo (non in edit mode).
           position:absolute richiede position:relative sul block (vedi sopra).
           pointer-events:none cosi\` non interferisce col mousedown gesture. */
        /* v2.9.1: handle visivo rimosso. Causava "/2630" letterale visibile
           in browser dove l'escape CSS \\2630 (≡ trigram) non veniva
           interpretato (Safari iOS, Firefox in certe condizioni con React
           inline <style>). Il cursor:grab + outline tratteggiato giallo sopra
           e\` gia\` sufficiente come affordance. Il drag si attiva su
           mousedown+drag oppure mousedown+hold 250ms (vedi gesture controller).
           Se in futuro vogliamo un handle, usare un component React separato
           con SVG inline invece di pseudo-element CSS. */
        .kiwi-edit-mode [data-kiwi-block].kiwi-edit-active {
          cursor: text !important;
        }
        .kiwi-edit-mode .kiwi-text-dragging {
          cursor: grabbing !important;
          outline: 3px solid #fbbf24 !important;
          outline-offset: 3px;
          user-select: none;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.18);
        }
        /* v2.7.0: cursor pointer su image/video (segnala "click = libreria") */
        .kiwi-edit-mode [data-kiwi-block][data-kiwi-type='image'],
        .kiwi-edit-mode [data-kiwi-block][data-kiwi-type='video'] {
          cursor: pointer;
        }
        .kiwi-edit-mode .kiwi-media-dragging {
          cursor: grabbing !important;
          opacity: 0.92;
          transition: none !important;
        }
        /* v2.7.0: section senza height esplicita = auto-fit (cresce col contenuto) */
        .kiwi-edit-mode [data-kiwi-section]:not([data-kiwi-section-height]) {
          height: auto !important;
        }
        .kiwi-edit-mode [data-kiwi-section][data-kiwi-section-height] {
          height: auto !important;
        }
        /* v2.7.1 FIX: il selettore precedente richiedeva [data-kiwi-section]
           ancestor, ma EditableHeroBg viene usato anche fuori da una section
           esplicita (es. <main><EditableHeroBg>...</EditableHeroBg></main>).
           Standalone match risolve. Convenzione: data-kiwi-decoration="true"
           sul div overlay decorativo (gradient, color tints) per non bloccare
           il click su media editabili sotto. */
        .kiwi-edit-mode [data-kiwi-decoration='true'],
        .kiwi-edit-mode [data-kiwi-auto-decoration='true'] {
          pointer-events: none !important;
        }
        /* v2.7.2: drag-preview ghost prevention. Senza user-select:none, sui
           testi multi-riga il browser puo\` iniziare un native text-drag con
           ghost trascinabile fuori dall'iframe. Quando il block testo NON e\`
           in edit-active, disabilitiamo la selezione nativa. */
        .kiwi-edit-mode [data-kiwi-block][data-kiwi-type='text']:not(.kiwi-edit-active),
        .kiwi-edit-mode [data-kiwi-block][data-kiwi-type='textarea']:not(.kiwi-edit-active),
        .kiwi-edit-mode [data-kiwi-block][data-kiwi-type='email']:not(.kiwi-edit-active),
        .kiwi-edit-mode [data-kiwi-block][data-kiwi-type='tel']:not(.kiwi-edit-active),
        .kiwi-edit-mode [data-kiwi-block][data-kiwi-type='url']:not(.kiwi-edit-active),
        .kiwi-edit-mode [data-kiwi-block][data-kiwi-type='richtext']:not(.kiwi-edit-active) {
          user-select: none;
          -webkit-user-drag: none;
        }
        /* Hover IMMAGINE/VIDEO: outline tratteggiato giallo brand + cursor pointer */
        .kiwi-edit-mode [data-kiwi-block][data-kiwi-type='image']:hover,
        .kiwi-edit-mode [data-kiwi-block][data-kiwi-type='video']:hover {
          outline: 3px dashed #fbbf24;
          outline-offset: 0;
          cursor: pointer;
          transition: outline 120ms ease-out;
        }
        /* Overlay hover full-image con icona swap GROSSA al centro + label.
           Pattern Wix/Squarespace/italiaonline. pointer-events:none cosi\` il
           click attraversa al media sotto. */
        .kiwi-media-hover-overlay {
          position: fixed;
          pointer-events: none;
          z-index: 2147483646;
          background: linear-gradient(
            180deg,
            rgba(15, 23, 42, 0.0) 0%,
            rgba(15, 23, 42, 0.42) 50%,
            rgba(15, 23, 42, 0.62) 100%
          );
          opacity: 0;
          transition: opacity 160ms ease-out;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .kiwi-media-hover-overlay.kiwi-media-hover-visible {
          opacity: 1;
        }
        .kiwi-media-hover-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transform: scale(0.92);
          transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .kiwi-media-hover-overlay.kiwi-media-hover-visible .kiwi-media-hover-inner {
          transform: scale(1);
        }
        .kiwi-media-hover-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #fbbf24;
          color: #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 8px 24px rgba(0, 0, 0, 0.45),
            0 0 0 4px rgba(255, 255, 255, 0.18);
        }
        .kiwi-media-hover-label {
          color: #ffffff;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.01em;
          padding: 5px 12px;
          background: rgba(15, 23, 42, 0.78);
          border-radius: 999px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }
        .kiwi-edit-mode .kiwi-edit-active {
          outline: 2px solid #fbbf24 !important;
          outline-offset: 2px;
          background: rgba(251, 191, 36, 0.06);
        }
        .kiwi-edit-mode [data-kiwi-block][data-kiwi-type='icon']:hover,
        .kiwi-edit-mode [data-kiwi-block][data-kiwi-type='social']:hover {
          outline: 2px dashed #fbbf24;
          outline-offset: 4px;
          cursor: pointer;
          border-radius: 4px;
        }
        .kiwi-edit-mode .kiwi-icon-selected,
        .kiwi-edit-mode .kiwi-social-selected {
          outline: 3px solid #fbbf24 !important;
          outline-offset: 4px;
          border-radius: 4px;
          position: relative;
          z-index: 9990;
        }
        /* v2.7.3 Hover su media editabile: outline tratteggiato sottilissimo
           per segnalare visivamente che e\` afferrabile. Non in conflitto con
           kiwi-image-selected (3px) — viene battuto dalla regola successiva
           sui :selected che usa !important. */
        .kiwi-edit-mode [data-kiwi-block][data-kiwi-type='image']:hover,
        .kiwi-edit-mode [data-kiwi-block][data-kiwi-type='video']:hover {
          outline: 1px dashed rgba(251, 191, 36, 0.4);
          outline-offset: 2px;
        }
        /* Selezione immagine/video: bordo TRATTEGGIATO giallo brand + offset */
        .kiwi-edit-mode .kiwi-image-selected,
        .kiwi-edit-mode .kiwi-video-selected {
          outline: 3px dashed #fbbf24 !important;
          outline-offset: 4px; /* ENFRIO: no position/z-index change */
          transition: outline-offset 120ms ease-out;
        }
        /* Maniglie resize 8 punti. position: fixed, calcolate da getBoundingClientRect */
        .kiwi-resize-handle {
          position: fixed;
          width: 10px;
          height: 10px;
          background: #fbbf24;
          border: 1.5px solid #0f172a;
          border-radius: 2px;
          z-index: 2147483647;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
        }
        .kiwi-resize-handle.kiwi-rh-nw { cursor: nwse-resize; }
        .kiwi-resize-handle.kiwi-rh-ne { cursor: nesw-resize; }
        .kiwi-resize-handle.kiwi-rh-sw { cursor: nesw-resize; }
        .kiwi-resize-handle.kiwi-rh-se { cursor: nwse-resize; }
        .kiwi-resize-handle.kiwi-rh-n  { cursor: ns-resize; }
        .kiwi-resize-handle.kiwi-rh-s  { cursor: ns-resize; }
        .kiwi-resize-handle.kiwi-rh-e  { cursor: ew-resize; }
        .kiwi-resize-handle.kiwi-rh-w  { cursor: ew-resize; }
        /* Drag handle testo: top-left fuori dal box, icona "≡" */
        .kiwi-text-drag-handle {
          position: fixed;
          width: 22px;
          height: 22px;
          background: #fbbf24;
          color: #0f172a;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          cursor: grab;
          z-index: 2147483647;
          user-select: none;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
        }
        .kiwi-text-drag-handle:active { cursor: grabbing; }
        /* Selezione testo: outline pieno + drag handle visibile */
        .kiwi-edit-mode .kiwi-text-selected {
          outline: 2px solid #fbbf24 !important;
          outline-offset: 2px;
        }
        .kiwi-edit-mode [data-kiwi-section] {
          position: relative;
        }
        .kiwi-edit-mode .kiwi-section-selected {
          outline: 2px solid #fbbf24;
          outline-offset: -2px;
        }
        /* v2.10.0 — Column: hover sottile + select piu\` evidente. Outline
           1px dashed in hover per non sovrastare la section quando entrambe
           sono visibili. Le column sono sub-blocchi annidati: il feedback
           visivo deve essere distinguibile ma meno invasivo della section. */
        .kiwi-edit-mode [data-kiwi-column] {
          position: relative;
        }
        .kiwi-edit-mode [data-kiwi-column]:hover {
          outline: 1px dashed rgba(251, 191, 36, 0.4);
          outline-offset: -1px;
          cursor: pointer;
        }
        .kiwi-edit-mode [data-kiwi-column].kiwi-column-selected {
          outline: 2px solid #fbbf24;
          outline-offset: -2px;
        }
        .kiwi-edit-mode [data-kiwi-section]:hover > .kiwi-section-drag-handle {
          opacity: 1;
        }
        .kiwi-edit-mode .kiwi-section-drag-handle {
          position: absolute;
          top: 8px;
          left: 8px;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: #0f172a;
          color: #fbbf24;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          cursor: grab;
          opacity: 0;
          transition: opacity 120ms;
          z-index: 9999;
          user-select: none;
        }
        .kiwi-edit-mode .kiwi-section-dragging {
          opacity: 0.5;
        }
        .kiwi-edit-mode .kiwi-section-drop-target {
          outline: 3px dashed #fbbf24;
          outline-offset: -3px;
        }
        .kiwi-edit-mode [data-kiwi-section].kiwi-section-hidden {
          opacity: 0.45;
          position: relative;
        }
        .kiwi-edit-mode [data-kiwi-section].kiwi-section-hidden::after {
          content: 'Nascosta';
          position: absolute;
          top: 8px;
          right: 8px;
          background: #0f172a;
          color: #fbbf24;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 8px;
          border-radius: 4px;
          z-index: 9998;
          pointer-events: none;
        }
        .kiwi-edit-mode .kiwi-section-resize-handle {
          position: fixed;
          height: 8px;
          background: #fbbf24;
          border-radius: 4px;
          z-index: 10000;
          cursor: ns-resize;
          opacity: 0.85;
          transition: opacity 120ms;
        }
        .kiwi-edit-mode .kiwi-section-resize-handle:hover {
          opacity: 1;
        }
      `}</style>

      <SectionHandlesMounter />

      {selection.kind === 'section' && <SectionResizeHandle target={selection.el} />}

      {selection.kind === 'image' && selection.el.dataset.kiwiNoDrag !== '1' && (
        <MediaResizeAndDrag
          target={selection.el}
          slug={selection.slug}
          send={send}
          kind="image"
          mode="precision"
        />
      )}
      {selection.kind === 'video' && (
        <MediaResizeAndDrag
          target={selection.el}
          slug={selection.slug}
          send={send}
          kind="video"
          mode="precision"
        />
      )}
      {/*
        v2.7.3: hover-resize. Mostra le 8 maniglie sul media SOTTO il cursore
        anche senza dblclick. Skip se il media e` gia` in precision selection
        (per evitare doppio set di handles).
      */}
      {hoveredMedia &&
        !(
          (selection.kind === 'image' || selection.kind === 'video') &&
          selection.el === hoveredMedia.el
        ) && (
          <MediaResizeAndDrag
            target={hoveredMedia.el}
            slug={hoveredMedia.slug}
            send={send}
            kind={hoveredMedia.kind}
            mode="hover"
          />
        )}
      {selection.kind === 'text' && selection.el.dataset.kiwiNoDrag !== '1' && (
        <TextDragHandle target={selection.el} slug={selection.slug} send={send} />
      )}
    </>
  );
}

/**
 * Inietta una mini-handle "≡" in ogni [data-kiwi-section] per il drag.
 * v2.6.0: usa MutationObserver per re-iniettare gli handle quando il
 * sito (SPA) aggiunge nuove sezioni post-navigation. Senza, il drag su
 * sezioni di pagine secondarie non funzionava.
 */
function SectionHandlesMounter() {
  useEffect(() => {
    function mount(root: ParentNode = document) {
      const sections = root.querySelectorAll<HTMLElement>('[data-kiwi-section]');
      sections.forEach((s) => {
        if (s.querySelector('.kiwi-section-drag-handle')) return;
        const h = document.createElement('div');
        h.className = 'kiwi-section-drag-handle';
        h.title = s.dataset.kiwiSectionLabel || 'Trascina per riordinare';
        h.textContent = '≡';
        s.appendChild(h);
      });
    }
    mount();
    const observer = new MutationObserver((mutations) => {
      let shouldRescan = false;
      for (const m of mutations) {
        for (const node of Array.from(m.addedNodes)) {
          if (!(node instanceof HTMLElement)) continue;
          if (node.matches?.('[data-kiwi-section]') || node.querySelector?.('[data-kiwi-section]')) {
            shouldRescan = true;
            break;
          }
        }
        if (shouldRescan) break;
      }
      if (shouldRescan) mount();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
  return null;
}

/** Maniglia resize section — bordo basso, drag verticale = min-height. */
function SectionResizeHandle({ target }: { target: HTMLElement }) {
  const r = useElementRect(target);
  if (!r) return null;
  const w = Math.min(160, r.width * 0.6);
  return (
    <div
      className="kiwi-section-resize-handle"
      style={{
        left: r.left + (r.width - w) / 2,
        top: r.bottom - 4,
        width: w,
      }}
      title="Trascina per cambiare l'altezza della sezione"
    />
  );
}

// ============================================================================
// MediaResizeAndDrag — 8 maniglie resize + drag posizione su immagine/video
// ============================================================================

type SendFn = (type: string, data?: Record<string, unknown>) => void;

interface MediaResizeProps {
  target: HTMLElement;
  slug: string;
  send: SendFn;
  kind: 'image' | 'video';
  /**
   * v2.7.3: 'precision' = post-dblclick (selezione + drag locale), 'hover' =
   * solo maniglie resize, il drag del corpo e` gestito dal gesture controller
   * globale. In hover mode NON registriamo il mousedown locale per evitare
   * doppi listener e gesti contraddittori.
   */
  mode?: 'precision' | 'hover';
}

const HANDLE_POSITIONS = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'] as const;
type HandlePos = (typeof HANDLE_POSITIONS)[number];

function MediaResizeAndDrag({ target, slug, send, kind, mode = 'precision' }: MediaResizeProps) {
  const rect = useElementRect(target);
  const [, forceTick] = useState(0);
  const bumpRect = () => forceTick((n) => n + 1);

  // Drag dell'elemento stesso = trasla via transform: translate(X,Y)
  // Solo in precision mode (post-dblclick). In hover mode il gesture controller
  // globale (riga ~621) gia` gestisce il drag e l'apertura libreria.
  useEffect(() => {
    if (mode === 'hover') return;
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let baseTx = 0;
    let baseTy = 0;

    function onMouseDown(e: MouseEvent) {
      const t = e.target as HTMLElement | null;
      // Se il click e` su una maniglia, lascia gestire al resize
      if (t?.closest('.kiwi-resize-handle')) return;
      // Solo se mousedown sull'elemento target stesso (o suoi figli)
      if (!t || (t !== target && !target.contains(t))) return;
      // v2.7.0: se il gesture controller globale ha gia` consumato l'evento
      // (capture phase con preventDefault), non duplicare il drag.
      if (e.defaultPrevented) return;
      e.preventDefault();
      e.stopPropagation();
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const cur = parseTranslate(target);
      baseTx = cur.x;
      baseTy = cur.y;
      document.body.style.cursor = 'grabbing';
    }

    function onMouseMove(e: MouseEvent) {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const tx = baseTx + dx;
      const ty = baseTy + dy;
      target.style.transform = `translate(${tx}px, ${ty}px)`;
      bumpRect();
    }

    function onMouseUp() {
      if (!dragging) return;
      dragging = false;
      document.body.style.cursor = '';
      const cur = parseTranslate(target);
      send(kind === 'image' ? 'KIWI_IMAGE_MOVED' : 'KIWI_VIDEO_MOVED', {
        slug,
        x: Math.round(cur.x),
        y: Math.round(cur.y),
      });
    }

    target.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      target.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [target, slug, send, kind, mode]);

  if (!rect) return null;

  const handles: Array<{ pos: HandlePos; left: number; top: number }> = [
    { pos: 'nw', left: rect.left - 5, top: rect.top - 5 },
    { pos: 'n', left: rect.left + rect.width / 2 - 5, top: rect.top - 5 },
    { pos: 'ne', left: rect.right - 5, top: rect.top - 5 },
    { pos: 'e', left: rect.right - 5, top: rect.top + rect.height / 2 - 5 },
    { pos: 'se', left: rect.right - 5, top: rect.bottom - 5 },
    { pos: 's', left: rect.left + rect.width / 2 - 5, top: rect.bottom - 5 },
    { pos: 'sw', left: rect.left - 5, top: rect.bottom - 5 },
    { pos: 'w', left: rect.left - 5, top: rect.top + rect.height / 2 - 5 },
  ];

  return (
    <>
      {handles.map((h) => (
        <ResizeHandle
          key={h.pos}
          pos={h.pos}
          left={h.left}
          top={h.top}
          target={target}
          slug={slug}
          send={send}
          kind={kind}
          onResize={bumpRect}
        />
      ))}
    </>
  );
}

interface ResizeHandleProps {
  pos: HandlePos;
  left: number;
  top: number;
  target: HTMLElement;
  slug: string;
  send: SendFn;
  kind: 'image' | 'video';
  onResize: () => void;
}

function ResizeHandle({ pos, left, top, target, slug, send, kind, onResize }: ResizeHandleProps) {
  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startW = 0;
    let startH = 0;
    let aspect = 1;
    // v2.7.0: bind section. Se l'immagine ha data-kiwi-image-binds-section,
    // catturiamo la section padre e ridimensioniamo anche min-height in sync.
    let bindSection = false;
    let sectionEl: HTMLElement | null = null;
    let sectionStartH = 0;

    function onDown(e: MouseEvent) {
      e.preventDefault();
      e.stopPropagation();
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const r = target.getBoundingClientRect();
      startW = r.width;
      startH = r.height;
      aspect = startH > 0 ? startW / startH : 1;
      document.body.style.userSelect = 'none';

      // v2.9.1: bind-section di DEFAULT (italiaonline-style). Se l'immagine
      // vive dentro una <EditableSection> e l'attr `data-kiwi-image-binds-
      // section` non e` esplicitamente 'false', il resize ridimensiona anche
      // la section padre — la sezione cresce/cala con l'immagine, spostando
      // il resto del layout sotto. Per disabilitare in casi specifici (es.
      // immagini in galleria multi-colonna), passa `bindsSection={false}` al
      // wrapper React, che emette `data-kiwi-image-binds-section="false"`.
      const bindAttr = target.getAttribute('data-kiwi-image-binds-section');
      sectionEl = target.closest<HTMLElement>('[data-kiwi-section]');
      bindSection = bindAttr !== 'false' && sectionEl !== null;
      if (bindSection && sectionEl) {
        sectionStartH = sectionEl.getBoundingClientRect().height;
      }
    }

    function onMove(e: MouseEvent) {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      let newW = startW;
      let newH = startH;
      const isCorner = pos === 'nw' || pos === 'ne' || pos === 'sw' || pos === 'se';

      switch (pos) {
        case 'e':
          newW = Math.max(40, startW + dx);
          break;
        case 'w':
          newW = Math.max(40, startW - dx);
          break;
        case 's':
          newH = Math.max(40, startH + dy);
          break;
        case 'n':
          newH = Math.max(40, startH - dy);
          break;
        case 'se':
          newW = Math.max(40, startW + dx);
          newH = newW / aspect;
          break;
        case 'ne':
          newW = Math.max(40, startW + dx);
          newH = newW / aspect;
          break;
        case 'sw':
          newW = Math.max(40, startW - dx);
          newH = newW / aspect;
          break;
        case 'nw':
          newW = Math.max(40, startW - dx);
          newH = newW / aspect;
          break;
      }

      // Applica con `!important` per battere il CSS del sito (Tailwind
      // w-full / h-auto / max-w-* / object-cover, ecc.). Sblocca anche
      // max-width / max-height che bloccherebbero il resize.
      target.style.setProperty('width', `${Math.round(newW)}px`, 'important');
      target.style.setProperty('max-width', 'none', 'important');
      if (isCorner || pos === 'n' || pos === 's') {
        target.style.setProperty('height', `${Math.round(newH)}px`, 'important');
        target.style.setProperty('max-height', 'none', 'important');
      }

      // v2.7.0: se bindSection, calcola delta height e applica al section
      // padre come min-height. Garantisce che la sezione cresca/cali con
      // l'immagine (hero feature single-image).
      // v2.7.2: tieni Shift per disabilitare bind (resize image SENZA toccare section).
      if (bindSection && sectionEl && !e.shiftKey) {
        const deltaH = newH - startH;
        const newSectionH = Math.max(120, sectionStartH + deltaH);
        sectionEl.style.setProperty('min-height', `${Math.round(newSectionH)}px`, 'important');
      }

      onResize();
    }

    function onUp() {
      if (!dragging) return;
      dragging = false;
      document.body.style.userSelect = '';
      const r = target.getBoundingClientRect();
      send(kind === 'image' ? 'KIWI_IMAGE_RESIZED' : 'KIWI_VIDEO_RESIZED', {
        slug,
        width: Math.round(r.width),
        height: Math.round(r.height),
      });
      // v2.7.0: bind section -> emit anche KIWI_SECTION_RESIZED
      if (bindSection && sectionEl) {
        const id = sectionEl.getAttribute('data-kiwi-section') || '';
        const finalH = sectionEl.style.minHeight ||
          `${Math.round(sectionEl.getBoundingClientRect().height)}px`;
        if (id && finalH) {
          send('KIWI_SECTION_RESIZED', {
            sectionId: id,
            height: finalH,
            source: 'image-bind',
          });
        }
      }
    }

    node.addEventListener('mousedown', onDown);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      node.removeEventListener('mousedown', onDown);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, [pos, target, slug, send, kind, onResize]);

  const nodeRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={nodeRef}
      className={`kiwi-resize-handle kiwi-rh-${pos}`}
      style={{ left, top }}
      aria-hidden="true"
    />
  );
}

// ============================================================================
// TextDragHandle — handle drag posizione per blocchi testo selezionati
// ============================================================================

function TextDragHandle({
  target,
  slug,
  send,
}: {
  target: HTMLElement;
  slug: string;
  send: SendFn;
}) {
  const rect = useElementRect(target);
  const [, forceTick] = useState(0);
  const bumpRect = () => forceTick((n) => n + 1);
  const handleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = handleRef.current;
    if (!node) return;

    let dragging = false;
    let startX = 0;
    let startY = 0;
    let baseTx = 0;
    let baseTy = 0;

    function onDown(e: MouseEvent) {
      e.preventDefault();
      e.stopPropagation();
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const cur = parseTranslate(target);
      baseTx = cur.x;
      baseTy = cur.y;
      document.body.style.cursor = 'grabbing';
      // Disattiva contentEditable durante il drag per evitare selezione testo
      target.contentEditable = 'false';
    }

    function onMove(e: MouseEvent) {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const tx = baseTx + dx;
      const ty = baseTy + dy;
      target.style.transform = `translate(${tx}px, ${ty}px)`;
      bumpRect();
    }

    function onUp() {
      if (!dragging) return;
      dragging = false;
      document.body.style.cursor = '';
      const cur = parseTranslate(target);
      send('KIWI_TEXT_MOVED', {
        slug,
        x: Math.round(cur.x),
        y: Math.round(cur.y),
      });
    }

    node.addEventListener('mousedown', onDown);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      node.removeEventListener('mousedown', onDown);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, [target, slug, send]);

  if (!rect) return null;

  return (
    <div
      ref={handleRef}
      className="kiwi-text-drag-handle"
      style={{
        left: Math.max(4, rect.left - 28),
        top: rect.top,
      }}
      title="Trascina per spostare"
      aria-hidden="true"
    >
      ≡
    </div>
  );
}
