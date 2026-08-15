"use client";

import { Check, X } from "lucide-react";

type AddToPayrollModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  employeeName: string;
};

const employeeDetails = [
  {
    label: "Employee",
    value: "Adaeze Nwachukwu",
  },
  {
    label: "Role",
    value: "Support Lead",
  },
  {
    label: "Department",
    value: "Customer Support",
  },
  {
    label: "Gross Pay",
    value: "₦243,000",
  },
  {
    label: "Net Pay",
    value: "₦206,603",
  },
];

export default function AddToPayrollModal({
  isOpen,
  onClose,
  onConfirm,
  employeeName,
}: AddToPayrollModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      {/* Modal */}
      <div className="relative w-full max-w-md rounded-md bg-white p-6 shadow-xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-5 top-5 text-gray-400 transition hover:text-gray-600"
        >
          <X size={20} strokeWidth={1.8} />
        </button>

        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Check size={24} strokeWidth={2} className="text-green-700" />
          </div>
        </div>

        {/* Title */}
        <div className="mt-4 text-center">
          <h2 className="text-lg font-semibold text-[#263342]">
            Add to Payroll?
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#667085]">
            {employeeName} will be included in the next payroll run. Their
            salary structure and deductions are already configured.
          </p>
        </div>

        {/* Employee Information */}
        <div className="mt-5 rounded border border-dashed border-[#D9DEE5] bg-[#FCFDFD] px-3">
          {employeeDetails.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between border-b border-dashed border-[#E5E7EB] py-2.5 last:border-b-0"
            >
              <span className="text-sm text-[#667085]">{item.label}</span>

              <span className="text-sm font-medium text-[#263342]">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded border border-[#D9DEE5] bg-white px-4 text-sm font-medium text-[#344054] transition hover:bg-[#F8F9FA]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="h-10 rounded bg-[#1683D8] px-4 text-sm font-medium text-white transition hover:bg-[#1274C2]"
          >
            Yes, Add to Payroll
          </button>
        </div>
      </div>
    </div>
  );
}
