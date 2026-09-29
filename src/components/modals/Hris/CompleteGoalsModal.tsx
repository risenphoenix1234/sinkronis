"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Target, X } from "lucide-react";
import { toast } from "react-toastify";
import { completeAppraisalGoals } from "@/lib/api/hris";
import type { AppraisalDetail } from "@/lib/api/types/hrisTypes";

interface CompleteGoalsModalProps {
  open: boolean;
  onClose: () => void;
  appraisalId: string;
  goalCount?: number;
  onSuccess?: (updatedAppraisal: AppraisalDetail) => void;
}

export default function CompleteGoalsModal({
  open,
  onClose,
  appraisalId,
  goalCount = 0,
  onSuccess,
}: CompleteGoalsModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const handleConfirm = async () => {
    if (goalCount === 0) {
      setError(
        "At least one appraisal goal is required before employee confirmation.",
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updated = await completeAppraisalGoals(appraisalId);
      toast.success("Goals marked ready for employee confirmation");
      onSuccess?.(updated);
      handleClose();
    } catch (err: unknown) {
      console.error("Failed to mark goals complete:", err);
      const resData = (err as { response?: { data?: { message?: string } } })
        ?.response?.data;
      const apiMsg = resData?.message;
      const msg =
        apiMsg ||
        (err instanceof Error
          ? err.message
          : "Failed to mark goals ready for employee confirmation.");
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-all sm:p-7">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-4 ring-emerald-50/50">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Complete Goal Setting
              </h3>
              <p className="text-xs text-slate-500">
                Mark goals ready for employee confirmation.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-3">
          <p className="text-xs leading-relaxed text-slate-600">
            This will lock the proposed goals and notify the employee that their
            performance goals are ready for review and confirmation.
          </p>

          <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3.5 py-2.5 text-xs text-slate-700">
            <Target size={15} className="shrink-0 text-[#2183C6]" />
            <span>
              Total goals proposed:{" "}
              <strong className="font-semibold text-slate-900">
                {goalCount}
              </strong>
            </span>
          </div>

          {goalCount === 0 && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              <AlertCircle
                size={15}
                className="mt-0.5 shrink-0 text-amber-600"
              />
              <span>
                You must propose at least one goal before marking goal setting
                complete.
              </span>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              <AlertCircle size={15} className="mt-0.5 shrink-0 text-red-600" />
              <div className="flex-1 leading-relaxed">{error}</div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading || goalCount === 0}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Completing…
              </>
            ) : (
              <>
                <CheckCircle2 size={14} />
                Mark Goals Ready
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
