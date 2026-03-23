import { QdrantClient } from "@qdrant/js-client-rest";
import { env } from "../config/env.js";

export const qdrant = new QdrantClient({
  url: env.QDRANT_URL,
  apiKey: env.QDRANT_API_KEY,
});

export const COLLECTION_NAME = "serenity_memories";
export const VECTOR_SIZE = 1536;

/**
 * Ensures the Qdrant collection exists on app startup.
 * Skips creation if it already exists.
 */
export async function ensureCollection(): Promise<void> {
  try {
    const collections = await qdrant.getCollections();
    const exists = collections.collections.some(
      (c) => c.name === COLLECTION_NAME
    );

    if (!exists) {
      await qdrant.createCollection(COLLECTION_NAME, {
        vectors: {
          size: VECTOR_SIZE,
          distance: "Cosine",
        },
      });
      console.log(`✅ Qdrant collection '${COLLECTION_NAME}' created.`);
    } else {
      console.log(`✅ Qdrant collection '${COLLECTION_NAME}' already exists.`);
    }
  } catch (err) {
    console.error("❌ Failed to ensure Qdrant collection:", err);
    throw err;
  }
}
