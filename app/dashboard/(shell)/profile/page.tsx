import type { Metadata } from "next";
import { ProfileEditor } from "@/components/dashboard/ProfileEditor";

export const metadata: Metadata = {
  title: "الملف الشخصي",
  description: "عدّل بياناتك الشخصية ومهاراتك واهتماماتك.",
};

export default function ProfilePage() {
  return <ProfileEditor />;
}
