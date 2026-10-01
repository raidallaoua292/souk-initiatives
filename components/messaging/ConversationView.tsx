"use client";

import { useEffect } from "react";
import Link from "next/link";
import { MessageSquareOff } from "lucide-react";
import { useMockStore } from "@/lib/store";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConversationHeader } from "./ConversationHeader";
import { InitiativeContextCard } from "./InitiativeContextCard";
import { MessageComposer } from "./MessageComposer";
import { MessageList } from "./MessageList";

/** One open conversation: header, initiative context, thread and composer. Opening it marks it read. */
export function ConversationView({ conversationId }: { conversationId: string }) {
  const { currentUser, wilayas, isOwnerOf, getConversation, getMessages, sendMessage, markConversationAsRead } =
    useMockStore();
  const conversation = getConversation(conversationId);
  const unreadCount = conversation?.unreadCount ?? 0;

  // Opening a conversation (or receiving a message while it's open) settles its unread state.
  useEffect(() => {
    if (unreadCount > 0) markConversationAsRead(conversationId);
  }, [conversationId, unreadCount, markConversationAsRead]);

  if (!conversation) {
    return (
      <div className="m-auto w-full p-4">
        <EmptyState
          icon={<MessageSquareOff className="h-7 w-7" aria-hidden="true" />}
          title="المحادثة غير موجودة"
          description="قد تكون المحادثة حُذفت أو لا تملك صلاحية عرضها."
          action={
            <Link href="/dashboard/messages" className="text-sm font-bold text-primary hover:underline">
              العودة إلى المحادثات
            </Link>
          }
        />
      </div>
    );
  }

  const { participant, initiative } = conversation;
  const wilayaName = wilayas.find((w) => w.slug === participant.wilayaSlug)?.name;
  const initiativeHref = initiative
    ? isOwnerOf(initiative.id)
      ? `/dashboard/initiatives/${initiative.id}`
      : `/initiatives/${initiative.slug}`
    : undefined;

  return (
    <>
      <div className="bg-white">
        <ConversationHeader participant={participant} subtitle={wilayaName} />
        {initiative && initiativeHref && <InitiativeContextCard title={initiative.title} href={initiativeHref} />}
      </div>
      <MessageList
        messages={getMessages(conversationId)}
        currentUserId={currentUser.id}
        participant={participant}
      />
      <div className="bg-white">
        <MessageComposer recipientName={participant.name} onSend={(content) => sendMessage(conversationId, content)} />
      </div>
    </>
  );
}
