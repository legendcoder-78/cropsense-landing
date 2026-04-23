import { GoogleGenerativeAI } from "@google/generative-ai";
import newsSites from "@/data/news_sites.json";
import providerSites from "@/data/provider_sites.json";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export interface SupplyChainInsight {
  status: "Stable" | "Disrupted";
  explanation: string;
  providers?: Array<{ name: string; url: string; reason: string }>;
}

/**
 * Primary AI function to analyze supply chain status for a given crop in a state
 */
export async function analyzeSupplyChain(state: string, crop: string): Promise<SupplyChainInsight> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const newsSources = newsSites.news_sites.join(", ");

  const prompt = `
You are an expert Agricultural Supply Chain AI Analyst.
Your task is to analyze potential supply chain disruptions for the crop "${crop}" in the state of "${state}", India.

To perform this analysis, synthesize your knowledge regarding the latest news from the following primary sources: ${newsSources}.
Think step-by-step about recent weather patterns (floods, droughts), logistical issues (transport strikes), or market trends affecting this crop.

Please return your analysis EXCLUSIVELY as a JSON object, with no markdown, following this exact signature:
{
  "status": "Stable" | "Disrupted",
  "explanation": "A concise 2-3 sentence explanation of WHY the supply chain is stable or disrupted based on synthesis of recent news and facts."
}
  `;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/^```json/im, "").replace(/^```/im, "").trim();

    const analysis = JSON.parse(text) as SupplyChainInsight;

    // If deemed Disrupted, we trigger the secondary RAG process
    if (analysis.status === "Disrupted") {
      analysis.providers = await findAlternativeProviders(state, crop, analysis.explanation);
    }

    return analysis;
  } catch (error) {
    console.error("Error in analyzeSupplyChain:", error);
    // Fallback logic if API fails
    return {
      status: "Disrupted",
      explanation: "Unable to retrieve real-time data. Assuming disruption due to unknown variables. Proceed with caution.",
      providers: providerSites.provider_sites.map(p => ({
        name: p.name,
        url: p.url,
        reason: "Fallback generic provider"
      }))
    };
  }
}

/**
 * Secondary AI function to analyze alternative providers if disruption is found
 */
export async function findAlternativeProviders(state: string, crop: string, context: string): Promise<Array<{ name: string; url: string; reason: string }>> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const providersConfig = JSON.stringify(providerSites.provider_sites, null, 2);

  const prompt = `
You are an Agricultural Supply Chain Sourcing AI.
The supply chain for ${crop} in ${state} is currently experiencing disruptions. 
Context: ${context}

You have access to the following trusted alternative B2B providers:
${providersConfig}

Select the 3 most appropriate providers from this list for sourcing ${crop} despite the local disruptions in ${state}.

Please return your response EXCLUSIVELY as a JSON array, with no markdown, following this signature:
[
  {
    "name": "Provider Name",
    "url": "Provider URL",
    "reason": "1 sentence explaining why this provider is a good alternative given the disruption."
  }
]
  `;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/^```json/im, "").replace(/^```/im, "").trim();

    const providersResponse = JSON.parse(text) as Array<{ name: string; url: string; reason: string }>;
    return providersResponse;
  } catch (error) {
    console.error("Error in findAlternativeProviders:", error);
    return providerSites.provider_sites.slice(0, 3).map(p => ({
      name: p.name,
      url: p.url,
      reason: "Standard reliable fallback provider."
    }));
  }
}
/**
 * Chat with the supply chain agent, grounding the response in the provided report context.
 */
export async function chatWithSupplyChainAgent(
  query: string,
  reportContext: SupplyChainInsight | null,
  state: string,
  crop: string,
  history: Array<{ role: "user" | "model"; parts: { text: string }[] }>
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const contextStr = reportContext
    ? `
Context for the current report:
- Status: ${reportContext.status}
- Explanation: ${reportContext.explanation}
- Suggested Providers: ${JSON.stringify(reportContext.providers || [], null, 2)}
`
    : "No supply chain report has been generated yet.";

  const systemPrompt = `
You are an expert Agricultural Supply Chain Assistant. 
You are helping the user with their queries about supply chain disruptions for ${crop} in ${state}.

${contextStr}

Use the provided context to answer the user's question accurately. 
If the user's question is unrelated to agricultural supply chains, politely redirect them.
Keep your answers professional, concise, and helpful.
`;

  try {
    const chat = model.startChat({
      history: history,
    });

    // We prepend the system prompt as a user message or similar if needed, 
    // but Gemini usually takes system instructions. For this library version, 
    // we can just include it in the message if needed or use a different model config.
    // However, including the context in every turn is often safer for these small flash models.
    const result = await chat.sendMessage(`Instructions: ${systemPrompt}\n\nUser Question: ${query}`);
    return result.response.text();
  } catch (error) {
    console.error("Error in chatWithSupplyChainAgent:", error);
    return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again in a moment.";
  }
}
