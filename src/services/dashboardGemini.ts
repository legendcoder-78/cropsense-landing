import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = "AIzaSyCsC64OY8soK0FdoHZ4NSwgiFEVNatafZU";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function callGemini(prompt: string): Promise<string> {
  const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest"];
  let text = "";

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      text = result.response.text();
      break;
    } catch (err: any) {
      if (err?.message?.includes("404") || err?.status === 404) {
        console.warn(`Model ${modelName} failed with 404, trying next...`);
        continue;
      }
      throw err;
    }
  }

  if (!text) throw new Error("All configured Gemini models failed to respond.");
  return text.replace(/^```json/m, "").replace(/^```/m, "").trim();
}

export interface ForecastDay {
  date: string;
  dayName: string;
  tempMax: number;
  tempMin: number;
  precipitation: number;
  uvIndex: number;
  windSpeed: number;
}

export async function generateWeatherForecast(region: string): Promise<ForecastDay[]> {
  const prompt = `
You are a weather forecasting AI for Indian agriculture. Generate a realistic 7-day weather forecast for ${region}, India.

Base your forecast on typical seasonal patterns for this region. Return ONLY valid JSON matching this exact structure:
{
  "forecast": [
    {
      "date": "YYYY-MM-DD",
      "dayName": "Mon",
      "tempMax": 35,
      "tempMin": 22,
      "precipitation": 2.5,
      "uvIndex": 7.5,
      "windSpeed": 12
    }
  ]
}

Provide exactly 7 days starting from today. Use realistic values for ${region}:
- Punjab/Haryana: Hot summers (35-40°C), moderate rainfall in monsoon
- Maharashtra: Tropical, high monsoon rainfall (25-35°C)
- Karnataka: Moderate climate (22-32°C), balanced rainfall
- Uttar Pradesh: Extreme summers (38-42°C), monsoon rains
- West Bengal: Hot humid (30-36°C), very high rainfall
- Andhra Pradesh: Hot (32-38°C), moderate rainfall
- Gujarat: Hot dry (35-40°C), low-moderate rainfall

Do not use markdown blocks around the JSON.
`;

  const text = await callGemini(prompt);
  const parsed = JSON.parse(text);
  return parsed.forecast;
}

export interface SoilVegetationData {
  soilMoisture: number;
  vegetationIndex: number;
  landSurfaceTemp: number;
  cloudCover: number;
}

export async function generateSoilVegetationData(region: string): Promise<SoilVegetationData> {
  const prompt = `
You are an agricultural satellite data AI. Generate realistic soil and vegetation health data for ${region}, India.

Return ONLY valid JSON matching this exact structure:
{
  "soilMoisture": 28.5,
  "vegetationIndex": 0.55,
  "landSurfaceTemp": 32.0,
  "cloudCover": 35
}

Use realistic values for ${region}:
- soilMoisture: 15-45% (percentage)
- vegetationIndex (NDVI): 0.2-0.8 (0-1 scale)
- landSurfaceTemp: 25-42°C
- cloudCover: 10-80% (percentage)

Regional patterns:
- Punjab/Haryana: Moderate soil moisture (25-35%), moderate NDVI (0.45-0.60)
- Maharashtra: Higher soil moisture (30-40%), good NDVI (0.55-0.70)
- Karnataka: Moderate moisture (28-38%), good NDVI (0.50-0.65)
- Uttar Pradesh: Variable moisture (20-35%), moderate NDVI (0.40-0.55)
- West Bengal: High moisture (35-45%), high NDVI (0.60-0.75)
- Andhra Pradesh: Moderate moisture (25-35%), moderate NDVI (0.45-0.60)
- Gujarat: Low moisture (15-25%), lower NDVI (0.30-0.45)

Do not use markdown blocks around the JSON.
`;

  const text = await callGemini(prompt);
  return JSON.parse(text);
}

export interface MonthlyComparison {
  month: string;
  thisYear: number;
  lastYear: number;
  diff: number;
  diffPercent: number;
}

export interface ComparisonResult {
  rainfall: MonthlyComparison[];
  temperature: MonthlyComparison[];
  annualRainfallDiff: number;
  annualTempDiff: number;
}

