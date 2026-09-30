export type UserRole = "organizer" | "member" | "admin";

/**
 * A platform member. Organizers are the users who create and run initiatives.
 */
export interface User {
  id: string;
  name: string;
  role: UserRole;
  /** Slug of the wilaya the user is based in. */
  wilayaSlug: string;
  bio?: string;
  /** ISO date string. */
  joinedAt: string;
  /**
   * Tailwind-friendly background color class for a generated (initials-based)
   * avatar, since no real avatar images exist in the mock dataset.
   */
  avatarColor: string;
  /** Skills the user can contribute. */
  skills?: string[];
  /** Topics the user cares about. */
  interests?: string[];
  /** Profile image: an http(s) URL, or a local `data:image/...` preview. */
  avatarUrl?: string;
}
