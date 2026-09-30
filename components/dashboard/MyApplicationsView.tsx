"use client";

import { useMemo, useState } from "react";
import { Inbox } from "lucide-react";
import type { ApplicationStatus, ApplicationWithRelations } from "@/types";
import { STATUS_FILTER_LABELS, STATUS_ORDER, countByStatus } from "@/lib/applications";
import { useMockStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { ApplicationDetails } from "@/components/applications/ApplicationDetails";
import { cn } from "@/lib/utils";
import { MyApplicationListItem } from "./MyApplicationListItem";

const TABS: ReadonlyArray<ApplicationStatus | "ALL"> = ["ALL", ...STATUS_ORDER];

export function MyApplicationsView() {
  const { myApplications, withdrawApplication } = useMockStore();
  const [tab, setTab] = useState<ApplicationStatus | "ALL">("ALL");
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [withdrawTarget, setWithdrawTarget] = useState<ApplicationWithRelations | null>(null);

  const counts = useMemo(() => countByStatus(myApplications), [myApplications]);
  const filtered = useMemo(
    () => (tab === "ALL" ? myApplications : myApplications.filter((application) => application.status === tab)),
    [myApplications, tab],
  );
  const detailsApplication = myApplications.find((application) => application.id === detailsId) ?? null;

  function confirmWithdraw() {
    if (withdrawTarget) withdrawApplication(withdrawTarget.id);
    setWithdrawTarget(null);
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold text-dark">طلباتي</h1>
        <p className="mt-1 text-sm text-dark/70">تابع حالة طلبات انضمامك إلى المبادرات (حساب تجريبي).</p>
      </header>

      <div role="tablist" aria-label="تصفية الطلبات حسب الحالة" className="flex flex-wrap gap-2">
        {TABS.map((status) => (
          <button
            key={status}
            type="button"
            role="tab"
            aria-selected={tab === status}
            onClick={() => setTab(status)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
              tab === status ? "border-primary bg-primary text-white" : "border-dark/15 bg-white text-dark/70 hover:bg-primary/10",
            )}
          >
            {STATUS_FILTER_LABELS[status]} ({counts[status]})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Inbox className="h-7 w-7" aria-hidden="true" />}
          title={myApplications.length === 0 ? "لم تقدّم أي طلب انضمام بعد" : "لا توجد طلبات في هذه الحالة"}
          description={
            myApplications.length === 0
              ? "تصفّح المبادرات وابحث عن فرصة تناسبك للمشاركة، ثم قدّم طلب انضمام."
              : "جرّب تبويبًا آخر لعرض بقية طلباتك."
          }
          action={myApplications.length === 0 ? <Button href="/initiatives">استكشف المبادرات</Button> : undefined}
        />
      ) : (
        <ul id="my-applications-list" className="space-y-3">
          {filtered.map((application) => (
            <MyApplicationListItem
              key={application.id}
              application={application}
              onViewDetails={() => setDetailsId(application.id)}
              onWithdraw={() => setWithdrawTarget(application)}
            />
          ))}
        </ul>
      )}

      <Modal
        open={detailsApplication !== null}
        onClose={() => setDetailsId(null)}
        title={detailsApplication?.initiative.title ?? ""}
        description="تفاصيل طلب الانضمام"
      >
        {detailsApplication && <ApplicationDetails application={detailsApplication} />}
      </Modal>

      <ConfirmDialog
        open={withdrawTarget !== null}
        title={withdrawTarget ? `سحب طلبك للانضمام إلى "${withdrawTarget.initiative.title}"؟` : "سحب الطلب؟"}
        description="يمكنك تقديم طلب جديد لاحقًا إذا غيّرت رأيك."
        confirmLabel="نعم، اسحب الطلب"
        onConfirm={confirmWithdraw}
        onCancel={() => setWithdrawTarget(null)}
      />
    </div>
  );
}
