import FirecrawlApp from "@mendable/firecrawl-js";
import { env } from "../config/env.js";

export const firecrawl = new FirecrawlApp({
  apiKey: env.FIRECRAWL_API_KEY,
});

const MAX_TOKENS = 800;

/**
 * Search Firecrawl for psychology/health research and return
 * a concise summary of top 3 results, capped at ~800 tokens.
 */
export async function searchResearch(
  query: string,
  _topic: string
): Promise<string> {
  try {
    const results = await firecrawl.search(query, {
      limit: 3,
      scrapeOptions: { formats: ["markdown"] },
    });

    if (!results.success || !results.data?.length) {
      return "No relevant research found for this query.";
    }

    const summaries = results.data
      .map((r: { title?: string; url?: string; markdown?: string; description?: string }) => {
        const title = r.title || "Research Article";
        const url = r.url || "";
        const content = r.markdown || r.description || "";
        return `**${title}** (${url})\n${content}`;
      })
      .join("\n\n---\n\n");

    // Rough token limit: 1 token ≈ 4 chars → 800 tokens ≈ 3200 chars
    return summaries.slice(0, MAX_TOKENS * 4);
  } catch (err) {
    console.error("Firecrawl search error:", err);
    return "Research search temporarily unavailable.";
  }
}
