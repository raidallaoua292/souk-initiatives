"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import type { Category, Wilaya } from "@/types";
import {
  INITIATIVE_LIMITS,
  INITIATIVE_STATUSES,
  validateInitiativeForm,
  type InitiativeFormErrors,
  type InitiativeFormValues,
} from "@/lib/forms/initiative-form";
import { todayIsoDate } from "@/lib/utils";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { CoverImage } from "@/components/ui/CoverImage";
import { statusLabel } from "@/components/initiatives/StatusBadge";
import { FieldShell, SelectField, TextAreaField, TextField, describedBy } from "./fields";
import { ImageField } from "./ImageField";
import { SupportOptionsField } from "./SupportOptionsField";
import { TagInput } from "./TagInput";

/** Visual order of fields — used to focus the first invalid one on a failed submit. */
const FIELD_ORDER: ReadonlyArray<keyof InitiativeFormValues> = [
  "title",
  "summary",
  "description",
  "categorySlug",
  "wilayaSlug",
  "startDate",
  "status",
  "targetAudience",
  "goals",
  "supportTypes",
  "requiredSkills",
  "coverImage",
];

interface InitiativeEditorFormProps {
  mode: "create" | "edit";
  categories: Category[];
  wilayas: Wilaya[];
  initialValues: InitiativeFormValues;
  onSubmit: (values: InitiativeFormValues) => void;
  cancelHref: string;
}

