import type { User } from "@/types";
import { validateImageSource } from "./validators";

export const PROFILE_LIMITS = {
  nameMin: 3,
  nameMax: 60,
  bioMax: 300,
  tagsMax: 12,
  tagLength: 30,
} as const;

export interface ProfileFormValues {
  name: string;
  bio: string;
  wilayaSlug: string;
  skills: string[];
  interests: string[];
  avatarUrl: string;
}

export type ProfileFormErrors = Partial<Record<keyof ProfileFormValues, string>>;

export function userToProfileFormValues(user: User): ProfileFormValues {
  return {
    name: user.name,
    bio: user.bio ?? "",
    wilayaSlug: user.wilayaSlug,
    skills: user.skills ?? [],
    interests: user.interests ?? [],
    avatarUrl: user.avatarUrl ?? "",
  };
}

export function validateProfileForm(
  values: ProfileFormValues,
  wilayaSlugs: string[],
): ProfileFormErrors {
  const L = PROFILE_LIMITS;
  const errors: ProfileFormErrors = {};

  const name = values.name.trim();
  if (!name) errors.name = "الاسم الكامل مطلوب.";
  else if (name.length < L.nameMin) errors.name = `الاسم قصير جدًا (${L.nameMin} أحرف على الأقل).`;
  else if (name.length > L.nameMax) errors.name = `الاسم طويل جدًا (${L.nameMax} حرفًا كحد أقصى).`;

  if (values.bio.trim().length > L.bioMax) errors.bio = `النبذة طويلة جدًا (${L.bioMax} حرفًا كحد أقصى).`;

  if (!values.wilayaSlug) errors.wilayaSlug = "اختر ولايتك.";
  else if (!wilayaSlugs.includes(values.wilayaSlug)) errors.wilayaSlug = "الولاية المختارة غير صالحة.";

  if (values.skills.length > L.tagsMax) errors.skills = `الحد الأقصى ${L.tagsMax} مهارة.`;
  if (values.interests.length > L.tagsMax) errors.interests = `الحد الأقصى ${L.tagsMax} اهتمامًا.`;

  const imageError = validateImageSource(values.avatarUrl);
  if (imageError) errors.avatarUrl = imageError;

  return errors;
}

export function applyProfileValues(user: User, values: ProfileFormValues): User {
  return {
    ...user,
    name: values.name.trim(),
    bio: values.bio.trim() || undefined,
    wilayaSlug: values.wilayaSlug,
    skills: values.skills,
    interests: values.interests,
    avatarUrl: values.avatarUrl.trim() || undefined,
  };
}
