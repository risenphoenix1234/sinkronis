"use client";

import { Shield } from "lucide-react";

type HRApprovalProps = {
  onReturnForRevision?: () => void;
  onApprove?: () => void;
};

export default function HRApproval({
  onReturnForRevision,
  onApprove,
}: HRApprovalProps) {
  return (
    <section className="w-full overflow-hidden rounded-md border border-[#A67C00] bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-[#FFFCF3] px-5 py-4">
        <div className="flex items-center gap-2">
          <Shield size={16} strokeWidth={1.8} className="text-[#946B00]" />

          <h2 className="text-[13px] font-semibold text-[#1F2937]">
            HR Approval
          </h2>
        </div>

        <span className="rounded-full bg-[#FFF3CD] px-3 py-1 text-[10px] font-semibold text-[#946B00]">
          Awaiting Decision
        </span>
      </div>

      {/* Content */}
      <div className="px-5 py-5">
        <label
          htmlFor="hr-notes"
          className="mb-2 block text-[11px] font-medium text-[#94A3B8]"
        >
          HR Notes (internal — not visible to employee)
        </label>

        <textarea
          id="hr-notes"
          rows={3}
          placeholder="Calibration notes, flags, succession planning observations..."
          className="w-full resize-none rounded-md border border-[#D9DEE5] px-3 py-3 text-[12px] text-[#475467] outline-none placeholder:text-[#A8B0BC] focus:border-[#A67C00] focus:ring-1 focus:ring-[#A67C00]/20"
        />

        {/* Actions */}
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onReturnForRevision}
            className="h-[43px] rounded-md border border-[#FFB4B4] bg-[#FFF7F7] px-5 text-[12px] font-medium text-[#EF4444] transition hover:bg-[#FFF0F0]"
          >
            Return for Revision
          </button>

          <button
            type="button"
            onClick={onApprove}
            className="h-[43px] rounded-md bg-[#9A7200] px-5 text-[12px] font-semibold text-white transition hover:bg-[#856200]"
          >
            Approve &amp; Send to Employee
          </button>
        </div>
      </div>
    </section>
  );
}
