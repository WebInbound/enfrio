"use client";

import { useEffect, useRef, useState } from "react";

// Bump VIDEO_VER when the underlying mp4 file changes — forces clients
// to bypass any stale browser/CDN cache of the previous binary.
const VIDEO_VER = "2";
const VIDEO_LOOP = `/assets/video/mtower-3d.mp4?v=${VIDEO_VER}`;
const VIDEO_360 = `/assets/video/mtower-360.mp4?v=${VIDEO_VER}`;
const POSTER = "/assets/images/site/mtower-real.jpg";

/**
 * Hero with cinematic backdrop. Prefers:
 *  1. mtower-360.mp4 (rotation render, currentTime driven by scroll)
 *  2. mtower-3d.mp4 (any loopable ambient render)
 *  3. mtower-real.jpg (static poster)
 *
 * The chosen source is determined at runtime: we try the 360 file first
 * and fall back gracefully when it can't be loaded.
 */
export default function MTowerHero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [source, setSource] = useState<"360" | "loop" | "poster">("poster");

  // Probe which video file is actually deployed.
  useEffect(() => {
    let cancelled = false;
    const probe = async (url: string) => {
      try {
        const res = await fetch(url, { method: "HEAD" });
        return res.ok;
      } catch {
        return false;
      }
    };
    (async () => {
      if (await probe(VIDEO_360)) {
        if (!cancelled) setSource("360");
        return;
      }
      if (await probe(VIDEO_LOOP)) {
        if (!cancelled) setSource("loop");
        return;
      }
      if (!cancelled) setSource("poster");
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Scroll-driven currentTime when using the 360 render.
  useEffect(() => {
    if (source !== "360") return;
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    let raf = 0;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const viewportH = window.innerHeight;
      // Progress from "hero top hits viewport top" to "hero bottom leaves viewport".
      const total = rect.height + viewportH;
      const scrolled = Math.max(0, viewportH - rect.top);
      const ratio = Math.min(1, Math.max(0, scrolled / total));
      if (video.duration && Number.isFinite(video.duration)) {
        video.currentTime = ratio * (video.duration - 0.05);
      }
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
  }, [source]);

  return (
    <section ref={sectionRef} className={`mtower-hero mtower-hero-${source}`}>
      <div className="mtower-hero-media" aria-hidden="true">
        {source === "360" ? (
          <video
            ref={videoRef}
            src={VIDEO_360}
            poster={POSTER}
            muted
            playsInline
            preload="auto"
          />
        ) : source === "loop" ? (
          <video
            src={VIDEO_LOOP}
            poster={POSTER}
            muted
            playsInline
            preload="metadata"
            autoPlay
            loop
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={POSTER} alt="Enfrio M Tower unit" />
        )}
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
        {source === "360" ? (
          <p className="mtower-hero-hint">↓ Scroll to rotate the unit</p>
        ) : null}
      </div>
    </section>
  );
}
