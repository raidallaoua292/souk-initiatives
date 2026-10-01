import { NotificationType, type Application, type Conversation, type Message, type Notification, type ParticipationRole } from "@/types";
import { ROLE_LABELS } from "@/lib/applications/constants";

/**
 * Builds the notifications that follow from something happening. Pure: ids and
 * the clock come in through `ctx`. Nobody is ever notified about their own action.
 */
export interface EventContext {
  newId: () => string;
  /** ISO timestamp. */
  now: string;
}

interface Draft {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  href?: string;
  actorId?: string;
  initiativeId?: string;
  applicationId?: string;
  conversationId?: string;
}

function build(ctx: EventContext, draft: Draft): Notification {
  return { id: ctx.newId(), createdAt: ctx.now, ...draft };
}

/** Drops notifications addressed to the person who caused the event. */
function forOthers(list: Notification[], actorId: string): Notification[] {
  return list.filter((n) => n.userId !== actorId);
}

const quote = (title: string) => `"${title}"`;

export function onApplicationSubmitted(
  ctx: EventContext,
  input: { application: Application; initiativeTitle: string; ownerId: string; applicantName: string },
): Notification[] {
  const { application, initiativeTitle, ownerId, applicantName } = input;
  return forOthers(
    [
      build(ctx, {
        userId: ownerId,
        type: NotificationType.APPLICATION_RECEIVED,
        title: "طلب انضمام جديد",
        message: `أرسل ${applicantName} طلبًا للانضمام إلى ${quote(initiativeTitle)} بصفة ${ROLE_LABELS[application.role]}.`,
        href: `/dashboard/initiatives/${application.initiativeId}/applications`,
        actorId: application.applicantId,
        initiativeId: application.initiativeId,
        applicationId: application.id,
      }),
    ],
    application.applicantId,
  );
}

/** Accept → the applicant hears it, and the people already on the team learn about the newcomer. */
export function onApplicationAccepted(
  ctx: EventContext,
  input: { application: Application; initiativeTitle: string; reviewerId: string; applicantName: string; teamMemberIds: string[] },
): Notification[] {
  const { application, initiativeTitle, reviewerId, applicantName, teamMemberIds } = input;
  const base = {
    actorId: reviewerId,
    initiativeId: application.initiativeId,
    applicationId: application.id,
  };
  const others = teamMemberIds.filter((id) => id !== application.applicantId);
  return forOthers(
    [
      build(ctx, {
        ...base,
        userId: application.applicantId,
        type: NotificationType.APPLICATION_ACCEPTED,
        title: "تم قبول طلبك",
        message: `تم قبول طلبك للانضمام إلى ${quote(initiativeTitle)} بصفة ${ROLE_LABELS[application.role]}.`,
        href: "/dashboard/applications",
      }),
      ...others.map((userId) =>
        build(ctx, {
          ...base,
          userId,
          type: NotificationType.NEW_MEMBER,
          title: "عضو جديد في الفريق",
          message: `انضم ${applicantName} إلى فريق ${quote(initiativeTitle)} بصفة ${ROLE_LABELS[application.role]}.`,
          href: `/dashboard/initiatives/${application.initiativeId}/team`,
        }),
      ),
    ],
    reviewerId,
  );
}

export function onApplicationRejected(
  ctx: EventContext,
  input: { application: Application; initiativeTitle: string; reviewerId: string },
): Notification[] {
  const { application, initiativeTitle, reviewerId } = input;
  return forOthers(
    [
      build(ctx, {
        userId: application.applicantId,
        type: NotificationType.APPLICATION_REJECTED,
        title: "تم رفض طلبك",
        message: `تم رفض طلبك للانضمام إلى ${quote(initiativeTitle)}. يمكنك الاطلاع على سبب الرفض.`,
        href: "/dashboard/applications",
        actorId: reviewerId,
        initiativeId: application.initiativeId,
        applicationId: application.id,
      }),
    ],
    reviewerId,
  );
}

/** The applicant withdrew: the owner is told. */
export function onApplicationWithdrawn(
  ctx: EventContext,
  input: { application: Application; initiativeTitle: string; ownerId: string; applicantName: string },
): Notification[] {
  const { application, initiativeTitle, ownerId, applicantName } = input;
  return forOthers(
    [
      build(ctx, {
        userId: ownerId,
        type: NotificationType.APPLICATION_WITHDRAWN,
        title: "تم سحب طلب انضمام",
        message: `سحب ${applicantName} طلبه للانضمام إلى ${quote(initiativeTitle)}.`,
        href: `/dashboard/initiatives/${application.initiativeId}/applications`,
        actorId: application.applicantId,
        initiativeId: application.initiativeId,
        applicationId: application.id,
      }),
    ],
    application.applicantId,
  );
}

export function onMemberRemoved(
  ctx: EventContext,
  input: { application: Application; initiativeTitle: string; actorId: string },
): Notification[] {
  const { application, initiativeTitle, actorId } = input;
  return forOthers(
    [
      build(ctx, {
        userId: application.applicantId,
        type: NotificationType.MEMBER_REMOVED,
        title: "تمت إزالتك من الفريق",
        message: `تمت إزالتك من فريق ${quote(initiativeTitle)}. يمكنك التقدّم بطلب جديد إذا رغبت.`,
        href: "/dashboard/applications",
        actorId,
        initiativeId: application.initiativeId,
        applicationId: application.id,
      }),
    ],
    actorId,
  );
}

export function onMemberRoleChanged(
  ctx: EventContext,
  input: { application: Application; previousRole: ParticipationRole; initiativeTitle: string; actorId: string },
): Notification[] {
  const { application, previousRole, initiativeTitle, actorId } = input;
  return forOthers(
    [
      build(ctx, {
        userId: application.applicantId,
        type: NotificationType.MEMBER_ROLE_CHANGED,
        title: "تم تغيير دورك في الفريق",
        message: `تغيّر دورك في ${quote(initiativeTitle)} من ${ROLE_LABELS[previousRole]} إلى ${ROLE_LABELS[application.role]}.`,
        href: "/dashboard/applications",
        actorId,
        initiativeId: application.initiativeId,
        applicationId: application.id,
      }),
    ],
    actorId,
  );
}

export function onMessageSent(
  ctx: EventContext,
  input: { message: Message; conversation: Conversation; senderName: string; recipientId: string },
): Notification[] {
  const { message, conversation, senderName, recipientId } = input;
  return forOthers(
    [
      build(ctx, {
        userId: recipientId,
        type: NotificationType.NEW_MESSAGE,
        title: "رسالة جديدة",
        message: `${senderName}: ${truncate(message.content, 90)}`,
        href: `/dashboard/messages/${conversation.id}`,
        actorId: message.senderId,
        initiativeId: conversation.initiativeId,
        conversationId: conversation.id,
      }),
    ],
    message.senderId,
  );
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}
