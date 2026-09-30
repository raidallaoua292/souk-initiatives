import { Compass } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center gap-5 py-24 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Compass className="h-8 w-8" aria-hidden="true" />
      </span>
      <h1 className="text-3xl font-extrabold text-dark">404 — الصفحة غير موجودة</h1>
      <p className="max-w-md text-dark/70">
        يبدو أن الرابط الذي اتبعته غير صحيح، أو أن المبادرة التي تبحث عنها لم تعد متوفرة.
      </p>
      <Button href="/">العودة للرئيسية</Button>
    </Container>
  );
}
