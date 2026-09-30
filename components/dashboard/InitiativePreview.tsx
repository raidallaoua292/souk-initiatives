"use client";

import Link from "next/link";
import { Pencil, SearchX } from "lucide-react";
import { InitiativeDetailsView } from "@/components/initiatives/InitiativeDetailsView";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { useMockStore } from "@/lib/store";

/**
 * Renders one of the user's initiatives from the client-side mock store using
 * the same view as the public details page. Needed because temporary
 * initiatives don't exist on the server, so the public route can't show them.
 */
export function InitiativePreview({ initiativeId }: { initiativeId: string }) {
  const { getInitiative } = useMockStore();
  const initiative = getInitiative(initiativeId);

  if (!initiative) {
    return (
      <Container className="py-16">
        <EmptyState
          icon={<SearchX className="h-7 w-7" aria-hidden="true" />}
          title="لم نعثر على هذه المبادرة"
          description="قد تكون حُذفت، أو أن البيانات المؤقتة مُسحت عند تحديث الصفحة."
          action={<Button href="/dashboard">العودة إلى لوحة التحكم</Button>}
        />
      </Container>
    );
  }

  return (
    <InitiativeDetailsView
      initiative={initiative}
      backHref="/dashboard"
      backLabel="الرجوع إلى لوحة التحكم"
      banner={
        <Alert
          tone="info"
          action={
            <Link
              href={`/dashboard/initiatives/${initiative.id}/edit`}
              className="inline-flex items-center gap-1.5 underline underline-offset-2"
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              تعديل المبادرة
            </Link>
          }
        >
          <strong>معاينة من لوحة التحكم:</strong> هذه صفحة المبادرة كما ستظهر، وبياناتها مؤقتة
          وتُمسح عند تحديث الصفحة.
        </Alert>
      }
    />
  );
}
