import {
  ApplicationStatus,
  type Application,
  type ApplicationWithRelations,
  type AvailabilityOption,
  type CommitmentLevel,
  type Initiative,
  type ParticipationRole,
} from "@/types";
import { fail, ok, type Result } from "@/lib/result";
import { getOfferedRoles } from "./opportunities";

/* ------------------------------------------------------------------ */
/* Business rules for applications and team membership.                */
/* Everything here is pure: no React, no clock, no id generation —     */
/* callers pass `now` / ids in. The store only wires these up.         */
/* ------------------------------------------------------------------ */

export interface ApplicationDraft {
  role: ParticipationRole;
  skills: string[];
  availability: AvailabilityOption;
  commitment: CommitmentLevel;
  message: string;
  supportingInfo?: string;
}

export const REVIEW_NOTE_LIMITS = { rejectionMin: 5, max: 500 } as const;

/** An application is "active" while it is waiting or the person is on the team. */
export function isActiveApplication(application: Pick<Application, "status">): boolean {
  return (
    application.status === ApplicationStatus.PENDING ||
    application.status === ApplicationStatus.ACCEPTED
  );
}

export function findActiveApplication(
  applications: Application[],
  initiativeId: string,
  applicantId: string,
): Application | undefined {
  return applications.find(
    (a) => a.initiativeId === initiativeId && a.applicantId === applicantId && isActiveApplication(a),
  );
}

/** Initiative statuses that still accept new participants. */
const OPEN_STATUSES: ReadonlyArray<Initiative["status"]> = ["active", "upcoming"];

type JoinTarget = Pick<Initiative, "id" | "status" | "organizerId">;

export type JoinEligibility =
  | { canJoin: true }
  | { canJoin: false; reason: "OWNER" | "CLOSED" }
  | { canJoin: false; reason: "PENDING" | "ACCEPTED"; application: Application };

/** Can `userId` apply to `initiative` right now? Also explains why not. */
export function getJoinEligibility(input: {
  initiative: JoinTarget;
  userId: string;
  applications: Application[];
}): JoinEligibility {
  const { initiative, userId, applications } = input;

  if (initiative.organizerId === userId) return { canJoin: false, reason: "OWNER" };

  const active = findActiveApplication(applications, initiative.id, userId);
  if (active) {
    return {
      canJoin: false,
      reason: active.status === ApplicationStatus.ACCEPTED ? "ACCEPTED" : "PENDING",
      application: active,
    };
  }

  if (!OPEN_STATUSES.includes(initiative.status)) return { canJoin: false, reason: "CLOSED" };
  return { canJoin: true };
}

export function joinBlockedMessage(eligibility: Exclude<JoinEligibility, { canJoin: true }>): string {
  switch (eligibility.reason) {
    case "OWNER":
      return "أنت منظّم هذه المبادرة، لا يمكنك التقدّم إليها.";
    case "PENDING":
      return "لديك طلب قيد المراجعة لهذه المبادرة بالفعل. يمكنك سحبه أولًا إن أردت تقديم طلب جديد.";
    case "ACCEPTED":
      return "أنت عضو في فريق هذه المبادرة بالفعل.";
    case "CLOSED":
      return "باب الانضمام مغلق حاليًا لهذه المبادرة.";
  }
}

/** Creates a new PENDING application after enforcing every submission rule. */
export function submitApplication(input: {
  id: string;
  initiative: Pick<Initiative, "id" | "status" | "organizerId" | "needs" | "requiredSkills" | "opportunities">;
  applicantId: string;
  applications: Application[];
  draft: ApplicationDraft;
  now: string;
}): Result<Application> {
  const { id, initiative, applicantId, applications, draft, now } = input;

  const eligibility = getJoinEligibility({ initiative, userId: applicantId, applications });
  if (!eligibility.canJoin) return fail(joinBlockedMessage(eligibility));

  if (!getOfferedRoles(initiative).includes(draft.role)) {
    return fail("هذا الدور غير متاح في هذه المبادرة.");
  }

  return ok({
    id,
    initiativeId: initiative.id,
    applicantId,
    ...draft,
    status: ApplicationStatus.PENDING,
    submittedAt: now,
    updatedAt: now,
  });
}

/** The applicant withdraws their own pending application. */
export function withdrawApplication(
  application: Application,
  ctx: { userId: string; now: string },
): Result<Application> {
  if (application.applicantId !== ctx.userId) return fail("لا يمكنك سحب طلب مستخدم آخر.");
  if (application.status !== ApplicationStatus.PENDING) {
    return fail("يمكن سحب الطلبات قيد المراجعة فقط.");
  }
  return ok({
    ...application,
    status: ApplicationStatus.WITHDRAWN,
    withdrawnAt: ctx.now,
    withdrawnBy: "APPLICANT",
    updatedAt: ctx.now,
  });
}

export type ReviewDecision = "ACCEPT" | "REJECT";

/** Returns an error message if the note is unacceptable for this decision. */
export function validateReviewNote(decision: ReviewDecision, note: string): string | undefined {
  const trimmed = note.trim();
  if (trimmed.length > REVIEW_NOTE_LIMITS.max) {
    return `الملاحظة طويلة جدًا (${REVIEW_NOTE_LIMITS.max} حرفًا كحد أقصى).`;
  }
  if (decision === "REJECT" && trimmed.length < REVIEW_NOTE_LIMITS.rejectionMin) {
    return `سبب الرفض مطلوب (${REVIEW_NOTE_LIMITS.rejectionMin} أحرف على الأقل).`;
  }
  return undefined;
}

