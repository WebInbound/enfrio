"use client";

import { useEffect, useState } from "react";

const STEPS = [
  { units: 1, kW: 1500, label: "Single unit", caption: "Standalone for a 1.5 MW genset or a small datacenter pod." },
  { units: 2, kW: 3000, label: "Tandem", caption: "Two-unit pair feeding redundant cooling loops." },
  { units: 4, kW: 6000, label: "Quad bank", caption: "Vertical bank for mid-size power plants." },
  { units: 8, kW: 12000, label: "Octa array", caption: "12 MW heat rejection. Datacenter-grade scale." },
];

export default function ModularScaler() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % STEPS.length);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  const step = STEPS[active];

  return (
    <div className="modular-scaler">
      <div className="modular-stage" aria-hidden="true">
        <div className="modular-grid">
          {Array.from({ length: 8 }).map((_, i) => {
            const lit = i < step.units;
            return (
              <div
                key={i}
                className={`modular-block ${lit ? "lit" : ""}`}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="modular-block-inner" />
              </div>
            );
          })}
        </div>
        <div className="modular-readout">
          <p className="kicker">CURRENT BUILD</p>
          <p className="modular-units">{step.units} <span>{step.units === 1 ? "unit" : "units"}</span></p>
          <p className="modular-kw">{step.kW.toLocaleString("en-US")} kW</p>
          <p className="modular-caption">{step.caption}</p>
        </div>
      </div>

      <div className="modular-controls" role="tablist" aria-label="Modular configuration steps">
        {STEPS.map((s, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === active}
            className={`modular-pill ${i === active ? "active" : ""}`}
            onClick={() => setActive(i)}
          >
            <span className="modular-pill-units">{s.units}×</span>
            <span className="modular-pill-label">{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
