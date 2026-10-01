import { CheckCheck } from "lucide-react";
import type { Message } from "@/types";
import { cn, formatClock } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
  mine: boolean;
  senderName: string;
}

/** Own messages: green, on the end side. Others: white, on the start side. The sender is also named for screen readers. */
export function MessageBubble({ message, mine, senderName }: MessageBubbleProps) {
  return (
    <li className={cn("flex max-w-[85%] flex-col gap-1 sm:max-w-[75%]", mine ? "self-end items-end" : "self-start items-start")}>
      <span className="sr-only">{mine ? "أنت" : senderName}</span>
      <p
        className={cn(
          "whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          mine ? "rounded-ee-md bg-primary text-white" : "rounded-es-md border border-dark/10 bg-white text-dark",
        )}
      >
        {message.content}
      </p>
      <span className="flex items-center gap-1.5 px-1 text-xs text-dark/60">
        <time dateTime={message.createdAt}>{formatClock(message.createdAt)}</time>
        {mine && message.readAt && (
          <span className="inline-flex items-center gap-1">
            <CheckCheck className="h-3.5 w-3.5" aria-hidden="true" />
            تمت القراءة
          </span>
        )}
      </span>
    </li>
  );
}
