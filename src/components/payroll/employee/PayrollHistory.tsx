"use client";

import { Download } from "lucide-react";

export default function PayrollHistory() {
  return (
    <section className="mt-5 overflow-hidden rounded border border-[#E5E7EB] bg-white">
      {/* ================================================================
          HEADER
      ================================================================ */}

      <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-3.5">
        <h2 className="text-sm font-semibold text-[#263342]">
          Payroll History
        </h2>

        <button
          type="button"
          className="flex items-center gap-2 rounded border border-[#E5E7EB] bg-[#F8F9FA] px-3 py-1.5 text-[11px] font-medium text-[#667085] transition hover:bg-[#F2F4F7]"
        >
          <Download size={13} strokeWidth={1.8} />
          Export
        </button>
      </div>

      {/* ================================================================
          TABLE HEADER
      ================================================================ */}

      <div className="grid grid-cols-[1.1fr_1.5fr_1.5fr_1fr_1fr] border-b border-[#E5E7EB] px-4 py-2.5 sm:px-5">
        <TableHeader>Period</TableHeader>
        <TableHeader>Gross Salary</TableHeader>
        <TableHeader>Net Pay</TableHeader>
        <TableHeader>PAYE</TableHeader>
        <TableHeader>Status</TableHeader>
      </div>

      {/* ================================================================
          EMPTY STATE
      ================================================================ */}

      <div className="flex h-[84px] items-center justify-center">
        <p className="text-xs text-[#98A2B3]">No payslip history found.</p>
      </div>
    </section>
  );
}

/* ========================================================================
   TABLE HEADER
======================================================================== */

function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-medium text-[#667085]">{children}</span>
  );
}
