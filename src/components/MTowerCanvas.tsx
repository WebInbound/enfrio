"use client";

import { Canvas, useFrame } from "@react-three/fiber";
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
function MTowerBillboard({ frame }: { frame: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

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

  // Preload all 120 frames as HTMLImage so swaps come from browser cache.
  const imgsRef = useRef<HTMLImageElement[] | null>(null);
  useEffect(() => {
    const arr: HTMLImageElement[] = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new window.Image();
      img.src = framePath(i);
      arr.push(img);
    }
    imgsRef.current = arr;
    return () => {
      for (const img of arr) img.src = "";
    };
  }, []);

  useEffect(() => {
    const imgs = imgsRef.current;
    if (!imgs) return;
    const idx = ((frame % FRAME_COUNT) + FRAME_COUNT) % FRAME_COUNT;
    const img = imgs[idx];
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

  // Gentle floating bob so the unit feels alive instead of static.
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.y =
      Math.sin(state.clock.elapsedTime * 0.55) * 0.025;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1.92, 2]} />
      <meshBasicMaterial map={texture} transparent toneMapped={false} />
    </mesh>
  );
}

/* Brand-coloured radial glow under the unit. Cheap fragment shader,
   gives the canvas a hint of depth so it doesn't look like a flat decal. */
function BackdropGlow() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uColor: { value: new THREE.Color("#a3e635") },
        },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          varying vec2 vUv;
          uniform vec3 uColor;
          void main() {
            vec2 p = vUv - 0.5;
            float r = length(p);
            float a = smoothstep(0.55, 0.0, r) * 0.20;
            gl_FragColor = vec4(uColor, a);
          }
        `,
      }),
    [],
  );
  return (
    <mesh position={[0, -0.25, -0.6]}>
      <planeGeometry args={[4, 3]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
/* Public Canvas wrapper. Consumed by MTowerStage via dynamic import.         */
/* `frame` is the only input; scroll + drag logic remains in the parent so    */
/* every other interaction the page already wires up keeps working.           */
/* -------------------------------------------------------------------------- */
export default function MTowerCanvas({ frame }: { frame: number }) {
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
           needed for this billboard. */
        pointerEvents: "none",
      }}
    >
      <ambientLight intensity={1} />
      <BackdropGlow />
      <MTowerBillboard frame={frame} />
    </Canvas>
  );
}
