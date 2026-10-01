"use client";

import Link from "next/link";
import { createElement } from "react";
import {
  Check,
  CircleCheck,
  CircleX,
  FilePlus2,
  Info,
  Megaphone,
  MessageSquare,
  Repeat,
  Undo2,
  UserMinus,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import type { Notification, NotificationType } from "@/types";
import { NOTIFICATION_TYPE_LABELS, isUnread } from "@/lib/notifications";
import { RelativeTime } from "@/components/ui/RelativeTime";
import { cn } from "@/lib/utils";

const TYPE_ICONS: Record<NotificationType, LucideIcon> = {
  APPLICATION_RECEIVED: FilePlus2,
  APPLICATION_ACCEPTED: CircleCheck,
  APPLICATION_REJECTED: CircleX,
  APPLICATION_WITHDRAWN: Undo2,
  NEW_MEMBER: UserPlus,
  MEMBER_REMOVED: UserMinus,
  MEMBER_ROLE_CHANGED: Repeat,
  NEW_MESSAGE: MessageSquare,
  INITIATIVE_UPDATE: Megaphone,
  SYSTEM: Info,
};

interface NotificationItemProps {
  notification: Notification;
  /** Called when the notification is opened (link followed) or marked read. */
  onRead: (id: string) => void;
  /** Extra callback after the link is followed (e.g. close the dropdown). */
  onNavigate?: () => void;
  compact?: boolean;
}

/** One notification row. The whole body is a link when it has a target; a separate button marks it read. */
export function NotificationItem({ notification, onRead, onNavigate, compact = false }: NotificationItemProps) {
  const unread = isUnread(notification);
  const typeLabel = NOTIFICATION_TYPE_LABELS[notification.type];

  const body = (
    <>
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full",
          compact ? "h-8 w-8" : "h-10 w-10",
          unread ? "bg-primary text-white" : "bg-dark/5 text-dark/60",
        )}
        aria-hidden="true"
      >
        {createElement(TYPE_ICONS[notification.type], { className: compact ? "h-4 w-4" : "h-5 w-5" })}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className={cn("truncate text-sm text-dark", unread ? "font-extrabold" : "font-semibold")}>
            {notification.title}
          </span>
          {unread && <span className="h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />}
        </span>
        <span className={cn("mt-0.5 block text-sm leading-relaxed text-dark/70", compact && "line-clamp-2")}>
          {notification.message}
        </span>
        <span className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-dark/60">
          <span>{typeLabel}</span>
          <span aria-hidden="true">·</span>
          <RelativeTime iso={notification.createdAt} />
          <span className="font-bold text-primary">{unread ? "• غير مقروء" : ""}</span>
        </span>
      </span>
    </>
  );

  const bodyClasses = "flex min-w-0 flex-1 items-start gap-3 rounded-xl p-3 hover:bg-primary/5";

  return (
    <li className={cn("flex items-start gap-1 rounded-xl", unread ? "bg-primary/5" : "bg-transparent")}>
      {notification.href ? (
        <Link
          href={notification.href}
          className={bodyClasses}
          onClick={() => {
            if (unread) onRead(notification.id);
            onNavigate?.();
          }}
        >
          {body}
        </Link>
      ) : (
        <div className={bodyClasses}>{body}</div>
      )}
      {unread && (
        <button
          type="button"
          onClick={() => onRead(notification.id)}
          className="mt-3 me-2 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-dark/60 hover:bg-primary/10 hover:text-primary"
          aria-label={`تعليم "${notification.title}" كمقروء`}
          title="تعليم كمقروء"
        >
          <Check className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </li>
  );
}
