import type { Metadata } from "next";
import { TeamManagementView } from "@/components/dashboard/TeamManagementView";

export const metadata: Metadata = { title: "فريق المبادرة" };

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TeamManagementView initiativeId={id} />;
}
