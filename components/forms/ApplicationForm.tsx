"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { InitiativeWithRelations } from "@/types";
import {
  APPLICATION_LIMITS,
  AVAILABILITY_LABELS,
  COMMITMENT_LABELS,
  ROLES_REQUIRING_SKILLS,
  ROLE_LABELS,
  emptyApplicationFormValues,
  getOfferedRoles,
  getOpportunities,
  joinBlockedMessage,
  validateApplicationForm,
  type ApplicationFormValues,
} from "@/lib/applications";
import { useMockStore } from "@/lib/store";
import { Alert } from "@/components/ui/Alert";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { FieldShell, SelectField, TextAreaField, describedBy } from "./fields";
import { TagInput } from "./TagInput";

const FIELD_ORDER: ReadonlyArray<keyof ApplicationFormValues> = [
  "role",
  "skills",
  "availability",
  "commitment",
  "message",
  "supportingInfo",
];

const fieldId = (name: keyof ApplicationFormValues) => `application-${name}`;
const SKILLS_HINT = "اكتب مهارة ثم اضغط Enter أو الفاصلة لإضافتها.";
const AVAILABILITY_OPTIONS = Object.entries(AVAILABILITY_LABELS).map(([value, label]) => ({ value, label }));
const COMMITMENT_OPTIONS = Object.entries(COMMITMENT_LABELS).map(([value, label]) => ({ value, label }));

interface ApplicationFormProps {
  initiative: InitiativeWithRelations;
  /** Where "إلغاء" and the ineligible-state link go back to. */
  cancelHref: string;
}

/**
 * Reusable join-initiative form. Reads the current mock user and eligibility
 * from the store and, on success, creates the application there and
 * navigates to the user's applications page.
 */
