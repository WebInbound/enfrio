"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const FRAME_COUNT = 120;
const FRAMES_BASE = "/assets/images/mtower-frames";

function framePath(i: number): string {
  const idx = ((i % FRAME_COUNT) + FRAME_COUNT) % FRAME_COUNT;
  return `${FRAMES_BASE}/${String(idx).padStart(3, "0")}.webp`;
}

/* -------------------------------------------------------------------------- */
/* Billboard plane. Swaps one Texture's `image` source on every frame change. */
/* The 120 WebPs are preloaded as HTMLImage so cache, not network, services   */
/* every swap.                                                                */
/*                                                                            */
/* Drop-in path to real 3D when Enfrio delivers a .glb: replace this          */
/* component with one that loads the model via useGLTF and rotates the loaded */
/* scene by `(frame / FRAME_COUNT) * 2π`. The Canvas wrapper above and the    */
/* `frame` prop contract stay identical.                                      */
/* -------------------------------------------------------------------------- */
function MTowerBillboard({
  frame,
  cursorRef,
}: {
  frame: number;
  cursorRef: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const tiltRef = useRef({ x: 0, y: 0 });

  // One Texture, mutable image source. Three.js re-uploads to GPU only when
  // needsUpdate fires, so per-scroll cost stays bounded.
  const texture = useMemo(() => {
    const tex = new THREE.Texture();
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    tex.anisotropy = 4;
    return tex;
  }, []);

  // Frame cache as HTMLImage so swaps come from browser cache, not network.
  const imgsRef = useRef<HTMLImageElement[] | null>(null);
  useEffect(() => {
    const arr: HTMLImageElement[] = [];
    for (let i = 0; i < FRAME_COUNT; i++) arr.push(new window.Image());
    imgsRef.current = arr;
    // Eager-load only the scroll-arc frames (0..30) the hero shows on load and
    // during the capped scroll rotation. The remaining drag-only angles are
    // deferred until the browser is idle so they don't compete for bandwidth
    // on first paint (was: all 120 frames, ~7.6MB, fetched on mount). Any
    // frame dragged to before the idle pass runs is fetched on demand in the
    // swap effect below.
    const EAGER = 31;
    for (let i = 0; i < EAGER; i++) arr[i].src = framePath(i);
    const loadRest = () => {
      for (let i = EAGER; i < FRAME_COUNT; i++) if (!arr[i].src) arr[i].src = framePath(i);
    };
    const hasRIC = typeof window.requestIdleCallback === "function";
    const idleId = hasRIC
      ? window.requestIdleCallback(loadRest, { timeout: 3000 })
      : window.setTimeout(loadRest, 1500);
    return () => {
      if (hasRIC) window.cancelIdleCallback(idleId as number);
      else window.clearTimeout(idleId as number);
      for (const img of arr) img.src = "";
    };
  }, []);

  useEffect(() => {
    const imgs = imgsRef.current;
    if (!imgs) return;
    const idx = ((frame % FRAME_COUNT) + FRAME_COUNT) % FRAME_COUNT;
    const img = imgs[idx];
    // On-demand fetch for a frame dragged to before the idle prefetch ran.
    if (img && !img.src) img.src = framePath(idx);
    const apply = () => {
      texture.image = img;
      texture.needsUpdate = true;
    };
    if (img.complete && img.naturalWidth > 0) {
      apply();
    } else {
      const onLoad = () => {
        apply();
        img.removeEventListener("load", onLoad);
      };
      img.addEventListener("load", onLoad);
    }
  }, [frame, texture]);

  // Gentle floating bob + cursor-driven tilt. Both use damped lerp so
  // the unit feels alive without ever flicking around. The horizontal
  // rotation around Y is owned by the texture swap (frame index) — we
  // only nudge X and Z here so the two systems never fight.
  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const lerp = 1 - Math.exp(-delta * 6);
    // cursor.x in [-1, 1] -> tilt around Y axis (yaw)
    // cursor.y in [-1, 1] -> tilt around X axis (pitch)
    const targetYaw = cursorRef.current.x * 0.12;
    const targetPitch = -cursorRef.current.y * 0.08;
    tiltRef.current.x += (targetPitch - tiltRef.current.x) * lerp;
    tiltRef.current.y += (targetYaw - tiltRef.current.y) * lerp;
    mesh.rotation.x = tiltRef.current.x;
    mesh.rotation.y = tiltRef.current.y;
    mesh.position.y = Math.sin(state.clock.elapsedTime * 0.55) * 0.025;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1.92, 2]} />
      <meshBasicMaterial map={texture} transparent toneMapped={false} />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
/* BackdropGlow removed. Reasoning:                                           */
/*  - The radial gradient plane was visible as a rectangle at higher opacity  */
/*    (plane edges read as a yellow box around the unit).                     */
/*  - The brand-coloured ambient is already provided by the parent section's  */
/*    `.mtower-stage-bg` CSS layer (blue + lime radial gradients), which sits */
/*    behind the canvas and renders edge-to-edge without artefacts.           */
/*  - Doubling the glow in WebGL tinted the CAD-derived render away from its  */
/*    canonical grey/black/blue colours, drifting from `mtower-render.png`.   */
/* The canvas now shows the unit on a fully transparent stage and inherits    */
/* its brand atmosphere from the page chrome.                                 */
/* -------------------------------------------------------------------------- */
/* Reads the cursor's normalised position over the host element and writes    */
/* it into a ref the billboard reads on every R3F frame. Listens on the       */
/* parent .mtower-stage-visual (not the canvas — which has pointer-events:    */
/* none so the parent's drag handler keeps working).                          */
/* -------------------------------------------------------------------------- */
function CursorTracker({
  cursorRef,
}: {
  cursorRef: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    const host = canvas.parentElement;
    if (!host) return;
    const onMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      cursorRef.current.x = Math.max(-1, Math.min(1, x));
      cursorRef.current.y = Math.max(-1, Math.min(1, y));
    };
    const onLeave = () => {
      cursorRef.current.x = 0;
      cursorRef.current.y = 0;
    };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [gl, cursorRef]);
  return null;
}

/* -------------------------------------------------------------------------- */
/* Public Canvas wrapper. Consumed by MTowerStage via dynamic import.         */
/* `frame` is the only input; scroll + drag logic remains in the parent so    */
/* every other interaction the page already wires up keeps working.           */
/* -------------------------------------------------------------------------- */
export default function MTowerCanvas({ frame }: { frame: number }) {
  const cursorRef = useRef({ x: 0, y: 0 });
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 28 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      dpr={[1, 2]}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        /* Let pointerdown/move/up pass through to the parent wrapper, which
           owns the drag-to-rotate handler. R3F's own pointer events are not
           needed for the billboard. The cursor tilt below reads pointermove
           from the parent element directly, so it still works with this set. */
        pointerEvents: "none",
      }}
    >
      <ambientLight intensity={1} />
      <CursorTracker cursorRef={cursorRef} />
      <MTowerBillboard frame={frame} cursorRef={cursorRef} />
    </Canvas>
  );
}
