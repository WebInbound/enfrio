"use client";

import { useCallback, useEffect, useRef, useState, type ReactElement } from "react";

type ContextKey = "data-center" | "petrochemical" | "power-gen" | "hvac";

type Spec = { label: string; value: string };

type ContextDef = {
  key: ContextKey;
  label: string;
  blurb: string;
  specs: Spec[];
  silhouette: (props: { className?: string }) => ReactElement;
};

const ServerHall = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 600 280"
    aria-hidden="true"
    focusable="false"
  >
    {Array.from({ length: 5 }).map((_, row) =>
      Array.from({ length: 9 }).map((__, col) => (
        <rect
          key={`${row}-${col}`}
          x={40 + col * 60}
          y={30 + row * 44}
          width={46}
          height={32}
          rx={2}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      ))
    )}
    {Array.from({ length: 5 }).map((_, row) => (
      <line
        key={`hr-${row}`}
        x1={20}
        x2={580}
        y1={30 + row * 44 + 32}
        y2={30 + row * 44 + 32}
        stroke="currentColor"
        strokeWidth="0.6"
        opacity="0.45"
      />
    ))}
  </svg>
);

const Refinery = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 600 280"
    aria-hidden="true"
    focusable="false"
  >
    {/* ground */}
    <line x1="0" y1="240" x2="600" y2="240" stroke="currentColor" strokeWidth="1.2" />
    {/* towers */}
    {[40, 110, 320, 500].map((x, i) => (
      <g key={i}>
        <rect x={x} y={240 - (60 + (i % 2) * 50)} width="36" height={60 + (i % 2) * 50} fill="none" stroke="currentColor" strokeWidth="1.2" />
        <circle cx={x + 18} cy={240 - (60 + (i % 2) * 50) - 8} r="8" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </g>
    ))}
    {/* tall stack */}
    <line x1="220" y1="240" x2="220" y2="60" stroke="currentColor" strokeWidth="1.6" />
    <line x1="232" y1="240" x2="232" y2="60" stroke="currentColor" strokeWidth="1.6" />
    <line x1="220" y1="60" x2="232" y2="60" stroke="currentColor" strokeWidth="1.6" />
    {/* spheres */}
    <circle cx="400" cy="210" r="26" fill="none" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="450" cy="215" r="20" fill="none" stroke="currentColor" strokeWidth="1.2" />
    {/* pipe rack */}
    <line x1="0" y1="190" x2="600" y2="190" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
    <line x1="0" y1="200" x2="600" y2="200" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
  </svg>
);

const GensetRow = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 600 280"
    aria-hidden="true"
    focusable="false"
  >
    <line x1="0" y1="220" x2="600" y2="220" stroke="currentColor" strokeWidth="1.2" />
    {Array.from({ length: 6 }).map((_, i) => (
      <g key={i} transform={`translate(${30 + i * 95} 130)`}>
        {/* container body */}
        <rect x="0" y="0" width="80" height="90" fill="none" stroke="currentColor" strokeWidth="1.4" />
        {/* louvers */}
        {[0, 1, 2, 3].map((j) => (
          <line key={j} x1={8 + j * 18} y1="10" x2={8 + j * 18} y2="80" stroke="currentColor" strokeWidth="0.6" opacity="0.6" />
        ))}
        {/* exhaust */}
        <line x1="40" y1="0" x2="40" y2="-30" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="40" cy="-34" r="4" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </g>
    ))}
  </svg>
);

const DistrictPlant = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 600 280"
    aria-hidden="true"
    focusable="false"
  >
    <line x1="0" y1="240" x2="600" y2="240" stroke="currentColor" strokeWidth="1.2" />
    {/* main hall */}
    <rect x="160" y="120" width="280" height="120" fill="none" stroke="currentColor" strokeWidth="1.3" />
    {/* roof units */}
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={180 + i * 64} y="92" width="46" height="28" fill="none" stroke="currentColor" strokeWidth="1.2" />
    ))}
    {/* distribution lines */}
    <line x1="40" y1="240" x2="160" y2="180" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
    <line x1="560" y1="240" x2="440" y2="180" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
    {/* pumps */}
    <circle cx="100" cy="220" r="14" fill="none" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="510" cy="220" r="14" fill="none" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

