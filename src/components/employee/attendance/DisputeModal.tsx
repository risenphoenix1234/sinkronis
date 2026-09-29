"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { createAttendanceDispute } from "@/lib/api/employee";
import { AttendanceDisputeIssueType } from "@/lib/api/types/employeeTypes";

export interface DisputeModalProps {
  attendanceId?: string;
  date: string;
  statusLabel: string;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

const ISSUE_TYPE_OPTIONS: {
  label: string;
  value: AttendanceDisputeIssueType;
}[] = [
  { label: "Missing Clock In", value: "MISSING_CLOCK_IN" },
  { label: "Missing Clock Out", value: "MISSING_CLOCK_OUT" },
  { label: "System Error", value: "SYSTEM_ERROR" },
  { label: "Wrong Status", value: "WRONG_STATUS" },
  { label: "Other", value: "OTHER" },
];

export default function DisputeModal({
  attendanceId,
  date,
  statusLabel,
  onClose,
  onSubmitSuccess,
}: DisputeModalProps) {
  const [issueType, setIssueType] =
    useState<AttendanceDisputeIssueType>("MISSING_CLOCK_IN");
  const [claimedClockIn, setClaimedClockIn] = useState("");
  const [claimedClockOut, setClaimedClockOut] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!issueType) {
      toast.error("Please specify a dispute type");
      return;
    }
    if (!notes.trim()) {
      toast.error("Please provide a description of the issue");
      return;
    }

    if (!attendanceId) {
      toast.error("No attendance record ID available to dispute");
      return;
    }

    setSubmitting(true);
    try {
      const res = await createAttendanceDispute(attendanceId, {
        issueType,
        description: notes.trim(),
        claimedClockIn: claimedClockIn || null,
        claimedClockOut: claimedClockOut || null,
      });
      toast.success(
        res?.message || `Dispute submitted successfully for ${date}`,
      );
      onSubmitSuccess?.();
      onClose();
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to submit dispute. Please try again.";
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">
            Raise Attendance Dispute
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Date / Status pill */}
          <div className="mb-5 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-600">
            <span className="font-medium text-slate-700">Date: </span>
            {date}
            <span className="mx-2 text-slate-300">·</span>
            <span className="font-medium text-slate-700">Status: </span>
            {statusLabel}
          </div>

          {/* Issue Type */}
          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Dispute Type <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                {ISSUE_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9ca3af"
                strokeWidth={2}
                className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>

          {/* Claimed Times */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Claimed Clock In
              </label>
              <input
                type="time"
                value={claimedClockIn}
                onChange={(e) => setClaimedClockIn(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Claimed Clock Out
              </label>
              <input
                type="time"
                value={claimedClockOut}
                onChange={(e) => setClaimedClockOut(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe the issue and provide details..."
              rows={3}
              className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.99] disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Dispute"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 active:scale-[0.99]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
