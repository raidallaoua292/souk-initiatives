"use client";

import { useState } from "react";
import { Check, XCircle } from "lucide-react";
import type { ApplicationWithRelations } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";
import { controlClasses } from "@/components/forms/fields";
import { useMockStore } from "@/lib/store";
import { REVIEW_NOTE_LIMITS, validateReviewNote, type ReviewDecision } from "@/lib/applications";
import { ApplicationDetails } from "./ApplicationDetails";

interface ReviewApplicationModalProps {
  /** The application being reviewed, looked up fresh by the caller on every render. */
  application: ApplicationWithRelations | null;
  onClose: () => void;
}

/**
 * Applicant details plus, while the application is PENDING, the review note
 * and accept/reject controls. Once a decision lands, `application.status`
 * changes and this swaps to a read-only view — no local status is held, so
 * a stale action can never be shown.
 */
export function ReviewApplicationModal({ application, onClose }: ReviewApplicationModalProps) {
  return (
    <Modal open={application !== null} onClose={onClose} title="مراجعة طلب الانضمام" description={application?.initiative.title}>
      {/* Keyed by id so switching applicants resets note/error state by remounting. */}
      {application && <ReviewApplicationBody key={application.id} application={application} />}
    </Modal>
  );
}

function ReviewApplicationBody({ application }: { application: ApplicationWithRelations }) {
  const { reviewApplication } = useMockStore();
  const [note, setNote] = useState("");
  const [decisionInFlight, setDecisionInFlight] = useState<ReviewDecision | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleDecision(decision: ReviewDecision) {
    const noteError = validateReviewNote(decision, note);
    if (noteError) {
      setError(noteError);
      return;
    }
    setDecisionInFlight(decision);
    const result = reviewApplication(application.id, decision, note);
    if (!result.ok) {
      setError(result.error);
      setDecisionInFlight(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Avatar name={application.applicant.name} colorClass={application.applicant.avatarColor} src={application.applicant.avatarUrl} />
        <p className="font-bold text-dark">{application.applicant.name}</p>
      </div>

      <ApplicationDetails application={application} />

      {application.status === "PENDING" && (
        <div className="space-y-3 border-t border-dark/10 pt-4">
          <label htmlFor="review-note" className="block text-sm font-semibold text-dark">
            ملاحظة المراجعة <span className="font-normal text-dark/50">(مطلوبة عند الرفض)</span>
          </label>
          <textarea
            id="review-note"
            rows={3}
            value={note}
            onChange={(event) => {
              setNote(event.target.value);
              setError(null);
            }}
            maxLength={REVIEW_NOTE_LIMITS.max}
            placeholder="اكتب رسالة ترحيب، أو سبب الرفض إن كنت ستعتذر عن الطلب..."
            aria-invalid={error ? true : undefined}
            className={controlClasses(Boolean(error))}
          />
          {error && <p className="text-xs font-semibold text-red-700">{error}</p>}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => handleDecision("ACCEPT")}
              disabled={decisionInFlight !== null}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check className="h-4 w-4" aria-hidden="true" />
              قبول الطلب
            </button>
            <button
              type="button"
              onClick={() => handleDecision("REJECT")}
              disabled={decisionInFlight !== null}
              className="inline-flex items-center gap-2 rounded-full border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <XCircle className="h-4 w-4" aria-hidden="true" />
              رفض الطلب
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
