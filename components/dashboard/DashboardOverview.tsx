"use client";

import { useState } from "react";
import { Activity, ClipboardList, FolderOpen, Layers, Plus, RotateCcw, Users } from "lucide-react";
import type { InitiativeWithRelations } from "@/types";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { useMockStore } from "@/lib/store";
import { formatNumber } from "@/lib/utils";
import { InitiativeListItem } from "./InitiativeListItem";
import { StatCard } from "./StatCard";

export function DashboardOverview() {
  const { currentUser, initiatives, stats, deleteInitiative, resetData, getApplicationsForInitiative } = useMockStore();
  const [pendingDelete, setPendingDelete] = useState<InitiativeWithRelations | null>(null);
  const firstName = currentUser.name.split(" ")[0];

  function confirmDelete() {
    if (pendingDelete) deleteInitiative(pendingDelete.id);
    setPendingDelete(null);
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-dark">مرحبًا، {firstName}</h1>
          <p className="mt-1 text-sm text-dark/70">نظرة سريعة على مبادراتك وفريقك.</p>
        </div>
        <Button href="/dashboard/initiatives/new" icon={<Plus className="h-4 w-4" aria-hidden="true" />}>
          مبادرة جديدة
        </Button>
      </header>

      <section aria-label="إحصائيات">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Layers className="h-6 w-6" aria-hidden="true" />}
            label="إجمالي المبادرات"
            value={formatNumber(stats.totalInitiatives)}
          />
          <StatCard
            icon={<Activity className="h-6 w-6" aria-hidden="true" />}
            label="المبادرات القائمة"
            value={formatNumber(stats.activeInitiatives)}
          />
          <StatCard
            icon={<Users className="h-6 w-6" aria-hidden="true" />}
            label="أعضاء الفريق"
            value={formatNumber(stats.teamMembers)}
          />
          <StatCard
            icon={<ClipboardList className="h-6 w-6" aria-hidden="true" />}
            label="طلبات تنتظر المراجعة"
            value={formatNumber(stats.pendingApplications)}
          />
        </ul>
      </section>

      <section aria-labelledby="my-initiatives-heading">
        <h2 id="my-initiatives-heading" className="mb-4 text-lg font-bold text-dark">
          مبادراتي
        </h2>

        {initiatives.length === 0 ? (
          <EmptyState
            icon={<FolderOpen className="h-7 w-7" aria-hidden="true" />}
            title="لا توجد لديك مبادرات بعد"
            description="ابدأ بنشر أول مبادرة لك لتصل إلى متطوعين وداعمين من ولايتك ومن كل الجزائر."
            action={
              <Button href="/dashboard/initiatives/new" icon={<Plus className="h-4 w-4" aria-hidden="true" />}>
                أنشئ مبادرتك الأولى
              </Button>
            }
          />
        ) : (
          <ul className="space-y-3">
            {initiatives.map((initiative) => (
              <InitiativeListItem
                key={initiative.id}
                initiative={initiative}
                pendingApplications={
                  getApplicationsForInitiative(initiative.id).filter((application) => application.status === "PENDING").length
                }
                onDelete={setPendingDelete}
              />
            ))}
          </ul>
        )}
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-dark/20 px-5 py-4">
        <p className="text-sm text-dark/60">جرّبت تعديل أو حذف بعض المبادرات؟ يمكنك العودة إلى البيانات الأصلية.</p>
        <Button variant="outline" size="sm" onClick={resetData} icon={<RotateCcw className="h-4 w-4" aria-hidden="true" />}>
          استعادة البيانات التجريبية
        </Button>
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title={pendingDelete ? `حذف "${pendingDelete.title}"؟` : "حذف المبادرة؟"}
        description="سيتم حذف هذه المبادرة من لوحة التحكم. يمكنك استعادة البيانات التجريبية الأصلية لاحقًا من أسفل الصفحة، أو بتحديث الصفحة."
        confirmLabel="نعم، احذف"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
