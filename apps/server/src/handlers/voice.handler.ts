import WebSocket, { WebSocketServer } from "ws";
import type { IncomingMessage, Server } from "http";
import { type Content, SchemaType } from "@google/generative-ai";
import { genAI } from "../lib/gemini.js";
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
// Firecrawl Tool Definition for Gemini
// ─────────────────────────────────────────────────────────────────────────────

const searchResearchTool = {
  functionDeclarations: [
    {
      name: "search_research",
      description: `Search for psychology, neuroscience, relationship science, or health research. Use this when the conversation touches on emotional patterns, mental health, sleep, etc.`,
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          query: {
            type: SchemaType.STRING,
            description: "Specific research query (e.g. anxious attachment pattern psychology)",
          },
          topic: {
            type: SchemaType.STRING,
            description: "Topic of research (mental_health, relationships, etc.)",
          },
        },
        required: ["query", "topic"],
      },
    },
  ],
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
  conversationHistory: Content[];
  elevenLabsWs: WebSocket | null;
  isReady: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// WebSocket Voice Handler
// ─────────────────────────────────────────────────────────────────────────────

export function createVoiceWebSocketServer(server: Server): WebSocketServer {
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (request: IncomingMessage, socket, head) => {
    const url = new URL(request.url || "", `http://${request.headers.host}`);
    if (url.pathname !== "/api/voice/stream") return;

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  });

  wss.on("connection", async (clientWs: WebSocket, request: IncomingMessage) => {
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

    try {
      const signedUrl = await getSignedAgentUrl();
      const elevenLabsWs = new WebSocket(signedUrl);

      elevenLabsWs.on("open", () => {
        state.elevenLabsWs = elevenLabsWs;
        state.isReady = true;
        clientWs.send(JSON.stringify({ type: "ready", sessionId }));
        console.log(`🎙️ Voice session started for user ${state.userId}`);
      });

      elevenLabsWs.on("message", async (data: WebSocket.RawData) => {
        try {
          const msg = JSON.parse(data.toString());

          if (msg.type === "user_transcript" && msg.user_transcript_event) {
            const transcript: string = msg.user_transcript_event.user_transcript;

            state.conversationHistory.push({
              role: "user",
              parts: [{ text: transcript }],
            });

            await appendMessage(state.sessionId, {
              role: "user",
              content: transcript,
            });

            const systemPrompt = buildSystemPrompt(
              state.memories,
              state.sessions,
              state.userName
            );

            await handleGeminiStreaming(
              state,
              clientWs,
              systemPrompt,
              transcript
            );
          }

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

    clientWs.on("message", async (data: WebSocket.RawData) => {
      try {
        const msg = JSON.parse(data.toString());

        if (msg.type === "mic_open") {
          const lastMessage: string = msg.lastMessage || "";
          const startTime = Date.now();

          const [searchResults, sessionsResult] = await Promise.all([
            vectorSearch(state.userId, lastMessage || "how are you feeling today"),
            (async () => [])(),
            recentSessions(state.userId).then((s) => {
              state.sessions = s;
              return s;
            }),
          ]);

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
// STEP 4: Gemini Streaming with Firecrawl Tool Use
// ─────────────────────────────────────────────────────────────────────────────

async function handleGeminiStreaming(
  state: ConnectionState,
  clientWs: WebSocket,
  systemPrompt: string,
  userTranscript: string
): Promise<void> {
  let fullAssistantResponse = "";

  const chatModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: systemPrompt,
    tools: [searchResearchTool as any],
  });

  let continueStreaming = true;
  
  // Create chat session with current history (excluding the new user turn since sendMessage does it)
  // Actually, state.conversationHistory already HAS the user turn because we pushed it above.
  // We need to pop it off to use sendMessageStreeam.
  const historyToUse = [...state.conversationHistory];
  const lastUserTurn = historyToUse.pop();

  const chat = chatModel.startChat({
    history: historyToUse,
  });

  while (continueStreaming) {
    try {
      const result = await chat.sendMessageStream(lastUserTurn?.parts?.[0]?.text || "hello");
      
      let gotToolCall = false;

      for await (const chunk of result.stream) {
        const toolCalls = chunk.functionCalls();
        if (toolCalls && toolCalls.length > 0) {
          gotToolCall = true;
          const call = toolCalls[0];
          
          if (call && call.name === "search_research") {
            const query = (call.args as any).query as string;
            const topic = (call.args as any).topic as string;
            
            clientWs.send(JSON.stringify({ type: "researching", query }));
            
            const researchResult = await searchResearch(query, topic);
            
            // Send the tool response back (re-entering loop)
            const responseResult = await chat.sendMessageStream([
              {
                functionResponse: {
                  name: "search_research",
                  response: { result: researchResult }
                }
              }
            ]);
            
            for await (const respChunk of responseResult.stream) {
               const token = respChunk.text();
               fullAssistantResponse += token;

               if (state.elevenLabsWs?.readyState === WebSocket.OPEN && token) {
                 state.elevenLabsWs.send(
                   JSON.stringify({ type: "tts_input", text: token })
                 );
               }

               clientWs.send(JSON.stringify({ type: "text_delta", delta: token }));
            }
          }
        } else {
          try {
            const token = chunk.text();
            if (token) {
              fullAssistantResponse += token;
              if (state.elevenLabsWs?.readyState === WebSocket.OPEN) {
                state.elevenLabsWs.send(
                  JSON.stringify({ type: "tts_input", text: token })
                );
              }
              clientWs.send(JSON.stringify({ type: "text_delta", delta: token }));
            }
          } catch(e) {}
        }
      }
      
      continueStreaming = false; // completed
      
    } catch(err) {
       console.error("Gemini stream error:", err);
       continueStreaming = false;
    }
  }

  // Finalize
  state.conversationHistory.push(
    { role: "user", parts: [{ text: userTranscript }] },
    { role: "model", parts: [{ text: fullAssistantResponse }] }
  );

  await appendMessage(state.sessionId, {
    role: "assistant",
    content: fullAssistantResponse,
  });

  clientWs.send(JSON.stringify({ type: "response_complete" }));

  const transcriptForSaving = state.conversationHistory
    .slice(-6)
    .map((m) => `${m.role}: ${m.parts[0]?.text || ""}`)
    .join("\n");

  saveMemoryAsync(state.userId, state.sessionId, transcriptForSaving).catch(
    console.error
  );
}
