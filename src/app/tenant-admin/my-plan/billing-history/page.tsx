// app/tenant-admin/my-plan/billing-history/page.tsx
"use client";

import { useState } from "react";
import { FiDownload } from "react-icons/fi";

import { billingHistory, getBillingSummary, naira } from "@/lib/plan-data";

type YearFilter = "all" | "2026" | "2025";

const statusStyles: Record<string, string> = {
  Paid: "bg-emerald-50 text-emerald-700",
  Failed: "bg-rose-50 text-rose-600",
  Pending: "bg-amber-50 text-amber-700",
};

export default function BillingHistoryPage() {
  const [yearFilter, setYearFilter] = useState<YearFilter>("all");

  const filtered = billingHistory.filter((b) =>
    yearFilter === "all" ? true : b.year === yearFilter,
  );

const { totalPaid2026, thisMonth, annualEstimate } = getBillingSummary();



  const handleExport = () => {
    // Hook up to actual CSV generation / download here.
    console.log("Exporting billing history as CSV");
  };

  return (
    <div className="space-y-4">
      {/* Filter + Export bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 rounded-md border border-slate-200 bg-white p-1">
          {(
            [
              { id: "all", label: "All" },
              { id: "2026", label: "2026" },
              { id: "2025", label: "2025" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.id}
              onClick={() => setYearFilter(opt.id)}
              className={`rounded px-3 py-1.5 text-xs font-medium ${
                yearFilter === opt.id
                  ? "bg-sky-600 text-white"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
        >
          <FiDownload size={14} /> Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Description</th>
              <th className="px-6 py-3 font-medium">Amount</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Invoice</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((entry) => (
              <tr key={entry.id} className="hover:bg-slate-50">
                <td className="px-6 py-3 text-sm text-slate-600 whitespace-nowrap">
                  {entry.date}
                </td>
                <td className="px-6 py-3 text-sm text-slate-700 whitespace-nowrap">
                  {entry.description}
                </td>
                <td className="px-6 py-3 text-sm tabular-nums font-medium text-slate-800 whitespace-nowrap">
                  {naira(entry.amount)}
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[entry.status]}`}
                  >
                    {entry.status}
                  </span>
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <button className="flex items-center gap-1.5 text-sm text-sky-600 hover:underline">
                    <FiDownload size={12} /> {entry.invoiceRef}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
          <p className="text-xs text-slate-400">Total Paid (2026)</p>
          <p className="mt-1 text-xl font-semibold text-emerald-600">
            {naira(totalPaid2026)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
          <p className="text-xs text-slate-400">This Month</p>
          <p className="mt-1 text-xl font-semibold text-sky-600">
            {naira(thisMonth)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
          <p className="text-xs text-slate-400">Annual Estimate</p>
          <p className="mt-1 text-xl font-semibold text-amber-600">
            {naira(annualEstimate)}
          </p>
        </div>
      </div>
    </div>
  );
}
