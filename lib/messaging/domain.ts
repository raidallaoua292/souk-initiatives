import type { Conversation, Message } from "@/types";
import { fail, ok, type Result } from "@/lib/result";

/* Pure rules for 1-to-1 conversations. Unread = `readAt` is undefined on a
   message that someone ELSE sent. No clock or id generation in here. */

export const MESSAGE_LIMITS = { max: 2000 } as const;

export function validateMessageContent(content: string): string | null {
  const trimmed = content.trim();
  if (trimmed.length === 0) return "اكتب رسالة قبل الإرسال.";
  if (trimmed.length > MESSAGE_LIMITS.max) {
    return `الرسالة طويلة جدًا. الحد الأقصى ${MESSAGE_LIMITS.max} حرفًا.`;
  }
  return null;
}

export function isParticipant(conversation: Pick<Conversation, "participantIds">, userId: string): boolean {
  return conversation.participantIds.includes(userId);
}

export function getOtherParticipantId(conversation: Pick<Conversation, "participantIds">, userId: string): string | undefined {
  return conversation.participantIds.find((id) => id !== userId);
}

export function isUnreadFor(message: Message, userId: string): boolean {
  return message.readAt === undefined && message.senderId !== userId;
}

/** Unread messages addressed to `userId`, optionally within one conversation. */
export function countUnreadMessages(messages: Message[], userId: string, conversationId?: string): number {
  return messages.filter(
    (m) => (conversationId === undefined || m.conversationId === conversationId) && isUnreadFor(m, userId),
  ).length;
}

export function byOldestMessage(a: Message, b: Message): number {
  return a.createdAt.localeCompare(b.createdAt);
}

export function byMostRecentConversation(a: Conversation, b: Conversation): number {
  return b.updatedAt.localeCompare(a.updatedAt);
}

/** Builds a message from validated input; only participants may write. */
export function composeMessage(input: {
  id: string;
  conversation: Conversation;
  senderId: string;
  content: string;
  now: string;
}): Result<Message> {
  const { id, conversation, senderId, content, now } = input;
  if (!isParticipant(conversation, senderId)) return fail("لا يمكنك الكتابة في هذه المحادثة.");
  const error = validateMessageContent(content);
  if (error) return fail(error);
  return ok({ id, conversationId: conversation.id, senderId, content: content.trim(), createdAt: now });
}

/** The conversation after `message` was appended. */
export function withLastMessage(conversation: Conversation, message: Message): Conversation {
  return { ...conversation, lastMessageId: message.id, updatedAt: message.createdAt };
}

/**
 * Marks everything `userId` received in the conversation as read.
 * Returns the same array when nothing was unread.
 */
export function markConversationRead(messages: Message[], conversationId: string, userId: string, now: string): Message[] {
  const affected = (m: Message) => m.conversationId === conversationId && isUnreadFor(m, userId);
  if (!messages.some(affected)) return messages;
  return messages.map((m) => (affected(m) ? { ...m, readAt: now } : m));
}

/** An existing 1-to-1 conversation between two people about the same initiative (or none). */
export function findConversation(
  conversations: Conversation[],
  userId: string,
  otherUserId: string,
  initiativeId?: string,
): Conversation | undefined {
  return conversations.find(
    (c) =>
      isParticipant(c, userId) &&
      isParticipant(c, otherUserId) &&
      (c.initiativeId ?? undefined) === initiativeId,
  );
}

export function buildConversation(input: {
  id: string;
  userId: string;
  otherUserId: string;
  initiativeId?: string;
  now: string;
}): Result<Conversation> {
  const { id, userId, otherUserId, initiativeId, now } = input;
  if (userId === otherUserId) return fail("لا يمكنك بدء محادثة مع نفسك.");
  return ok({
    id,
    participantIds: [userId, otherUserId],
    ...(initiativeId ? { initiativeId } : {}),
    createdAt: now,
    updatedAt: now,
  });
}
