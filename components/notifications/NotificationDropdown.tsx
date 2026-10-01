"use client";

import Link from "next/link";
import { BellOff, CheckCheck } from "lucide-react";
import { DROPDOWN_LIMIT } from "@/lib/notifications";
import { useMockStore } from "@/lib/store";
import { NotificationList } from "./NotificationList";

interface NotificationDropdownProps {
  id: string;
  onClose: () => void;
}

/** The panel under the bell: the most recent notifications with quick actions. */
export function NotificationDropdown({ id, onClose }: NotificationDropdownProps) {
  const { notifications, getUnreadNotificationsCount, markNotificationAsRead, markAllNotificationsAsRead } =
    useMockStore();
  const unreadCount = getUnreadNotificationsCount();
  const recent = notifications.slice(0, DROPDOWN_LIMIT);

  return (
    <div
      id={id}
      role="region"
      aria-label="الإشعارات"
      className="fixed inset-x-3 top-[4.25rem] z-50 max-h-[calc(100dvh-5.5rem)] overflow-y-auto rounded-2xl border border-dark/10 bg-white shadow-lg sm:absolute sm:inset-x-auto sm:end-0 sm:top-full sm:mt-2 sm:w-[25rem]"
    >
      <div className="flex items-center justify-between gap-2 border-b border-dark/10 px-4 py-3">
        <h2 className="text-base font-extrabold text-dark">الإشعارات</h2>
        <button
          type="button"
          onClick={markAllNotificationsAsRead}
          disabled={unreadCount === 0}
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold text-primary hover:bg-primary/10 disabled:pointer-events-none disabled:opacity-40"
        >
          <CheckCheck className="h-4 w-4" aria-hidden="true" />
          تعليم الكل كمقروء
        </button>
      </div>

      <div className="p-2">
        {recent.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
            <BellOff className="h-8 w-8 text-dark/40" aria-hidden="true" />
            <p className="font-bold text-dark">لا توجد إشعارات جديدة</p>
            <p className="text-sm text-dark/60">ستظهر هنا طلبات الانضمام والرسائل والتحديثات.</p>
          </div>
        ) : (
          <NotificationList
            notifications={recent}
            onRead={markNotificationAsRead}
            onNavigate={onClose}
            compact
            label="آخر الإشعارات"
          />
        )}
      </div>

      <div className="border-t border-dark/10 p-2">
        <Link
          href="/dashboard/notifications"
          onClick={onClose}
          className="block rounded-xl px-3 py-2 text-center text-sm font-bold text-primary hover:bg-primary/10"
        >
          عرض كل الإشعارات
        </Link>
      </div>
    </div>
  );
}
