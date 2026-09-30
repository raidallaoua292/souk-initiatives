/**
 * Represents one of Algeria's administrative provinces (ولاية).
 * Mirrors the shape a future `Wilaya` Prisma model would expose.
 */
export interface Wilaya {
  /** Official two-digit wilaya code, e.g. "16" for Algiers. */
  code: string;
  /** URL-safe latin identifier, e.g. "alger". */
  slug: string;
  /** Arabic display name, e.g. "الجزائر". */
  name: string;
}
