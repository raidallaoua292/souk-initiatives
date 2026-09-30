"use client";

import { Search } from "lucide-react";
import { ROLE_LABELS, ROLE_ORDER, STATUS_FILTER_LABELS, STATUS_ORDER, type ApplicationFilters } from "@/lib/applications";
import { controlClasses } from "@/components/forms/fields";

interface ApplicationsFilterBarProps {
  value: ApplicationFilters;
  onChange: (value: ApplicationFilters) => void;
}

/** Status + role + free-text search, used on the "manage applications" page. */
export function ApplicationsFilterBar({ value, onChange }: ApplicationsFilterBarProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 start-3 h-4 w-4 -translate-y-1/2 text-dark/40" aria-hidden="true" />
        <input
          type="search"
          value={value.query}
          onChange={(event) => onChange({ ...value, query: event.target.value })}
          placeholder="ابحث بالاسم أو المهارة..."
          aria-label="البحث في طلبات الانضمام"
          className={`${controlClasses(false)} ps-9`}
        />
      </div>

      <select
        aria-label="تصفية حسب الحالة"
        value={value.status}
        onChange={(event) => onChange({ ...value, status: event.target.value as ApplicationFilters["status"] })}
        className={controlClasses(false)}
      >
        <option value="ALL">{STATUS_FILTER_LABELS.ALL}</option>
        {STATUS_ORDER.map((status) => (
          <option key={status} value={status}>
            {STATUS_FILTER_LABELS[status]}
          </option>
        ))}
      </select>

      <select
        aria-label="تصفية حسب الدور"
        value={value.role}
        onChange={(event) => onChange({ ...value, role: event.target.value as ApplicationFilters["role"] })}
        className={controlClasses(false)}
      >
        <option value="ALL">كل الأدوار</option>
        {ROLE_ORDER.map((role) => (
          <option key={role} value={role}>
            {ROLE_LABELS[role]}
          </option>
        ))}
      </select>
    </div>
  );
}
