import type { Region, ClimateData } from "./types";

export const CROP_PARAMS: Record<string, {
  idealTemp: [number, number];
  idealRain: [number, number];
  droughtTolerance: number;
  floodTolerance: number;
}> = {
  "Wheat": { idealTemp: [15, 25], idealRain: [50, 100], droughtTolerance: 0.3, floodTolerance: 0.2 },
  "Rice": { idealTemp: [20, 35], idealRain: [100, 250], droughtTolerance: 0.1, floodTolerance: 0.8 },
  "Cotton": { idealTemp: [25, 35], idealRain: [50, 120], droughtTolerance: 0.6, floodTolerance: 0.2 },
  "Sugarcane": { idealTemp: [21, 27], idealRain: [75, 150], droughtTolerance: 0.2, floodTolerance: 0.4 },
  "Maize": { idealTemp: [21, 27], idealRain: [50, 100], droughtTolerance: 0.4, floodTolerance: 0.3 },
  "Soybean": { idealTemp: [20, 30], idealRain: [60, 120], droughtTolerance: 0.3, floodTolerance: 0.3 },
  "Groundnut": { idealTemp: [20, 30], idealRain: [50, 100], droughtTolerance: 0.5, floodTolerance: 0.2 },
  "Mustard": { idealTemp: [10, 25], idealRain: [30, 80], droughtTolerance: 0.5, floodTolerance: 0.2 },
  "Potato": { idealTemp: [15, 25], idealRain: [50, 100], droughtTolerance: 0.2, floodTolerance: 0.3 },
  "Jute": { idealTemp: [24, 38], idealRain: [150, 250], droughtTolerance: 0.1, floodTolerance: 0.6 },
  "Tea": { idealTemp: [20, 30], idealRain: [150, 300], droughtTolerance: 0.2, floodTolerance: 0.5 },
  "Coffee": { idealTemp: [15, 28], idealRain: [150, 250], droughtTolerance: 0.2, floodTolerance: 0.3 },
  "Millet": { idealTemp: [20, 35], idealRain: [40, 80], droughtTolerance: 0.8, floodTolerance: 0.2 },
  "Pulses": { idealTemp: [20, 30], idealRain: [40, 100], droughtTolerance: 0.6, floodTolerance: 0.3 },
  "Turmeric": { idealTemp: [20, 35], idealRain: [150, 250], droughtTolerance: 0.3, floodTolerance: 0.5 },
};

export const REGION_CROPS: Record<Region, string[]> = {
  "punjab": ["Wheat", "Rice", "Cotton", "Maize", "Sugarcane"],
  "haryana": ["Wheat", "Rice", "Cotton", "Sugarcane", "Mustard"],
  "maharashtra": ["Cotton", "Sugarcane", "Soybean", "Groundnut", "Turmeric"],
  "karnataka": ["Coffee", "Sugarcane", "Maize", "Groundnut", "Cotton"],
  "uttar pradesh": ["Wheat", "Rice", "Sugarcane", "Potato", "Pulses"],
  "west bengal": ["Rice", "Jute", "Tea", "Potato", "Pulses"],
  "andhra pradesh": ["Rice", "Cotton", "Groundnut", "Turmeric", "Pulses"],
  "gujarat": ["Cotton", "Groundnut", "Wheat", "Mustard", "Pulses"],
};

export function calculateCropRisk(crop: string, climateData: ClimateData): {
  risk: "Low" | "Medium" | "High";
  score: number;
  explanation: string;
} {
  const params = CROP_PARAMS[crop];
  if (!params) {
    return { risk: "Medium", score: 50, explanation: "Analysis pending. Check back later." };
  }

  const avgTemp = climateData.temperature.annualAvg;
  const monthlyRain = climateData.rainfall.annual / 12;

  let tempScore = 100;
  if (avgTemp < params.idealTemp[0]) {
    tempScore = Math.max(0, 100 - (params.idealTemp[0] - avgTemp) * 10);
  } else if (avgTemp > params.idealTemp[1]) {
    tempScore = Math.max(0, 100 - (avgTemp - params.idealTemp[1]) * 10);
  }

  let rainScore = 100;
  if (monthlyRain < params.idealRain[0]) {
    rainScore = Math.max(0, 100 - (params.idealRain[0] - monthlyRain) * 0.8);
  } else if (monthlyRain > params.idealRain[1]) {
    rainScore = Math.max(0, 100 - (monthlyRain - params.idealRain[1]) * 0.5);
  }

  const droughtImpact = (1 - params.droughtTolerance) * climateData.disruptionRisk.droughtRisk * 10;
  const floodImpact = (1 - params.floodTolerance) * climateData.disruptionRisk.floodRisk * 10;

  const combinedScore = (tempScore * 0.35 + rainScore * 0.35) - droughtImpact * 0.15 - floodImpact * 0.15;
  const normalizedScore = Math.max(0, Math.min(100, combinedScore));

  let risk: "Low" | "Medium" | "High";
  if (normalizedScore >= 65) risk = "Low";
  else if (normalizedScore >= 40) risk = "Medium";
  else risk = "High";

  const explanation = generateCropExplanation(crop, params, climateData, tempScore, rainScore, droughtImpact, floodImpact);

  return { risk, score: Math.round(normalizedScore), explanation };
}

