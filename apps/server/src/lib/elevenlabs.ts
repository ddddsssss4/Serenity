import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
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
      agentId: env.ELEVENLABS_AGENT_ID,
    }
  );
  return response.signedUrl;
}
