"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useMockStore } from "@/lib/store";
import { formatNumber } from "@/lib/utils";
import { ConversationList } from "./ConversationList";

const MESSAGES_PATH = "/dashboard/messages";

/**
 * Persistent two-pane layout. Desktop: list + conversation side by side.
 * Mobile: one pane at a time — the list, or the open conversation (which has a back link).
 */
export function MessagesShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { conversations, currentUser, getUnreadMessagesCount } = useMockStore();
  const activeId = pathname.startsWith(`${MESSAGES_PATH}/`) ? pathname.slice(MESSAGES_PATH.length + 1) : undefined;
  const unread = getUnreadMessagesCount();

  return (
    <div className="space-y-4">
      <header className={activeId ? "hidden md:block" : undefined}>
        <h1 className="text-2xl font-extrabold text-dark md:text-xl lg:text-2xl">الرسائل</h1>
        <p className="mt-1 text-sm text-dark/70">
          {unread > 0 ? `لديك ${formatNumber(unread)} رسائل غير مقروءة` : "لا توجد رسائل غير مقروءة"} — محادثات فردية
          (حساب تجريبي).
        </p>
      </header>

      <div className="grid h-[min(42rem,calc(100dvh-9rem))] min-h-[28rem] overflow-hidden rounded-2xl border border-dark/10 bg-white md:grid-cols-[17rem_minmax(0,1fr)] lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside
          aria-label="قائمة المحادثات"
          className={`min-h-0 overflow-y-auto border-dark/10 md:border-e ${activeId ? "hidden md:block" : "block"}`}
        >
          <ConversationList conversations={conversations} currentUserId={currentUser.id} activeId={activeId} />
        </aside>
        <section
          aria-label="المحادثة"
          className={`min-h-0 min-w-0 flex-col bg-background/40 ${activeId ? "flex" : "hidden md:flex"}`}
        >
          {children}
        </section>
      </div>
    </div>
  );
}
