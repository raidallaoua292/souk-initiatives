import type { AvailabilityOption, CommitmentLevel, ParticipationRole } from "@/types";
import { AVAILABILITY_OPTIONS, COMMITMENT_OPTIONS, ROLES_REQUIRING_SKILLS } from "./constants";
import type { ApplicationDraft } from "./domain";

export const APPLICATION_LIMITS = {
  messageMin: 30,
  messageMax: 1000,
  infoMax: 1000,
  skillsMax: 10,
  skillLength: 30,
} as const;

export interface ApplicationFormValues {
  role: ParticipationRole | "";
  skills: string[];
  availability: AvailabilityOption | "";
  commitment: CommitmentLevel | "";
  message: string;
  supportingInfo: string;
}

export type ApplicationFormErrors = Partial<Record<keyof ApplicationFormValues, string>>;

export function emptyApplicationFormValues(role?: ParticipationRole): ApplicationFormValues {
  return {
    role: role ?? "",
    skills: [],
    availability: "",
    commitment: "",
    message: "",
    supportingInfo: "",
  };
}

export function validateApplicationForm(
  values: ApplicationFormValues,
  ctx: { offeredRoles: ParticipationRole[] },
): ApplicationFormErrors {
  const L = APPLICATION_LIMITS;
  const errors: ApplicationFormErrors = {};

  if (!values.role) errors.role = "اختر الدور الذي تريد المشاركة به.";
  else if (!ctx.offeredRoles.includes(values.role)) errors.role = "هذا الدور غير متاح في المبادرة.";

  if (values.role && ROLES_REQUIRING_SKILLS.includes(values.role) && values.skills.length === 0) {
    errors.skills = "أضف مهارة واحدة على الأقل ترتبط بهذا الدور.";
  } else if (values.skills.length > L.skillsMax) {
    errors.skills = `الحد الأقصى ${L.skillsMax} مهارات.`;
  }

  if (!values.availability) errors.availability = "حدد أوقات توفرك.";
  else if (!AVAILABILITY_OPTIONS.includes(values.availability)) errors.availability = "خيار التوفر غير صالح.";

  if (!values.commitment) errors.commitment = "حدد مستوى التزامك.";
  else if (!COMMITMENT_OPTIONS.includes(values.commitment)) errors.commitment = "خيار الالتزام غير صالح.";

  const message = values.message.trim();
  if (!message) errors.message = "اكتب رسالة تشرح دافعك للانضمام.";
  else if (message.length < L.messageMin) {
    errors.message = `الرسالة قصيرة جدًا (${L.messageMin} حرفًا على الأقل).`;
  } else if (message.length > L.messageMax) {
    errors.message = `الرسالة طويلة جدًا (${L.messageMax} حرفًا كحد أقصى).`;
  }

  if (values.supportingInfo.trim().length > L.infoMax) {
    errors.supportingInfo = `المعلومات طويلة جدًا (${L.infoMax} حرفًا كحد أقصى).`;
  }

  return errors;
}

/** Converts validated form values into the draft the domain layer accepts. */
export function toApplicationDraft(values: ApplicationFormValues): ApplicationDraft {
  if (!values.role || !values.availability || !values.commitment) {
    throw new Error("toApplicationDraft called with unvalidated values");
  }
  return {
    role: values.role,
    skills: values.skills,
    availability: values.availability,
    commitment: values.commitment,
    message: values.message.trim(),
    supportingInfo: values.supportingInfo.trim() || undefined,
  };
}
