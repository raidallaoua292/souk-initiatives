import { NotificationType } from "@/types";

/** Short Arabic label per type, used for accessible text (status is never colour-only). */
export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  APPLICATION_RECEIVED: "طلب انضمام",
  APPLICATION_ACCEPTED: "قبول طلب",
  APPLICATION_REJECTED: "رفض طلب",
  APPLICATION_WITHDRAWN: "سحب طلب",
  NEW_MEMBER: "عضو جديد",
  MEMBER_REMOVED: "إزالة من الفريق",
  MEMBER_ROLE_CHANGED: "تغيير دور",
  NEW_MESSAGE: "رسالة",
  INITIATIVE_UPDATE: "تحديث مبادرة",
  SYSTEM: "النظام",
};

export type NotificationFilter = "all" | "unread";

export const NOTIFICATION_FILTER_LABELS: Record<NotificationFilter, string> = {
  all: "الكل",
  unread: "غير المقروءة",
};

/** How many notifications the navbar dropdown previews. */
export const DROPDOWN_LIMIT = 6;
