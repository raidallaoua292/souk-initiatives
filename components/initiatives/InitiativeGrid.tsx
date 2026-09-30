import { SearchX } from "lucide-react";
import type { InitiativeWithRelations } from "@/types";
import { InitiativeCard } from "./InitiativeCard";

interface InitiativeGridProps {
  initiatives: InitiativeWithRelations[];
  emptyMessage?: string;
}

export function InitiativeGrid({
  initiatives,
  emptyMessage = "لا توجد مبادرات مطابقة لبحثك حاليًا.",
}: InitiativeGridProps) {
  if (initiatives.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-dark/20 bg-white/50 py-16 text-center">
        <SearchX className="h-10 w-10 text-dark/30" aria-hidden="true" />
        <p className="text-sm font-medium text-dark/60">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {initiatives.map((initiative) => (
        <InitiativeCard key={initiative.id} initiative={initiative} />
      ))}
    </div>
  );
}