/**
 * The owner accepts or rejects a PENDING application. A reviewed application
 * can never be reviewed again, which is what stops a double accept.
 */
export function reviewApplication(
  application: Application,
  ctx: {
    decision: ReviewDecision;
    note: string;
    reviewerId: string;
    ownsInitiative: boolean;
    now: string;
  },
): Result<Application> {
  if (!ctx.ownsInitiative) return fail("لا تملك صلاحية مراجعة طلبات هذه المبادرة.");
  if (application.status !== ApplicationStatus.PENDING) {
    return fail("تمت مراجعة هذا الطلب مسبقًا ولا يمكن تغيير قراره.");
  }
  const noteError = validateReviewNote(ctx.decision, ctx.note);
  if (noteError) return fail(noteError);

  return ok({
    ...application,
    status: ctx.decision === "ACCEPT" ? ApplicationStatus.ACCEPTED : ApplicationStatus.REJECTED,
    reviewedAt: ctx.now,
    reviewedById: ctx.reviewerId,
    reviewNote: ctx.note.trim() || undefined,
    updatedAt: ctx.now,
  });
}

/** The owner changes the role of an accepted team member. */
export function changeMemberRole(
  application: Application,
  ctx: { role: ParticipationRole; ownsInitiative: boolean; now: string },
): Result<Application> {
  if (!ctx.ownsInitiative) return fail("لا تملك صلاحية إدارة فريق هذه المبادرة.");
  if (application.status !== ApplicationStatus.ACCEPTED) {
    return fail("يمكن تغيير دور الأعضاء المقبولين فقط.");
  }
  if (application.role === ctx.role) return fail("هذا هو دور العضو الحالي بالفعل.");
  return ok({ ...application, role: ctx.role, updatedAt: ctx.now });
}

/**
 * The owner removes an accepted member. The application ends as WITHDRAWN
 * (by the owner), which also frees the person to apply again.
 */
export function removeMember(
  application: Application,
  ctx: { ownsInitiative: boolean; now: string },
): Result<Application> {
  if (!ctx.ownsInitiative) return fail("لا تملك صلاحية إدارة فريق هذه المبادرة.");
  if (application.status !== ApplicationStatus.ACCEPTED) {
    return fail("يمكن إزالة الأعضاء المقبولين فقط.");
  }
  return ok({
    ...application,
    status: ApplicationStatus.WITHDRAWN,
    withdrawnAt: ctx.now,
    withdrawnBy: "OWNER",
    updatedAt: ctx.now,
  });
}

/** Team-size change caused by a status transition: +1 on joining, -1 on leaving. */
export function membersDelta(before: ApplicationStatus, after: ApplicationStatus): number {
  const wasMember = before === ApplicationStatus.ACCEPTED;
  const isMember = after === ApplicationStatus.ACCEPTED;
  if (!wasMember && isMember) return 1;
  if (wasMember && !isMember) return -1;
  return 0;
}

/* ------------------------------ Selectors ------------------------------ */

export interface ApplicationFilters {
  status: ApplicationStatus | "ALL";
  role: ParticipationRole | "ALL";
  query: string;
}

/** Lower-cases and folds common Arabic letter variants so searches are forgiving. */
export function normalizeSearchText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[ً-ٰٟـ]/g, "") // tashkeel + tatweel
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/\s+/g, " ")
    .trim();
}

export function filterApplications(
  applications: ApplicationWithRelations[],
  filters: ApplicationFilters,
): ApplicationWithRelations[] {
  const needle = normalizeSearchText(filters.query);

  return applications.filter((application) => {
    if (filters.status !== "ALL" && application.status !== filters.status) return false;
    if (filters.role !== "ALL" && application.role !== filters.role) return false;
    if (needle) {
      const haystack = normalizeSearchText(
        [application.applicant.name, ...application.skills, application.message].join(" "),
      );
      if (!haystack.includes(needle)) return false;
    }
    return true;
  });
}

export function countByStatus(
  applications: Pick<Application, "status">[],
): Record<ApplicationStatus | "ALL", number> {
  const counts: Record<ApplicationStatus | "ALL", number> = {
    ALL: applications.length,
    PENDING: 0,
    ACCEPTED: 0,
    REJECTED: 0,
    WITHDRAWN: 0,
  };
  for (const application of applications) counts[application.status] += 1;
  return counts;
}

export function byNewestSubmitted<T extends Pick<Application, "submittedAt">>(a: T, b: T): number {
  return b.submittedAt.localeCompare(a.submittedAt);
}

/** Team = accepted applications, oldest acceptance first. Membership is derived, so it can't drift. */
export function getTeamMembers(applications: ApplicationWithRelations[]): ApplicationWithRelations[] {
  return applications
    .filter((application) => application.status === ApplicationStatus.ACCEPTED)
    .sort((a, b) => (a.reviewedAt ?? a.submittedAt).localeCompare(b.reviewedAt ?? b.submittedAt));
}
