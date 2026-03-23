import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config/env.js";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

// text-embedding-004 supports up to 768 dims by default,
// but we configure outputDimensionality to 1536 to match Qdrant collection.
const embeddingModel = genAI.getGenerativeModel({
  model: "text-embedding-004",
});

/**
 * Embeds a text string and returns a 1536-dim vector.
 */
export async function embedText(text: string): Promise<number[]> {
  const result = await embeddingModel.embedContent({
    content: { role: "user", parts: [{ text }] },
    taskType: "SEMANTIC_SIMILARITY",
  });
  return result.embedding.values;
}

export { genAI };
