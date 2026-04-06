import type { Region, ClimateData } from "@/lib/types";
import { getRegionCoordinates } from "@/services/isroMosdacApi";

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

async function fetchNasaPowerDaily(lat: number, lon: number, year: number) {
  const start = `${year}0101`;
  const end = `${year}1231`;
  const res = await fetch(
    `https://power.larc.nasa.gov/api/temporal/daily/point?latitude=${lat}&longitude=${lon}&community=RE&parameters=PRECTOTCORR,T2M&start=${start}&end=${end}&format=JSON`
  );
  if (!res.ok) throw new Error(`NASA POWER API error: ${res.status}`);
  return res.json();
}

function aggregateMonthlyFromDaily(
  parameterData: Record<string, number>,
  months: string[]
): { month: string; value: number }[] {
  return months.map((month, monthIdx) => {
    let total = 0;
    let count = 0;
    for (const [dateStr, value] of Object.entries(parameterData)) {
      if (dateStr.length >= 6) {
        const m = parseInt(dateStr.slice(4, 6), 10) - 1;
        if (m === monthIdx) {
          total += value;
          count++;
        }
      }
    }
    return { month, value: count > 0 ? total / count : 0 };
  });
}

async function fetchOpenMeteoClimatology(lat: number, lon: number) {
  const res = await fetch(
    `https://api.open-meteo.com/v1/climate?latitude=${lat}&longitude=${lon}&monthly=precipitation_sum,temperature_2m_mean&timezone=auto`
  );
  if (!res.ok) throw new Error(`Open-Meteo API error: ${res.status}`);
  return res.json();
}

export async function fetchRealClimateData(
  options: RealClimateOptions
): Promise<ClimateData> {
  if (options.useCache !== false) {
    const cached = getCachedData(options.region);
    if (cached) return cached;
  }

  const coords = getRegionCoordinates(options.region);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  let monthlyRainfall: { month: string; mm: number }[];
  let monthlyTemp: { month: string; celsius: number }[];
  let annualRainfall: number;
  let annualAvgTemp: number;

  try {
    const nasaData = await fetchNasaPowerDaily(
      coords.latitude,
      coords.longitude,
      new Date().getFullYear() - 1
    );

    const properties = nasaData.properties as Record<string, unknown> | undefined;
    const parameterData = properties?.parameter as Record<string, Record<string, number>> | undefined;

    if (parameterData) {
      const rainfallMonthly = aggregateMonthlyFromDaily(
        parameterData.PRECTOTCORR ?? {},
        months
      );
      const tempMonthly = aggregateMonthlyFromDaily(
        parameterData.T2M ?? {},
        months
      );

      monthlyRainfall = rainfallMonthly.map((m) => ({
        month: m.month,
        mm: parseFloat((m.value * 30.44).toFixed(2)),
      }));
      monthlyTemp = tempMonthly.map((m) => ({
        month: m.month,
        celsius: parseFloat(m.value.toFixed(2)),
      }));
      annualRainfall = monthlyRainfall.reduce((s, m) => s + m.mm, 0);
      annualAvgTemp = monthlyTemp.reduce((s, m) => s + m.celsius, 0) / 12;
    } else {
      throw new Error("Invalid NASA POWER response");
    }
  } catch (err) {
    console.warn("NASA POWER API failed, trying Open-Meteo:", err);

    try {
      const omData = await fetchOpenMeteoClimatology(
        coords.latitude,
        coords.longitude
      );

      const precip = omData.monthly?.precipitation_sum ?? [];
      const temps = omData.monthly?.temperature_2m_mean ?? [];

      monthlyRainfall = months.map((month, i) => ({
        month,
        mm: parseFloat((precip[i] ?? 0).toFixed(2)),
      }));
      monthlyTemp = months.map((month, i) => ({
        month,
        celsius: parseFloat((temps[i] ?? 0).toFixed(2)),
      }));
      annualRainfall = monthlyRainfall.reduce((s, m) => s + m.mm, 0);
      annualAvgTemp = monthlyTemp.reduce((s, m) => s + m.celsius, 0) / 12;
    } catch (err2) {
      console.warn("Open-Meteo also failed, using fallback data:", err2);
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
  }

  let droughtRisk = 5;
  let floodRisk = 5;

  try {
    const omRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&daily=precipitation_sum,temperature_2m_max&timezone=auto&forecast_days=30`
    );
    if (omRes.ok) {
      const omDaily = await omRes.json();
      const precipValues = omDaily.daily?.precipitation_sum ?? [];
      const maxTemps = omDaily.daily?.temperature_2m_max ?? [];

      const totalPrecip = precipValues.filter((v: number) => v > 0).length;
      const avgMaxTemp = maxTemps.length > 0
        ? maxTemps.reduce((a: number, b: number) => a + b, 0) / maxTemps.length
        : 25;

      const rainyDaysRatio = totalPrecip / Math.max(1, precipValues.length);
      droughtRisk = Math.max(0, Math.min(10, (1 - rainyDaysRatio) * 10));
      floodRisk = Math.max(0, Math.min(10, rainyDaysRatio * 12));

      if (avgMaxTemp > 38) droughtRisk = Math.min(10, droughtRisk + 2);
      if (avgMaxTemp < 10) floodRisk = Math.min(10, floodRisk + 1);
    }
  } catch (err) {
    console.warn("Open-Meteo forecast failed, using estimated risk values:", err);
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
