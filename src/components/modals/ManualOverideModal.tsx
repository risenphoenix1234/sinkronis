"use client";

import { useEffect, useState } from "react";
import { Attendance } from "@/types/hris/attendance";
import { X } from "lucide-react";
import axios from "axios";
import { overrideAttendance } from "@/lib/api/hris";

interface ManualOverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Attendance | null;
  onSaved?: () => void; // lets the parent refetch the attendance list
}

export default function ManualOverrideModal({
  isOpen,
  onClose,
  employee,
  onSaved,
}: ManualOverrideModalProps) {
  const [clockIn, setClockIn] = useState("");
  const [clockOut, setClockOut] = useState("");
  const [status, setStatus] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset the form whenever a different employee's record opens, so stale
  // values from a previous override don't linger.
  useEffect(() => {
    if (isOpen && employee) {
      setClockIn(employee.clockIn ?? "");
      setClockOut(employee.clockOut ?? "");
      setStatus(employee.status ?? "");
      setReason("");
      setError(null);
    }
  }, [isOpen, employee]);

  if (!isOpen || !employee) return null;

  const handleSave = async () => {
    if (!reason.trim()) {
      setError("A reason is required.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await overrideAttendance(employee.id, {
        clockIn: clockIn || undefined,
        clockOut: clockOut || undefined,
        status: status || undefined,
        reason: reason.trim(),
      });
      onSaved?.();
      onClose();
    } catch (err) {
      console.error("Override failed:", axios.isAxiosError(err) ? err.response?.data : err);
      setError(
        axios.isAxiosError(err) ? err.response?.data?.message ?? "Couldn't save this override." : "Couldn't save this override.",
      );
    } finally {
      setSaving(false);
    }
  };

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
                {employee.name} · {employee.id} · {employee.date ?? ""}
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
                value={clockIn}
                onChange={(e) => setClockIn(e.target.value)}
                className="h-10 w-full rounded border border-gray-200 px-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-gray-600">
                Clock Out
              </label>

              <input
                type="time"
                value={clockOut}
                onChange={(e) => setClockOut(e.target.value)}
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
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="e.g. ABSENT"
              className="h-10 w-full rounded border border-gray-200 px-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Reason */}
          <div className="mb-2">
            <label className="mb-2 block text-xs font-medium text-gray-600">
              Reason / Note <span className="text-red-500">*</span>
            </label>

            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Biometric failed — verified manually"
              className="w-full resize-none rounded border border-gray-200 px-3 py-2 text-sm outline-none placeholder:text-gray-400 focus:border-blue-500"
            />
          </div>

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

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

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Override"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}