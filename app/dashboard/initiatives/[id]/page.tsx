import type { Metadata } from "next";
import { InitiativePreview } from "@/components/dashboard/InitiativePreview";

export const metadata: Metadata = {
  title: "معاينة المبادرة",
};

interface PreviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function InitiativePreviewPage({ params }: PreviewPageProps) {
  const { id } = await params;
  return <InitiativePreview initiativeId={id} />;
}
