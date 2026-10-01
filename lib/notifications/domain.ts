import type { Notification } from "@/types";
import type { NotificationFilter } from "./constants";

/* Pure rules for reading / filtering notifications. Unread = `readAt` is undefined. */

export function isUnread(notification: Pick<Notification, "readAt">): boolean {
  return notification.readAt === undefined;
}

export function countUnread(notifications: Notification[]): number {
  return notifications.filter(isUnread).length;
}

export function byNewestNotification(a: Notification, b: Notification): number {
  return b.createdAt.localeCompare(a.createdAt);
}

export function filterNotifications(notifications: Notification[], filter: NotificationFilter): Notification[] {
  return filter === "unread" ? notifications.filter(isUnread) : notifications;
}

/**
 * Marks one of `userId`'s notifications as read. Returns the same array
 * (same reference) when nothing changes, so React can skip a re-render.
 */
export function markNotificationRead(
  notifications: Notification[],
  id: string,
  userId: string,
  now: string,
): Notification[] {
  const target = notifications.find((n) => n.id === id);
  if (!target || target.userId !== userId || !isUnread(target)) return notifications;
  return notifications.map((n) => (n.id === id ? { ...n, readAt: now } : n));
}

export function markAllNotificationsRead(notifications: Notification[], userId: string, now: string): Notification[] {
  if (!notifications.some((n) => n.userId === userId && isUnread(n))) return notifications;
  return notifications.map((n) => (n.userId === userId && isUnread(n) ? { ...n, readAt: now } : n));
}

/** Reading a conversation also settles the "new message" notifications that pointed at it. */
export function markConversationNotificationsRead(
  notifications: Notification[],
  conversationId: string,
  userId: string,
  now: string,
): Notification[] {
  const affected = (n: Notification) => n.userId === userId && n.conversationId === conversationId && isUnread(n);
  if (!notifications.some(affected)) return notifications;
  return notifications.map((n) => (affected(n) ? { ...n, readAt: now } : n));
}
