import type { Metadata } from "next";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";

export const metadata: Metadata = {
  title: "لوحة التحكم",
  description: "تابع مبادراتك وإحصائياتها وأدرها من مكان واحد.",
};

export default function DashboardPage() {
  return <DashboardOverview />;
}
