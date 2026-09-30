import { Hero } from "@/components/home/Hero";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { FeaturedInitiatives } from "@/components/home/FeaturedInitiatives";
import { LatestInitiatives } from "@/components/home/LatestInitiatives";
import { CtaSection } from "@/components/home/CtaSection";
import {
  getCategories,
  getCategoryCounts,
  getFeaturedInitiatives,
  getLatestInitiatives,
  getPlatformStats,
} from "@/lib/services";

export default async function HomePage() {
  const [stats, categories, categoryCounts, featuredInitiatives, latestInitiatives] =
    await Promise.all([
      getPlatformStats(),
      getCategories(),
      getCategoryCounts(),
      getFeaturedInitiatives(6),
      getLatestInitiatives(6),
    ]);

  return (
    <>
      <Hero stats={stats} />
      <CategoriesSection categories={categories} counts={categoryCounts} />
      <FeaturedInitiatives initiatives={featuredInitiatives} />
      <LatestInitiatives initiatives={latestInitiatives} />
      <CtaSection />
    </>
  );
}
