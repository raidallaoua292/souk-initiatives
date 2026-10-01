import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PersonProfileView } from "@/components/people/PersonProfileView";
import { getPeople, getPersonProfile } from "@/lib/services";

interface PersonPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const people = await getPeople();
  return people.map((person) => ({ id: person.user.id }));
}

export async function generateMetadata({ params }: PersonPageProps): Promise<Metadata> {
  const { id } = await params;
  const profile = await getPersonProfile(id);
  return profile
    ? { title: profile.user.name, description: profile.user.bio }
    : { title: "العضو غير موجود" };
}

export default async function PersonPage({ params }: PersonPageProps) {
  const { id } = await params;
  const profile = await getPersonProfile(id);
  if (!profile) notFound();
  return <PersonProfileView profile={profile} />;
}
