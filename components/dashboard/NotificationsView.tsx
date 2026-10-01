"use client";

import { useState } from "react";
import { BellOff, CheckCheck } from "lucide-react";
import { NOTIFICATION_FILTER_LABELS, countUnread, filterNotifications, type NotificationFilter } from "@/lib/notifications";
import { useMockStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { NotificationList } from "@/components/notifications/NotificationList";
import { cn, formatNumber } from "@/lib/utils";

const FILTERS: NotificationFilter[] = ["all", "unread"];

/** The notification center: all / unread tabs, mark-as-read actions, empty states. */
export function NotificationsView() {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useMockStore();
  const [filter, setFilter] = useState<NotificationFilter>("all");

  const unreadCount = countUnread(notifications);
  const visible = filterNotifications(notifications, filter);
  const counts: Record<NotificationFilter, number> = { all: notifications.length, unread: unreadCount };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-dark">الإشعارات</h1>
          <p className="mt-1 text-sm text-dark/70">
            {unreadCount > 0
              ? `لديك ${formatNumber(unreadCount)} إشعارات غير مقروءة (حساب تجريبي).`
              : "لا توجد إشعارات غير مقروءة (حساب تجريبي)."}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          icon={<CheckCheck className="h-4 w-4" aria-hidden="true" />}
          onClick={markAllNotificationsAsRead}
          disabled={unreadCount === 0}
        >
          تعليم الكل كمقروء
        </Button>
      </header>

      <div role="tablist" aria-label="تصفية الإشعارات" className="flex gap-2">
        {FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            id={`notifications-tab-${item}`}
            aria-selected={filter === item}
            aria-controls="notifications-panel"
            onClick={() => setFilter(item)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors",
              filter === item ? "bg-primary text-white" : "bg-white text-dark/70 hover:bg-primary/10 hover:text-primary",
            )}
          >
            {NOTIFICATION_FILTER_LABELS[item]}
            <span
              className={cn(
                "rounded-full px-2 text-xs",
                filter === item ? "bg-white/20 text-white" : "bg-dark/5 text-dark/70",
              )}
            >
              {formatNumber(counts[item])}
            </span>
          </button>
        ))}
      </div>

      <section
        id="notifications-panel"
        role="tabpanel"
        aria-labelledby={`notifications-tab-${filter}`}
        className="rounded-2xl border border-dark/10 bg-white p-2"
      >
        {visible.length === 0 ? (
          <EmptyState
            icon={<BellOff className="h-7 w-7" aria-hidden="true" />}
            title="لا توجد إشعارات جديدة"
            description={
              filter === "unread"
                ? "اطّلعت على كل إشعاراتك. ستظهر هنا الإشعارات الجديدة فور وصولها."
                : "ستظهر هنا طلبات الانضمام والرسائل وتحديثات مبادراتك."
            }
          />
        ) : (
          <NotificationList
            id="notifications-list"
            notifications={visible}
            onRead={markNotificationAsRead}
            label={filter === "unread" ? "الإشعارات غير المقروءة" : "كل الإشعارات"}
          />
        )}
      </section>
    </div>
  );
}
