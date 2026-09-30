import { createElement } from "react";
import { HandHeart, Wallet, Wrench, GraduationCap, Handshake, type LucideIcon } from "lucide-react";
import type { InitiativeNeed, InitiativeNeedType } from "@/types";
import { formatNumber, needProgress } from "@/lib/utils";

const needTypeConfig: Record<InitiativeNeedType, { label: string; icon: LucideIcon }> = {
  volunteers: { label: "متطوعون", icon: HandHeart },
  donations: { label: "تبرعات", icon: Wallet },
  equipment: { label: "معدات", icon: Wrench },
  skills: { label: "مهارات وخبرات", icon: GraduationCap },
  partnership: { label: "شراكات", icon: Handshake },
};

interface NeedsListProps {
  needs: InitiativeNeed[];
}

export function NeedsList({ needs }: NeedsListProps) {
  if (needs.length === 0) return null;

  return (
    <ul className="flex flex-col gap-4">
      {needs.map((need) => {
        const config = needTypeConfig[need.type];
        const hasQuantities =
          typeof need.quantityNeeded === "number" && typeof need.quantityFulfilled === "number";
        const progress = hasQuantities
          ? needProgress(need.quantityFulfilled, need.quantityNeeded)
          : null;

        return (
          <li key={need.id} className="rounded-2xl border border-dark/10 bg-white p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {createElement(config.icon, { className: "h-5 w-5", "aria-hidden": true })}
              </span>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-bold text-dark">{need.title}</h3>
                  <span className="rounded-full bg-dark/5 px-2.5 py-0.5 text-xs font-semibold text-dark/60">
                    {config.label}
                  </span>
                </div>
                {need.description && (
                  <p className="mt-1.5 text-sm leading-relaxed text-dark/70">{need.description}</p>
                )}

                {hasQuantities && progress !== null && (
                  <div className="mt-3">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-dark/10">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-xs font-medium text-dark/60">
                      {formatNumber(need.quantityFulfilled ?? 0)} من{" "}
                      {formatNumber(need.quantityNeeded ?? 0)} {need.unit} ({progress}٪)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
