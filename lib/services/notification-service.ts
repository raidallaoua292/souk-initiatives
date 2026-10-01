import { notifications } from "@/lib/mock-data";
import type { Notification } from "@/types";

/** A user's notifications, newest first. */
export async function getNotificationsForUser(userId: string): Promise<Notification[]> {
  return notifications
    .filter((item) => item.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getUnreadNotificationsCountForUser(userId: string): Promise<number> {
  return notifications.filter((item) => item.userId === userId && item.readAt === undefined).length;
}
