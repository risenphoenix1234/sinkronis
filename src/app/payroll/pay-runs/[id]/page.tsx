// app/payroll/pay-runs/[id]/page.tsx
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Download } from "lucide-react";
import {
  initials,
  PayRunStatus,
  payslipRouteId,
  PayslipStatus,
} from "@/types/payroll/pay-run-data";
import { payRuns, payslips } from "@/data/payroll/pay-run-data";
import { naira } from "@/types/payroll/payee-data";

const runStatusStyles: Record<PayRunStatus, string> = {
  Disbursed: "bg-[#dcfce7] text-[#15803d]",
  Draft: "bg-[#fef9c3] text-[#a16207]",
};

const payslipStatusStyles: Record<PayslipStatus, string> = {
  Paid: "bg-[#dcfce7] text-[#15803d]",
  Pending: "bg-[#fef9c3] text-[#a16207]",
};

export default function PayRunDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [search, setSearch] = useState("");

  const idParam = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const run = payRuns.find((r) => r.id === idParam);

  if (!run) {
    return (
      <div className="min-h-screen bg-[#f7f8fa] p-4">
        <button
          type="button"
          onClick={() => router.push("/payroll/pay-runs")}
          className="mb-5 flex items-center gap-2 text-sm text-[#667085] transition hover:text-[#1683d8]"
        >
          <ChevronLeft size={16} />
          Back to Pay Runs
        </button>
        <p className="text-sm text-[#9ca3af]">Pay run not found.</p>
      </div>
    );
  }

  const filtered = payslips.filter(
    (slip) =>
      slip.name.toLowerCase().includes(search.toLowerCase()) ||
      slip.dept.toLowerCase().includes(search.toLowerCase()),
  );

  // A draft run has not paid anyone out yet.
  const effectiveStatus = (status: PayslipStatus): PayslipStatus =>
    run.status === "Disbursed" ? status : "Pending";

  const timeline = [
    `${run.periodStart} – ${run.periodEnd}`,
    `Created ${run.createdAt}`,
    run.approvedAt && `Approved ${run.approvedAt}`,
    run.disbursedAt && `Disbursed ${run.disbursedAt}`,
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#f7f8fa] p-8">
      {/* Back button */}
      <button
        type="button"
        onClick={() => router.push("/payroll/pay-runs")}
        className="mb-4 flex items-center gap-2 text-sm text-[#374151] transition hover:text-[#1683d8]"
      >
        <ChevronLeft size={16} />
        Back to Pay Runs
      </button>

      {/* Summary card */}
      <div className="flex flex-wrap items-center justify-between gap-6 rounded-lg border border-[#e5e7eb] bg-white px-6 py-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-[#1f2937]">
              {run.period} Payroll
            </h1>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${runStatusStyles[run.status]}`}
            >
              {run.status}
            </span>
          </div>
          <p className="mt-2 text-xs text-[#6b7280]">{timeline.join(" · ")}</p>
        </div>

        <div className="flex items-center gap-7">
          <Stat label="Employees" value={String(run.employees)} />
          <Stat label="Gross" value={naira(run.gross)} />
          <Stat
            label="Net Pay"
            value={naira(run.netPay)}
            className="text-[#15803d]"
          />
          <Stat
            label="PAYE"
            value={naira(run.paye)}
            className="text-[#ef4444]"
          />

          <button className="ml-1 flex items-center gap-2 rounded-md border border-[#e5e7eb] bg-[#f3f4f6] px-4 py-2.5 text-sm font-medium text-[#374151] transition hover:bg-[#e9ebee]">
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Payslips */}
      <div className="mt-5 rounded-lg border border-[#e5e7eb] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
          <h2 className="text-base font-bold text-[#1f2937]">
            Employee Payslips ({payslips.length})
          </h2>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employee or dept..."
            className="h-10 w-[195px] rounded-md border border-[#e5e7eb] bg-white px-4 text-sm text-[#374151] outline-none placeholder:text-[#9ca3af] focus:border-[#1683d8]"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#e5e7eb] text-xs text-[#6b7280]">
                <th className="px-6 py-3 font-medium">Employee</th>
                <th className="px-4 py-3 font-medium">Dept</th>
                <th className="px-4 py-3 font-medium">Gross</th>
                <th className="px-4 py-3 font-medium">PAYE</th>
                <th className="px-4 py-3 font-medium">Pension</th>
                <th className="px-4 py-3 font-medium">NHF</th>
                <th className="px-4 py-3 font-medium">Loans</th>
                <th className="px-4 py-3 font-medium">Net Pay</th>
                <th className="px-4 py-3 font-medium">Bank</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-6 py-10 text-center text-sm text-[#9ca3af]"
                  >
                    No payslips found.
                  </td>
                </tr>
              ) : (
                filtered.map((slip, index) => (
                  <tr
                    key={slip.id}
                    onClick={() =>
                      router.push(
                        `/payroll/payslips/${payslipRouteId(run, slip)}`,
                      )
                    }
                    className={`cursor-pointer border-b border-[#f0f0f0] transition last:border-b-0 hover:bg-[#f1f7fd] ${
                      index % 2 === 1 ? "bg-[#f9fafb]" : "bg-white"
                    }`}
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#e8f4fd] text-[11px] font-semibold text-[#1683d8]">
                          {initials(slip.name)}
                        </span>
                        <div>
                          <p className="font-semibold text-[#1f2937]">
                            {slip.name}
                          </p>
                          <p className="mt-0.5 text-xs text-[#9ca3af]">
                            {slip.role}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-[#6b7280]">{slip.dept}</td>
                    <td className="px-4 py-3.5 font-semibold text-[#1f2937]">
                      {naira(slip.gross)}
                    </td>
                    <td className="px-4 py-3.5 text-[#ef4444]">
                      {naira(slip.paye)}
                    </td>
                    <td className="px-4 py-3.5 text-[#b45309]">
                      {naira(slip.pension)}
                    </td>
                    <td className="px-4 py-3.5 text-[#374151]">
                      {naira(slip.nhf)}
                    </td>
                    <td className="px-4 py-3.5">
                      {slip.loans > 0 ? (
                        <span className="text-[#374151]">
                          {naira(slip.loans)}
                        </span>
                      ) : (
                        <span className="text-[#9ca3af]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-[#15803d]">
                      {naira(slip.netPay)}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-[#1f2937]">
                        {slip.bankName}
                      </p>
                      <p className="mt-0.5 text-xs text-[#9ca3af]">
                        {slip.bankAccount}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          payslipStatusStyles[effectiveStatus(slip.status)]
                        }`}
                      >
                        {effectiveStatus(slip.status)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  className = "text-[#1f2937]",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="text-center">
      <p className="text-[10px] font-medium uppercase tracking-wide text-[#9ca3af]">
        {label}
      </p>
      <p className={`mt-1 text-[15px] font-bold ${className}`}>{value}</p>
    </div>
  );
}
