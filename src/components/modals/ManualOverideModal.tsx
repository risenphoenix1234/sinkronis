"use client";

import { Attendance } from "@/types/attendance";
import { X } from "lucide-react";

interface ManualOverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Attendance | null;
}

export default function ManualOverrideModal({
  isOpen,
  onClose,
  employee,
}: ManualOverrideModalProps) {
  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Manual Override
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Amara Okafor · HR-001 · 1 Jun 2026
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          </div>

          {/* Clock In / Clock Out */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-600">
                Clock In
              </label>

              <input
                type="time"
                className="h-10 w-full rounded border border-gray-200 px-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-gray-600">
                Clock Out
              </label>

              <input
                type="time"
                className="h-10 w-full rounded border border-gray-200 px-3 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Status */}
          <div className="mb-4">
            <label className="mb-2 block text-xs font-medium text-gray-600">
              Status
            </label>

            <input
              type="text"
              className="h-10 w-full rounded border border-gray-200 px-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Reason */}
          <div className="mb-6">
            <label className="mb-2 block text-xs font-medium text-gray-600">
              Reason / Note
            </label>

            <textarea
              rows={3}
              placeholder="e.g. Biometric failed — verified manually"
              className="w-full resize-none rounded border border-gray-200 px-3 py-2 text-sm outline-none placeholder:text-gray-400 focus:border-blue-500"
            />
          </div>

          <p className="mb-4 text-[11px] text-gray-400">
            This change will be recorded in the audit log.
          </p>

          {/* Footer */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>

            <button className="flex-1 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
              Save Override
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
