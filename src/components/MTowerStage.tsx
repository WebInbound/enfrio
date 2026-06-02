"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import AnimatedNumber from "@/components/AnimatedNumber";

/* WebGL canvas with the 120-frame texture billboard. Dynamically imported
   so three.js (~200 KB) only loads client-side and never blocks SSR. */
const MTowerCanvas = dynamic(() => import("./MTowerCanvas"), {
  ssr: false,
  loading: () => <div className="mtower-stage-canvas-skeleton" />,
});

const FRAME_COUNT = 120;

/**
 * Starting frame on first paint. Frame 0 is the canonical front-3/4
 * marketing view — front face with the protection mesh on the left,
 * the inverter cabinet with inlet pipes on the right, structural
 * frame visible behind. This is the silhouette people associate with
 * the M Tower.
 */
const INITIAL_FRAME = 0;

/**
 * Frames the unit rotates across the hero's scroll arc.
 * The source CAD video isn't a pure vertical-axis rotation across all
 * 120 frames — past frame ~45 the camera dips below the unit and
 * starts giving "from above" / "lying down" angles that don't read as
 * a product portrait. Cap the scroll rotation at 30 frames (90°) so
 * the scroll-driven view always stays in the upright, marketing-safe
 * range. Drag is unconstrained — power users who explicitly pull the
 * unit can still see every angle.
 */
const SCROLL_ROTATION_FRAMES = 30;

/**
 * Annotation chips — each one is anchored to a frame band of the
 * 0–30 arc. As the scroll-driven frame advances, the active chip
 * lights up and a lime connector line draws toward the unit centre.
 *
 * The visual position (top/left as %) places each chip around the
 * unit silhouette so the lines feel like real callouts. Mobile
 * (< 880px) hides the chips entirely.
 */
type Chip = {
  id: string;
  band: [number, number];
  label: string;
  spec: string;
  /* Position of the chip itself, as % of the visual box. */
  top: string;
  left: string;
  /* SVG connector endpoint, in % of the visual box (where the line
     terminates on the unit). */
  lineTo: { x: number; y: number };
  /* Which corner of the chip the line should leave from. */
  origin: "right" | "left" | "bottom-right" | "bottom-left";
};

