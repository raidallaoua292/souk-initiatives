"use client";

import { useState } from "react";
import { ArrowRight, ClipboardList, UsersRound } from "lucide-react";
import type { ApplicationWithRelations } from "@/types";
import { useMockStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { CoverImage } from "@/components/ui/CoverImage";
import { EmptyState } from "@/components/ui/EmptyState";
import { TeamMemberRow } from "@/components/applications/TeamMemberRow";

export function TeamManagementView({ initiativeId }: { initiativeId: string }) {
  const { isOwnerOf, initiatives, getTeamForInitiative, removeMember } = useMockStore();
  const [removeTarget, setRemoveTarget] = useState<ApplicationWithRelations | null>(null);

  const initiative = initiatives.find((item) => item.id === initiativeId);
  const team = getTeamForInitiative(initiativeId);

  if (!isOwnerOf(initiativeId) || !initiative) {
    return (
      <EmptyState
        icon={<UsersRound className="h-7 w-7" aria-hidden="true" />}
        title="لا يمكنك الوصول إلى هذه الصفحة"
        description="إدارة الفريق متاحة فقط لمنظّم المبادرة (الحساب التجريبي الحالي). تحقق من أنك تصفّحت إحدى مبادراتك."
        action={<Button href="/dashboard">العودة إلى لوحة التحكم</Button>}
      />
    );
  }

  function confirmRemove() {
    if (removeTarget) removeMember(removeTarget.id);
    setRemoveTarget(null);
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <CoverImage src={initiative.coverImage} alt="" iconName={initiative.category.icon} className="h-14 w-14 shrink-0 rounded-xl" iconClassName="h-6 w-6" />
          <div>
            <p className="text-xs font-semibold text-dark/50">فريق المبادرة · المنظّم: حساب تجريبي</p>
            <h1 className="text-xl font-extrabold text-dark">{initiative.title}</h1>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            href={`/dashboard/initiatives/${initiative.id}/applications`}
            variant="outline"
            size="sm"
            icon={<ClipboardList className="h-4 w-4" aria-hidden="true" />}
          >
            طلبات الانضمام
          </Button>
          <Button href="/dashboard" variant="ghost" size="sm" icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}>
            العودة
          </Button>
        </div>
      </header>

      <p className="text-sm text-dark/60">{team.length} عضو في الفريق</p>

      {team.length === 0 ? (
        <EmptyState
          icon={<UsersRound className="h-7 w-7" aria-hidden="true" />}
          title="لا يوجد أعضاء في الفريق بعد"
          description="اقبل طلبات الانضمام المعلّقة لتظهر أسماء الأعضاء هنا تلقائيًا."
          action={<Button href={`/dashboard/initiatives/${initiative.id}/applications`}>مراجعة طلبات الانضمام</Button>}
        />
      ) : (
        <ul id="team-list" className="space-y-3">
          {team.map((member) => (
            <TeamMemberRow key={member.id} member={member} onRemove={() => setRemoveTarget(member)} />
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={removeTarget !== null}
        title={removeTarget ? `إزالة ${removeTarget.applicant.name} من الفريق؟` : "إزالة العضو؟"}
        description="يمكن لهذا الشخص التقدّم بطلب انضمام جديد لاحقًا إذا أردت إعادة النظر."
        confirmLabel="نعم، أزل العضو"
        onConfirm={confirmRemove}
        onCancel={() => setRemoveTarget(null)}
      />
    </div>
  );
}
