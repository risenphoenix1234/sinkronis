"use client";

import { AlertTriangle, Send } from "lucide-react";

interface FooterActionProps {
  warning?: string;
  disableSubmit?: boolean;
  loading?: boolean;
  onSaveDraft?: () => void;
  onSubmit?: () => void;
}

export default function FooterAction({
  warning = "Please fill in at least one achieved value or reflection answer before submitting.",
  disableSubmit = true,
  loading = false,
  onSaveDraft,
  onSubmit,
}: FooterActionProps) {
  return (
    <div className="mt-8 rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Warning Banner */}

      <div className="border-b border-yellow-300 bg-yellow-50 px-6 py-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-yellow-600" />

          <p className="text-sm font-medium text-yellow-800">{warning}</p>
        </div>
      </div>

      {/* Action Buttons */}

      <div className="flex items-center justify-end gap-4 px-6 py-4">
        <button
          onClick={onSaveDraft}
          disabled={loading}
          className="rounded-md border border-gray-300 bg-white px-8 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Draft"}
        </button>

        <button
          onClick={onSubmit}
          disabled={disableSubmit || loading}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          <Send size={16} />
          Submit Self-Assessment
        </button>
      </div>
    </div>
  );
}
