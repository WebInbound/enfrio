"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import AnimatedNumber from "./AnimatedNumber";

/**
 * Calculation coefficients, editable in the Kiwi panel ("M Tower ›
 * Configuratore — coefficienti"). PLACEHOLDER values pending confirmation
 * by Enfrio engineering; the tower-m page parses and range-checks them.
 */
export type SizerCoefficients = {
  unitKw: number;
  footprintM2: number;
  waterLpm: number;
  weightT: number;
  electricalKva: number;
  factor: { diesel: number; gas: number; datacenter: number; custom: number };
  doubleCircuit: number;
  ambientDerate: { 30: number; 40: number; 50: number };
  altitudeDerate: { low: number; med: number; high: number };
};

/** Interface texts of the simulator, from the Kiwi panel. */
export type SizerText = {
  power: string;
  application: string;
  app_diesel: string;
  app_gas: string;
  app_datacenter: string;
  app_custom: string;
  circuit: string;
  circuit_single: string;
  circuit_double: string;
  ambient: string;
  altitude: string;
  alt_low: string;
  alt_med: string;
  alt_high: string;
  redundancy: string;
  redundancy_hint: string;
  hud_title: string;
  hud_footprint: string;
  hud_water: string;
  hud_weight: string;
  hud_electrical: string;
  card_kicker: string;
  card_heat: string;
  card_footprint: string;
  card_circuits_value: string;
  card_circuits: string;
  tag1: string;
  tag2: string;
  tag3: string;
  tag4: string;
  build_kicker: string;
  module_one: string;
  module_many: string;
  config_1: string;
  config_4: string;
  config_8: string;
  config_more: string;
  footprint_word: string;
  status_online: string;
  status_module: string;
  status_modules: string;
  status_redundant: string;
  status_base: string;
  metric_heat: string;
  metric_capacity: string;
  metric_derated: string;
  metric_headroom: string;
  note: string;
  cta: string;
  share: string;
  share_copied: string;
  share_error: string;
};

const APPLICATION_VALUES = ["diesel", "gas", "datacenter", "custom"] as const;
type ApplicationValue = (typeof APPLICATION_VALUES)[number];

const AMBIENT_VALUES = [30, 40, 50] as const;

const ALTITUDE_VALUES = ["low", "med", "high"] as const;
type AltitudeValue = (typeof ALTITUDE_VALUES)[number];

type SizerProps = {
  text: SizerText;
  coefficients: SizerCoefficients;
  /** Canonical M Tower render used for the module cards. */
  moduleImg: string;
};

