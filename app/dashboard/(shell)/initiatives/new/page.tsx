import type { Metadata } from "next";
import { CreateInitiativeView } from "@/components/dashboard/CreateInitiativeView";

export const metadata: Metadata = {
  title: "مبادرة جديدة",
  description: "أنشئ مبادرة جديدة وحدد احتياجاتها وأهدافها.",
};

export default function NewInitiativePage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold text-dark">مبادرة جديدة</h1>
        <p className="mt-1 text-sm text-dark/70">
          عبّئ التفاصيل التالية. الحقول المعلَّمة بـ <span className="text-accent">*</span> إلزامية.
        </p>
      </header>
      <CreateInitiativeView />
    </div>
  );
}
