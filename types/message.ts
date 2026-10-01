/** A text message in a conversation (version 1: text only). */
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  /** ISO timestamp. */
  createdAt: string;
  /** ISO timestamp when the recipient opened it; `undefined` = unread. */
  readAt?: string;
}
