import type { InitiativeNeedType } from "@/types";
import { SUPPORT_OPTIONS } from "@/lib/forms/initiative-form";
import { AlertCircle } from "lucide-react";

interface SupportOptionsFieldProps {
  id: string;
  value: InitiativeNeedType[];
  onChange: (value: InitiativeNeedType[]) => void;
  error?: string;
}

/** Checkbox group for the kinds of support an initiative is asking for. */
export function SupportOptionsField({ id, value, onChange, error }: SupportOptionsFieldProps) {
  function toggle(type: InitiativeNeedType) {
    onChange(value.includes(type) ? value.filter((item) => item !== type) : [...value, type]);
  }

  return (
    <fieldset
      id={id}
      tabIndex={-1}
      aria-describedby={error ? `${id}-error` : undefined}
      className="outline-none"
    >
      <legend className="mb-1.5 text-sm font-semibold text-dark">
        الدعم المطلوب
        <span className="text-accent" aria-hidden="true">
          {" "}
          *
        </span>
        <span className="sr-only"> (مطلوب، اختر واحدًا على الأقل)</span>
      </legend>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SUPPORT_OPTIONS.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-start gap-3 rounded-xl border border-dark/15 bg-white p-3.5 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
          >
            <input
              type="checkbox"
              checked={value.includes(option.value)}
              onChange={() => toggle(option.value)}
              className="mt-1 h-4 w-4 shrink-0 accent-primary"
            />
            <span>
              <span className="block text-sm font-bold text-dark">{option.label}</span>
              <span className="block text-xs text-dark/60">{option.description}</span>
            </span>
          </label>
        ))}
      </div>

      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-red-700">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </fieldset>
  );
}
