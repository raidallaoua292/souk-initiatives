"use client";

import { RotateCcw } from "lucide-react";
import type { Category, InitiativeStatus, Wilaya } from "@/types";

export interface InitiativeFilterValues {
  categorySlug: string;
  wilayaSlug: string;
  status: InitiativeStatus | "all";
}

const statusOptions: { value: InitiativeStatus | "all"; label: string }[] = [
  { value: "all", label: "كل الحالات" },
  { value: "active", label: "قائمة حاليًا" },
  { value: "upcoming", label: "قادمة قريبًا" },
  { value: "completed", label: "منجزة" },
  { value: "paused", label: "متوقفة مؤقتًا" },
];

interface InitiativeFiltersProps {
  categories: Category[];
  wilayas: Wilaya[];
  value: InitiativeFilterValues;
  onChange: (value: InitiativeFilterValues) => void;
}

const selectClasses =
  "w-full rounded-xl border border-dark/15 bg-white px-3.5 py-2.5 text-sm text-dark outline-none focus:border-primary";

export function InitiativeFilters({
  categories,
  wilayas,
  value,
  onChange,
}: InitiativeFiltersProps) {
  const isFiltered =
    value.categorySlug !== "all" || value.wilayaSlug !== "all" || value.status !== "all";

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <label htmlFor="filter-category" className="mb-1.5 block text-xs font-semibold text-dark/60">
          التصنيف
        </label>
        <select
          id="filter-category"
          className={selectClasses}
          value={value.categorySlug}
          onChange={(event) => onChange({ ...value, categorySlug: event.target.value })}
        >
          <option value="all">كل التصنيفات</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="filter-wilaya" className="mb-1.5 block text-xs font-semibold text-dark/60">
          الولاية
        </label>
        <select
          id="filter-wilaya"
          className={selectClasses}
          value={value.wilayaSlug}
          onChange={(event) => onChange({ ...value, wilayaSlug: event.target.value })}
        >
          <option value="all">كل الولايات</option>
          {wilayas.map((wilaya) => (
            <option key={wilaya.code} value={wilaya.slug}>
              {wilaya.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="filter-status" className="mb-1.5 block text-xs font-semibold text-dark/60">
          الحالة
        </label>
        <select
          id="filter-status"
          className={selectClasses}
          value={value.status}
          onChange={(event) =>
            onChange({ ...value, status: event.target.value as InitiativeStatus | "all" })
          }
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-end">
        <button
          type="button"
          disabled={!isFiltered}
          onClick={() => onChange({ categorySlug: "all", wilayaSlug: "all", status: "all" })}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dark/15 bg-white px-3.5 py-2.5 text-sm font-semibold text-dark/70 transition-colors hover:bg-dark/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          إعادة تعيين
        </button>
      </div>
    </div>
  );
}
