// src/app/payroll/pension/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { getApiErrorMessage, getPensionRemittances } from "@/lib/api/payroll";
import type { PayrollPagination, PayrollRecord } from "@/lib/api/types/payroll.types";
import { colorFor, currentMonth, initialsOf, monthLabel, pickNum, pickText } from "@/lib/payroll-pick";

const PAGE_SIZE = 10;
const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;

const totalOf = (r: PayrollRecord) =>
  pickNum(r, ["totalAmount", "totalContribution", "total"]) ??
  (pickNum(r, ["employeeContribution", "employeePension"]) ?? 0) +
    (pickNum(r, ["employerContribution", "employerPension"]) ?? 0);

export default function PayrollPensionPage() {
  const [month, setMonth] = useState(currentMonth);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<PayrollRecord[]>([]);
  const [pagination, setPagination] = useState<PayrollPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    getPensionRemittances({ period: month, page, limit: PAGE_SIZE })
      .then((res) => {
        if (cancelled) return;
        setRows(res.items);
        setPagination(res.pagination);
      })
      .catch((e) => !cancelled && setError(getApiErrorMessage(e, "Could not load pension remittances.")))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [month, page]);

  const totalPages = Math.max(1, pagination?.totalPages ?? 1);

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-900">Payroll Pension</h1>
        <label className="relative flex cursor-pointer items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700">
          <FiCalendar size={13} />
          {monthLabel(month)}
          <input
            type="month"
            value={month}
            onChange={(e) => {
              if (e.target.value) {
                setMonth(e.target.value);
                setPage(1);
              }
            }}
            className="absolute inset-0 cursor-pointer opacity-0"
            aria-label="Select month"
          />
        </label>
      </div>

      {error && <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}

      <div className="mt-6">
        <div className="grid grid-cols-[1fr_160px_100px] border-b border-slate-200 px-4 pb-3 text-xs text-slate-500">
          <span>PFAs</span>
          <span>Total Amount</span>
          <span className="text-right">Action</span>
        </div>
        {loading && <p className="px-4 py-10 text-center text-sm text-slate-400">Loading pension remittances…</p>}
        {!loading && rows.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-slate-400">No pension remittances for {monthLabel(month)}.</p>
        )}
        {!loading &&
          rows.map((r, idx) => {
            const id = pickText(r, ["id"]);
            const name = pickText(r, ["pfaName", "pfa", "name"]) ?? "Unnamed PFA";
            return (
              <div
                key={id ?? `${name}-${idx}`}
                className={`grid grid-cols-[1fr_160px_100px] items-center px-4 py-5 ${idx % 2 === 1 ? "bg-slate-50" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                    style={{ background: colorFor(name) }}
                  >
                    {initialsOf(name)}
                  </span>
                  <span className="text-sm text-slate-800">{name}</span>
                </div>
                <span className="text-sm text-slate-700">{naira(totalOf(r))}</span>
                <div className="text-right">
                  {id && (
                    <Link
                      href={`/payroll/pension/${encodeURIComponent(id)}`}
                      className="rounded bg-[#2183C6] px-5 py-1.5 text-xs font-medium text-white hover:opacity-90"
                    >
                      View
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-end gap-1 text-xs text-slate-500">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded border border-slate-300 p-1.5 disabled:opacity-40" aria-label="Previous page">
            <FiChevronLeft size={13} />
          </button>
          <span className="px-2">
            {page} / {totalPages}
          </span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="rounded border border-slate-300 p-1.5 disabled:opacity-40" aria-label="Next page">
            <FiChevronRight size={13} />
          </button>
        </div>
      )}
    </div>
  );
}