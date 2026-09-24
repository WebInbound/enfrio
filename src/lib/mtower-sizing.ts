// M Tower sizing: the configurator's maths, shared by the browser (live
// simulator) and the server (quote request + PDF summary), so the numbers
// Enfrio receives are recomputed from the inputs, never taken from the client.
// Isomorphic: no server-only imports.

/** Engine power accepted by the numeric field, a shared link and a quote request (kW). */
export const POWER_MIN = 100;
export const POWER_MAX = 100000;

export const APPLICATION_VALUES = ["diesel", "gas", "datacenter", "custom"] as const;
export type ApplicationValue = (typeof APPLICATION_VALUES)[number];

export const AMBIENT_VALUES = [30, 40, 50] as const;
export type AmbientValue = (typeof AMBIENT_VALUES)[number];

export const ALTITUDE_VALUES = ["low", "med", "high"] as const;
export type AltitudeValue = (typeof ALTITUDE_VALUES)[number];

export type CircuitValue = "single" | "double";

/**
 * Calculation coefficients, editable in the Kiwi panel ("M Tower ›
 * Configuratore — coefficienti"). PLACEHOLDER values pending confirmation
 * by Enfrio engineering; parsed and range-checked by sizerCoefficients().
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

export type SizerInputs = {
  power: number;
  application: ApplicationValue;
  circuit: CircuitValue;
  ambient: number;
  altitude: AltitudeValue;
  redundancy: boolean;
};

export type SizerResult = ReturnType<typeof sizeBuild>;

export function sizeBuild(i: SizerInputs, k: SizerCoefficients) {
  const appFactor = k.factor[i.application] ?? 1;
  const ambientDerate = k.ambientDerate[i.ambient as AmbientValue] ?? 1;
  const altDerate = k.altitudeDerate[i.altitude] ?? 1;
  const circuitMul = i.circuit === "double" ? k.doubleCircuit : 1;
  const heat = Math.round(Math.max(0, i.power) * appFactor * circuitMul);
  const effectiveUnitKw = Math.round(k.unitKw * ambientDerate * altDerate);
  const baseUnits = Math.max(1, Math.ceil(heat / effectiveUnitKw));
  const units = baseUnits + (i.redundancy ? 1 : 0);
  const capacity = units * effectiveUnitKw;
  const headroom = capacity - heat;
  const headroomPct = heat > 0 ? Math.round((headroom / heat) * 100) : 0;
  return {
    heat,
    units,
    baseUnits,
    effectiveUnitKw,
    capacity,
    headroom,
    headroomPct,
    footprintM2: units * k.footprintM2,
    waterLpm: units * k.waterLpm,
    weightT: units * k.weightT,
    electricalKva: units * k.electricalKva,
  };
}

/**
 * Inputs of a quote request, strictly: anything out of range or unknown is
 * rejected (null), never silently replaced by a default.
 */
export function parseSizerInputs(raw: (key: string) => string): SizerInputs | null {
  const power = Number(raw("power"));
  const application = raw("application");
  const circuit = raw("circuit");
  const ambient = Number(raw("ambient"));
  const altitude = raw("altitude");
  const redundancy = raw("redundancy");
  if (!Number.isInteger(power) || power < POWER_MIN || power > POWER_MAX) return null;
  if (!APPLICATION_VALUES.some((v) => v === application)) return null;
  if (circuit !== "single" && circuit !== "double") return null;
  if (!AMBIENT_VALUES.some((v) => v === ambient)) return null;
  if (!ALTITUDE_VALUES.some((v) => v === altitude)) return null;
  if (redundancy !== "0" && redundancy !== "1") return null;
  return {
    power,
    application: application as ApplicationValue,
    circuit,
    ambient,
    altitude: altitude as AltitudeValue,
    redundancy: redundancy === "1",
  };
}

/** "3,000" (en-US) / "3.000" (it-IT), at most `digits` decimals, as the configurator shows it. */
export function fmt(n: number, digits = 0, locale = "en-US"): string {
  return n.toLocaleString(locale, { maximumFractionDigits: digits });
}
