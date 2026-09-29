"use client";

import { useEffect, useState } from "react";
import { Ban, Check, X } from "lucide-react";
import type { AttendanceDispute } from "@/lib/api/types/hrisTypes";

interface Props {
  isOpen: boolean;
  dispute: AttendanceDispute | null;
  initialAction?: "Approved" | "Rejected";
  onClose: () => void;
  onSubmit: (data: {
    action: "Approved" | "Rejected";
    resolution: string;
  }) => void;
}

function formatTime(val?: string | null): string {
  if (!val) return "";
  if (/^\d{1,2}:\d{2}$/.test(val)) return val;
  try {
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      return d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }
  } catch {}
  return val;
}

function formatDate(val?: string | null): string {
  if (!val) return "—";
  try {
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  } catch {}
  return val;
}

export default function ApproveDisputeModal({
  isOpen,
  dispute,
  initialAction = "Approved",
  onClose,
  onSubmit,
}: Props) {
  const [action, setAction] = useState<"Approved" | "Rejected">(initialAction);
  const [resolution, setResolution] = useState("");

  useEffect(() => {
    if (isOpen) {
      setAction(initialAction);
      setResolution("");
    }
  }, [isOpen, initialAction]);

  if (!isOpen || !dispute) return null;

  const anyDispute = dispute as any;
  const isSubmitDisabled = !resolution.trim();
  const isApproving = action === "Approved";

  const displayId = anyDispute.disputeId || anyDispute.disputeNo || dispute.id;
  const employeeName =
    anyDispute.employee?.name ||
    dispute.employeeName ||
    (anyDispute.employee?.firstName && anyDispute.employee?.lastName
      ? `${anyDispute.employee.firstName} ${anyDispute.employee.lastName}`
      : "—");
  const formattedDate = formatDate(dispute.date || dispute.createdAt);
  const issueFormatted = (
    anyDispute.issueType ||
    dispute.issue ||
    "Attendance Dispute"
  )
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c: string) => c.toUpperCase());

  const claimedIn = formatTime(dispute.claimedClockIn);
  const claimedOut = formatTime(dispute.claimedClockOut);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/45 p-4 text-left">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="approve-dispute-title"
        className="flex max-h-[calc(100vh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div className="min-w-0">
            <h2
              id="approve-dispute-title"
              className="text-xl font-bold text-slate-900"
            >
              Approve Dispute
            </h2>
            <p className="mt-1 truncate text-sm text-slate-500">
              {displayId} • {employeeName} • {formattedDate}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="-mr-1 -mt-1 shrink-0 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5">
          {/* Dispute Summary Card */}
          <div className="rounded-xl border border-slate-100 bg-[#F8FAFC] p-4">
            <p className="text-sm font-semibold text-slate-800">
              {issueFormatted}
            </p>
            <p className="mt-1.5 break-words text-xs leading-relaxed text-slate-600">
              {dispute.description}
            </p>

            {(claimedIn || claimedOut) && (
              <p className="mt-3 text-xs text-slate-500">
                Claimed: {claimedIn ? `In ${claimedIn}` : ""}
                {claimedIn && claimedOut ? " • " : ""}
                {claimedOut ? `Out ${claimedOut}` : ""}
              </p>
            )}
          </div>

          {/* Toggle Buttons */}
          <div
            role="group"
            aria-label="Resolution decision"
            className="grid grid-cols-2 gap-3"
          >
            <button
              type="button"
              onClick={() => setAction("Approved")}
              aria-pressed={isApproving}
              className={`flex items-center justify-center gap-2 rounded-lg border py-2.5 px-4 text-sm font-medium transition focus:outline-none ${
                isApproving
                  ? "border-[#86EFAC] bg-[#E8F8EE] text-[#15803D]"
                  : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Check size={16} className="stroke-[2.5]" />
              Approve
            </button>

            <button
              type="button"
              onClick={() => setAction("Rejected")}
              aria-pressed={!isApproving}
              className={`flex items-center justify-center gap-2 rounded-lg border py-2.5 px-4 text-sm font-medium transition focus:outline-none ${
                !isApproving
                  ? "border-[#FCA5A5] bg-rose-50 text-rose-800"
                  : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Ban size={15} />
              Reject
            </button>
          </div>

          {/* Resolution Note Field */}
          <div>
            <label
              htmlFor="dispute-resolution-note"
              className="mb-1.5 block text-xs font-semibold text-slate-700"
            >
              Resolution Note <span className="text-red-500">*</span>
            </label>
            <textarea
              id="dispute-resolution-note"
              rows={4}
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              placeholder="e.g. Verified with CCTV. Times corrected."
              className="w-full resize-none rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <p
              className={`mt-2 text-xs ${
                isApproving ? "text-emerald-700" : "text-rose-700"
              }`}
            >
              {isApproving
                ? "Approving will update the attendance record to reflect the claimed times and add an audit log entry."
                : "Rejecting will leave the attendance record unchanged and add an audit log entry."}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none"
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
            className={`rounded-lg px-6 py-2.5 text-sm font-medium text-white transition focus:outline-none ${
              isSubmitDisabled
                ? "cursor-not-allowed bg-[#CBD5E1] text-white"
                : isApproving
                  ? "bg-[#16A34A] hover:bg-[#15803D]"
                  : "bg-[#DC2626] hover:bg-[#B91C1C]"
            }`}
          >
            {isApproving ? "Confirm Approve" : "Confirm Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}
