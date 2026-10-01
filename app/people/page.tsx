import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PeopleExplorer } from "@/components/people/PeopleExplorer";
import { getPeople, getWilayas } from "@/lib/services";

export const metadata: Metadata = {
  title: "استكشف الأشخاص",
  description: "تعرّف على المبادرين والمتطوعين والخبراء على سوق المبادرات، وابحث حسب المهارة والولاية.",
};

export default async function PeoplePage() {
  const [people, wilayas] = await Promise.all([getPeople(), getWilayas()]);

  return (
    <Container as="section" className="py-10 sm:py-14">
      <SectionHeading
        eyebrow="المجتمع"
        title="استكشف الأشخاص"
        description="ابحث عن مبادرين ومتطوعين وخبراء حسب المهارة أو الولاية، وتواصل معهم لبناء فريقك."
        className="mb-8 max-w-3xl"
      />
      <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-white" aria-hidden="true" />}>
        <PeopleExplorer people={people} wilayas={wilayas} />
      </Suspense>
    </Container>
  );
}
