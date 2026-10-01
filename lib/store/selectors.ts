import type {
  ApplicationWithRelations,
  ConversationWithRelations,
  InitiativeWithRelations,
  Message,
  MockStoreSeed,
  Notification,
  User,
} from "@/types";
import { createRelationLookups, hydrateInitiative } from "@/lib/hydrate";
import { byNewestSubmitted } from "@/lib/applications/domain";
import { byNewestNotification } from "@/lib/notifications/domain";
import {
  byMostRecentConversation,
  byOldestMessage,
  countUnreadMessages,
  getOtherParticipantId,
  isParticipant,
} from "@/lib/messaging/domain";
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
/** Initiatives by id: owned ones come from live state (edits show up), others from snapshots. */
export function selectInitiativeLookup(
  state: MockStoreState,
  ownedInitiatives: InitiativeWithRelations[],
): Map<string, InitiativeWithRelations> {
  return new Map<string, InitiativeWithRelations>([
    ...state.initiativeSnapshots.map((i) => [i.id, i] as const),
    ...ownedInitiatives.map((i) => [i.id, i] as const), // owned wins over any snapshot
  ]);
}

/** Every user the store can name: applicants, conversation contacts and the current user. */
export function selectUserLookup(state: MockStoreState, seed: MockStoreSeed): Map<string, User> {
  return new Map<string, User>([
    ...seed.applicants.map((u) => [u.id, u] as const),
    ...seed.contacts.map((u) => [u.id, u] as const),
    [state.currentUser.id, state.currentUser],
  ]);
}

/**
 * Every application in the store with its initiative and applicant resolved.
 */
export function selectApplications(
  state: MockStoreState,
  seed: MockStoreSeed,
  ownedInitiatives: InitiativeWithRelations[],
): ApplicationWithRelations[] {
  const initiativeById = selectInitiativeLookup(state, ownedInitiatives);
  const userById = selectUserLookup(state, seed);

  return state.applications
    .flatMap((application) => {
      const initiative = initiativeById.get(application.initiativeId);
      const applicant = userById.get(application.applicantId);
      return initiative && applicant ? [{ ...application, initiative, applicant }] : [];
    })
    .sort(byNewestSubmitted);
}

/** The current user's notifications, newest first. */
export function selectNotifications(state: MockStoreState): Notification[] {
  return state.notifications.filter((n) => n.userId === state.currentUser.id).sort(byNewestNotification);
}

/** The current user's conversations with the other person, initiative and last message resolved. */
export function selectConversations(
  state: MockStoreState,
  seed: MockStoreSeed,
  ownedInitiatives: InitiativeWithRelations[],
): ConversationWithRelations[] {
  const initiativeById = selectInitiativeLookup(state, ownedInitiatives);
  const userById = selectUserLookup(state, seed);
  const me = state.currentUser.id;

  const lastByConversation = new Map<string, Message>();
  for (const message of [...state.messages].sort(byOldestMessage)) {
    lastByConversation.set(message.conversationId, message);
  }

  return state.conversations
    .filter((conversation) => isParticipant(conversation, me))
    .flatMap((conversation) => {
      const otherId = getOtherParticipantId(conversation, me);
      const participant = otherId ? userById.get(otherId) : undefined;
      if (!participant) return [];
      return [
        {
          ...conversation,
          participant,
          initiative: conversation.initiativeId ? initiativeById.get(conversation.initiativeId) : undefined,
          lastMessage: lastByConversation.get(conversation.id),
          unreadCount: countUnreadMessages(state.messages, me, conversation.id),
        },
      ];
    })
    .sort(byMostRecentConversation);
}
