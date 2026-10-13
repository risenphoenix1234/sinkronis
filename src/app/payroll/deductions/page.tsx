// src/app/payroll/deductions/page.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight, FiPlus } from "react-icons/fi";
import AddLoanModal from "@/components/payroll/deductions/AddLoanModal";
import LoanStatusBadge from "@/components/payroll/deductions/LoanStatusBadge";
import { getApiErrorMessage, getLoansPage } from "@/lib/api/payroll";
import { pickNum, pickText, type Rec } from "@/lib/payroll-pick";
import type { PayrollLoansPage } from "@/lib/api/types/payroll.types";

const PAGE_SIZE = 10;
const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;

const employeeName = (r: Rec) => {
  const direct = pickText(r, ["employeeName", "fullName", "displayName"]);
  if (direct) return direct;
  const emp = r.employee as Rec | undefined;
  return pickText(emp, ["fullName", "name", "displayName"]) ?? "-";
};

export default function LoanDeductionsPage() {
  const [data, setData] = useState<PayrollLoansPage | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await getLoansPage({ page, limit: PAGE_SIZE }));
    } catch (e) {
      setError(getApiErrorMessage(e, "Could not load loans."));
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const items = data?.items ?? [];
  const summary = data?.summary ?? {};
  const pagination = data?.pagination ?? null;
  const total = pagination?.total ?? 0;
  const totalPages = Math.max(1, pagination?.totalPages ?? 1);
  const start = (page - 1) * PAGE_SIZE;

  const tiles = [
    { label: "Active Loans", value: String(summary.activeLoans ?? 0) },
    { label: "Monthly Loan Deductions", value: naira(summary.monthlyLoanDeductions ?? 0) },
    { label: "Total Outstanding", value: naira(summary.totalOutstanding ?? 0) },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Loan Deductions</h1>
        <button onClick={() => setAdding(true)} className="flex items-center gap-2 rounded-md bg-[#2183C6] px-4 py-2 text-sm font-medium text-white hover:opacity-90">
          <FiPlus size={14} /> Add Loan
        </button>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-lg border border-slate-200 bg-white px-4 py-3">
            <p className="text-xs text-slate-500">{t.label}</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{t.value}</p>
          </div>
        ))}
      </div>

      {error && <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-dashed border-slate-300 text-xs text-slate-500">
            <tr>
              <th className="py-3 font-medium">Employee</th>
              <th className="py-3 font-medium">Purpose</th>
              <th className="py-3 font-medium">Loan Amount</th>
              <th className="py-3 font-medium">Outstanding</th>
              <th className="py-3 font-medium">Monthly Repayment</th>
              <th className="py-3 font-medium">Status</th>
              <th className="py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-400">Loading loans…</td>
              </tr>
            )}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-400">No loans yet.</td>
              </tr>
            )}
            {!loading &&
              items.map((r, idx) => {
                const id = String(r.id ?? idx);
                return (
                  <tr key={id} className={idx % 2 === 1 ? "bg-slate-50" : ""}>
                    <td className="py-4 text-slate-800">{employeeName(r)}</td>
                    <td className="py-4 text-slate-700">{pickText(r, ["purpose"]) ?? "-"}</td>
                    <td className="py-4 text-slate-700">{naira(pickNum(r, ["originalPrincipal", "principalAmount"]) ?? 0)}</td>
                    <td className="py-4 text-slate-700">{naira(pickNum(r, ["outstandingAmount"]) ?? 0)}</td>
                    <td className="py-4 text-slate-700">{r.monthlyRepayment == null ? "-" : naira(pickNum(r, ["monthlyRepayment"]) ?? 0)}</td>
                    <td className="py-4">
                      <LoanStatusBadge status={pickText(r, ["status"])} />
                    </td>
                    <td className="py-4">
                      <Link href={`/payroll/deductions/${id}`} className="text-xs font-medium text-[#2183C6] hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing {total === 0 ? 0 : start + 1} to {Math.min(start + PAGE_SIZE, total)} of {total} Loans
        </span>
        <div className="flex items-center gap-1">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded border border-slate-300 p-1.5 disabled:opacity-40" aria-label="Previous page">
            <FiChevronLeft size={13} />
          </button>
          <span className="px-2">{page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="rounded border border-slate-300 p-1.5 disabled:opacity-40" aria-label="Next page">
            <FiChevronRight size={13} />
          </button>
        </div>
      </div>

      <AddLoanModal open={adding} onClose={() => setAdding(false)} onCreated={load} />
    </div>
  );
}