export function ApplicationForm({ initiative, cancelHref }: ApplicationFormProps) {
  const router = useRouter();
  const { currentUser, submitApplication, getJoinEligibility } = useMockStore();

  const opportunities = useMemo(() => getOpportunities(initiative), [initiative]);
  const offeredRoles = useMemo(() => getOfferedRoles(initiative), [initiative]);
  const roleOptions = useMemo(
    () => offeredRoles.map((role) => ({ value: role, label: ROLE_LABELS[role] })),
    [offeredRoles],
  );

  const [values, setValues] = useState<ApplicationFormValues>(() =>
    emptyApplicationFormValues(offeredRoles.length === 1 ? offeredRoles[0] : undefined),
  );
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const errors = useMemo(
    () => (submitted ? validateApplicationForm(values, { offeredRoles }) : {}),
    [submitted, values, offeredRoles],
  );
  const errorCount = Object.keys(errors).length;
  const selectedOpportunity = opportunities.find((opportunity) => opportunity.role === values.role);

  // Re-checked on every render so a duplicate created elsewhere (or via the
  // back button after a successful submit) is caught immediately.
  const eligibility = getJoinEligibility(initiative);

  function update<K extends keyof ApplicationFormValues>(key: K, value: ApplicationFormValues[K]) {
    setValues((previous) => ({ ...previous, [key]: value }));
    setSubmitError(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);

    const found = validateApplicationForm(values, { offeredRoles });
    const firstInvalid = FIELD_ORDER.find((name) => found[name]);
    if (firstInvalid) {
      document.getElementById(fieldId(firstInvalid))?.focus();
      return;
    }

    const result = submitApplication(initiative, values);
    if (!result.ok) {
      setSubmitError(result.error);
      return;
    }
    router.push("/dashboard/applications");
  }

  if (!eligibility.canJoin) {
    return (
      <div className="space-y-4">
        <Alert tone="info">{joinBlockedMessage(eligibility)}</Alert>
        <Button href={cancelHref} variant="outline">
          الرجوع إلى المبادرة
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <Alert tone="info">
        <strong>بيانات تجريبية:</strong> سيُسجَّل طلبك في ذاكرة المتصفح فقط باسم الحساب التجريبي، ولن
        يُحفظ في أي قاعدة بيانات، وسيختفي عند تحديث الصفحة.
      </Alert>

      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-dark/10 bg-white p-4">
        <div className="flex items-center gap-3">
          <Avatar name={currentUser.name} colorClass={currentUser.avatarColor} src={currentUser.avatarUrl} />
          <div>
            <p className="text-xs text-dark/60">مقدّم الطلب (حساب تجريبي)</p>
            <p className="font-bold text-dark">{currentUser.name}</p>
          </div>
        </div>
        <div className="me-auto text-end">
          <p className="text-xs text-dark/60">المبادرة</p>
          <p className="max-w-[16rem] truncate font-bold text-dark">{initiative.title}</p>
        </div>
      </div>

      <div className="space-y-5 rounded-2xl border border-dark/10 bg-white p-5 sm:p-6">
        <div>
          <SelectField
            id={fieldId("role")}
            label="الدور الذي تريد المشاركة به"
            required
            value={values.role}
            onChange={(value) => update("role", value as ApplicationFormValues["role"])}
            options={roleOptions}
            error={errors.role}
            placeholder="اختر دورًا"
          />
          {selectedOpportunity && (
            <p className="mt-1.5 text-xs text-dark/60">
              {selectedOpportunity.description} · الالتزام المقترح: {selectedOpportunity.commitment}
            </p>
          )}
        </div>

        <FieldShell
          id={fieldId("skills")}
          label={`المهارات ذات الصلة${values.role && ROLES_REQUIRING_SKILLS.includes(values.role) ? "" : " (اختياري)"}`}
          hint={SKILLS_HINT}
          error={errors.skills}
        >
          <TagInput
            id={fieldId("skills")}
            value={values.skills}
            onChange={(value) => update("skills", value)}
            maxTags={APPLICATION_LIMITS.skillsMax}
            maxLength={APPLICATION_LIMITS.skillLength}
            placeholder="مثال: تصوير، تنسيق ميداني"
            invalid={Boolean(errors.skills)}
            describedBy={describedBy(fieldId("skills"), SKILLS_HINT, errors.skills)}
          />
        </FieldShell>

        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField
            id={fieldId("availability")}
            label="أوقات التوفر"
            required
            value={values.availability}
            onChange={(value) => update("availability", value as ApplicationFormValues["availability"])}
            options={AVAILABILITY_OPTIONS}
            error={errors.availability}
            placeholder="اختر وقتًا"
          />
          <SelectField
            id={fieldId("commitment")}
            label="مستوى الالتزام"
            required
            value={values.commitment}
            onChange={(value) => update("commitment", value as ApplicationFormValues["commitment"])}
            options={COMMITMENT_OPTIONS}
            error={errors.commitment}
            placeholder="اختر مستوى"
          />
        </div>

        <TextAreaField
          id={fieldId("message")}
          label="رسالة الدافع"
          required
          rows={5}
          value={values.message}
          onChange={(value) => update("message", value)}
          error={errors.message}
          maxLength={APPLICATION_LIMITS.messageMax}
          showCount
          placeholder="لماذا تريد الانضمام؟ وما الذي يمكنك تقديمه للمبادرة؟"
        />

        <TextAreaField
          id={fieldId("supportingInfo")}
          label="معلومات إضافية (اختياري)"
          rows={3}
          value={values.supportingInfo}
          onChange={(value) => update("supportingInfo", value)}
          error={errors.supportingInfo}
          maxLength={APPLICATION_LIMITS.infoMax}
          showCount
          placeholder="روابط لأعمال سابقة، خبرات إضافية، أو أي شيء يدعم طلبك"
        />
      </div>

      {submitted && errorCount > 0 && (
        <Alert tone="error">
          {errorCount === 1
            ? "يوجد حقل واحد يحتاج إلى تصحيح. راجع الرسالة الظاهرة أسفل الحقل."
            : `يوجد ${errorCount} حقول تحتاج إلى تصحيح. راجع الرسائل الظاهرة أسفل كل حقل.`}
        </Alert>
      )}
      {submitError && <Alert tone="error">{submitError}</Alert>}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" size="lg">
          إرسال طلب الانضمام
        </Button>
        <Button href={cancelHref} variant="outline" size="lg">
          إلغاء
        </Button>
      </div>
    </form>
  );
}
