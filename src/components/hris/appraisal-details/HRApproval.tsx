"use client";

import {
  CheckCircle2,
  FileCheck2,
  MessageSquareText,
  UserRound,
  CalendarDays,
  AlertCircle,
} from "lucide-react";
import StatusBadge from "../appraisal/StatusBadge";

export default function HRApproval() {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EAF4FF]">
            <FileCheck2 size={19} className="text-[#1677C8]" />
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">HR Approval</h2>

            <p className="mt-1 text-xs text-slate-400">
              Review and approve the completed performance appraisal
            </p>
          </div>
        </div>

        <StatusBadge text="Pending Approval" color="yellow" />
      </div>

      <div className="space-y-6 p-6">
        {/* Approval summary */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-[#F8FAFC] p-5">
            <p className="text-xs font-medium text-slate-400">Final Score</p>

            <div className="mt-2 flex items-end gap-2">
              <span className="text-3xl font-bold text-[#A16207]">63%</span>

              <span className="mb-1 text-xs font-medium text-[#A16207]">
                Below Expectation
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-[#F8FAFC] p-5">
            <p className="text-xs font-medium text-slate-400">Review Status</p>

            <div className="mt-3 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-600" />

              <span className="text-sm font-semibold text-slate-700">
                Manager Review Completed
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-[#F8FAFC] p-5">
            <p className="text-xs font-medium text-slate-400">Review Period</p>

            <p className="mt-3 text-sm font-semibold text-slate-700">Q2 2026</p>
          </div>
        </div>

        {/* HR note */}
        <div className="rounded-lg border border-[#F3E8FF] bg-[#FAF5FF] p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
              <MessageSquareText size={17} className="text-[#7B22A8]" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#7B22A8]">
                HR Review Note
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Please review the manager's assessment and confirm that the
                appraisal has followed the required performance review process
                before approving.
              </p>
            </div>
          </div>
        </div>

        {/* HR notes */}
        <div>
          <label
            htmlFor="hr-notes"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            HR Notes
          </label>

          <textarea
            id="hr-notes"
            rows={5}
            placeholder="Add any comments or observations before approving this review..."
            className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#1677C8] focus:ring-2 focus:ring-[#1677C8]/10"
          />
        </div>

        {/* HR reviewer */}
        <div className="flex flex-wrap items-center gap-8 border-t pt-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF4FF]">
              <UserRound size={16} className="text-[#1677C8]" />
            </div>

            <div>
              <p className="text-[11px] text-slate-400">HR Reviewer</p>

              <p className="text-sm font-semibold text-slate-700">
                HR Administrator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF4FF]">
              <CalendarDays size={16} className="text-[#1677C8]" />
            </div>

            <div>
              <p className="text-[11px] text-slate-400">Submitted</p>

              <p className="text-sm font-semibold text-slate-700">
                30 June 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
