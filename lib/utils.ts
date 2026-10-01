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

const APP_TIME_ZONE = "Africa/Algiers";

/** Fixed-zone absolute date and time (stable between server and browser), e.g. "30 سبتمبر 2026 08:10". */
export function formatDateTime(isoDate: string): string {
  return new Intl.DateTimeFormat("ar-DZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: APP_TIME_ZONE,
  }).format(new Date(isoDate));
}

/** Clock time only, e.g. "08:10". */
export function formatClock(isoDate: string): string {
  return new Intl.DateTimeFormat("ar-DZ", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: APP_TIME_ZONE,
  }).format(new Date(isoDate));
}

/** Arabic count phrase: 1 -> "ساعة", 2 -> "ساعتين", 3-10 -> "٥ ساعات", 11+ -> "٢١ ساعة". */
function arabicCount(n: number, one: string, two: string, few: string): string {
  if (n === 1) return one;
  if (n === 2) return two;
  if (n <= 10) return `${formatNumber(n)} ${few}`;
  return `${formatNumber(n)} ${one}`;
}

/**
 * Minute/hour-precision relative label ("منذ ٥ دقائق"). Pure: pass `nowMs` in,
 * so the caller decides when the clock is read (never during server render).
 */
export function formatRelativeDateTime(isoDate: string, nowMs: number): string {
  const diffMs = Math.max(0, nowMs - new Date(isoDate).getTime());
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "الآن";
  if (minutes < 60) return `منذ ${arabicCount(minutes, "دقيقة", "دقيقتين", "دقائق")}`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `منذ ${arabicCount(hours, "ساعة", "ساعتين", "ساعات")}`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "منذ يوم واحد";
  if (days === 2) return "منذ يومين";
  if (days < 7) return `منذ ${formatNumber(days)} أيام`;
  return formatDate(isoDate);
}

/** Day heading for a message group, e.g. "الأربعاء، 30 سبتمبر 2026" (fixed zone, so server and browser agree). */
export function formatDayLabel(isoDate: string): string {
  return new Intl.DateTimeFormat("ar-DZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: APP_TIME_ZONE,
  }).format(new Date(isoDate));
}

/** Calendar-day key (`YYYY-MM-DD`) in the app time zone, for grouping messages by day. */
export function dayKey(isoDate: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: APP_TIME_ZONE }).format(new Date(isoDate));
}
