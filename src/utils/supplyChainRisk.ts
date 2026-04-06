import type { Region } from "@/lib/types";
import { locationData } from "@/data/exploreData";

export interface SupplyChainRiskResult {
  state: string;
  district?: string;
  locationLabel: string;
  districtAdjustment: number;
  riskScore: string;
  status: "ON-TIME LIKELY" | "ELEVATED DELAY RISK" | "SEVERE DELAY RISK";
  severityColor: string;
  suggestedAction: string;
  dataMethod: string;
  modelCoverage: "FULL" | "LIMITED";
  isFallbackModel: boolean;
  contributions: {
    temperature: number;
    rainfall: number;
    crop: number;
  };
}

interface StateRiskConfig {
  tempWeight: number;
  rainWeight: number;
  hub: string;
  crop: string;
  route: string;
}

interface CalculateRiskOptions {
  dataMethod?: string;
  district?: string;
}

interface LiveClimateCalibrationInput {
  annualAvgTemp: number;
  droughtRisk: number;
  floodRisk: number;
  climateRiskScore: number;
  rainfallTrend: "increasing" | "decreasing" | "stable";
  riseIndicator?: boolean;
}

interface NormalizedLocation {
  normalizedState: string;
  displayState: string;
  normalizedDistrict: string | null;
  displayDistrict: string | null;
}

const STATE_RISK_CONFIG: Record<string, StateRiskConfig> = {
  "andhra pradesh": {
    tempWeight: 0.4961,
    rainWeight: 0.5039,
    hub: "Vijayawada Logistics Cluster",
    crop: "Sugarcane",
    route: "NH-16 Coastal Corridor",
  },
  gujarat: {
    tempWeight: 0.5175,
    rainWeight: 0.4825,
    hub: "Mundra Port Hub",
    crop: "Cotton/Groundnut",
    route: "NH-47 West Link",
  },
  haryana: {
    tempWeight: 0.4567,
    rainWeight: 0.5433,
    hub: "Sonipat Logistics Park",
    crop: "Rice",
    route: "KMP Expressway",
  },
  karnataka: {
    tempWeight: 0.5046,
    rainWeight: 0.4954,
    hub: "Dabaspete Industrial Area",
    crop: "Ragi/Pulses",
    route: "NH-48 South Link",
  },
  maharashtra: {
    tempWeight: 0.47,
    rainWeight: 0.53,
    hub: "Bhiwandi Hub",
    crop: "Onions/Maize",
    route: "Mumbai-Pune Expressway",
  },
  punjab: {
    tempWeight: 0.4789,
    rainWeight: 0.5211,
    hub: "Ambala Warehouse",
    crop: "Wheat",
    route: "DFCR (North Corridor)",
  },
  "uttar pradesh": {
    tempWeight: 0.5074,
    rainWeight: 0.4926,
    hub: "Lucknow Trans-shipment Point",
    crop: "Sugarcane/Potato",
    route: "Yamuna Expressway",
  },
  "west bengal": {
    tempWeight: 0.5335,
    rainWeight: 0.4665,
    hub: "Dankuni Hub",
    crop: "Jute/Rice",
    route: "NH-19 East Corridor",
  },
};

const DEFAULT_CONFIG: StateRiskConfig = {
  tempWeight: 0.5,
  rainWeight: 0.5,
  hub: "Central Reserve Hub",
  crop: "General Produce",
  route: "State Highways",
};

const HISTORICAL_CROP_BACKUP: Record<string, number> = {
  "andhra pradesh": 5.0,
  gujarat: 4.9,
  haryana: 4.6,
  karnataka: 5.0,
  maharashtra: 5.3,
  punjab: 4.8,
  "uttar pradesh": 5.1,
  "west bengal": 4.7,
  default: 5.0,
};

const CLIMATE_REGION_BY_STATE: Record<string, Region> = {
  "andhra pradesh": "andhra pradesh",
  gujarat: "gujarat",
  haryana: "haryana",
  karnataka: "karnataka",
  maharashtra: "maharashtra",
  punjab: "punjab",
  "uttar pradesh": "uttar pradesh",
  "west bengal": "west bengal",
};