function generateCropExplanation(
  crop: string,
  params: { idealTemp: [number, number]; idealRain: [number, number]; droughtTolerance: number; floodTolerance: number },
  climateData: ClimateData,
  tempScore: number,
  rainScore: number,
  droughtImpact: number,
  floodImpact: number
): string {
  const parts: string[] = [];

  if (tempScore >= 80) {
    parts.push(`Temperature conditions are favorable for ${crop} growth.`);
  } else if (tempScore >= 50) {
    parts.push(`Temperatures are slightly outside the ideal range (${params.idealTemp[0]}-${params.idealTemp[1]}°C) for ${crop}.`);
  } else {
    parts.push(`Temperature stress detected - current averages deviate significantly from ${crop}'s optimal range (${params.idealTemp[0]}-${params.idealTemp[1]}°C).`);
  }

  if (rainScore >= 80) {
    parts.push("Rainfall patterns are adequate for this crop.");
  } else if (rainScore >= 50) {
    parts.push(`Rainfall levels may require supplemental irrigation to meet ${crop}'s needs (${params.idealRain[0]}-${params.idealRain[1]}mm monthly).`);
  } else {
    parts.push(`Significant rainfall deficit detected. ${crop} requires ${params.idealRain[0]}-${params.idealRain[1]}mm monthly but current patterns fall short.`);
  }

  if (droughtImpact > 3) {
    parts.push(`Drought risk is elevated. ${crop} has ${params.droughtTolerance > 0.5 ? "moderate" : "low"} drought tolerance.`);
  }
  if (floodImpact > 3) {
    parts.push(`Flood risk is notable. ${crop} has ${params.floodTolerance > 0.5 ? "moderate" : "limited"} flood tolerance.`);
  }

  return parts.join(" ");
}

const REGION_BASE: Record<Region, {
  baseRainfall: number;
  baseTemp: number;
  droughtFactor: number;
  floodFactor: number;
  tempRise: number;
}> = {
  "punjab": { baseRainfall: 650, baseTemp: 25, droughtFactor: 0.45, floodFactor: 0.25, tempRise: 0.8 },
  "haryana": { baseRainfall: 500, baseTemp: 26, droughtFactor: 0.55, floodFactor: 0.20, tempRise: 0.9 },
  "maharashtra": { baseRainfall: 1200, baseTemp: 27, droughtFactor: 0.35, floodFactor: 0.55, tempRise: 0.7 },
  "karnataka": { baseRainfall: 1100, baseTemp: 26, droughtFactor: 0.30, floodFactor: 0.40, tempRise: 0.6 },
  "uttar pradesh": { baseRainfall: 900, baseTemp: 26, droughtFactor: 0.30, floodFactor: 0.70, tempRise: 0.8 },
  "west bengal": { baseRainfall: 1600, baseTemp: 27, droughtFactor: 0.15, floodFactor: 0.80, tempRise: 0.5 },
  "andhra pradesh": { baseRainfall: 950, baseTemp: 29, droughtFactor: 0.50, floodFactor: 0.40, tempRise: 1.0 },
  "gujarat": { baseRainfall: 700, baseTemp: 28, droughtFactor: 0.60, floodFactor: 0.30, tempRise: 1.1 },
};

const MONTHLY_RAINFALL: Record<Region, number[]> = {
  "punjab": [20, 25, 15, 10, 15, 40, 180, 200, 100, 30, 10, 15],
  "haryana": [15, 20, 10, 8, 12, 35, 150, 170, 80, 20, 8, 12],
  "maharashtra": [5, 10, 15, 30, 80, 300, 450, 350, 200, 100, 40, 10],
  "karnataka": [5, 8, 12, 35, 90, 200, 280, 250, 180, 120, 50, 15],
  "uttar pradesh": [15, 20, 15, 10, 20, 60, 250, 280, 180, 50, 10, 10],
  "west bengal": [15, 25, 30, 60, 150, 300, 350, 320, 250, 150, 40, 15],
  "andhra pradesh": [10, 15, 20, 40, 80, 120, 180, 200, 180, 150, 80, 25],
  "gujarat": [5, 8, 5, 3, 15, 80, 200, 180, 120, 50, 15, 8],
};