export async function generateHistoricalComparison(region: string): Promise<ComparisonResult> {
  const prompt = `
You are a climate data AI. Generate realistic year-over-year monthly climate comparison data for ${region}, India for ${new Date().getFullYear()} vs ${new Date().getFullYear() - 1}.

Return ONLY valid JSON matching this exact structure:
{
  "rainfallThisYear": [12, 18, 22, 28, 55, 140, 230, 210, 165, 85, 35, 12],
  "rainfallLastYear": [15, 20, 25, 30, 60, 150, 250, 230, 180, 100, 40, 15],
  "tempThisYear": [14, 17, 23, 29, 34, 36, 31, 29, 30, 26, 20, 15],
  "tempLastYear": [13, 16, 22, 28, 33, 35, 30, 28, 29, 25, 19, 14]
}

Each array has 12 values (Jan-Dec). Use realistic climatological data for ${region}:
- Punjab: Rainfall 650mm annual, Temps 12-36°C
- Haryana: Rainfall 500mm annual, Temps 14-38°C
- Maharashtra: Rainfall 1200mm annual, Temps 23-32°C
- Karnataka: Rainfall 1100mm annual, Temps 21-30°C
- Uttar Pradesh: Rainfall 900mm annual, Temps 15-38°C
- West Bengal: Rainfall 1600mm annual, Temps 19-32°C
- Andhra Pradesh: Rainfall 950mm annual, Temps 24-36°C
- Gujarat: Rainfall 700mm annual, Temps 20-37°C

Make this year's values slightly different from last year (±5-15%) to show realistic variation.
Do not use markdown blocks around the JSON.
`;

  const text = await callGemini(prompt);
  const raw = JSON.parse(text);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const rainfall = months.map((month, i) => ({
    month,
    thisYear: raw.rainfallThisYear[i],
    lastYear: raw.rainfallLastYear[i],
    diff: parseFloat((raw.rainfallThisYear[i] - raw.rainfallLastYear[i]).toFixed(2)),
    diffPercent: parseFloat(((raw.rainfallThisYear[i] - raw.rainfallLastYear[i]) / Math.max(1, raw.rainfallLastYear[i]) * 100).toFixed(1)),
  }));

  const temperature = months.map((month, i) => ({
    month,
    thisYear: raw.tempThisYear[i],
    lastYear: raw.tempLastYear[i],
    diff: parseFloat((raw.tempThisYear[i] - raw.tempLastYear[i]).toFixed(2)),
    diffPercent: parseFloat(((raw.tempThisYear[i] - raw.tempLastYear[i]) / Math.max(1, raw.tempLastYear[i]) * 100).toFixed(1)),
  }));

  return {
    rainfall,
    temperature,
    annualRainfallDiff: rainfall.reduce((s, m) => s + m.diff, 0),
    annualTempDiff: temperature.reduce((s, m) => s + m.diff, 0),
  };
}

export async function generateRecommendations(region: string, climateData: {
  droughtRisk: number;
  floodRisk: number;
  temperatureRising: boolean;
  rainfallTrend: string;
  crops?: string[];
}): Promise<string[]> {
  const cropsContext = climateData.crops ? ` The user grows: ${climateData.crops.join(", ")}.` : "";

  const prompt = `
You are an agricultural advisory AI. Generate 4-6 specific, actionable recommendations for a farmer in ${region}, India.${cropsContext}

Current climate risk profile:
- Drought Risk: ${climateData.droughtRisk}/10
- Flood Risk: ${climateData.floodRisk}/10
- Temperature Trend: ${climateData.temperatureRising ? "Rising" : "Stable"}
- Rainfall Trend: ${climateData.rainfallTrend}

Return ONLY valid JSON matching this exact structure:
{
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2",
    "Recommendation 3",
    "Recommendation 4"
  ]
}

Make recommendations:
- Specific to the region's climate patterns
- Actionable and practical for farmers
- Relevant to the risk levels provided
- Include crop-specific advice if crops are mentioned
- Cover irrigation, pest management, crop selection, and timing

Do not use markdown blocks around the JSON.
`;

  const text = await callGemini(prompt);
  const parsed = JSON.parse(text);
  return parsed.recommendations;
}

export interface CropRiskResult {
  risk: "Low" | "Medium" | "High";
  score: number;
  explanation: string;
}

export async function generateCropRiskAssessment(crop: string, region: string, climateContext: {
  avgTemp: number;
  annualRainfall: number;
  droughtRisk: number;
  floodRisk: number;
}): Promise<CropRiskResult> {
  const prompt = `
You are an agricultural risk assessment AI. Analyze the risk for growing ${crop} in ${region}, India.

Current climate conditions:
- Average Temperature: ${climateContext.avgTemp}°C
- Annual Rainfall: ${climateContext.annualRainfall}mm
- Drought Risk: ${climateContext.droughtRisk}/10
- Flood Risk: ${climateContext.floodRisk}/10

Return ONLY valid JSON matching this exact structure:
{
  "risk": "Low",
  "score": 72,
  "explanation": "Detailed explanation of the risk assessment..."
}

Risk levels:
- Low (score 65-100): Favorable conditions
- Medium (score 40-64): Some concerns, manageable
- High (score 0-39): Significant risks present

The explanation should be 2-3 sentences covering temperature suitability, rainfall adequacy, and specific risks.
Do not use markdown blocks around the JSON.
`;

  const text = await callGemini(prompt);
  return JSON.parse(text);
}
