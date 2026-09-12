"use client";

import { useState } from "react";
import type { ChangeEvent, FC } from "react";

export interface FilterValues {
  status: string;
  exitedDate: string;
}

interface FilterPanelProps {
  initialValues?: FilterValues;
  statusOptions?: string[];
  onCancel?: () => void;
  onSave?: (values: FilterValues) => void;
}

const DEFAULT_STATUS_OPTIONS = ["Exited", "Active", "Pending", "Suspended"];

const FilterPanel: FC<FilterPanelProps> = ({
  initialValues = { status: "Exited", exitedDate: "" },
  statusOptions = DEFAULT_STATUS_OPTIONS,
  onCancel,
  onSave,
}) => {
  const [status, setStatus] = useState(initialValues.status);
  const [exitedDate, setExitedDate] = useState(initialValues.exitedDate);

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setExitedDate(e.target.value);
  };

  const handleCancel = () => {
    setStatus(initialValues.status);
    setExitedDate(initialValues.exitedDate);
    onCancel?.();
  };

  const handleSave = () => {
    onSave?.({ status, exitedDate });
  };

  return (
    <div className="w-full max-w-sm rounded-md border border-gray-200 bg-white shadow-sm">
      {/* Dashed drop area containing the filter fields */}
      <div className="m-4 rounded-md border border-dashed border-sky-400 p-4">
        <h2 className="mb-4 text-lg font-bold text-gray-900">Filter</h2>

        {/* Status field */}
        <div className="mb-4">
          <label
            htmlFor="status"
            className="mb-1 block border-b border-gray-200 pb-1 text-xs text-gray-400"
          >
            Status
          </label>
          <div className="relative">
            <select
              id="status"
              value={status}
              onChange={handleStatusChange}
              className="w-full appearance-none bg-transparent py-1 pr-6 text-sm text-gray-800 focus:outline-none"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Exited Date field */}
        <div>
          <label
            htmlFor="exitedDate"
            className="mb-1 block border-b border-gray-200 pb-1 text-xs text-gray-400"
          >
            Exited Date
          </label>
          <input
            id="exitedDate"
            type="date"
            value={exitedDate}
            onChange={handleDateChange}
            placeholder="dd/mm/yyyy"
            className="w-full bg-transparent py-1 text-sm text-gray-400 placeholder-gray-400 focus:outline-none [&::-webkit-calendar-picker-indicator]:opacity-40"
          />
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-4 py-3">
        <button
          type="button"
          onClick={handleCancel}
          className="rounded-md border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;