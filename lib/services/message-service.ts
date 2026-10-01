import { messages } from "@/lib/mock-data";
import type { Message } from "@/types";

/** Messages of one conversation, oldest first. */
export async function getMessagesByConversation(conversationId: string): Promise<Message[]> {
  return messages
    .filter((item) => item.conversationId === conversationId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function getMessagesByConversations(conversationIds: string[]): Promise<Message[]> {
  const wanted = new Set(conversationIds);
  return messages
    .filter((item) => wanted.has(item.conversationId))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}
