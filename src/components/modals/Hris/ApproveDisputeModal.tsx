"use client";

import { Ban, CheckCircle2, X } from "lucide-react";
import { useState } from "react";
import type { AttendanceDispute } from "@/types/hris/attendance";

interface Props {
  isOpen: boolean;
  dispute: AttendanceDispute | null;
  onClose: () => void;
  onSubmit: (data: {
    action: "Approved" | "Rejected";
    resolution: string;
  }) => void;
}

export default function ApproveDisputeModal({
  isOpen,
  dispute,
  onClose,
  onSubmit,
}: Props) {
  const [action, setAction] = useState<"Approved" | "Rejected">("Approved");
  const [resolution, setResolution] = useState("");

  if (!isOpen || !dispute) return null;

  const isSubmitDisabled = !resolution.trim();
  const isApproving = action === "Approved";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/45 p-4 text-left">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="approve-dispute-title"
        className="flex max-h-[calc(100vh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div className="min-w-0">
            <h2
              id="approve-dispute-title"
              className="text-lg font-semibold text-slate-900"
            >
              Approve dispute
            </h2>
            <p className="mt-1 truncate text-sm text-slate-500">
              {dispute.id} • {dispute.employeeName} • {dispute.date}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="-mr-2 -mt-1 shrink-0 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-800">
              {dispute.issue}
            </p>
            <p className="mt-2 break-words text-sm text-slate-600">
              {dispute.description}
            </p>

            <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium text-slate-500">
                  Claimed In
                </dt>
                <dd className="mt-1 text-sm text-slate-800">
                  {dispute.claimedClockIn ?? "--"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">
                  Claimed Out
                </dt>
                <dd className="mt-1 text-sm text-slate-800">
                  {dispute.claimedClockOut ?? "--"}
                </dd>
              </div>
            </dl>
          </div>
          <div
            role="group"
            aria-label="Resolution decision"
            className="grid grid-cols-2 gap-3"
          >
            <button
              type="button"
              onClick={() => setAction("Approved")}
              aria-pressed={isApproving}
              className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                isApproving
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <CheckCircle2 size={16} className="shrink-0" />
              Approve
            </button>

            <button
              type="button"
              onClick={() => setAction("Rejected")}
              aria-pressed={!isApproving}
              className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                !isApproving
                  ? "border-rose-500 bg-rose-50 text-rose-700"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Ban size={16} className="shrink-0" />
              Reject
            </button>
          </div>

          <div>
            <label
              htmlFor="dispute-resolution-note"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Resolution Note <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="dispute-resolution-note"
              rows={4}
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              placeholder="e.g. Verified with CCTV. Times corrected."
              className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div
            className={`rounded-lg border px-3 py-2 text-sm ${
              isApproving
                ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                : "border-rose-100 bg-rose-50 text-rose-700"
            }`}
          >
            {isApproving
              ? "Approving will update the attendance record to reflect the claimed times and add an audit log entry."
              : "Rejecting will leave the attendance record unchanged and add an audit log entry."}
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 sm:w-auto"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() =>
              onSubmit({
                action,
                resolution,
              })
            }
            disabled={isSubmitDisabled}
            className={`w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 sm:w-auto ${
              isSubmitDisabled
                ? "cursor-not-allowed bg-slate-300"
                : isApproving
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-rose-600 hover:bg-rose-700"
            }`}
          >
            {isApproving ? "Confirm Approval" : "Confirm Rejection"}
          </button>
        </div>
      </div>
    </div>
  );
}
