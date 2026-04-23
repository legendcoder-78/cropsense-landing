import { GoogleGenerativeAI } from "@google/generative-ai";

export interface SupplyChainChatContext {
  selectedState: string;
  selectedDistrict?: string;
  dataMode: "live" | "manual";
  tempScore: number;
  rainScore: number;
  cropScore: number;
  riskScore: string;
  status: string;
  suggestedAction: string;
  modelCoverage: "FULL" | "LIMITED";
  districtAdjustment: number;
  contributions: {
    temperature: number;
    rainfall: number;
    crop: number;
  };
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

function buildPrompt(
  question: string,
  context: SupplyChainChatContext,
): string {
  const districtLabel = context.selectedDistrict
    ? `District: ${context.selectedDistrict}`
    : "District: Not selected";

  return `You are CropSense Supply Chain Data Assistant.
Answer ONLY using the provided simulator context.
If the user asks about data not present in context, clearly say that the data is unavailable in current simulation and suggest what to provide next.
Keep responses concise and actionable in 4-7 bullet points.

Current simulator context:
- State: ${context.selectedState}
- ${districtLabel}
- Input mode: ${context.dataMode}
- Temperature stress score (0-10): ${context.tempScore.toFixed(1)}
- Rainfall anomaly score (0-10): ${context.rainScore.toFixed(1)}
- Crop yield deficit score (0-10): ${context.cropScore.toFixed(1)}
- Lead-time disruption score: ${context.riskScore}
- Risk status: ${context.status}
- Suggested action: ${context.suggestedAction}
- Model coverage: ${context.modelCoverage}
- District modifier: ${context.districtAdjustment.toFixed(1)}
- Contribution breakdown: Temperature ${context.contributions.temperature}%, Rainfall ${context.contributions.rainfall}%, Crop ${context.contributions.crop}%

User question:
${question}`;
}

export async function askSupplyChainDataQuestion(
  question: string,
  context: SupplyChainChatContext,
): Promise<string> {
  const trimmedQuestion = question.trim();

  if (!trimmedQuestion) {
    throw new Error("Please enter a question.");
  }

  if (!GEMINI_API_KEY) {
    throw new Error(
      "Chatbot is unavailable because VITE_GEMINI_API_KEY is not configured.",
    );
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const prompt = buildPrompt(trimmedQuestion, context);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(prompt);
  const responseText = result.response.text().trim();

  if (!responseText) {
    throw new Error("Gemini 2.5 chatbot model is currently unavailable.");
  }

  return responseText;
}
