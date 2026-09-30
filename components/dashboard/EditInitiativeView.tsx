"use client";

import { useRouter } from "next/navigation";
import { SearchX } from "lucide-react";
import { InitiativeEditorForm } from "@/components/forms/InitiativeEditorForm";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { initiativeToFormValues } from "@/lib/forms/initiative-form";
import { useMockStore } from "@/lib/store";

export function EditInitiativeView({ initiativeId }: { initiativeId: string }) {
  const router = useRouter();
  const { getInitiative, categories, wilayas, updateInitiative } = useMockStore();
  const initiative = getInitiative(initiativeId);

  if (!initiative) {
    return (
      <EmptyState
        icon={<SearchX className="h-7 w-7" aria-hidden="true" />}
        title="لم نعثر على هذه المبادرة"
        description="قد تكون حُذفت، أو أن البيانات المؤقتة مُسحت عند تحديث الصفحة."
        action={<Button href="/dashboard">العودة إلى لوحة التحكم</Button>}
      />
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold text-dark">تعديل المبادرة</h1>
        <p className="mt-1 text-sm text-dark/70">{initiative.title}</p>
      </header>
      <InitiativeEditorForm
        key={initiative.id}
        mode="edit"
        categories={categories}
        wilayas={wilayas}
        initialValues={initiativeToFormValues(initiative)}
        cancelHref="/dashboard"
        onSubmit={(values) => {
          if (updateInitiative(initiative.id, values)) router.push("/dashboard");
        }}
      />
    </div>
  );
}
