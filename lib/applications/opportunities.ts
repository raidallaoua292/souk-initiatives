import { ParticipationRole, type Initiative, type ParticipationOpportunity } from "@/types";
import { DEFAULT_COMMITMENT_TEXT, NEED_TYPE_TO_ROLE, ROLE_DESCRIPTIONS } from "./constants";

type OpportunitySource = Pick<Initiative, "id" | "needs" | "requiredSkills" | "opportunities">;

const SKILLED_ROLES: readonly ParticipationRole[] = [ParticipationRole.VOLUNTEER, ParticipationRole.EXPERT];

/**
 * The ways someone can take part in an initiative. Uses the initiative's
 * explicit `opportunities` when it has any; otherwise derives one opportunity
 * per role from its `needs`, so initiatives created in the dashboard (which
 * only pick support types) still offer sensible roles. Never returns an empty list.
 */
export function getOpportunities(initiative: OpportunitySource): ParticipationOpportunity[] {
  if (initiative.opportunities && initiative.opportunities.length > 0) {
    return initiative.opportunities;
  }

  const seen = new Set<ParticipationRole>();
  const derived: ParticipationOpportunity[] = [];

  for (const need of initiative.needs) {
    const role = NEED_TYPE_TO_ROLE[need.type];
    if (seen.has(role)) continue;
    seen.add(role);
    derived.push({
      id: `${initiative.id}-opp-${role.toLowerCase()}`,
      role,
      title: need.title,
      description: need.description ?? ROLE_DESCRIPTIONS[role],
      requiredSkills: SKILLED_ROLES.includes(role) ? (initiative.requiredSkills ?? []) : [],
      commitment: DEFAULT_COMMITMENT_TEXT[role],
    });
  }

  if (derived.length === 0) {
    derived.push({
      id: `${initiative.id}-opp-volunteer`,
      role: ParticipationRole.VOLUNTEER,
      title: "متطوع",
      description: ROLE_DESCRIPTIONS.VOLUNTEER,
      requiredSkills: initiative.requiredSkills ?? [],
      commitment: DEFAULT_COMMITMENT_TEXT.VOLUNTEER,
    });
  }

  return derived;
}

export function getOfferedRoles(initiative: OpportunitySource): ParticipationRole[] {
  return Array.from(new Set(getOpportunities(initiative).map((o) => o.role)));
}
