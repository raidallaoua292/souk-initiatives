"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import type { Category, InitiativeNeedType, Wilaya } from "@/types";
import { Button } from "@/components/ui/Button";

interface InitiativeFormProps {
  categories: Category[];
  wilayas: Wilaya[];
}

const needTypeOptions: { value: InitiativeNeedType; label: string }[] = [
  { value: "volunteers", label: "متطوعون" },
  { value: "donations", label: "تبرعات" },
  { value: "equipment", label: "معدات" },
  { value: "skills", label: "مهارات وخبرات" },
  { value: "partnership", label: "شراكات" },
];

const inputClasses =
  "w-full rounded-xl border border-dark/15 bg-white px-3.5 py-2.5 text-sm text-dark outline-none focus:border-primary";

export function InitiativeForm({ categories, wilayas }: InitiativeFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const requiredFields = ["title", "categorySlug", "wilayaSlug", "shortDescription", "description"];
    const isMissingField = requiredFields.some((field) => !formData.get(field));

    if (isMissingField) {
      setError("الرجاء تعبئة جميع الحقول الإلزامية قبل الإرسال.");
      return;
    }

    setError(null);
    // NOTE: no backend yet — this is where a POST to /api/initiatives (or a
    // Prisma `create` call from a server action) would go once the backend
    // exists. For now we just simulate a successful submission locally.
    setIsSubmitted(true);
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-6 py-12 text-center">
        <CheckCircle2 className="h-12 w-12 text-primary" aria-hidden="true" />
        <h3 className="text-lg font-bold text-dark">تم استلام مبادرتك بنجاح!</h3>
        <p className="max-w-md text-sm leading-relaxed text-dark/70">
          شكرًا لمشاركتك &quot;{title}&quot; معنا. هذا نموذج تجريبي حاليًا ولا يتم حفظ
          البيانات فعليًا، لكن سيتم ربطه قريبًا بمراجعة ونشر حقيقيَّين.
        </p>
        <Button variant="outline" size="sm" onClick={() => setIsSubmitted(false)}>
          نشر مبادرة أخرى
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm font-semibold text-dark">
          عنوان المبادرة <span className="text-accent">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="مثال: حملة تنظيف حي..."
          className={inputClasses}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="categorySlug" className="mb-1.5 block text-sm font-semibold text-dark">
            التصنيف <span className="text-accent">*</span>
          </label>
          <select id="categorySlug" name="categorySlug" required defaultValue="" className={inputClasses}>
            <option value="" disabled>
              اختر تصنيفًا
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="wilayaSlug" className="mb-1.5 block text-sm font-semibold text-dark">
            الولاية <span className="text-accent">*</span>
          </label>
          <select id="wilayaSlug" name="wilayaSlug" required defaultValue="" className={inputClasses}>
            <option value="" disabled>
              اختر ولاية
            </option>
            {wilayas.map((wilaya) => (
              <option key={wilaya.code} value={wilaya.slug}>
                {wilaya.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="shortDescription" className="mb-1.5 block text-sm font-semibold text-dark">
          وصف مختصر <span className="text-accent">*</span>
        </label>
        <input
          id="shortDescription"
          name="shortDescription"
          type="text"
          required
          maxLength={140}
          placeholder="جملة أو جملتان تلخصان المبادرة"
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm font-semibold text-dark">
          الوصف الكامل <span className="text-accent">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          placeholder="اشرح أهداف المبادرة، من تستهدف، وكيف يمكن للناس المساهمة"
          className={inputClasses}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="needType" className="mb-1.5 block text-sm font-semibold text-dark">
            أهم احتياج حاليًا
          </label>
          <select id="needType" name="needType" defaultValue="volunteers" className={inputClasses}>
            {needTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="contactEmail" className="mb-1.5 block text-sm font-semibold text-dark">
            بريد إلكتروني للتواصل
          </label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            placeholder="example@mail.com"
            className={inputClasses}
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" className="self-start">
        إرسال المبادرة
      </Button>
    </form>
  );
}
