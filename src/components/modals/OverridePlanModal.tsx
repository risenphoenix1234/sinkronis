// src/components/modals/OverridePlanModal.tsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface OverridePlanModalProps {
  open: boolean;
  currentPlanLabel: string;
  onClose: () => void;
  onApply: (newPlan: string) => void;
}

export default function OverridePlanModal({
  open,
  currentPlanLabel,
  onClose,
  onApply,
}: OverridePlanModalProps) {
  const [newPlan, setNewPlan] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <h2 className="text-base font-semibold text-slate-900">
            Override Plan
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-1 text-xs text-slate-500">
          Current plan: {currentPlanLabel}
        </p>

        <div className="mt-4">
          <label className="text-xs font-medium text-slate-700">
            New Plan
          </label>
          <input
            type="text"
            value={newPlan}
            onChange={(e) => setNewPlan(e.target.value)}
            placeholder="e.g. Growth"
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => {
              if (newPlan.trim()) onApply(newPlan.trim());
              setNewPlan("");
              onClose();
            }}
            className="flex-1 rounded-md bg-brand-600 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Apply Override
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-md border border-slate-200 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
