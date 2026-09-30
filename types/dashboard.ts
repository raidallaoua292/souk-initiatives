import type { Application } from "./application";
import type { Category } from "./category";
import type { Initiative, InitiativeWithRelations } from "./initiative";
import type { User } from "./user";
import type { Wilaya } from "./wilaya";

/** Initial data the server hands to the client-side mock store. */
export interface MockStoreSeed {
  currentUser: User;
  /** Normalized initiatives owned by `currentUser`. */
  initiatives: Initiative[];
  categories: Category[];
  wilayas: Wilaya[];
  /** Applications the user submitted, plus applications received on their initiatives. */
  applications: Application[];
  /** Public initiatives referenced by the user's own applications. */
  initiativeSnapshots: InitiativeWithRelations[];
  /** Applicants on the user's initiatives (everyone except the current user). */
  applicants: User[];
}

export interface DashboardStats {
  totalInitiatives: number;
  activeInitiatives: number;
  /** Sum of members across the user's initiatives. */
  teamMembers: number;
  /** Pending applications waiting for the owner's review. */
  pendingApplications: number;
}

export type NoticeTone = "success" | "info";

/** A one-off message shown after an action (create, update, delete...). */
export interface StoreNotice {
  tone: NoticeTone;
  message: string;
  action?: { label: string; href: string };
}
