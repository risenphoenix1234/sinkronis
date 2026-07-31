"use client";
import { useState } from "react";

export interface DisputeModalProps {
  date: string;
  statusLabel: string;
  onClose: () => void;
}

export default function DisputeModal({
  date,
  statusLabel: sLabel,
  onClose,
}: DisputeModalProps) {
  const [disputeType, setDisputeType] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (!disputeType.trim()) return;
    // Wire to API here
    alert(`Dispute submitted for ${date}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-900">
            Raise Attendance Dispute
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

        {/* Date / Status pill */}
        <div className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 text-sm text-gray-600 mb-5">
          <span className="font-medium">Date: </span>
          {date}
          <span className="mx-2 text-gray-300">·</span>
          <span className="font-medium">Status: </span>
          {sLabel}
        </div>

        {/* Dispute Type */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Dispute Type
          </label>
          <input
            value={disputeType}
            onChange={(e) => setDisputeType(e.target.value)}
            placeholder="e.g. Wrong clock-in time"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
          />
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe the issue..."
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
          >
            Submit Dispute
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
