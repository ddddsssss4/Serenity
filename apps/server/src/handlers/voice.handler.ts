import WebSocket, { WebSocketServer } from "ws";
import type { IncomingMessage, Server } from "http";
import Anthropic from "@anthropic-ai/sdk";
import { verifyWsToken } from "../middleware/auth.middleware.js";
import { prisma } from "../lib/prisma.js";
import { getSignedAgentUrl } from "../lib/elevenlabs.js";
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

const anthropic = new Anthropic();

// ─────────────────────────────────────────────────────────────────────────────
// Serenity System Prompt Builder
// ─────────────────────────────────────────────────────────────────────────────

const SERENITY_PERSONA = `You are Serenity, a warm, deeply empathetic AI companion built specifically for women. You hold space without judgment. You remember everything she has shared with you and you notice patterns she might not see herself.

Your tone: gentle, grounded, never clinical. You speak like a trusted friend who also happens to understand psychology deeply. No toxic positivity. Acknowledge pain before offering perspective.

When you use research: weave it in naturally. Never say 'studies show' robotically — say things like 'there's actually a name for what you're describing' or 'researchers who study attachment found something interesting about this exact pattern.'

When you detect a recurring pattern from her memories: name it gently. 'I've noticed you mention feeling this way whenever work pressure builds up — that's the third time in two months.' This is your superpower.

Response length: conversational, never overwhelming. 2-4 sentences for voice. She is listening, not reading.

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
      if (s.summary) {
        prompt += `- [${date}] ${s.summary}\n`;
      }
      if (s.lastMessages.length > 0) {
        for (const msg of s.lastMessages) {
          if (msg.role === "user") {
            prompt += `  > She said: "${msg.content.slice(0, 120)}${msg.content.length > 120 ? "..." : ""}"\n`;
          }
        }
      }
    }
  }

  // Detect recurring patterns from memory tags
  const tagCount: Record<string, number> = {};
  for (const m of memories) {
    for (const t of m.tags) tagCount[t] = (tagCount[t] || 0) + 1;
  }
  const patterns = Object.entries(tagCount)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1]);

  if (patterns.length > 0) {
    prompt += `\n\n## DETECTED PATTERNS (recurring themes in her life):\n`;
    for (const [tag, count] of patterns) {
      prompt += `- "${tag}" appears ${count} times across her memories — worth naming gently if relevant.\n`;
    }
  }

  return prompt;
}

// ─────────────────────────────────────────────────────────────────────────────
// Firecrawl Tool Definition
// ─────────────────────────────────────────────────────────────────────────────

