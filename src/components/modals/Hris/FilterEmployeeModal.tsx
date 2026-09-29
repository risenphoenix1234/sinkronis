"use client";

import { useState } from "react";

export interface FilterValues {
  status: string;
  exitedDate: string;
  department?: string;
}

type Props = {
  open: boolean;
  onClose: () => void;
  onApply: (filters: FilterValues) => void;
  initialValues?: Partial<FilterValues>;
  statusOptions?: string[];
};

const DEFAULT_STATUS_OPTIONS = [
  "Exited",
  "Active",
  "Confirmed",
  "Probation",
  "Suspended",
];

export default function FilterEmployeeModal({
  open,
  onClose,
  onApply,
  initialValues,
  statusOptions = DEFAULT_STATUS_OPTIONS,
}: Props) {
  const [status, setStatus] = useState(initialValues?.status ?? "");
  const [exitedDate, setExitedDate] = useState(initialValues?.exitedDate ?? "");

  if (!open) return null;

  const normalizedStatus = status.trim().toLowerCase();
  const isExitedDateDisabled =
    normalizedStatus === "confirmed" || normalizedStatus === "probation";

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    const norm = newStatus.trim().toLowerCase();
    if (norm === "confirmed" || norm === "probation") {
      setExitedDate("");
    }
  };

  const handleSave = () => {
    onApply({
      status,
      exitedDate: isExitedDateDisabled ? "" : exitedDate,
      department: initialValues?.department,
    });
    onClose();
  };

  const handleCancel = () => {
    setStatus(initialValues?.status ?? "");
    setExitedDate(initialValues?.exitedDate ?? "");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onClick={handleCancel}
    >
      <div
        className="w-full max-w-[360px] rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h2 className="text-xl font-bold text-[#111827]">Filter</h2>

        {/* Form Fields */}
        <div className="mt-6 space-y-4">
          {/* Status field */}
          <div className="relative">
            <label
              htmlFor="filter-status"
              className="absolute -top-2 left-3 bg-white px-1 text-[11px] font-normal text-[#98A2B3] z-10"
            >
              Status
            </label>
            <div className="relative">
              <select
                id="filter-status"
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="h-11 w-full appearance-none rounded-md border border-[#E5E9F0] bg-white px-3.5 pr-9 text-sm text-[#344054] outline-none transition focus:border-[#2183C6]"
              >
                <option value="">Select status</option>
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#667085]">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 7.5L10 12.5L15 7.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Exited Date field */}
          <div className="relative">
            <label
              htmlFor="filter-exited-date"
              className={`absolute -top-2 left-3 px-1 text-[11px] font-normal z-10 transition-colors ${
                isExitedDateDisabled
                  ? "bg-slate-50 text-slate-300"
                  : "bg-white text-[#98A2B3]"
              }`}
            >
              Exited Date
            </label>
            <input
              id="filter-exited-date"
              type="text"
              placeholder="dd/mm/yyyy"
              value={exitedDate}
              disabled={isExitedDateDisabled}
              onChange={(e) => setExitedDate(e.target.value)}
              className={`h-11 w-full rounded-md border border-[#E5E9F0] px-3.5 text-sm outline-none transition ${
                isExitedDateDisabled
                  ? "cursor-not-allowed bg-slate-50 text-slate-400 placeholder:text-slate-300"
                  : "bg-white text-[#344054] placeholder:text-[#98A2B3] focus:border-[#2183C6]"
              }`}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-7 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="h-9 rounded-md border border-[#E5E9F0] bg-white px-4 text-sm font-medium text-[#344054] transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="h-9 rounded-md bg-[#2183C6] px-5 text-sm font-medium text-white transition hover:bg-[#1B6AA2]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
