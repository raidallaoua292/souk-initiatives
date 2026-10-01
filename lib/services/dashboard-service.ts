import type { MockStoreSeed } from "@/types";
import { getCategories } from "./category-service";
import { getWilayas } from "./wilaya-service";
import { getCurrentUser, getUsers, getUsersByIds } from "./user-service";
import { getInitiativesByIds, getInitiativesByOrganizer } from "./initiative-service";
import { getApplicationsRelevantToUser } from "./application-service";
import { getNotificationsForUser } from "./notification-service";
import { getConversationsForUser } from "./conversation-service";
import { getMessagesByConversations } from "./message-service";

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
  const [applications, notifications, conversations] = await Promise.all([
    getApplicationsRelevantToUser(currentUser.id, ownedIds),
    getNotificationsForUser(currentUser.id),
    getConversationsForUser(currentUser.id),
  ]);
  const messages = await getMessagesByConversations(conversations.map((c) => c.id));

  // Public initiatives the user applied to (owned ones are already in `initiatives`).
  const ownedIdSet = new Set(ownedIds);
  // Initiatives shown next to applications and conversations (owned ones come from live state).
  const referencedIds = Array.from(
    new Set(
      [
        ...applications.map((a) => a.initiativeId),
        ...conversations.flatMap((c) => (c.initiativeId ? [c.initiativeId] : [])),
      ].filter((id) => !ownedIdSet.has(id)),
    ),
  );
  const applicantIds = Array.from(
    new Set(applications.map((a) => a.applicantId).filter((id) => id !== currentUser.id)),
  );

  // Everyone the user can write to: conversation partners now, and anyone found in the people directory later.
  const contactIds = (await getUsers()).map((user) => user.id).filter((id) => id !== currentUser.id);

  const [initiativeSnapshots, applicants, contacts] = await Promise.all([
    getInitiativesByIds(referencedIds),
    getUsersByIds(applicantIds),
    getUsersByIds(contactIds),
  ]);

  return {
    currentUser,
    categories,
    wilayas,
    initiatives,
    applications,
    initiativeSnapshots,
    applicants,
    notifications,
    conversations,
    messages,
    contacts,
  };
}
