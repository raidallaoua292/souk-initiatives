/**
 * A thematic category that initiatives belong to (e.g. environment, education).
 */
export interface Category {
  id: string;
  /** URL-safe latin identifier, e.g. "environment". */
  slug: string;
  /** Arabic display name, e.g. "البيئة". */
  name: string;
  /** Short Arabic description of the category. */
  description: string;
  /**
   * Key used to resolve a Lucide icon at render time via `lib/icon-map`.
   * Kept as a plain string so mock data (and later DB rows) stay
   * serializable and framework-agnostic.
   */
  icon: string;
}
