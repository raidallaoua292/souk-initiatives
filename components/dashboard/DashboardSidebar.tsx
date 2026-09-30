"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CirclePlus, ClipboardList, UserRoundCog, type LucideIcon } from "lucide-react";
import { createElement } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { useMockStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: (pathname: string) => boolean;
}

const NEW_INITIATIVE_PATH = "/dashboard/initiatives/new";

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "نظرة عامة",
    icon: LayoutDashboard,
    isActive: (path) =>
      path === "/dashboard" || (path.startsWith("/dashboard/initiatives/") && path !== NEW_INITIATIVE_PATH),
  },
  {
    href: NEW_INITIATIVE_PATH,
    label: "مبادرة جديدة",
    icon: CirclePlus,
    isActive: (path) => path === NEW_INITIATIVE_PATH,
  },
  {
    href: "/dashboard/applications",
    label: "طلباتي",
    icon: ClipboardList,
    isActive: (path) => path === "/dashboard/applications",
  },
  {
    href: "/dashboard/profile",
    label: "الملف الشخصي",
    icon: UserRoundCog,
    isActive: (path) => path === "/dashboard/profile",
  },
];

/** User summary + navigation. A sticky column on large screens, a compact stacked block on small ones. */
export function DashboardSidebar() {
  const pathname = usePathname();
  const { currentUser, wilayas, stats } = useMockStore();
  const wilayaName = wilayas.find((w) => w.slug === currentUser.wilayaSlug)?.name;

  return (
    <aside aria-label="لوحة التحكم" className="lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-2xl border border-dark/10 bg-white p-4 lg:p-5">
        <div className="flex items-center gap-3">
          <Avatar name={currentUser.name} colorClass={currentUser.avatarColor} src={currentUser.avatarUrl} />
          <div className="min-w-0">
            <p className="truncate font-bold text-dark">{currentUser.name}</p>
            {wilayaName && <p className="text-xs text-dark/60">{wilayaName}</p>}
          </div>
        </div>
        <span className="mt-3 inline-block rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-bold text-accent-dark">
          حساب تجريبي
        </span>

        <nav aria-label="أقسام لوحة التحكم" className="mt-4 border-t border-dark/10 pt-3">
          <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {navItems.map((item) => {
              const active = item.isActive(pathname);
              return (
                <li key={item.href} className="shrink-0 lg:shrink">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors",
                      active ? "bg-primary text-white" : "text-dark/70 hover:bg-primary/10 hover:text-primary",
                    )}
                  >
                    {createElement(item.icon, { className: "h-4 w-4", "aria-hidden": true })}
                    {item.label}
                    {item.href === "/dashboard/applications" && stats.pendingApplications > 0 && (
                      <span
                        className={cn(
                          "ms-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold",
                          active ? "bg-white/20 text-white" : "bg-accent text-white",
                        )}
                      >
                        {stats.pendingApplications}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
