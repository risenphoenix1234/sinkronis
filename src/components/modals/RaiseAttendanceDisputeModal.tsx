"use client";

import { MessageSquare, X } from "lucide-react";
import { Attendance } from "@/types/attendance";
import { useState } from "react";

interface RaiseAttendanceDisputeModalProps {
  isOpen: boolean;
  employee: Attendance | null;
  onClose: () => void;
  onSubmit?: (data: DisputeFormData) => void;
}

export interface DisputeFormData {
  issueType: string;
  actualClockIn: string;
  actualClockOut: string;
  description: string;
}

export default function RaiseAttendanceDisputeModal({
  isOpen,
  employee,
  onClose,
  onSubmit,
}: RaiseAttendanceDisputeModalProps) {
  const [form, setForm] = useState<DisputeFormData>({
    issueType: "",
    actualClockIn: "",
    actualClockOut: "",
    description: "",
  });

  if (!isOpen || !employee) return null;

  const handleSubmit = () => {
    onSubmit?.(form);

    setForm({
      issueType: "",
      actualClockIn: "",
      actualClockOut: "",
      description: "",
    });

    onClose();
  };

  const isDisabled =
    !form.issueType || !form.description.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <MessageSquare className="h-3 w-3 text-blue-600"/> Raise Attendance Dispute
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {employee.name} • {employee.id} • 1 Jun 2026
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
              <option value="">
                Select issue type
              </option>

              <option value="Missing Clock In">
                Missing Clock In
              </option>

              <option value="Missing Clock Out">
                Missing Clock Out
              </option>

              <option value="Incorrect Hours">
                Incorrect Hours
              </option>

              <option value="Wrong Shift">
                Wrong Shift
              </option>

              <option value="Overtime Missing">
                Overtime Missing
              </option>
            </select>
          </div>

          {/* Time Inputs */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-xs font-medium text-slate-600">
                Actual Clock In
                <span className="ml-1 text-slate-400">
                  (optional)
                </span>
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
                <span className="ml-1 text-slate-400">
                  (optional)
                </span>
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
              Submit Dispute
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}