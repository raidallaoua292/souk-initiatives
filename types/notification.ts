/** What happened. Mirrors a future Prisma enum. */
export const NotificationType = {
  APPLICATION_RECEIVED: "APPLICATION_RECEIVED",
  APPLICATION_ACCEPTED: "APPLICATION_ACCEPTED",
  APPLICATION_REJECTED: "APPLICATION_REJECTED",
  APPLICATION_WITHDRAWN: "APPLICATION_WITHDRAWN",
  NEW_MEMBER: "NEW_MEMBER",
  MEMBER_REMOVED: "MEMBER_REMOVED",
  MEMBER_ROLE_CHANGED: "MEMBER_ROLE_CHANGED",
  NEW_MESSAGE: "NEW_MESSAGE",
  INITIATIVE_UPDATE: "INITIATIVE_UPDATE",
  SYSTEM: "SYSTEM",
} as const;
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];

/**
 * A notification addressed to one user. Read state is `readAt`:
 * `undefined` means unread (no separate boolean, so the two can't disagree).
 */
export interface Notification {
  id: string;
  /** The recipient. */
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  /** ISO timestamp. */
  createdAt: string;
  /** ISO timestamp; `undefined` = unread. */
  readAt?: string;
  /** Where the notification leads when opened. */
  href?: string;
  /** The user who caused it, when there is one. */
  actorId?: string;
  initiativeId?: string;
  applicationId?: string;
  conversationId?: string;
}
