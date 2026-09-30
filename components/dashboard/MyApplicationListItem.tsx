import Link from "next/link";
import { Eye, Undo2 } from "lucide-react";
import type { ApplicationWithRelations } from "@/types";
import { ApplicationStatusBadge } from "@/components/applications/ApplicationStatusBadge";
import { RoleBadge } from "@/components/applications/RoleBadge";
import { formatDate } from "@/lib/utils";

interface MyApplicationListItemProps {
  application: ApplicationWithRelations;
  onViewDetails: () => void;
  onWithdraw: () => void;
}

const actionClasses =
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors";

export function MyApplicationListItem({ application, onViewDetails, onWithdraw }: MyApplicationListItemProps) {
  return (
    <li className="flex flex-col gap-3 rounded-2xl border border-dark/10 bg-white p-4 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <ApplicationStatusBadge status={application.status} />
          <RoleBadge role={application.role} />
        </div>
        <Link
          href={`/initiatives/${application.initiative.slug}`}
          className="mt-2 block truncate font-bold text-dark hover:text-primary"
        >
          {application.initiative.title}
        </Link>
        <p className="mt-1 text-xs text-dark/60">قُدّم الطلب في {formatDate(application.submittedAt)}</p>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <button type="button" onClick={onViewDetails} className={`${actionClasses} border-dark/15 text-dark hover:bg-dark/5`}>
          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
          التفاصيل
        </button>
        {application.status === "PENDING" && (
          <button type="button" onClick={onWithdraw} className={`${actionClasses} border-red-200 text-red-700 hover:bg-red-50`}>
            <Undo2 className="h-3.5 w-3.5" aria-hidden="true" />
            سحب الطلب
          </button>
        )}
      </div>
    </li>
  );
}
