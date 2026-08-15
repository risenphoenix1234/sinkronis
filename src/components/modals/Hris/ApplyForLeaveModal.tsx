"use client";

import { X } from "lucide-react";

interface ApplyForLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplyForLeaveModal({
  isOpen,
  onClose,
}: ApplyForLeaveModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-md bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-800">
            Apply for Leave
          </h2>

          <button
            onClick={onClose}
            className="text-slate-400 transition hover:text-slate-600"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 px-5 py-4">
          {/* Leave Type */}
          <div>
            <select className="h-10 w-full rounded border border-slate-200 px-3 text-sm outline-none transition focus:border-blue-500">
              <option>Annual Leave</option>
              <option>Sick Leave</option>
              <option>Maternity Leave</option>
              <option>Paternity Leave</option>
              <option>Emergency Leave</option>
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              className="h-10 rounded border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
            />

            <input
              type="date"
              className="h-10 rounded border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Reason */}
          <textarea
            rows={4}
            placeholder="Reason"
            className="w-full resize-none rounded border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 border-t px-5 py-4">
          <button
            onClick={onClose}
            className="h-10 rounded px-6 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            Cancel
          </button>

          <button className="h-10 rounded bg-sky-300 px-6 text-sm font-medium text-white transition hover:bg-sky-400">
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
}
