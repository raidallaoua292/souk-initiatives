import type { Metadata } from "next";
import { NotificationsView } from "@/components/dashboard/NotificationsView";

export const metadata: Metadata = {
  title: "الإشعارات",
  description: "طلبات الانضمام والرسائل وتحديثات مبادراتك في مكان واحد.",
};

export default function NotificationsPage() {
  return <NotificationsView />;
}
