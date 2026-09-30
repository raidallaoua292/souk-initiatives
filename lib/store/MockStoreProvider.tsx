"use client";

import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";
import type {
  Application,
  ApplicationWithRelations,
  Category,
  DashboardStats,
  Initiative,
  InitiativeWithRelations,
  MockStoreSeed,
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
import { fail, type Result } from "@/lib/result";
import {
  createInitiativeRecord,
  updateInitiativeRecord,
  type InitiativeFormValues,
} from "@/lib/forms/initiative-form";
import { applyProfileValues, type ProfileFormValues } from "@/lib/forms/profile-form";
import { todayIsoDate } from "@/lib/utils";
import { computeDashboardStats, createInitialState, mockStoreReducer } from "./reducer";
import { selectApplications, selectOwnedInitiatives } from "./selectors";

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
}

const MockStoreContext = createContext<MockStore | null>(null);

function generateLocalId(prefix = "local"): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
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
    ): Result<Application> => {
      if (result.ok) {
        dispatch({
          type: "application/updated",
          application: result.value,
          expectedStatus: before.status,
          membersDelta: membersDelta(before.status, result.value.status),
          notice: buildNotice(result.value),
        });
      }
      return result;
    };
    const applicantName = (id: string) => allApplications.find((a) => a.id === id)?.applicant.name ?? "المتقدّم";

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
        const title = allApplications.find((a) => a.id === applicationId)?.initiative.title ?? "";
        return commitUpdate(
          before,
          withdrawApplicationRule(before, { userId: state.currentUser.id, now: new Date().toISOString() }),
          () => ({ tone: "info", message: `تم سحب طلبك للانضمام إلى "${title}".` }),
        );
      },

      reviewApplication: (applicationId, decision, note) => {
        const before = state.applications.find((a) => a.id === applicationId);
        if (!before) return fail(NOT_FOUND);
        const name = applicantName(applicationId);
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
        );
      },

      changeMemberRole: (applicationId, role) => {
        const before = state.applications.find((a) => a.id === applicationId);
        if (!before) return fail(NOT_FOUND);
        const name = applicantName(applicationId);
        return commitUpdate(
          before,
          changeMemberRoleRule(before, {
            role,
            ownsInitiative: ownedIds.has(before.initiativeId),
            now: new Date().toISOString(),
          }),
          (after) => ({ tone: "success", message: `تم تغيير دور ${name} إلى "${ROLE_LABELS[after.role]}".` }),
        );
      },

      removeMember: (applicationId) => {
        const before = state.applications.find((a) => a.id === applicationId);
        if (!before) return fail(NOT_FOUND);
        const name = applicantName(applicationId);
        return commitUpdate(
          before,
          removeMemberRule(before, { ownsInitiative: ownedIds.has(before.initiativeId), now: new Date().toISOString() }),
          () => ({ tone: "info", message: `تمت إزالة ${name} من فريق المبادرة.` }),
        );
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
