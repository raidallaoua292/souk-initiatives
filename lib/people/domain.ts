import type { PersonSummary } from "@/types";
import { normalizeSearchText } from "@/lib/applications/domain";

export interface PeopleFilters {
  query: string;
  /** Wilaya slug or "all". */
  wilayaSlug: string;
  /** Exact skill name or "all". */
  skill: string;
}

export const DEFAULT_PEOPLE_FILTERS: PeopleFilters = { query: "", wilayaSlug: "all", skill: "all" };

export function isFiltered(filters: PeopleFilters): boolean {
  return filters.query.trim() !== "" || filters.wilayaSlug !== "all" || filters.skill !== "all";
}

/** Case-, hamza- and tashkeel-insensitive search over name, bio, wilaya, skills and interests. */
export function filterPeople(people: PersonSummary[], filters: PeopleFilters): PersonSummary[] {
  const needle = normalizeSearchText(filters.query);
  return people.filter(({ user, wilayaName }) => {
    if (filters.wilayaSlug !== "all" && user.wilayaSlug !== filters.wilayaSlug) return false;
    if (filters.skill !== "all" && !(user.skills ?? []).includes(filters.skill)) return false;
    if (needle === "") return true;
    const haystack = normalizeSearchText(
      [user.name, user.bio ?? "", wilayaName, ...(user.skills ?? []), ...(user.interests ?? [])].join(" "),
    );
    return haystack.includes(needle);
  });
}

/** Every skill in the directory with how many people list it, most common first. */
export function collectSkills(people: PersonSummary[]): { skill: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const { user } of people) for (const skill of user.skills ?? []) counts.set(skill, (counts.get(skill) ?? 0) + 1);
  return Array.from(counts, ([skill, count]) => ({ skill, count })).sort(
    (a, b) => b.count - a.count || a.skill.localeCompare(b.skill, "ar"),
  );
}
