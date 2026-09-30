import { initiatives } from "@/lib/mock-data";
import { getCategories } from "./category-service";
import { getWilayas } from "./wilaya-service";
import { getUsers } from "./user-service";
import { createRelationLookups, hydrateInitiative } from "@/lib/hydrate";
import type {
  Initiative,
  InitiativeStatus,
  InitiativeWithRelations,
} from "@/types";

export interface InitiativeSearchParams {
  query?: string;
  categorySlug?: string;
  wilayaSlug?: string;
  status?: InitiativeStatus | "all";
}

/** Resolves category/wilaya/organizer relations for a batch of initiatives at once. */
async function hydrateAll(records: Initiative[]): Promise<InitiativeWithRelations[]> {
  const [categories, wilayas, users] = await Promise.all([
    getCategories(),
    getWilayas(),
    getUsers(),
  ]);
  const lookups = createRelationLookups(categories, wilayas, users);

  // Skip (rather than crash) any record with a dangling relation —
  // mirrors how a real query with a missing join would simply omit it.
  return records.flatMap((record) => {
    const hydrated = hydrateInitiative(record, lookups);
    return hydrated ? [hydrated] : [];
  });
}

function byNewestFirst(a: Initiative, b: Initiative): number {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

export async function getAllInitiatives(): Promise<InitiativeWithRelations[]> {
  return hydrateAll([...initiatives].sort(byNewestFirst));
}

/** Raw (un-hydrated) initiative records owned by one organizer. */
export async function getInitiativesByOrganizer(organizerId: string): Promise<Initiative[]> {
  return initiatives.filter((initiative) => initiative.organizerId === organizerId);
}

/** Hydrated initiatives for a set of ids (unknown ids are skipped). */
export async function getInitiativesByIds(ids: string[]): Promise<InitiativeWithRelations[]> {
  const wanted = new Set(ids);
  return hydrateAll(initiatives.filter((initiative) => wanted.has(initiative.id)));
}

export async function getFeaturedInitiatives(limit = 6): Promise<InitiativeWithRelations[]> {
  const all = await getAllInitiatives();
  return all.filter((initiative) => initiative.featured).slice(0, limit);
}

export async function getLatestInitiatives(limit = 8): Promise<InitiativeWithRelations[]> {
  const all = await getAllInitiatives();
  return all.slice(0, limit);
}

export async function getInitiativeBySlug(
  slug: string,
): Promise<InitiativeWithRelations | undefined> {
  const record = initiatives.find((i) => i.slug === slug || i.id === slug);
  if (!record) return undefined;
  const [hydrated] = await hydrateAll([record]);
  return hydrated;
}

export async function searchInitiatives(
  params: InitiativeSearchParams = {},
): Promise<InitiativeWithRelations[]> {
  const { query, categorySlug, wilayaSlug, status } = params;
  const all = await getAllInitiatives();

  return all.filter((initiative) => {
    if (categorySlug && categorySlug !== "all" && initiative.categorySlug !== categorySlug) {
      return false;
    }
    if (wilayaSlug && wilayaSlug !== "all" && initiative.wilayaSlug !== wilayaSlug) {
      return false;
    }
    if (status && status !== "all" && initiative.status !== status) {
      return false;
    }
    if (query && query.trim().length > 0) {
      const needle = query.trim().toLowerCase();
      const haystack = [
        initiative.title,
        initiative.shortDescription,
        initiative.category.name,
        initiative.wilaya.name,
        ...initiative.tags,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    return true;
  });
}

export interface PlatformStats {
  totalInitiatives: number;
  activeInitiatives: number;
  totalMembers: number;
  totalWilayas: number;
}

export async function getPlatformStats(): Promise<PlatformStats> {
  const all = await getAllInitiatives();
  return {
    totalInitiatives: all.length,
    activeInitiatives: all.filter((i) => i.status === "active").length,
    totalMembers: all.reduce((sum, i) => sum + i.membersCount, 0),
    totalWilayas: new Set(all.map((i) => i.wilayaSlug)).size,
  };
}

/** Number of initiatives per category slug, used to annotate the category grid. */
export async function getCategoryCounts(): Promise<Record<string, number>> {
  const all = await getAllInitiatives();
  return all.reduce<Record<string, number>>((counts, initiative) => {
    counts[initiative.categorySlug] = (counts[initiative.categorySlug] ?? 0) + 1;
    return counts;
  }, {});
}
