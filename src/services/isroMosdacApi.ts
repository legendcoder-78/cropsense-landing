const MOSDAC_BASE = "https://mosdac.gov.in";

export interface IsroRegionParams {
  region: string;
  state: string;
  latitude: number;
  longitude: number;
}

export interface IsroMonsoonData {
  monsoonStatus: "active" | "break" | "normal" | "withdrawal";
  monsoonProgress: number;
  rainfallAnomaly: number;
  onsetDate: string | null;
  withdrawalDate: string | null;
}

export interface IsroSatelliteData {
  cloudCover: number;
  landSurfaceTemp: number;
  vegetationIndex: number;
  soilMoisture: number;
}

export interface IsroClimateResult {
  monsoon: IsroMonsoonData;
  satellite: IsroSatelliteData;
  droughtIndex: number;
  floodIndex: number;
}

async function fetchMosdacData(endpoint: string): Promise<Record<string, unknown> | null> {
  try {
    const response = await fetch(`${MOSDAC_BASE}${endpoint}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.warn(`MOSDAC API returned ${response.status}, using fallback data`);
      return null;
    }

    return response.json();
  } catch (error) {
    console.warn("MOSDAC API unavailable, using fallback data:", error);
    return null;
  }
}

function getMonsoonDataForRegion(region: string, month: number): IsroMonsoonData {
  const monsoonCalendar: Record<string, { onset: number[]; peak: number[]; withdrawal: number[] }> = {
    "kerala": { onset: [5, 6], peak: [6, 7, 8], withdrawal: [9, 10] },
    "karnataka": { onset: [5, 6], peak: [6, 7, 8], withdrawal: [9, 10] },
    "maharashtra": { onset: [5, 6], peak: [6, 7, 8], withdrawal: [9, 10] },
    "andhra pradesh": { onset: [5, 6], peak: [6, 7, 8], withdrawal: [9, 10] },
    "west bengal": { onset: [5, 6], peak: [6, 7, 8], withdrawal: [9, 10] },
    "uttar pradesh": { onset: [6, 7], peak: [7, 8], withdrawal: [9, 10] },
    "punjab": { onset: [6, 7], peak: [7, 8], withdrawal: [9, 10] },
    "haryana": { onset: [6, 7], peak: [7, 8], withdrawal: [9, 10] },
    "gujarat": { onset: [5, 6], peak: [6, 7, 8], withdrawal: [9, 10] },
  };

  const calendar = monsoonCalendar[region.toLowerCase()] ?? monsoonCalendar["karnataka"];
  const m = month + 1;

  let status: IsroMonsoonData["monsoonStatus"] = "normal";
  let progress = 0;

  if (calendar.onset.includes(m)) {
    status = "active";
    progress = 30;
  } else if (calendar.peak.includes(m)) {
    status = "active";
    progress = 75;
  } else if (calendar.withdrawal.includes(m)) {
    status = "withdrawal";
    progress = 90;
  } else if (m >= 11 || m <= 4) {
    status = "normal";
    progress = 10;
  }

  const anomalyFactors: Record<string, number> = {
    "kerala": 5,
    "karnataka": 3,
    "maharashtra": -2,
    "andhra pradesh": 4,
    "west bengal": 6,
    "uttar pradesh": -1,
    "punjab": -3,
    "haryana": -2,
    "gujarat": 1,
  };

  return {
    monsoonStatus: status,
    monsoonProgress: progress,
    rainfallAnomaly: anomalyFactors[region.toLowerCase()] ?? 0,
    onsetDate: calendar.onset[0] ? `2026-0${calendar.onset[0]}-01` : null,
    withdrawalDate: calendar.withdrawal[0] ? `2026-0${calendar.withdrawal[0]}-15` : null,
  };
}

function getSatelliteEstimates(latitude: number, longitude: number, month: number): IsroSatelliteData {
  const baseCloudCover = month >= 5 && month <= 9 ? 65 : 25;
  const baseLST = 25 + Math.sin((month - 1) * Math.PI / 6) * 10;
  const baseVI = month >= 6 && month <= 9 ? 0.7 : 0.4;
  const baseSoilMoisture = month >= 6 && month <= 9 ? 35 : 18;

  const latFactor = (latitude - 15) / 20;

  return {
    cloudCover: Math.max(0, Math.min(100, baseCloudCover + latFactor * 10)),
    landSurfaceTemp: parseFloat((baseLST + latFactor * 3).toFixed(2)),
    vegetationIndex: parseFloat(Math.max(0, Math.min(1, baseVI + latFactor * 0.1)).toFixed(2)),
    soilMoisture: Math.max(0, Math.min(100, baseSoilMoisture + latFactor * 5)),
  };
}

function calculateRiskIndices(
  monsoon: IsroMonsoonData,
  satellite: IsroSatelliteData,
  monthlyRainfall: number[]
): { droughtIndex: number; floodIndex: number } {
  const totalRainfall = monthlyRainfall.reduce((a, b) => a + b, 0);
  const avgMonthly = totalRainfall / 12;

  const droughtBase = Math.max(0, 10 - (avgMonthly / 20));
  const monsoonPenalty = monsoon.monsoonStatus === "break" ? 2 : 0;
  const soilMoistureFactor = Math.max(0, (50 - satellite.soilMoisture) / 10);

  const droughtIndex = Math.min(10, Math.max(0, droughtBase + monsoonPenalty + soilMoistureFactor));

  const peakRainfall = Math.max(...monthlyRainfall);
  const floodBase = Math.min(10, peakRainfall / 40);
  const cloudCoverFactor = satellite.cloudCover / 20;
  const floodMonsoonBonus = monsoon.monsoonStatus === "active" && monsoon.rainfallAnomaly > 0 ? 1.5 : 0;

  const floodIndex = Math.min(10, Math.max(0, floodBase + cloudCoverFactor + floodMonsoonBonus));

  return {
    droughtIndex: parseFloat(droughtIndex.toFixed(2)),
    floodIndex: parseFloat(floodIndex.toFixed(2)),
  };
}

export async function fetchIsroClimateData(params: IsroRegionParams): Promise<IsroClimateResult> {
  const currentMonth = new Date().getMonth();

  const mosdacData = await fetchMosdacData("/api/monsoon/current");

  const monsoon = getMonsoonDataForRegion(params.region, currentMonth);

  if (mosdacData?.monsoon) {
    const mosdacMonsoon = mosdacData.monsoon as Record<string, unknown>;
    if (typeof mosdacMonsoon.anomaly === "number") {
      monsoon.rainfallAnomaly = mosdacMonsoon.anomaly;
    }
  }

  const satellite = getSatelliteEstimates(params.latitude, params.longitude, currentMonth);

  const monthlyRainfallMM = [
    15, 20, 25, 30, 60, 150, 250, 230, 180, 100, 40, 15,
  ];

  const { droughtIndex, floodIndex } = calculateRiskIndices(monsoon, satellite, monthlyRainfallMM);

  return {
    monsoon,
    satellite,
    droughtIndex,
    floodIndex,
  };
}

export function getRegionCoordinates(region: string): { latitude: number; longitude: number } {
  const coordinates: Record<string, { latitude: number; longitude: number }> = {
    "punjab": { latitude: 30.9, longitude: 75.85 },
    "haryana": { latitude: 29.06, longitude: 76.08 },
    "maharashtra": { latitude: 19.75, longitude: 75.71 },
    "karnataka": { latitude: 15.32, longitude: 75.7 },
    "uttar pradesh": { latitude: 26.85, longitude: 80.95 },
    "west bengal": { latitude: 22.99, longitude: 87.85 },
    "andhra pradesh": { latitude: 15.91, longitude: 79.74 },
    "gujarat": { latitude: 22.26, longitude: 71.19 },
  };

  return coordinates[region.toLowerCase()] ?? { latitude: 20.59, longitude: 78.96 };
}
