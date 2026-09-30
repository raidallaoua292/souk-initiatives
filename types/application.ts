import type { InitiativeWithRelations } from "./initiative";
import type { ParticipationRole } from "./participation";
import type { User } from "./user";

export const ApplicationStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  WITHDRAWN: "WITHDRAWN",
} as const;

export type ApplicationStatus = (typeof ApplicationStatus)[keyof typeof ApplicationStatus];

/** When the applicant can contribute. */
export const AvailabilityOption = {
  WEEKDAY_EVENINGS: "WEEKDAY_EVENINGS",
  WEEKENDS: "WEEKENDS",
  CAMPAIGN_DAYS: "CAMPAIGN_DAYS",
  FLEXIBLE: "FLEXIBLE",
} as const;

export type AvailabilityOption = (typeof AvailabilityOption)[keyof typeof AvailabilityOption];

/** How much the applicant commits to. */
export const CommitmentLevel = {
  ONE_TIME: "ONE_TIME",
  UNDER_2H: "UNDER_2H",
  H2_TO_5: "H2_TO_5",
  H5_TO_10: "H5_TO_10",
  OVER_10H: "OVER_10H",
  AS_NEEDED: "AS_NEEDED",
} as const;

export type CommitmentLevel = (typeof CommitmentLevel)[keyof typeof CommitmentLevel];

/** Who ended an accepted membership / withdrew the application. */
export type WithdrawnBy = "APPLICANT" | "OWNER";

/**
 * Normalized application record (foreign keys only) — the shape a future
 * `Application` Prisma model would have.
 */
export interface Application {
  id: string;
  initiativeId: string;
  applicantId: string;
  role: ParticipationRole;
  /** Skills the applicant offers for this role. */
  skills: string[];
  availability: AvailabilityOption;
  commitment: CommitmentLevel;
  /** Motivation / message to the organizer. */
  message: string;
  supportingInfo?: string;
  status: ApplicationStatus;
  /** ISO date-times. */
  submittedAt: string;
  updatedAt: string;
  /** Set when the owner accepts or rejects. */
  reviewedAt?: string;
  reviewedById?: string;
  /** Owner's note; required when rejecting. Also used as the removal reason. */
  reviewNote?: string;
  /** Set when status becomes WITHDRAWN. */
  withdrawnAt?: string;
  withdrawnBy?: WithdrawnBy;
}

/** View-model with the initiative and applicant resolved, ready to render. */
export interface ApplicationWithRelations extends Application {
  initiative: InitiativeWithRelations;
  applicant: User;
}
