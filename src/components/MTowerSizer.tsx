"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const UNIT_KW = 1500;
const MAX_VISIBLE_UNITS = 12;
const MODULE_IMG = "/assets/images/site/mtower-module.jpg";

const APPLICATIONS = [
  { value: "diesel", label: "Diesel genset", factor: 0.85 },
  { value: "gas", label: "Gas engine", factor: 0.75 },
  { value: "datacenter", label: "Datacenter IT load", factor: 1.0 },
  { value: "custom", label: "Custom (1:1)", factor: 1.0 },
] as const;
type ApplicationValue = (typeof APPLICATIONS)[number]["value"];

const AMBIENT_TEMPS = [
  { value: 30, label: "30 °C", derate: 1.0 },
  { value: 40, label: "40 °C", derate: 0.95 },
  { value: 50, label: "50 °C", derate: 0.88 },
];

const ALTITUDES = [
  { value: "low", label: "< 1000 m", derate: 1.0 },
  { value: "med", label: "1000–2000 m", derate: 0.96 },
  { value: "high", label: "> 2000 m", derate: 0.92 },
] as const;
type AltitudeValue = (typeof ALTITUDES)[number]["value"];

function configFor(units: number): string {
  if (units <= 1) return "Standalone unit";
  if (units <= 4) return "Vertical bank";
  if (units <= 8) return "Dual-bank array";
  return "Custom large array";
}

function footprintFor(units: number): string {
  return `${(units * 12).toLocaleString("en-US")} m²`;
}

