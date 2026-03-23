import { ElevenLabsClient } from "elevenlabs";
import { env } from "../config/env.js";

export const elevenlabs = new ElevenLabsClient({
  apiKey: env.ELEVENLABS_API_KEY,
});

/**
 * Get a signed WebSocket URL for the ElevenLabs Conversational AI agent.
 * This keeps the API key server-side and prevents exposure to clients.
 */
export async function getSignedAgentUrl(): Promise<string> {
  const response = await elevenlabs.conversationalAi.conversations.getSignedUrl(
    {
      agent_id: env.ELEVENLABS_AGENT_ID,
    }
  );
  return response.signed_url;
}