const MONTHLY_TEMP: Record<Region, number[]> = {
  "punjab": [12, 15, 21, 27, 33, 36, 32, 30, 28, 22, 16, 12],
  "haryana": [14, 17, 23, 29, 35, 38, 33, 31, 29, 24, 18, 14],
  "maharashtra": [24, 26, 29, 31, 32, 29, 26, 25, 25, 26, 25, 23],
  "karnataka": [22, 24, 27, 29, 30, 27, 25, 24, 24, 24, 22, 21],
  "uttar pradesh": [15, 18, 24, 30, 36, 38, 33, 31, 30, 25, 19, 15],
  "west bengal": [20, 23, 28, 31, 32, 31, 29, 29, 29, 27, 23, 19],
  "andhra pradesh": [25, 27, 30, 33, 35, 33, 30, 29, 29, 28, 26, 24],
  "gujarat": [20, 23, 27, 31, 34, 33, 29, 28, 28, 27, 24, 20],
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function jitter(value: number, pct: number = 0.05): number {
  return Math.round(value * (1 + (Math.random() * 2 - 1) * pct) * 10) / 10;
}

function calculateRiskScore(region: Region): number {
  const base = REGION_BASE[region];
  const droughtScore = base.droughtFactor * 4;
  const floodScore = base.floodFactor * 4;
  const tempScore = ((base.tempRise - 0.5) / 1.0) * 2;
  const raw = droughtScore + floodScore + tempScore;
  return Math.max(0, Math.min(10, Math.round(raw * 10) / 10));
}

function getRiskLevel(score: number): "LOW" | "MEDIUM" | "HIGH" {
  if (score <= 3.5) return "LOW";
  if (score <= 6.5) return "MEDIUM";
  return "HIGH";
}

export function getClimateData(region: Region): ClimateData {
  const base = REGION_BASE[region];
  const riskScore = calculateRiskScore(region);

  const monthlyRainfall = MONTHLY_RAINFALL[region].map((mm, i) => ({
    month: MONTHS[i],
    mm: jitter(mm, 0.08),
  }));

  const annualRainfall = Math.round(monthlyRainfall.reduce((sum, m) => sum + m.mm, 0));

  const monthlyTemp = MONTHLY_TEMP[region].map((temp, i) => ({
    month: MONTHS[i],
    celsius: jitter(temp, 0.03),
  }));

  const annualAvgTemp = Math.round(monthlyTemp.reduce((sum, m) => sum + m.celsius, 0) / 12 * 10) / 10;

  const firstQuarter = monthlyRainfall.slice(0, 3).reduce((s, m) => s + m.mm, 0) / 3;
  const lastQuarter = monthlyRainfall.slice(9, 12).reduce((s, m) => s + m.mm, 0) / 3;
  const trend = lastQuarter > firstQuarter * 1.1 ? "increasing" : lastQuarter < firstQuarter * 0.9 ? "decreasing" : "stable";

  const droughtRisk = Math.round(base.droughtFactor * 10 * 10) / 10;
  const floodRisk = Math.round(base.floodFactor * 10 * 10) / 10;

  return {
    region,
    climateRiskScore: riskScore,
    rainfall: {
      monthly: monthlyRainfall,
      annual: annualRainfall,
      trend,
    },
    temperature: {
      monthly: monthlyTemp,
      annualAvg: annualAvgTemp,
      riseIndicator: base.tempRise > 0.7,
    },
    disruptionRisk: {
      score: riskScore,
      level: getRiskLevel(riskScore),
      droughtRisk,
      floodRisk,
    },
  };
}

export function getRecommendations(data: ClimateData): string[] {
  const recs: string[] = [];

  if (data.disruptionRisk.droughtRisk > 5) {
    recs.push("Consider drought-resistant crop varieties and drip irrigation systems");
    recs.push("Monitor soil moisture levels weekly and adjust watering schedules");
  }

  if (data.disruptionRisk.floodRisk > 5) {
    recs.push("Improve field drainage and consider raised bed planting");
    recs.push("Store critical supplies on elevated ground before monsoon season");
  }

  if (data.temperature.riseIndicator) {
    recs.push("Temperature trends indicate rising heat stress on crops");
    recs.push("Consider shade nets or altered planting schedules to mitigate heat");
  }

  if (data.rainfall.trend === "decreasing") {
    recs.push("Rainfall patterns show a decreasing trend - plan water conservation measures");
  }

  if (data.rainfall.trend === "increasing") {
    recs.push("Increasing rainfall detected - ensure adequate drainage infrastructure");
  }

  if (recs.length === 0) {
    recs.push("Climate conditions are relatively stable for your region");
    recs.push("Continue current farming practices with routine monitoring");
  }

  return recs;
}
