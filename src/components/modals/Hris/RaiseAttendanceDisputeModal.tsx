"use client";

import { MessageSquare, X } from "lucide-react";
import { Attendance } from "@/types/hris/attendance";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { raiseAttendanceDispute } from "@/lib/api/hris";

interface RaiseAttendanceDisputeModalProps {
  isOpen: boolean;
  employee: Attendance | null;
  onClose: () => void;
  onSubmitted?: () => void; // lets the parent refetch after a successful raise
}

export interface DisputeFormData {
  issueType: string;
  actualClockIn: string;
  actualClockOut: string;
  description: string;
}

// UI labels map to the backend's confirmed enum values (only
// MISSING_CLOCK_IN seen in Swagger's example — the rest are guessed
// following the same naming pattern; verify once tested).
const ISSUE_TYPE_OPTIONS: { label: string; value: string }[] = [
  { label: "Missing Clock In", value: "MISSING_CLOCK_IN" },
  { label: "Missing Clock Out", value: "MISSING_CLOCK_OUT" },
  { label: "Incorrect Hours", value: "INCORRECT_HOURS" },
  { label: "Wrong Shift", value: "WRONG_SHIFT" },
  { label: "Overtime Missing", value: "OVERTIME_MISSING" },
];

export default function RaiseAttendanceDisputeModal({
  isOpen,
  employee,
  onClose,
  onSubmitted,
}: RaiseAttendanceDisputeModalProps) {
  const [form, setForm] = useState<DisputeFormData>({
    issueType: "",
    actualClockIn: "",
    actualClockOut: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !employee) return null;

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await raiseAttendanceDispute(employee.id, {
        issueType: form.issueType,
        description: form.description,
        claimedClockIn: form.actualClockIn || undefined,
        claimedClockOut: form.actualClockOut || undefined,
      });

      setForm({
        issueType: "",
        actualClockIn: "",
        actualClockOut: "",
        description: "",
      });

      toast.success("Attendance dispute raised successfully.");
      onSubmitted?.();
      onClose();
    } catch (err) {
      console.error(
        "Raise dispute failed:",
        axios.isAxiosError(err) ? err.response?.data : err,
      );
      let errMsg = "Couldn't submit this dispute.";
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        errMsg = "There's already a pending dispute for this attendance record.";
      } else if (axios.isAxiosError(err)) {
        errMsg = err.response?.data?.message ?? "Couldn't submit this dispute.";
      }
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const isDisabled = !form.issueType || !form.description.trim() || submitting;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <MessageSquare className="h-3 w-3 text-blue-600" /> Raise
                Attendance Dispute
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {employee.name} • {employee.id}
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={18} />
            </button>
          </div>

          {/* Issue Type */}
          <div className="mb-4">
            <label className="mb-2 block text-xs font-medium text-slate-600">
              Issue Type <span className="text-red-500">*</span>
            </label>

            <select
              value={form.issueType}
              onChange={(e) =>
                setForm({
                  ...form,
                  issueType: e.target.value,
                })
              }
              className="h-10 w-full rounded border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="">Select issue type</option>
              {ISSUE_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Time Inputs */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-xs font-medium text-slate-600">
                Actual Clock In
                <span className="ml-1 text-slate-400">(optional)</span>
              </label>

              <input
                type="time"
                value={form.actualClockIn}
                onChange={(e) =>
                  setForm({
                    ...form,
                    actualClockIn: e.target.value,
                  })
                }
                className="h-10 w-full rounded border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-slate-600">
                Actual Clock Out
                <span className="ml-1 text-slate-400">(optional)</span>
              </label>

              <input
                type="time"
                value={form.actualClockOut}
                onChange={(e) =>
                  setForm({
                    ...form,
                    actualClockOut: e.target.value,
                  })
                }
                className="h-10 w-full rounded border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="mb-2 block text-xs font-medium text-slate-600">
              Description
              <span className="text-red-500">*</span>
            </label>

            <textarea
              rows={4}
              value={form.description}
              placeholder="Describe the discrepancy and any supporting evidence (e.g. badge log, witness)..."
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              className="w-full resize-none rounded border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500"
            />
          </div>

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

          {/* Footer */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={isDisabled}
              className={`flex-1 rounded px-4 py-2 text-sm font-medium text-white transition ${
                isDisabled
                  ? "cursor-not-allowed bg-slate-300"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {submitting ? "Submitting…" : "Submit Dispute"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
