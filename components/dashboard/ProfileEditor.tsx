"use client";

import { useMemo, useState, type FormEvent } from "react";
import { RotateCcw } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { FieldShell, SelectField, TextAreaField, TextField, describedBy } from "@/components/forms/fields";
import { ImageField } from "@/components/forms/ImageField";
import { TagInput } from "@/components/forms/TagInput";
import {
  PROFILE_LIMITS,
  userToProfileFormValues,
  validateProfileForm,
  type ProfileFormErrors,
  type ProfileFormValues,
} from "@/lib/forms/profile-form";
import { TEMPORARY_DATA_NOTE, useMockStore } from "@/lib/store";

const FIELD_ORDER: ReadonlyArray<keyof ProfileFormValues> = [
  "name",
  "bio",
  "wilayaSlug",
  "skills",
  "interests",
  "avatarUrl",
];

const fieldId = (name: keyof ProfileFormValues) => `profile-${name}`;
const SKILLS_HINT = "اكتب مهارة ثم اضغط Enter أو الفاصلة لإضافتها.";
const INTERESTS_HINT = "المواضيع التي تحب المساهمة فيها.";

function TagList({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="flex flex-wrap justify-center gap-1.5">
      {items.map((item) => (
        <li key={item} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function ProfileEditor() {
  const { currentUser, wilayas, updateProfile } = useMockStore();
  const savedValues = useMemo(() => userToProfileFormValues(currentUser), [currentUser]);

  const [values, setValues] = useState<ProfileFormValues>(savedValues);
  const [attempted, setAttempted] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const wilayaSlugs = useMemo(() => wilayas.map((w) => w.slug), [wilayas]);
  const wilayaOptions = useMemo(() => wilayas.map((w) => ({ value: w.slug, label: w.name })), [wilayas]);
  const errors: ProfileFormErrors = useMemo(
    () => (attempted ? validateProfileForm(values, wilayaSlugs) : {}),
    [attempted, values, wilayaSlugs],
  );
  const isDirty = useMemo(() => JSON.stringify(values) !== JSON.stringify(savedValues), [values, savedValues]);
  const errorCount = Object.keys(errors).length;
  const wilayaName = wilayas.find((w) => w.slug === values.wilayaSlug)?.name;

  function update<K extends keyof ProfileFormValues>(key: K, value: ProfileFormValues[K]) {
    setValues((previous) => ({ ...previous, [key]: value }));
    setJustSaved(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);
    const found = validateProfileForm(values, wilayaSlugs);
    const firstInvalid = FIELD_ORDER.find((name) => found[name]);
    if (firstInvalid) {
      document.getElementById(fieldId(firstInvalid))?.focus();
      return;
    }
    updateProfile(values);
    setJustSaved(true);
  }

  function handleDiscard() {
    setValues(savedValues);
    setAttempted(false);
    setJustSaved(false);
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold text-dark">الملف الشخصي</h1>
        <p className="mt-1 text-sm text-dark/70">
          عدّل بياناتك التعريفية. الحساب تجريبي، والتغييرات مؤقتة.
        </p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[16rem_1fr]">
        <section
          aria-label="معاينة الملف الشخصي"
          className="flex flex-col items-center gap-3 self-start rounded-2xl border border-dark/10 bg-white p-6 text-center"
        >
          <Avatar name={values.name || "؟"} colorClass={currentUser.avatarColor} src={values.avatarUrl} size="lg" />
          <div>
            <p className="font-bold text-dark">{values.name.trim() || "اسمك هنا"}</p>
            {wilayaName && <p className="text-xs text-dark/60">{wilayaName}</p>}
          </div>
          {values.bio.trim() && <p className="text-sm leading-relaxed text-dark/70">{values.bio}</p>}
          <TagList items={values.skills} />
        </section>

        <form onSubmit={handleSubmit} noValidate className="space-y-5 rounded-2xl border border-dark/10 bg-white p-5 sm:p-6">
          <TextField
            id={fieldId("name")}
            label="الاسم الكامل"
            required
            value={values.name}
            onChange={(v) => update("name", v)}
            error={errors.name}
            maxLength={PROFILE_LIMITS.nameMax}
          />
          <TextAreaField
            id={fieldId("bio")}
            label="نبذة عنك"
            rows={4}
            value={values.bio}
            onChange={(v) => update("bio", v)}
            error={errors.bio}
            maxLength={PROFILE_LIMITS.bioMax}
            showCount
            placeholder="عرّف الآخرين بنفسك وبخبراتك"
          />
          <SelectField
            id={fieldId("wilayaSlug")}
            label="الولاية"
            required
            value={values.wilayaSlug}
            onChange={(v) => update("wilayaSlug", v)}
            options={wilayaOptions}
            error={errors.wilayaSlug}
            placeholder="اختر ولايتك"
          />

          <FieldShell id={fieldId("skills")} label="المهارات" hint={SKILLS_HINT} error={errors.skills}>
            <TagInput
              id={fieldId("skills")}
              value={values.skills}
              onChange={(v) => update("skills", v)}
              maxTags={PROFILE_LIMITS.tagsMax}
              maxLength={PROFILE_LIMITS.tagLength}
              placeholder="مثال: تصميم، تنسيق ميداني"
              invalid={Boolean(errors.skills)}
              describedBy={describedBy(fieldId("skills"), SKILLS_HINT, errors.skills)}
            />
          </FieldShell>

          <FieldShell id={fieldId("interests")} label="الاهتمامات" hint={INTERESTS_HINT} error={errors.interests}>
            <TagInput
              id={fieldId("interests")}
              value={values.interests}
              onChange={(v) => update("interests", v)}
              maxTags={PROFILE_LIMITS.tagsMax}
              maxLength={PROFILE_LIMITS.tagLength}
              placeholder="مثال: البيئة، التعليم"
              invalid={Boolean(errors.interests)}
              describedBy={describedBy(fieldId("interests"), INTERESTS_HINT, errors.interests)}
            />
          </FieldShell>

          <ImageField
            id={fieldId("avatarUrl")}
            label="الصورة الشخصية"
            value={values.avatarUrl}
            onChange={(v) => update("avatarUrl", v)}
            error={errors.avatarUrl}
            preview={<Avatar name={values.name || "؟"} colorClass={currentUser.avatarColor} src={values.avatarUrl} size="lg" />}
          />

          {attempted && errorCount > 0 && (
            <Alert tone="error">
              {errorCount === 1
                ? "يوجد حقل واحد يحتاج إلى تصحيح."
                : `يوجد ${errorCount} حقول تحتاج إلى تصحيح.`}
            </Alert>
          )}
          {justSaved && (
            <Alert tone="success">
              تم حفظ التغييرات. {TEMPORARY_DATA_NOTE}
            </Alert>
          )}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" size="lg">
              حفظ التغييرات
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleDiscard}
              disabled={!isDirty}
              icon={<RotateCcw className="h-4 w-4" aria-hidden="true" />}
            >
              تجاهل التغييرات
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
