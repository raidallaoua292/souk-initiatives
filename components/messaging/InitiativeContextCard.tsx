import Link from "next/link";
import { Sprout } from "lucide-react";

interface InitiativeContextCardProps {
  title: string;
  href: string;
}

/** "Which initiative is this conversation about?" — shown under the header and in list rows. */
export function InitiativeContextCard({ title, href }: InitiativeContextCardProps) {
  return (
    <div className="flex items-center gap-3 border-b border-dark/10 bg-primary/5 px-4 py-2.5">
      <Sprout className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
      <p className="min-w-0 flex-1 truncate text-sm text-dark/70">
        <span className="font-semibold">مبادرة: </span>
        <span className="font-bold text-dark">{title}</span>
      </p>
      <Link href={href} className="shrink-0 text-sm font-bold text-primary underline-offset-4 hover:underline">
        عرض المبادرة
      </Link>
    </div>
  );
}
