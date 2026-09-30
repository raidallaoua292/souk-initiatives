import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardNotices } from "@/components/dashboard/DashboardNotices";

/** Dashboard shell: sidebar + main column. The right-hand column in RTL is the sidebar. */
export default function DashboardShellLayout({ children }: { children: ReactNode }) {
  return (
    <Container className="py-8 sm:py-10">
      <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-8">
        <DashboardSidebar />
        <div className="space-y-6">
          <DashboardNotices />
          {children}
        </div>
      </div>
    </Container>
  );
}
