import type { Metadata } from "next";
import { ManageApplicationsView } from "@/components/dashboard/ManageApplicationsView";

export const metadata: Metadata = { title: "إدارة طلبات الانضمام" };

export default async function ManageApplicationsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ManageApplicationsView initiativeId={id} />;
}
