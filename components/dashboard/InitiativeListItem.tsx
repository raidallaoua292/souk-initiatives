import Link from "next/link";
import { ClipboardList, Eye, MapPin, Pencil, Trash2, Users, UsersRound } from "lucide-react";
import type { InitiativeWithRelations } from "@/types";
import { CoverImage } from "@/components/ui/CoverImage";
import { StatusBadge } from "@/components/initiatives/StatusBadge";
import { formatDate, formatNumber } from "@/lib/utils";

interface InitiativeListItemProps {
  initiative: InitiativeWithRelations;
  /** Applications awaiting review on this initiative, shown as a badge. */
  pendingApplications: number;
  onDelete: (initiative: InitiativeWithRelations) => void;
}

const actionClasses =
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors";

export function InitiativeListItem({ initiative, pendingApplications, onDelete }: InitiativeListItemProps) {
  const base = `/dashboard/initiatives/${initiative.id}`;

  return (
    <li className="flex flex-col gap-4 rounded-2xl border border-dark/10 bg-white p-4 sm:flex-row sm:items-center">
      <CoverImage
        src={initiative.coverImage}
        alt=""
        iconName={initiative.category.icon}
        className="h-24 w-full shrink-0 rounded-xl sm:h-20 sm:w-28"
        iconClassName="h-8 w-8"
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={initiative.status} />
          <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-bold text-accent-dark">
            {initiative.category.name}
          </span>
        </div>
        <h3 className="mt-2 line-clamp-1 font-bold text-dark">{initiative.title}</h3>
        <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-dark/60">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {initiative.wilaya.name}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" aria-hidden="true" />
            {formatNumber(initiative.membersCount)} عضو
          </span>
          <span>آخر تحديث: {formatDate(initiative.updatedAt)}</span>
        </p>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Link
          href={base}
          aria-label={`عرض ${initiative.title}`}
          className={`${actionClasses} border-dark/15 text-dark hover:bg-dark/5`}
        >
          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
          عرض
        </Link>
        <Link
          href={`${base}/edit`}
          aria-label={`تعديل ${initiative.title}`}
          className={`${actionClasses} border-primary/30 text-primary hover:bg-primary/10`}
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          تعديل
        </Link>
        <Link
          href={`${base}/applications`}
          aria-label={`طلبات الانضمام إلى ${initiative.title}`}
          className={`${actionClasses} border-accent/30 text-accent-dark hover:bg-accent/10`}
        >
          <ClipboardList className="h-3.5 w-3.5" aria-hidden="true" />
          طلبات الانضمام
          {pendingApplications > 0 && (
            <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
              {pendingApplications}
            </span>
          )}
        </Link>
        <Link
          href={`${base}/team`}
          aria-label={`فريق ${initiative.title}`}
          className={`${actionClasses} border-dark/15 text-dark hover:bg-dark/5`}
        >
          <UsersRound className="h-3.5 w-3.5" aria-hidden="true" />
          الفريق
        </Link>
        <button
          type="button"
          onClick={() => onDelete(initiative)}
          aria-label={`حذف ${initiative.title}`}
          className={`${actionClasses} border-red-200 text-red-700 hover:bg-red-50`}
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          حذف
        </button>
      </div>
    </li>
  );
}
