"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { useMockStore } from "@/lib/store";
import { formatNumber } from "@/lib/utils";
import { NotificationDropdown } from "./NotificationDropdown";

/** Bell button for the navbar: unread badge + dropdown. Closes on Escape, outside click and navigation. */
export function NotificationBell() {
  const { getUnreadNotificationsCount } = useMockStore();
  const unread = getUnreadNotificationsCount();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const pathname = usePathname();
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  // Open state is tied to the path it was opened on, so navigating closes it without an effect.
  const open = openPath === pathname;
  const close = () => setOpenPath(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpenPath(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenPath(null);
        rootRef.current?.querySelector<HTMLButtonElement>("button[aria-controls]")?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpenPath(open ? null : pathname)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={unread > 0 ? `الإشعارات، ${formatNumber(unread)} غير مقروءة` : "الإشعارات، لا توجد إشعارات غير مقروءة"}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-dark hover:bg-dark/5"
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        {unread > 0 && (
          <span
            aria-hidden="true"
            className="absolute -end-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold leading-none text-white ring-2 ring-background"
          >
            {unread > 9 ? "٩+" : formatNumber(unread)}
          </span>
        )}
      </button>
      {open && <NotificationDropdown id={panelId} onClose={close} />}
    </div>
  );
}
