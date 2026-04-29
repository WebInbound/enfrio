"use client";

import { useEffect, useRef, useState } from "react";

const VIDEO_SRC = "/assets/video/mtower-3d.mp4";
const POSTER = "/assets/images/site/mtower-real.jpg";

export default function MTowerHero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasVideo, setHasVideo] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onError = () => setHasVideo(false);
    v.addEventListener("error", onError);
    return () => v.removeEventListener("error", onError);
  }, []);

  return (
    <section className="mtower-hero">
      <div className="mtower-hero-media" aria-hidden={!hasVideo ? "true" : undefined}>
        {hasVideo ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={POSTER}
          >
            <source src={VIDEO_SRC} type="video/mp4" />
          </video>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={POSTER} alt="Enfrio M Tower unit" />
        )}
        <div className="mtower-hero-vignette" aria-hidden="true" />
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
          <a className="btn ghost" href="#mtower-modular">See how modular works</a>
        </div>
      </div>
    </section>
  );
}
