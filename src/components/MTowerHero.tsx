"use client";

import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 60;
const FRAMES_BASE = "/assets/images/mtower-frames";
const POSTER = "/assets/images/site/mtower-render.png";

function framePath(i: number): string {
  const idx = ((i % FRAME_COUNT) + FRAME_COUNT) % FRAME_COUNT;
  return `${FRAMES_BASE}/${String(idx).padStart(3, "0")}.webp`;
}

/**
 * Hero background that rotates the M Tower 1:1 with the page scroll.
 * Uses an indexed image sequence (60 transparent WebPs) rather than
 * scrubbing video.currentTime — rotation perfectly tracks the cursor
 * and never plays "in between" frames.
 */
export default function MTowerHero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [frame, setFrame] = useState(0);
  const [ready, setReady] = useState(false);

  // Pre-fetch all frames so the rotation never stalls.
  useEffect(() => {
    let mounted = true;
    let loaded = 0;
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new window.Image();
      img.onload = () => {
        loaded += 1;
        if (loaded >= 6 && mounted) setReady(true);
      };
      img.src = framePath(i);
    }
    return () => {
      mounted = false;
    };
  }, []);

  // Scroll-driven frame index.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let raf = 0;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const scrolled = Math.max(0, vh - rect.top);
      const ratio = Math.min(1, Math.max(0, scrolled / total));
      setFrame(Math.floor(ratio * (FRAME_COUNT - 1)));
      raf = 0;
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

  return (
    <section ref={sectionRef} className="mtower-hero mtower-hero-360">
      <div className="mtower-hero-media" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ready ? framePath(frame) : POSTER}
          alt=""
          draggable={false}
          decoding="sync"
        />
        <div className="mtower-hero-vignette" />
      </div>

      <div className="mtower-hero-content">
        <p className="kicker">FLAGSHIP PLATFORM</p>
        <h1>
          M Tower.
          <br />
          <span className="accent">Cooling that scales</span> with your power.
        </h1>
        <p className="lead">
          Modular heat-rejection units of 1500 kW each. Start with one,
          add more as your plant grows. From standalone gensets to
          12&nbsp;MW datacenter halls — same proven core.
        </p>
        <div className="btn-row">
          <a className="btn solid" href="#mtower-sizer">Size your installation</a>
          <a className="btn ghost" href="#mtower-explore">Explore the unit</a>
        </div>
        <p className="mtower-hero-hint">↓ Scroll to rotate the unit</p>
      </div>
    </section>
  );
}
