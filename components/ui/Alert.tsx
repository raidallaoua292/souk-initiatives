import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertTone = "success" | "info" | "error";

const toneConfig = {
  success: { className: "border-primary/30 bg-primary/10 text-primary-dark", Icon: CheckCircle2 },
  info: { className: "border-accent/30 bg-accent/10 text-accent-dark", Icon: Info },
  error: { className: "border-red-200 bg-red-50 text-red-800", Icon: AlertCircle },
} as const;

interface AlertProps {
  tone?: AlertTone;
  children: ReactNode;
  /** Optional trailing action, e.g. a link. */
  action?: ReactNode;
  onDismiss?: () => void;
  /** Set to `false` when an ancestor is already an aria-live region. */
  announce?: boolean;
  className?: string;
}

export function Alert({ tone = "info", children, action, onDismiss, announce = true, className }: AlertProps) {
  const { className: toneClassName, Icon } = toneConfig[tone];

  return (
    <div
      role={announce ? (tone === "error" ? "alert" : "status") : undefined}
      className={cn("flex items-start gap-3 rounded-xl border px-4 py-3 text-sm", toneClassName, className)}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div className="flex-1 leading-relaxed">
        {children}
        {action && <div className="mt-1.5 font-bold">{action}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="إغلاق التنبيه"
          className="shrink-0 rounded-md p-0.5 opacity-70 hover:opacity-100"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
