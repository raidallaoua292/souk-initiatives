import type { InitiativeWithRelations } from "./initiative";
import type { ParticipationRole } from "./participation";
import type { User } from "./user";

/** A member as shown in the public people directory. */
export interface PersonSummary {
  user: User;
  wilayaName: string;
  /** Initiatives this person organizes. */
  initiativesCount: number;
  /** Initiatives where they are an accepted team member. */
  membershipsCount: number;
}

export interface PersonParticipation {
  initiative: InitiativeWithRelations;
  role: ParticipationRole;
}

/** Public profile: summary plus what the person organizes and takes part in. */
export interface PersonProfile extends PersonSummary {
  organized: InitiativeWithRelations[];
  participating: PersonParticipation[];
}
