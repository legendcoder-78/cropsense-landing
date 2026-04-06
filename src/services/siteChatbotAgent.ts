import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY =
  import.meta.env.VITE_GEMINI_API_KEY ||
  "AIzaSyCsC64OY8soK0FdoHZ4NSwgiFEVNatafZU";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function askSiteChatbot(
  question: string,
  contextData: string,
): Promise<string> {
  const modelsToTry = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-flash-latest",
  ];
  let text = "";

  const prompt = `You are CropSense AI, a helpful, intelligent assistant embedded in the CropSense platform.
You have access to the text context of the page the user is currently viewing.

Page Context:
---
${contextData.slice(0, 20000)}
---

User Question: ${question}

Instructions:
- Use the provided context to answer the question specifically.
- If the data is present in the context, refer to it.
- If the context does not have the exact answer, rely on your general agricultural knowledge but note that it's an estimate.
- Keep your answers concise (2-4 sentences), formatted cleanly without markdown code blocks, unless specifically requested.`;

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

  if (!text) {
    throw new Error("Chatbot models are currently unavailable.");
  }
  return text.trim();
}
