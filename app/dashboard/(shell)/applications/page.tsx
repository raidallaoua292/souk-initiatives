import type { Metadata } from "next";
import { MyApplicationsView } from "@/components/dashboard/MyApplicationsView";

export const metadata: Metadata = {
  title: "طلباتي",
  description: "تابع حالة طلبات انضمامك إلى المبادرات.",
};

export default function MyApplicationsPage() {
  return <MyApplicationsView />;
}
