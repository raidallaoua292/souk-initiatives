import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-dark/20 bg-white/60 px-6 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </span>
      <h2 className="text-lg font-bold text-dark">{title}</h2>
      <p className="max-w-md text-sm leading-relaxed text-dark/70">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
