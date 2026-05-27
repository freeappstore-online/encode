export type UnitCategory =
  | "Length"
  | "Weight"
  | "Temperature"
  | "Time"
  | "Digital"
  | "Area"
  | "Volume"
  | "Speed";

export const UNIT_CATEGORIES: UnitCategory[] = [
  "Length",
  "Weight",
  "Temperature",
  "Time",
  "Digital",
  "Area",
  "Volume",
  "Speed",
];

// Each table maps unit -> factor to the canonical unit of that category.
const lengthToM: Record<string, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.344,
};

const weightToG: Record<string, number> = {
  mg: 0.001,
  g: 1,
  kg: 1000,
  ton: 1_000_000,
  oz: 28.3495,
  lb: 453.592,
};

const timeToSec: Record<string, number> = {
  sec: 1,
  min: 60,
  hr: 3600,
  day: 86400,
  week: 604_800,
  year: 31_536_000,
};

const digitalToBytes: Record<string, number> = {
  B: 1,
  KB: 1024,
  MB: 1024 ** 2,
  GB: 1024 ** 3,
  TB: 1024 ** 4,
};

const areaToM2: Record<string, number> = {
  "mm²": 1e-6,
  "cm²": 1e-4,
  "m²": 1,
  "km²": 1e6,
  "in²": 0.00064516,
  "ft²": 0.092903,
  "yd²": 0.836127,
  acre: 4046.86,
  hectare: 10000,
};

const volumeToMl: Record<string, number> = {
  ml: 1,
  L: 1000,
  "m³": 1_000_000,
  tsp: 4.92892,
  tbsp: 14.7868,
  cup: 236.588,
  "fl oz": 29.5735,
  pt: 473.176,
  qt: 946.353,
  gal: 3785.41,
};

const speedToMs: Record<string, number> = {
  "m/s": 1,
  "km/h": 1 / 3.6,
  mph: 0.44704,
  knots: 0.514444,
  "ft/s": 0.3048,
};

const TABLES: Record<Exclude<UnitCategory, "Temperature">, Record<string, number>> = {
  Length: lengthToM,
  Weight: weightToG,
  Time: timeToSec,
  Digital: digitalToBytes,
  Area: areaToM2,
  Volume: volumeToMl,
  Speed: speedToMs,
};

export const UNITS: Record<UnitCategory, string[]> = {
  Length: Object.keys(lengthToM),
  Weight: Object.keys(weightToG),
  Temperature: ["°C", "°F", "K"],
  Time: Object.keys(timeToSec),
  Digital: Object.keys(digitalToBytes),
  Area: Object.keys(areaToM2),
  Volume: Object.keys(volumeToMl),
  Speed: Object.keys(speedToMs),
};

export const DEFAULT_UNITS: Record<UnitCategory, [string, string]> = {
  Length: ["km", "mi"],
  Weight: ["kg", "lb"],
  Temperature: ["°C", "°F"],
  Time: ["min", "hr"],
  Digital: ["MB", "GB"],
  Area: ["m²", "ft²"],
  Volume: ["L", "gal"],
  Speed: ["km/h", "mph"],
};

export function convertUnit(
  category: UnitCategory,
  from: string,
  to: string,
  value: number,
): number {
  if (from === to) return value;

  if (category === "Temperature") {
    let c: number;
    if (from === "°C") c = value;
    else if (from === "°F") c = (value - 32) * (5 / 9);
    else c = value - 273.15;

    if (to === "°C") return c;
    if (to === "°F") return c * (9 / 5) + 32;
    return c + 273.15;
  }

  const table = TABLES[category];
  const fromFactor = table[from];
  const toFactor = table[to];
  if (fromFactor === undefined || toFactor === undefined) return NaN;
  return (value * fromFactor) / toFactor;
}

export function formatUnitResult(n: number): string {
  if (!isFinite(n)) return "—";
  if (Math.abs(n) >= 1e9 || (Math.abs(n) < 1e-4 && n !== 0)) {
    return n.toExponential(4);
  }
  return parseFloat(n.toPrecision(8)).toString();
}
