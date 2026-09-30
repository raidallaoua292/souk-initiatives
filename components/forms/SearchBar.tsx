"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  defaultValue?: string;
  className?: string;
  size?: "md" | "lg";
  /**
   * When provided, the search bar behaves as a controlled, in-place filter
   * (used on the /initiatives listing). When omitted, submitting the form
   * navigates to `/initiatives?query=...` (used in the homepage hero).
   */
  onSearch?: (query: string) => void;
}

export function SearchBar({
  placeholder = "ابحث عن مبادرة، ولاية أو تصنيف...",
  defaultValue = "",
  className,
  size = "md",
  onSearch,
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (onSearch) {
      onSearch(value);
      return;
    }
    const params = new URLSearchParams();
    if (value.trim()) params.set("query", value.trim());
    const queryString = params.toString();
    router.push(`/initiatives${queryString ? `?${queryString}` : ""}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className={cn(
        "flex w-full items-center gap-2 rounded-full bg-white p-1.5 ring-1 ring-dark/10",
        size === "lg" && "p-2",
        className,
      )}
    >
      <label htmlFor="initiative-search" className="sr-only">
        ابحث عن مبادرة
      </label>
      <Search className="ms-2 h-5 w-5 shrink-0 text-dark/40" aria-hidden="true" />
      <input
        id="initiative-search"
        type="search"
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          onSearch?.(event.target.value);
        }}
        placeholder={placeholder}
        className={cn(
          "flex-1 bg-transparent text-sm text-dark outline-none placeholder:text-dark/40",
          size === "lg" && "text-base",
        )}
      />
      <button
        type="submit"
        className={cn(
          "shrink-0 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-dark",
          size === "lg" && "px-6 py-3",
        )}
      >
        بحث
      </button>
    </form>
  );
}
