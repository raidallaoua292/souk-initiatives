"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Inbox } from "lucide-react";
import { filterApplications, type ApplicationFilters } from "@/lib/applications";
import { useMockStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { CoverImage } from "@/components/ui/CoverImage";
import { EmptyState } from "@/components/ui/EmptyState";
import { ApplicantListItem } from "@/components/applications/ApplicantListItem";
import { ApplicationsFilterBar } from "@/components/applications/ApplicationsFilterBar";
import { ReviewApplicationModal } from "@/components/applications/ReviewApplicationModal";

const EMPTY_FILTERS: ApplicationFilters = { status: "ALL", role: "ALL", query: "" };

export function ManageApplicationsView({ initiativeId }: { initiativeId: string }) {
  const { isOwnerOf, initiatives, getApplicationsForInitiative } = useMockStore();
  const [filters, setFilters] = useState<ApplicationFilters>(EMPTY_FILTERS);
  const [reviewId, setReviewId] = useState<string | null>(null);

  const initiative = initiatives.find((item) => item.id === initiativeId);
  const applications = getApplicationsForInitiative(initiativeId);
  const filtered = useMemo(() => filterApplications(applications, filters), [applications, filters]);
  const reviewTarget = applications.find((application) => application.id === reviewId) ?? null;

  if (!isOwnerOf(initiativeId) || !initiative) {
    return (
      <EmptyState
        icon={<Inbox className="h-7 w-7" aria-hidden="true" />}
        title="لا يمكنك الوصول إلى هذه الصفحة"
        description="إدارة طلبات الانضمام متاحة فقط لمنظّم المبادرة (الحساب التجريبي الحالي). تحقق من أنك تصفّحت إحدى مبادراتك."
        action={<Button href="/dashboard">العودة إلى لوحة التحكم</Button>}
      />
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <CoverImage src={initiative.coverImage} alt="" iconName={initiative.category.icon} className="h-14 w-14 shrink-0 rounded-xl" iconClassName="h-6 w-6" />
          <div>
            <p className="text-xs font-semibold text-dark/50">إدارة طلبات الانضمام · المنظّم: حساب تجريبي</p>
            <h1 className="text-xl font-extrabold text-dark">{initiative.title}</h1>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button href={`/dashboard/initiatives/${initiative.id}/team`} variant="outline" size="sm">
            عرض الفريق
          </Button>
          <Button href="/dashboard" variant="ghost" size="sm" icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}>
            العودة
          </Button>
        </div>
      </header>

      <ApplicationsFilterBar value={filters} onChange={setFilters} />

      <p className="text-sm text-dark/60">
        {filtered.length} طلب من أصل {applications.length}
      </p>

      {applications.length === 0 ? (
        <EmptyState
          icon={<Inbox className="h-7 w-7" aria-hidden="true" />}
          title="لا توجد طلبات انضمام بعد"
          description="عندما يتقدّم أحد للانضمام إلى هذه المبادرة، ستظهر طلباته هنا."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Inbox className="h-7 w-7" aria-hidden="true" />}
          title="لا توجد نتائج مطابقة"
          description="جرّب تعديل الفلاتر أو كلمة البحث."
        />
      ) : (
        <ul id="applicants-list" className="space-y-3">
          {filtered.map((application) => (
            <ApplicantListItem key={application.id} application={application} onOpen={() => setReviewId(application.id)} />
          ))}
        </ul>
      )}

      <ReviewApplicationModal application={reviewTarget} onClose={() => setReviewId(null)} />
    </div>
  );
}
