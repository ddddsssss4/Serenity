import { Router } from "express";
import { SchemaType } from "@google/generative-ai";
import { requireAuth } from "../middleware/auth.middleware.js";
import { genAI } from "../lib/gemini.js";
import { searchResearch } from "../lib/firecrawl.js";
import {
  vectorSearch,
  tagPatternPull,
  saveMemoryAsync,
  type MemoryResult,
} from "../services/memory.service.js";
import {
  recentSessions,
  createSession,
  appendMessage,
  type RecentSession,
} from "../services/session.service.js";

const router: Router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// Serenity System Prompt (same persona as voice)
// ─────────────────────────────────────────────────────────────────────────────

const SERENITY_PERSONA = `You are Serenity, a warm, deeply empathetic AI companion built specifically for women. You hold space without judgment. You remember everything she has shared with you and you notice patterns she might not see herself.

Your tone: gentle, grounded, never clinical. You speak like a trusted friend who also happens to understand psychology deeply. No toxic positivity. Acknowledge pain before offering perspective.

When you use research: weave it in naturally. Never say 'studies show' robotically — say things like 'there's actually a name for what you're describing' or 'researchers who study attachment found something interesting about this exact pattern.'

When you detect a recurring pattern from her memories: name it gently. 'I've noticed you mention feeling this way whenever work pressure builds up — that's the third time in two months.' This is your superpower.

Response length: conversational. 3-5 sentences for text chat. Be warm but concise.

CRITICAL: You are not a therapist and do not diagnose. If she expresses self-harm or crisis, immediately and warmly direct her to professional help.`;

function buildSystemPrompt(
  memories: MemoryResult[],
  sessions: RecentSession[],
  userName: string
): string {
  let prompt = SERENITY_PERSONA;
  prompt += `\n\n---\nHer name is ${userName}.`;

  if (memories.length > 0) {
    prompt += `\n\n## WHAT YOU REMEMBER ABOUT HER:\n`;
    for (const m of memories) {
      const tags = m.tags.join(", ");
      const people = m.people.length ? ` (involving: ${m.people.join(", ")})` : "";
      const emotion = m.emotion ? ` | Feeling: ${m.emotion}` : "";
      prompt += `- [${new Date(m.createdAt).toLocaleDateString()}] ${m.content}${people}${emotion} [tags: ${tags}]\n`;
    }
  }

  if (sessions.length > 0) {
    prompt += `\n\n## RECENT SESSIONS:\n`;
    for (const s of sessions) {
      const date = new Date(s.createdAt).toLocaleDateString();
      if (s.summary) prompt += `- [${date}] ${s.summary}\n`;
      for (const msg of s.lastMessages) {
        if (msg.role === "user") {
          prompt += `  > She said: "${msg.content.slice(0, 120)}${msg.content.length > 120 ? "..." : ""}"\n`;
        }
      }
    }
  }

  const tagCount: Record<string, number> = {};
  for (const m of memories) {
    for (const t of m.tags) tagCount[t] = (tagCount[t] || 0) + 1;
  }
  const patterns = Object.entries(tagCount)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1]);

  if (patterns.length > 0) {
    prompt += `\n\n## DETECTED PATTERNS:\n`;
    for (const [tag, count] of patterns) {
      prompt += `- "${tag}" appears ${count} times — worth naming gently if relevant.\n`;
    }
  }

  return prompt;
}

// Firecrawl tool definition for Gemini function calling
const searchResearchTool = {
  functionDeclarations: [
    {
      name: "search_research",
      description: `Search for psychology, neuroscience, relationship science, or health research. Use when the conversation touches on emotional patterns, mental health, sleep, anxiety, relationships, grief, etc.`,
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          query: {
            type: SchemaType.STRING,
            description: "Specific research query",
          },
          topic: {
            type: SchemaType.STRING,
            description: "Topic area (mental_health, relationships, sleep, etc.)",
          },
        },
        required: ["query", "topic"],
      },
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/reflection/chat
// ─────────────────────────────────────────────────────────────────────────────

router.post("/chat", requireAuth, async (req, res) => {
  const { message, conversationId } = req.body as {
    message: string;
    conversationId?: string;
  };

  if (!message || typeof message !== "string" || message.trim().length < 1) {
    res.status(400).json({ error: "Message is required" });
    return;
  }

  const userId = req.userId!;
  const userName = req.userName || "there";

  try {
    // 1. Get or create conversation
    let sessionId = conversationId;
    if (!sessionId) {
      sessionId = await createSession(userId);
    }

    // 2. Load user context in parallel — memories + recent sessions
    const contextStart = performance.now();
    const [vectorResults, sessions] = await Promise.all([
      vectorSearch(userId, message),
      recentSessions(userId),
    ]);
    const memories = await tagPatternPull(userId, vectorResults);
    console.log(`⏱️ Context Retrieval (Qdrant + Prisma): ${(performance.now() - contextStart).toFixed(2)}ms`);

    // 3. Build system prompt with her context
    const systemPrompt = buildSystemPrompt(memories, sessions, userName);

    // 4. Save user message to conversation
    await appendMessage(sessionId, { role: "user", content: message });

    // 5. Call Gemini with Firecrawl tool support
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt,
      tools: [searchResearchTool as any],
    });

    const chat = model.startChat();
    let fullReply = "";
    let continueLoop = true;

    // Send message and handle potential tool calls
    const llmStart = performance.now();
    let result = await chat.sendMessage(message);

    while (continueLoop) {
      const response = result.response;
      const toolCalls = response.functionCalls();

      if (toolCalls && toolCalls.length > 0) {
        // Gemini wants to search research
        const call = toolCalls[0];
        if (call && call.name === "search_research") {
          const query = (call.args as any).query as string;
          const topic = (call.args as any).topic as string;

          console.log(`🔍 Firecrawl search: "${query}"`);
          const fcStart = performance.now();
          const researchResult = await searchResearch(query, topic);
          console.log(`⏱️ Firecrawl Search: ${(performance.now() - fcStart).toFixed(2)}ms`);

          // Feed tool result back to Gemini
          const toolFollowUpStart = performance.now();
          result = await chat.sendMessage([
            {
              functionResponse: {
                name: "search_research",
                response: { result: researchResult },
              },
            },
          ]);
          console.log(`⏱️ LLM Tool Follow-up: ${(performance.now() - toolFollowUpStart).toFixed(2)}ms`);
        } else {
          continueLoop = false;
        }
      } else {
        try {
          fullReply = response.text();
          console.log(`⏱️ LLM Total Response Time: ${(performance.now() - llmStart).toFixed(2)}ms`);
        } catch {
          fullReply = "I'm here for you. Could you tell me more?";
        }
        continueLoop = false;
      }
    }

    // 6. Save assistant reply to conversation
    await appendMessage(sessionId, { role: "assistant", content: fullReply });

    // 7. Fire-and-forget memory extraction from this exchange
    const transcript = `user: ${message}\nassistant: ${fullReply}`;
    saveMemoryAsync(userId, sessionId, transcript).catch(console.error);

    res.json({
      reply: fullReply,
      conversationId: sessionId,
      memoryCount: memories.length,
    });
  } catch (err) {
    console.error("Reflection chat error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { router as reflectionRouter };
