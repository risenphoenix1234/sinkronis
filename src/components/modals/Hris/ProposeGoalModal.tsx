"use client";

import { useState } from "react";
import { AlertCircle, Calendar, Loader2, Target, X } from "lucide-react";
import { toast } from "react-toastify";
import { proposeAppraisalGoal } from "@/lib/api/hris";
import type {
  AppraisalDetailCycle,
  CreatedAppraisalGoalData,
  ProposeAppraisalGoalPayload,
} from "@/lib/api/types/hrisTypes";

interface ProposeGoalModalProps {
  open: boolean;
  onClose: () => void;
  appraisalId: string;
  cycle?: AppraisalDetailCycle | null;
  onGoalProposed?: (goal: CreatedAppraisalGoalData) => void;
}

export default function ProposeGoalModal({
  open,
  onClose,
  appraisalId,
  cycle,
  onGoalProposed,
}: ProposeGoalModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [successCriteria, setSuccessCriteria] = useState("");
  const [targetDate, setTargetDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleReset = () => {
    setTitle("");
    setDescription("");
    setSuccessCriteria("");
    setTargetDate("");
    setError(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const cycleFromStr = cycle?.periodFrom
    ? new Date(cycle.periodFrom).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;
  const cycleToStr = cycle?.periodTo
    ? new Date(cycle.periodTo).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !title.trim() ||
      !description.trim() ||
      !successCriteria.trim() ||
      !targetDate
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError(null);

    const payload: ProposeAppraisalGoalPayload = {
      title: title.trim(),
      description: description.trim(),
      successCriteria: successCriteria.trim(),
      targetDate: targetDate.includes("T")
        ? targetDate.split("T")[0]
        : targetDate,
    };

    try {
      const createdGoal = await proposeAppraisalGoal(appraisalId, payload);
      toast.success("Appraisal goal proposed successfully");
      onGoalProposed?.(createdGoal);
      handleClose();
    } catch (err: unknown) {
      console.error("Failed to propose appraisal goal:", err);
      const resData = (err as { response?: { data?: { message?: string } } })
        ?.response?.data;
      const apiMsg = resData?.message;
      const msg =
        apiMsg ||
        (err instanceof Error
          ? err.message
          : "Failed to propose goal. Ensure goal setting is not locked and target date falls in the cycle.");
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-all sm:p-7">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 ring-4 ring-sky-50/50">
              <Target size={20} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Propose Appraisal Goal
              </h3>
              <p className="text-xs text-slate-500">
                Create a measurable objective for this evaluation cycle.
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

        {/* Cycle Date Guidance */}
        {cycleFromStr && cycleToStr && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-sky-50/70 px-3 py-2 text-xs text-sky-800">
            <Calendar size={14} className="shrink-0 text-sky-600" />
            <span>
              Evaluation Cycle:{" "}
              <strong className="font-semibold">{cycle?.name}</strong> (
              {cycleFromStr} — {cycleToStr})
            </span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50/90 p-3 text-xs text-red-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-600" />
            <div className="flex-1 leading-relaxed">{error}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Goal Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Reduce monthly order-processing time"
              disabled={loading}
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 disabled:bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Improve the fulfilment workflow by removing manual approval bottlenecks."
              disabled={loading}
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 disabled:bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Success Criteria <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={2}
              value={successCriteria}
              onChange={(e) => setSuccessCriteria(e.target.value)}
              placeholder="Reduce average processing time from 48 hours to 24 hours or less."
              disabled={loading}
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 disabled:bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Target Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              disabled={loading}
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 disabled:bg-slate-50"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Target date must fall within the cycle period.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-[#2183C6] px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1b6aa2] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Proposing Goal…
                </>
              ) : (
                "Propose Goal"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
