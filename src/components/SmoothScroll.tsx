"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/**
 * Site-wide smooth scroll. Mounts once at the top of the layout, wraps
 * the native scroll with Lenis so wheel/touch/keyboard motion eases
 * instead of snapping. No DOM is rendered — the component just runs a
 * RAF loop and lets Lenis intercept the window scroll.
 *
 * Coexists with:
 *   - SiteShell's `window.addEventListener('scroll', ...)` reveal logic
 *     (Lenis still fires the native scroll event)
 *   - MTowerStage's frame-driven scroll handler (same — native event
 *     fires on every Lenis frame, so the frame index keeps tracking)
 *   - In-page anchor links (`href="#mtower-sizer"`, etc.) — Lenis
 *     handles these natively as long as default behaviour isn't
 *     prevented.
 *
 * Respects `prefers-reduced-motion`: if the user has motion turned off
 * at the OS level, smooth scroll is bypassed and the page falls back to
 * native snap scrolling.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.05,
      // Easing tuned for "cinematic but responsive". A bit softer than
      // the Lenis default so micro-scrolls feel intentional.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // Let touch use native momentum on mobile — smoother for thumbs.
      smoothWheel: true,
    });

    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
