"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  format?: "int" | "float";
};

export default function AnimatedNumber({
  value,
  duration = 1400,
  suffix = "",
  prefix = "",
  format = "int",
}: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(0);
  // Track whether this instance has ever entered the viewport. Once it has,
  // every subsequent value-prop change re-animates from the current displayed
  // value to the new value — so live HUDs (e.g. the sizer) tick on every edit.
  const hasEnteredRef = useRef(false);
  const displayRef = useRef(0);
  useEffect(() => {
    displayRef.current = display;
  }, [display]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let raf = 0;

    const animate = (start: number, from: number, to: number) => {
      const tick = (now: number) => {
        const elapsed = now - start;
        const t = Math.min(1, elapsed / duration);
        // ease-out-quint — a touch more dramatic than ease-out-cubic so
        // the number lands clearly at the final value instead of feeling
        // like it's still trickling at the end.
        const eased = 1 - Math.pow(1 - t, 5);
        setDisplay(from + (to - from) * eased);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    // Already in view from a prior trigger? Re-animate from the current
    // displayed value to the new target value on every value-prop change.
    if (hasEnteredRef.current) {
      animate(performance.now(), displayRef.current, value);
      return () => cancelAnimationFrame(raf);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasEnteredRef.current) {
            hasEnteredRef.current = true;
            animate(performance.now(), 0, value);
            observer.disconnect();
          }
        });
      },
      // Lowered from 0.4 so the count-up starts as soon as the element
      // is comfortably in view — fires earlier on fast scrolls and on
      // tall content where 40% visibility lands halfway down.
      { threshold: 0.18 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  const rendered = format === "float" ? display.toFixed(1) : Math.round(display).toLocaleString("en-US");

  return (
    <span ref={ref} className="animated-number">
      {prefix}
      {rendered}
      {suffix}
    </span>
  );
}
