import { prisma } from "../lib/prisma.js";

export interface RecentSession {
  id: string;
  summary?: string | null;
  lastMessages: Array<{ role: string; content: string; timestamp: string }>;
  createdAt: Date;
}

/**
 * Fetch the last 3 conversations for a user with their summary and
 * last 2 messages each.
 */
export async function recentSessions(userId: string): Promise<RecentSession[]> {
  const conversations = await prisma.conversation.findMany({
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

  const result: RecentSession[] = [];
  for (const s of conversations) {
    const msgs = ((s.messages ?? []) as Array<{ role: string; content: string; timestamp: string }>);
    result.push({
      id: s.id as string,
      summary: s.summary as string | null | undefined,
      lastMessages: msgs.slice(-2),
      createdAt: s.createdAt as Date,
    });
  }
  return result;
}

/**
 * Create a new conversation for the user. Returns the conversation ID.
 */
export async function createSession(userId: string): Promise<string> {
  const conversation = await prisma.conversation.create({
    data: {
      userId,
      messages: [],
    },
    select: { id: true },
  });
  return conversation.id;
}

/**
 * Append a message object to a conversation's messages array.
 */
export async function appendMessage(
  sessionId: string,
  message: { role: string; content: string; timestamp?: string }
): Promise<void> {
  const conversation = await prisma.conversation.findUnique({
    where: { id: sessionId },
    select: { messages: true },
  });

  if (!conversation) return;

  const messages = (conversation.messages as object[]) || [];
  messages.push({
    ...message,
    timestamp: message.timestamp || new Date().toISOString(),
  });

  await prisma.conversation.update({
    where: { id: sessionId },
    data: { messages },
  });
}

/**
 * Update the LLM-generated summary for a conversation.
 */
export async function updateSessionSummary(
  sessionId: string,
  summary: string
): Promise<void> {
  await prisma.conversation.update({
    where: { id: sessionId },
    data: { summary },
  });
}
