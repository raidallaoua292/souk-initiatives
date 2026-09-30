import type { ApplicationWithRelations, InitiativeWithRelations, MockStoreSeed, User } from "@/types";
import { createRelationLookups, hydrateInitiative } from "@/lib/hydrate";
import { byNewestSubmitted } from "@/lib/applications/domain";
import type { MockStoreState } from "./reducer";

/** Owned initiatives with relations resolved, newest first. */
export function selectOwnedInitiatives(state: MockStoreState, seed: MockStoreSeed): InitiativeWithRelations[] {
  const lookups = createRelationLookups(seed.categories, seed.wilayas, [state.currentUser]);
  return state.initiatives
    .flatMap((item) => {
      const hydrated = hydrateInitiative(item, lookups);
      return hydrated ? [hydrated] : [];
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/**
 * Every application in the store with its initiative and applicant resolved.
 * Owned initiatives come from live state (so edits show up); other initiatives
 * come from the snapshots taken when the application was created/seeded.
 */
export function selectApplications(
  state: MockStoreState,
  seed: MockStoreSeed,
  ownedInitiatives: InitiativeWithRelations[],
): ApplicationWithRelations[] {
  const initiativeById = new Map<string, InitiativeWithRelations>([
    ...state.initiativeSnapshots.map((i) => [i.id, i] as const),
    ...ownedInitiatives.map((i) => [i.id, i] as const), // owned wins over any snapshot
  ]);
  const userById = new Map<string, User>([
    ...seed.applicants.map((u) => [u.id, u] as const),
    [state.currentUser.id, state.currentUser],
  ]);

  return state.applications
    .flatMap((application) => {
      const initiative = initiativeById.get(application.initiativeId);
      const applicant = userById.get(application.applicantId);
      return initiative && applicant ? [{ ...application, initiative, applicant }] : [];
    })
    .sort(byNewestSubmitted);
}
