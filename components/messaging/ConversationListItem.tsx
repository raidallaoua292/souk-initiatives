import Link from "next/link";
import type { ConversationWithRelations } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { RelativeTime } from "@/components/ui/RelativeTime";
import { cn, formatNumber } from "@/lib/utils";

interface ConversationListItemProps {
  conversation: ConversationWithRelations;
  currentUserId: string;
  active: boolean;
}

export function ConversationListItem({ conversation, currentUserId, active }: ConversationListItemProps) {
  const { participant, initiative, lastMessage, unreadCount } = conversation;
  const unread = unreadCount > 0;
  const preview = lastMessage
    ? `${lastMessage.senderId === currentUserId ? "أنت: " : ""}${lastMessage.content}`
    : "لا توجد رسائل بعد";

  return (
    <li>
      <Link
        href={`/dashboard/messages/${conversation.id}`}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex items-start gap-3 rounded-xl p-3 transition-colors",
          active ? "bg-primary/10" : unread ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-dark/5",
        )}
      >
        <Avatar name={participant.name} colorClass={participant.avatarColor} src={participant.avatarUrl} size="sm" />
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline justify-between gap-2">
            <span className={cn("truncate text-sm text-dark", unread ? "font-extrabold" : "font-bold")}>
              {participant.name}
            </span>
            <RelativeTime iso={conversation.updatedAt} className="shrink-0 text-xs text-dark/60" />
          </span>
          {initiative && <span className="mt-0.5 block truncate text-xs font-semibold text-primary">{initiative.title}</span>}
          <span className="mt-0.5 flex items-center gap-2">
            <span className={cn("block flex-1 truncate text-sm", unread ? "font-semibold text-dark" : "text-dark/70")}>
              {preview}
            </span>
            {unread && (
              <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-bold text-white">
                <span aria-hidden="true">{formatNumber(unreadCount)}</span>
                <span className="sr-only">{`${unreadCount} رسائل غير مقروءة`}</span>
              </span>
            )}
          </span>
        </span>
      </Link>
    </li>
  );
}
