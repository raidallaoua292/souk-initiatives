import type { MockStoreSeed } from "@/types";
import { getCategories } from "./category-service";
import { getWilayas } from "./wilaya-service";
import { getCurrentUser, getUsersByIds } from "./user-service";
import { getInitiativesByIds, getInitiativesByOrganizer } from "./initiative-service";
import { getApplicationsRelevantToUser } from "./application-service";

/**
 * Everything the client-side dashboard store needs to start from.
 * Reads through the normal service layer, so swapping the data source later
 * (Prisma, an API...) doesn't touch the store or any UI component.
 */
export async function getMockStoreSeed(): Promise<MockStoreSeed> {
  const currentUser = await getCurrentUser();
  const [categories, wilayas, initiatives] = await Promise.all([
    getCategories(),
    getWilayas(),
    getInitiativesByOrganizer(currentUser.id),
  ]);

  const ownedIds = initiatives.map((initiative) => initiative.id);
  const applications = await getApplicationsRelevantToUser(currentUser.id, ownedIds);

  // Public initiatives the user applied to (owned ones are already in `initiatives`).
  const ownedIdSet = new Set(ownedIds);
  const referencedIds = Array.from(
    new Set(applications.map((a) => a.initiativeId).filter((id) => !ownedIdSet.has(id))),
  );
  const applicantIds = Array.from(
    new Set(applications.map((a) => a.applicantId).filter((id) => id !== currentUser.id)),
  );

  const [initiativeSnapshots, applicants] = await Promise.all([
    getInitiativesByIds(referencedIds),
    getUsersByIds(applicantIds),
  ]);

  return { currentUser, categories, wilayas, initiatives, applications, initiativeSnapshots, applicants };
}
