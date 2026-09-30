import type { ParticipationRole } from "@/types";
import { ROLE_LABELS } from "@/lib/applications";
import { cn } from "@/lib/utils";

const roleClassName: Record<ParticipationRole, string> = {
  VOLUNTEER: "bg-primary/10 text-primary",
  EXPERT: "bg-accent/10 text-accent-dark",
  PARTNER: "bg-dark/10 text-dark",
  SUPPORTER: "border border-primary/30 bg-white text-primary",
};

export function RoleBadge({ role, className }: { role: ParticipationRole; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold",
        roleClassName[role],
        className,
      )}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}
