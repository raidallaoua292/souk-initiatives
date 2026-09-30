import Link from "next/link";
import { Store, Globe, MessageCircle, Mail } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { categories } from "@/lib/mock-data";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-dark/10 bg-dark text-white">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2 text-lg font-extrabold text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <Store className="h-5 w-5" aria-hidden="true" />
            </span>
            سوق المبادرات
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            منصة جزائرية تجمع المبادرات المجتمعية والتطوعية من كل الولايات في مكان واحد،
            لدعم المبادرين والمتطوعين والمساهمين.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href="#"
              aria-label="الموقع الإلكتروني"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-primary"
            >
              <Globe className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="تواصل عبر الدردشة"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-primary"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
            <a
              href="mailto:contact@souk-mubadarat.dz"
              aria-label="البريد الإلكتروني"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-primary"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        <nav aria-label="روابط سريعة">
          <h3 className="mb-4 text-sm font-bold text-white">روابط سريعة</h3>
          <ul className="space-y-2.5 text-sm text-white/70">
            <li>
              <Link href="/" className="hover:text-white">
                الرئيسية
              </Link>
            </li>
            <li>
              <Link href="/initiatives" className="hover:text-white">
                استكشف المبادرات
              </Link>
            </li>
            <li>
              <Link href="/initiatives/new" className="hover:text-white">
                انشر مبادرتك
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="التصنيفات">
          <h3 className="mb-4 text-sm font-bold text-white">التصنيفات</h3>
          <ul className="space-y-2.5 text-sm text-white/70">
            {categories.slice(0, 5).map((category) => (
              <li key={category.id}>
                <Link
                  href={`/initiatives?category=${category.slug}`}
                  className="hover:text-white"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="mb-4 text-sm font-bold text-white">تواصل معنا</h3>
          <p className="text-sm leading-relaxed text-white/70">
            الجزائر العاصمة، الجزائر
            <br />
            contact@souk-mubadarat.dz
          </p>
        </div>
      </Container>

      <div className="border-t border-white/10 py-5">
        <Container className="text-center text-xs text-white/50">
          © {year} سوق المبادرات. جميع الحقوق محفوظة. هذه منصة تجريبية ببيانات وهمية.
        </Container>
      </div>
    </footer>
  );
}
