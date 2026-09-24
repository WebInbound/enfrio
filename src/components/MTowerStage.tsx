"use client";

import EditSpan from "@/components/EditSpan";
import type { EditMap } from "@/lib/kiwi-edit";
import type { TOWER_M } from "@/content/tower-m";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import Stat from "@/components/Stat";
import { useI18n } from "./I18nProvider";

/* WebGL canvas with the 120-frame texture billboard. Dynamically imported
   so three.js (~200 KB) only loads client-side and never blocks SSR. */
const MTowerCanvas = dynamic(() => import("./MTowerCanvas"), {
  ssr: false,
  loading: () => <div className="mtower-stage-canvas-skeleton" />,
});

const FRAME_COUNT = 120;

/**
 * Starting frame on first paint. Frame 0 is the canonical front-3/4
 * marketing view — the silhouette people associate with the M Tower.
 */
const INITIAL_FRAME = 0;

/**
 * Frames the unit rotates across the hero's scroll arc.
 * The source CAD video isn't a pure vertical-axis rotation across all
 * 120 frames — past frame ~45 the camera dips below the unit and gives
 * "from above" / "lying down" angles that don't read as a product
 * portrait. Cap the scroll rotation at 30 frames (90°) so the scroll-
 * driven view always stays in the upright, marketing-safe range. Drag
 * is unconstrained — power users can still see every angle.
 */
const SCROLL_ROTATION_FRAMES = 30;

/**
 * Annotation chips, anchored to frame bands of the 0-30 arc. Chips
 * live in the hero only and fade between bands as the visitor scrolls.
 */
type Chip = {
  id: string;
  band: [number, number];
  top: string;
  left: string;
  lineTo: { x: number; y: number };
  origin: "right" | "left" | "bottom-right" | "bottom-left";
};

const CHIPS: Chip[] = [
  {
    id: "core",
    band: [0, 7],
    top: "14%",
    left: "4%",
    lineTo: { x: 52, y: 38 },
    origin: "right",
  },
  {
    id: "fans",
    band: [8, 15],
    top: "10%",
    left: "70%",
    lineTo: { x: 56, y: 26 },
    origin: "left",
  },
  {
    id: "inverter",
    band: [16, 23],
    top: "62%",
    left: "68%",
    lineTo: { x: 60, y: 58 },
    origin: "left",
  },
  {
    id: "frame",
    band: [24, 30],
    top: "68%",
    left: "4%",
    lineTo: { x: 44, y: 72 },
    origin: "right",
  },
];

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

function activeChipIndex(frame: number): number {
  const f = Math.min(SCROLL_ROTATION_FRAMES, Math.max(0, frame));
  for (let i = 0; i < CHIPS.length; i++) {
    const [lo, hi] = CHIPS[i].band;
    if (f >= lo && f <= hi) return i;
  }
  return 0;
}

/**
 * MTowerStage — the M Tower flagship hero.
 *
 * Layout (linear, NO sticky):
 *   ┌────────────────────────────────────────────────────┐
 *   │  HERO  (~90vh — text col + canvas col side by side)│
 *   │   ┌──────────────┐   ┌─────────────────────────┐   │
 *   │   │ Text + specs │   │  Canvas + annotation    │   │
 *   │   │ + CTA        │   │  chips (frame-banded)   │   │
 *   │   └──────────────┘   └─────────────────────────┘   │
 *   ├────────────────────────────────────────────────────┤
 *   │  EXPLORE  (separate section, no shared canvas)     │
 *   │  Mechanical + Integration panels                   │
 *   └────────────────────────────────────────────────────┘
 *
 * NOTE on architecture: we previously experimented with a sticky-pinned
 * canvas spanning hero + explore. That broke twice (zoom drift, void
 * below pinned canvas, unit clipping outside the visual box) because
 * sticky's containing block constraints fight the layout. Linear is
 * the production-grade choice. Annotation chips still light up by
 * frame band as the unit rotates inside the hero.
 *
 * Rotation:
 *   - Scroll across the hero advances the frame by delta against the
 *     previous scroll position. Drag-induced offsets persist.
 *   - Drag overrides scroll while the pointer is down.
 */
