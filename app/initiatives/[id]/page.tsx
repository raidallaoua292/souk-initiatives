import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InitiativeDetailsView } from "@/components/initiatives/InitiativeDetailsView";
import { getAllInitiatives, getInitiativeBySlug } from "@/lib/services";

interface InitiativePageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const initiatives = await getAllInitiatives();
  return initiatives.map((initiative) => ({ id: initiative.slug }));
}

export async function generateMetadata({ params }: InitiativePageProps): Promise<Metadata> {
  const { id } = await params;
  const initiative = await getInitiativeBySlug(id);

  if (!initiative) {
    return { title: "المبادرة غير موجودة" };
  }

  return {
    title: initiative.title,
    description: initiative.shortDescription,
  };
}

export default async function InitiativeDetailsPage({ params }: InitiativePageProps) {
  const { id } = await params;
  const initiative = await getInitiativeBySlug(id);

  if (!initiative) {
    notFound();
  }

  return <InitiativeDetailsView initiative={initiative} />;
}
