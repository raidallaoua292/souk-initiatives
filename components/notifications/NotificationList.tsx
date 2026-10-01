"use client";

import type { Notification } from "@/types";
import { NotificationItem } from "./NotificationItem";

interface NotificationListProps {
  notifications: Notification[];
  onRead: (id: string) => void;
  onNavigate?: () => void;
  compact?: boolean;
  /** Accessible name for the list. */
  label: string;
  id?: string;
}

export function NotificationList({ notifications, onRead, onNavigate, compact, label, id }: NotificationListProps) {
  return (
    <ul id={id} aria-label={label} className="space-y-1">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRead={onRead}
          onNavigate={onNavigate}
          compact={compact}
        />
      ))}
    </ul>
  );
}
