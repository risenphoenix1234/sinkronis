// components/RemoveFromPayrollModal.tsx
"use client";

import { AlertTriangle } from "lucide-react";

type RemoveFromPayrollModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  employee: {
    name: string;
    role: string;
    department: string;
    grossPay: string;
    netPay: string;
  };
};

export default function RemoveFromPayrollModal({
  open,
  onClose,
  onConfirm,
  employee,
}: RemoveFromPayrollModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-[600px] rounded-xl bg-white p-8 shadow-2xl">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
            <AlertTriangle size={24} className="text-amber-500" />
          </div>
        </div>

        {/* Title + description */}
        <div className="mt-4 text-center">
          <h2 className="text-lg font-semibold text-[#1f2937]">
            Remove from Payroll?
          </h2>
          <p className="mx-auto mt-2 max-w-[420px] text-sm text-[#6b7280]">
            {employee.name} will be excluded from future payroll runs. Their
            salary structure and history will be retained.
          </p>
        </div>

        {/* Employee summary card */}
        <div className="mt-6 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-5 py-4">
          <SummaryRow label="Employee" value={employee.name} />
          <SummaryRow label="Role" value={employee.role} />
          <SummaryRow label="Department" value={employee.department} />
          <SummaryRow label="Gross Pay" value={employee.grossPay} />
          <SummaryRow label="Net Pay" value={employee.netPay} last />
        </div>

        {/* Actions */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-md border border-[#d0d5dd] bg-white text-sm font-medium text-[#344054] transition hover:bg-[#f9fafb]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="h-11 rounded-md bg-[#78350f] text-sm font-medium text-white transition hover:bg-[#5c2a0a]"
          >
            Yes, Remove from Payroll
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between py-2 text-sm ${
        last ? "" : "border-b border-[#e5e7eb]"
      }`}
    >
      <span className="text-[#6b7280]">{label}</span>
      <span className="font-medium text-[#1f2937]">{value}</span>
    </div>
  );
}
