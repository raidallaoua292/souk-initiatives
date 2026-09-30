import type { InitiativeStatus } from "@/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<InitiativeStatus, { label: string; className: string }> = {
  active: { label: "قائمة حاليًا", className: "bg-primary/10 text-primary" },
  upcoming: { label: "قادمة قريبًا", className: "bg-accent/10 text-accent-dark" },
  completed: { label: "منجزة", className: "bg-dark/10 text-dark" },
  paused: { label: "متوقفة مؤقتًا", className: "bg-red-100 text-red-700" },
};

interface StatusBadgeProps {
  status: InitiativeStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold",
        config.className,
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {config.label}
    </span>
  );
}

export function statusLabel(status: InitiativeStatus): string {
  return statusConfig[status].label;
}
