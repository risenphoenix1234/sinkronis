"use client";

import { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { getBillingHistory, exportBillingHistoryCsv, getBillingAnalytics, downloadInvoicePdf2 } from "@/lib/api/admin";
import { MyPlanBillingHistoryItem, MyPlanBillingAnalytics } from "@/lib/api/types/admin.types";

type YearFilter = "all" | number;

const statusStyles: Record<string, string> = {
  paid: "bg-emerald-50 text-emerald-700",
  failed: "bg-rose-50 text-rose-600",
  pending: "bg-amber-50 text-amber-700",
  cancelled: "bg-slate-100 text-slate-500",
};

const statusLabels: Record<string, string> = {
  paid: "Paid",
  failed: "Failed",
  pending: "Pending",
  cancelled: "Cancelled",
};

function naira(n: number) {
  return `₦${n.toLocaleString()}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const currentYear = new Date().getFullYear();

export default function BillingHistoryPage() {
  const [yearFilter, setYearFilter] = useState<YearFilter>("all");
  const [items, setItems] = useState<MyPlanBillingHistoryItem[]>([]);
  const [analytics, setAnalytics] = useState<MyPlanBillingAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const year = yearFilter === "all" ? undefined : yearFilter;
      const [historyRes, analyticsRes] = await Promise.all([
        getBillingHistory({ year, limit: 50 }),
        getBillingAnalytics(year ?? currentYear),
      ]);
      setItems(historyRes.data);
      setAnalytics(analyticsRes.data);
    } catch (err) {
      setError("Failed to load billing history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [yearFilter]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const year = yearFilter === "all" ? undefined : yearFilter;
      const blob = await exportBillingHistoryCsv({ year });
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `billing-history-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to export CSV.");
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadInvoice = async (invoiceId: string) => {
    setDownloadingId(invoiceId);
    try {
      const blob = await downloadInvoicePdf2(invoiceId);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to download invoice.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 rounded-md border border-slate-200 bg-white p-1">
          {(
            [
              { id: "all" as const, label: "All" },
              { id: currentYear, label: String(currentYear) },
              { id: currentYear - 1, label: String(currentYear - 1) },
            ]
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
          disabled={exporting}
          className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-60"
        >
          <FiDownload size={14} /> {exporting ? "Exporting..." : "Export CSV"}
        </button>
      </div>

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
            {loading && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-400">
                  Loading billing history...
                </td>
              </tr>
            )}

            {!loading &&
              items.map((entry) => (
                <tr key={entry.invoiceId} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-3 text-sm text-slate-600">
                    {formatDate(entry.date)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-sm text-slate-700">
                    {entry.description}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-sm font-medium tabular-nums text-slate-800">
                    {naira(entry.amountPaid)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        statusStyles[entry.paymentStatus] ?? "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {statusLabels[entry.paymentStatus] ?? entry.paymentStatus}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-3">
                    <button
                      onClick={() => handleDownloadInvoice(entry.invoiceId)}
                      disabled={downloadingId === entry.invoiceId}
                      className="flex items-center gap-1.5 text-sm text-sky-600 hover:underline disabled:opacity-60"
                    >
                      <FiDownload size={12} />
                      {downloadingId === entry.invoiceId ? "Downloading..." : entry.invoiceNumber}
                    </button>
                  </td>
                </tr>
              ))}

            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-400">
                  No billing history yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {analytics && (
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
            <p className="text-xs text-slate-400">Total Paid ({analytics.year})</p>
            <p className="mt-1 text-xl font-semibold text-emerald-600">
              {naira(analytics.totalPaidYearly)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
            <p className="text-xs text-slate-400">This Month</p>
            <p className="mt-1 text-xl font-semibold text-sky-600">
              {naira(analytics.monthlyPaid)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
            <p className="text-xs text-slate-400">Annual Estimate</p>
            <p className="mt-1 text-xl font-semibold text-amber-600">
              {naira(analytics.annualEstimate)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}