const DISTRICT_RISK_ADJUSTMENTS: Record<string, Record<string, number>> = {
  "andhra pradesh": {
    visakhapatnam: 0.3,
    nellore: 0.2,
    anantapur: 0.4,
  },
  gujarat: {
    surat: 0.2,
    rajkot: 0.3,
    gandhinagar: -0.1,
  },
  haryana: {
    panipat: 0.2,
    ambala: -0.2,
    hisar: 0.3,
  },
  karnataka: {
    "bengaluru urban": 0.2,
    mangaluru: 0.3,
    mysuru: -0.1,
  },
  maharashtra: {
    mumbai: 0.5,
    nashik: 0.2,
    nagpur: 0.3,
  },
  punjab: {
    ludhiana: 0.3,
    amritsar: 0.2,
    mohali: -0.1,
  },
  "uttar pradesh": {
    lucknow: 0.2,
    varanasi: 0.3,
    ghaziabad: 0.4,
  },
  "west bengal": {
    kolkata: 0.4,
    howrah: 0.3,
    siliguri: 0.2,
  },
};

const STATE_ALIASES: Record<string, string> = {
  ap: "andhra pradesh",
  andhra: "andhra pradesh",
  guj: "gujarat",
  hr: "haryana",
  ka: "karnataka",
  mh: "maharashtra",
  pb: "punjab",
  up: "uttar pradesh",
  wb: "west bengal",
};

function clampScore(
  value: number | null | undefined,
  fallback: number,
): number {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return fallback;
  }

  return Math.max(0, Math.min(10, value));
}

function normalizeStateName(state: string): string {
  return state.trim().replace(/\s+/g, " ").toLowerCase();
}

function normalizeToken(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[().,]/g, "")
    .replace(/\s+/g, " ");
}

