// components/payroll/pay-run/RunPayrollModal.tsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";

export type RunPayrollFormData = {
  periodLabel: string;
  from: string;
  to: string;
};

type RunPayrollModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: RunPayrollFormData) => void;
  /** Active employee count shown in the info banner. */
  activeEmployees?: number;
};

const initialFormData: RunPayrollFormData = {
  periodLabel: "",
  from: "",
  to: "",
};

export default function RunPayrollModal({
  open,
  onClose,
  onSubmit,
  activeEmployees = 16,
}: RunPayrollModalProps) {
  const [formData, setFormData] = useState<RunPayrollFormData>(initialFormData);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setFormData(initialFormData);
    onClose();
  };

  const isValid =
    formData.periodLabel.trim() !== "" &&
    formData.from !== "" &&
    formData.to !== "";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid) return;
    onSubmit?.(formData);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
      <div className="w-full max-w-[380px] rounded-lg bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6">
          <h2 className="text-lg font-bold text-[#1f2937]">Run Payroll</h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="rounded-md p-1 text-[#667085] transition hover:bg-[#f2f4f7] hover:text-[#1f2937]"
          >
            <X size={18} strokeWidth={1.8} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 px-6 py-5">
            {/* Info banner */}
            <div className="rounded-md border border-[#bfdbfe] bg-[#eff6ff] px-3 py-3 text-xs leading-relaxed text-[#2563eb]">
              This will compute payslips for all {activeEmployees} active
              employees on payroll.
            </div>

            <Field label="Pay Period Label" required>
              <input
                name="periodLabel"
                value={formData.periodLabel}
                onChange={handleChange}
                placeholder="e.g. July 2026"
                required
                className="h-11 w-full rounded-md border border-[#e5e7eb] bg-white px-3.5 text-sm text-[#374151] outline-none placeholder:text-[#9ca3af] focus:border-[#1683d8]"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="From" required>
                <input
                  name="from"
                  type="date"
                  value={formData.from}
                  onChange={handleChange}
                  required
                  className="h-11 w-full rounded-md border border-[#e5e7eb] bg-white px-3.5 text-sm text-[#374151] outline-none focus:border-[#1683d8]"
                />
              </Field>

              <Field label="To" required>
                <input
                  name="to"
                  type="date"
                  value={formData.to}
                  onChange={handleChange}
                  required
                  className="h-11 w-full rounded-md border border-[#e5e7eb] bg-white px-3.5 text-sm text-[#374151] outline-none focus:border-[#1683d8]"
                />
              </Field>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 px-6 pb-6">
            <button
              type="button"
              onClick={handleClose}
              className="h-11 rounded-md border border-[#d0d5dd] bg-white px-8 text-sm font-medium text-[#344054] transition hover:bg-[#f9fafb]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!isValid}
              className="h-11 flex-1 rounded-md bg-[#1683d8] text-sm font-medium text-white transition hover:bg-[#0f74c2] disabled:cursor-not-allowed disabled:bg-[#f3f4f6] disabled:text-[#9ca3af]"
            >
              Compute &amp; Preview
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-[#667085]">
        {label}
        {required && <span className="ml-0.5 text-[#667085]">*</span>}
      </label>
      {children}
    </div>
  );
}
