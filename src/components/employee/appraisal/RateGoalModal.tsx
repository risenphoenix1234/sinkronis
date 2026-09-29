"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Check, Loader2, Star, X } from "lucide-react";
import { toast } from "react-toastify";
import { updateEmployeeAppraisalGoal } from "@/lib/api/employee";
import {
  EmployeeGoalAssessmentStatus,
  HistoricalAppraisalGoal,
  UpdateEmployeeAppraisalGoalPayload,
} from "@/lib/api/types/employeeTypes";

interface RateGoalModalProps {
  open: boolean;
  onClose: () => void;
  appraisalId: string;
  goal: HistoricalAppraisalGoal | null;
  onGoalUpdated?: (updatedGoal: HistoricalAppraisalGoal) => void;
}

const RATING_LABELS: Record<number, string> = {
  1: "1 - Unsatisfactory",
  2: "2 - Needs Improvement",
  3: "3 - Meets Expectations",
  4: "4 - Exceeds Expectations",
  5: "5 - Outstanding",
};

export default function RateGoalModal({
  open,
  onClose,
  appraisalId,
  goal,
  onGoalUpdated,
}: RateGoalModalProps) {
  const [status, setStatus] =
    useState<EmployeeGoalAssessmentStatus>("NOT_STARTED");
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (goal && open) {
      const validStatuses: EmployeeGoalAssessmentStatus[] = [
        "NOT_STARTED",
        "IN_PROGRESS",
        "COMPLETED",
      ];
      const initialStatus = validStatuses.includes(
        goal.status?.toUpperCase() as EmployeeGoalAssessmentStatus,
      )
        ? (goal.status?.toUpperCase() as EmployeeGoalAssessmentStatus)
        : "NOT_STARTED";

      setStatus(initialStatus);
      setRating(
        typeof goal.employeeRating === "number" &&
          goal.employeeRating >= 1 &&
          goal.employeeRating <= 5
          ? goal.employeeRating
          : 0,
      );
      setComment(goal.employeeComment || "");
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

    if (!appraisalId) {
      setError("No active appraisal ID found. Please refresh the page.");
      return;
    }

    if (rating === 0 && !comment.trim() && !status) {
      setError("Please provide a rating, status, or comment for this goal.");
      return;
    }

    setLoading(true);
    setError(null);

    const payload: UpdateEmployeeAppraisalGoalPayload = {
      status,
      ...(rating > 0 ? { rating } : {}),
      ...(comment.trim() ? { comment: comment.trim() } : {}),
    };

    try {
      const res = await updateEmployeeAppraisalGoal(
        appraisalId,
        goal.id,
        payload,
      );
      toast.success(res.message || "Goal assessment updated successfully");

      const updatedGoal: HistoricalAppraisalGoal = {
        ...goal,
        status,
        ...(rating > 0 ? { employeeRating: rating } : {}),
        ...(comment.trim() ? { employeeComment: comment.trim() } : {}),
        ...(res.data && typeof res.data === "object" && "id" in res.data
          ? (res.data as HistoricalAppraisalGoal)
          : {}),
      };

      onGoalUpdated?.(updatedGoal);
      handleClose();
    } catch (err: unknown) {
      console.error("Failed to update goal assessment:", err);
      const apiMsg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(
        apiMsg ||
          (err instanceof Error
            ? err.message
            : "Failed to update goal assessment. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-xl bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-gray-100 p-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Assess Performance Goal
            </h2>
            <p className="mt-0.5 text-xs text-gray-500">
              Provide your self-assessment rating, current status, and
              supporting comments.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-y-auto p-6 space-y-4"
        >
          {error && (
            <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Goal Context Summary */}
          <div className="rounded-lg border border-gray-200 bg-gray-50/70 p-3.5 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Selected Goal
              </span>
              {goal.targetDate && (
                <span className="text-[11px] text-gray-500">
                  Target: {goal.targetDate.split("T")[0]}
                </span>
              )}
            </div>
            <p className="font-semibold text-gray-900 text-sm">{goal.title}</p>
            {goal.description && (
              <p className="text-gray-600">{goal.description}</p>
            )}
            {goal.successCriteria && (
              <p className="text-gray-500 text-[11px] pt-0.5">
                <span className="font-medium text-gray-700">
                  Success Criteria:
                </span>{" "}
                {goal.successCriteria}
              </p>
            )}
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Goal Status <span className="text-red-500">*</span>
            </label>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as EmployeeGoalAssessmentStatus)
              }
              className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-xs text-gray-900 focus:border-[#1683D8] focus:outline-none focus:ring-1 focus:ring-[#1683D8]"
            >
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {/* Self-Rating (1-5 scale) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-gray-700">
                Employee Self-Rating (1 – 5)
              </label>
              {(hoverRating > 0 || rating > 0) && (
                <span className="text-xs font-medium text-[#1683D8]">
                  {RATING_LABELS[hoverRating || rating]}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              {[1, 2, 3, 4, 5].map((starValue) => {
                const isFilled = (hoverRating || rating) >= starValue;
                return (
                  <button
                    key={starValue}
                    type="button"
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="rounded p-1 transition hover:scale-110 focus:outline-none"
                    aria-label={`Rate ${starValue} stars`}
                  >
                    <Star
                      size={24}
                      className={
                        isFilled
                          ? "fill-[#F59E0B] text-[#F59E0B]"
                          : "text-gray-300 hover:text-gray-400"
                      }
                    />
                  </button>
                );
              })}
              {rating > 0 && (
                <button
                  type="button"
                  onClick={() => setRating(0)}
                  className="ml-2 text-[11px] text-gray-400 hover:text-gray-600 underline"
                >
                  Clear
                </button>
              )}
            </div>
            <p className="mt-1 text-[11px] text-gray-400">
              Rate your individual performance and milestone achievement on this
              goal.
            </p>
          </div>

          {/* Comment / Supporting Evidence */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Self-Assessment Comment & Evidence
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Completed all key deliverables on time. Manual bottleneck was reduced to under 24 hours."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2.5 text-xs text-gray-900 placeholder-gray-400 focus:border-[#1683D8] focus:outline-none focus:ring-1 focus:ring-[#1683D8]"
            />
            <p className="mt-1 text-[11px] text-gray-400">
              Optional notes or achievements to share with your manager during
              the review.
            </p>
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              disabled={loading}
              onClick={handleClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#1683D8] px-4 py-2 text-xs font-medium text-white shadow-xs transition hover:bg-[#1270B8] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={14} />
                  Save Assessment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
