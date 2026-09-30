/**
 * How someone can take part in an initiative.
 * Declared as a const object + union type (an "enum-like" pattern) so call
 * sites can write `ParticipationRole.VOLUNTEER` while the values stay plain
 * strings that map 1:1 onto a future Prisma enum.
 */
export const ParticipationRole = {
  VOLUNTEER: "VOLUNTEER",
  EXPERT: "EXPERT",
  PARTNER: "PARTNER",
  SUPPORTER: "SUPPORTER",
} as const;

export type ParticipationRole = (typeof ParticipationRole)[keyof typeof ParticipationRole];

/** A concrete way to take part, published by an initiative. */
export interface ParticipationOpportunity {
  id: string;
  role: ParticipationRole;
  title: string;
  description: string;
  requiredSkills: string[];
  /** Human-readable expected commitment, e.g. "4 ساعات أسبوعيًا". */
  commitment: string;
}
