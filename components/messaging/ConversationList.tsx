import { MessagesSquare } from "lucide-react";
import type { ConversationWithRelations } from "@/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConversationListItem } from "./ConversationListItem";

interface ConversationListProps {
  conversations: ConversationWithRelations[];
  currentUserId: string;
  activeId?: string;
}

export function ConversationList({ conversations, currentUserId, activeId }: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="p-3">
        <EmptyState
          icon={<MessagesSquare className="h-7 w-7" aria-hidden="true" />}
          title="لا توجد محادثات بعد"
          description="ستظهر هنا محادثاتك مع أعضاء الفرق وأصحاب المبادرات."
        />
      </div>
    );
  }
  return (
    <ul id="conversations-list" aria-label="المحادثات" className="space-y-1 p-2">
      {conversations.map((conversation) => (
        <ConversationListItem
          key={conversation.id}
          conversation={conversation}
          currentUserId={currentUserId}
          active={conversation.id === activeId}
        />
      ))}
    </ul>
  );
}
