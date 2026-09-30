import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, CalendarClock, CalendarDays, MapPin, Users } from "lucide-react";
import type { InitiativeWithRelations } from "@/types";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { CoverImage } from "@/components/ui/CoverImage";
import { StatusBadge } from "./StatusBadge";
import { NeedsList } from "./NeedsList";
import { ParticipationOpportunities } from "@/components/applications/ParticipationOpportunities";
import { JoinInitiativeCard } from "@/components/applications/JoinInitiativeCard";
import { getOpportunities } from "@/lib/applications";
import { formatDate, formatNumber } from "@/lib/utils";

interface InitiativeDetailsViewProps {
  initiative: InitiativeWithRelations;
  backHref?: string;
  backLabel?: string;
  /** Optional notice rendered above the hero (used by the dashboard preview). */
  banner?: ReactNode;
}

/**
 * Presentational initiative page body. Shared by the public details route
 * (data from the server-side service layer) and the dashboard preview
 * (data from the client-side mock store) so both render identically.
 */
export function InitiativeDetailsView({
  initiative,
  backHref = "/initiatives",
  backLabel = "الرجوع لكل المبادرات",
  banner,
}: InitiativeDetailsViewProps) {
  const goals = initiative.goals ?? [];
  const requiredSkills = initiative.requiredSkills ?? [];
  const opportunities = getOpportunities(initiative);

  return (
    <article className="pb-16">
      {banner && <Container className="py-4">{banner}</Container>}

      <CoverImage
        src={initiative.coverImage}
        alt={initiative.title}
        iconName={initiative.category.icon}
        className="h-48 sm:h-64"
        iconClassName="h-20 w-20"
      />

      <Container className="-mt-10 sm:-mt-14">
        <div className="relative rounded-2xl border border-dark/10 bg-white p-6 shadow-sm sm:p-8">
          <Link
            href={backHref}
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-dark/60 hover:text-primary"
          >
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            {backLabel}
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent-dark">
              {initiative.category.name}
            </span>
            <StatusBadge status={initiative.status} />
          </div>

          <h1 className="mt-4 text-2xl font-extrabold text-dark sm:text-3xl">{initiative.title}</h1>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-dark/70">
            {initiative.shortDescription}
          </p>

          <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-3 border-t border-dark/10 pt-5 text-sm text-dark/70">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
              <dt className="sr-only">الولاية</dt>
              <dd>{initiative.wilaya.name}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-primary" aria-hidden="true" />
              <dt className="sr-only">عدد الأعضاء</dt>
              <dd>{formatNumber(initiative.membersCount)} عضو مساهم</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" />
              <dt className="sr-only">تاريخ الإنشاء</dt>
              <dd>نُشرت في {formatDate(initiative.createdAt)}</dd>
            </div>
            {initiative.startDate && (
              <div className="flex items-center gap-1.5">
                <CalendarClock className="h-4 w-4 text-primary" aria-hidden="true" />
                <dt className="sr-only">تاريخ البدء</dt>
                <dd>تاريخ البدء: {formatDate(initiative.startDate)}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="flex flex-col gap-8 lg:col-span-2">
            <section>
              <h2 className="mb-3 text-lg font-bold text-dark">عن المبادرة</h2>
              <p className="whitespace-pre-line leading-relaxed text-dark/80">{initiative.description}</p>
            </section>

            {initiative.targetAudience && (
              <section>
                <h2 className="mb-3 text-lg font-bold text-dark">الفئة المستهدفة</h2>
                <p className="leading-relaxed text-dark/80">{initiative.targetAudience}</p>
              </section>
            )}

            {goals.length > 0 && (
              <section>
                <h2 className="mb-3 text-lg font-bold text-dark">أهداف المبادرة</h2>
                <ul className="list-disc space-y-1.5 ps-5 leading-relaxed text-dark/80 marker:text-primary">
                  {goals.map((goal) => (
                    <li key={goal}>{goal}</li>
                  ))}
                </ul>
              </section>
            )}

            <ParticipationOpportunities opportunities={opportunities} />

            <section>
              <h2 className="mb-3 text-lg font-bold text-dark">احتياجات المبادرة</h2>
              <NeedsList needs={initiative.needs} />
            </section>

            {requiredSkills.length > 0 && (
              <section>
                <h2 className="mb-3 text-lg font-bold text-dark">المهارات المطلوبة</h2>
                <ul className="flex flex-wrap gap-2">
                  {requiredSkills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {initiative.tags.length > 0 && (
              <section>
                <h2 className="mb-3 text-lg font-bold text-dark">وسوم</h2>
                <ul className="flex flex-wrap gap-2">
                  {initiative.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full bg-dark/5 px-3 py-1 text-xs font-medium text-dark/70"
                    >
                      #{tag}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className="flex flex-col gap-6">
            <JoinInitiativeCard initiative={initiative} />

            <div className="rounded-2xl border border-dark/10 bg-white p-6">
              <h2 className="mb-4 text-sm font-bold text-dark/60">المنظّم</h2>
              <div className="flex items-center gap-3">
                <Avatar
                  name={initiative.organizer.name}
                  colorClass={initiative.organizer.avatarColor}
                  src={initiative.organizer.avatarUrl}
                />
                <div>
                  <p className="font-bold text-dark">{initiative.organizer.name}</p>
                  <p className="text-xs text-dark/60">{initiative.wilaya.name}</p>
                </div>
              </div>
              {initiative.organizer.bio && (
                <p className="mt-4 text-sm leading-relaxed text-dark/70">{initiative.organizer.bio}</p>
              )}
              <Button
                href={`mailto:contact@souk-mubadarat.dz?subject=${encodeURIComponent(
                  `استفسار حول مبادرة: ${initiative.title}`,
                )}`}
                variant="outline"
                size="sm"
                className="mt-5 w-full"
              >
                تواصل مع المنظّم
              </Button>
            </div>

            <div className="rounded-2xl bg-primary/5 p-6 text-center">
              <p className="text-sm leading-relaxed text-dark/70">
                عندك مبادرة مشابهة؟ شاركها مع المجتمع.
              </p>
              <Button href="/initiatives/new" size="sm" className="mt-4 w-full">
                انشر مبادرتك
              </Button>
            </div>
          </aside>
        </div>
      </Container>
    </article>
  );
}
