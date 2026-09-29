"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";
import { toast } from "react-toastify";
import { acknowledgeEmployeeAppraisal } from "@/lib/api/employee";
import { AcknowledgeAppraisalData } from "@/lib/api/types/employeeTypes";

interface AcknowledgeAppraisalModalProps {
  open: boolean;
  onClose: () => void;
  appraisalId: string;
  appraisalTitle?: string;
  finalScore?: number | null;
  rating?: string | null;
  onAcknowledged?: (data: AcknowledgeAppraisalData) => void;
}

export default function AcknowledgeAppraisalModal({
  open,
  onClose,
  appraisalId,
  appraisalTitle,
  finalScore,
  rating,
  onAcknowledged,
}: AcknowledgeAppraisalModalProps) {
  const [response, setResponse] = useState("I acknowledge this appraisal.");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appraisalId) {
      setError("No valid appraisal ID provided.");
      return;
    }

    if (!response.trim()) {
      setError("Please provide an acknowledgment statement.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await acknowledgeEmployeeAppraisal(appraisalId, {
        response: response.trim(),
      });
      toast.success(
        data?.status
          ? `Appraisal acknowledged (${data.status}).`
          : "Employee appraisal acknowledged successfully.",
      );
      if (onAcknowledged) {
        onAcknowledged(data);
      }
      onClose();
    } catch (err: unknown) {
      console.error("Failed to acknowledge appraisal:", err);
      const apiMsg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      const errorMsg =
        apiMsg ||
        (err instanceof Error
          ? err.message
          : "Failed to acknowledge appraisal. Please try again.");
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={19} />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Acknowledge Appraisal
              </h3>
              <p className="text-xs text-gray-500">
                {appraisalTitle || "Performance Appraisal Review"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Appraisal Summary Banner */}
          {(finalScore != null || rating) && (
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50/70 p-3.5 text-xs">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Approved Evaluation
                </span>
                <p className="mt-0.5 font-medium text-gray-800">
                  HR approval completed
                </p>
              </div>
              <div className="text-right">
                {finalScore != null && (
                  <span className="text-lg font-bold text-gray-900">
                    {Math.round(finalScore)}%
                  </span>
                )}
                {rating && (
                  <span className="ml-2 inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                    {rating}
                  </span>
                )}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700">
              Acknowledgment Statement <span className="text-red-500">*</span>
            </label>
            <p className="mt-0.5 text-[11px] text-gray-500">
              By confirming, you acknowledge that you have reviewed and
              discussed this appraisal result with your reviewer.
            </p>
            <textarea
              rows={3}
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              disabled={loading}
              placeholder="Enter your acknowledgment statement..."
              className="mt-2 w-full rounded-lg border border-gray-300 p-3 text-xs text-gray-900 shadow-xs focus:border-[#1683D8] focus:ring-2 focus:ring-[#1683D8]/20 focus:outline-hidden disabled:bg-gray-100"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 shadow-xs hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !response.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#1683D8] px-4 py-2 text-xs font-medium text-white shadow-xs hover:bg-[#1270B8] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Acknowledging...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={14} />
                  <span>Confirm Acknowledgment</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
