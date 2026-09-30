"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Category, InitiativeStatus, InitiativeWithRelations, Wilaya } from "@/types";
import { SearchBar } from "@/components/forms/SearchBar";
import { InitiativeFilters, type InitiativeFilterValues } from "@/components/forms/InitiativeFilters";
import { InitiativeGrid } from "./InitiativeGrid";

interface InitiativesExplorerProps {
  initiatives: InitiativeWithRelations[];
  categories: Category[];
  wilayas: Wilaya[];
}

function isInitiativeStatus(value: string): value is InitiativeStatus {
  return value === "active" || value === "upcoming" || value === "completed" || value === "paused";
}

export function InitiativesExplorer({ initiatives, categories, wilayas }: InitiativesExplorerProps) {
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("query") ?? "");
  const [filters, setFilters] = useState<InitiativeFilterValues>(() => {
    const categoryParam = searchParams.get("category");
    const wilayaParam = searchParams.get("wilaya");
    const statusParam = searchParams.get("status");
    return {
      categorySlug: categoryParam ?? "all",
      wilayaSlug: wilayaParam ?? "all",
      status: statusParam && isInitiativeStatus(statusParam) ? statusParam : "all",
    };
  });

  const filteredInitiatives = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return initiatives.filter((initiative) => {
      if (filters.categorySlug !== "all" && initiative.categorySlug !== filters.categorySlug) {
        return false;
      }
      if (filters.wilayaSlug !== "all" && initiative.wilayaSlug !== filters.wilayaSlug) {
        return false;
      }
      if (filters.status !== "all" && initiative.status !== filters.status) {
        return false;
      }
      if (needle.length > 0) {
        const haystack = [
          initiative.title,
          initiative.shortDescription,
          initiative.category.name,
          initiative.wilaya.name,
          ...initiative.tags,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      return true;
    });
  }, [initiatives, query, filters]);

  return (
    <div className="flex flex-col gap-6">
      <SearchBar defaultValue={query} onSearch={setQuery} size="lg" />
      <InitiativeFilters categories={categories} wilayas={wilayas} value={filters} onChange={setFilters} />

      <p className="text-sm text-dark/60">
        {filteredInitiatives.length} مبادرة من أصل {initiatives.length}
      </p>

      <InitiativeGrid initiatives={filteredInitiatives} />
    </div>
  );
}
