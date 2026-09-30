import type { Category } from "./category";
import type { ParticipationOpportunity } from "./participation";
import type { User } from "./user";
import type { Wilaya } from "./wilaya";

/** Lifecycle status of an initiative. */
export type InitiativeStatus = "active" | "upcoming" | "completed" | "paused";

/** The kind of support an initiative is asking for. */
export type InitiativeNeedType =
  | "volunteers"
  | "donations"
  | "equipment"
  | "skills"
  | "partnership";

/** A single concrete need/ask attached to an initiative. */
export interface InitiativeNeed {
  id: string;
  type: InitiativeNeedType;
  /** Short Arabic label, e.g. "متطوعون لتنظيم الحملة". */
  title: string;
  description?: string;
  /** Target quantity (e.g. number of volunteers, or DZD amount). */
  quantityNeeded?: number;
  /** Quantity already secured. */
  quantityFulfilled?: number;
  /** Unit for the quantities, e.g. "متطوع", "دج", "قطعة". */
  unit?: string;
}

/**
 * Normalized initiative record — the shape a future `Initiative` Prisma
 * model would have, storing foreign keys rather than nested objects.
 */
export interface Initiative {
  id: string;
  /** URL-safe latin slug used for routing, e.g. "tandhif-chatt-el-oued". */
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  categorySlug: string;
  wilayaSlug: string;
  status: InitiativeStatus;
  organizerId: string;
  membersCount: number;
  needs: InitiativeNeed[];
  tags: string[];
  featured: boolean;
  /** ISO date strings. */
  createdAt: string;
  updatedAt: string;
  /** Who the initiative is meant to serve. */
  targetAudience?: string;
  /** Concrete goals, one entry per goal. */
  goals?: string[];
  /** Skills volunteers/experts should bring. */
  requiredSkills?: string[];
  /** Expected start date (ISO `YYYY-MM-DD`). */
  startDate?: string;
  /** Cover image: an http(s) URL, or a local `data:image/...` preview. */
  coverImage?: string;
  /**
   * Explicit participation opportunities. When omitted they are derived from
   * `needs` (see `getOpportunities` in lib/applications).
   */
  opportunities?: ParticipationOpportunity[];
}

/**
 * View-model returned by the service layer: an `Initiative` with its
 * relations resolved, ready for components to render without knowing
 * anything about how the data was fetched or joined.
 */
export interface InitiativeWithRelations extends Initiative {
  category: Category;
  wilaya: Wilaya;
  organizer: User;
}
