import { Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SearchBar } from "@/components/forms/SearchBar";
import { formatNumber } from "@/lib/utils";
import type { PlatformStats } from "@/lib/services";

interface HeroProps {
  stats: PlatformStats;
}

export function Hero({ stats }: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-dark/10 bg-gradient-to-b from-primary/5 to-background">
      <Container className="flex flex-col items-center gap-8 py-16 text-center sm:py-24">
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-primary ring-1 ring-primary/20">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          منصة جزائرية 100% لدعم المبادرات المجتمعية
        </span>

        <h1 className="max-w-3xl text-3xl font-extrabold leading-tight text-dark sm:text-5xl">
          اكتشف، وادعم، وأطلق مبادرتك في <span className="text-primary">سوق المبادرات</span>
        </h1>

        <p className="max-w-2xl text-base leading-relaxed text-dark/70 sm:text-lg">
          فضاء يجمع مبادرات بيئية وتعليمية وصحية وتضامنية من كل ولايات الجزائر، ليجد
          كل مبادِر متطوعين وداعمين، ويجد كل متطوع مبادرة تستحق وقته.
        </p>

        <div className="w-full max-w-xl">
          <SearchBar size="lg" />
        </div>

        <dl className="mt-4 grid w-full max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4">
          <div>
            <dt className="sr-only">عدد المبادرات</dt>
            <dd className="text-2xl font-extrabold text-primary sm:text-3xl">
              {formatNumber(stats.totalInitiatives)}
            </dd>
            <p className="mt-1 text-xs font-medium text-dark/60">مبادرة منشورة</p>
          </div>
          <div>
            <dt className="sr-only">المبادرات القائمة حاليًا</dt>
            <dd className="text-2xl font-extrabold text-primary sm:text-3xl">
              {formatNumber(stats.activeInitiatives)}
            </dd>
            <p className="mt-1 text-xs font-medium text-dark/60">قائمة حاليًا</p>
          </div>
          <div>
            <dt className="sr-only">عدد الأعضاء</dt>
            <dd className="text-2xl font-extrabold text-primary sm:text-3xl">
              {formatNumber(stats.totalMembers)}
            </dd>
            <p className="mt-1 text-xs font-medium text-dark/60">عضو مساهم</p>
          </div>
          <div>
            <dt className="sr-only">عدد الولايات</dt>
            <dd className="text-2xl font-extrabold text-primary sm:text-3xl">
              {formatNumber(stats.totalWilayas)}
            </dd>
            <p className="mt-1 text-xs font-medium text-dark/60">ولاية مشاركة</p>
          </div>
        </dl>
      </Container>
    </section>
  );
}
