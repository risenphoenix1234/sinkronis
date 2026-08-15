// app/reports/results/page.tsx
"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FiArrowLeft, FiDownload, FiX } from "react-icons/fi";
import { allInvoices, naira, statusStyles } from "@/lib/reports-data";

const filterLabels: Record<string, string> = {
  client: "Client",
  agent: "Agent",
  item: "Item/Service",
  project: "Project",
  status: "Status",
  from: "From",
  to: "To",
};

function ReportsResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeFilters = Array.from(searchParams.entries()).filter(([, v]) => v);

  // Demo filtering: in this mock data set every active filter combination
  // still resolves to the same four seed invoices, mirroring the design.
  const results = allInvoices;
  const totalValue = results.reduce((sum, inv) => sum + inv.total, 0);

  const clearAll = () => router.push("/accounting/reports/results");

  return (
    <section className="space-y-6 p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-slate-400">
        <Link href="/accounting/reports" className="hover:text-slate-600">
          Reports
        </Link>
        <span>/</span>
        <span className="text-slate-600">Filtered Results</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <Link
          href="/accounting/reports"
          className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
        >
          <FiArrowLeft size={14} /> Back
        </Link>
        <button className="flex items-center gap-2 rounded-md bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700 whitespace-nowrap">
          <FiDownload size={14} /> Download Report
        </button>
      </div>

      {/* Modify filters bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/accounting/reports"
            className="text-sm font-medium text-sky-600 hover:underline"
          >
            Modify Filters
          </Link>
          <span className="text-slate-300">|</span>
          <button
            onClick={clearAll}
            className="text-sm text-slate-500 hover:underline"
          >
            Clear all
          </button>
          {activeFilters.length > 0 && (
            <div className="ml-2 flex flex-wrap gap-2">
              {activeFilters.map(([key, value]) => (
                <span
                  key={key}
                  className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
                >
                  {filterLabels[key] ?? key}: {value}
                  <FiX size={11} className="text-slate-400" />
                </span>
              ))}
            </div>
          )}
        </div>
        <p className="text-sm text-slate-500">
          <span className="font-medium text-slate-800">
            {results.length} invoices found
          </span>
          {" · "}Total:{" "}
          <span className="font-medium text-slate-800">
            {naira(totalValue)}
          </span>
        </p>
      </div>

      {/* Invoice table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-3 font-medium">Invoice ID</th>
              <th className="px-6 py-3 font-medium">Client</th>
              <th className="px-6 py-3 font-medium">Agent</th>
              <th className="px-6 py-3 font-medium">Project</th>
              <th className="px-6 py-3 font-medium">Items / Services</th>
              <th className="px-6 py-3 font-medium">Subtotal</th>
              <th className="px-6 py-3 font-medium">VAT</th>
              <th className="px-6 py-3 font-medium">Total</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Issue Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {results.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50">
                <td className="px-6 py-3 text-sm font-medium text-sky-600 whitespace-nowrap">
                  {inv.id}
                </td>
                <td className="px-6 py-3 text-sm text-slate-600 whitespace-nowrap">
                  {inv.client}
                </td>
                <td className="px-6 py-3 text-sm text-slate-600 whitespace-nowrap">
                  {inv.agent}
                </td>
                <td className="px-6 py-3 text-sm text-slate-600 whitespace-nowrap">
                  {inv.project}
                </td>
                <td className="px-6 py-3 text-sm text-slate-600 whitespace-nowrap">
                  {inv.itemsServices}
                </td>
                <td className="px-6 py-3 text-sm tabular-nums text-slate-600 whitespace-nowrap">
                  {naira(inv.subtotal)}
                </td>
                <td className="px-6 py-3 text-sm tabular-nums text-slate-600 whitespace-nowrap">
                  {naira(inv.vat)}
                </td>
                <td className="px-6 py-3 text-sm tabular-nums font-medium text-slate-800 whitespace-nowrap">
                  {naira(inv.total)}
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[inv.status]}`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm text-slate-500 whitespace-nowrap">
                  {inv.issueDate}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-slate-200 bg-slate-50">
              <td
                colSpan={7}
                className="px-6 py-3 text-sm font-medium text-slate-700"
              >
                Totals — {results.length} invoices
              </td>
              <td className="px-6 py-3 text-sm tabular-nums font-semibold text-slate-900">
                {naira(totalValue)}
              </td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Export bar */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-500">
          Export {results.length} invoices as:
        </p>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
            <FiDownload size={14} /> Download CSV
          </button>
          <button className="flex items-center gap-2 rounded-md bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700">
            <FiDownload size={14} /> Download PDF
          </button>
        </div>
      </div>
    </section>
  );
}
export default function ReportsResultsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-slate-500">Loading results...</div>}>
      <ReportsResultsContent />
    </Suspense>
  );
}
