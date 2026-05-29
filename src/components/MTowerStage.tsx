"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const FRAME_COUNT = 120;
const FRAMES_BASE = "/assets/images/mtower-frames";
const POSTER = "/assets/images/site/mtower-render.png";

/**
 * Starting frame at the top of the scroll. With 120 frames over 360°,
 * index 12 ≈ 36° — the "marketing 3/4" view where the front face, the
 * side frame and the inverter cabinet are all readable at once.
 */
const INITIAL_FRAME = 12;

/**
 * Frames the unit rotates across the full scroll arc of the stage.
 * 90 of 120 = 270°, so the unit makes most of a revolution but doesn't
 * loop back to the starting view (which would feel like "nothing happened").
 */
const SCROLL_ROTATION_FRAMES = 90;

/**
 * Sticky offset (matches the CSS `top: 100px` on .mtower-stage-visual).
 * Used at runtime to compute how much headroom is left below the visual
 * for the parallax descent to use.
 */
const STICKY_TOP_PX = 100;

/**
 * Bottom margin we want to keep below the visual so it never touches the
 * viewport edge at full descent.
 */
const PARALLAX_BOTTOM_MARGIN_PX = 24;

/**
 * The full scroll ratio (0..1) covers the entire enter-to-exit arc, but
 * the M Tower is only visibly pinned during the middle ~70% of that arc.
 * Remap the ratio so the descent actually runs from 0 to max DURING the
 * sticky-active window — outside that window the translate stays at the
 * boundary value.
 */
const PARALLAX_RATIO_START = 0.18;
const PARALLAX_RATIO_END = 0.82;

function framePath(i: number): string {
  const idx = ((i % FRAME_COUNT) + FRAME_COUNT) % FRAME_COUNT;
  return `${FRAMES_BASE}/${String(idx).padStart(3, "0")}.webp`;
}

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

/**
 * MTowerStage — combined hero + "Explore the unit" scene with one canonical
 * M Tower visual.
 *
 * Layout uses CSS grid-template-areas so the same React tree renders two
 * very different layouts:
 *
 *   Desktop (≥ 901px):
 *     [ hero    ][ visual ]
 *     [ explore ][ visual ]
 *   Visual is sticky-pinned and parallax-translated as the user scrolls
 *   through both content blocks on the left.
 *
 *   Mobile (< 901px):
 *     [ hero    ]
 *     [ visual  ]
 *     [ explore ]
 *   Visual sits inline between the two text blocks at a fixed height. No
 *   sticky behaviour — the user scrolls past it naturally.
 *
 * Rotation: hybrid scroll + drag.
 *  - Scroll advances by delta against the previous scroll value, so
 *    drag-induced offsets persist when scrolling resumes.
 *  - Drag overrides scroll during the pointer gesture.
 *  - Native image-drag is killed at every layer (draggable={false},
 *    pointer-events: none on the img, user-select / -webkit-user-drag,
 *    touch-action: pan-y so vertical scroll still passes through).
 */
export default function MTowerStage() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [frame, setFrame] = useState(INITIAL_FRAME);
  const [ready, setReady] = useState(false);

  const scrollContribRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartFrameRef = useRef(INITIAL_FRAME);
  const visualWidthRef = useRef(1);

  // Pre-fetch all frames.
  useEffect(() => {
    let mounted = true;
    let loaded = 0;
    const imgs: HTMLImageElement[] = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new window.Image();
      img.onload = () => {
        loaded += 1;
        if (loaded >= 8 && mounted) setReady(true);
      };
      img.src = framePath(i);
      imgs.push(img);
    }
    const fallback = window.setTimeout(() => {
      if (mounted) setReady(true);
    }, 3000);
    return () => {
      mounted = false;
      window.clearTimeout(fallback);
      for (const img of imgs) img.src = "";
    };
  }, []);

  // Scroll-driven rotation + parallax translateY.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const scrolled = Math.max(0, vh - rect.top);
      const ratio = Math.min(1, Math.max(0, scrolled / total));

      // Parallax always applies — it's purely transform-based and doesn't
      // care whether the user is dragging the rotation. Set the transform
      // INLINE on the visual element (not via CSS variable inheritance)
      // so we know exactly what value is being applied, and so nothing
      // else in the cascade can quietly override it.
      const visualEl = section.querySelector<HTMLElement>(".mtower-stage-visual");
      if (visualEl && window.matchMedia("(min-width: 901px)").matches) {
        const visualHeight = visualEl.offsetHeight || vh * 0.45;
        const maxPx = Math.max(
          0,
          vh - STICKY_TOP_PX - visualHeight - PARALLAX_BOTTOM_MARGIN_PX,
        );
        const localRatio = Math.min(
          1,
          Math.max(
            0,
            (ratio - PARALLAX_RATIO_START) /
              (PARALLAX_RATIO_END - PARALLAX_RATIO_START),
          ),
        );
        const translateY = Math.round(localRatio * maxPx);
        visualEl.style.transform = `translateY(${translateY}px)`;
      } else if (visualEl) {
        // Mobile: explicit reset in case the visual was on desktop before
        // a resize.
        visualEl.style.transform = "";
      }

      if (isDraggingRef.current) return;

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
            ↓ scroll to spin
          </p>
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
    </section>
  );
}