const CHIPS: Chip[] = [
  {
    id: "core",
    band: [0, 7],
    label: "HEAT-EXCHANGER CORE",
    spec: "Cu-Al finned bundle",
    top: "14%",
    left: "4%",
    lineTo: { x: 52, y: 38 },
    origin: "right",
  },
  {
    id: "fans",
    band: [8, 15],
    label: "FAN STACK",
    spec: "EC fans, IE5 efficiency",
    top: "10%",
    left: "70%",
    lineTo: { x: 56, y: 26 },
    origin: "left",
  },
  {
    id: "inverter",
    band: [16, 23],
    label: "INVERTER CABINET",
    spec: "Integrated side-mount",
    top: "62%",
    left: "68%",
    lineTo: { x: 60, y: 58 },
    origin: "left",
  },
  {
    id: "frame",
    band: [24, 30],
    label: "STRUCTURAL FRAME",
    spec: "Hot-dip galvanized steel",
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
  // Clamp to the scroll arc; drag past 30 keeps the last chip active.
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
 * Layout (sticky pin through Hero + Explore):
 *   ┌─────────────────────────────────────────────────────────┐
 *   │  .mtower-pin-wrap  (tall — hero + explore stacked)      │
 *   │  ┌────────────────────────────────────────────────────┐ │
 *   │  │  HERO  (text col + sticky visual col)              │ │
 *   │  │   ┌──────────────┐   ┌─────────────────────────┐   │ │
 *   │  │   │ Text + specs │   │ STICKY canvas + chips   │   │ │
 *   │  │   │ + CTA        │   │ (stays put across the   │   │ │
 *   │  │   │              │   │  hero + explore scroll) │   │ │
 *   │  │   └──────────────┘   └─────────────────────────┘   │ │
 *   │  ├────────────────────────────────────────────────────┤ │
 *   │  │  EXPLORE  (right-rail panels appear in sequence    │ │
 *   │  │  beside the still-sticky canvas)                   │ │
 *   │  └────────────────────────────────────────────────────┘ │
 *   └─────────────────────────────────────────────────────────┘
 *
 * The canvas lives once at the top of the pin-wrap in a sticky shell.
 * Scroll progress across the entire pin-wrap height is mapped to the
 * 0–30 frame arc, and the active annotation chip lights up by band.
 *
 * Mobile (< 880px) disables sticky and hides chips — content reverts
 * to the linear stack (text → canvas → explore copy → panels).
 *
 * Rotation:
 *   - Scroll across the pin-wrap advances the frame by delta against
 *     the previous scroll position. Drag-induced offsets persist when
 *     scroll resumes.
 *   - Drag overrides scroll for the duration of the pointer gesture.
 */
export default function MTowerStage() {
  const pinWrapRef = useRef<HTMLElement | null>(null);
  const [frame, setFrame] = useState(INITIAL_FRAME);

  const scrollContribRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartFrameRef = useRef(INITIAL_FRAME);
  const visualWidthRef = useRef(1);

  // Scroll-driven rotation across the WHOLE pin-wrap (hero + explore).
  useEffect(() => {
    const wrap = pinWrapRef.current;
    if (!wrap) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      if (isDraggingRef.current) return;
      const rect = wrap.getBoundingClientRect();
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

  /* The sticky visual block — shared by the hero and the explore
     section. Rendered once at the top of the pin-wrap. */
  const stickyVisual = (
    <div className="mtower-stage-sticky">
      <div
        className="mtower-stage-visual"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="img"
        aria-label="Enfrio M Tower 3D render — drag or scroll to rotate"
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
            // Anchor each line at the inside corner of the chip's
            // bounding region, drawn toward the unit centre point.
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
              <span className="mtower-anno-chip-label">{chip.label}</span>
              <span className="mtower-anno-chip-spec">{chip.spec}</span>
            </div>
          );
        })}

        <div className="mtower-stage-hint" aria-hidden="true">
          <span>↔ drag</span>
          <span>·</span>
          <span>↓ scroll</span>
        </div>
      </div>
    </div>
  );

  return (
    <section ref={pinWrapRef} className="mtower-pin-wrap">
      <section className="mtower-stage" id="mtower-stage-hero">
        <div className="mtower-stage-bg" aria-hidden="true" />

        <div className="mtower-stage-row">
          <div className="mtower-stage-content">
            <p className="kicker">FLAGSHIP PLATFORM</p>
            <h1>
              M Tower.
              <br />
              <span className="accent">Cooling that scales</span> with your power.
            </h1>
            <p className="lead">
              Modular heat-rejection units of 1500&nbsp;kW each. Start with
              one, add more as your plant grows. From standalone gensets to
              12&nbsp;MW datacenter halls — same proven core.
            </p>

            <div className="mtower-hero-specs reveal">
              <div className="mtower-hero-spec">
                <span className="mtower-hero-spec-num">
                  <AnimatedNumber value={1500} suffix=" kW" />
                </span>
                <span className="mtower-hero-spec-label">PER MODULE</span>
              </div>
              <div className="mtower-hero-spec">
                <span className="mtower-hero-spec-num">
                  <AnimatedNumber value={12} suffix=" MW" />
                </span>
                <span className="mtower-hero-spec-label">MAX BANK</span>
              </div>
              <div className="mtower-hero-spec">
                <span className="mtower-hero-spec-num">N+1</span>
                <span className="mtower-hero-spec-label">REDUNDANCY</span>
              </div>
            </div>

            <div className="btn-row">
              <a className="btn solid magnetic" href="#mtower-sizer">
                Size your installation
              </a>
              <a className="btn ghost" href="#mtower-explore">
                Explore the unit
              </a>
            </div>
            <p className="mtower-stage-scroll-hint" aria-hidden="true">
              ↓ scroll to spin
            </p>
          </div>

          {/* Right column on desktop: holds the sticky visual. The
              sticky shell lives here so the canvas is positioned
              against this column on the hero, then continues to be
              sticky as the user scrolls into the explore section
              underneath (the outer .mtower-pin-wrap is the scroll
              container that keeps it pinned). */}
          <div className="mtower-stage-visual-col">{stickyVisual}</div>
        </div>
      </section>

      <section className="section dark-block" id="mtower-explore">
        <div className="mtower-explore-grid">
          <div className="mtower-explore-rail">
            <div className="section-head reveal">
              <p className="kicker">EXPLORE THE UNIT</p>
              <h2>Engineered to the millimetre, built to ship.</h2>
              <p>
                The stainless tube bundles, the louvered aluminium fins, the
                inverter cabinet on the side, the vibration-isolated frame —
                every detail is engineered for the duty cycle of mission-critical
                heat rejection. Spin the render to inspect every face.
              </p>
            </div>
            <article className="panel reveal">
              <h3>Mechanical</h3>
              <ul className="checks">
                <li>High-alloy aluminium cores with dimpled tubes</li>
                <li>Louvered fins for maximum heat transfer surface</li>
                <li>Vibration-isolated black-painted steel frame</li>
                <li>Welded gussets at every structural corner</li>
              </ul>
            </article>
            <article className="panel reveal">
              <h3>Integration</h3>
              <ul className="checks">
                <li>Inverter cabinet integrated on the side</li>
                <li>Container-fit envelope: ship, lift, bolt down</li>
                <li>Hydraulic interface shared across every module</li>
                <li>Rubber vibration-isolation pads at the base</li>
              </ul>
            </article>
          </div>

          {/* Empty placeholder column — the sticky visual lives in the
              hero's right column and visually continues pinned across
              this section because .mtower-pin-wrap is the scroll
              container. On mobile this entire grid collapses to one
              column and the canvas falls back to its hero slot. */}
          <div className="mtower-explore-spacer" aria-hidden="true" />
        </div>
      </section>
    </section>
  );
}

/* Helper: compute the SVG line origin for a chip based on its
   declared origin corner. The chip is positioned by its top-left
   in % units; the line should exit from the appropriate edge so it
   looks like it's drawn FROM the chip TO the unit. */
function chipAnchor(chip: Chip): { x: number; y: number } {
  // Approximate chip width/height in % of the box. Tuned to match the
  // CSS values (chip is roughly 18% wide, 7% tall on desktop).
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
