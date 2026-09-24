import { toNumber } from "@/lib/content-format";
import type { SizerCoefficients } from "@/lib/mtower-sizing";
import { SIZER } from "@/content/tower-m";
import type { Content } from "@/content/types";

/**
 * Coefficients typed in the panel → numbers, each range-checked (bad input →
 * default). Used by the tower-m page (live configurator) and by the quote
 * request, so both compute with the same values.
 */
export function sizerCoefficients(c: Content<typeof SIZER>["coefficients"]): SizerCoefficients {
  const d = SIZER.sections.coefficients.blocks;
  const num = (key: keyof typeof d, min: number, max: number, thousands = false) => {
    const n = toNumber(c[key], NaN, { min, max, thousands });
    if (Number.isFinite(n)) return n;
    // Not silent: the panel shows the typed value while the sizer uses the default.
    console.warn(`[sizer] coefficient ${key} = "${c[key]}" is not a number in ${min}–${max}: using ${d[key].default}`);
    return Number(d[key].default);
  };
  return {
    unitKw: num("unit_kw", 100, 100000, true),
    footprintM2: num("footprint_m2", 0.1, 1000),
    waterLpm: num("water_lpm", 1, 100000, true),
    weightT: num("weight_t", 0.01, 1000),
    electricalKva: num("electrical_kva", 0.1, 100000, true),
    factor: {
      diesel: num("factor_diesel", 0.05, 2),
      gas: num("factor_gas", 0.05, 2),
      datacenter: num("factor_datacenter", 0.05, 2),
      custom: num("factor_custom", 0.05, 2),
    },
    doubleCircuit: num("double_circuit", 1, 2),
    ambientDerate: {
      30: num("derate_30c", 0.1, 1.5),
      40: num("derate_40c", 0.1, 1.5),
      50: num("derate_50c", 0.1, 1.5),
    },
    altitudeDerate: {
      low: num("derate_alt_low", 0.1, 1.5),
      med: num("derate_alt_med", 0.1, 1.5),
      high: num("derate_alt_high", 0.1, 1.5),
    },
  };
}