function toTitleCase(value: string): string {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function percentage(part: number, total: number): number {
  if (total <= 0) {
    return 0;
  }

  return parseFloat(((part / total) * 100).toFixed(1));
}

function resolveState(inputState: string): {
  normalized: string;
  display: string;
} {
  const tokenizedState = normalizeToken(inputState || "default");
  const normalized =
    STATE_ALIASES[tokenizedState] ??
    normalizeStateName(inputState || "default");

  const locationEntry = locationData.find(
    (entry) => normalizeToken(entry.name) === normalizeToken(normalized),
  );

  return {
    normalized,
    display: locationEntry?.name ?? toTitleCase(normalized),
  };
}

function resolveDistrict(
  stateDisplayName: string,
  inputDistrict?: string,
): {
  normalized: string | null;
  display: string | null;
} {
  if (!inputDistrict) {
    return { normalized: null, display: null };
  }

  const locationEntry = locationData.find(
    (entry) => normalizeToken(entry.name) === normalizeToken(stateDisplayName),
  );

  if (!locationEntry) {
    return {
      normalized: normalizeToken(inputDistrict),
      display: toTitleCase(normalizeToken(inputDistrict)),
    };
  }

  const matchedDistrict = locationEntry.districts.find(
    (district) => normalizeToken(district) === normalizeToken(inputDistrict),
  );

  if (!matchedDistrict) {
    return {
      normalized: normalizeToken(inputDistrict),
      display: toTitleCase(normalizeToken(inputDistrict)),
    };
  }

  return {
    normalized: normalizeToken(matchedDistrict),
    display: matchedDistrict,
  };
}

export function normalizeSupplyLocation(
  state: string,
  district?: string,
): NormalizedLocation {
  const stateResolution = resolveState(state);
  const districtResolution = resolveDistrict(stateResolution.display, district);

  return {
    normalizedState: stateResolution.normalized,
    displayState: stateResolution.display,
    normalizedDistrict: districtResolution.normalized,
    displayDistrict: districtResolution.display,
  };
}

export function calibrateLiveClimateScores(
  input: LiveClimateCalibrationInput,
): { tempScore: number; rainScore: number } {
  const baseTemp = ((input.annualAvgTemp - 20) / 18) * 10;
  const riseAdjustment = input.riseIndicator ? 0.8 : 0;
  const extremeHeatAdjustment = input.annualAvgTemp >= 36 ? 1 : 0;
  const climateBlendTemp = baseTemp * 0.7 + input.climateRiskScore * 0.3;

  const rawTempScore =
    climateBlendTemp + riseAdjustment + extremeHeatAdjustment;

  const rainBlend = input.droughtRisk * 0.55 + input.floodRisk * 0.45;
  const trendAdjustment =
    input.rainfallTrend === "increasing"
      ? 0.6
      : input.rainfallTrend === "decreasing"
        ? 0.4
        : 0;
  const variabilityAdjustment =
    Math.abs(input.droughtRisk - input.floodRisk) > 4 ? 0.5 : 0;
  const rawRainScore = rainBlend + trendAdjustment + variabilityAdjustment;

  return {
    tempScore: parseFloat(clampScore(rawTempScore, 5).toFixed(1)),
    rainScore: parseFloat(clampScore(rawRainScore, 5).toFixed(1)),
  };
}

export function getClimateRegionForState(state: string): Region | null {
  const { normalizedState } = normalizeSupplyLocation(state);
  return CLIMATE_REGION_BY_STATE[normalizedState] ?? null;
}

function getDistrictRiskAdjustment(
  normalizedState: string,
  normalizedDistrict: string | null,
): number {
  if (!normalizedDistrict) {
    return 0;
  }

  const stateAdjustments = DISTRICT_RISK_ADJUSTMENTS[normalizedState];
  if (!stateAdjustments) {
    return 0;
  }

  return stateAdjustments[normalizedDistrict] ?? 0;
}

export function calculateDetailedRisk(
  state: string,
  tempScore: number | null | undefined,
  rainScore: number | null | undefined,
  cropScore: number | null | undefined,
  options?: CalculateRiskOptions,
): SupplyChainRiskResult {
  const location = normalizeSupplyLocation(
    state || "default",
    options?.district,
  );
  const normalizedState = location.normalizedState;
  const config = STATE_RISK_CONFIG[normalizedState] ?? DEFAULT_CONFIG;
  const isFallbackModel = !STATE_RISK_CONFIG[normalizedState];

  const finalTempScore = clampScore(tempScore, 5);
  const finalRainScore = clampScore(rainScore, 5);

  let finalCropScore = cropScore;
  let dataMethod = options?.dataMethod ?? "Manual Inputs";

  if (
    finalCropScore === null ||
    finalCropScore === undefined ||
    Number.isNaN(finalCropScore)
  ) {
    finalCropScore =
      HISTORICAL_CROP_BACKUP[normalizedState] ?? HISTORICAL_CROP_BACKUP.default;
    dataMethod = `${dataMethod} + Historical Crop Backup`;
  }

  const boundedCropScore = clampScore(
    finalCropScore,
    HISTORICAL_CROP_BACKUP.default,
  );
  const temperatureContribution = finalTempScore * config.tempWeight * 0.6;
  const rainfallContribution = finalRainScore * config.rainWeight * 0.6;
  const cropContribution = boundedCropScore * 0.4;

  const rawRisk =
    temperatureContribution + rainfallContribution + cropContribution;
  const districtAdjustment = getDistrictRiskAdjustment(
    normalizedState,
    location.normalizedDistrict,
  );
  const adjustedRisk = Math.max(0, Math.min(10, rawRisk + districtAdjustment));

  if (districtAdjustment !== 0 && location.displayDistrict) {
    dataMethod = `${dataMethod} + District Modifier`;
  }

  let status: SupplyChainRiskResult["status"];
  let severityColor: string;
  let suggestedAction: string;

  if (adjustedRisk >= 7.5) {
    status = "SEVERE DELAY RISK";
    severityColor = "#d32f2f";
    suggestedAction = `Urgent reroute: divert ${config.crop} via ${config.hub} using ${config.route}.`;
  } else if (adjustedRisk >= 4.5) {
    status = "ELEVATED DELAY RISK";
    severityColor = "#f57c00";
    suggestedAction = `Prepare contingency lanes around ${config.hub} and monitor ${config.route} congestion.`;
  } else {
    status = "ON-TIME LIKELY";
    severityColor = "#388e3c";
    suggestedAction = `Standard dispatch is viable for ${config.crop} through ${config.route}.`;
  }

  return {
    state: location.displayState,
    district: location.displayDistrict ?? undefined,
    locationLabel: location.displayDistrict
      ? `${location.displayDistrict}, ${location.displayState}`
      : location.displayState,
    districtAdjustment,
    riskScore: adjustedRisk.toFixed(1),
    status,
    severityColor,
    suggestedAction,
    dataMethod,
    modelCoverage: isFallbackModel ? "LIMITED" : "FULL",
    isFallbackModel,
    contributions: {
      temperature: percentage(temperatureContribution, rawRisk),
      rainfall: percentage(rainfallContribution, rawRisk),
      crop: percentage(cropContribution, rawRisk),
    },
  };
}
