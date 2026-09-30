"use client";

import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { addTag } from "@/lib/forms/validators";
import { controlClasses } from "./fields";

interface TagInputProps {
  /** Id of the text input, so a surrounding <label htmlFor> works. */
  id: string;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags: number;
  maxLength: number;
  invalid?: boolean;
  describedBy?: string;
}

const SEPARATORS = /[,،]/;

/** Chip-style list editor: type + Enter / comma / "إضافة" to add, × to remove. */
export function TagInput({
  id,
  value,
  onChange,
  placeholder,
  maxTags,
  maxLength,
  invalid,
  describedBy,
}: TagInputProps) {
  const [draft, setDraft] = useState("");

  function commit(parts: string[]) {
    const next = parts.reduce((tags, part) => addTag(tags, part, maxTags, maxLength), value);
    if (next !== value) onChange(next);
    setDraft("");
  }

  function handleChange(text: string) {
    if (SEPARATORS.test(text)) commit(text.split(SEPARATORS));
    else setDraft(text);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing) return;
    if (event.key === "Enter") {
      event.preventDefault(); // don't submit the surrounding form
      commit([draft]);
    } else if (event.key === "Backspace" && draft === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  const isFull = value.length >= maxTags;

  return (
    <div>
      <div className="flex gap-2">
        <input
          id={id}
          type="text"
          value={draft}
          onChange={(event) => handleChange(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => draft.trim() && commit([draft])}
          placeholder={isFull ? "وصلت إلى الحد الأقصى" : placeholder}
          disabled={isFull}
          aria-invalid={invalid ? true : undefined}
          aria-describedby={describedBy}
          className={controlClasses(Boolean(invalid))}
        />
        <button
          type="button"
          onClick={() => commit([draft])}
          disabled={isFull || draft.trim() === ""}
          className="shrink-0 rounded-xl border border-primary px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-primary"
        >
          إضافة
        </button>
      </div>

      {value.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="العناصر المضافة">
          {value.map((tag) => (
            <li
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 py-1 ps-3 pe-1.5 text-xs font-semibold text-primary"
            >
              {tag}
              <button
                type="button"
                onClick={() => onChange(value.filter((item) => item !== tag))}
                aria-label={`إزالة ${tag}`}
                className="rounded-full p-0.5 hover:bg-primary/20"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
