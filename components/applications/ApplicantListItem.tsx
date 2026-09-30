import { Eye, ShieldCheck } from "lucide-react";
import type { ApplicationWithRelations } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { formatDate } from "@/lib/utils";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";
import { RoleBadge } from "./RoleBadge";

/** One applicant row on the "manage applications" page. */
export function ApplicantListItem({ application, onOpen }: { application: ApplicationWithRelations; onOpen: () => void }) {
  const isPending = application.status === "PENDING";

  return (
    <li className="flex flex-col gap-3 rounded-2xl border border-dark/10 bg-white p-4 sm:flex-row sm:items-center">
      <Avatar name={application.applicant.name} colorClass={application.applicant.avatarColor} src={application.applicant.avatarUrl} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <ApplicationStatusBadge status={application.status} />
          <RoleBadge role={application.role} />
        </div>
        <p className="mt-2 truncate font-bold text-dark">{application.applicant.name}</p>
        <p className="mt-1 text-xs text-dark/60">قُدّم الطلب في {formatDate(application.submittedAt)}</p>
      </div>
      <button
        type="button"
        onClick={onOpen}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-primary/30 px-3.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
      >
        {isPending ? <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> : <Eye className="h-3.5 w-3.5" aria-hidden="true" />}
        {isPending ? "مراجعة الطلب" : "التفاصيل"}
      </button>
    </li>
  );
}
