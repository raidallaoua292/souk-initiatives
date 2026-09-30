import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ApplicationForm } from "@/components/forms/ApplicationForm";
import { getInitiativeBySlug } from "@/lib/services";

interface ApplyPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ApplyPageProps): Promise<Metadata> {
  const { id } = await params;
  const initiative = await getInitiativeBySlug(id);
  return { title: initiative ? `الانضمام إلى ${initiative.title}` : "الانضمام إلى المبادرة" };
}

export default async function ApplyPage({ params }: ApplyPageProps) {
  const { id } = await params;
  const initiative = await getInitiativeBySlug(id);
  if (!initiative) notFound();

  return (
    <Container as="section" className="max-w-2xl py-10 sm:py-14">
      <SectionHeading
        eyebrow={initiative.title}
        title="الانضمام إلى المبادرة"
        description="عبّئ النموذج التالي لتقديم طلب مشاركتك. سيراجع منظّم المبادرة طلبك."
        className="mb-8"
      />
      <ApplicationForm initiative={initiative} cancelHref={`/initiatives/${initiative.slug}`} />
    </Container>
  );
}
