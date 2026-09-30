import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/** Shared control styling so every dashboard input looks and behaves the same. */
export function controlClasses(hasError: boolean): string {
  return cn(
    "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-dark outline-none transition-colors placeholder:text-dark/40 focus:border-primary",
    hasError ? "border-red-500 focus:border-red-500" : "border-dark/15",
  );
}

/** Builds the `aria-describedby` value for a control from its hint/error ids. */
export function describedBy(id: string, hint?: string, error?: string): string | undefined {
  const ids = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean);
  return ids.length > 0 ? ids.join(" ") : undefined;
}

interface FieldShellProps {
  /** Must match the `id` of the control rendered as `children`. */
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  /** Right-aligned helper such as a character counter. */
  counter?: string;
  className?: string;
  children: ReactNode;
}

export function FieldShell({ id, label, required, hint, error, counter, className, children }: FieldShellProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-dark">
        {label}
        {required && (
          <>
            <span className="text-accent" aria-hidden="true">
              {" "}
              *
            </span>
            <span className="sr-only"> (مطلوب)</span>
          </>
        )}
      </label>
      {children}
      {(hint || counter) && (
        <div className="mt-1.5 flex items-start justify-between gap-3 text-xs text-dark/60">
          {hint ? <p id={`${id}-hint`}>{hint}</p> : <span />}
          {counter && <span className="shrink-0 tabular-nums">{counter}</span>}
        </div>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-red-700">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

interface BaseFieldProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
}

interface TextFieldProps extends BaseFieldProps {
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "date" | "url" | "email";
  placeholder?: string;
  maxLength?: number;
  showCount?: boolean;
}

export function TextField({
  id, label, required, hint, error, className, value, onChange,
  type = "text", placeholder, maxLength, showCount,
}: TextFieldProps) {
  return (
    <FieldShell
      id={id}
      label={label}
      required={required}
      hint={hint}
      error={error}
      className={className}
      counter={showCount && maxLength ? `${value.length}/${maxLength}` : undefined}
    >
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={controlClasses(Boolean(error))}
      />
    </FieldShell>
  );
}

interface TextAreaFieldProps extends BaseFieldProps {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  maxLength?: number;
  showCount?: boolean;
}

export function TextAreaField({
  id, label, required, hint, error, className, value, onChange,
  rows = 4, placeholder, maxLength, showCount,
}: TextAreaFieldProps) {
  return (
    <FieldShell
      id={id}
      label={label}
      required={required}
      hint={hint}
      error={error}
      className={className}
      counter={showCount && maxLength ? `${value.length}/${maxLength}` : undefined}
    >
      <textarea
        id={id}
        name={id}
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(controlClasses(Boolean(error)), "resize-y leading-relaxed")}
      />
    </FieldShell>
  );
}

interface SelectFieldProps extends BaseFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: ReadonlyArray<{ value: string; label: string }>;
  placeholder?: string;
}

export function SelectField({
  id, label, required, hint, error, className, value, onChange, options, placeholder = "اختر...",
}: SelectFieldProps) {
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error} className={className}>
      <select
        id={id}
        name={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={controlClasses(Boolean(error))}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}
