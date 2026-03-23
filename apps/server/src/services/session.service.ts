import { prisma } from "../lib/prisma.js";

export interface RecentSession {
  id: string;
  summary?: string | null;
  lastMessages: Array<{ role: string; content: string; timestamp: string }>;
  createdAt: Date;
}

/**
 * Fetch the last 3 sessions for a user with their summary and
 * last 2 messages each.
 */
export async function recentSessions(userId: string): Promise<RecentSession[]> {
  const sessions = await prisma.session.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: {
      id: true,
      summary: true,
      messages: true,
      createdAt: true,
    },
  });

  return sessions.map((s) => {
    const msgs = (s.messages as Array<{ role: string; content: string; timestamp: string }>) || [];
    // Return only the last 2 messages
    const lastMessages = msgs.slice(-2);
    return {
      id: s.id,
      summary: s.summary,
      lastMessages,
      createdAt: s.createdAt,
    };
  });
}

/**
 * Create a new session for the user. Returns the session ID.
 */
export async function createSession(userId: string): Promise<string> {
  const session = await prisma.session.create({
    data: {
      userId,
      messages: [],
    },
    select: { id: true },
  });
  return session.id;
}

/**
 * Append a message object to a session's messages array.
 */
export async function appendMessage(
  sessionId: string,
  message: { role: string; content: string; timestamp?: string }
): Promise<void> {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { messages: true },
  });

  if (!session) return;

  const messages = (session.messages as object[]) || [];
  messages.push({
    ...message,
    timestamp: message.timestamp || new Date().toISOString(),
  });

  await prisma.session.update({
    where: { id: sessionId },
    data: { messages },
  });
}

/**
 * Update the LLM-generated summary for a session.
 */
export async function updateSessionSummary(
  sessionId: string,
  summary: string
): Promise<void> {
  await prisma.session.update({
    where: { id: sessionId },
    data: { summary },
  });
}
