import type { Region, ClimateData } from "@/lib/types";
import {
  fetchNasaPowerClimatology,
  parseNasaPowerClimatologyResponse,
} from "@/services/nasaPowerApi";
import {
  fetchIsroClimateData,
  getRegionCoordinates,
} from "@/services/isroMosdacApi";

export interface RealClimateOptions {
  region: Region;
  useCache?: boolean;
  cacheDurationMs?: number;
}

const CACHE_KEY_PREFIX = "cropsense_real_climate_";
const DEFAULT_CACHE_DURATION = 6 * 60 * 60 * 1000;

function getCachedData(region: Region): ClimateData | null {
  const cached = localStorage.getItem(`${CACHE_KEY_PREFIX}${region}`);
  if (!cached) return null;

  const { data, timestamp } = JSON.parse(cached);
  if (Date.now() - timestamp > DEFAULT_CACHE_DURATION) {
    localStorage.removeItem(`${CACHE_KEY_PREFIX}${region}`);
    return null;
  }

  return data as ClimateData;
}

function setCachedData(region: Region, data: ClimateData): void {
  localStorage.setItem(
    `${CACHE_KEY_PREFIX}${region}`,
    JSON.stringify({ data, timestamp: Date.now() })
  );
}

function determineRainfallTrend(monthly: { mm: number }[]): "increasing" | "decreasing" | "stable" {
  const firstHalf = monthly.slice(0, 6).reduce((s, m) => s + m.mm, 0);
  const secondHalf = monthly.slice(6).reduce((s, m) => s + m.mm, 0);
  const diff = secondHalf - firstHalf;

  if (diff > 50) return "increasing";
  if (diff < -50) return "decreasing";
  return "stable";
}

function calculateRiskScore(
  droughtRisk: number,
  floodRisk: number,
  annualAvgTemp: number
): { score: number; level: "LOW" | "MEDIUM" | "HIGH" } {
  const tempScore = annualAvgTemp > 30 ? 3 : annualAvgTemp > 25 ? 2 : 1;
  const rawScore = (droughtRisk + floodRisk + tempScore) / 3;
  const score = Math.min(10, Math.max(0, rawScore));

  let level: "LOW" | "MEDIUM" | "HIGH";
  if (score <= 3.5) level = "LOW";
  else if (score <= 6.5) level = "MEDIUM";
  else level = "HIGH";

  return { score: parseFloat(score.toFixed(2)), level };
}

export async function fetchRealClimateData(
  options: RealClimateOptions
): Promise<ClimateData> {
  if (options.useCache !== false) {
    const cached = getCachedData(options.region);
    if (cached) return cached;
  }

  const coords = getRegionCoordinates(options.region);

  const [nasaData, isroData] = await Promise.allSettled([
    fetchNasaPowerClimatology({
      latitude: coords.latitude,
      longitude: coords.longitude,
    }),
    fetchIsroClimateData({
      region: options.region,
      state: options.region,
      latitude: coords.latitude,
      longitude: coords.longitude,
    }),
  ]);

  let monthlyRainfall: { month: string; mm: number }[];
  let monthlyTemp: { month: string; celsius: number }[];
  let annualRainfall: number;
  let annualAvgTemp: number;
  let droughtRisk = 5;
  let floodRisk = 5;

  if (nasaData.status === "fulfilled") {
    const parsed = parseNasaPowerClimatologyResponse(nasaData.value);
    monthlyRainfall = parsed.monthlyRainfall;
    monthlyTemp = parsed.monthlyTemp;
    annualRainfall = parsed.annualRainfall;
    annualAvgTemp = parsed.annualAvgTemp;
  } else {
    console.warn("NASA POWER API failed, using fallback data");
    monthlyRainfall = [
      { month: "Jan", mm: 15 },
      { month: "Feb", mm: 20 },
      { month: "Mar", mm: 25 },
      { month: "Apr", mm: 30 },
      { month: "May", mm: 60 },
      { month: "Jun", mm: 150 },
      { month: "Jul", mm: 250 },
      { month: "Aug", mm: 230 },
      { month: "Sep", mm: 180 },
      { month: "Oct", mm: 100 },
      { month: "Nov", mm: 40 },
      { month: "Dec", mm: 15 },
    ];
    monthlyTemp = [
      { month: "Jan", celsius: 18 },
      { month: "Feb", celsius: 21 },
      { month: "Mar", celsius: 26 },
      { month: "Apr", celsius: 30 },
      { month: "May", celsius: 33 },
      { month: "Jun", celsius: 32 },
      { month: "Jul", celsius: 28 },
      { month: "Aug", celsius: 27 },
      { month: "Sep", celsius: 28 },
      { month: "Oct", celsius: 27 },
      { month: "Nov", celsius: 23 },
      { month: "Dec", celsius: 19 },
    ];
    annualRainfall = monthlyRainfall.reduce((s, m) => s + m.mm, 0);
    annualAvgTemp = monthlyTemp.reduce((s, m) => s + m.celsius, 0) / 12;
  }

  if (isroData.status === "fulfilled") {
    droughtRisk = isroData.value.droughtIndex;
    floodRisk = isroData.value.floodIndex;
  } else {
    console.warn("ISRO MOSDAC API failed, using estimated risk values");
    const regionDroughtFactors: Record<string, number> = {
      "rajasthan": 8,
      "gujarat": 6,
      "maharashtra": 5,
      "karnataka": 4,
      "andhra pradesh": 4,
      "punjab": 3,
      "haryana": 3,
      "uttar pradesh": 4,
      "west bengal": 2,
    };
    droughtRisk = regionDroughtFactors[options.region] ?? 5;
    floodRisk = Math.max(0, 10 - droughtRisk);
  }

  const risk = calculateRiskScore(droughtRisk, floodRisk, annualAvgTemp);

  const result: ClimateData = {
    region: options.region,
    climateRiskScore: risk.score,
    rainfall: {
      monthly: monthlyRainfall,
      annual: annualRainfall,
      trend: determineRainfallTrend(monthlyRainfall),
    },
    temperature: {
      monthly: monthlyTemp,
      annualAvg: annualAvgTemp,
      riseIndicator: annualAvgTemp > 28,
    },
    disruptionRisk: {
      score: risk.score,
      level: risk.level,
      droughtRisk,
      floodRisk,
    },
  };

  if (options.useCache !== false) {
    setCachedData(options.region, result);
  }

  return result;
}

export async function fetchRealClimateDataWithRetry(
  options: RealClimateOptions,
  retries = 2
): Promise<ClimateData> {
  let lastError: Error | null = null;

  for (let i = 0; i <= retries; i++) {
    try {
      return await fetchRealClimateData(options);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`Attempt ${i + 1} failed:`, lastError.message);
      if (i < retries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }

  throw lastError ?? new Error("Failed to fetch climate data after retries");
}
