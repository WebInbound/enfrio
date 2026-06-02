"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";

/* WebGL canvas with the 120-frame texture billboard. Dynamically imported
   so three.js (~200 KB) only loads client-side and never blocks SSR. */
const MTowerCanvas = dynamic(() => import("./MTowerCanvas"), {
  ssr: false,
  loading: () => <div className="mtower-stage-canvas-skeleton" />,
});

const FRAME_COUNT = 120;

/**
 * Starting frame on first paint. Index 12 of 120 ≈ 36° — the "marketing
 * 3/4" view where the front face, the side frame and the inverter
 * cabinet are all readable at once.
 */
const INITIAL_FRAME = 12;

/**
 * Frames the unit rotates across the hero's scroll arc. 60 of 120 = 180°
 * — half a revolution so the user sees the back face appear before the
 * hero leaves the viewport. Half rotation also avoids landing back on
 * the starting view which would read as "nothing happened".
 */
const SCROLL_ROTATION_FRAMES = 60;

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

/**
 * MTowerStage — the M Tower flagship hero.
 *
 * Layout (linear, no sticky):
 *   ┌──────────────────────────────────────────────┐
 *   │  HERO (≈90vh)                                │
 *   │  ┌──────────────┬──────────────────────────┐ │
 *   │  │  Text + CTA  │  M Tower canvas (R3F)    │ │
 *   │  │              │  scroll-rotates + drag   │ │
 *   │  └──────────────┴──────────────────────────┘ │
 *   ├──────────────────────────────────────────────┤
 *   │  EXPLORE THE UNIT (text-only, ~auto height)  │
 *   │  kicker / h2 / paragraph / checks            │
 *   └──────────────────────────────────────────────┘
 *
 * The previous sticky-pinned-with-parallax experiment created a tall
 * right-column with a small visual inside, leaving a huge void below
 * the unit. This linear version puts the canvas inside the hero only;
 * once the user scrolls past, the canvas exits naturally and the
 * Explore block underneath is plain editorial copy.
 *
 * Rotation:
 *   - Scroll inside the hero advances the frame by delta against the
 *     previous scroll position. Drag-induced offsets persist when
 *     scroll resumes.
 *   - Drag overrides scroll for the duration of the pointer gesture.
 */
export default function MTowerStage() {
  const heroRef = useRef<HTMLElement | null>(null);
  const [frame, setFrame] = useState(INITIAL_FRAME);

  const scrollContribRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartFrameRef = useRef(INITIAL_FRAME);
  const visualWidthRef = useRef(1);

  // Scroll-driven rotation (delta against previous scroll position so
  // drag offsets persist).
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

  return (
    <>
      <section ref={heroRef} className="mtower-stage" id="mtower-stage-hero">
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
            <div className="mtower-stage-hint" aria-hidden="true">
              <span>↔ drag</span>
              <span>·</span>
              <span>↓ scroll</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section dark-block" id="mtower-explore">
        <div className="section-head reveal">
          <p className="kicker">EXPLORE THE UNIT</p>
          <h2>Engineered to the millimetre, built to ship.</h2>
          <p>
            The stainless tube bundles, the louvered aluminium fins, the
            inverter cabinet on the side, the vibration-isolated frame —
            every detail is engineered for the duty cycle of mission-critical
            heat rejection. Spin the render above to inspect every face.
          </p>
        </div>
        <div className="grid-2">
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
      </section>
    </>
  );
}
