"use client";

import { CheckCircle, ShieldCheck, ThumbsUp } from "lucide-react";

type HRApprovalAndAcknowledgmentProps = {
  hrNotes?: string;
  employeeResponse?: string;
  onEmployeeResponseChange?: (value: string) => void;
  onAcknowledge?: () => void;
};

export default function HRApprovalAndAcknowledgment({
  hrNotes = "hdms k sgsg",
  employeeResponse = "",
  onEmployeeResponseChange,
  onAcknowledge,
}: HRApprovalAndAcknowledgmentProps) {
  return (
    <div className="w-full space-y-5">
      {/* ================= HR APPROVAL ================= */}
      <section className="overflow-hidden rounded-md border border-[#E2E5E8] bg-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-3">
          <div className="flex items-center gap-2">
            <ShieldCheck
              size={16}
              strokeWidth={1.8}
              className="text-[#946B00]"
            />

            <h2 className="text-[13px] font-semibold text-[#1F2937]">
              HR Approval
            </h2>
          </div>

          {/* Approved badge */}
          <span className="rounded-full bg-[#DCFCE7] px-3 py-1 text-[10px] font-semibold text-[#16803C]">
            Approved
          </span>
        </div>

        {/* Content */}
        <div className="px-5 py-4">
          <label
            htmlFor="hr-notes"
            className="mb-2 block text-[11px] font-medium text-[#7B8794]"
          >
            HR Notes (internal — not visible to employee)
          </label>

          <div
            id="hr-notes"
            className="min-h-[39px] rounded-md border border-[#E1E5E9] bg-[#F8FAFC] px-3 py-2.5 text-[11px] text-[#667085]"
          >
            {hrNotes}
          </div>
        </div>
      </section>

      {/* ================= EMPLOYEE ACKNOWLEDGMENT ================= */}
      <section className="overflow-hidden rounded-md border border-[#249447] bg-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#D9E8DE] bg-[#F4FFF7] px-5 py-3">
          <div className="flex items-center gap-2">
            <ThumbsUp size={16} strokeWidth={1.8} className="text-[#16803C]" />

            <h2 className="text-[13px] font-semibold text-[#1F2937]">
              Employee Acknowledgment
            </h2>
          </div>

          {/* Awaiting employee badge */}
          <span className="rounded-full bg-[#E0F2FE] px-3 py-1 text-[10px] font-semibold text-[#1677C8]">
            Awaiting Employee
          </span>
        </div>

        {/* Content */}
        <div className="px-5 py-5">
          {/* Notification */}
          <div className="mb-4 rounded-md border border-[#CDE8D5] bg-[#F0FFF4] px-3 py-2.5">
            <p className="text-[11px] leading-[18px] text-[#16803C]">
              The employee has been notified to review and acknowledge their
              completed appraisal.
            </p>
          </div>

          {/* Employee Response */}
          <label
            htmlFor="employee-response"
            className="mb-2 block text-[11px] font-medium text-[#7B8794]"
          >
            Employee Response (optional)
          </label>

          <textarea
            id="employee-response"
            value={employeeResponse}
            onChange={(e) => onEmployeeResponseChange?.(e.target.value)}
            rows={3}
            placeholder="Employee may add a response or comments before acknowledging..."
            className="w-full resize-none rounded-md border border-[#D9DEE5] bg-white px-3 py-3 text-[11px] text-[#475467] outline-none transition placeholder:text-[#A8B0BC] focus:border-[#249447] focus:ring-1 focus:ring-[#249447]/20"
          />

          {/* Action */}
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={onAcknowledge}
              className="flex h-[40px] items-center gap-2 rounded-md bg-[#16803C] px-5 text-[12px] font-medium text-white transition hover:bg-[#126B32]"
            >
              <CheckCircle size={14} strokeWidth={2} />
              Acknowledge &amp; Close Appraisal
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
