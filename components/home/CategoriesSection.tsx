import Link from "next/link";
import type { Category } from "@/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { formatNumber } from "@/lib/utils";

interface CategoriesSectionProps {
  categories: Category[];
  counts: Record<string, number>;
}

export function CategoriesSection({ categories, counts }: CategoriesSectionProps) {
  return (
    <section className="py-14 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="تصفّح حسب الاهتمام"
          title="تصنيفات المبادرات"
          description="اختر المجال الذي يهمك لاكتشاف المبادرات المرتبطة به في ولايتك أو في كل الجزائر."
        />

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((category) => {
            const count = counts[category.slug] ?? 0;

            return (
              <Link
                key={category.id}
                href={`/initiatives?category=${category.slug}`}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-dark/10 bg-white p-5 text-center transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <DynamicIcon name={category.icon} className="h-6 w-6" />
                </span>
                <span className="text-sm font-bold text-dark">{category.name}</span>
                <span className="text-xs text-dark/50">{formatNumber(count)} مبادرة</span>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
