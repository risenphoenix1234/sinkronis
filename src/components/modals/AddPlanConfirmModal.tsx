// components/modals/AddPlanConfirmModal.tsx
"use client";

import { FiX } from "react-icons/fi";

interface AddPlanConfirmModalProps {
  open: boolean;
  currentPlanLabel: string; // e.g. "HRIS · ₦80,000/mo"
  newPlanLabel: string; // e.g. "Accounting · ₦80,000/mo"
  onCancel: () => void;
  onConfirm: () => void;
}

export default function AddPlanConfirmModal({
  open,
  currentPlanLabel,
  newPlanLabel,
  onCancel,
  onConfirm,
}: AddPlanConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Add Plan</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Review your plan change before confirming.
            </p>
          </div>
          <button
            onClick={onCancel}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <FiX size={16} />
          </button>
        </div>

        <div className="mt-5 space-y-3 rounded-md bg-slate-50 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Current plan</span>
            <span className="font-medium text-slate-800">{currentPlanLabel}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">New plan</span>
            <span className="font-medium text-sky-600">{newPlanLabel}</span>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-md border border-slate-200 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-md bg-sky-600 py-2 text-sm font-medium text-white hover:bg-sky-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}