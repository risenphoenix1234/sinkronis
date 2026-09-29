"use client";

import { useState } from "react";
import { AlertCircle, Loader2, X } from "lucide-react";
import { toast } from "react-toastify";
import { createEmployeeAppraisalGoal } from "@/lib/api/employee";
import {
  CreateEmployeeAppraisalGoalPayload,
  HistoricalAppraisalGoal,
} from "@/lib/api/types/employeeTypes";

interface AddGoalModalProps {
  open: boolean;
  onClose: () => void;
  appraisalId?: string;
  onGoalCreated?: (goal: HistoricalAppraisalGoal) => void;
}

export default function AddGoalModal({
  open,
  onClose,
  appraisalId,
  onGoalCreated,
}: AddGoalModalProps) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !title.trim() ||
      !description.trim() ||
      !successCriteria.trim() ||
      !targetDate
    ) {
      setError("All fields are required to create a performance goal.");
      return;
    }

    setLoading(true);
    setError(null);

    const payload: CreateEmployeeAppraisalGoalPayload = {
      title: title.trim(),
      description: description.trim(),
      successCriteria: successCriteria.trim(),
      targetDate: targetDate.includes("T")
        ? targetDate.split("T")[0]
        : targetDate,
    };

    try {
      if (appraisalId) {
        const createdGoal = await createEmployeeAppraisalGoal(
          appraisalId,
          payload,
        );
        toast.success("Employee appraisal goal created successfully");
        onGoalCreated?.(createdGoal);
      } else {
        toast.success("Goal saved");
      }
      handleClose();
    } catch (err: unknown) {
      console.error("Failed to create employee appraisal goal:", err);
      const apiMsg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(
        apiMsg ||
          (err instanceof Error
            ? err.message
            : "Failed to create goal. Please try again."),
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
              Add Performance Goal
            </h2>
            <p className="mt-0.5 text-xs text-gray-500">
              Define your key objective and success criteria for this appraisal
              cycle.
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

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Goal Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Reduce order-processing time"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2.5 text-xs text-gray-900 placeholder-gray-400 focus:border-[#1683D8] focus:outline-none focus:ring-1 focus:ring-[#1683D8]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Remove manual approval bottlenecks."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2.5 text-xs text-gray-900 placeholder-gray-400 focus:border-[#1683D8] focus:outline-none focus:ring-1 focus:ring-[#1683D8]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Success Criteria <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={2}
              placeholder="e.g. Average processing time is 24 hours or less."
              value={successCriteria}
              onChange={(e) => setSuccessCriteria(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2.5 text-xs text-gray-900 placeholder-gray-400 focus:border-[#1683D8] focus:outline-none focus:ring-1 focus:ring-[#1683D8]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Target Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2.5 text-xs text-gray-900 focus:border-[#1683D8] focus:outline-none focus:ring-1 focus:ring-[#1683D8]"
            />
          </div>

          {/* Modal Footer */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
            <button
              type="button"
              disabled={loading}
              onClick={handleClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#1683D8] px-5 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-[#1270B8] disabled:opacity-50"
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {loading ? "Creating Goal..." : "Create Goal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
