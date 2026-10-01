"use client";

import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";
import type {
  Application,
  ApplicationWithRelations,
  Category,
  Conversation,
  ConversationWithRelations,
  DashboardStats,
  Initiative,
  InitiativeWithRelations,
  Message,
  MockStoreSeed,
  Notification,
  ParticipationRole,
  StoreNotice,
  User,
  Wilaya,
} from "@/types";
import {
  ROLE_LABELS,
  changeMemberRole as changeMemberRoleRule,
  getJoinEligibility as getJoinEligibilityRule,
  getOfferedRoles,
  getTeamMembers,
  membersDelta,
  removeMember as removeMemberRule,
  reviewApplication as reviewApplicationRule,
  submitApplication as submitApplicationRule,
  toApplicationDraft,
  validateApplicationForm,
  withdrawApplication as withdrawApplicationRule,
  type ApplicationFormValues,
  type JoinEligibility,
  type ReviewDecision,
} from "@/lib/applications";
import {
  onApplicationAccepted,
  onApplicationRejected,
  onApplicationSubmitted,
  onApplicationWithdrawn,
  onMemberRemoved,
  onMemberRoleChanged,
  onMessageSent,
  countUnread,
  type EventContext,
} from "@/lib/notifications";
import {
  buildConversation,
  byOldestMessage,
  composeMessage,
  countUnreadMessages,
  findConversation,
  getOtherParticipantId,
} from "@/lib/messaging";
import { fail, ok, type Result } from "@/lib/result";
import {
  createInitiativeRecord,
  updateInitiativeRecord,
  type InitiativeFormValues,
} from "@/lib/forms/initiative-form";
import { applyProfileValues, type ProfileFormValues } from "@/lib/forms/profile-form";
import { todayIsoDate } from "@/lib/utils";
import { computeDashboardStats, createInitialState, mockStoreReducer } from "./reducer";
import {
  selectApplications,
  selectConversations,
  selectNotifications,
  selectOwnedInitiatives,
  selectUserLookup,
} from "./selectors";

/** Shown wherever data was just changed, so nobody mistakes it for real persistence. */
export const TEMPORARY_DATA_NOTE =
  "هذه البيانات مؤقتة ومحفوظة في ذاكرة المتصفح فقط، وستُمسح عند تحديث الصفحة.";

export interface MockStore {
  currentUser: User;
  categories: Category[];
  wilayas: Wilaya[];
  /** The current user's initiatives with relations resolved, newest first. */
  initiatives: InitiativeWithRelations[];
  stats: DashboardStats;
  notice: StoreNotice | null;
  getInitiative: (id: string) => InitiativeWithRelations | undefined;
  /** Adds a new initiative from validated form values and returns it. */
  createInitiative: (values: InitiativeFormValues) => Initiative;
  /** Returns `false` if the initiative doesn't exist. */
  updateInitiative: (id: string, values: InitiativeFormValues) => boolean;
  deleteInitiative: (id: string) => void;
  updateProfile: (values: ProfileFormValues) => void;
  /** Restores the original seed data. */
  resetData: () => void;
  dismissNotice: () => void;

  /* ------------------------- Applications & team ------------------------- */
  /** Every application in the store (submitted by the user or received), newest first. */
  applications: ApplicationWithRelations[];
  /** Applications the current user submitted. */
  myApplications: ApplicationWithRelations[];
  /** Applications received on one of the user's initiatives. */
  getApplicationsForInitiative: (initiativeId: string) => ApplicationWithRelations[];
  /** Accepted applications = team members. Derived, so it always matches applications. */
  getTeamForInitiative: (initiativeId: string) => ApplicationWithRelations[];
  /** Mock ownership check: is this one of the current user's initiatives? */
  isOwnerOf: (initiativeId: string) => boolean;
  /** Can the current user apply to this initiative? Explains why not. */
  getJoinEligibility: (initiative: Pick<Initiative, "id" | "status" | "organizerId">) => JoinEligibility;
  submitApplication: (initiative: InitiativeWithRelations, values: ApplicationFormValues) => Result<Application>;
  withdrawApplication: (applicationId: string) => Result<Application>;
  reviewApplication: (applicationId: string, decision: ReviewDecision, note: string) => Result<Application>;
  changeMemberRole: (applicationId: string, role: ParticipationRole) => Result<Application>;
  removeMember: (applicationId: string) => Result<Application>;

