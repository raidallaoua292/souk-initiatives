import type { Category, Initiative, InitiativeWithRelations, User, Wilaya } from "@/types";

/** Pre-indexed lookups so relations can be resolved without repeated array scans. */
export interface RelationLookups {
  categoryBySlug: Map<string, Category>;
  wilayaBySlug: Map<string, Wilaya>;
  userById: Map<string, User>;
}

export function createRelationLookups(
  categories: Category[],
  wilayas: Wilaya[],
  users: User[],
): RelationLookups {
  return {
    categoryBySlug: new Map(categories.map((c) => [c.slug, c])),
    wilayaBySlug: new Map(wilayas.map((w) => [w.slug, w])),
    userById: new Map(users.map((u) => [u.id, u])),
  };
}

/**
 * Resolves category / wilaya / organizer for a normalized initiative.
 * Returns `undefined` if any relation is dangling. Shared by the server-side
 * service layer and the client-side mock store so the join logic lives in
 * exactly one place.
 */
export function hydrateInitiative(
  initiative: Initiative,
  lookups: RelationLookups,
): InitiativeWithRelations | undefined {
  const category = lookups.categoryBySlug.get(initiative.categorySlug);
  const wilaya = lookups.wilayaBySlug.get(initiative.wilayaSlug);
  const organizer = lookups.userById.get(initiative.organizerId);
  if (!category || !wilaya || !organizer) return undefined;
  return { ...initiative, category, wilaya, organizer };
}
