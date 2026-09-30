"use client";

import { useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { validateImageFile } from "@/lib/forms/validators";
import { FieldShell, controlClasses, describedBy } from "./fields";

interface ImageFieldProps {
  id: string;
  label: string;
  /** Current value: an http(s) URL, a local `data:image/...` string, or empty. */
  value: string;
  onChange: (value: string) => void;
  /** Rendered preview (a `CoverImage` or `Avatar`), supplied by the caller. */
  preview: ReactNode;
  hint?: string;
  error?: string;
  className?: string;
}

/**
 * Image input for either a remote URL or a local file. Local files are read
 * into a data URL purely for preview — nothing is uploaded anywhere.
 */
export function ImageField({ id, label, value, onChange, preview, hint, error, className }: ImageFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const isLocal = value.startsWith("data:");
  // A just-rejected file is the freshest feedback, so it wins over a stale URL error.
  const shownError = fileError ?? error ?? undefined;

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;

    const problem = validateImageFile(file);
    if (problem) {
      setFileError(problem);
      input.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFileError(null);
        onChange(reader.result);
      }
    };
    reader.onerror = () => setFileError("تعذّرت قراءة الملف، حاول مرة أخرى.");
    reader.readAsDataURL(file);
    input.value = "";
  }

  return (
    <FieldShell id={id} label={label} hint={hint} error={shownError} className={className}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="shrink-0">{preview}</div>

        <div className="flex-1 space-y-3">
          <input
            id={id}
            type="url"
            dir="ltr"
            value={isLocal ? "" : value}
            onChange={(event) => {
              setFileError(null);
              onChange(event.target.value);
            }}
            placeholder={isLocal ? "تم اختيار صورة من جهازك" : "https://example.com/image.jpg"}
            aria-invalid={shownError ? true : undefined}
            aria-describedby={describedBy(id, hint, shownError)}
            className={controlClasses(Boolean(shownError))}
          />

          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleFile}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl border border-dark/15 bg-white px-3.5 py-2 text-sm font-semibold text-dark transition-colors hover:bg-dark/5"
            >
              <ImagePlus className="h-4 w-4" aria-hidden="true" />
              اختيار صورة من الجهاز
            </button>
            {value && (
              <button
                type="button"
                onClick={() => {
                  setFileError(null);
                  onChange("");
                }}
                className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                إزالة الصورة
              </button>
            )}
          </div>

          {isLocal && (
            <p className="text-xs text-dark/60">
              صورة محلية للمعاينة فقط — لا يتم رفعها إلى أي خادم وتُمسح عند تحديث الصفحة.
            </p>
          )}
        </div>
      </div>
    </FieldShell>
  );
}
