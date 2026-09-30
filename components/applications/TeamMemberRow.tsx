"use client";

import { useState } from "react";
import { UserMinus } from "lucide-react";
import type { ApplicationWithRelations, ParticipationRole } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { ROLE_LABELS, ROLE_ORDER } from "@/lib/applications";
import { useMockStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export function TeamMemberRow({ member, onRemove }: { member: ApplicationWithRelations; onRemove: () => void }) {
  const { changeMemberRole } = useMockStore();
  const [roleError, setRoleError] = useState<string | null>(null);

  function handleRoleChange(role: ParticipationRole) {
    const result = changeMemberRole(member.id, role);
    setRoleError(result.ok ? null : result.error);
  }

  return (
    <li className="rounded-2xl border border-dark/10 bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <Avatar name={member.applicant.name} colorClass={member.applicant.avatarColor} src={member.applicant.avatarUrl} />
          <div>
            <p className="font-bold text-dark">{member.applicant.name}</p>
            <p className="text-xs text-dark/60">انضم في {formatDate(member.reviewedAt ?? member.submittedAt)}</p>
            {member.skills.length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-1.5" aria-label={`مهارات ${member.applicant.name}`}>
                {member.skills.map((skill) => (
                  <li key={skill} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    {skill}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor={`role-${member.id}`} className="sr-only">
              دور {member.applicant.name}
            </label>
            <select
              id={`role-${member.id}`}
              value={member.role}
              onChange={(event) => handleRoleChange(event.target.value as ParticipationRole)}
              className="rounded-full border border-dark/15 bg-white px-3 py-1.5 text-xs font-semibold text-dark"
            >
              {ROLE_ORDER.map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABELS[role]}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={onRemove}
              className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50"
            >
              <UserMinus className="h-3.5 w-3.5" aria-hidden="true" />
              إزالة
            </button>
          </div>
          {roleError && <p className="text-xs font-semibold text-red-700">{roleError}</p>}
        </div>
      </div>
    </li>
  );
}
