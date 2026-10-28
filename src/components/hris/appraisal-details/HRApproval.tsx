"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Clock,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { getHrApproval, submitHrApproval } from "@/lib/api/hris";
import type {
  GetHrApprovalData,
  HrApprovalDecision,
  SubmitHrApprovalData,
} from "@/lib/api/types/hrisTypes";
import Loader from "@/components/ui/Loader";

export interface HRApprovalProps {
  appraisalId?: string;
  data?: GetHrApprovalData | null;
  loading?: boolean;
  error?: string | null;
  pendingMessage?: string | null;
  forbiddenMessage?: string | null;
  onRetry?: () => void;
  onReturnForRevision?: (notes: string) => void;
  onApprove?: (notes: string) => void;
  onDecisionRecorded?: (result: SubmitHrApprovalData) => void;
  hrNotes?: string;
  onHrNotesChange?: (notes: string) => void;
}

export default function HRApproval({
  appraisalId,
  data: externalData,
  loading: externalLoading,
  error: externalError,
  pendingMessage: externalPendingMessage,
  forbiddenMessage: externalForbiddenMessage,
  onRetry: externalOnRetry,
  onReturnForRevision,
  onApprove,
  onDecisionRecorded,
  hrNotes: externalNotes,
  onHrNotesChange,
}: HRApprovalProps) {
  const [internalData, setInternalData] = useState<GetHrApprovalData | null>(
    null,
  );
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const [internalPending, setInternalPending] = useState<string | null>(null);
  const [internalForbidden, setInternalForbidden] = useState<string | null>(
    null,
  );

  const [internalNotes, setInternalNotes] = useState("");
  const [submittingDecision, setSubmittingDecision] =
    useState<HrApprovalDecision | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isControlled =
    externalData !== undefined ||
    externalLoading !== undefined ||
    externalError !== undefined ||
    externalPendingMessage !== undefined ||
    externalForbiddenMessage !== undefined;

  const data = isControlled ? externalData : internalData;
  const loading = isControlled ? Boolean(externalLoading) : internalLoading;
  const error = isControlled ? externalError : internalError;
  const pendingMessage = isControlled
    ? externalPendingMessage
    : internalPending;
  const forbiddenMessage = isControlled
    ? externalForbiddenMessage
    : internalForbidden;

  const currentNotes =
    externalNotes !== undefined ? externalNotes : internalNotes;

  const fetchHrApproval = useCallback(() => {
    if (!appraisalId || isControlled) return;
    setInternalLoading(true);
    setInternalError(null);
    setInternalPending(null);
    setInternalForbidden(null);

    getHrApproval(appraisalId)
      .then((res) => {
        setInternalData(res);
        if (res?.hrNotes) {
          setInternalNotes(res.hrNotes);
        }
      })
      .catch((err) => {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 409) {
            setInternalPending(
              err.response.data?.message ||
                "Manager review has not been submitted yet. HR approval will unlock once manager review is submitted.",
            );
          } else if (err.response?.status === 403) {
            setInternalForbidden(
              err.response.data?.message ||
                "HR permission required. You do not have permission to view internal HR approval notes.",
            );
          } else {
            const msg =
              err.response?.data?.message || "Failed to load HR approval view.";
            setInternalError(msg);
            toast.error(msg);
          }
        } else {
          const msg =
            err instanceof Error
              ? err.message
              : "Failed to load HR approval view.";
          setInternalError(msg);
          toast.error(msg);
        }
      })
      .finally(() => {
        setInternalLoading(false);
      });
  }, [appraisalId, isControlled]);

  useEffect(() => {
    fetchHrApproval();
  }, [fetchHrApproval]);

  // Sync initial notes from data when data changes
  useEffect(() => {
    if (data?.hrNotes && !internalNotes) {
      setInternalNotes(data.hrNotes);
    }
  }, [data, internalNotes]);

  const handleRetry = () => {
    if (externalOnRetry) {
      externalOnRetry();
    } else {
      fetchHrApproval();
    }
  };

  const handleNotesChange = (val: string) => {
    if (onHrNotesChange) {
      onHrNotesChange(val);
    } else {
      setInternalNotes(val);
    }
  };

  const handleRecordDecision = async (decision: HrApprovalDecision) => {
    const targetId = appraisalId || data?.appraisalId;

    if (!targetId) {
      if (decision === "APPROVED") {
        onApprove?.(currentNotes);
      } else {
        onReturnForRevision?.(currentNotes);
      }
      return;
    }

    setSubmittingDecision(decision);
    setSubmitError(null);

    try {
      const trimmedNotes = currentNotes?.trim() || undefined;
      const res = await submitHrApproval(targetId, {
        decision,
        hrNotes: trimmedNotes,
      });

      if (decision === "APPROVED") {
        toast.success(
          res.decision === "APPROVED"
            ? "Appraisal approved and sent to employee."
            : "HR decision recorded successfully.",
        );
      } else {
        toast.success("Appraisal returned for revision successfully.");
      }

      setInternalData((prev) => ({
        ...prev,
        appraisalId: res.appraisalId,
        stage: res.stage,
        decision: res.decision,
        approvedAt: res.approvedAt,
        returnedAt: res.returnedAt,
        hrNotes: currentNotes,
      }));

      onDecisionRecorded?.(res);
      if (decision === "APPROVED") {
        onApprove?.(currentNotes);
      } else {
        onReturnForRevision?.(currentNotes);
      }
    } catch (err) {
      console.error("Failed to record HR approval decision:", err);
      if (axios.isAxiosError(err)) {
        const resData = err.response?.data;
        const validationMsg = Array.isArray(resData?.validationErrors)
          ? resData.validationErrors
              .map(
                (v: { field?: string; path?: string; message?: string }) =>
                  `${v.field || v.path || "Field"}: ${v.message || "Invalid value"}`,
              )
              .join("; ")
          : null;
        const msg =
          validationMsg ||
          resData?.message ||
          (err.response?.status === 409
            ? "Appraisal is not awaiting HR approval or is in the wrong stage."
            : `Failed to ${decision === "APPROVED" ? "approve appraisal" : "return appraisal for revision"}.`);
        setSubmitError(msg);
        toast.error(msg);
      } else {
        const msg =
          err instanceof Error ? err.message : `Failed to record HR decision.`;
        setSubmitError(msg);
        toast.error(msg);
      }
    } finally {
      setSubmittingDecision(null);
    }
  };

  // 1. Loading State
  if (loading) {
    return (
      <section className="w-full overflow-hidden rounded-md border border-[#A67C00] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-[#FFFCF3] px-5 py-4">
          <div className="flex items-center gap-2">
            <Shield size={16} strokeWidth={1.8} className="text-[#946B00]" />
            <h2 className="text-[13px] font-semibold text-[#1F2937]">
              HR Approval
            </h2>
          </div>
          <div className="h-5 w-24 animate-pulse rounded-full bg-slate-200" />
        </div>
        <div className="flex flex-col items-center justify-center py-10 text-slate-500 gap-2">
          <Loader2 size={22} className="animate-spin text-[#946B00]" />
          <Loader variant="section" label="Loading HR approval view" />
        </div>
      </section>
    );
  }

  // 2. 403 Forbidden State (Permission Required)
  if (forbiddenMessage) {
    return (
      <section className="w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
          <div className="flex items-center gap-2">
            <ShieldAlert
              size={16}
              strokeWidth={1.8}
              className="text-slate-500"
            />
            <h2 className="text-[13px] font-semibold text-slate-700">
              HR Approval
            </h2>
          </div>
          <span className="rounded-full bg-red-100 px-3 py-1 text-[10px] font-semibold text-red-700">
            HR Restricted
          </span>
        </div>
        <div className="p-5">
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <ShieldAlert size={18} className="mt-0.5 shrink-0 text-red-600" />
            <div>
              <h3 className="text-xs font-semibold text-red-900">
                HR Permission Required
              </h3>
              <p className="mt-0.5 text-xs leading-relaxed text-red-700">
                {forbiddenMessage}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 3. 409 Pending State (Manager review pending)
  if (pendingMessage) {
    return (
      <section className="w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
          <div className="flex items-center gap-2">
            <Shield size={16} strokeWidth={1.8} className="text-slate-500" />
            <h2 className="text-[13px] font-semibold text-slate-700">
              HR Approval
            </h2>
          </div>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-semibold text-amber-800">
            Pending Manager Review
          </span>
        </div>
        <div className="p-5">
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50/70 p-4">
            <Clock size={18} className="mt-0.5 shrink-0 text-amber-600" />
            <div>
              <h3 className="text-xs font-semibold text-amber-900">
                HR Approval Pending
              </h3>
              <p className="mt-0.5 text-xs leading-relaxed text-amber-800">
                {pendingMessage}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 4. Error State
  if (error) {
    return (
      <section className="w-full overflow-hidden rounded-md border border-red-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-red-100 bg-red-50/50 px-5 py-4">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} strokeWidth={1.8} className="text-red-600" />
            <h2 className="text-[13px] font-semibold text-red-900">
              HR Approval
            </h2>
          </div>
        </div>
        <div className="flex items-center justify-between p-5 text-xs text-red-700">
          <span>{error}</span>
          <button
            type="button"
            onClick={handleRetry}
            className="inline-flex items-center gap-1 font-semibold underline hover:text-red-900"
          >
            <RefreshCw size={12} />
            <span>Retry</span>
          </button>
        </div>
      </section>
    );
  }

  // 5. Decision / Success State
  const decision = data?.decision;
  const isApproved = decision === "APPROVED";
  const isReturned =
    decision === "RETURNED_FOR_REVIEW" ||
    Boolean(data?.returnedAt) ||
    Boolean((data as Record<string, unknown>)?.isReturned);

  return (
    <section className="w-full overflow-hidden rounded-xl border border-[#D08700] bg-white shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-dashed border-[#FEDF89] bg-white px-6 py-4">
        <div className="flex items-center gap-2">
          {isApproved ? (
            <ShieldCheck
              size={18}
              strokeWidth={2}
              className="text-[#16803C]"
            />
          ) : (
            <Shield size={18} strokeWidth={2} className="text-[#8A5800]" />
          )}

          <h2 className="text-sm font-semibold text-slate-900">
            HR Approval
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {isReturned && (
            <span className="rounded-full bg-[#FEF3F2] border border-[#FECDCA] px-2.5 py-0.5 text-xs font-medium text-[#B42318]">
              Returned
            </span>
          )}
          {isApproved ? (
            <span className="rounded-full bg-[#ECFDF3] border border-[#A6F4C5] px-2.5 py-0.5 text-xs font-medium text-[#027A48]">
              Approved
            </span>
          ) : (
            <span className="rounded-full bg-[#FEF0C7] border border-[#FEDF89] px-2.5 py-0.5 text-xs font-medium text-[#B54708]">
              Awaiting Decision
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-5 space-y-4">
        <div>
          <label
            htmlFor="hr-notes"
            className="mb-1.5 block text-xs font-medium text-slate-500"
          >
            HR Notes (internal — not visible to employee)
          </label>

          {isApproved ? (
            <div
              id="hr-notes"
              className="min-h-[48px] rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed text-slate-700"
            >
              {currentNotes ||
                "Ratings and supporting comments comply with the review policy."}
            </div>
          ) : (
            <textarea
              id="hr-notes"
              rows={3}
              value={currentNotes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Calibration notes, flags, succession planning observations..."
              className="w-full resize-y rounded-lg border border-slate-200 p-3.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#8A5800] focus:ring-1 focus:ring-[#8A5800]/20 min-h-[90px]"
            />
          )}
        </div>

        {/* Error Alert if submit failed */}
        {submitError && (
          <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-600" />
            <span className="leading-relaxed">{submitError}</span>
          </div>
        )}

        {/* Actions (only shown if awaiting decision) */}
        {!isApproved && (
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={submittingDecision !== null}
              onClick={() => handleRecordDecision("RETURNED_FOR_REVIEW")}
              className="inline-flex items-center gap-2 rounded-lg border border-[#FDA29B] bg-[#FFF5F5] hover:bg-[#FEE4E2] px-5 py-2.5 text-sm font-semibold text-[#D92D20] transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submittingDecision === "RETURNED_FOR_REVIEW" ? (
                <>
                  <Loader2 size={15} className="animate-spin text-[#D92D20]" />
                  <span>Returning...</span>
                </>
              ) : (
                <span>Return for Revision</span>
              )}
            </button>

            <button
              type="button"
              disabled={submittingDecision !== null}
              onClick={() => handleRecordDecision("APPROVED")}
              className="inline-flex items-center gap-2 rounded-lg bg-[#8A5800] hover:bg-[#734900] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submittingDecision === "APPROVED" ? (
                <>
                  <Loader2 size={15} className="animate-spin text-white" />
                  <span>Approving...</span>
                </>
              ) : (
                <span>Approve &amp; Send to Employee</span>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