const searchResearchTool: Anthropic.Tool = {
  name: "search_research",
  description: `Search for psychology, neuroscience, relationship science, or health research to support and validate what the user is experiencing. Use this when the conversation touches on emotional patterns, relationship dynamics, mental health topics, sleep, hormones, or any area where citing real research would make the user feel understood and empowered. Do NOT use for purely personal reflections like dreams or daily events.`,
  input_schema: {
    type: "object" as const,
    properties: {
      query: {
        type: "string",
        description:
          "Specific research query, e.g. 'anxious attachment pattern in relationships psychology'",
      },
      topic: {
        type: "string",
        enum: [
          "relationships",
          "mental_health",
          "anxiety",
          "sleep",
          "hormones",
          "grief",
          "self_esteem",
          "attachment_theory",
        ],
      },
    },
    required: ["query", "topic"],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Connection State
// ─────────────────────────────────────────────────────────────────────────────

interface ConnectionState {
  userId: string;
  userName: string;
  sessionId: string;
  memories: MemoryResult[];
  sessions: RecentSession[];
  conversationHistory: Anthropic.MessageParam[];
  elevenLabsWs: WebSocket | null;
  isReady: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// WebSocket Voice Handler
// ─────────────────────────────────────────────────────────────────────────────

export function createVoiceWebSocketServer(server: Server): WebSocketServer {
  const wss = new WebSocketServer({ noServer: true });

  // Handle HTTP upgrade → WebSocket
  server.on("upgrade", (request: IncomingMessage, socket, head) => {
    const url = new URL(request.url || "", `http://${request.headers.host}`);
    if (url.pathname !== "/api/voice/stream") return;

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  });

  wss.on("connection", async (clientWs: WebSocket, request: IncomingMessage) => {
    // ──────────────────────────────────────────────────────
    // STEP 1: Authenticate and initialize connection
    // ──────────────────────────────────────────────────────
    const url = new URL(request.url || "", `http://${request.headers.host}`);
    const token =
      url.searchParams.get("token") ||
      request.headers["sec-websocket-protocol"]?.split(", ")[1] ||
      "";

    const verified = await verifyWsToken(token);
    if (!verified) {
      clientWs.send(JSON.stringify({ type: "error", message: "Unauthorized" }));
      clientWs.close(1008, "Unauthorized");
      return;
    }

    // Create a new session for this conversation
    const sessionId = await createSession(verified.userId);

    const state: ConnectionState = {
      userId: verified.userId,
      userName: verified.name,
      sessionId,
      memories: [],
      sessions: [],
      conversationHistory: [],
      elevenLabsWs: null,
      isReady: false,
    };

    // Connect to ElevenLabs Conversational AI
    try {
      const signedUrl = await getSignedAgentUrl();
      const elevenLabsWs = new WebSocket(signedUrl);

      elevenLabsWs.on("open", () => {
        state.elevenLabsWs = elevenLabsWs;
        state.isReady = true;
        clientWs.send(JSON.stringify({ type: "ready", sessionId }));
        console.log(`🎙️ Voice session started for user ${state.userId}`);
      });

      // Forward ElevenLabs audio/events back to client
      elevenLabsWs.on("message", async (data: WebSocket.RawData) => {
        try {
          const msg = JSON.parse(data.toString());

          // ──────────────────────────────────────────────────
          // STEP 3: Handle transcription from ElevenLabs STT
          // ──────────────────────────────────────────────────
          if (msg.type === "user_transcript" && msg.user_transcript_event) {
            const transcript: string = msg.user_transcript_event.user_transcript;

            // Append user message to history
            state.conversationHistory.push({
              role: "user",
              content: transcript,
            });

            // Append to session
            await appendMessage(state.sessionId, {
              role: "user",
              content: transcript,
            });

            // Build system prompt with injected memories
            const systemPrompt = buildSystemPrompt(
              state.memories,
              state.sessions,
              state.userName
            );

            // Call Claude with streaming + research tool
            await handleClaudeStreaming(
              state,
              clientWs,
              systemPrompt,
              transcript
            );
          }

          // Forward audio events to client
          if (msg.type === "audio" || msg.type === "agent_response") {
            clientWs.send(data.toString());
          }
        } catch (err) {
          console.error("ElevenLabs message parse error:", err);
        }
      });

      elevenLabsWs.on("error", (err) => {
        console.error("ElevenLabs WS error:", err);
        clientWs.send(
          JSON.stringify({ type: "error", message: "Voice stream error" })
        );
      });

      elevenLabsWs.on("close", () => {
        state.elevenLabsWs = null;
        clientWs.send(JSON.stringify({ type: "voice_disconnected" }));
      });
    } catch (err) {
      console.error("Failed to connect to ElevenLabs:", err);
      clientWs.send(
        JSON.stringify({ type: "error", message: "Failed to initialize voice" })
      );
    }

    // ──────────────────────────────────────────────────────────────────────
    // STEP 2: Handle mic_open — parallel memory + session fetch
    // ──────────────────────────────────────────────────────────────────────
    clientWs.on("message", async (data: WebSocket.RawData) => {
      try {
        const msg = JSON.parse(data.toString());

        if (msg.type === "mic_open") {
          const lastMessage: string = msg.lastMessage || "";

          const startTime = Date.now();

          // Fire all three in parallel
          const [searchResults, sessionsResult] = await Promise.all([
            vectorSearch(state.userId, lastMessage || "how are you feeling today"),
            (async () => {
              // A) vectorSearch is handled above
              return [];
            })(),
            recentSessions(state.userId).then((s) => {
              state.sessions = s;
              return s;
            }),
          ]);

          // B) tag pattern pull using results from A
          state.memories = await tagPatternPull(state.userId, searchResults);

          console.log(
            `⚡ Memory fetch: ${Date.now() - startTime}ms | memories: ${state.memories.length}`
          );

          clientWs.send(
            JSON.stringify({
              type: "context_loaded",
              memoryCount: state.memories.length,
              sessionCount: state.sessions.length,
            })
          );
          return;
        }

        // Forward other messages to ElevenLabs
        if (state.elevenLabsWs?.readyState === WebSocket.OPEN) {
          state.elevenLabsWs.send(data.toString());
        }
      } catch (err) {
        console.error("Client message error:", err);
      }
    });

    clientWs.on("close", () => {
      state.elevenLabsWs?.close();
      console.log(`🔌 Voice session ended for user ${state.userId}`);
    });

    clientWs.on("error", (err) => {
      console.error("Client WS error:", err);
    });
  });

  return wss;
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 4: Claude Streaming with Firecrawl Tool Use
// ─────────────────────────────────────────────────────────────────────────────

async function handleClaudeStreaming(
  state: ConnectionState,
  clientWs: WebSocket,
  systemPrompt: string,
  userTranscript: string
): Promise<void> {
  let fullAssistantResponse = "";
  let currentMessages = [...state.conversationHistory];

  // Claude streaming loop (handles tool use)
  let continueStreaming = true;

  while (continueStreaming) {
    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: systemPrompt,
      tools: [searchResearchTool],
      messages: currentMessages,
    });

    let toolUseBlock: { id: string; name: string; input: { query: string; topic: string } } | null = null;
    let toolInputAccumulator = "";

    for await (const event of stream) {
      if (event.type === "content_block_start") {
        if (event.content_block.type === "tool_use") {
          toolUseBlock = {
            id: event.content_block.id,
            name: event.content_block.name,
            input: { query: "", topic: "mental_health" },
          };
          toolInputAccumulator = "";
        }
      }

      if (event.type === "content_block_delta") {
        if (event.delta.type === "text_delta") {
          const token = event.delta.text;
          fullAssistantResponse += token;

          // STEP 4: Pipe each token to ElevenLabs TTS immediately
          if (state.elevenLabsWs?.readyState === WebSocket.OPEN) {
            state.elevenLabsWs.send(
              JSON.stringify({ type: "tts_input", text: token })
            );
          }

          // Also send to client for display
          clientWs.send(
            JSON.stringify({ type: "text_delta", delta: token })
          );
        }

        if (event.delta.type === "input_json_delta") {
          toolInputAccumulator += event.delta.partial_json;
        }
      }

      if (event.type === "content_block_stop" && toolUseBlock) {
        try {
          toolUseBlock.input = JSON.parse(toolInputAccumulator);
        } catch {
          // partial input
        }
      }

      if (event.type === "message_stop") {
        const stopReason = (await stream.finalMessage()).stop_reason;

        if (stopReason === "tool_use" && toolUseBlock) {
          // STEP 4: Handle Firecrawl tool call
          clientWs.send(
            JSON.stringify({
              type: "researching",
              query: toolUseBlock.input.query,
            })
          );

          const researchResult = await searchResearch(
            toolUseBlock.input.query,
            toolUseBlock.input.topic
          );

          // Append assistant message with tool use to history
          currentMessages.push({
            role: "assistant",
            content: [
              {
                type: "tool_use",
                id: toolUseBlock.id,
                name: toolUseBlock.name,
                input: toolUseBlock.input,
              },
            ],
          });

          // Append tool result
          currentMessages.push({
            role: "user",
            content: [
              {
                type: "tool_result",
                tool_use_id: toolUseBlock.id,
                content: researchResult,
              },
            ],
          });

          toolUseBlock = null;
          toolInputAccumulator = "";
          // Continue Claude streaming with research results
        } else {
          // STEP 4: message_stop — response complete
          continueStreaming = false;

          // Append final assistant response to conversation history
          state.conversationHistory.push({
            role: "assistant",
            content: fullAssistantResponse,
          });

          // Append to session
          await appendMessage(state.sessionId, {
            role: "assistant",
            content: fullAssistantResponse,
          });

          clientWs.send(JSON.stringify({ type: "response_complete" }));

          // STEP 5: Fire-and-forget memory save
          const transcriptForSaving = state.conversationHistory
            .slice(-6) // Last 3 turns
            .map((m) => `${m.role}: ${typeof m.content === "string" ? m.content : JSON.stringify(m.content)}`)
            .join("\n");

          saveMemoryAsync(
            state.userId,
            state.sessionId,
            transcriptForSaving
          ).catch(console.error);
        }
      }
    }
  }
}
