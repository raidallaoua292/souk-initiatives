import { categories } from "@/lib/mock-data";
import type { Category } from "@/types";

/**
 * Service functions are `async` on purpose, even though the mock data is
 * read synchronously in memory. This keeps every call site (`await
 * getCategories()`) forward-compatible with a real Prisma-backed
 * implementation, so swapping the data source later never requires
 * touching UI components.
 */
export async function getCategories(): Promise<Category[]> {
  return categories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  return categories.find((category) => category.slug === slug);
}
