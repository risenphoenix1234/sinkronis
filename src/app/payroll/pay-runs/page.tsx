// src/app/payroll/pay-runs/page.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight, FiFileText } from "react-icons/fi";
import { getApiErrorMessage, getPayRuns } from "@/lib/api/payroll";
import StatusBadge, { statusLabel } from "@/components/payroll/pay-run/StatusBadge";
import type { PayrollPagination, PayrollPayRun } from "@/lib/api/types/payroll.types";

const PAGE_SIZE = 10;
const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;
const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }) : "-";

export default function PayrollHistoryPage() {
  const [runs, setRuns] = useState<PayrollPayRun[]>([]);
  const [pagination, setPagination] = useState<PayrollPagination | null>(null);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getPayRuns({ page, limit: PAGE_SIZE });
      setRuns(res.items);
      setPagination(res.pagination);
    } catch (e) {
      setError(getApiErrorMessage(e, "Could not load payroll history."));
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.max(1, pagination?.totalPages ?? 1);
  const total = pagination?.total ?? 0;
  const start = (page - 1) * PAGE_SIZE;
  const allOnPage = runs.length > 0 && runs.every((r) => selected.includes(r.id));

  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const toggleAll = () =>
    setSelected((s) => (allOnPage ? s.filter((id) => !runs.some((r) => r.id === id)) : [...new Set([...s, ...runs.map((r) => r.id)])]));

  const downloadAll = () => {
    const rows = selected.length > 0 ? runs.filter((r) => selected.includes(r.id)) : runs;
    const header = ["Pay Run", "Period Start", "Period End", "Pay Date", "Number of Employees", "Gross", "Net", "Tax", "Pension", "Status"];
    const lines = rows.map((r) =>
      [
        r.periodLabel,
        fmtDate(r.periodStart),
        fmtDate(r.periodEnd),
        fmtDate(r.payDate),
        r.participantCount,
        r.totals.gross,
        r.totals.netPay,
        r.totals.paye + r.totals.wht,
        r.totals.pension,
        statusLabel(r.status),
      ]
        .map((v) => `"${v}"`)
        .join(","),
    );
    const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payroll-history.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Payroll History</h1>
        <button onClick={downloadAll} disabled={runs.length === 0} className="text-xs font-medium text-[#2183C6] hover:underline disabled:opacity-40">
          Download All
        </button>
      </div>

      {error && <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-dashed border-slate-300 text-xs text-slate-500">
            <tr>
              <th className="w-8 py-3">
                <input type="checkbox" checked={allOnPage} onChange={toggleAll} aria-label="Select all" />
              </th>
              <th className="py-3 font-medium">Pay Run</th>
              <th className="py-3 font-medium">Pay Date</th>
              <th className="py-3 font-medium">Number of Employees</th>
              <th className="py-3 font-medium">Gross</th>
              <th className="py-3 font-medium">Net</th>
              <th className="py-3 font-medium">Tax</th>
              <th className="py-3 font-medium">Pension</th>
              <th className="py-3 font-medium">Status</th>
              <th className="py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={10} className="py-10 text-center text-slate-400">Loading payroll history…</td>
              </tr>
            )}
            {!loading && runs.length === 0 && (
              <tr>
                <td colSpan={10} className="py-10 text-center text-slate-400">No payroll runs yet.</td>
              </tr>
            )}
            {!loading &&
              runs.map((r, idx) => {
                const needsReview = r.availableActions.includes("REVIEW");
                return (
                  <tr key={r.id} className={idx % 2 === 1 ? "bg-slate-50" : ""}>
                    <td className="py-4">
                      <input type="checkbox" checked={selected.includes(r.id)} onChange={() => toggle(r.id)} aria-label={`Select ${r.periodLabel}`} />
                    </td>
                    <td className="py-4">
                      <p className="text-slate-800">{r.periodLabel}</p>
                      <p className="text-[11px] text-slate-400">
                        {fmtDate(r.periodStart)} - {fmtDate(r.periodEnd)}
                      </p>
                    </td>
                    <td className="py-4 text-slate-700">{fmtDate(r.payDate)}</td>
                    <td className="py-4 text-slate-700">{r.participantCount}</td>
                    <td className="py-4 text-slate-700">{naira(r.totals.gross)}</td>
                    <td className="py-4 text-slate-700">{naira(r.totals.netPay)}</td>
                    <td className="py-4 text-slate-700">{naira(r.totals.paye + r.totals.wht)}</td>
                    <td className="py-4 text-slate-700">{naira(r.totals.pension)}</td>
                    <td className="py-4">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="py-4">
                      {needsReview ? (
                        <Link
                          href={`/payroll/pay-runs/${r.id}`}
                          className="rounded border border-orange-300 px-2.5 py-1 text-xs font-medium text-orange-500 hover:bg-orange-50"
                        >
                          Review ↗
                        </Link>
                      ) : (
                        <Link href={`/payroll/pay-runs/${r.id}`} className="flex items-center gap-1.5 text-xs font-medium text-[#2183C6] hover:underline">
                          <FiFileText size={13} className="text-yellow-500" /> View
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing {total === 0 ? 0 : start + 1} to {Math.min(start + PAGE_SIZE, total)} of {total} Payroll History
        </span>
        <div className="flex items-center gap-1">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded border border-slate-300 p-1.5 disabled:opacity-40" aria-label="Previous page">
            <FiChevronLeft size={13} />
          </button>
          {pageNumbers.map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-7 min-w-7 rounded border px-2 ${page === p ? "border-[#2183C6] bg-[#2183C6] text-white" : "border-slate-300 text-slate-600"}`}
            >
              {p}
            </button>
          ))}
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="rounded border border-slate-300 p-1.5 disabled:opacity-40" aria-label="Next page">
            <FiChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}