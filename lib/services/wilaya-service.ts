import { wilayas } from "@/lib/mock-data";
import type { Wilaya } from "@/types";

export async function getWilayas(): Promise<Wilaya[]> {
  return wilayas;
}

export async function getWilayaBySlug(slug: string): Promise<Wilaya | undefined> {
  return wilayas.find((wilaya) => wilaya.slug === slug);
}
