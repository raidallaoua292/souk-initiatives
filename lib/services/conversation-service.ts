import { conversations } from "@/lib/mock-data";
import type { Conversation } from "@/types";

/** Conversations a user takes part in, most recently active first. */
export async function getConversationsForUser(userId: string): Promise<Conversation[]> {
  return conversations
    .filter((item) => item.participantIds.includes(userId))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getConversationById(id: string): Promise<Conversation | undefined> {
  return conversations.find((item) => item.id === id);
}