export default function MTowerSizer() {
  const [power, setPower] = useState(3000);
  const [application, setApplication] = useState<ApplicationValue>("diesel");
  const [circuit, setCircuit] = useState<"single" | "double">("single");
  const [ambient, setAmbient] = useState(30);
  const [altitude, setAltitude] = useState<AltitudeValue>("low");
  const [redundancy, setRedundancy] = useState(false);

  const result = useMemo(() => {
    const appFactor = APPLICATIONS.find((a) => a.value === application)?.factor ?? 1;
    const ambientDerate = AMBIENT_TEMPS.find((a) => a.value === ambient)?.derate ?? 1;
    const altDerate = ALTITUDES.find((a) => a.value === altitude)?.derate ?? 1;
    const circuitMul = circuit === "double" ? 1.05 : 1;
    const heat = Math.round(Math.max(0, power) * appFactor * circuitMul);
    const effectiveUnitKw = Math.round(UNIT_KW * ambientDerate * altDerate);
    const baseUnits = Math.max(1, Math.ceil(heat / effectiveUnitKw));
    const units = baseUnits + (redundancy ? 1 : 0);
    const capacity = units * effectiveUnitKw;
    const headroom = capacity - heat;
    const headroomPct = heat > 0 ? Math.round((headroom / heat) * 100) : 0;
    return { heat, units, baseUnits, effectiveUnitKw, capacity, headroom, headroomPct };
  }, [power, application, circuit, ambient, altitude, redundancy]);

  const ctaHref = useMemo(() => {
    const summary =
      `M Tower configuration request\n` +
      `\n` +
      `Engine power: ${power.toLocaleString("en-US")} kW\n` +
      `Application: ${APPLICATIONS.find((a) => a.value === application)?.label ?? application}\n` +
      `Circuit: ${circuit === "double" ? "Double (HT + LT)" : "Single (HT)"}\n` +
      `Ambient: ${ambient} °C\n` +
      `Altitude: ${ALTITUDES.find((a) => a.value === altitude)?.label ?? altitude}\n` +
      `Redundancy: ${redundancy ? "N+1 (spare module)" : "N"}\n` +
      `\n` +
      `Sized build: ${result.units} × M Tower modules\n` +
      `Effective capacity: ${result.capacity.toLocaleString("en-US")} kW\n` +
      `Estimated heat rejection: ${result.heat.toLocaleString("en-US")} kW\n` +
      `Per-module derated: ${result.effectiveUnitKw.toLocaleString("en-US")} kW\n` +
      `Headroom: +${Math.max(0, result.headroomPct)}%\n`;

    const params = new URLSearchParams({
      scope: "m-tower",
      power: String(power),
      application,
      circuit,
      ambient: String(ambient),
      altitude,
      redundancy: redundancy ? "1" : "0",
      units: String(result.units),
      heat: String(result.heat),
      capacity: String(result.capacity),
      message: summary,
    });
    return `/contact?${params.toString()}#contact-form`;
  }, [power, application, circuit, ambient, altitude, redundancy, result]);

  const visibleUnits = Math.min(result.units, MAX_VISIBLE_UNITS);
  const overflow = result.units - visibleUnits;
  const spareIndex = redundancy ? result.units - 1 : -1;

  return (
    <div className="cfg">
      {/* === INPUT PANEL === */}
      <div className="cfg-input">
        <div className="cfg-power">
          <div className="cfg-power-head">
            <span className="cfg-label">Engine power</span>
            <span className="cfg-power-value">
              <strong>{power.toLocaleString("en-US")}</strong>
              <span> kW</span>
            </span>
          </div>
          <input
            type="range"
            className="cfg-slider"
            min={100}
            max={20000}
            step={50}
            value={power}
            onChange={(e) => setPower(Number(e.target.value))}
            aria-label="Engine power in kilowatts"
            style={{ ["--fill" as string]: `${((power - 100) / (20000 - 100)) * 100}%` }}
          />
          <div className="cfg-power-marks" aria-hidden="true">
            <span>100 kW</span>
            <span>5 MW</span>
            <span>10 MW</span>
            <span>15 MW</span>
            <span>20 MW</span>
          </div>
          <input
            type="number"
            className="cfg-power-number"
            min={100}
            max={50000}
            step={50}
            value={power}
            onChange={(e) => setPower(Math.max(100, Number(e.target.value) || 0))}
            aria-label="Engine power numeric input"
          />
        </div>

        <fieldset className="cfg-segmented">
          <legend className="cfg-label">Application</legend>
          <div className="cfg-segmented-row">
            {APPLICATIONS.map((a) => (
              <button
                key={a.value}
                type="button"
                className={`cfg-seg ${application === a.value ? "active" : ""}`}
                onClick={() => setApplication(a.value)}
                aria-pressed={application === a.value}
              >
                {a.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="cfg-segmented">
          <legend className="cfg-label">Circuit</legend>
          <div className="cfg-segmented-row two">
            <button
              type="button"
              className={`cfg-seg ${circuit === "single" ? "active" : ""}`}
              onClick={() => setCircuit("single")}
              aria-pressed={circuit === "single"}
            >
              Single (HT)
            </button>
            <button
              type="button"
              className={`cfg-seg ${circuit === "double" ? "active" : ""}`}
              onClick={() => setCircuit("double")}
              aria-pressed={circuit === "double"}
            >
              Double (HT + LT)
            </button>
          </div>
        </fieldset>

        <div className="cfg-row">
          <fieldset className="cfg-segmented">
            <legend className="cfg-label">Ambient temperature</legend>
            <div className="cfg-segmented-row">
              {AMBIENT_TEMPS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  className={`cfg-seg ${ambient === t.value ? "active" : ""}`}
                  onClick={() => setAmbient(t.value)}
                  aria-pressed={ambient === t.value}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="cfg-segmented">
            <legend className="cfg-label">Altitude</legend>
            <div className="cfg-segmented-row">
              {ALTITUDES.map((a) => (
                <button
                  key={a.value}
                  type="button"
                  className={`cfg-seg ${altitude === a.value ? "active" : ""}`}
                  onClick={() => setAltitude(a.value)}
                  aria-pressed={altitude === a.value}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <label className="cfg-toggle">
          <input
            type="checkbox"
            checked={redundancy}
            onChange={(e) => setRedundancy(e.target.checked)}
          />
          <span className="cfg-toggle-slider" aria-hidden="true" />
          <span className="cfg-toggle-label">
            <strong>N+1 redundancy</strong>
            <em>Add one spare module for hot-swap continuity</em>
          </span>
        </label>
      </div>

      {/* === OUTPUT PANEL: photoreal build === */}
      <div className="cfg-output" aria-live="polite">
        <div className="cfg-headline">
          <p className="kicker">YOUR M TOWER BUILD</p>
          <p className="cfg-headline-main">
            <strong>{result.units}</strong>
            <span>{result.units === 1 ? "module" : "modules"}</span>
          </p>
          <p className="cfg-headline-sub">
            {configFor(result.units)} · {footprintFor(result.units)} footprint
          </p>
        </div>

        <div className="cfg-stage" role="img" aria-label={`Visualisation of ${result.units} M Tower modules side by side`}>
          <div className="cfg-stage-ground" aria-hidden="true" />
          <div className="cfg-stage-row">
            {Array.from({ length: visibleUnits }).map((_, i) => {
              const isSpare = i === spareIndex && redundancy;
              return (
                <div
                  key={`${result.units}-${i}`}
                  className={`cfg-mod-card ${isSpare ? "spare" : ""}`}
                  style={{ animationDelay: `${i * 90}ms` }}
                >
                  <div className="cfg-mod-tag">
                    <span>M{i + 1}</span>
                    {isSpare ? <em>N+1</em> : null}
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={MODULE_IMG}
                    alt=""
                    draggable={false}
                    loading="lazy"
                  />
                  <div className="cfg-mod-cap">{UNIT_KW.toLocaleString("en-US")} kW</div>
                  {i < visibleUnits - 1 ? (
                    <span className="cfg-mod-link" aria-hidden="true" />
                  ) : null}
                </div>
              );
            })}
            {overflow > 0 ? (
              <div className="cfg-mod-overflow" aria-hidden="true">
                +{overflow}
                <span>more</span>
              </div>
            ) : null}
          </div>
          <div className="cfg-stage-pipe" aria-hidden="true">
            <span />
            <span />
          </div>
        </div>

        <div className="cfg-metrics">
          <article className="cfg-metric">
            <span className="cfg-metric-label">Estimated heat load</span>
            <span className="cfg-metric-value">
              {result.heat.toLocaleString("en-US")} <small>kW</small>
            </span>
          </article>
          <article className="cfg-metric">
            <span className="cfg-metric-label">Effective capacity</span>
            <span className="cfg-metric-value">
              {result.capacity.toLocaleString("en-US")} <small>kW</small>
            </span>
          </article>
          <article className="cfg-metric">
            <span className="cfg-metric-label">Per-module derated</span>
            <span className="cfg-metric-value">
              {result.effectiveUnitKw.toLocaleString("en-US")} <small>kW</small>
            </span>
          </article>
          <article className="cfg-metric">
            <span className="cfg-metric-label">Headroom</span>
            <span className="cfg-metric-value">
              +{Math.max(0, result.headroomPct)}
              <small>%</small>
            </span>
          </article>
        </div>

        <p className="cfg-note">
          Indicative figures. Derate factors: ambient +10 °C ≈ −5 to −7%,
          altitude &gt; 2000 m ≈ −8%. Final sizing is confirmed by Enfrio
          engineering on actual platform data.
        </p>

        <div className="cfg-cta">
          <Link className="btn solid" href={ctaHref}>
            Send this configuration to Enfrio engineering →
          </Link>
        </div>
      </div>
    </div>
  );
}
