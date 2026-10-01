"use client";

import { useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { SendHorizontal } from "lucide-react";
import { MESSAGE_LIMITS } from "@/lib/messaging";
import type { Result } from "@/lib/result";
import { Button } from "@/components/ui/Button";
import { formatNumber } from "@/lib/utils";

interface MessageComposerProps {
  /** Returns the store's result; a failure carries the Arabic error to show. */
  onSend: (content: string) => Result<unknown>;
  recipientName: string;
}

export function MessageComposer({ onSend, recipientName }: MessageComposerProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fieldId = useId();
  const errorId = `${fieldId}-error`;
  const empty = value.trim().length === 0;
  const nearLimit = value.length > MESSAGE_LIMITS.max * 0.9;

  function submit() {
    if (empty) return;
    const result = onSend(value);
    if (result.ok) {
      setValue("");
      setError(null);
      inputRef.current?.focus();
    } else {
      setError(result.error);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    submit();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    // Enter sends; Shift+Enter adds a line. Ignore Enter while an IME composition is active.
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-dark/10 p-3">
      <label htmlFor={fieldId} className="sr-only">
        {`نص الرسالة إلى ${recipientName}`}
      </label>
      <div className="flex items-end gap-2">
        <textarea
          ref={inputRef}
          id={fieldId}
          value={value}
          rows={1}
          maxLength={MESSAGE_LIMITS.max + 100}
          onChange={(event) => {
            setValue(event.target.value);
            if (error) setError(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder="اكتب رسالتك هنا…"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="field-sizing-content max-h-32 min-h-11 flex-1 resize-none rounded-2xl border border-dark/20 bg-white px-4 py-2.5 text-sm leading-relaxed text-dark placeholder:text-dark/50 focus:border-primary"
        />
        <Button
          type="submit"
          disabled={empty}
          icon={<SendHorizontal className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />}
          className="h-11 shrink-0"
        >
          إرسال
        </Button>
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-3 px-1 text-xs">
        <p id={errorId} role="alert" className="font-semibold text-red-700">
          {error ?? ""}
        </p>
        <p className={nearLimit ? "font-semibold text-accent-dark" : "text-dark/50"}>
          {nearLimit
            ? `${formatNumber(value.length)} / ${formatNumber(MESSAGE_LIMITS.max)}`
            : "Enter للإرسال · Shift+Enter لسطر جديد"}
        </p>
      </div>
    </form>
  );
}
