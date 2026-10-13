// src/app/payroll/overview/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiDownload, FiInfo, FiX } from "react-icons/fi";
import PayrollChart from "@/components/payroll/overview/PayrollChart";
import PayeeGroupChart from "@/components/payroll/overview/PayeeGroupChart";
import { getApiErrorMessage, getPayrollDashboard } from "@/lib/api/payroll";
import type { PayrollDashboardData } from "@/lib/api/types/payroll.types";

const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;
const nairaExact = (n: number) => `₦${n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const moneyOf = (v: unknown): number | null => {
  if (typeof v === "number") return v;
  if (v && typeof v === "object" && typeof (v as { amount?: unknown }).amount === "number") return (v as { amount: number }).amount;
  return null;
};

const periodLabel = (period: string) => {
  const [y, m] = period.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
};

export default function PayrollOverviewPage() {
  const [data, setData] = useState<PayrollDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    getPayrollDashboard()
      .then(setData)
      .catch((e) => setError(getApiErrorMessage(e, "Could not load the payroll overview.")))
      .finally(() => setLoading(false));
  }, []);

  const exportReport = () => {
    if (!data) return;
    const rows = [["Period", "Gross", "Net Pay"], ...data.payrollTrend.map((p) => [p.period, String(p.gross), String(p.netPay)])];
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payroll-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="p-6 text-sm text-slate-400">Loading overview…</div>;
  if (!data) return <div className="p-6 text-sm text-red-600">{error || "No data."}</div>;

  const lastNet = moneyOf(data.summary.lastRunNetPay);
  const stats = [
    { label: "Employees on Payroll", value: String(data.summary.employeesOnPayroll), note: "permanent staff" },
    { label: "External Payees", value: String(data.summary.externalPayeesOnPayroll), note: "contract and consultants" },
    { label: "Monthly Cost", value: naira(data.summary.totalMonthlyCost.amount), note: periodLabel(data.period) },
    { label: "Last Run Net Pay", value: lastNet === null ? "-" : naira(lastNet), note: "most recent payroll" },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Welcome</h1>
          <p className="text-sm text-slate-500">Here is what is happening with your payroll.</p>
        </div>
        <button onClick={exportReport} className="flex items-center gap-2 rounded-lg bg-[#2183C6] px-4 py-2 text-sm font-medium text-white hover:opacity-90">
          <FiDownload size={16} /> Export Report
        </button>
      </div>

      {showBanner && data.pendingApproval && (
        <div className="flex items-start justify-between rounded-lg bg-[#E3F6FA] px-4 py-3 text-sm text-slate-700">
          <span className="flex items-center gap-2">
            <FiInfo className="text-[#2183C6]" /> A payroll is waiting for approval.{" "}
            <Link
              href={data.pendingApproval.payRunId ? `/payroll/pay-runs/${data.pendingApproval.payRunId}` : "/payroll/pay-runs"}
              className="font-medium text-[#2183C6] hover:underline"
            >
              Review it
            </Link>
          </span>
          <button onClick={() => setShowBanner(false)} aria-label="Dismiss"><FiX /></button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{s.value}</p>
            <p className="mt-1 text-xs text-slate-400">{s.note}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
          <p className="text-sm text-slate-500">Payroll Summary</p>
          <p className="mb-4 text-2xl font-semibold text-slate-900">{nairaExact(data.summary.totalMonthlyCost.amount)}</p>
          <PayrollChart data={data.payrollTrend} currentPeriod={data.period} />
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="mb-4 text-sm font-medium text-slate-900">Payee Groups</p>
          <PayeeGroupChart items={data.payeeGroupDistribution.items} />
        </div>
      </div>
    </div>
  );
}