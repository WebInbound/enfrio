"use client";

import { useMemo, useState } from "react";

const UNIT_KW = 1500;

const APPLICATIONS = [
  { value: "diesel", label: "Diesel genset", factor: 0.85 },
  { value: "gas", label: "Gas engine", factor: 0.75 },
  { value: "datacenter", label: "Datacenter IT load", factor: 1.0 },
  { value: "custom", label: "Custom heat duty (1:1)", factor: 1.0 },
] as const;

type ApplicationValue = (typeof APPLICATIONS)[number]["value"];

function configFor(units: number): string {
  if (units <= 1) return "Standalone unit";
  if (units <= 4) return "Vertical bank";
  if (units <= 8) return "Dual-bank array";
  return "Custom large array";
}

export default function MTowerSizer() {
  const [power, setPower] = useState(3000);
  const [application, setApplication] = useState<ApplicationValue>("diesel");
  const [circuit, setCircuit] = useState<"single" | "double">("single");
  const [redundancy, setRedundancy] = useState(false);

  const result = useMemo(() => {
    const factor = APPLICATIONS.find((a) => a.value === application)?.factor ?? 1;
    const circuitMultiplier = circuit === "double" ? 1.05 : 1;
    const heat = Math.round(Math.max(0, power) * factor * circuitMultiplier);
    const baseUnits = Math.max(1, Math.ceil(heat / UNIT_KW));
    const units = baseUnits + (redundancy ? 1 : 0);
    const coverage = units * UNIT_KW;
    return { heat, units, coverage };
  }, [power, application, circuit, redundancy]);

  const ctaHref = useMemo(() => {
    const params = new URLSearchParams({
      subject: "M Tower Sizing Inquiry",
      body:
        `Engine power: ${power} kW\n` +
        `Application: ${application}\n` +
        `Circuit: ${circuit}\n` +
        `Redundancy: ${redundancy ? "N+1" : "N"}\n` +
        `Estimated heat rejection: ${result.heat} kW\n` +
        `Suggested units: ${result.units}\n`,
    });
    return `/contact?${params.toString()}`;
  }, [power, application, circuit, redundancy, result]);

  return (
    <div className="sizer reveal">
      <div className="sizer-inputs">
        <label className="sizer-field">
          <span>Engine power (kW)</span>
          <input
            type="number"
            min={100}
            max={100000}
            step={50}
            value={power}
            onChange={(e) => setPower(Number(e.target.value) || 0)}
            inputMode="numeric"
          />
        </label>

        <label className="sizer-field">
          <span>Application</span>
          <select value={application} onChange={(e) => setApplication(e.target.value as ApplicationValue)}>
            {APPLICATIONS.map((a) => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </label>

        <label className="sizer-field">
          <span>Circuit type</span>
          <select value={circuit} onChange={(e) => setCircuit(e.target.value as "single" | "double")}>
            <option value="single">Single circuit (HT)</option>
            <option value="double">Double circuit (HT + LT)</option>
          </select>
        </label>

        <label className="sizer-field sizer-check">
          <input type="checkbox" checked={redundancy} onChange={(e) => setRedundancy(e.target.checked)} />
          <span>N+1 redundancy (add a spare module)</span>
        </label>
      </div>

      <div className="sizer-output" aria-live="polite">
        <article className="sizer-result-card">
          <p className="kicker">REQUIRED MODULES</p>
          <p className="sizer-big">{result.units}</p>
          <p className="sizer-sub">M Tower units</p>
        </article>
        <article className="sizer-result-card">
          <p className="kicker">HEAT REJECTION</p>
          <p className="sizer-big">{result.heat.toLocaleString("en-US")} kW</p>
          <p className="sizer-sub">Estimated thermal load</p>
        </article>
        <article className="sizer-result-card">
          <p className="kicker">CONFIGURATION</p>
          <p className="sizer-big">{configFor(result.units)}</p>
          <p className="sizer-sub">{result.coverage.toLocaleString("en-US")} kW capacity</p>
        </article>
      </div>

      <div className="sizer-note">
        <p className="micro-note">Indicative figures. Default factor: diesel 0.85, gas 0.75, datacenter 1.00. Double circuit reserves capacity across HT and LT loops. Site conditions (ambient temperature, altitude, water quality) and customer specifications can shift the final unit count.</p>
        <div className="btn-row">
          <a className="btn solid" href={ctaHref}>Send sizing to Enfrio engineering</a>
        </div>
      </div>
    </div>
  );
}
