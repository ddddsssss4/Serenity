import { v4 as uuidv4 } from "uuid";
import { prisma } from "../lib/prisma.js";
import { qdrant, COLLECTION_NAME } from "../lib/qdrant.js";
import { embedText, genAI } from "../lib/gemini.js";
// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface MemoryResult {
  id: string;
  content: string;
  tags: string[];
  emotion?: string | null;
  people: string[];
  importance: number;
  createdAt: Date;
  score?: number;
}

interface ExtractedMemory {
  summary: string;
  tags: string[];
  emotion: string;
  people: string[];
  importance: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Vector Search
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Embed the user's last message and query Qdrant for top 10 semantically
 * similar memories scoped to this userId.
 */
export async function vectorSearch(
  userId: string,
  text: string
): Promise<MemoryResult[]> {
  const embedding = await embedText(text);

  const results = await qdrant.search(COLLECTION_NAME, {
    vector: embedding,
    limit: 10,
    filter: {
      must: [{ key: "userId", match: { value: userId } }],
    },
    with_payload: true,
  });

  return results
    .filter((r) => r.payload)
    .map((r) => ({
      id: r.payload!.memoryId as string,
      content: r.payload!.content as string,
      tags: r.payload!.tags as string[],
      emotion: r.payload!.emotion as string | null,
      people: r.payload!.people as string[],
      importance: r.payload!.importance as number,
      createdAt: new Date(r.payload!.createdAt as string),
      score: r.score,
    }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Tag Pattern Pull
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get recent memory tags from last 10 memories, then pull memories with
 * matching tags from Qdrant. Deduplicates against existing memories
 * and returns combined top 8.
 */
export async function tagPatternPull(
  userId: string,
  existingMemories: MemoryResult[]
): Promise<MemoryResult[]> {
  // Get last 10 memories from Prisma to extract common tags
  const recent = await prisma.memory.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: { tags: true },
  });

  if (!recent.length) return existingMemories;

  // Find the most common tags
  const tagCount: Record<string, number> = {};
  for (const m of recent) {
    for (const tag of m.tags) {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    }
  }

  const topTags = Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tag]) => tag);

  if (!topTags.length) return existingMemories.slice(0, 8);

  // Query Qdrant filtered by top tags AND userId
  const taggedResults = await qdrant.scroll(COLLECTION_NAME, {
    filter: {
      must: [
        { key: "userId", match: { value: userId } },
        {
          should: topTags.map((tag) => ({
            key: "tags",
            match: { value: tag },
          })),
        },
      ],
    },
    limit: 20,
    with_payload: true,
  });

  const taggedMemories: MemoryResult[] = (taggedResults.points || [])
    .filter((r) => r.payload)
    .map((r) => ({
      id: r.payload!.memoryId as string,
      content: r.payload!.content as string,
      tags: r.payload!.tags as string[],
      emotion: r.payload!.emotion as string | null,
      people: r.payload!.people as string[],
      importance: r.payload!.importance as number,
      createdAt: new Date(r.payload!.createdAt as string),
    }));

  // Deduplicate: merge existingMemories + taggedMemories by id
  const seen = new Set(existingMemories.map((m) => m.id));
  for (const m of taggedMemories) {
    if (!seen.has(m.id)) {
      existingMemories.push(m);
      seen.add(m.id);
    }
  }

  // Sort by importance desc, return top 8
  return existingMemories
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 8);
}

// ─────────────────────────────────────────────────────────────────────────────
// Save Memory Async (fire-and-forget)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extracts a memory from the conversation transcript using Claude,
 * saves to Prisma, and upserts into Qdrant.
 * Designed to be called with .catch(console.error) — never awaited.
 */
export async function saveMemoryAsync(
  userId: string,
  sessionId: string,
  transcript: string
): Promise<void> {
  // Step 1: Extract structured memory from Gemini (cheap model)
  const extractionStart = performance.now();
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
  
  const extractionResponse = await model.generateContent(`Extract from this conversation:
1. A concise memory summary (1-2 sentences of what she shared)
2. Tags (array, pick from: relationship, anxiety, sleep, work, family, health, grief, friendship, self-esteem, goals)
3. Emotion (single word)
4. People mentioned (first names or roles only)
5. Importance score 1-10 (10 = major life event, 1 = passing comment)
Return as JSON only, no other text.

Conversation:
${transcript}`);

  const rawText = extractionResponse.response.text();
  console.log(`⏱️ Memory Extraction (LLM): ${(performance.now() - extractionStart).toFixed(2)}ms`);

  let extracted: ExtractedMemory;
  try {
    // Strip any markdown code fences if present
    const cleaned = rawText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    extracted = JSON.parse(cleaned);
    console.log(`✅ LLM Extraction Success: "${extracted.summary.slice(0, 50)}..." [emotion: ${extracted.emotion}, importance: ${extracted.importance}]`);
  } catch {
    console.error("Failed to parse memory extraction JSON:", rawText);
    return;
  }

  // Step 2: Save to Prisma
  const memoryId = uuidv4();
  const qdrantId = uuidv4();

  await prisma.memory.create({
    data: {
      id: memoryId,
      userId,
      content: extracted.summary,
      qdrantId,
      tags: extracted.tags || [],
      emotion: extracted.emotion || null,
      people: extracted.people || [],
      importance: Math.min(10, Math.max(1, extracted.importance || 5)),
    },
  });

  // Step 3: Embed the summary
  const embeddingStart = performance.now();
  const embedding = await embedText(extracted.summary);
  console.log(`⏱️ Embedding (LLM): ${(performance.now() - embeddingStart).toFixed(2)}ms`);
  console.log(`✅ Embedding Success: Vector generated [dims: ${embedding.length}]`);

  // Step 4: Upsert into Qdrant
  const qdrantStart = performance.now();
  await qdrant.upsert(COLLECTION_NAME, {
    wait: true,
    points: [
      {
        id: qdrantId,
        vector: embedding,
        payload: {
          userId,
          memoryId,
          content: extracted.summary,
          tags: extracted.tags || [],
          emotion: extracted.emotion || null,
          people: extracted.people || [],
          importance: extracted.importance || 5,
          createdAt: new Date().toISOString(),
        },
      },
    ],
  });
  console.log(`⏱️ Qdrant Upsert: ${(performance.now() - qdrantStart).toFixed(2)}ms`);
  console.log(`✅ Qdrant Upsert Success: Point ${qdrantId} stored in collection "${COLLECTION_NAME}"`);

  // Step 5: Append message to conversation
  const conversation = await prisma.conversation.findUnique({
    where: { id: sessionId },
    select: { messages: true },
  });

  if (conversation) {
    const messages = (conversation.messages as object[]) || [];
    messages.push({
      role: "assistant_summary",
      content: extracted.summary,
      timestamp: new Date().toISOString(),
    });

    await prisma.conversation.update({
      where: { id: sessionId },
      data: { messages },
    });
  }

  console.log(`💾 Memory saved for user ${userId}: "${extracted.summary.slice(0, 60)}..."`);
}
