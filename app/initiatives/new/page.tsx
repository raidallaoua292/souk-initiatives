import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InitiativeForm } from "@/components/forms/InitiativeForm";
import { getCategories, getWilayas } from "@/lib/services";

export const metadata: Metadata = {
  title: "انشر مبادرتك",
  description: "شارك تفاصيل مبادرتك المجتمعية مع سوق المبادرات لتصل إلى متطوعين وداعمين.",
};

export default async function NewInitiativePage() {
  const [categories, wilayas] = await Promise.all([getCategories(), getWilayas()]);

  return (
    <Container as="section" className="max-w-2xl py-10 sm:py-14">
      <SectionHeading
        eyebrow="شاركنا مبادرتك"
        title="انشر مبادرتك"
        description="عبّئ النموذج التالي بمعلومات مبادرتك. هذا نموذج تجريبي بواجهة أمامية فقط، ولا يتم حفظ البيانات في أي قاعدة بيانات بعد."
        className="mb-8"
      />
      <InitiativeForm categories={categories} wilayas={wilayas} />
    </Container>
  );
}