const CONTEXTS: ContextDef[] = [
  {
    key: "data-center",
    label: "Data Center",
    blurb:
      "High-density compute halls. Glycol loop tuned for IT-load profiles, N+1 from day one, ready for liquid-cooled rack expansion.",
    specs: [
      { label: "Design ambient", value: "32 C" },
      { label: "Glycol mix", value: "30%" },
      { label: "Fans", value: "EC only" },
      { label: "Redundancy", value: "N+1 standard" },
    ],
    silhouette: ServerHall,
  },
  {
    key: "petrochemical",
    label: "Petrochemical",
    blurb:
      "ATEX zone-rated cooling. Sea-water-proof galvanizing, gas-tight enclosures, fan motors certified for hazardous duty.",
    specs: [
      { label: "Zoning", value: "ATEX II 3G" },
      { label: "Coating", value: "Hot-dip Zn" },
      { label: "Fans", value: "Ex-d rated" },
      { label: "Coil", value: "Cu / epoxy" },
    ],
    silhouette: Refinery,
  },
  {
    key: "power-gen",
    label: "Power Generation",
    blurb:
      "One M Tower per genset, bank up as the site grows. Tracks engine jacket-water load with proportional fan staging.",
    specs: [
      { label: "Engine pair", value: "1.5 MW" },
      { label: "Bank max", value: "12 MW" },
      { label: "Staging", value: "Proportional" },
      { label: "Footprint", value: "Bolt pattern" },
    ],
    silhouette: GensetRow,
  },
  {
    key: "hvac",
    label: "HVAC District",
    blurb:
      "District heating and cooling loops. Wide-delta-T trim, low-noise fan curve, ready for variable secondary distribution.",
    specs: [
      { label: "Loop delta-T", value: "12 K" },
      { label: "Sound", value: "Low-noise" },
      { label: "Control", value: "BMS / Modbus" },
      { label: "Glycol", value: "0 - 40%" },
    ],
    silhouette: DistrictPlant,
  },
];

export default function DeploySwitcher() {
  const [active, setActive] = useState<ContextKey>("data-center");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const setActiveByIndex = useCallback((i: number) => {
    const idx = (i + CONTEXTS.length) % CONTEXTS.length;
    setActive(CONTEXTS[idx].key);
    // Defer focus so React has rendered the new aria-selected value.
    requestAnimationFrame(() => {
      tabRefs.current[idx]?.focus();
    });
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setActiveByIndex(i + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setActiveByIndex(i - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        setActiveByIndex(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setActiveByIndex(CONTEXTS.length - 1);
      }
    },
    [setActiveByIndex]
  );

  const current = CONTEXTS.find((c) => c.key === active) ?? CONTEXTS[0];

  useEffect(() => {
    // no-op placeholder for future analytics hooks
  }, [active]);

  return (
    <div className="deploy-switcher">
      <div
        className="deploy-switcher-tabs"
        role="tablist"
        aria-label="Deployment contexts"
      >
        {CONTEXTS.map((ctx, i) => {
          const selected = ctx.key === active;
          return (
            <button
              key={ctx.key}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`deploy-tab-${ctx.key}`}
              aria-controls={`deploy-panel-${ctx.key}`}
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              className={`deploy-switcher-tab${selected ? " is-active" : ""}`}
              onClick={() => setActive(ctx.key)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              {ctx.label}
            </button>
          );
        })}
      </div>

      <div
        className="deploy-switcher-stage"
        role="tabpanel"
        id={`deploy-panel-${current.key}`}
        aria-labelledby={`deploy-tab-${current.key}`}
      >
        <div className="deploy-switcher-silhouettes" aria-hidden="true">
          {CONTEXTS.map((ctx) => {
            const Sil = ctx.silhouette;
            return (
              <Sil
                key={ctx.key}
                className={`deploy-switcher-silhouette${
                  ctx.key === active ? " is-active" : ""
                }`}
              />
            );
          })}
        </div>

        <img
          className="deploy-switcher-unit"
          src="/assets/images/site/mtower-render.png"
          alt="M Tower modular cooling unit"
        />
      </div>

      <p className="deploy-switcher-blurb">{current.blurb}</p>

      <ul className="deploy-switcher-specs">
        {current.specs.map((spec) => (
          <li key={spec.label} className="deploy-switcher-spec">
            <span className="deploy-switcher-spec-value">{spec.value}</span>
            <span className="deploy-switcher-spec-label">{spec.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
