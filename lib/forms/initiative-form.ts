import type { Initiative, InitiativeNeed, InitiativeNeedType, InitiativeStatus } from "@/types";
import { isValidIsoDate, validateImageSource } from "./validators";

/* ------------------------------------------------------------------ */
/* Constants                                                            */
/* ------------------------------------------------------------------ */

export const INITIATIVE_LIMITS = {
  titleMin: 5,
  titleMax: 100,
  summaryMin: 20,
  summaryMax: 140,
  descriptionMin: 60,
  descriptionMax: 3000,
  audienceMin: 3,
  audienceMax: 200,
  goalMax: 200,
  goalsMax: 8,
  skillsMax: 15,
  skillLength: 30,
} as const;

/**
 * The "required support" checkboxes. Values reuse the existing
 * `InitiativeNeedType` so no parallel type is introduced:
 * funding → donations, experts → skills, partners → partnership.
 */
export const SUPPORT_OPTIONS: ReadonlyArray<{
  value: InitiativeNeedType;
  label: string;
  description: string;
}> = [
  { value: "volunteers", label: "متطوعون", description: "أشخاص يشاركون بوقتهم وجهدهم" },
  { value: "donations", label: "تمويل", description: "دعم مالي أو تبرعات" },
  { value: "equipment", label: "معدات", description: "أجهزة أو أدوات أو مستلزمات" },
  { value: "skills", label: "خبراء", description: "مختصون يقدمون استشارة أو تكوينًا" },
  { value: "partnership", label: "شركاء", description: "جمعيات أو مؤسسات أو هيئات" },
];

export const INITIATIVE_STATUSES: readonly InitiativeStatus[] = [
  "active",
  "upcoming",
  "completed",
  "paused",
];

/* ------------------------------------------------------------------ */
/* Form values                                                          */
/* ------------------------------------------------------------------ */

export interface InitiativeFormValues {
  title: string;
  summary: string;
  description: string;
  categorySlug: string;
  wilayaSlug: string;
  targetAudience: string;
  /** One goal per line. */
  goals: string;
  supportTypes: InitiativeNeedType[];
  requiredSkills: string[];
  /** ISO `YYYY-MM-DD`. */
  startDate: string;
  coverImage: string;
  /** Only editable in "edit" mode; on create it is derived from `startDate`. */
  status: InitiativeStatus;
}

export type InitiativeFormErrors = Partial<Record<keyof InitiativeFormValues, string>>;

export function emptyInitiativeFormValues(): InitiativeFormValues {
  return {
    title: "",
    summary: "",
    description: "",
    categorySlug: "",
    wilayaSlug: "",
    targetAudience: "",
    goals: "",
    supportTypes: [],
    requiredSkills: [],
    startDate: "",
    coverImage: "",
    status: "upcoming",
  };
}