export default function MTowerSizer({ text: t, coefficients: k, moduleImg: MODULE_IMG }: SizerProps) {
  const UNIT_KW = k.unitKw;

  const APPLICATIONS = useMemo(
    () => [
      { value: "diesel" as const, label: t.app_diesel, factor: k.factor.diesel },
      { value: "gas" as const, label: t.app_gas, factor: k.factor.gas },
      { value: "datacenter" as const, label: t.app_datacenter, factor: k.factor.datacenter },
      { value: "custom" as const, label: t.app_custom, factor: k.factor.custom },
    ],
    [t, k],
  );

  const AMBIENT_TEMPS = useMemo(
    () => AMBIENT_VALUES.map((value) => ({ value, label: `${value} °C`, derate: k.ambientDerate[value] })),
    [k],
  );

  const ALTITUDES = useMemo(
    () => [
      { value: "low" as const, label: t.alt_low, derate: k.altitudeDerate.low },
      { value: "med" as const, label: t.alt_med, derate: k.altitudeDerate.med },
      { value: "high" as const, label: t.alt_high, derate: k.altitudeDerate.high },
    ],
    [t, k],
  );

  const configFor = (units: number): string => {
    if (units <= 1) return t.config_1;
    if (units <= 4) return t.config_4;
    if (units <= 8) return t.config_8;
    return t.config_more;
  };

  const footprintFor = (units: number): string =>
    `${(units * k.footprintM2).toLocaleString("en-US")} m²`;

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
    if (APPLICATION_VALUES.some((v) => v === a))
      setApplication(a as ApplicationValue);
    const c = params.get("circuit");
    if (c === "single" || c === "double") setCircuit(c);
    const amb = Number(params.get("ambient"));
    if (AMBIENT_VALUES.some((v) => v === amb)) setAmbient(amb);
    const alt = params.get("altitude");
    if (ALTITUDE_VALUES.some((v) => v === alt))
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
    const circuitMul = circuit === "double" ? k.doubleCircuit : 1;
    const heat = Math.round(Math.max(0, power) * appFactor * circuitMul);
    const effectiveUnitKw = Math.round(UNIT_KW * ambientDerate * altDerate);
    const baseUnits = Math.max(1, Math.ceil(heat / effectiveUnitKw));
    const units = baseUnits + (redundancy ? 1 : 0);
    const capacity = units * effectiveUnitKw;
    const headroom = capacity - heat;
    const headroomPct = heat > 0 ? Math.round((headroom / heat) * 100) : 0;
    return { heat, units, baseUnits, effectiveUnitKw, capacity, headroom, headroomPct };
  }, [power, application, circuit, ambient, altitude, redundancy, APPLICATIONS, AMBIENT_TEMPS, ALTITUDES, UNIT_KW, k.doubleCircuit]);

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
  }, [power, application, circuit, ambient, altitude, redundancy, result, APPLICATIONS, ALTITUDES]);

  const totalUnits = result.units;
  const spareIndex = redundancy ? totalUnits - 1 : -1;

  // === SCADA-style live spec HUD ===
  // Each row recomputes from result.units. When units change, the row
  // flashes lime for 200ms and the <AnimatedNumber> re-tweens to the new
  // value (see AnimatedNumber: it watches its `value` prop and re-animates
  // on every change once it has entered the viewport).
  // Coefficients (footprint m², water flow L/min, weight t, electrical
  // draw kVA) come from the Kiwi panel: placeholders until Enfrio
  // engineering confirms them there.
  const hudRows = useMemo(
    () => [
      {
        key: "thermal",
        label: "Thermal capacity",
        value: result.units * UNIT_KW,
        suffix: " kW",
        format: "int" as const,
      },
      {
        key: "footprint",
        label: t.hud_footprint,
        value: result.units * k.footprintM2,
        suffix: " m²",
        format: "float" as const,
      },
      {
        key: "water",
        label: t.hud_water,
        value: result.units * k.waterLpm,
        suffix: " L/min",
        format: "int" as const,
      },
      {
        key: "weight",
        label: t.hud_weight,
        value: result.units * k.weightT,
        suffix: " t",
        format: "float" as const,
      },
      {
        key: "electrical",
        label: t.hud_electrical,
        value: result.units * k.electricalKva,
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
    [result.units, redundancy, t, k, UNIT_KW],
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
            <span className="cfg-label">{t.power}</span>
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
          <legend className="cfg-label">{t.application}</legend>
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
          <legend className="cfg-label">{t.circuit}</legend>
          <div className="cfg-segmented-row two">
            <button
              type="button"
              className={`cfg-seg ${circuit === "single" ? "active" : ""}`}
              onClick={() => setCircuit("single")}
              aria-pressed={circuit === "single"}
            >
              {t.circuit_single}
            </button>
            <button
              type="button"
              className={`cfg-seg ${circuit === "double" ? "active" : ""}`}
              onClick={() => setCircuit("double")}
              aria-pressed={circuit === "double"}
            >
              {t.circuit_double}
            </button>
          </div>
        </fieldset>

        <div className="cfg-row">
          <fieldset className="cfg-segmented">
            <legend className="cfg-label">{t.ambient}</legend>
            <div className="cfg-segmented-row">
              {AMBIENT_TEMPS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`cfg-seg ${ambient === opt.value ? "active" : ""}`}
                  onClick={() => setAmbient(opt.value)}
                  aria-pressed={ambient === opt.value}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="cfg-segmented">
            <legend className="cfg-label">{t.altitude}</legend>
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
            <strong>{t.redundancy}</strong>
            <em>{t.redundancy_hint}</em>
          </span>
        </label>

        {/* SCADA-style live spec strip — sits inside the form column so the
            user sees the impact of every input change next to the input
            itself. Fills the space between N+1 and the static product card. */}
        <aside className="cfg-hud" aria-label="Live build specifications">
          <header className="cfg-hud-head">
            <span className="cfg-hud-led" aria-hidden="true" />
            <p className="cfg-hud-title">{t.hud_title}</p>
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
          <p className="kicker">{t.card_kicker}</p>
          <ul className="cfg-product-specs">
            <li><strong>{`${UNIT_KW.toLocaleString("en-US")} kW`}</strong><span>{t.card_heat}</span></li>
            <li><strong>{`~${k.footprintM2.toLocaleString("en-US")} m²`}</strong><span>{t.card_footprint}</span></li>
            <li><strong>{t.card_circuits_value}</strong><span>{t.card_circuits}</span></li>
          </ul>
          <p className="cfg-product-tags">
            <span>{t.tag1}</span>
            <span>{t.tag2}</span>
            <span>{t.tag3}</span>
            <span>{t.tag4}</span>
          </p>
        </div>
      </div>

      {/* === OUTPUT PANEL: photoreal build === */}
      <div className="cfg-output" aria-live="polite">
        <div className="cfg-headline">
          <p className="kicker">{t.build_kicker}</p>
          <p className="cfg-headline-main">
            <strong>{result.units}</strong>
            <span>{result.units === 1 ? t.module_one : t.module_many}</span>
          </p>
          <p className="cfg-headline-sub">
            {configFor(result.units)} · {footprintFor(result.units)} {t.footprint_word}
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
                <span className="cfg-stage-status-seg">{t.status_online}</span>
                <span className="cfg-stage-status-sep">·</span>
                <span className="cfg-stage-status-seg">
                  {totalUnits} {totalUnits === 1 ? t.status_module : t.status_modules}
                </span>
                <span className="cfg-stage-status-sep">·</span>
                <span className="cfg-stage-status-seg">
                  {(totalUnits * UNIT_KW / 1000).toFixed(1).replace(/\.0$/, "")} MW
                </span>
                <span className="cfg-stage-status-sep">·</span>
                <span className="cfg-stage-status-seg">
                  {redundancy ? t.status_redundant : t.status_base}
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
            <span className="cfg-metric-label">{t.metric_heat}</span>
            <span className="cfg-metric-value">
              {result.heat.toLocaleString("en-US")} <small>kW</small>
            </span>
          </article>
          <article className="cfg-metric">
            <span className="cfg-metric-label">{t.metric_capacity}</span>
            <span className="cfg-metric-value">
              {result.capacity.toLocaleString("en-US")} <small>kW</small>
            </span>
          </article>
          <article className="cfg-metric">
            <span className="cfg-metric-label">{t.metric_derated}</span>
            <span className="cfg-metric-value">
              {result.effectiveUnitKw.toLocaleString("en-US")} <small>kW</small>
            </span>
          </article>
          <article className="cfg-metric">
            <span className="cfg-metric-label">{t.metric_headroom}</span>
            <span className="cfg-metric-value">
              +{Math.max(0, result.headroomPct)}
              <small>%</small>
            </span>
          </article>
        </div>

        <p className="cfg-note">{t.note}</p>

        <div className="cfg-cta">
          <Link className="btn solid magnetic" href={ctaHref}>
            {t.cta}
          </Link>
          <button
            type="button"
            className="btn ghost cfg-share"
            onClick={handleShare}
            aria-live="polite"
          >
            {shareStatus === "copied"
              ? t.share_copied
              : shareStatus === "error"
                ? t.share_error
                : t.share}
          </button>
        </div>
      </div>
    </div>
  );
}
