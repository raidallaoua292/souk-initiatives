import Link from "next/link";
import { MapPin } from "lucide-react";
import type { PersonSummary } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { formatNumber } from "@/lib/utils";

const MAX_SKILLS = 3;

/** One member in the directory. The whole card is a single link to the public profile. */
export function PersonCard({ person }: { person: PersonSummary }) {
  const { user, wilayaName, initiativesCount, membershipsCount } = person;
  const skills = user.skills ?? [];

  return (
    <li>
      <Link
        href={`/people/${user.id}`}
        className="flex h-full flex-col gap-4 rounded-2xl border border-dark/10 bg-white p-5 transition-colors hover:border-primary/40"
      >
        <span className="flex items-center gap-3">
          <Avatar name={user.name} colorClass={user.avatarColor} src={user.avatarUrl} size="md" />
          <span className="min-w-0">
            <span className="block truncate text-base font-extrabold text-dark">{user.name}</span>
            <span className="mt-0.5 flex items-center gap-1 text-xs text-dark/60">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {wilayaName}
            </span>
          </span>
        </span>

        {user.bio && <span className="line-clamp-2 text-sm leading-relaxed text-dark/70">{user.bio}</span>}

        {skills.length > 0 && (
          <span className="flex flex-wrap gap-1.5">
            {skills.slice(0, MAX_SKILLS).map((skill) => (
              <span key={skill} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                {skill}
              </span>
            ))}
            {skills.length > MAX_SKILLS && (
              <span className="rounded-full bg-dark/5 px-2.5 py-1 text-xs font-semibold text-dark/70">
                {`+${formatNumber(skills.length - MAX_SKILLS)}`}
              </span>
            )}
          </span>
        )}

        <span className="mt-auto flex gap-4 border-t border-dark/10 pt-3 text-xs text-dark/70">
          <span>
            <strong className="text-dark">{formatNumber(initiativesCount)}</strong> مبادرات يديرها
          </span>
          <span>
            <strong className="text-dark">{formatNumber(membershipsCount)}</strong> مشاركات في فرق
          </span>
        </span>
      </Link>
    </li>
  );
}