export function parseGoals(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function initiativeToFormValues(initiative: Initiative): InitiativeFormValues {
  return {
    title: initiative.title,
    summary: initiative.shortDescription,
    description: initiative.description,
    categorySlug: initiative.categorySlug,
    wilayaSlug: initiative.wilayaSlug,
    targetAudience: initiative.targetAudience ?? "",
    goals: (initiative.goals ?? []).join("\n"),
    supportTypes: Array.from(new Set(initiative.needs.map((need) => need.type))),
    requiredSkills: initiative.requiredSkills ?? [],
    startDate: initiative.startDate ?? initiative.createdAt,
    coverImage: initiative.coverImage ?? "",
    status: initiative.status,
  };
}

/* ------------------------------------------------------------------ */
/* Validation                                                           */
/* ------------------------------------------------------------------ */

export interface InitiativeValidationContext {
  categorySlugs: string[];
  wilayaSlugs: string[];
  /** Today as `YYYY-MM-DD`, injected so validation stays pure. */
  today: string;
  /** Edit mode keeps an already-past start date valid if it wasn't changed. */
  allowPastStartDate: boolean;
}

export function validateInitiativeForm(
  values: InitiativeFormValues,
  ctx: InitiativeValidationContext,
): InitiativeFormErrors {
  const L = INITIATIVE_LIMITS;
  const errors: InitiativeFormErrors = {};

  const title = values.title.trim();
  if (!title) errors.title = "عنوان المبادرة مطلوب.";
  else if (title.length < L.titleMin) errors.title = `العنوان قصير جدًا (${L.titleMin} أحرف على الأقل).`;
  else if (title.length > L.titleMax) errors.title = `العنوان طويل جدًا (${L.titleMax} حرفًا كحد أقصى).`;

  const summary = values.summary.trim();
  if (!summary) errors.summary = "الملخص القصير مطلوب.";
  else if (summary.length < L.summaryMin) errors.summary = `الملخص قصير جدًا (${L.summaryMin} حرفًا على الأقل).`;
  else if (summary.length > L.summaryMax) errors.summary = `الملخص طويل جدًا (${L.summaryMax} حرفًا كحد أقصى).`;

  const description = values.description.trim();
  if (!description) errors.description = "الوصف التفصيلي مطلوب.";
  else if (description.length < L.descriptionMin) {
    errors.description = `الوصف قصير جدًا (${L.descriptionMin} حرفًا على الأقل).`;
  } else if (description.length > L.descriptionMax) {
    errors.description = `الوصف طويل جدًا (${L.descriptionMax} حرفًا كحد أقصى).`;
  }

  if (!values.categorySlug) errors.categorySlug = "اختر تصنيف المبادرة.";
  else if (!ctx.categorySlugs.includes(values.categorySlug)) errors.categorySlug = "التصنيف المختار غير صالح.";

  if (!values.wilayaSlug) errors.wilayaSlug = "اختر ولاية المبادرة.";
  else if (!ctx.wilayaSlugs.includes(values.wilayaSlug)) errors.wilayaSlug = "الولاية المختارة غير صالحة.";

  const audience = values.targetAudience.trim();
  if (!audience) errors.targetAudience = "حدد الفئة المستهدفة.";
  else if (audience.length < L.audienceMin) errors.targetAudience = "الوصف قصير جدًا.";
  else if (audience.length > L.audienceMax) errors.targetAudience = `الحد الأقصى ${L.audienceMax} حرفًا.`;

  const goals = parseGoals(values.goals);
  if (goals.length === 0) errors.goals = "أضف هدفًا واحدًا على الأقل.";
  else if (goals.length > L.goalsMax) errors.goals = `الحد الأقصى ${L.goalsMax} أهداف.`;
  else if (goals.some((goal) => goal.length > L.goalMax)) {
    errors.goals = `يجب ألا يتجاوز كل هدف ${L.goalMax} حرفًا.`;
  }

  if (values.supportTypes.length === 0) errors.supportTypes = "اختر نوعًا واحدًا على الأقل من الدعم المطلوب.";

  if (values.requiredSkills.length > L.skillsMax) errors.requiredSkills = `الحد الأقصى ${L.skillsMax} مهارة.`;

  if (!values.startDate) errors.startDate = "حدد تاريخ البدء المتوقع.";
  else if (!isValidIsoDate(values.startDate)) errors.startDate = "أدخل تاريخًا صحيحًا.";
  else if (!ctx.allowPastStartDate && values.startDate < ctx.today) {
    errors.startDate = "لا يمكن أن يكون تاريخ البدء في الماضي.";
  }

  const imageError = validateImageSource(values.coverImage);
  if (imageError) errors.coverImage = imageError;

  if (!INITIATIVE_STATUSES.includes(values.status)) errors.status = "الحالة غير صالحة.";

  return errors;
}

/* ------------------------------------------------------------------ */
/* Mapping form values -> Initiative records                            */
/* ------------------------------------------------------------------ */

function supportLabel(type: InitiativeNeedType): string {
  return SUPPORT_OPTIONS.find((option) => option.value === type)?.label ?? type;
}

/**
 * Reconciles the selected support types with existing needs: needs whose type
 * is still selected are kept untouched (so quantities/progress survive edits),
 * unselected ones are dropped, and newly selected types get a fresh need.
 */
function reconcileNeeds(
  initiativeId: string,
  existing: InitiativeNeed[],
  selected: InitiativeNeedType[],
): InitiativeNeed[] {
  const kept = existing.filter((need) => selected.includes(need.type));
  const keptTypes = new Set(kept.map((need) => need.type));
  const added = selected
    .filter((type) => !keptTypes.has(type))
    .map<InitiativeNeed>((type) => ({
      id: `${initiativeId}-need-${type}`,
      type,
      title: supportLabel(type),
    }));
  return [...kept, ...added];
}

function commonFields(values: InitiativeFormValues) {
  return {
    title: values.title.trim(),
    shortDescription: values.summary.trim(),
    description: values.description.trim(),
    categorySlug: values.categorySlug,
    wilayaSlug: values.wilayaSlug,
    targetAudience: values.targetAudience.trim(),
    goals: parseGoals(values.goals),
    requiredSkills: values.requiredSkills,
    startDate: values.startDate,
    coverImage: values.coverImage.trim() || undefined,
  };
}

export interface CreateRecordContext {
  id: string;
  organizerId: string;
  categoryName: string;
  today: string;
}

/** Builds a brand-new normalized `Initiative` from validated form values. */
export function createInitiativeRecord(
  values: InitiativeFormValues,
  ctx: CreateRecordContext,
): Initiative {
  return {
    ...commonFields(values),
    id: ctx.id,
    slug: ctx.id,
    status: values.startDate > ctx.today ? "upcoming" : "active",
    organizerId: ctx.organizerId,
    membersCount: 1,
    needs: reconcileNeeds(ctx.id, [], values.supportTypes),
    tags: [ctx.categoryName],
    featured: false,
    createdAt: ctx.today,
    updatedAt: ctx.today,
  };
}

/** Applies validated form values on top of an existing initiative. */
export function updateInitiativeRecord(
  existing: Initiative,
  values: InitiativeFormValues,
  ctx: { today: string },
): Initiative {
  return {
    ...existing,
    ...commonFields(values),
    status: values.status,
    needs: reconcileNeeds(existing.id, existing.needs, values.supportTypes),
    updatedAt: ctx.today,
  };
}