  /* ---------------------------- Notifications ---------------------------- */
  /** The current user's notifications, newest first. */
  notifications: Notification[];
  getNotifications: () => Notification[];
  getUnreadNotificationsCount: () => number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  /* ------------------------------ Messaging ------------------------------ */
  /** The current user's conversations, most recently active first. */
  conversations: ConversationWithRelations[];
  getConversations: () => ConversationWithRelations[];
  getConversation: (id: string) => ConversationWithRelations | undefined;
  /** Messages of one conversation, oldest first. */
  getMessages: (conversationId: string) => Message[];
  /** Unread messages for the current user; all conversations when no id is given. */
  getUnreadMessagesCount: (conversationId?: string) => number;
  sendMessage: (conversationId: string, content: string) => Result<Message>;
  markConversationAsRead: (conversationId: string) => void;
  /** Opens (or reuses) the 1-to-1 conversation with `participantId`, optionally about an initiative. */
  startConversation: (participantId: string, initiativeId?: string) => Result<Conversation>;
}

const MockStoreContext = createContext<MockStore | null>(null);

function generateLocalId(prefix = "local"): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

/** Ids and clock for building notifications. Only call from event handlers, never during render. */
function newEventContext(): EventContext {
  return { newId: () => generateLocalId("ntf"), now: new Date().toISOString() };
}

const NOT_FOUND = "لم يتم العثور على هذا الطلب.";

interface MockStoreProviderProps {
  seed: MockStoreSeed;
  children: ReactNode;
}

