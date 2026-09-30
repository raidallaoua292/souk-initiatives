type ClassValue = string | number | null | undefined | false;

/** Joins truthy class name fragments together. A tiny local stand-in for `clsx`. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}

/** Formats a number using Arabic (Algeria) digit grouping, e.g. 12500 -> "١٢٬٥٠٠". */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("ar-DZ").format(value);
}

/** Formats an ISO date string as a readable Arabic date, e.g. "10 سبتمبر 2026". */
export function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat("ar-DZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(isoDate));
}

/** Returns a relative-ish Arabic label for how long ago an ISO date was. */
export function formatRelativeTime(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "اليوم";
  if (diffDays === 1) return "منذ يوم واحد";
  if (diffDays < 7) return `منذ ${diffDays} أيام`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? "منذ أسبوع" : `منذ ${weeks} أسابيع`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? "منذ شهر" : `منذ ${months} أشهر`;
  }
  const years = Math.floor(diffDays / 365);
  return years === 1 ? "منذ سنة" : `منذ ${years} سنوات`;
}

/** Computes a fulfillment percentage (0-100) for a need, guarding against divide-by-zero. */
export function needProgress(quantityFulfilled = 0, quantityNeeded = 0): number {
  if (quantityNeeded <= 0) return 0;
  return Math.min(100, Math.round((quantityFulfilled / quantityNeeded) * 100));
}

/** Today's date in the user's local timezone as `YYYY-MM-DD`. Call from event handlers, not render. */
export function todayIsoDate(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}
