"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Props = {
  /** Path to the 360° rotation MP4. Place it at /assets/video/mtower-360.mp4 */
  src?: string;
  /** Poster shown while the video loads (or always, if the file is missing) */
  poster?: string;
  /**
   * Interaction mode:
   *  - "scroll": currentTime is driven by the page scroll position while the
   *    component is in view. Sticky behaviour optional via CSS wrapper.
   *  - "drag": user drags the surface horizontally to scrub the video.
   *  - "auto": autoplay loop muted, no interaction (fallback / hero loop).
   */
  mode?: "scroll" | "drag" | "auto";
  /** When in scroll mode, how many viewport heights the rotation spans. */
  scrollSpan?: number;
  /** Optional aspect ratio (width / height) of the video container. */
  aspect?: number;
  /** Extra classes on the wrapper */
  className?: string;
};

// Bump when the mp4 file is re-uploaded — busts client + CDN cache.
const VIDEO_VER = "2";

export default function MTowerSpin({
  src = `/assets/video/mtower-360.mp4?v=${VIDEO_VER}`,
  poster = "/assets/images/site/mtower-real.jpg",
  mode = "scroll",
  scrollSpan = 1.6,
  aspect = 4 / 5,
  className = "",
}: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasVideo, setHasVideo] = useState(true);
  const [duration, setDuration] = useState(0);

  // Detect if the file is reachable + force browser to actually fetch it.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onError = () => setHasVideo(false);
    const onLoaded = () => setDuration(v.duration || 0);
    v.addEventListener("error", onError);
    v.addEventListener("loadedmetadata", onLoaded);

    // Kick the network: some browsers won't prefetch a muted, non-autoplay
    // <video> until user interaction. Play() then pause() right away; the
    // element is muted so the autoplay policy allows it.
    v.load();
    const kick = () => {
      v.play().then(() => v.pause()).catch(() => {});
    };
    if (v.readyState >= 1) {
      kick();
    } else {
      v.addEventListener("loadedmetadata", kick, { once: true });
    }

    return () => {
      v.removeEventListener("error", onError);
      v.removeEventListener("loadedmetadata", onLoaded);
    };
  }, []);

  // --- SCROLL MODE: map scroll progress -> currentTime ---
  useEffect(() => {
    if (mode !== "scroll" || !hasVideo) return;
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video) return;

    let raf = 0;
    const update = () => {
      const rect = wrap.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const total = rect.height + viewportH * scrollSpan;
      // Distance scrolled from "wrap top reaches viewport top" to end of span
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
  }, [mode, hasVideo, scrollSpan, duration]);

  // --- DRAG MODE: pointer X movement -> currentTime ---
  const dragState = useRef<{
    dragging: boolean;
    startX: number;
    startTime: number;
    width: number;
  }>({ dragging: false, startX: 0, startTime: 0, width: 1 });

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (mode !== "drag") return;
      const v = videoRef.current;
      const wrap = wrapRef.current;
      if (!v || !wrap || !v.duration) return;
      v.pause();
      dragState.current = {
        dragging: true,
        startX: e.clientX,
        startTime: v.currentTime,
        width: wrap.getBoundingClientRect().width || 1,
      };
      (e.target as Element).setPointerCapture?.(e.pointerId);
    },
    [mode],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (mode !== "drag") return;
      const ds = dragState.current;
      if (!ds.dragging) return;
      const v = videoRef.current;
      if (!v || !v.duration) return;
      const dx = e.clientX - ds.startX;
      // One full rotation per container width
      const delta = (dx / ds.width) * v.duration;
      let t = ds.startTime + delta;
      // wrap around for endless rotation
      t = ((t % v.duration) + v.duration) % v.duration;
      v.currentTime = t;
    },
    [mode],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (mode !== "drag") return;
      dragState.current.dragging = false;
      (e.target as Element).releasePointerCapture?.(e.pointerId);
    },
    [mode],
  );

  const wrapperClass = useMemo(
    () => `mtower-spin mtower-spin-${mode} ${className}`.trim(),
    [mode, className],
  );

  return (
    <div
      ref={wrapRef}
      className={wrapperClass}
      style={{ aspectRatio: `${aspect}` } as React.CSSProperties}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {hasVideo ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          playsInline
          preload="auto"
          autoPlay={mode === "auto"}
          loop={mode === "auto"}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={poster} alt="Enfrio M Tower" draggable={false} />
      )}

      {mode === "drag" && hasVideo ? (
        <div className="mtower-spin-hint" aria-hidden="true">
          <span>↔</span> drag to rotate
        </div>
      ) : null}
      {mode === "scroll" && hasVideo ? (
        <div className="mtower-spin-hint scroll" aria-hidden="true">
          <span>↓</span> scroll to rotate
        </div>
      ) : null}
    </div>
  );
}
