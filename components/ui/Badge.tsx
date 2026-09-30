import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

export function Badge({ children, className, icon }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-dark/5 px-3 py-1 text-xs font-semibold text-dark",
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
