"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { RotateCcw, UsersRound } from "lucide-react";
import type { PersonSummary, Wilaya } from "@/types";
import { DEFAULT_PEOPLE_FILTERS, collectSkills, filterPeople, isFiltered, type PeopleFilters } from "@/lib/people";
import { SearchBar } from "@/components/forms/SearchBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { PersonCard } from "./PersonCard";

interface PeopleExplorerProps {
  people: PersonSummary[];
  wilayas: Wilaya[];
}

const selectClasses =
  "w-full rounded-xl border border-dark/15 bg-white px-3.5 py-2.5 text-sm text-dark outline-none focus:border-primary";

export function PeopleExplorer({ people, wilayas }: PeopleExplorerProps) {
  const params = useSearchParams();
  const [filters, setFilters] = useState<PeopleFilters>(() => ({
    query: params.get("query") ?? "",
    wilayaSlug: params.get("wilaya") ?? "all",
    skill: params.get("skill") ?? "all",
  }));

  const skills = useMemo(() => collectSkills(people), [people]);
  // Only offer wilayas that actually have members, so no filter leads to an empty page.
  const wilayasWithPeople = useMemo(() => {
    const used = new Set(people.map((p) => p.user.wilayaSlug));
    return wilayas.filter((w) => used.has(w.slug));
  }, [people, wilayas]);
  const results = useMemo(() => filterPeople(people, filters), [people, filters]);

  return (
    <div className="flex flex-col gap-6">
      <SearchBar
        id="people-search"
        label="ابحث عن شخص"
        placeholder="ابحث بالاسم أو المهارة أو الولاية..."
        defaultValue={filters.query}
        onSearch={(query) => setFilters((current) => ({ ...current, query }))}
        size="lg"
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label htmlFor="people-filter-wilaya" className="mb-1.5 block text-xs font-semibold text-dark/60">
            الولاية
          </label>
          <select
            id="people-filter-wilaya"
            className={selectClasses}
            value={filters.wilayaSlug}
            onChange={(event) => setFilters({ ...filters, wilayaSlug: event.target.value })}
          >
            <option value="all">كل الولايات</option>
            {wilayasWithPeople.map((wilaya) => (
              <option key={wilaya.code} value={wilaya.slug}>
                {wilaya.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="people-filter-skill" className="mb-1.5 block text-xs font-semibold text-dark/60">
            المهارة
          </label>
          <select
            id="people-filter-skill"
            className={selectClasses}
            value={filters.skill}
            onChange={(event) => setFilters({ ...filters, skill: event.target.value })}
          >
            <option value="all">كل المهارات</option>
            {skills.map(({ skill, count }) => (
              <option key={skill} value={skill}>
                {count > 1 ? `${skill} (${count})` : skill}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button
            type="button"
            disabled={!isFiltered(filters)}
            onClick={() => setFilters(DEFAULT_PEOPLE_FILTERS)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dark/15 bg-white px-3.5 py-2.5 text-sm font-semibold text-dark/70 transition-colors hover:bg-dark/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            إعادة تعيين
          </button>
        </div>
      </div>

      <p className="text-sm text-dark/60" aria-live="polite">
        {results.length} عضو من أصل {people.length}
      </p>

      {results.length === 0 ? (
        <EmptyState
          icon={<UsersRound className="h-7 w-7" aria-hidden="true" />}
          title="لا يوجد أعضاء مطابقون"
          description="جرّب كلمة بحث أخرى أو أزل بعض الفلاتر."
          action={
            <button
              type="button"
              onClick={() => setFilters(DEFAULT_PEOPLE_FILTERS)}
              className="text-sm font-bold text-primary hover:underline"
            >
              إعادة تعيين الفلاتر
            </button>
          }
        />
      ) : (
        <ul id="people-list" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((person) => (
            <PersonCard key={person.user.id} person={person} />
          ))}
        </ul>
      )}
    </div>
  );
}
