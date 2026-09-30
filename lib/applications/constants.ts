import {
  ApplicationStatus,
  AvailabilityOption,
  CommitmentLevel,
  ParticipationRole,
  type InitiativeNeedType,
} from "@/types";

/** Singular labels, used on badges (an application is "مقبول"). */
export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  PENDING: "قيد المراجعة",
  ACCEPTED: "مقبول",
  REJECTED: "مرفوض",
  WITHDRAWN: "مسحوب",
};

/** Plural labels, used on filters ("الطلبات المقبولة"). */
export const STATUS_FILTER_LABELS: Record<ApplicationStatus | "ALL", string> = {
  ALL: "الكل",
  PENDING: "قيد المراجعة",
  ACCEPTED: "المقبولة",
  REJECTED: "المرفوضة",
  WITHDRAWN: "المسحوبة",
};

export const STATUS_ORDER: readonly ApplicationStatus[] = [
  ApplicationStatus.PENDING,
  ApplicationStatus.ACCEPTED,
  ApplicationStatus.REJECTED,
  ApplicationStatus.WITHDRAWN,
];

export const ROLE_LABELS: Record<ParticipationRole, string> = {
  VOLUNTEER: "متطوع",
  EXPERT: "خبير / مستشار",
  PARTNER: "شريك",
  SUPPORTER: "داعم",
};

export const ROLE_DESCRIPTIONS: Record<ParticipationRole, string> = {
  VOLUNTEER: "تشارك بوقتك وجهدك في الأنشطة الميدانية.",
  EXPERT: "تقدّم خبرتك أو استشارتك أو تكوينك للفريق.",
  PARTNER: "تمثّل جمعية أو مؤسسة وتقترح شراكة.",
  SUPPORTER: "تدعم بالتمويل أو المعدات أو التبرعات.",
};

export const ROLE_ORDER: readonly ParticipationRole[] = [
  ParticipationRole.VOLUNTEER,
  ParticipationRole.EXPERT,
  ParticipationRole.PARTNER,
  ParticipationRole.SUPPORTER,
];

export const AVAILABILITY_LABELS: Record<AvailabilityOption, string> = {
  WEEKDAY_EVENINGS: "أيام الأسبوع مساءً",
  WEEKENDS: "عطل نهاية الأسبوع",
  CAMPAIGN_DAYS: "أيام الحملات والفعاليات فقط",
  FLEXIBLE: "مرنة حسب الحاجة",
};

export const COMMITMENT_LABELS: Record<CommitmentLevel, string> = {
  ONE_TIME: "مساهمة لمرة واحدة",
  UNDER_2H: "أقل من ساعتين أسبوعيًا",
  H2_TO_5: "من 2 إلى 5 ساعات أسبوعيًا",
  H5_TO_10: "من 5 إلى 10 ساعات أسبوعيًا",
  OVER_10H: "أكثر من 10 ساعات أسبوعيًا",
  AS_NEEDED: "حسب الحاجة والاتفاق",
};

export const AVAILABILITY_OPTIONS = Object.values(AvailabilityOption);
export const COMMITMENT_OPTIONS = Object.values(CommitmentLevel);

/** Which participation role a kind of need translates into. */
export const NEED_TYPE_TO_ROLE: Record<InitiativeNeedType, ParticipationRole> = {
  volunteers: ParticipationRole.VOLUNTEER,
  skills: ParticipationRole.EXPERT,
  partnership: ParticipationRole.PARTNER,
  donations: ParticipationRole.SUPPORTER,
  equipment: ParticipationRole.SUPPORTER,
};

export const DEFAULT_COMMITMENT_TEXT: Record<ParticipationRole, string> = {
  VOLUNTEER: "حوالي 4 ساعات أسبوعيًا (حسب توفرك)",
  EXPERT: "جلسة استشارية أو تكوينية دورية",
  PARTNER: "اتفاقية شراكة وتنسيق دوري",
  SUPPORTER: "مساهمة لمرة واحدة أو دورية حسب إمكانياتك",
};

/** Roles whose applicants must list relevant skills. */
export const ROLES_REQUIRING_SKILLS: readonly ParticipationRole[] = [
  ParticipationRole.VOLUNTEER,
  ParticipationRole.EXPERT,
];
