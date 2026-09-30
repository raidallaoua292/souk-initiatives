import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InitiativesExplorer } from "@/components/initiatives/InitiativesExplorer";
import { getAllInitiatives, getCategories, getWilayas } from "@/lib/services";

export const metadata: Metadata = {
  title: "استكشف المبادرات",
  description: "تصفّح كل المبادرات المجتمعية المنشورة على سوق المبادرات، وابحث وفلتر حسب الولاية والتصنيف والحالة.",
};

function ExplorerFallback() {
  return (
    <div className="flex flex-col gap-6" aria-hidden="true">
      <div className="h-14 animate-pulse rounded-full bg-white" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-xl bg-white" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-72 animate-pulse rounded-2xl bg-white" />
        ))}
      </div>
    </div>
  );
}

export default async function InitiativesPage() {
  const [initiatives, categories, wilayas] = await Promise.all([
    getAllInitiatives(),
    getCategories(),
    getWilayas(),
  ]);

  return (
    <Container as="section" className="py-10 sm:py-14">
      <SectionHeading
        eyebrow="كل المبادرات"
        title="استكشف المبادرات"
        description="ابحث بالاسم أو الكلمة المفتاحية، أو فلتر حسب الولاية والتصنيف والحالة لإيجاد المبادرة المناسبة لك."
        className="mb-8 max-w-3xl"
      />

      <Suspense fallback={<ExplorerFallback />}>
        <InitiativesExplorer initiatives={initiatives} categories={categories} wilayas={wilayas} />
      </Suspense>
    </Container>
  );
}
