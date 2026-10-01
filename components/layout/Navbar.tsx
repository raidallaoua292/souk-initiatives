"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Store, Plus } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/initiatives", label: "المبادرات" },
  { href: "/people", label: "الأشخاص" },
  { href: "/dashboard", label: "لوحة التحكم" },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-dark/10 bg-background/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between sm:h-20">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-extrabold text-primary sm:text-xl"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
            <Store className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>سوق المبادرات</span>
        </Link>

        <nav aria-label="التنقل الرئيسي" className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-dark/80 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <NotificationBell />
          <div className="hidden md:block">
            <Button href="/initiatives/new" size="sm" icon={<Plus className="h-4 w-4" />}>
              انشر مبادرتك
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-dark hover:bg-dark/5 md:hidden"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </Container>

      <div
        id="mobile-menu"
        className={cn(
          "border-t border-dark/10 bg-background md:hidden",
          isMenuOpen ? "block" : "hidden",
        )}
      >
        <Container className="flex flex-col gap-1 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-semibold text-dark/80 hover:bg-dark/5 hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <Button
            href="/initiatives/new"
            size="sm"
            icon={<Plus className="h-4 w-4" />}
            className="mt-2 w-full"
          >
            انشر مبادرتك
          </Button>
        </Container>
      </div>
    </header>
  );
}
