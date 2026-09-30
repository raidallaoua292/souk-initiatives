import { ApplicationStatus } from "@/types";
import { STATUS_LABELS } from "@/lib/applications";
import { cn } from "@/lib/utils";

const statusClassName: Record<ApplicationStatus, string> = {
  PENDING: "bg-accent/10 text-accent-dark",
  ACCEPTED: "bg-primary/10 text-primary",
  REJECTED: "bg-red-100 text-red-700",
  WITHDRAWN: "bg-dark/10 text-dark",
};

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

/** Same visual language as the initiative StatusBadge, for application status. */
export function ApplicationStatusBadge({ status, className }: ApplicationStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold",
        statusClassName[status],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  );
}
