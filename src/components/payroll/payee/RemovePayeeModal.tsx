// components/payroll/payee/RemovePayeeModal.tsx
"use client";

import { Payee } from "@/types/payroll/payee-data";

type RemovePayeeModalProps = {
  open: boolean;
  payee: Payee | null;
  onCancel: () => void;
  onRemove: () => void;
};

export default function RemovePayeeModal({
  open,
  payee,
  onCancel,
  onRemove,
}: RemovePayeeModalProps) {
  if (!open || !payee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className="w-[400px] rounded bg-white px-10 pb-8 pt-9
        shadow-[0_12px_40px_rgba(0,0,0,0.18)]"
      >
        {/* TITLE */}
        <h2 className="text-center text-base font-bold text-[#263447]">
          Remove {payee.name}?
        </h2>

        {/* DESCRIPTION */}
        <p className="mt-2 text-center text-sm leading-5 text-[#718096]">
          This payee will be removed from future payroll runs.
        </p>

        {/* BUTTONS */}
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="h-[39px] rounded-[4px] border border-[#dce2e8]
            bg-white text-sm font-medium text-[#344054]
            hover:bg-[#f8fafc]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onRemove}
            className="h-[39px] rounded-[4px] bg-[#ff3b3b]
            text-sm font-medium text-white hover:bg-[#ed3030]"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
