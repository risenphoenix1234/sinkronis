// app/payroll/pay-runs/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { PayRun, PayRunStatus } from "@/types/payroll/pay-run-data";
import { payRuns as initialPayRuns } from "@/data/payroll/pay-run-data";
import { naira } from "@/types/payroll/payee-data";
import RunPayrollModal, {
  RunPayrollFormData,
} from "@/components/payroll/pay-run/RunPayrollModal";

const statusStyles: Record<PayRunStatus, string> = {
  Disbursed: "bg-[#dcfce7] text-[#15803d]",
  Draft: "bg-[#fef9c3] text-[#a16207]",
};

export default function PayRunsPage() {
  const router = useRouter();
  const [payRuns, setPayRuns] = useState<PayRun[]>(initialPayRuns);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [runPayrollOpen, setRunPayrollOpen] = useState(false);

  const filtered = payRuns.filter((run) => {
    const matchesSearch = run.period
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus = status ? run.status === status : true;
    return matchesSearch && matchesStatus;
  });

  const handleRunPayroll = (data: RunPayrollFormData) => {
    const newRun: PayRun = {
      id: crypto.randomUUID(),
      period: data.periodLabel,
      createdAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      periodStart: data.from,
      periodEnd: data.to,
      employees: 16,
      gross: 0,
      netPay: 0,
      paye: 0,
      status: "Draft",
    };
    setPayRuns((prev) => [newRun, ...prev]);
    setRunPayrollOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] p-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1f2937]">Pay Runs</h1>
          <p className="mt-1 text-sm text-[#6b7280]">
            Create and manage monthly payroll runs.
          </p>
        </div>

        <button
          onClick={() => setRunPayrollOpen(true)}
          className="flex items-center gap-2 rounded-md bg-[#1683d8] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0f74c2]"
        >
          <Plus size={15} />
          Run Payroll
        </button>
      </div>

      {/* Search + filter */}
      <div className="mt-6 flex items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search period..."
          className="h-11 w-[225px] rounded-md border border-[#e5e7eb] bg-white px-4 text-sm text-[#374151] outline-none placeholder:text-[#9ca3af] focus:border-[#1683d8]"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-11 w-[90px] rounded-md border border-[#e5e7eb] bg-white px-3 text-sm text-[#374151] outline-none focus:border-[#1683d8]"
        >
          <option value="">All</option>
          <option value="Disbursed">Disbursed</option>
          <option value="Draft">Draft</option>
        </select>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto rounded-lg border border-[#e5e7eb] bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#e5e7eb] text-xs text-[#6b7280]">
              <th className="px-6 py-3 font-medium">
                <span className="inline-flex items-center gap-1">
                  Period <ChevronDown size={12} />
                </span>
              </th>
              <th className="px-6 py-3 font-medium">
                <span className="inline-flex items-center gap-1">
                  Employees <ChevronUp size={12} />
                </span>
              </th>
              <th className="px-6 py-3 font-medium">Gross</th>
              <th className="px-6 py-3 font-medium">
                <span className="inline-flex items-center gap-1">
                  Net Pay <ChevronUp size={12} />
                </span>
              </th>
              <th className="px-6 py-3 font-medium">PAYE</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-sm text-[#9ca3af]"
                >
                  No pay runs found.
                </td>
              </tr>
            ) : (
              filtered.map((run, index) => (
                <tr
                  key={run.id}
                  className={`border-b border-[#f0f0f0] last:border-b-0 ${
                    index % 2 === 1 ? "bg-[#f9fafb]" : "bg-white"
                  }`}
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-[#1f2937]">{run.period}</p>
                    <p className="mt-0.5 text-xs text-[#9ca3af]">
                      Created {run.createdAt}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-[#374151]">{run.employees}</td>
                  <td className="px-6 py-4 text-[#6b7280]">
                    {naira(run.gross)}
                  </td>
                  <td className="px-6 py-4 font-semibold text-[#1f2937]">
                    {naira(run.netPay)}
                  </td>
                  <td className="px-6 py-4 text-[#ef4444]">
                    {naira(run.paye)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[run.status]}`}
                    >
                      {run.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {run.status === "Draft" ? (
                      <button
                        onClick={() =>
                          router.push(`/payroll/pay-runs/${run.id}`)
                        }
                        className="rounded-md bg-[#1683d8] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#0f74c2]"
                      >
                        Review
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          router.push(`/payroll/pay-runs/${run.id}`)
                        }
                        className="rounded-md bg-[#e8f4fd] px-4 py-1.5 text-xs font-medium text-[#1683d8] hover:bg-[#d5eafb]"
                      >
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <RunPayrollModal
        open={runPayrollOpen}
        onClose={() => setRunPayrollOpen(false)}
        onSubmit={handleRunPayroll}
      />
    </div>
  );
}
