"use client";

import Link from "next/link";
import { Alert } from "@/components/ui/Alert";
import { useMockStore } from "@/lib/store";

/**
 * Permanent "this is demo data" banner plus the one-off result message
 * (created / saved / deleted...) coming from the store.
 */
export function DashboardNotices() {
  const { notice, dismissNotice } = useMockStore();

  return (
    <div className="space-y-3">
      <Alert tone="info">
        <strong>وضع تجريبي:</strong> تعمل لوحة التحكم بحساب وهمي وبيانات تجريبية. أي تغيير تجريه
        يُحفظ في ذاكرة المتصفح فقط ويختفي عند تحديث الصفحة.
      </Alert>

      {/* Persistent live region so screen readers announce notices that appear later. */}
      <div aria-live="polite">
        {notice && (
          <Alert
            tone={notice.tone}
            announce={false}
            onDismiss={dismissNotice}
            action={
              notice.action && (
                <Link href={notice.action.href} className="underline underline-offset-2">
                  {notice.action.label}
                </Link>
              )
            }
          >
            {notice.message}
          </Alert>
        )}
      </div>
    </div>
  );
}
