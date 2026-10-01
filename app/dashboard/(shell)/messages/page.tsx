import type { Metadata } from "next";
import { MessagesSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "الرسائل",
  description: "محادثاتك مع أعضاء الفرق وأصحاب المبادرات.",
};

/** Desktop placeholder next to the conversation list (on mobile the list fills the screen instead). */
export default function MessagesPage() {
  return (
    <div className="m-auto flex flex-col items-center gap-2 px-6 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <MessagesSquare className="h-7 w-7" aria-hidden="true" />
      </span>
      <p className="text-lg font-bold text-dark">اختر محادثة لعرضها</p>
      <p className="max-w-xs text-sm text-dark/60">اختر شخصًا من القائمة لمتابعة المحادثة حول المبادرة.</p>
    </div>
  );
}
