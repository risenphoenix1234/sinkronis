"use client";

import { X, CheckCircle2, Ban } from "lucide-react";
import { useState } from "react";
import { AttendanceDispute } from "@/types/attendance";

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold">Approve Dispute</h2>

            <p className="mt-1 text-xs text-slate-500">
              {dispute.id} • {dispute.employeeName} • {dispute.date}
            </p>
          </div>

          <button onClick={onClose}>
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Dispute Summary */}
          <div className="rounded-md border bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-700">
              {dispute.issue}
            </p>

            <p className="mt-2 text-sm text-slate-600">{dispute.description}</p>

            <p className="mt-3 text-xs text-slate-500">
              Claimed In: {dispute.claimedClockIn ?? "--"} • Claimed Out:{" "}
              {dispute.claimedClockOut ?? "--"}
            </p>
          </div>

          {/* Action Toggle */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              onClick={() => setAction("Approved")}
              className={`flex items-center justify-center gap-2 rounded-md border py-3 text-sm font-medium ${
                action === "Approved"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-slate-200"
              }`}
            >
              <CheckCircle2 size={16} />
              Approve
            </button>

            <button
              onClick={() => setAction("Rejected")}
              className={`flex items-center justify-center gap-2 rounded-md border py-3 text-sm font-medium ${
                action === "Rejected"
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-slate-200"
              }`}
            >
              <Ban size={16} />
              Reject
            </button>
          </div>

          {/* Resolution */}
          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium">
              Resolution Note
              <span className="text-red-500">*</span>
            </label>

            <textarea
              rows={4}
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              placeholder="e.g. Verified with CCTV. Times corrected."
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Info */}
          <p className="mt-3 text-xs text-green-600">
            Approving will update the attendance record to reflect the claimed
            times and add an audit log entry.
          </p>

          {/* Footer */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-md border py-2 text-sm"
            >
              Cancel
            </button>

            <button
              onClick={() =>
                onSubmit({
                  action,
                  resolution,
                })
              }
              disabled={!resolution.trim()}
              className="flex-1 rounded-md bg-slate-300 py-2 text-sm font-medium text-white disabled:cursor-not-allowed"
            >
              {action === "Approved" ? "Confirm Approve" : "Confirm Reject"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
