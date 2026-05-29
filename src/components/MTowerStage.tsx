"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const FRAME_COUNT = 60;
const FRAMES_BASE = "/assets/images/mtower-frames";
const POSTER = "/assets/images/site/mtower-render.png";

/**
 * Starting frame at the top of the scroll. Index 6 of 60 ≈ 36° from front,
 * the "marketing 3/4" view where the front face, the side frame and the
 * inverter cabinet are all readable at once.
 */
const INITIAL_FRAME = 6;

/**
 * How many frames the unit rotates across the whole scroll arc of the stage.
 * 45 ≈ 270°, so the unit makes most of a revolution but doesn't loop back
 * to the starting view (which would feel like "nothing happened").
 */
const SCROLL_ROTATION_FRAMES = 45;

function framePath(i: number): string {
  const idx = ((i % FRAME_COUNT) + FRAME_COUNT) % FRAME_COUNT;
  return `${FRAMES_BASE}/${String(idx).padStart(3, "0")}.webp`;
}

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

/**
 * MTowerStage — combined hero + "Explore the unit" stage with one canonical
 * M Tower visual.
 *
 * Layout: a tall two-column container. Left column stacks the hero copy and
 * the explore copy, each block taking roughly one viewport. Right column
 * holds a `position: sticky` 3D render that stays pinned while the user
 * scrolls through both blocks.
 *
 * Rotation: hybrid scroll + drag.
 *  - Scroll advances the frame by a delta against the previous scroll
 *    position. This means the unit picks up wherever drag left off — drag
 *    isn't reset when the page moves.
 *  - Drag overrides scroll for the duration of the gesture. Vertical scroll
 *    still passes through because the wrapper sets `touch-action: pan-y`.
 *
 * Drag bug previously caused by the browser's native image-drag behaviour.
 * Fixed by:
 *  - `draggable={false}` on the img,
 *  - `pointer-events: none` on the img + capture on the wrapper,
 *  - `user-select: none` and `-webkit-user-drag: none` in CSS.
 */
export default function MTowerStage() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [frame, setFrame] = useState(INITIAL_FRAME);
  const [ready, setReady] = useState(false);

  // Drag state via refs (no re-renders on every move).
  const scrollContribRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartFrameRef = useRef(INITIAL_FRAME);
  const visualWidthRef = useRef(1);

  // Pre-fetch all 60 frames so rotation never stalls.
  useEffect(() => {
    let mounted = true;
    let loaded = 0;
    const imgs: HTMLImageElement[] = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new window.Image();
      img.onload = () => {
        loaded += 1;
        if (loaded >= 6 && mounted) setReady(true);
      };
      img.src = framePath(i);
      imgs.push(img);
    }
    // Slow-CDN safety net: drop the poster after 3s no matter what.
    const fallback = window.setTimeout(() => {
      if (mounted) setReady(true);
    }, 3000);
    return () => {
      mounted = false;
      window.clearTimeout(fallback);
      for (const img of imgs) img.src = "";
    };
  }, []);

  // Scroll-driven rotation. Adds/subtracts the delta against the previous
  // scroll contribution so that drag-induced offsets persist across scroll.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      if (isDraggingRef.current) return;
      const rect = section.getBoundingClientRect();
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
    <section ref={sectionRef} className="mtower-stage" id="mtower-explore">
      <div className="mtower-stage-bg" aria-hidden="true" />

      <div className="mtower-stage-grid">
        <div className="mtower-stage-content">
          <div className="mtower-stage-block mtower-stage-hero">
            <p className="kicker">FLAGSHIP PLATFORM</p>
            <h1>
              M Tower.
              <br />
              <span className="accent">Cooling that scales</span> with your power.
            </h1>
            <p className="lead">
              Modular heat-rejection units of 1500&nbsp;kW each. Start with one,
              add more as your plant grows. From standalone gensets to
              12&nbsp;MW datacenter halls — same proven core.
            </p>
            <div className="btn-row">
              <a className="btn solid" href="#mtower-sizer">
                Size your installation
              </a>
              <a className="btn ghost" href="#mtower-stage-explore">
                Explore the unit
              </a>
            </div>
            <p className="mtower-stage-scroll-hint" aria-hidden="true">
              ↓ scroll
            </p>
          </div>

          <div
            className="mtower-stage-block mtower-stage-explore"
            id="mtower-stage-explore"
          >
            <p className="kicker">EXPLORE THE UNIT</p>
            <h2>Spin it around. Inspect every angle.</h2>
            <p>
              The M Tower turns with the page as you scroll — or grab it with
              your cursor (or your finger) and drag to inspect every face. The
              stainless tube bundles, the louvered aluminium fins, the inverter
              cabinet on the side, the vibration-isolated frame: every detail
              is engineered for the duty cycle of mission-critical heat
              rejection.
            </p>
            <ul className="checks">
              <li>High-alloy aluminium cores, dimpled tubes, louvered fins</li>
              <li>Vibration-isolated black-painted steel frame</li>
              <li>Inverter cabinet integrated on the side</li>
              <li>Container-fit envelope: ship, lift, bolt down</li>
            </ul>
          </div>
        </div>

        <div className="mtower-stage-visual-track">
          <div
            className="mtower-stage-visual"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ready ? framePath(frame) : POSTER}
              alt="Enfrio M Tower 3D render — drag to rotate"
              draggable={false}
              decoding="sync"
            />
            <div className="mtower-stage-hint" aria-hidden="true">
              <span>↔ drag</span>
              <span>·</span>
              <span>↓ scroll</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
