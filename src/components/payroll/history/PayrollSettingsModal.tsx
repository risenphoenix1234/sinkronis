// src/components/payroll/history/PayrollSettingsModal.tsx
"use client";

import { useState } from "react";
import { FiCheck, FiInfo } from "react-icons/fi";
import { bonusModeOptions, frequencyOptions } from "@/lib/payroll-history-static";

function Check({ checked, label, onChange }: { checked: boolean; label: string; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
      <span
        className={`flex h-4 w-4 items-center justify-center rounded border ${
          checked ? "border-[#2183C6] bg-[#2183C6] text-white" : "border-slate-300 bg-white"
        }`}
      >
        {checked && <FiCheck size={11} />}
      </span>
      <input type="checkbox" className="hidden" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
}

export default function PayrollSettingsModal({
  frequency,
  bonusMode,
  onClose,
  onSave,
}: {
  frequency: string;
  bonusMode: string;
  onClose: () => void;
  onSave: (frequency: string, bonusMode: string) => void;
}) {
  const [f, setF] = useState(frequency);
  const [b, setB] = useState(bonusMode);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onMouseDown={onClose}>
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl" onMouseDown={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Update Payroll Settings</h2>
          <FiInfo size={14} className="text-slate-400" />
        </div>

        <p className="text-sm font-medium text-slate-900">Payroll Frequency</p>
        <div className="mt-3 space-y-2">
          {frequencyOptions.map((o) => (
            <Check key={o} checked={f === o} label={o} onChange={() => setF(o)} />
          ))}
        </div>

        <p className="mt-5 text-sm font-medium text-slate-900">Bonus/Deductions Mode</p>
        <div className="mt-3 space-y-2">
          {bonusModeOptions.map((o) => (
            <Check key={o} checked={b === o} label={o} onChange={() => setB(o)} />
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md bg-slate-100 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200">
            Cancel
          </button>
          <button onClick={() => onSave(f, b)} className="rounded-md bg-[#2183C6] px-4 py-2 text-xs font-medium text-white hover:opacity-90">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
