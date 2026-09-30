import Link from "next/link";
import { MapPin, Users } from "lucide-react";
import type { InitiativeWithRelations } from "@/types";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { formatNumber } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";

interface InitiativeCardProps {
  initiative: InitiativeWithRelations;
}

export function InitiativeCard({ initiative }: InitiativeCardProps) {
  return (
    <Link
      href={`/initiatives/${initiative.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-dark/10 bg-white transition-shadow hover:shadow-lg hover:shadow-dark/5 focus-visible:shadow-lg"
    >
      <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-primary to-primary-dark">
        <DynamicIcon name={initiative.category.icon} className="h-12 w-12 text-white/90" />
        <div className="absolute top-3 end-3">
          <StatusBadge status={initiative.status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <span className="w-fit rounded-full bg-accent/10 px-2.5 py-1 text-xs font-bold text-accent-dark">
          {initiative.category.name}
        </span>

        <h3 className="line-clamp-2 text-lg font-bold text-dark transition-colors group-hover:text-primary">
          {initiative.title}
        </h3>

        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-dark/70">
          {initiative.shortDescription}
        </p>

        <div className="mt-2 flex items-center justify-between border-t border-dark/10 pt-3 text-xs text-dark/60">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {initiative.wilaya.name}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" aria-hidden="true" />
            {formatNumber(initiative.membersCount)} عضو
          </span>
        </div>
      </div>
    </Link>
  );
}
