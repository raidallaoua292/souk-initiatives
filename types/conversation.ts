import type { InitiativeWithRelations } from "./initiative";
import type { Message } from "./message";
import type { User } from "./user";

/** A 1-to-1 conversation, optionally about one initiative. */
export interface Conversation {
  id: string;
  /** Exactly two user ids in version 1. */
  participantIds: string[];
  /** Initiative the conversation is about; the title is resolved from this id. */
  initiativeId?: string;
  /** ISO timestamps. */
  createdAt: string;
  updatedAt: string;
  lastMessageId?: string;
}

/** View-model for the current user: the other person, initiative and last message resolved. */
export interface ConversationWithRelations extends Conversation {
  /** The participant who isn't the current user. */
  participant: User;
  initiative?: InitiativeWithRelations;
  lastMessage?: Message;
  /** Messages from the other person the current user hasn't opened. */
  unreadCount: number;
}
