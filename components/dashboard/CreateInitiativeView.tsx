"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InitiativeEditorForm } from "@/components/forms/InitiativeEditorForm";
import { emptyInitiativeFormValues } from "@/lib/forms/initiative-form";
import { useMockStore } from "@/lib/store";

/** Connects the create form to the mock store; on success returns to the dashboard. */
export function CreateInitiativeView() {
  const router = useRouter();
  const { categories, wilayas, createInitiative } = useMockStore();
  const [initialValues] = useState(emptyInitiativeFormValues);

  return (
    <InitiativeEditorForm
      mode="create"
      categories={categories}
      wilayas={wilayas}
      initialValues={initialValues}
      cancelHref="/dashboard"
      onSubmit={(values) => {
        createInitiative(values);
        router.push("/dashboard");
      }}
    />
  );
}
