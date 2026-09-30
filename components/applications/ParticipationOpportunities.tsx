import { Clock3 } from "lucide-react";
import type { ParticipationOpportunity } from "@/types";
import { ROLE_ORDER } from "@/lib/applications";
import { RoleBadge } from "./RoleBadge";

/** The ways someone can take part in an initiative: role, what's needed, expected commitment. */
export function ParticipationOpportunities({ opportunities }: { opportunities: ParticipationOpportunity[] }) {
  if (opportunities.length === 0) return null;
  const sorted = [...opportunities].sort((a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role));

  return (
    <section aria-labelledby="opportunities-heading">
      <h2 id="opportunities-heading" className="mb-3 text-lg font-bold text-dark">
        فرص المشاركة
      </h2>
      <ul id="opportunities-list" className="grid gap-4 sm:grid-cols-2">
        {sorted.map((opportunity) => (
          <li key={opportunity.id} className="rounded-2xl border border-dark/10 bg-white p-4 sm:p-5">
            <RoleBadge role={opportunity.role} />
            <h3 className="mt-2 font-bold text-dark">{opportunity.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-dark/70">{opportunity.description}</p>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-dark/60">
              <Clock3 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {opportunity.commitment}
            </p>
            {opportunity.requiredSkills.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="المهارات المطلوبة">
                {opportunity.requiredSkills.map((skill) => (
                  <li key={skill} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    {skill}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