export function MockStoreProvider({ seed, children }: MockStoreProviderProps) {
  const [state, dispatch] = useReducer(mockStoreReducer, seed, createInitialState);

  const value = useMemo<MockStore>(() => {
    const hydrated = selectOwnedInitiatives(state, seed);
    const allApplications = selectApplications(state, seed, hydrated);
    const ownedIds = new Set(state.initiatives.map((item) => item.id));

    /** Commits a rule result to the store; the notice is built from the updated application. */
    const commitUpdate = (
      before: Application,
      result: Result<Application>,
      buildNotice: (after: Application) => StoreNotice,
      buildNotifications: (after: Application, ctx: EventContext) => Notification[],
    ): Result<Application> => {
      if (result.ok) {
        dispatch({
          type: "application/updated",
          application: result.value,
          expectedStatus: before.status,
          membersDelta: membersDelta(before.status, result.value.status),
          notifications: buildNotifications(result.value, newEventContext()),
          notice: buildNotice(result.value),
        });
      }
      return result;
    };
    const applicantName = (id: string) => allApplications.find((a) => a.id === id)?.applicant.name ?? "المتقدّم";
    const initiativeOf = (applicationId: string) => allApplications.find((a) => a.id === applicationId)?.initiative;
    const users = selectUserLookup(state, seed);
    const notifications = selectNotifications(state);
    const conversations = selectConversations(state, seed, hydrated);

    return {
      currentUser: state.currentUser,
      categories: seed.categories,
      wilayas: seed.wilayas,
      initiatives: hydrated,
      stats: computeDashboardStats(state.initiatives, state.applications),
      notice: state.notice,

      getInitiative: (id) => hydrated.find((item) => item.id === id),

      createInitiative: (values) => {
        const categoryName =
          seed.categories.find((c) => c.slug === values.categorySlug)?.name ?? values.categorySlug;
        const initiative = createInitiativeRecord(values, {
          id: generateLocalId(),
          organizerId: state.currentUser.id,
          categoryName,
          today: todayIsoDate(),
        });
        dispatch({
          type: "initiative/added",
          initiative,
          notice: {
            tone: "success",
            message: `تمت إضافة "${initiative.title}" بنجاح. ${TEMPORARY_DATA_NOTE}`,
            action: { label: "عرض المبادرة", href: `/dashboard/initiatives/${initiative.id}` },
          },
        });
        return initiative;
      },

      updateInitiative: (id, values) => {
        const existing = state.initiatives.find((item) => item.id === id);
        if (!existing) return false;
        const initiative = updateInitiativeRecord(existing, values, { today: todayIsoDate() });
        dispatch({
          type: "initiative/updated",
          initiative,
          notice: {
            tone: "success",
            message: `تم حفظ تعديلات "${initiative.title}". ${TEMPORARY_DATA_NOTE}`,
            action: { label: "عرض المبادرة", href: `/dashboard/initiatives/${initiative.id}` },
          },
        });
        return true;
      },

      deleteInitiative: (id) => {
        const existing = state.initiatives.find((item) => item.id === id);
        if (!existing) return;
        dispatch({
          type: "initiative/deleted",
          id,
          notice: {
            tone: "info",
            message: `تم حذف "${existing.title}". ${TEMPORARY_DATA_NOTE}`,
          },
        });
      },

      updateProfile: (values) =>
        dispatch({ type: "profile/updated", user: applyProfileValues(state.currentUser, values) }),

      resetData: () =>
        dispatch({
          type: "store/reset",
          seed,
          notice: { tone: "info", message: "تمت استعادة البيانات التجريبية الأصلية." },
        }),

      dismissNotice: () => dispatch({ type: "notice/dismissed" }),

      applications: allApplications,
      myApplications: allApplications.filter((a) => a.applicantId === state.currentUser.id),
      getApplicationsForInitiative: (initiativeId) =>
        allApplications.filter((a) => a.initiativeId === initiativeId),
      getTeamForInitiative: (initiativeId) =>
        getTeamMembers(allApplications.filter((a) => a.initiativeId === initiativeId)),
      isOwnerOf: (initiativeId) => ownedIds.has(initiativeId),
      getJoinEligibility: (initiative) =>
        getJoinEligibilityRule({ initiative, userId: state.currentUser.id, applications: state.applications }),

      submitApplication: (initiative, values) => {
        const errors = validateApplicationForm(values, { offeredRoles: getOfferedRoles(initiative) });
        if (Object.keys(errors).length > 0) return fail("بيانات الطلب غير مكتملة. راجع الحقول وحاول مرة أخرى.");

        const result = submitApplicationRule({
          id: generateLocalId("app-local"),
          initiative,
          applicantId: state.currentUser.id,
          applications: state.applications,
          draft: toApplicationDraft(values),
          now: new Date().toISOString(),
        });
        if (result.ok) {
          dispatch({
            type: "application/added",
            application: result.value,
            snapshot: initiative,
            notifications: onApplicationSubmitted(newEventContext(), {
              application: result.value,
              initiativeTitle: initiative.title,
              ownerId: initiative.organizerId,
              applicantName: state.currentUser.name,
            }),
            notice: {
              tone: "success",
              message: `تم إرسال طلبك للانضمام إلى "${initiative.title}" وهو الآن قيد المراجعة. ${TEMPORARY_DATA_NOTE}`,
            },
          });
        }
        return result;
      },

      withdrawApplication: (applicationId) => {
        const before = state.applications.find((a) => a.id === applicationId);
        if (!before) return fail(NOT_FOUND);
        const initiative = initiativeOf(applicationId);
        const title = initiative?.title ?? "";
        return commitUpdate(
          before,
          withdrawApplicationRule(before, { userId: state.currentUser.id, now: new Date().toISOString() }),
          () => ({ tone: "info", message: `تم سحب طلبك للانضمام إلى "${title}".` }),
          (after, ctx) =>
            initiative
              ? onApplicationWithdrawn(ctx, {
                  application: after,
                  initiativeTitle: title,
                  ownerId: initiative.organizerId,
                  applicantName: state.currentUser.name,
                })
              : [],
        );
      },

      reviewApplication: (applicationId, decision, note) => {
        const before = state.applications.find((a) => a.id === applicationId);
        if (!before) return fail(NOT_FOUND);
        const name = applicantName(applicationId);
        const title = initiativeOf(applicationId)?.title ?? "";
        // People already on the team (before this decision) hear about a newcomer.
        const teamMemberIds = getTeamMembers(
          allApplications.filter((a) => a.initiativeId === before.initiativeId),
        ).map((a) => a.applicantId);
        return commitUpdate(
          before,
          reviewApplicationRule(before, {
            decision,
            note,
            reviewerId: state.currentUser.id,
            ownsInitiative: ownedIds.has(before.initiativeId),
            now: new Date().toISOString(),
          }),
          (after) => ({
            tone: decision === "ACCEPT" ? "success" : "info",
            message:
              decision === "ACCEPT"
                ? `تم قبول طلب ${name} ("${ROLE_LABELS[after.role]}") وانضم إلى فريق المبادرة.`
                : `تم رفض طلب ${name} وحُفظ سبب الرفض.`,
            ...(decision === "ACCEPT"
              ? { action: { label: "عرض الفريق", href: `/dashboard/initiatives/${after.initiativeId}/team` } }
              : {}),
          }),
          (after, ctx) =>
            decision === "ACCEPT"
              ? onApplicationAccepted(ctx, {
                  application: after,
                  initiativeTitle: title,
                  reviewerId: state.currentUser.id,
                  applicantName: name,
                  teamMemberIds,
                })
              : onApplicationRejected(ctx, {
                  application: after,
                  initiativeTitle: title,
                  reviewerId: state.currentUser.id,
                }),
        );
      },

      changeMemberRole: (applicationId, role) => {
        const before = state.applications.find((a) => a.id === applicationId);
        if (!before) return fail(NOT_FOUND);
        const name = applicantName(applicationId);
        const title = initiativeOf(applicationId)?.title ?? "";
        return commitUpdate(
          before,
          changeMemberRoleRule(before, {
            role,
            ownsInitiative: ownedIds.has(before.initiativeId),
            now: new Date().toISOString(),
          }),
          (after) => ({ tone: "success", message: `تم تغيير دور ${name} إلى "${ROLE_LABELS[after.role]}".` }),
          (after, ctx) =>
            onMemberRoleChanged(ctx, {
              application: after,
              previousRole: before.role,
              initiativeTitle: title,
              actorId: state.currentUser.id,
            }),
        );
      },

      removeMember: (applicationId) => {
        const before = state.applications.find((a) => a.id === applicationId);
        if (!before) return fail(NOT_FOUND);
        const name = applicantName(applicationId);
        const title = initiativeOf(applicationId)?.title ?? "";
        return commitUpdate(
          before,
          removeMemberRule(before, { ownsInitiative: ownedIds.has(before.initiativeId), now: new Date().toISOString() }),
          () => ({ tone: "info", message: `تمت إزالة ${name} من فريق المبادرة.` }),
          (after, ctx) =>
            onMemberRemoved(ctx, { application: after, initiativeTitle: title, actorId: state.currentUser.id }),
        );
      },

      notifications,
      getNotifications: () => notifications,
      getUnreadNotificationsCount: () => countUnread(notifications),
      markNotificationAsRead: (id) => dispatch({ type: "notification/read", id, now: new Date().toISOString() }),
      markAllNotificationsAsRead: () => dispatch({ type: "notifications/allRead", now: new Date().toISOString() }),

      conversations,
      getConversations: () => conversations,
      getConversation: (id) => conversations.find((c) => c.id === id),
      getMessages: (conversationId) =>
        state.messages.filter((m) => m.conversationId === conversationId).sort(byOldestMessage),
      getUnreadMessagesCount: (conversationId) =>
        countUnreadMessages(
          state.messages.filter((m) =>
            state.conversations.some((c) => c.id === m.conversationId && c.participantIds.includes(state.currentUser.id)),
          ),
          state.currentUser.id,
          conversationId,
        ),

      sendMessage: (conversationId, content) => {
        const conversation = state.conversations.find((c) => c.id === conversationId);
        if (!conversation) return fail("لم يتم العثور على هذه المحادثة.");
        const now = new Date().toISOString();
        const result = composeMessage({
          id: generateLocalId("msg"),
          conversation,
          senderId: state.currentUser.id,
          content,
          now,
        });
        if (!result.ok) return result;
        const recipientId = getOtherParticipantId(conversation, state.currentUser.id);
        dispatch({
          type: "message/sent",
          message: result.value,
          notifications: recipientId
            ? onMessageSent(newEventContext(), {
                message: result.value,
                conversation,
                senderName: state.currentUser.name,
                recipientId,
              })
            : [],
        });
        return result;
      },

      markConversationAsRead: (conversationId) =>
        dispatch({ type: "conversation/read", conversationId, now: new Date().toISOString() }),

      startConversation: (participantId, initiativeId) => {
        if (!users.has(participantId)) return fail("لم يتم العثور على هذا المستخدم.");
        const existing = findConversation(state.conversations, state.currentUser.id, participantId, initiativeId);
        if (existing) return ok(existing);
        const created = buildConversation({
          id: generateLocalId("conv"),
          userId: state.currentUser.id,
          otherUserId: participantId,
          initiativeId,
          now: new Date().toISOString(),
        });
        if (created.ok) dispatch({ type: "conversation/started", conversation: created.value });
        return created;
      },
    };
  }, [seed, state]);

  return <MockStoreContext.Provider value={value}>{children}</MockStoreContext.Provider>;
}

export function useMockStore(): MockStore {
  const context = useContext(MockStoreContext);
  if (!context) throw new Error("useMockStore must be used inside <MockStoreProvider>");
  return context;
}
