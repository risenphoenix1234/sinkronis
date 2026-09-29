"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Loader2, Star, Target, X } from "lucide-react";
import { toast } from "react-toastify";
import { updateAppraisalGoalScore } from "@/lib/api/hris";
import type {
  Goal,
  UpdateAppraisalGoalScorePayload,
  UpdatedAppraisalGoalScoreData,
} from "@/lib/api/types/hrisTypes";

interface RateAppraisalGoalModalProps {
  open: boolean;
  onClose: () => void;
  appraisalId: string;
  goal: Goal | null;
  onSuccess?: (updated: UpdatedAppraisalGoalScoreData) => void;
}

const RATING_DESCRIPTIONS: Record<number, string> = {
  1: "1 - Poor Performance",
  2: "2 - Below Expectation",
  3: "3 - Meets Expectation",
  4: "4 - Above Expectation",
  5: "5 - Outstanding",
};

export default function RateAppraisalGoalModal({
  open,
  onClose,
  appraisalId,
  goal,
  onSuccess,
}: RateAppraisalGoalModalProps) {
  const [rating, setRating] = useState<number>(4);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [status, setStatus] = useState<string>("COMPLETED");
  const [comment, setComment] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (goal && open) {
      setRating(goal.managerRating || goal.employeeRating || 4);
      setStatus(
        goal.status === "LOCKED" ? "COMPLETED" : goal.status || "COMPLETED",
      );
      setComment(goal.managerComment || goal.employeeComment || "");
      setError(null);
    }
  }, [goal, open]);

  if (!open || !goal) return null;

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating || rating < 1 || rating > 5) {
      setError("Please select a valid rating between 1 and 5.");
      return;
    }

    setLoading(true);
    setError(null);

    const payload: UpdateAppraisalGoalScorePayload = {
      status,
      rating,
      comment: comment.trim() || undefined,
    };

    try {
      const updated = await updateAppraisalGoalScore(
        appraisalId,
        goal.id,
        payload,
      );
      toast.success("Appraisal goal updated successfully");
      onSuccess?.(updated);
      handleClose();
    } catch (err: unknown) {
      console.error("Failed to update goal score:", err);
      const resData = (err as { response?: { data?: { message?: string } } })
        ?.response?.data;
      const apiMsg = resData?.message;
      const msg =
        apiMsg ||
        (err instanceof Error
          ? err.message
          : "Failed to update appraisal goal. Ratings are only accepted during the appropriate evaluation stage.");
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const currentDisplayRating = hoverRating || rating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-all sm:p-7">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 ring-4 ring-amber-50/50">
              <Star size={20} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Rate & Comment on Goal
              </h3>
              <p className="text-xs text-slate-500">
                Provide an evaluation score and feedback for this objective.
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

        {/* Goal Overview */}
        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 text-xs text-slate-700">
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            <Target size={14} className="text-[#2183C6]" />
            <span>{goal.title}</span>
          </div>
          {goal.description && (
            <p className="mt-1 text-slate-500">{goal.description}</p>
          )}
          {goal.successCriteria && (
            <p className="mt-1 text-slate-500">
              <strong className="text-slate-600">Success Criteria:</strong>{" "}
              {goal.successCriteria}
            </p>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-600" />
            <div className="flex-1 leading-relaxed">{error}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Rating Stars / Scale */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Score / Rating <span className="text-red-500">*</span>
            </label>
            <div className="mt-2 flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  type="button"
                  key={val}
                  disabled={loading}
                  onClick={() => setRating(val)}
                  onMouseEnter={() => setHoverRating(val)}
                  onMouseLeave={() => setHoverRating(0)}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-semibold transition ${
                    val <= currentDisplayRating
                      ? "border-amber-400 bg-amber-500 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:border-amber-300 hover:bg-amber-50"
                  }`}
                >
                  {val}
                </button>
              ))}
              <span className="ml-2 text-xs font-semibold text-amber-700">
                {RATING_DESCRIPTIONS[currentDisplayRating] || ""}
              </span>
            </div>
          </div>

          {/* Goal Status */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Goal Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={loading}
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 disabled:bg-slate-50"
            >
              <option value="COMPLETED">Completed</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Evaluation Feedback / Comment
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. The target was met consistently during November and December."
              disabled={loading}
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 disabled:bg-slate-50"
            />
          </div>

          {/* Actions */}
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
                  Saving Score…
                </>
              ) : (
                "Save Score"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
