import type { InitiativeWithRelations } from "@/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InitiativeGrid } from "@/components/initiatives/InitiativeGrid";

interface FeaturedInitiativesProps {
  initiatives: InitiativeWithRelations[];
}

export function FeaturedInitiatives({ initiatives }: FeaturedInitiativesProps) {
  if (initiatives.length === 0) return null;

  return (
    <section className="bg-white py-14 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="الأكثر تأثيرًا"
          title="مبادرات مميزة"
          description="مبادرات اخترناها لكم لما تحدثه من أثر ملموس في مجتمعاتها."
        />
        <div className="mt-8">
          <InitiativeGrid initiatives={initiatives} />
        </div>
      </Container>
    </section>
  );
}