function FormSection({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  const headingId = `section-${title.replace(/\s+/g, "-")}`;
  return (
    <section aria-labelledby={headingId} className="rounded-2xl border border-dark/10 bg-white p-5 sm:p-6">
      <h2 id={headingId} className="text-base font-extrabold text-dark">
        {title}
      </h2>
      {description && <p className="mt-1 text-sm text-dark/60">{description}</p>}
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

const SKILLS_HINT = "اختياري. اكتب مهارة ثم اضغط Enter أو الفاصلة لإضافتها.";

const fieldId = (name: keyof InitiativeFormValues) => `field-${name}`;

export function InitiativeEditorForm({
  mode,
  categories,
  wilayas,
  initialValues,
  onSubmit,
  cancelHref,
}: InitiativeEditorFormProps) {
  const [values, setValues] = useState<InitiativeFormValues>(initialValues);
  /** Set on the first submit attempt; from then on errors update live as the user fixes fields. */
  const [submission, setSubmission] = useState<{ today: string } | null>(null);

  const categoryOptions = useMemo(() => categories.map((c) => ({ value: c.slug, label: c.name })), [categories]);
  const wilayaOptions = useMemo(() => wilayas.map((w) => ({ value: w.slug, label: w.name })), [wilayas]);
  const statusOptions = useMemo(
    () => INITIATIVE_STATUSES.map((status) => ({ value: status, label: statusLabel(status) })),
    [],
  );

  const errors: InitiativeFormErrors = useMemo(() => {
    if (!submission) return {};
    return validateInitiativeForm(values, {
      categorySlugs: categories.map((c) => c.slug),
      wilayaSlugs: wilayas.map((w) => w.slug),
      today: submission.today,
      allowPastStartDate: mode === "edit" && values.startDate === initialValues.startDate,
    });
  }, [submission, values, categories, wilayas, mode, initialValues.startDate]);

  const errorCount = Object.keys(errors).length;
  const selectedCategory = categories.find((c) => c.slug === values.categorySlug);

  function update<K extends keyof InitiativeFormValues>(key: K, value: InitiativeFormValues[K]) {
    setValues((previous) => ({ ...previous, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const today = todayIsoDate();
    setSubmission({ today });

    const found = validateInitiativeForm(values, {
      categorySlugs: categories.map((c) => c.slug),
      wilayaSlugs: wilayas.map((w) => w.slug),
      today,
      allowPastStartDate: mode === "edit" && values.startDate === initialValues.startDate,
    });
    const firstInvalid = FIELD_ORDER.find((name) => found[name]);
    if (firstInvalid) {
      document.getElementById(fieldId(firstInvalid))?.focus();
      return;
    }
    onSubmit(values);
  }

  const L = INITIATIVE_LIMITS;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <Alert tone="info">
        <strong>بيانات تجريبية:</strong>{" "}
        {mode === "create"
          ? "ستُضاف المبادرة إلى ذاكرة المتصفح فقط ولن تُحفظ في أي قاعدة بيانات، وستختفي عند تحديث الصفحة."
          : "ستُطبَّق التعديلات على ذاكرة المتصفح فقط، وستعود البيانات الأصلية عند تحديث الصفحة."}
      </Alert>

      <FormSection title="المعلومات الأساسية">
        <TextField
          id={fieldId("title")}
          label="عنوان المبادرة"
          required
          value={values.title}
          onChange={(v) => update("title", v)}
          error={errors.title}
          maxLength={L.titleMax}
          showCount
          placeholder="مثال: حملة تشجير حي النخيل"
        />
        <TextField
          id={fieldId("summary")}
          label="ملخص قصير"
          required
          value={values.summary}
          onChange={(v) => update("summary", v)}
          error={errors.summary}
          maxLength={L.summaryMax}
          showCount
          hint="يظهر في بطاقة المبادرة ونتائج البحث."
          placeholder="جملة أو جملتان تلخصان فكرة المبادرة"
        />
        <TextAreaField
          id={fieldId("description")}
          label="الوصف التفصيلي"
          required
          rows={6}
          value={values.description}
          onChange={(v) => update("description", v)}
          error={errors.description}
          maxLength={L.descriptionMax}
          showCount
          placeholder="اشرح فكرة المبادرة، لماذا تحتاجها المنطقة، وكيف ستُنفَّذ"
        />
      </FormSection>

      <FormSection title="التصنيف والموقع والموعد">
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField
            id={fieldId("categorySlug")}
            label="التصنيف"
            required
            value={values.categorySlug}
            onChange={(v) => update("categorySlug", v)}
            options={categoryOptions}
            error={errors.categorySlug}
            placeholder="اختر تصنيفًا"
          />
          <SelectField
            id={fieldId("wilayaSlug")}
            label="الولاية"
            required
            value={values.wilayaSlug}
            onChange={(v) => update("wilayaSlug", v)}
            options={wilayaOptions}
            error={errors.wilayaSlug}
            placeholder="اختر ولاية"
          />
          <TextField
            id={fieldId("startDate")}
            label="تاريخ البدء المتوقع"
            required
            type="date"
            value={values.startDate}
            onChange={(v) => update("startDate", v)}
            error={errors.startDate}
          />
          {mode === "edit" && (
            <SelectField
              id={fieldId("status")}
              label="حالة المبادرة"
              required
              value={values.status}
              onChange={(v) => update("status", v as InitiativeFormValues["status"])}
              options={statusOptions}
              error={errors.status}
            />
          )}
        </div>
      </FormSection>

      <FormSection title="الجمهور والأهداف">
        <TextField
          id={fieldId("targetAudience")}
          label="الفئة المستهدفة"
          required
          value={values.targetAudience}
          onChange={(v) => update("targetAudience", v)}
          error={errors.targetAudience}
          maxLength={L.audienceMax}
          placeholder="مثال: طلبة الثانوي في الأحياء الشعبية"
        />
        <TextAreaField
          id={fieldId("goals")}
          label="الأهداف"
          required
          rows={4}
          value={values.goals}
          onChange={(v) => update("goals", v)}
          error={errors.goals}
          hint={`اكتب كل هدف في سطر منفصل (حتى ${L.goalsMax} أهداف).`}
          placeholder={"تدريب 50 شابًا خلال ثلاثة أشهر\nإطلاق ورشة أسبوعية"}
        />
      </FormSection>

      <FormSection title="الدعم والمهارات المطلوبة">
        <SupportOptionsField
          id={fieldId("supportTypes")}
          value={values.supportTypes}
          onChange={(v) => update("supportTypes", v)}
          error={errors.supportTypes}
        />
        <FieldShell
          id={fieldId("requiredSkills")}
          label="المهارات المطلوبة"
          hint={SKILLS_HINT}
          error={errors.requiredSkills}
        >
          <TagInput
            id={fieldId("requiredSkills")}
            value={values.requiredSkills}
            onChange={(v) => update("requiredSkills", v)}
            maxTags={L.skillsMax}
            maxLength={L.skillLength}
            placeholder="مثال: تصميم، تصوير، تنسيق ميداني"
            invalid={Boolean(errors.requiredSkills)}
            describedBy={describedBy(fieldId("requiredSkills"), SKILLS_HINT, errors.requiredSkills)}
          />
        </FieldShell>
      </FormSection>

      <FormSection title="صورة الغلاف" description="اختيارية. أضف رابط صورة أو اختر صورة من جهازك لمعاينتها.">
        <ImageField
          id={fieldId("coverImage")}
          label="صورة الغلاف"
          value={values.coverImage}
          onChange={(v) => update("coverImage", v)}
          error={errors.coverImage}
          preview={
            <CoverImage
              src={values.coverImage}
              alt="معاينة صورة الغلاف"
              iconName={selectedCategory?.icon}
              className="h-32 w-full rounded-xl sm:w-52"
            />
          }
        />
      </FormSection>

      {submission && errorCount > 0 && (
        <Alert tone="error">
          {errorCount === 1
            ? "يوجد حقل واحد يحتاج إلى تصحيح. راجع الرسالة الظاهرة أسفل الحقل."
            : `يوجد ${errorCount} حقول تحتاج إلى تصحيح. راجع الرسائل الظاهرة أسفل كل حقل.`}
        </Alert>
      )}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" size="lg">
          {mode === "create" ? "نشر المبادرة" : "حفظ التعديلات"}
        </Button>
        <Button href={cancelHref} variant="outline" size="lg">
          إلغاء
        </Button>
      </div>
    </form>
  );
}
