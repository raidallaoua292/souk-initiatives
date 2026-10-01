"use client";

import { Fragment, useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";
import type { Message, User } from "@/types";
import { dayKey, formatDayLabel } from "@/lib/utils";
import { MessageBubble } from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  participant: User;
}

/** Scrollable thread (oldest first) with a heading per day; scrolls to the newest message. */
export function MessageList({ messages, currentUserId, participant }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const count = messages.length;

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [count]);

  if (count === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <MessageCircle className="h-6 w-6" aria-hidden="true" />
        </span>
        <p className="font-bold text-dark">ابدأ المحادثة بإرسال أول رسالة</p>
        <p className="text-sm text-dark/60">{`اكتب رسالتك إلى ${participant.name} في الأسفل.`}</p>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4" role="log" aria-label="الرسائل" aria-live="polite">
      <ul id="messages-list" className="flex flex-col gap-3">
        {messages.map((message, index) => {
          const newDay = index === 0 || dayKey(messages[index - 1].createdAt) !== dayKey(message.createdAt);
          return (
            <Fragment key={message.id}>
              {newDay && (
                <li className="self-center rounded-full bg-dark/5 px-3 py-1 text-xs font-semibold text-dark/70">
                  {formatDayLabel(message.createdAt)}
                </li>
              )}
              <MessageBubble
                message={message}
                mine={message.senderId === currentUserId}
                senderName={participant.name}
              />
            </Fragment>
          );
        })}
      </ul>
    </div>
  );
}
