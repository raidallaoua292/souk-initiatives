import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import type { PersonProfile } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { Container } from "@/components/ui/Container";
import { InitiativeCard } from "@/components/initiatives/InitiativeCard";
import { RoleBadge } from "@/components/applications/RoleBadge";
import { formatDate, formatNumber } from "@/lib/utils";
import { MessagePersonButton } from "./MessagePersonButton";

function Chips({ items, tone }: { items: string[]; tone: "primary" | "neutral" }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className={
            tone === "primary"
              ? "rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary"
              : "rounded-full bg-dark/5 px-3 py-1 text-sm font-semibold text-dark/70"
          }
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Public profile (server-rendered). Only public fields: name, wilaya, bio, skills, interests, activity. */
export function PersonProfileView({ profile }: { profile: PersonProfile }) {
  const { user, wilayaName, organized, participating } = profile;

  return (
    <Container as="section" className="py-10 sm:py-14">
      <Link href="/people" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline">
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
        كل الأشخاص
      </Link>

      <header className="mt-5 flex flex-col gap-5 rounded-2xl border border-dark/10 bg-white p-6 sm:flex-row sm:items-start">
        <Avatar name={user.name} colorClass={user.avatarColor} src={user.avatarUrl} size="lg" />
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-extrabold text-dark sm:text-3xl">{user.name}</h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-dark/70">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {wilayaName}
            </span>
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              {`عضو منذ ${formatDate(user.joinedAt)}`}
            </span>
          </p>
          {user.bio && <p className="mt-3 max-w-2xl leading-relaxed text-dark/80">{user.bio}</p>}
        </div>
        <MessagePersonButton personId={user.id} personName={user.name} />
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-10">
          <section aria-labelledby="organized-heading">
            <h2 id="organized-heading" className="mb-4 text-xl font-extrabold text-dark">
              {`مبادرات ينظمها (${formatNumber(organized.length)})`}
            </h2>
            {organized.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-dark/20 bg-white/60 p-6 text-sm text-dark/70">
                لا ينظم هذا العضو أي مبادرة حاليًا.
              </p>
            ) : (
              <ul id="organized-list" className="grid gap-5 sm:grid-cols-2">
                {organized.map((initiative) => (
                  <li key={initiative.id}>
                    <InitiativeCard initiative={initiative} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-labelledby="participation-heading">
            <h2 id="participation-heading" className="mb-4 text-xl font-extrabold text-dark">
              {`مشاركات في فرق (${formatNumber(participating.length)})`}
            </h2>
            {participating.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-dark/20 bg-white/60 p-6 text-sm text-dark/70">
                لم ينضم هذا العضو إلى فريق مبادرة بعد.
              </p>
            ) : (
              <ul id="participation-list" className="space-y-3">
                {participating.map(({ initiative, role }) => (
                  <li
                    key={initiative.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dark/10 bg-white p-4"
                  >
                    <Link href={`/initiatives/${initiative.slug}`} className="font-bold text-dark hover:text-primary">
                      {initiative.title}
                    </Link>
                    <RoleBadge role={role} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          {user.skills && user.skills.length > 0 && (
            <section aria-labelledby="skills-heading" className="rounded-2xl border border-dark/10 bg-white p-5">
              <h2 id="skills-heading" className="mb-3 text-base font-extrabold text-dark">
                المهارات
              </h2>
              <Chips items={user.skills} tone="primary" />
            </section>
          )}
          {user.interests && user.interests.length > 0 && (
            <section aria-labelledby="interests-heading" className="rounded-2xl border border-dark/10 bg-white p-5">
              <h2 id="interests-heading" className="mb-3 text-base font-extrabold text-dark">
                الاهتمامات
              </h2>
              <Chips items={user.interests} tone="neutral" />
            </section>
          )}
        </aside>
      </div>
    </Container>
  );
}
