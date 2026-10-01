import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { User } from "@/types";
import { Avatar } from "@/components/ui/Avatar";

interface ConversationHeaderProps {
  participant: User;
  /** Shown under the name, e.g. the wilaya. */
  subtitle?: string;
}

export function ConversationHeader({ participant, subtitle }: ConversationHeaderProps) {
  return (
    <header className="flex items-center gap-3 border-b border-dark/10 px-4 py-3">
      <Link
        href="/dashboard/messages"
        className="-ms-2 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-dark hover:bg-dark/5 md:hidden"
        aria-label="العودة إلى المحادثات"
      >
        <ArrowRight className="h-5 w-5" aria-hidden="true" />
      </Link>
      <Avatar name={participant.name} colorClass={participant.avatarColor} src={participant.avatarUrl} size="sm" />
      <div className="min-w-0">
        <h1 className="truncate text-base font-extrabold text-dark">{participant.name}</h1>
        {subtitle && <p className="truncate text-xs text-dark/60">{subtitle}</p>}
      </div>
    </header>
  );
}
