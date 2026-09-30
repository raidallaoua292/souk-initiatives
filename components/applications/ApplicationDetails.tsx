import type { ApplicationWithRelations } from "@/types";
import { AVAILABILITY_LABELS, COMMITMENT_LABELS } from "@/lib/applications";
import { formatDate } from "@/lib/utils";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";
import { RoleBadge } from "./RoleBadge";

interface ApplicationDetailsProps {
  application: ApplicationWithRelations;
  /** Show which initiative this is for (useful in "my applications"). */
  showInitiative?: boolean;
}

/** Full read-only view of one application: role, skills, availability, message and its review/withdrawal history. */
export function ApplicationDetails({ application, showInitiative }: ApplicationDetailsProps) {
  return (
    <dl className="space-y-4 text-sm">
      {showInitiative && (
        <div>
          <dt className="text-xs font-semibold text-dark/50">المبادرة</dt>
          <dd className="mt-0.5 font-bold text-dark">{application.initiative.title}</dd>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <RoleBadge role={application.role} />
        <ApplicationStatusBadge status={application.status} />
      </div>

      <div>
        <dt className="text-xs font-semibold text-dark/50">المهارات المطروحة</dt>
        <dd className="mt-1.5">
          {application.skills.length > 0 ? (
            <ul className="flex flex-wrap gap-1.5">
              {application.skills.map((skill) => (
                <li key={skill} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  {skill}
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-dark/50">لم تُحدَّد مهارات</span>
          )}
        </dd>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <dt className="text-xs font-semibold text-dark/50">التوفر</dt>
          <dd className="mt-0.5 text-dark/80">{AVAILABILITY_LABELS[application.availability]}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold text-dark/50">الالتزام</dt>
          <dd className="mt-0.5 text-dark/80">{COMMITMENT_LABELS[application.commitment]}</dd>
        </div>
      </div>

      <div>
        <dt className="text-xs font-semibold text-dark/50">رسالة الدافع</dt>
        <dd className="mt-1 whitespace-pre-line leading-relaxed text-dark/80">{application.message}</dd>
      </div>

      {application.supportingInfo && (
        <div>
          <dt className="text-xs font-semibold text-dark/50">معلومات إضافية</dt>
          <dd className="mt-1 whitespace-pre-line leading-relaxed text-dark/80">{application.supportingInfo}</dd>
        </div>
      )}

      <p className="text-xs text-dark/50">قُدّم الطلب في {formatDate(application.submittedAt)}</p>

      {application.reviewedAt && (
        <div className="rounded-xl bg-dark/5 p-3 text-xs text-dark/70">
          <p className="font-semibold text-dark">
            {application.status === "ACCEPTED" ? "تم القبول" : "تم الرفض"} في {formatDate(application.reviewedAt)}
          </p>
          {application.reviewNote && <p className="mt-1 leading-relaxed">{application.reviewNote}</p>}
        </div>
      )}

      {application.withdrawnAt && (
        <div className="rounded-xl bg-dark/5 p-3 text-xs text-dark/70">
          تم سحب الطلب في {formatDate(application.withdrawnAt)}
          {application.withdrawnBy === "OWNER" ? " (من طرف منظّم المبادرة)" : " (من طرف المتقدّم)"}
        </div>
      )}
    </dl>
  );
}
