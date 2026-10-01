import type { Metadata } from "next";
import { ConversationView } from "@/components/messaging/ConversationView";

export const metadata: Metadata = { title: "محادثة" };

export default async function ConversationPage({ params }: { params: Promise<{ conversationId: string }> }) {
  const { conversationId } = await params;
  return <ConversationView conversationId={conversationId} />;
}
