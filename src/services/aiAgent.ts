import { GoogleGenerativeAI } from "@google/generative-ai";

// API Keys
const NEWS_API_KEY = "e802b7548e6343a581c85acef1ae3d8b";
const GEMINI_API_KEY = "AIzaSyCsC64OY8soK0FdoHZ4NSwgiFEVNatafZU";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export interface DistrictWeather {
  currentTemp: number;
  minTemp: number;
  maxTemp: number;
  windSpeed: number;
  uvIndex: number;
}

export interface AILiveOverview {
  districtWeather: DistrictWeather;
  climateOverview: string;
  trendingHeadlines: Array<{
    title: string;
    url: string;
    source: string;
  }>;
}

export async function generateLiveAIAgentOverview(state: string, district: string): Promise<AILiveOverview> {
  try {
    // 1. RAG Retrieve: Fetch Location Coordinates
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(state)}&count=1&language=en&format=json`);
    const geoData = await geoRes.json();
    let stateLat = 20.5937; // Default India
    let stateLon = 78.9629; // Default India
    if (geoData.results && geoData.results.length > 0) {
      stateLat = geoData.results[0].latitude;
      stateLon = geoData.results[0].longitude;
    }
    // 2. RAG Retrieve: Fetch Real Weather for State (For AI Prompt)
    const stateWeatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${stateLat}&longitude=${stateLon}&current=temperature_2m,relative_humidity_2m,precipitation&daily=temperature_2m_max,precipitation_sum&timezone=auto`);
    const stateWeatherData = await stateWeatherRes.json();
    
    const currentTemp = stateWeatherData.current?.temperature_2m;
    const currentPrecip = stateWeatherData.current?.precipitation;
    const humidity = stateWeatherData.current?.relative_humidity_2m;

    // 2b. District Data: Fetch Location Coordinates
    const distGeoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(district)}&count=1&language=en&format=json`);
    const distGeoData = await distGeoRes.json();
    let distLat = stateLat; 
    let distLon = stateLon; 
    if (distGeoData.results && distGeoData.results.length > 0) {
      distLat = distGeoData.results[0].latitude;
      distLon = distGeoData.results[0].longitude;
    }

    // 2c. District Data: Fetch Real Dashboard Weather
    const distWeatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${distLat}&longitude=${distLon}&current=temperature_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto`);
    const distWeatherData = await distWeatherRes.json();

    const districtWeather: DistrictWeather = {
      currentTemp: distWeatherData.current?.temperature_2m || 0,
      windSpeed: distWeatherData.current?.wind_speed_10m || 0,
      maxTemp: distWeatherData.daily?.temperature_2m_max?.[0] || 0,
      minTemp: distWeatherData.daily?.temperature_2m_min?.[0] || 0,
      uvIndex: distWeatherData.daily?.uv_index_max?.[0] || 0,
    };

    // 3. RAG Retrieve: Fetch Live News (Scrape via NewsAPI)
    const newsRes = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(state + " agriculture crop climate")}&apiKey=${NEWS_API_KEY}&language=en&sortBy=relevancy&pageSize=10`);
    const newsData = await newsRes.json();
    
    const articles = newsData.articles?.map((a: any) => ({
      title: a.title,
      description: a.description,
      source: a.source?.name,
      url: a.url
    })) || [];

    // 4. RAG Augment: Construct the System Prompt
    const prompt = `
You are an expert AI Agricultural Agent. Your job is to analyze real-time scattered data and synthesize it into a clean JSON response.

Here is the real-time context for ${state}, India:

1. CURRENT WEATHER:
- Temperature: ${currentTemp}°C
- Humidity: ${humidity}%
- Current Precipitation: ${currentPrecip}mm

2. RECENT NEWS / HEADLINES:
${JSON.stringify(articles, null, 2)}

Provide your response ONLY in valid JSON format matching this exact interface:
{
  "climateOverview": "A comprehensive 3-5 sentence paragraph analyzing the current climate/weather conditions and summarizing how the recent news events (like harvests, rain, policies, or droughts) are impacting agriculture in the state.",
  "trendingHeadlines": [
    {
      "title": "Clean, concise headline based on the news data",
      "url": "Provide the URL from the news data",
      "source": "Source name"
    }
  ] // Provide up to 4 of the most relevant news headlines from the data provided. If there are no relevant news, generate a generic advisory headline.
}
Do not use markdown blocks around the JSON.
`;

    // 5. RAG Generate: Ask Gemini (with fallback)
    const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest"];
    let text = "";
    
    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        text = result.response.text();
        break; // Success
      } catch (err: any) {
        if (err?.message?.includes("404") || err?.status === 404) {
          console.warn(`Model ${modelName} failed with 404, trying next...`);
          continue;
        }
        throw err; // Re-throw other errors
      }
    }
    
    if (!text) {
      throw new Error("All configured Gemini models failed to respond.");
    }
    
    text = text.replace(/^```json/m, '').replace(/^```/m, '').trim();
    const rawParsed = JSON.parse(text);
    
    return {
      districtWeather,
      climateOverview: rawParsed.climateOverview,
      trendingHeadlines: rawParsed.trendingHeadlines
    } as AILiveOverview;
  } catch (error) {
    console.error("AI Agent RAG Pipeline Error:", error);
    throw new Error("Failed to generate live AI insights.");
  }
}
