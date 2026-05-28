"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const FRAME_COUNT = 60;
const FRAMES_BASE = "/assets/images/mtower-frames";

function framePath(i: number): string {
  const idx = ((i % FRAME_COUNT) + FRAME_COUNT) % FRAME_COUNT;
  return `${FRAMES_BASE}/${String(idx).padStart(3, "0")}.webp`;
}

type Props = {
  /**
   * Interaction mode:
   *  - "scroll": frame index is driven by the wrapper's scroll progress.
   *  - "drag": user drags the surface horizontally; one full container
   *    width swap = one full 360° rotation.
   *  - "auto": frame index cycles automatically.
   */
  mode?: "scroll" | "drag" | "auto";
  /** Frames per second for auto mode */
  autoFps?: number;
  /** Aspect ratio (width / height) of the container */
  aspect?: number;
  /** Extra classes on the wrapper */
  className?: string;
};

export default function MTowerSpin({
  mode = "drag",
  autoFps = 18,
  aspect = 694 / 720,
  className = "",
}: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [frame, setFrame] = useState(0);

  // Pre-fetch every frame so dragging never stalls waiting for bytes
  useEffect(() => {
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new window.Image();
      img.src = framePath(i);
    }
  }, []);

  // SCROLL mode: scroll progress maps to frame index
  useEffect(() => {
    if (mode !== "scroll") return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    let raf = 0;
    const update = () => {
      const rect = wrap.getBoundingClientRect();
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
  }, [mode]);

  // AUTO mode: cycle frames at a fixed fps
  useEffect(() => {
    if (mode !== "auto") return;
    const ms = Math.max(20, 1000 / autoFps);
    const id = window.setInterval(() => {
      setFrame((f) => (f + 1) % FRAME_COUNT);
    }, ms);
    return () => window.clearInterval(id);
  }, [mode, autoFps]);

  // DRAG mode: pointer X delta moves frames 1:1 with the cursor
  const dragState = useRef<{
    dragging: boolean;
    startX: number;
    startFrame: number;
    width: number;
  }>({ dragging: false, startX: 0, startFrame: 0, width: 1 });

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (mode !== "drag") return;
      const wrap = wrapRef.current;
      if (!wrap) return;
      dragState.current = {
        dragging: true,
        startX: e.clientX,
        startFrame: frame,
        width: wrap.getBoundingClientRect().width || 1,
      };
      (e.target as Element).setPointerCapture?.(e.pointerId);
    },
    [mode, frame],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (mode !== "drag") return;
      const ds = dragState.current;
      if (!ds.dragging) return;
      const dx = e.clientX - ds.startX;
      const framesMoved = (dx / ds.width) * FRAME_COUNT;
      const next = Math.round(ds.startFrame + framesMoved);
      setFrame(((next % FRAME_COUNT) + FRAME_COUNT) % FRAME_COUNT);
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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={framePath(frame)}
        alt="Enfrio M Tower 3D render"
        draggable={false}
        decoding="sync"
      />

      {mode === "drag" ? (
        <div className="mtower-spin-hint" aria-hidden="true">
          <span>↔</span> drag to rotate
        </div>
      ) : null}
      {mode === "scroll" ? (
        <div className="mtower-spin-hint scroll" aria-hidden="true">
          <span>↓</span> scroll to rotate
        </div>
      ) : null}
    </div>
  );
}
