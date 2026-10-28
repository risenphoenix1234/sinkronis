// src/components/payroll/payee-edit/PayrollHistoryTab.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { fmtLongDate, naira } from "./ui";
import { dateOnly, downloadBlob } from "./utils";
import { exportPayeePaymentHistory, getApiErrorMessage, getPayeePaymentHistory } from "@/lib/api/payroll";
import { pickNum, pickText } from "@/lib/payroll-pick";
import type { PayrollPagination, PayrollRecord } from "@/lib/api/types/payroll.types";
import Loader from "@/components/ui/Loader";

type Row = { id: string; date: string; amount: number; bonus: number; pension: number; deductions: number };
type SortKey = "date" | "amount" | "bonus" | "pension";

const columns: { key: SortKey; label: string }[] = [
  { key: "date", label: "Pay Date" },
  { key: "amount", label: "Amount" },
  { key: "bonus", label: "Total Bonus" },
  { key: "pension", label: "Total Pension" },
];

const toRow = (r: PayrollRecord, idx: number): Row => ({
  id: String(r.id ?? idx),
  date: dateOnly(pickText(r, ["payDate", "paidAt", "paymentDate", "periodEnd", "createdAt"])),
  amount: pickNum(r, ["netAmount", "netPay", "amount"]) ?? 0,
  bonus: pickNum(r, ["bonus", "totalBonus"]) ?? 0,
  pension: pickNum(r, ["employeePension", "pension", "totalPension"]) ?? 0,
  deductions:
    pickNum(r, ["totalDeductions", "deductions"]) ??
    (pickNum(r, ["paye"]) ?? 0) + (pickNum(r, ["wht"]) ?? 0) + (pickNum(r, ["loans"]) ?? 0) + (pickNum(r, ["customDeductions"]) ?? 0),
});

export default function PayrollHistoryTab({ payeeId }: { payeeId: string }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [pagination, setPagination] = useState<PayrollPagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 } | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    getPayeePaymentHistory(payeeId, { page, limit: 20, sortOrder: "desc" })
      .then((res) => {
        if (cancelled) return;
        setRows(res.items.map(toRow));
        setPagination(res.pagination);
      })
      .catch((e) => {
        if (!cancelled) setError(getApiErrorMessage(e, "Could not load payroll history."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [payeeId, page]);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    return [...rows].sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      return (av < bv ? -1 : av > bv ? 1 : 0) * sort.dir;
    });
  }, [rows, sort]);

  const toggle = (key: SortKey) =>
    setSort((s) => (s?.key === key ? { key, dir: (s.dir * -1) as 1 | -1 } : { key, dir: 1 }));

  const exportCsv = async () => {
    try {
      downloadBlob(await exportPayeePaymentHistory(payeeId), "payee-payroll-history.csv");
    } catch (e) {
      setError(getApiErrorMessage(e, "Could not export payroll history."));
    }
  };

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <button
          onClick={exportCsv}
          className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          Export CSV <FiDownload size={13} />
        </button>
      </div>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      <table className="w-full text-left text-sm">
        <thead className="text-xs text-slate-500">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="cursor-pointer select-none py-3 font-medium" onClick={() => toggle(c.key)}>
                {c.label} <span className="text-slate-400">{sort?.key === c.key ? (sort.dir === 1 ? "↑" : "↓") : "↕"}</span>
              </th>
            ))}
            <th className="py-3 font-medium">Total Deductions</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={5} className="py-10 text-center text-slate-400"><Loader variant="inline" label="Loading" /></td>
            </tr>
          )}
          {!loading && sorted.length === 0 && (
            <tr>
              <td colSpan={5} className="py-10 text-center text-slate-400">No payments yet.</td>
            </tr>
          )}
          {!loading &&
            sorted.map((r, idx) => (
              <tr key={r.id} className={idx % 2 === 1 ? "bg-slate-50" : ""}>
                <td className="py-3 text-slate-700">{fmtLongDate(r.date)}</td>
                <td className="py-3 text-slate-700">{naira(r.amount)}</td>
                <td className="py-3 text-slate-700">{naira(r.bonus)}</td>
                <td className="py-3 text-slate-700">{naira(r.pension)}</td>
                <td className="py-3 text-slate-700">{naira(r.deductions)}</td>
              </tr>
            ))}
        </tbody>
      </table>
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-end gap-3 text-sm">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-md border border-slate-300 px-3 py-1 disabled:opacity-40">
            Prev
          </button>
          <span className="text-slate-500">
            {page} / {pagination.totalPages}
          </span>
          <button
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-md border border-slate-300 px-3 py-1 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}