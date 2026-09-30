/** Shared, framework-free validation helpers for the dashboard forms. */

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2 MB
export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

const DATA_IMAGE_PATTERN = /^data:image\/(png|jpe?g|webp|gif);base64,/i;

export function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return false;
  // Round-trip guards against overflow dates such as 2026-02-31.
  const [year, month, day] = value.split("-").map(Number);
  return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
}

/** Empty is valid (image is optional). Otherwise must be an http(s) URL or a local image data URL. */
export function validateImageSource(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (DATA_IMAGE_PATTERN.test(trimmed)) return undefined;
  if (trimmed.length > 2048) return "رابط الصورة طويل جدًا.";
  try {
    const url = new URL(trimmed);
    if (url.protocol === "http:" || url.protocol === "https:") return undefined;
  } catch {
    // fall through to the error below
  }
  return "أدخل رابط صورة صحيحًا يبدأ بـ http:// أو https://";
}

/** True only for non-empty values that `validateImageSource` accepts — safe to hand to an <img src>. */
export function isSafeImageSource(value: string | undefined): value is string {
  return Boolean(value && value.trim() && validateImageSource(value) === undefined);
}

export function validateImageFile(file: File): string | undefined {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "نوع الملف غير مدعوم. اختر صورة بصيغة PNG أو JPG أو WebP أو GIF.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "حجم الصورة كبير. الحد الأقصى 2 ميغابايت.";
  }
  return undefined;
}

/** Adds a tag if it is non-empty, unique (case-insensitive) and within limits. */
export function addTag(tags: string[], raw: string, maxTags: number, maxLength: number): string[] {
  const tag = raw.trim().replace(/\s+/g, " ").slice(0, maxLength);
  if (!tag) return tags;
  if (tags.length >= maxTags) return tags;
  if (tags.some((existing) => existing.toLowerCase() === tag.toLowerCase())) return tags;
  return [...tags, tag];
}
