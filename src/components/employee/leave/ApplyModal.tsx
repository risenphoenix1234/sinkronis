"use client";
import { balances } from "@/data/employee/leave";
import { useState } from "react";

export function ApplyModal({ onClose }: { onClose: () => void }) {
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [relieverName, setRelieverName] = useState("");

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition bg-white";
  const labelClass = "block text-xs font-medium text-gray-500 mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-900">
            Apply for Leave
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-5 h-5"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelClass}>Leave Type</label>
            <div className="relative">
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className={inputClass + " appearance-none"}
              >
                <option value="" disabled>
                  Select type
                </option>
                {balances.map((b) => (
                  <option key={b.type} value={b.type}>
                    {b.type}
                  </option>
                ))}
              </select>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9ca3af"
                strokeWidth={2}
                className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Brief reason for leave..."
              rows={3}
              className={inputClass + " resize-none"}
            />
          </div>
          <div>
            <label className={labelClass}>
              Reliever Name <span className="text-red-500">*</span>
            </label>
            <textarea
              value={relieverName}
              onChange={(e) => setRelieverName(e.target.value)}
              placeholder="Who will cover your duties?"
              rows={1}
              className={inputClass + " resize-none"}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => {
              alert("Leave applied!");
              onClose();
            }}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
          >
            Submit
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium py-2.5 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
