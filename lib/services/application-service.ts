import { applications } from "@/lib/mock-data";
import type { Application } from "@/types";

export async function getApplications(): Promise<Application[]> {
  return applications;
}

export async function getApplicationsByApplicant(applicantId: string): Promise<Application[]> {
  return applications.filter((application) => application.applicantId === applicantId);
}

export async function getApplicationsByInitiative(initiativeId: string): Promise<Application[]> {
  return applications.filter((application) => application.initiativeId === initiativeId);
}

/**
 * Everything one user should see: applications they submitted, plus those
 * received on the initiatives they own.
 */
export async function getApplicationsRelevantToUser(
  userId: string,
  ownedInitiativeIds: string[],
): Promise<Application[]> {
  const owned = new Set(ownedInitiativeIds);
  return applications.filter(
    (application) => application.applicantId === userId || owned.has(application.initiativeId),
  );
}
