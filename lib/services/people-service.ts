import { applications } from "@/lib/mock-data";
import { ApplicationStatus } from "@/types";
import type { PersonProfile, PersonSummary } from "@/types";
import { getUsers } from "./user-service";
import { getWilayas } from "./wilaya-service";
import { getAllInitiatives } from "./initiative-service";

/** Public directory of members, with simple activity counts. */
export async function getPeople(): Promise<PersonSummary[]> {
  const [users, wilayas, initiatives] = await Promise.all([getUsers(), getWilayas(), getAllInitiatives()]);
  const wilayaName = new Map(wilayas.map((w) => [w.slug, w.name]));
  return users.map((user) => ({
    user,
    wilayaName: wilayaName.get(user.wilayaSlug) ?? "",
    initiativesCount: initiatives.filter((i) => i.organizerId === user.id).length,
    membershipsCount: applications.filter(
      (a) => a.applicantId === user.id && a.status === ApplicationStatus.ACCEPTED,
    ).length,
  }));
}

export async function getPersonProfile(id: string): Promise<PersonProfile | undefined> {
  const [people, initiatives] = await Promise.all([getPeople(), getAllInitiatives()]);
  const summary = people.find((p) => p.user.id === id);
  if (!summary) return undefined;

  const byId = new Map(initiatives.map((i) => [i.id, i]));
  const participating = applications
    .filter((a) => a.applicantId === id && a.status === ApplicationStatus.ACCEPTED)
    .flatMap((a) => {
      const initiative = byId.get(a.initiativeId);
      return initiative ? [{ initiative, role: a.role }] : [];
    });

  return { ...summary, organized: initiatives.filter((i) => i.organizerId === id), participating };
}
