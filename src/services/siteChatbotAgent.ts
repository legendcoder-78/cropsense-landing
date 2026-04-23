import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function askSiteChatbot(
  question: string,
  contextData: string,
): Promise<string> {
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

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(prompt);
  text = result.response.text();

  if (!text) {
    throw new Error("Gemini 2.5 chatbot model is currently unavailable.");
  }
  return text.trim();
}
