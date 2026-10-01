import type { Conversation } from "@/types";

/**
 * 1-to-1 conversations of the demo user (usr-01). Initiative titles are not
 * repeated here: they are resolved from `initiativeId`.
 * `updatedAt` always equals the time of the last message.
 */
export const conversations: Conversation[] = [
  {
    // Accepted volunteer asking when activities start (unread).
    id: "conv-01",
    participantIds: ["usr-01", "usr-02"],
    initiativeId: "init-06",
    createdAt: "2026-09-28T17:20:00.000Z",
    updatedAt: "2026-09-30T08:10:00.000Z",
    lastMessageId: "msg-03",
  },
  {
    // Accepted expert (native-species list); all read.
    id: "conv-02",
    participantIds: ["usr-01", "usr-03"],
    initiativeId: "init-06",
    createdAt: "2026-09-26T11:00:00.000Z",
    updatedAt: "2026-09-27T10:30:00.000Z",
    lastMessageId: "msg-07",
  },
  {
    // The demo user is the expert on the other owner's initiative (2 unread).
    id: "conv-03",
    participantIds: ["usr-01", "usr-06"],
    initiativeId: "init-01",
    createdAt: "2026-09-29T14:00:00.000Z",
    updatedAt: "2026-09-29T14:05:00.000Z",
    lastMessageId: "msg-09",
  },
  {
    // Partner association confirming how many seedlings it can supply.
    id: "conv-04",
    participantIds: ["usr-01", "usr-05"],
    initiativeId: "init-06",
    createdAt: "2026-09-25T15:00:00.000Z",
    updatedAt: "2026-09-25T17:45:00.000Z",
    lastMessageId: "msg-11",
  },
  {
    // A pending supporter clarifying the help they can give.
    id: "conv-05",
    participantIds: ["usr-01", "usr-10"],
    initiativeId: "init-06",
    createdAt: "2026-09-24T10:30:00.000Z",
    updatedAt: "2026-09-24T14:20:00.000Z",
    lastMessageId: "msg-13",
  },
  {
    // No initiative context: a general conversation.
    id: "conv-06",
    participantIds: ["usr-01", "usr-04"],
    createdAt: "2026-09-20T19:00:00.000Z",
    updatedAt: "2026-09-20T19:40:00.000Z",
    lastMessageId: "msg-15",
  },
];
