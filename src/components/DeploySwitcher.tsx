"use client";

import type { EditAttrs } from "@/lib/kiwi-edit";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactElement } from "react";

type ContextKey = "data-center" | "petrochemical" | "power-gen" | "hvac";

/* Helper: zero-padded 3-digit frame name from the /mtower-frames/ sequence. */
const frame = (i: number): string =>
  `/assets/images/mtower-frames/${String(i).padStart(3, "0")}.webp`;

type IconKey =
  | "thermometer"
  | "droplet"
  | "fan"
  | "shield"
  | "zone"
  | "coating"
  | "coil"
  | "engine"
  | "stack"
  | "staging"
  | "footprint"
  | "loop"
  | "sound"
  | "control";

type Spec = { label: string; value: string; icon: IconKey; labelEdit?: EditAttrs; valueEdit?: EditAttrs };

/** Texts of one context tab, from the Kiwi panel (tower-m page). */
export type DeployContextContent = {
  tab: string;
  blurb: string;
  spec1_label: string;
  spec1_value: string;
  spec2_label: string;
  spec2_value: string;
  spec3_label: string;
  spec3_value: string;
  spec4_label: string;
  spec4_value: string;
};

export type DeploySwitcherContent = {
  /** Same order as CONTEXTS: data center, petrochemical, power gen, HVAC. */
  contexts: [DeployContextContent, DeployContextContent, DeployContextContent, DeployContextContent];
  unitAlt: string;
  /** Canonical M Tower render (shown on the data center tab). */
  renderSrc: string;
};

type ContextDef = {
  key: ContextKey;
  label: string;
  blurb: string;
  blurbEdit?: EditAttrs;
  specs: Spec[];
  silhouette: (props: { className?: string }) => ReactElement;
  /* Same M Tower unit shown at a different rotation angle per context so
     each tab feels visually distinct without spawning new assets — uses
     the existing 120-frame WebP sequence (safe upright range 0–30). */
  unitSrc: string;
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

/* Structure of each context (icons, silhouette, render angle). The texts
   come from the Kiwi panel through props and are merged in below. */
type ContextShape = Omit<ContextDef, "label" | "blurb" | "specs"> & { icons: IconKey[] };

const CONTEXTS: ContextShape[] = [
  {
    key: "data-center",
    icons: ["thermometer", "droplet", "fan", "shield"],
    silhouette: ServerHall,
    unitSrc: "/assets/images/site/mtower-render.png", // canonical clean PNG, hero portrait (overridden by the panel's render)
  },
  {
    key: "petrochemical",
    icons: ["zone", "coating", "fan", "coil"],
    silhouette: Refinery,
    unitSrc: frame(8), // slight rotation toward side
  },
  {
    key: "power-gen",
    icons: ["engine", "stack", "staging", "footprint"],
    silhouette: GensetRow,
    unitSrc: frame(18), // more side view (inverter cabinet visible)
  },
  {
    key: "hvac",
    icons: ["loop", "sound", "control", "droplet"],
    silhouette: DistrictPlant,
    unitSrc: frame(28), // side-back, manifold visible (HVAC piping vibe)
  },
];

/* Inline SVG icon library — line-art lime icons drawn with currentColor
   so colour follows CSS. Each icon is 24×24, stroke 1.6, round caps.
   Designed to read at the 22-26px size used in spec cards. */
function SpecIcon({ name, className }: { name: IconKey; className?: string }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false as const,
    className,
  };
  switch (name) {
    case "thermometer":
      return (
        <svg {...common}>
          <path d="M14 4a2 2 0 0 0-4 0v10.2a4 4 0 1 0 4 0V4Z" />
          <circle cx="12" cy="17" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      );
    case "droplet":
      return (
        <svg {...common}>
          <path d="M12 3.5C8.5 8 6 11.4 6 14.6a6 6 0 0 0 12 0c0-3.2-2.5-6.6-6-11.1Z" />
        </svg>
      );
    case "fan":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="2" />
          <path d="M12 4c2.5 0 4 1.5 4 3.5S14.5 11 12 11" />
          <path d="M20 12c0 2.5-1.5 4-3.5 4S13 14.5 13 12" />
          <path d="M12 20c-2.5 0-4-1.5-4-3.5S9.5 13 12 13" />
          <path d="M4 12c0-2.5 1.5-4 3.5-4S11 9.5 11 12" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6l-8-3Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "zone":
      return (
        <svg {...common}>
          <path d="M12 3 2 21h20L12 3Z" />
          <path d="M12 10v4" />
          <circle cx="12" cy="17" r="0.8" fill="currentColor" stroke="none" />
        </svg>
      );
    case "coating":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M4 9h16M9 4v16" strokeOpacity="0.5" />
        </svg>
      );
    case "coil":
      return (
        <svg {...common}>
          <path d="M5 8c0-2 2-3 4-3M5 12c0-2 2-3 4-3M5 16c0-2 2-3 4-3" />
          <path d="M9 5c2 0 4 1 4 3M9 9c2 0 4 1 4 3M9 13c2 0 4 1 4 3" />
          <path d="M13 8c0-2 2-3 4-3M13 12c0-2 2-3 4-3M13 16c0-2 2-3 4-3" />
        </svg>
      );
    case "engine":
      return (
        <svg {...common}>
          <rect x="4" y="9" width="11" height="9" rx="1.5" />
          <path d="M15 12h3v3h-3" />
          <path d="M6 9V6h7v3M9 18v2M11 18v2" />
        </svg>
      );
    case "stack":
      return (
        <svg {...common}>
          <path d="M4 8h16M4 12h16M4 16h16" />
          <path d="M6 8V6h12v2M6 16v2h12v-2" strokeOpacity="0.5" />
        </svg>
      );
    case "staging":
      return (
        <svg {...common}>
          <path d="M4 19h4v-4h4V11h4V7h4" />
        </svg>
      );
    case "footprint":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="1.5" strokeDasharray="2 2" />
          <path d="M9 9h6v6H9z" />
        </svg>
      );
    case "loop":
      return (
        <svg {...common}>
          <path d="M17 7a6 6 0 0 1 0 10H7" />
          <path d="m10 14-3 3 3 3" />
        </svg>
      );
    case "sound":
      return (
        <svg {...common}>
          <path d="M4 10v4h3l5 4V6L7 10H4Z" />
          <path d="M16 9c1.5 1 1.5 5 0 6" />
        </svg>
      );
    case "control":
      return (
        <svg {...common}>
          <rect x="5" y="5" width="14" height="14" rx="2" />
          <path d="M9 9h6v6H9z" />
          <path d="M9 1.5V5M15 1.5V5M9 19v3.5M15 19v3.5M1.5 9H5M1.5 15H5M19 9h3.5M19 15h3.5" strokeOpacity="0.6" />
        </svg>
      );
    default:
      return null;
  }
}

