import type { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
}

/** One statistic. Render inside a <ul>. */
export function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <li className="flex items-center gap-4 rounded-2xl border border-dark/10 bg-white p-5">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </span>
      <div>
        <p className="text-2xl font-extrabold text-dark">{value}</p>
        <p className="text-xs font-medium text-dark/60">{label}</p>
      </div>
    </li>
  );
}
