"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Attaches a "magnetic hover" effect to every element with class
 * `.magnetic` on the current page. While the cursor is within a radius
 * around the element, the element translates toward it with damped lerp.
 * Leaves the page when the cursor moves out, leaves the element when
 * the cursor exits the radius.
 *
 * Mount-and-forget: rebinds on every route change so SSR-rendered
 * buttons get hooked up after client navigation. Skipped on pointer-
 * coarse devices (phones, tablets) where there's no cursor.
 */
export default function MagneticButtons() {
  const pathname = usePathname();

  useEffect(() => {
    // Touch / coarse pointer? Skip — there's no cursor to attract.
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(".magnetic"),
    );
    if (targets.length === 0) return;

    const RADIUS = 90; // px from element centre that activates the pull
    const STRENGTH = 0.32; // 0..1 — how much of the cursor offset is applied
    const LERP = 0.18;

    type State = {
      el: HTMLElement;
      targetX: number;
      targetY: number;
      currentX: number;
      currentY: number;
      pulling: boolean;
    };

    const states: State[] = targets.map((el) => ({
      el,
      targetX: 0,
      targetY: 0,
      currentX: 0,
      currentY: 0,
      pulling: false,
    }));

    let raf = 0;
    let alive = true;

    const tick = () => {
      if (!alive) return;
      let anyDirty = false;
      for (const s of states) {
        const dx = s.targetX - s.currentX;
        const dy = s.targetY - s.currentY;
        if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
          s.currentX += dx * LERP;
          s.currentY += dy * LERP;
          s.el.style.transform = `translate(${s.currentX.toFixed(2)}px, ${s.currentY.toFixed(2)}px)`;
          anyDirty = true;
        } else if (s.currentX !== s.targetX || s.currentY !== s.targetY) {
          s.currentX = s.targetX;
          s.currentY = s.targetY;
          s.el.style.transform =
            s.targetX === 0 && s.targetY === 0
              ? ""
              : `translate(${s.targetX}px, ${s.targetY}px)`;
        }
      }
      // Always RAF — the cost is negligible, and stopping/starting on demand
      // adds complexity with little benefit.
      if (anyDirty || states.some((s) => s.pulling)) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    const ensureRaf = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const cx = e.clientX;
      const cy = e.clientY;
      for (const s of states) {
        const rect = s.el.getBoundingClientRect();
        const ex = rect.left + rect.width / 2;
        const ey = rect.top + rect.height / 2;
        const dx = cx - ex;
        const dy = cy - ey;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < rect.width / 2 + RADIUS) {
          s.targetX = dx * STRENGTH;
          s.targetY = dy * STRENGTH;
          s.pulling = true;
        } else if (s.pulling) {
          s.targetX = 0;
          s.targetY = 0;
          s.pulling = false;
        }
      }
      ensureRaf();
    };

    const onLeaveWindow = () => {
      for (const s of states) {
        s.targetX = 0;
        s.targetY = 0;
        s.pulling = false;
      }
      ensureRaf();
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeaveWindow);

    return () => {
      alive = false;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeaveWindow);
      if (raf) cancelAnimationFrame(raf);
      // Reset transforms on unmount so the next page mount doesn't
      // inherit a stale translate.
      for (const s of states) s.el.style.transform = "";
    };
  }, [pathname]);

  return null;
}
