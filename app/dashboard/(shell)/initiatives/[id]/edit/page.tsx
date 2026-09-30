import type { Metadata } from "next";
import { EditInitiativeView } from "@/components/dashboard/EditInitiativeView";

export const metadata: Metadata = {
  title: "تعديل المبادرة",
};

interface EditInitiativePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditInitiativePage({ params }: EditInitiativePageProps) {
  const { id } = await params;
  return <EditInitiativeView initiativeId={id} />;
}
