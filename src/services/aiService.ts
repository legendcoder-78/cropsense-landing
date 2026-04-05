import { GoogleGenerativeAI } from "@google/generative-ai";
import { NewsItem, CropRisk, Recommendation } from "@/data/exploreData";

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY || "";
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export interface AIInsightsResponse {
  news: NewsItem[];
  aiSummary: string;
  cropRisks: Record<string, CropRisk>;
  recommendations: Recommendation[];
}

export async function fetchAIInsightsForState(state: string, cropList: string[]): Promise<AIInsightsResponse> {
  if (!NEWS_API_KEY || !GEMINI_API_KEY) {
    throw new Error("Missing API keys for NewsAPI or Gemini. Please check your .env.local file.");
  }

  // 1. Fetch Location Coordinates from Open-Meteo Geocoding
  const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(state)}&count=1&language=en&format=json`);
  const geoData = await geoRes.json();
  let lat = 20.5937; // Default India lat
  let lon = 78.9629; // Default India lon
  if (geoData.results && geoData.results.length > 0) {
    lat = geoData.results[0].latitude;
    lon = geoData.results[0].longitude;
  }

  // 2. Fetch Weather Data from Open-Meteo
  const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,surface_pressure,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_sum&timezone=auto`);
  const weatherData = await weatherRes.json();

  const currentTemp = weatherData.current?.temperature_2m;
  const currentPrecip = weatherData.current?.precipitation;
  const dailyMaxTemps = weatherData.daily?.temperature_2m_max;
  const dailyPrecip = weatherData.daily?.precipitation_sum;

  // 3. Fetch News from NewsAPI
  const newsRes = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(state + " agriculture crop weather")}&apiKey=${NEWS_API_KEY}&language=en&sortBy=publishedAt&pageSize=5`);
  const newsData = await newsRes.json();

  const newsHeadlines = newsData.articles?.map((a: any) => ({
    title: a.title,
    description: a.description,
    source: a.source?.name,
    date: a.publishedAt
  })) || [];

  // 4. Construct Prompt for Gemini
  const prompt = `
You are an expert agricultural AI. Respond ONLY with valid JSON. Do not include markdown formatting or extra text outside the JSON.

Context for state: ${state}, India

Current Weather:
- Temperature: ${currentTemp}°C
- Precipitation (current): ${currentPrecip}mm
- Next few days max temps: ${dailyMaxTemps?.slice(0, 3).join(", ")}°C
- Next few days precipitation sum: ${dailyPrecip?.slice(0, 3).join(", ")}mm

Recent Agriculture News for ${state}:
${JSON.stringify(newsHeadlines, null, 2)}

Crop List to analyze: ${cropList.join(", ")}

Generate an analysis object with the exact following interface:
{
  "news": [
    {
      "category": "crop_failure" | "weather" | "market" | "policy",
      "title": "string",
      "summary": "string",
      "date": "YYYY-MM-DD",
      "severity": "info" | "warning" | "critical"
    }
  ], // Generate 3 to 4 news items based closely on the provided real news.
  "aiSummary": "A concise 3-4 sentence comprehensive agricultural summary for the state combining weather conditions and news impacts.",
  "cropRisks": {
    "Crop Name": { // Must exactly match the names from the provided crop list
      "crop": "Crop Name",
      "risk": "Low" | "Medium" | "High",
      "explanation": "2-3 sentences explaining the risk based on current weather and news"
    }
  }, // Generate risk assessments for ALL crops in the crop list.
  "recommendations": [
    {
      "icon": "water" | "seed" | "shield" | "calendar" | "sun" | "leaf",
      "title": "string",
      "description": "string",
      "priority": "high" | "medium" | "low"
    }
  ] // Generate 4-6 actionable recommendations for farmers in this state.
}
`;

  // 5. Generate with Gemini
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  let responseText = result.response.text();
  
  // Clean up potential markdown formatting from Gemini
  responseText = responseText.replace(/^```json/m, '').replace(/^```/m, '').trim();

  try {
    const aiParsed = JSON.parse(responseText);
    return aiParsed as AIInsightsResponse;
  } catch (error) {
    console.error("Failed to parse Gemini response as JSON", responseText);
    throw new Error("Failed to generate correct AI response format. Please try again.");
  }
}