/** Texts of the stage + explore sections, from the Kiwi panel (tower-m page). */
export type MTowerStageContent = {
  stage: {
    kicker: string;
    title_line1: string;
    title_accent: string;
    title_end: string;
    lead: string;
    spec1_value: string;
    spec1_label: string;
    spec2_value: string;
    spec2_label: string;
    spec3_value: string;
    spec3_label: string;
    cta_primary: string;
    cta_secondary: string;
    scroll_hint: string;
    hint_drag: string;
    hint_scroll: string;
    chip1_label: string;
    chip1_spec: string;
    chip2_label: string;
    chip2_spec: string;
    chip3_label: string;
    chip3_spec: string;
    chip4_label: string;
    chip4_spec: string;
  };
  explore: {
    kicker: string;
    title: string;
    text: string;
    mech_title: string;
    mech_1: string;
    mech_2: string;
    mech_3: string;
    mech_4: string;
    integ_title: string;
    integ_1: string;
    integ_2: string;
    integ_3: string;
    integ_4: string;
  };
};

export default function MTowerStage({
  content,
  edit: ed,
}: {
  content: MTowerStageContent;
  /** Kiwi editor markers (undefined for visitors). */
  edit?: Pick<EditMap<typeof TOWER_M>, "stage" | "explore">;
}) {
  const { stage: t, explore } = content;
  const { a11y } = useI18n();
  const chipText = [
    { label: t.chip1_label, spec: t.chip1_spec },
    { label: t.chip2_label, spec: t.chip2_spec },
    { label: t.chip3_label, spec: t.chip3_spec },
    { label: t.chip4_label, spec: t.chip4_spec },
  ];
  const heroRef = useRef<HTMLElement | null>(null);
  const [frame, setFrame] = useState(INITIAL_FRAME);

  const scrollContribRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartFrameRef = useRef(INITIAL_FRAME);
  const visualWidthRef = useRef(1);

  // Scroll-driven rotation across the hero only.
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      if (isDraggingRef.current) return;
      const rect = hero.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const scrolled = Math.max(0, vh - rect.top);
      const ratio = Math.min(1, Math.max(0, scrolled / total));
      const newScrollContrib = ratio * SCROLL_ROTATION_FRAMES;
      const delta = newScrollContrib - scrollContribRef.current;
      scrollContribRef.current = newScrollContrib;
      if (Math.abs(delta) >= 0.01) {
        setFrame((f) => mod(Math.round(f + delta), FRAME_COUNT));
      }
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const wrap = e.currentTarget;
      visualWidthRef.current = wrap.getBoundingClientRect().width || 1;
      isDraggingRef.current = true;
      dragStartXRef.current = e.clientX;
      dragStartFrameRef.current = frame;
      try {
        wrap.setPointerCapture(e.pointerId);
      } catch {
        /* older browsers */
      }
    },
    [frame],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - dragStartXRef.current;
      const framesMoved = (dx / visualWidthRef.current) * FRAME_COUNT;
      const next = Math.round(dragStartFrameRef.current + framesMoved);
      setFrame(mod(next, FRAME_COUNT));
    },
    [],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* older browsers */
      }
    },
    [],
  );

  const activeIdx = activeChipIndex(frame);

  return (
    <>
      <section ref={heroRef} className="mtower-stage" id="mtower-stage-hero">
        <div className="mtower-stage-bg" aria-hidden="true" />

        <div className="mtower-stage-row">
          <div className="mtower-stage-content">
            <p className="kicker" {...ed?.stage.kicker}>{t.kicker}</p>
            <h1>
              <EditSpan a={ed?.stage.title_line1}>{t.title_line1}</EditSpan>
              <br />
              <span className="accent" {...ed?.stage.title_accent}>{t.title_accent}</span>{" "}<EditSpan a={ed?.stage.title_end}>{t.title_end}</EditSpan>
            </h1>
            <p className="lead" {...ed?.stage.lead}>{t.lead}</p>

            <div className="mtower-hero-specs reveal">
              <div className="mtower-hero-spec">
                <span className="mtower-hero-spec-num">
                  <Stat text={t.spec1_value} />
                </span>
                <span className="mtower-hero-spec-label" {...ed?.stage.spec1_label}>{t.spec1_label}</span>
              </div>
              <div className="mtower-hero-spec">
                <span className="mtower-hero-spec-num">
                  <Stat text={t.spec2_value} />
                </span>
                <span className="mtower-hero-spec-label" {...ed?.stage.spec2_label}>{t.spec2_label}</span>
              </div>
              <div className="mtower-hero-spec">
                <span className="mtower-hero-spec-num" {...ed?.stage.spec3_value}>{t.spec3_value}</span>
                <span className="mtower-hero-spec-label" {...ed?.stage.spec3_label}>{t.spec3_label}</span>
              </div>
            </div>

            <div className="btn-row">
              <a className="btn solid magnetic" href="#mtower-sizer" {...ed?.stage.cta_primary}>
                {t.cta_primary}
              </a>
              <a className="btn ghost" href="#mtower-explore" {...ed?.stage.cta_secondary}>
                {t.cta_secondary}
              </a>
            </div>
            <p className="mtower-stage-scroll-hint" aria-hidden="true" {...ed?.stage.scroll_hint}>
              {t.scroll_hint}
            </p>
          </div>

          <div
            className="mtower-stage-visual"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            role="img"
            aria-label={a11y.mtower_3d}
          >
            <MTowerCanvas frame={frame} />

            {/* Annotation chips + lime SVG connectors (desktop only). */}
            <svg
              className="mtower-anno-lines"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {CHIPS.map((chip, i) => {
                const anchor = chipAnchor(chip);
                const active = i === activeIdx;
                return (
                  <line
                    key={chip.id}
                    className={
                      "mtower-anno-line" + (active ? " is-active" : "")
                    }
                    x1={anchor.x}
                    y1={anchor.y}
                    x2={chip.lineTo.x}
                    y2={chip.lineTo.y}
                  />
                );
              })}
            </svg>

            {CHIPS.map((chip, i) => {
              const active = i === activeIdx;
              return (
                <div
                  key={chip.id}
                  className={
                    "mtower-anno-chip" +
                    (active ? " is-active" : "") +
                    " mtower-anno-chip--" +
                    chip.origin
                  }
                  style={{ top: chip.top, left: chip.left }}
                  aria-hidden={!active}
                >
                  <span className="mtower-anno-chip-label">{chipText[i].label}</span>
                  <span className="mtower-anno-chip-spec">{chipText[i].spec}</span>
                </div>
              );
            })}

            <div className="mtower-stage-hint" aria-hidden="true">
              <span className="mtower-stage-hint-item">
                <svg
                  className="mtower-stage-hint-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M4 12h16" />
                  <path d="m7 9-3 3 3 3" />
                  <path d="m17 9 3 3-3 3" />
                </svg>
                {t.hint_drag}
              </span>
              <span>·</span>
              <span className="mtower-stage-hint-item">
                <svg
                  className="mtower-stage-hint-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M12 4v16" />
                  <path d="m9 17 3 3 3-3" />
                </svg>
                {t.hint_scroll}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section dark-block" id="mtower-explore">
        <div className="section-head reveal">
          <p className="kicker" {...ed?.explore.kicker}>{explore.kicker}</p>
          <h2 {...ed?.explore.title}>{explore.title}</h2>
          <p {...ed?.explore.text}>{explore.text}</p>
        </div>
        <div className="grid-2">
          <article className="panel reveal">
            <h3 {...ed?.explore.mech_title}>{explore.mech_title}</h3>
            <ul className="checks">
              <li {...ed?.explore.mech_1}>{explore.mech_1}</li>
              <li {...ed?.explore.mech_2}>{explore.mech_2}</li>
              <li {...ed?.explore.mech_3}>{explore.mech_3}</li>
              <li {...ed?.explore.mech_4}>{explore.mech_4}</li>
            </ul>
          </article>
          <article className="panel reveal">
            <h3 {...ed?.explore.integ_title}>{explore.integ_title}</h3>
            <ul className="checks">
              <li {...ed?.explore.integ_1}>{explore.integ_1}</li>
              <li {...ed?.explore.integ_2}>{explore.integ_2}</li>
              <li {...ed?.explore.integ_3}>{explore.integ_3}</li>
              <li {...ed?.explore.integ_4}>{explore.integ_4}</li>
            </ul>
          </article>
        </div>
      </section>
    </>
  );
}

/* Helper: compute the SVG line origin for a chip based on its
   declared origin corner. The chip is positioned by its top-left
   in % units; the line should exit from the appropriate edge so it
   looks like it's drawn FROM the chip TO the unit. */
function chipAnchor(chip: Chip): { x: number; y: number } {
  const w = 18;
  const h = 7;
  const t = parseFloat(chip.top);
  const l = parseFloat(chip.left);
  switch (chip.origin) {
    case "right":
      return { x: l + w, y: t + h / 2 };
    case "left":
      return { x: l, y: t + h / 2 };
    case "bottom-right":
      return { x: l + w, y: t + h };
    case "bottom-left":
      return { x: l, y: t + h };
    default:
      return { x: l + w / 2, y: t + h / 2 };
  }
}