/** Kiwi editor markers of one context tab (same keys as its texts). */
export type DeployContextEdit = Partial<Record<keyof DeployContextContent, EditAttrs>>;

export default function DeploySwitcher({
  content,
  edit,
  editing,
}: {
  content: DeploySwitcherContent;
  /** Kiwi editor markers, same order as `content.contexts` (undefined for visitors). */
  edit?: DeployContextEdit[];
  /** Inside the Kiwi editor the tabs keep switching (the overlay lets them through). */
  editing?: boolean;
}) {
  const [active, setActive] = useState<ContextKey>("data-center");

  const contexts: ContextDef[] = useMemo(
    () =>
      CONTEXTS.map((ctx, i) => {
        const t = content.contexts[i];
        const ed = edit?.[i];
        const specText = [
          [t.spec1_label, t.spec1_value],
          [t.spec2_label, t.spec2_value],
          [t.spec3_label, t.spec3_value],
          [t.spec4_label, t.spec4_value],
        ];
        return {
          key: ctx.key,
          silhouette: ctx.silhouette,
          unitSrc: i === 0 ? content.renderSrc : ctx.unitSrc,
          label: t.tab,
          blurb: t.blurb,
          blurbEdit: ed?.blurb,
          specs: ctx.icons.map((icon, j) => ({
            icon,
            label: specText[j][0],
            value: specText[j][1],
            labelEdit: ed?.[`spec${j + 1}_label` as keyof DeployContextContent],
            valueEdit: ed?.[`spec${j + 1}_value` as keyof DeployContextContent],
          })),
        };
      }),
    [content, edit],
  );
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

  const current = contexts.find((c) => c.key === active) ?? contexts[0];

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
        {contexts.map((ctx, i) => {
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
              {...(editing ? { "data-kiwi-allow-click": "" } : {})}
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
          {contexts.map((ctx) => {
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

        {/* Cross-fade between the 4 context angles via stacked imgs so
            switching tabs feels like the unit physically pivots into the
            new perspective, not pops. Keyed on `current.unitSrc` so React
            re-mounts the visible img and replays the fade-in. */}
        <div className="deploy-switcher-unit-wrap" aria-hidden="false">
          {contexts.map((ctx) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={ctx.key}
              className={`deploy-switcher-unit${
                ctx.key === active ? " is-active" : ""
              }`}
              src={ctx.unitSrc}
              alt={ctx.key === active ? content.unitAlt : ""}
              loading="lazy"
              draggable={false}
            />
          ))}
        </div>
      </div>

      <p className="deploy-switcher-blurb" {...current.blurbEdit}>{current.blurb}</p>

      <ul className="deploy-switcher-specs">
        {current.specs.map((spec, j) => (
          <li key={j} className="deploy-switcher-spec">
            <span className="deploy-switcher-spec-icon">
              <SpecIcon name={spec.icon} />
            </span>
            <span className="deploy-switcher-spec-value" {...spec.valueEdit}>{spec.value}</span>
            <span className="deploy-switcher-spec-label" {...spec.labelEdit}>{spec.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
