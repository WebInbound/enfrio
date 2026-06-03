"use client";

import { useEffect, useState } from "react";

/**
 * BackToTop — small circular CTA pinned to the bottom-right that fades
 * in once the visitor has scrolled past one viewport. Clicking smooth-
 * scrolls back to the top.
 *
 * - Visibility threshold: scrollY > 0.6 × viewport height
 * - Click handler: tries Lenis (already site-wide) first, falls back to
 *   the native smooth scroll API
 * - Has `.magnetic` so it picks up the global magnetic-buttons cursor
 *   pull on desktop
 * - Respects prefers-reduced-motion: instant scroll instead of smooth
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const threshold = window.innerHeight * 0.6;
        setVisible(window.scrollY > threshold);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const handleClick = () => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Prefer the global Lenis instance if it exposed itself on window;
    // otherwise fall back to the native smooth-scroll API.
    const w = window as unknown as {
      __lenis?: { scrollTo: (target: number, opts?: { duration?: number }) => void };
    };
    if (w.__lenis && !prefersReduced) {
      w.__lenis.scrollTo(0, { duration: 1.2 });
      return;
    }
    window.scrollTo({
      top: 0,
      behavior: prefersReduced ? "auto" : "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`back-to-top magnetic${visible ? " is-visible" : ""}`}
      aria-label="Back to top"
      title="Back to top"
      tabIndex={visible ? 0 : -1}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M12 19V5" />
        <path d="m6 11 6-6 6 6" />
      </svg>
    </button>
  );
}
