// app/payroll/pay-runs/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";
import { naira } from "@/types/payroll/payee-data";
import {
  PayRunListItem,
  PayRunStatus,
} from "@/lib/api/payroll";
import RunPayrollModal, {
  RunPayrollSubmitData,
} from "@/components/payroll/pay-run/RunPayrollModal";
import {
  loadStoredPayRuns,
  createClientPayRun,
} from "@/data/payroll/pay-run-store";
import { usePayees } from "@/context/payroll/PayeeContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import EmptyState from "@/components/shared/EmptyState";
import { toast } from "react-toastify";

// All 10 API-canonical status values mapped to badge styles
const statusStyles: Record<PayRunStatus, string> = {
  DRAFT: "bg-[#fef9c3] text-[#a16207]",
  PROCESSING: "bg-[#dbeafe] text-[#1d4ed8]",
  PENDING_APPROVAL: "bg-[#fef3c7] text-[#b45309]",
  APPROVED: "bg-[#ccfbf1] text-[#0f766e]",
  PENDING_DISBURSEMENT: "bg-[#e0e7ff] text-[#4338ca]",
  DISBURSING: "bg-[#ede9fe] text-[#7c3aed]",
  DISBURSED: "bg-[#dcfce7] text-[#15803d]",
  FAILED: "bg-[#fee2e2] text-[#b91c1c]",
  PAID: "bg-[#d1fae5] text-[#065f46]",
  CANCELLED: "bg-[#f3f4f6] text-[#6b7280]",
};

const statusLabels: Record<PayRunStatus, string> = {
  DRAFT: "Draft",
  PROCESSING: "Processing",
  PENDING_APPROVAL: "Pending Approval",
  APPROVED: "Approved",
  PENDING_DISBURSEMENT: "Pending Disbursement",
  DISBURSING: "Disbursing",
  DISBURSED: "Disbursed",
  FAILED: "Failed",
  PAID: "Paid",
  CANCELLED: "Cancelled",
};

const FILTER_STATUSES: PayRunStatus[] = [
  "DRAFT",
  "PROCESSING",
  "PENDING_APPROVAL",
  "APPROVED",
  "PENDING_DISBURSEMENT",
  "DISBURSED",
  "PAID",
  "CANCELLED",
];

