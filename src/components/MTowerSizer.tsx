"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import AnimatedNumber from "./AnimatedNumber";

const UNIT_KW = 1500;
const MODULE_IMG = "/assets/images/site/mtower-render.png";

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
  { value: "low", label: "< 1 km", derate: 1.0 },
  { value: "med", label: "1 – 2 km", derate: 0.96 },
  { value: "high", label: "> 2 km", derate: 0.92 },
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

  // Two-way URL state — let users land on /tower-m?power=... and see the
  // simulator pre-filled, and let them share their own configuration as a
  // link. Read once on mount; write on every change (no router push so we
  // don't add history entries while sliding).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const p = Number(params.get("power"));
    if (Number.isFinite(p) && p >= 100 && p <= 100000) setPower(p);
    const a = params.get("application");
    if (APPLICATIONS.some((opt) => opt.value === a))
      setApplication(a as ApplicationValue);
    const c = params.get("circuit");
    if (c === "single" || c === "double") setCircuit(c);
    const amb = Number(params.get("ambient"));
    if (AMBIENT_TEMPS.some((t) => t.value === amb)) setAmbient(amb);
    const alt = params.get("altitude");
    if (ALTITUDES.some((opt) => opt.value === alt))
      setAltitude(alt as AltitudeValue);
    if (params.get("redundancy") === "1") setRedundancy(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    params.set("power", String(power));
    params.set("application", application);
    params.set("circuit", circuit);
    params.set("ambient", String(ambient));
    params.set("altitude", altitude);
    params.set("redundancy", redundancy ? "1" : "0");
    const next = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
    // replaceState — never push, so the back button doesn't get flooded.
    window.history.replaceState(null, "", next);
  }, [power, application, circuit, ambient, altitude, redundancy]);

  // "Share configuration" — copy the current URL (with all the sizer
  // params) to clipboard and flash a confirmation.
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "error">(
    "idle"
  );
  useEffect(() => {
    if (shareStatus === "idle") return;
    const t = window.setTimeout(() => setShareStatus("idle"), 2200);
    return () => window.clearTimeout(t);
  }, [shareStatus]);

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const ta = document.createElement("textarea");
        ta.value = url;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setShareStatus("copied");
    } catch {
      setShareStatus("error");
    }
  };

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

  const totalUnits = result.units;
  const spareIndex = redundancy ? totalUnits - 1 : -1;

  // === SCADA-style live spec HUD ===
  // Each row recomputes from result.units. When units change, the row
  // flashes lime for 200ms and the <AnimatedNumber> re-tweens to the new
  // value (see AnimatedNumber: it watches its `value` prop and re-animates
  // on every change once it has entered the viewport).
  // TODO: Confirm coefficients with Enfrio engineering (footprint m²,
  // water flow L/min, weight t, electrical draw kVA are placeholders).
  const hudRows = useMemo(
    () => [
      {
        key: "thermal",
        label: "Thermal capacity",
        value: result.units * 1500,
        suffix: " kW",
        format: "int" as const,
      },
      {
        key: "footprint",
        label: "Footprint",
        value: result.units * 12,
        suffix: " m²",
        format: "float" as const,
      },
      {
        key: "water",
        label: "Water flow",
        value: result.units * 240,
        suffix: " L/min",
        format: "int" as const,
      },
      {
        key: "weight",
        label: "Weight",
        value: result.units * 1.85,
        suffix: " t",
        format: "float" as const,
      },
      {
        key: "electrical",
        label: "Electrical draw",
        value: result.units * 18,
        suffix: " kVA",
        format: "int" as const,
      },
      {
        key: "modules",
        label: "Modules required",
        value: result.units,
        suffix: redundancy ? " (incl. N+1)" : "",
        format: "int" as const,
      },
    ],
    [result.units, redundancy],
  );

  // Per-row 200ms lime flash whenever the row's underlying value changes.
  const [flashingRows, setFlashingRows] = useState<Record<string, boolean>>({});
  const prevValuesRef = useRef<Record<string, number>>({});
  useEffect(() => {
    const timers: Array<ReturnType<typeof setTimeout>> = [];
    const next: Record<string, boolean> = {};
    let any = false;
    for (const row of hudRows) {
      const prev = prevValuesRef.current[row.key];
      if (prev !== undefined && prev !== row.value) {
        next[row.key] = true;
        any = true;
      }
      prevValuesRef.current[row.key] = row.value;
    }
    if (any) {
      setFlashingRows((s) => ({ ...s, ...next }));
      Object.keys(next).forEach((k) => {
        timers.push(
          setTimeout(() => {
            setFlashingRows((s) => {
              const copy = { ...s };
              delete copy[k];
              return copy;
            });
          }, 200),
        );
      });
    }
    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [hudRows]);

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
            max={50000}
            step={50}
            value={power}
            onChange={(e) => setPower(Number(e.target.value))}
            aria-label="Engine power in kilowatts"
            style={{ ["--fill" as string]: `${((power - 100) / (50000 - 100)) * 100}%` }}
          />
          <div className="cfg-power-marks" aria-hidden="true">
            <span>100 kW</span>
            <span>10 MW</span>
            <span>25 MW</span>
            <span>40 MW</span>
            <span>50 MW</span>
          </div>
          <input
            type="number"
            className="cfg-power-number"
            min={100}
            max={100000}
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

        {/* SCADA-style live spec strip — sits inside the form column so the
            user sees the impact of every input change next to the input
            itself. Fills the space between N+1 and the static product card. */}
        <aside className="cfg-hud" aria-label="Live build specifications">
          <header className="cfg-hud-head">
            <span className="cfg-hud-led" aria-hidden="true" />
            <p className="cfg-hud-title">LIVE BUILD READOUT</p>
          </header>
          <div className="cfg-hud-grid">
            {hudRows
              .filter((row) => row.key !== "thermal" && row.key !== "modules")
              .map((row) => (
                <div
                  key={row.key}
                  className={`cfg-hud-row ${flashingRows[row.key] ? "is-flashing" : ""}`}
                >
                  <span className="cfg-hud-label">{row.label}</span>
                  <span className="cfg-hud-value">
                    <AnimatedNumber
                      value={row.value}
                      duration={700}
                      format={row.format}
                      suffix={row.suffix}
                    />
                  </span>
                </div>
              ))}
          </div>
        </aside>

        <div className="cfg-product-card">
          <p className="kicker">SINGLE M TOWER MODULE</p>
          <ul className="cfg-product-specs">
            <li><strong>1,500 kW</strong><span>heat rejection</span></li>
            <li><strong>~12 m²</strong><span>footprint</span></li>
            <li><strong>HT / HT+LT</strong><span>circuits</span></li>
          </ul>
          <p className="cfg-product-tags">
            <span>Container-fit</span>
            <span>Sea-water</span>
            <span>ATEX-ready</span>
            <span>Inverter-ready</span>
          </p>
        </div>
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

        {(() => {
          // Lay the modules out as 1 / 2 / 3 / 4 rows depending on count so
          // the per-card size stays readable. Caps at 4 rows so even a 60+
          // module mega-bank still fits the stage without infinite vertical
          // growth.
          const rowsCount =
            totalUnits <= 6 ? 1 :
            totalUnits <= 16 ? 2 :
            totalUnits <= 30 ? 3 : 4;
          const perRow = Math.ceil(totalUnits / rowsCount);
          const showCap = totalUnits <= 4;
          const showTag = totalUnits <= 8;
          const rows: number[][] = [];
          for (let r = 0; r < rowsCount; r++) {
            const start = r * perRow;
            const end = Math.min(start + perRow, totalUnits);
            const arr: number[] = [];
            for (let k = start; k < end; k++) arr.push(k);
            rows.push(arr);
          }
          return (
            <div
              className="cfg-stage"
              role="img"
              aria-label={`Visualisation of ${totalUnits} M Tower modules`}
              data-circuit={circuit}
            >
              <div className="cfg-stage-ground" aria-hidden="true" />
              <div className="cfg-stage-grid" data-rows={rowsCount}>
                {rows.map((rowIdxs, rIdx) => (
                  <div
                    key={rIdx}
                    className="cfg-stage-row"
                    data-count={rowIdxs.length}
                    style={{ ["--count" as string]: rowIdxs.length } as React.CSSProperties}
                  >
                    {rowIdxs.map((i) => {
                      const isSpare = i === spareIndex && redundancy;
                      return (
                        <div
                          key={`${totalUnits}-${i}`}
                          className={`cfg-mod-card ${isSpare ? "spare" : ""}`}
                          style={{ animationDelay: `${Math.min(i * 70, 700)}ms` }}
                        >
                          {showTag ? (
                            <div className="cfg-mod-tag">
                              <span>M{i + 1}</span>
                              {isSpare ? <em>N+1</em> : null}
                            </div>
                          ) : null}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={MODULE_IMG}
                            alt=""
                            draggable={false}
                            loading="lazy"
                          />
                          {showCap ? (
                            <div className="cfg-mod-cap">{UNIT_KW.toLocaleString("en-US")} kW</div>
                          ) : null}
                          {i < rowIdxs[rowIdxs.length - 1] ? (
                            <span className="cfg-mod-link" aria-hidden="true" />
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="cfg-stage-pipe" aria-hidden="true">
                <span />
                <span />
              </div>

              {/* Bottom status bar — SCADA-style line that reads the bank
                  state at a glance. Lime LED + monospaced segments. */}
              <div className="cfg-stage-status" aria-hidden="true">
                <span className="cfg-stage-status-led" />
                <span className="cfg-stage-status-seg">BANK ONLINE</span>
                <span className="cfg-stage-status-sep">·</span>
                <span className="cfg-stage-status-seg">
                  {totalUnits} {totalUnits === 1 ? "MODULE" : "MODULES"}
                </span>
                <span className="cfg-stage-status-sep">·</span>
                <span className="cfg-stage-status-seg">
                  {(totalUnits * UNIT_KW / 1000).toFixed(1).replace(/\.0$/, "")} MW
                </span>
                <span className="cfg-stage-status-sep">·</span>
                <span className="cfg-stage-status-seg">
                  {redundancy ? "N+1 READY" : "BASELOAD"}
                </span>
              </div>

              {/* Power-up sweep — a vertical lime light bar that traverses
                  the stage every time the module count changes. Keyed to
                  totalUnits so React replays the animation. */}
              <span
                key={`sweep-${totalUnits}`}
                className="cfg-stage-sweep"
                aria-hidden="true"
              />
            </div>
          );
        })()}

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
          <Link className="btn solid magnetic" href={ctaHref}>
            Send this configuration to Enfrio engineering →
          </Link>
          <button
            type="button"
            className="btn ghost cfg-share"
            onClick={handleShare}
            aria-live="polite"
          >
            {shareStatus === "copied"
              ? "✓ Link copied"
              : shareStatus === "error"
                ? "Copy failed — try again"
                : "Save & share configuration"}
          </button>
        </div>
      </div>
    </div>
  );
}
