"use client";

import Link from "next/link";
import { ClipboardList, UsersRound } from "lucide-react";
import type { InitiativeWithRelations } from "@/types";
import { Button } from "@/components/ui/Button";
import { useMockStore } from "@/lib/store";
import { joinBlockedMessage } from "@/lib/applications";
import { formatDate } from "@/lib/utils";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";

/**
 * The participation card shown on every initiative details page (public or
 * dashboard preview). Reads live eligibility from the mock store, so it
 * always reflects the current user's latest application status.
 */
export function JoinInitiativeCard({ initiative }: { initiative: InitiativeWithRelations }) {
  const { getJoinEligibility } = useMockStore();
  const eligibility = getJoinEligibility(initiative);

  return (
    <div className="rounded-2xl border border-dark/10 bg-white p-6">
      <h2 className="mb-1 text-sm font-bold text-dark/60">المشاركة في المبادرة</h2>

      {eligibility.canJoin && (
        <>
          <p className="mt-2 text-sm leading-relaxed text-dark/70">
            اختر الدور المناسب لك من فرص المشاركة وقدّم طلب انضمام.
          </p>
          <Button
            href={`/initiatives/${initiative.slug}/apply`}
            size="sm"
            className="mt-4 w-full"
            icon={<UsersRound className="h-4 w-4" aria-hidden="true" />}
          >
            انضم إلى المبادرة
          </Button>
        </>
      )}

      {!eligibility.canJoin && eligibility.reason === "OWNER" && (
        <div className="mt-3 space-y-2">
          <p className="text-sm leading-relaxed text-dark/70">{joinBlockedMessage(eligibility)}</p>
          <Button
            href={`/dashboard/initiatives/${initiative.id}/applications`}
            variant="outline"
            size="sm"
            className="w-full"
            icon={<ClipboardList className="h-4 w-4" aria-hidden="true" />}
          >
            إدارة طلبات الانضمام
          </Button>
          <Button
            href={`/dashboard/initiatives/${initiative.id}/team`}
            variant="ghost"
            size="sm"
            className="w-full"
            icon={<UsersRound className="h-4 w-4" aria-hidden="true" />}
          >
            إدارة الفريق
          </Button>
        </div>
      )}

      {!eligibility.canJoin && (eligibility.reason === "PENDING" || eligibility.reason === "ACCEPTED") && (
        <div className="mt-3 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <ApplicationStatusBadge status={eligibility.application.status} />
            <span className="text-xs text-dark/60">قدّمته في {formatDate(eligibility.application.submittedAt)}</span>
          </div>
          <p className="text-sm leading-relaxed text-dark/70">{joinBlockedMessage(eligibility)}</p>
          <Button href="/dashboard/applications" variant="outline" size="sm" className="w-full">
            عرض طلباتي
          </Button>
        </div>
      )}

      {!eligibility.canJoin && eligibility.reason === "CLOSED" && (
        <p className="mt-3 text-sm leading-relaxed text-dark/70">{joinBlockedMessage(eligibility)}</p>
      )}

      <p className="mt-4 border-t border-dark/10 pt-3 text-xs text-dark/50">
        <Link href="/dashboard/profile" className="underline underline-offset-2 hover:text-primary">
          الحساب الحالي تجريبي
        </Link>
        ، وتُحفظ طلبات الانضمام في ذاكرة المتصفح فقط.
      </p>
    </div>
  );
}
