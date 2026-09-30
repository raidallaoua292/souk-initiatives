import { Megaphone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function CtaSection() {
  return (
    <section className="py-14 sm:py-20">
      <Container>
        <div className="flex flex-col items-center gap-6 rounded-3xl bg-primary px-6 py-14 text-center text-white sm:px-16">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
            <Megaphone className="h-7 w-7" aria-hidden="true" />
          </span>
          <h2 className="max-w-xl text-2xl font-extrabold sm:text-3xl">
            عندك مبادرة تستحق أن تُشارك؟
          </h2>
          <p className="max-w-lg text-sm leading-relaxed text-white/80 sm:text-base">
            انشر مبادرتك في دقائق، وصِل إلى متطوعين وداعمين من ولايتك ومن كل الجزائر.
          </p>
          <Button href="/initiatives/new" variant="inverse" size="lg">
            انشر مبادرتك الآن
          </Button>
        </div>
      </Container>
    </section>
  );
}
