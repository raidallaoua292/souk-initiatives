import { ApplicationStatus } from "@/types";
import type {
  Application,
  DashboardStats,
  Initiative,
  InitiativeWithRelations,
  MockStoreSeed,
  StoreNotice,
  User,
} from "@/types";
import { findActiveApplication } from "@/lib/applications/domain";

/** Client-side mock state. Lives in memory only — a page refresh resets it. */
export interface MockStoreState {
  currentUser: User;
  /** Normalized initiatives owned by the current user. */
  initiatives: Initiative[];
  /** Applications submitted by the user, plus those received on their initiatives. */
  applications: Application[];
  /** Public initiatives the user applied to (needed to display those applications). */
  initiativeSnapshots: InitiativeWithRelations[];
  notice: StoreNotice | null;
}

export type MockStoreAction =
  | { type: "initiative/added"; initiative: Initiative; notice: StoreNotice }
  | { type: "initiative/updated"; initiative: Initiative; notice: StoreNotice }
  | { type: "initiative/deleted"; id: string; notice: StoreNotice }
  | { type: "profile/updated"; user: User }
  | {
      type: "application/added";
      application: Application;
      /** Registered so the application can be displayed even though the initiative isn't owned. */
      snapshot: InitiativeWithRelations;
      notice: StoreNotice;
    }
  | {
      type: "application/updated";
      application: Application;
      /** The status the caller saw. If the stored one differs, the update is stale and ignored. */
      expectedStatus: ApplicationStatus;
      /** Team-size change on the owning initiative (+1 join, -1 leave, 0 otherwise). */
      membersDelta: number;
      notice: StoreNotice;
    }
  | { type: "store/reset"; seed: MockStoreSeed; notice: StoreNotice }
  | { type: "notice/dismissed" };

export function createInitialState(seed: MockStoreSeed): MockStoreState {
  return {
    currentUser: seed.currentUser,
    initiatives: seed.initiatives,
    applications: seed.applications,
    initiativeSnapshots: seed.initiativeSnapshots,
    notice: null,
  };
}

/** Pure: never generates ids or reads the clock; actions carry complete records. */
export function mockStoreReducer(state: MockStoreState, action: MockStoreAction): MockStoreState {
  switch (action.type) {
    case "initiative/added":
      return { ...state, initiatives: [action.initiative, ...state.initiatives], notice: action.notice };
    case "initiative/updated":
      return {
        ...state,
        initiatives: state.initiatives.map((item) =>
          item.id === action.initiative.id ? action.initiative : item,
        ),
        notice: action.notice,
      };
    case "initiative/deleted":
      return {
        ...state,
        initiatives: state.initiatives.filter((item) => item.id !== action.id),
        // Applications can't outlive the initiative they belong to.
        applications: state.applications.filter((item) => item.initiativeId !== action.id),
        notice: action.notice,
      };
    case "profile/updated":
      return { ...state, currentUser: action.user };

    case "application/added": {
      const { application, snapshot } = action;
      // Last line of defence for the "no duplicate active application" rule.
      if (findActiveApplication(state.applications, application.initiativeId, application.applicantId)) {
        return state;
      }
      const owned = state.initiatives.some((i) => i.id === snapshot.id);
      const hasSnapshot = state.initiativeSnapshots.some((i) => i.id === snapshot.id);
      return {
        ...state,
        applications: [application, ...state.applications],
        initiativeSnapshots: owned || hasSnapshot ? state.initiativeSnapshots : [...state.initiativeSnapshots, snapshot],
        notice: action.notice,
      };
    }

    case "application/updated": {
      const current = state.applications.find((a) => a.id === action.application.id);
      // Stale or unknown: ignore. This is what makes a double accept impossible
      // even if two events were dispatched from the same stale render.
      if (!current || current.status !== action.expectedStatus) return state;
      return {
        ...state,
        applications: state.applications.map((a) => (a.id === action.application.id ? action.application : a)),
        initiatives:
          action.membersDelta === 0
            ? state.initiatives
            : state.initiatives.map((item) =>
                item.id === action.application.initiativeId
                  ? { ...item, membersCount: Math.max(1, item.membersCount + action.membersDelta) }
                  : item,
              ),
        notice: action.notice,
      };
    }

    case "store/reset":
      return { ...createInitialState(action.seed), notice: action.notice };
    case "notice/dismissed":
      return { ...state, notice: null };
  }
}

export function computeDashboardStats(initiatives: Initiative[], applications: Application[]): DashboardStats {
  const ownedIds = new Set(initiatives.map((item) => item.id));
  return {
    totalInitiatives: initiatives.length,
    activeInitiatives: initiatives.filter((item) => item.status === "active").length,
    teamMembers: initiatives.reduce((sum, item) => sum + item.membersCount, 0),
    pendingApplications: applications.filter(
      (a) => a.status === ApplicationStatus.PENDING && ownedIds.has(a.initiativeId),
    ).length,
  };
}