export default function PayRunsPage() {
  const router = useRouter();
  const { updatePayee } = usePayees();

  const [payRuns, setPayRuns] = useState<PayRunListItem[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<PayRunStatus | "">("");
  const [runPayrollOpen, setRunPayrollOpen] = useState(false);

  // Load runs from store
  const refreshPayRuns = () => {
    const stored = loadStoredPayRuns();
    const mapped: PayRunListItem[] = stored.map((r) => ({
      id: r.id,
      period: r.period,
      status: r.status,
      createdAt: r.createdAt,
      from: r.from,
      to: r.to,
      payDate: r.payDate,
      employees: r.employees,
      gross: r.gross,
      netPay: r.netPay,
      paye: r.paye,
    }));
    setPayRuns(mapped);
  };

  useEffect(() => {
    refreshPayRuns();
  }, []);

  // Filtered runs
  const filteredRuns = useMemo(() => {
    return payRuns.filter((r) => {
      const matchesSearch =
        search.trim() === "" ||
        r.period.toLowerCase().includes(search.toLowerCase()) ||
        r.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !status || r.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [payRuns, search, status]);

  // Handle Create Pay Run with Selected Payees
  const handlePayRunSubmit = (data: RunPayrollSubmitData) => {
    const newRun = createClientPayRun({
      periodLabel: data.periodLabel,
      from: data.from,
      to: data.to,
      selectedPayees: data.selectedPayees,
    });

    // Update payment history on each selected payee
    data.selectedPayees.forEach((payee) => {
      const newRecord = {
        period: data.periodLabel,
        amount: payee.netSalary,
        paymentDate: data.to,
        reference: `PAY-${newRun.id}-${payee.id}`,
        status: "Pending" as const,
      };
      updatePayee(payee.id, {
        paymentHistory: [newRecord, ...(payee.paymentHistory || [])],
      });
    });

    refreshPayRuns();
    toast.success(
      `Pay run for ${data.periodLabel} created with ${data.selectedPayees.length} selected payees!`,
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1f2937]">Pay Runs</h1>
          <p className="mt-1 text-xs text-[#6b7280]">
            Create and manage monthly payroll runs with selective payee enrollment.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setRunPayrollOpen(true)}
        >
          <Plus size={15} className="mr-1.5" />
          Run Payroll
        </Button>
      </div>

      {/* Search + filter */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-sm">
        <div className="relative min-w-[240px] flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search period e.g. May 2026..."
            className="h-9 pl-9 text-xs"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as PayRunStatus | "")}
          className="h-9 rounded-lg border border-[#e5e7eb] bg-white px-3 text-xs text-[#374151] outline-none focus:border-[#2183c6]"
        >
          <option value="">All Statuses</option>
          {FILTER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {statusLabels[s] || s}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-xs">
            <thead>
              <tr className="border-b border-[#e5e7eb] bg-[#f9fafb] text-[#6b7280]">
                <th className="px-5 py-3.5 font-semibold">
                  <span className="inline-flex items-center gap-1">
                    Period <ChevronDown size={12} />
                  </span>
                </th>
                <th className="px-4 py-3.5 font-semibold">
                  <span className="inline-flex items-center gap-1">
                    Payees Included <ChevronUp size={12} />
                  </span>
                </th>
                <th className="px-4 py-3.5 font-semibold text-right">Total Gross</th>
                <th className="px-4 py-3.5 font-semibold text-right">
                  <span className="inline-flex items-center gap-1">
                    Net Payout <ChevronUp size={12} />
                  </span>
                </th>
                <th className="px-4 py-3.5 font-semibold text-right">PAYE / Deductions</th>
                <th className="px-4 py-3.5 font-semibold text-center">Status</th>
                <th className="px-5 py-3.5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0f0]">
              {filteredRuns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8">
                    <EmptyState
                      title="No pay runs found"
                      subtitle="No pay runs match the selected filters. Click 'Run Payroll' to initiate a new payroll run."
                    />
                  </td>
                </tr>
              ) : (
                filteredRuns.map((run) => (
                  <tr key={run.id} className="transition hover:bg-[#fcfdfd]">
                    <td className="px-5 py-3.5 font-semibold text-[#1f2937]">
                      {run.period}
                      <span className="block text-[11px] font-mono text-[#9ca3af]">{run.id}</span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center rounded-full bg-[#e0f2fe] px-2.5 py-0.5 text-[11px] font-semibold text-[#0369a1]">
                        {run.employees} Payees
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right font-medium text-[#1f2937]">
                      {naira(run.gross)}
                    </td>

                    <td className="px-4 py-3.5 text-right font-bold text-[#15803d]">
                      {naira(run.netPay)}
                    </td>

                    <td className="px-4 py-3.5 text-right font-medium text-[#b91c1c]">
                      -{naira(run.paye)}
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          statusStyles[run.status] || "bg-[#f3f4f6] text-[#6b7280]"
                        }`}
                      >
                        {statusLabels[run.status] || run.status}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <Button
                        variant={run.status === "PENDING_APPROVAL" ? "primary" : "outline"}
                        size="sm"
                        onClick={() => router.push(`/payroll/pay-runs/${run.id}`)}
                      >
                        {run.status === "PENDING_APPROVAL" ? "Review & Approve" : "View Details"}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Run Payroll Modal with Payee Selection */}
      <RunPayrollModal
        open={runPayrollOpen}
        onClose={() => setRunPayrollOpen(false)}
        onSubmit={handlePayRunSubmit}
      />
    </div>
  );
}
