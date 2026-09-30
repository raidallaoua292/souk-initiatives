import { ArrowLeft } from "lucide-react";
import type { InitiativeWithRelations } from "@/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { InitiativeGrid } from "@/components/initiatives/InitiativeGrid";

interface LatestInitiativesProps {
  initiatives: InitiativeWithRelations[];
}

export function LatestInitiatives({ initiatives }: LatestInitiativesProps) {
  return (
    <section className="py-14 sm:py-20">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="آخر الإضافات"
            title="أحدث المبادرات"
            description="تابع آخر المبادرات المنشورة على المنصة من مختلف الولايات."
          />
          <Button
            href="/initiatives"
            variant="outline"
            size="sm"
            icon={<ArrowLeft className="h-4 w-4" aria-hidden="true" />}
            iconPosition="end"
            className="shrink-0"
          >
            عرض كل المبادرات
          </Button>
        </div>
        <div className="mt-8">
          <InitiativeGrid initiatives={initiatives} />
        </div>
      </Container>
    </section>
  );
}
