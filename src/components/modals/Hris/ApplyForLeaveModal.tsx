"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";

import { applyForLeave } from "@/lib/api/hris";
import { ApplyForLeavePayload } from "@/lib/api/types/hrisTypes";

interface ApplyForLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplied: () => void; // parent refetches list + overview on success
  employeeId?: string;
}

const LEAVE_TYPES = [
  { label: "Annual Leave", value: "ANNUAL_LEAVE" },
  { label: "Sick Leave", value: "SICK_LEAVE" },
  { label: "Maternity Leave", value: "MATERNITY_LEAVE" },
  { label: "Paternity Leave", value: "PATERNITY_LEAVE" },
  { label: "Emergency Leave", value: "EMERGENCY_LEAVE" },
  { label: "Compassionate Leave", value: "COMPASSIONATE_LEAVE" },
];

const EMPTY_FORM = {
  leaveType: LEAVE_TYPES[0].value,
  fromDate: "",
  toDate: "",
  reason: "",
};

export default function ApplyForLeaveModal({
  isOpen,
  onClose,
  onApplied,
  employeeId,
}: ApplyForLeaveModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetAndClose = () => {
    setForm(EMPTY_FORM);
    setError(null);
    onClose();
  };

  const handleSubmit = async () => {
    setError(null);

    if (!form.fromDate || !form.toDate) {
      setError("Please select both a start and end date.");
      return;
    }
    if (!form.reason.trim()) {
      setError("Please provide a reason.");
      return;
    }
    if (new Date(form.toDate) < new Date(form.fromDate)) {
      setError("End date can't be before start date.");
      return;
    }

    const payload: ApplyForLeavePayload = {
      employeeId: employeeId || undefined,
      leaveType: form.leaveType,
      fromDate: form.fromDate,
      toDate: form.toDate,
      reason: form.reason.trim(),
    };

    setSubmitting(true);
    try {
      await applyForLeave(payload);
      toast.success("Leave request submitted successfully");
      onApplied();
      resetAndClose();
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 400) {
        setError(
          err.response?.data?.message ??
          "Invalid dates, leave type, or no workdays in range.",
        );
      } else if (status === 403) {
        setError(
          err.response?.data?.message ??
          "No employee record is linked to your account.",
        );
      } else if (status === 409) {
        setError(
          err.response?.data?.message ??
          "Overlapping leave request, or insufficient leave balance.",
        );
      } else {
        setError(
          err.response?.data?.message ?? "Failed to submit leave request.",
        );
      }
      console.error(
        "Apply for leave failed:",
        err.response?.data ?? err.message,
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"
        onClick={submitting ? undefined : resetAndClose}
      />

      <div className="relative w-full max-w-md rounded-md bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-800">
            Apply for Leave
          </h2>
          <button
            onClick={resetAndClose}
            disabled={submitting}
            className="text-slate-400 transition hover:text-slate-600 disabled:opacity-40"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 px-5 py-4">
          {error && (
            <p className="rounded bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </p>
          )}

          <div>
            <select
              value={form.leaveType}
              onChange={(e) => handleChange("leaveType", e.target.value)}
              className="h-10 w-full rounded border border-slate-200 px-3 text-sm outline-none transition focus:border-blue-500"
            >
              {LEAVE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              value={form.fromDate}
              onChange={(e) => handleChange("fromDate", e.target.value)}
              className="h-10 rounded border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
            />
            <input
              type="date"
              value={form.toDate}
              onChange={(e) => handleChange("toDate", e.target.value)}
              className="h-10 rounded border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <textarea
            rows={4}
            placeholder="Reason"
            value={form.reason}
            onChange={(e) => handleChange("reason", e.target.value)}
            className="w-full resize-none rounded border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center justify-between gap-4 border-t px-5 py-4">
          <button
            onClick={resetAndClose}
            disabled={submitting}
            className="h-10 flex-1 rounded px-6 text-sm font-medium border text-slate-600 transition hover:bg-slate-100 disabled:opacity-40"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="h-10 flex-1 rounded bg-sky-500 px-6 text-sm font-medium text-white transition hover:bg-sky-400 disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </div>
    </div>
  );
}
