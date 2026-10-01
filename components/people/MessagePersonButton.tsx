"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, UserRoundCog } from "lucide-react";
import { useMockStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";

/** "مراسلة" opens (or reuses) a 1-to-1 conversation; on your own profile it links to profile editing instead. */
export function MessagePersonButton({ personId, personName }: { personId: string; personName: string }) {
  const router = useRouter();
  const { currentUser, startConversation } = useMockStore();
  const [error, setError] = useState<string | null>(null);

  if (personId === currentUser.id) {
    return (
      <Button href="/dashboard/profile" variant="outline" size="sm" icon={<UserRoundCog className="h-4 w-4" aria-hidden="true" />}>
        تعديل ملفي الشخصي
      </Button>
    );
  }

  function open() {
    const result = startConversation(personId);
    if (result.ok) router.push(`/dashboard/messages/${result.value.id}`);
    else setError(result.error);
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <Button
        onClick={open}
        size="sm"
        icon={<MessageSquare className="h-4 w-4" aria-hidden="true" />}
        aria-label={`مراسلة ${personName}`}
      >
        مراسلة
      </Button>
      {error && (
        <p role="alert" className="text-sm font-semibold text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
