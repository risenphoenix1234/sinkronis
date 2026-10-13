// src/app/payroll/tax/[slug]/page.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { FiCalendar, FiCheck, FiSearch } from "react-icons/fi";
import {
  getApiErrorMessage,
  getPayrollWalletObligations,
  getTaxEmployeesByState,
  getTaxRemittances,
  payPayrollWalletObligation,
} from "@/lib/api/payroll";
import type { PayrollRecord } from "@/lib/api/types/payroll.types";
import { currentMonth, isRemittedStatus, monthLabel, pickNum, pickText } from "@/lib/payroll-pick";

const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;

export default function StateTaxDetailPage() {
  const params = useParams<{ slug: string }>();
  const state = decodeURIComponent(params.slug);

  const [month, setMonth] = useState(currentMonth);
  const [rows, setRows] = useState<PayrollRecord[]>([]);
  const [remittance, setRemittance] = useState<PayrollRecord | null>(null);
  const [obligationId, setObligationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [payError, setPayError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [emp, rem, obl] = await Promise.all([
        getTaxEmployeesByState({ state, period: month, limit: 100 }),
        getTaxRemittances({ state, period: month, limit: 5 }),
        getPayrollWalletObligations({ limit: 100 }),
      ]);
      setRows(emp.employees);
      const r = rem.items[0] ?? null;
      setRemittance(r);
      const rid = r ? pickText(r, ["id", "remittanceId"]) : null;
      const match = rid
        ? (obl.data ?? []).find((o) => o.obligationType === "PAYE_REMITTANCE" && o.sourceId === rid)
        : undefined;
      setObligationId(match?.id ?? null);
    } catch (e) {
      setError(getApiErrorMessage(e, "Could not load this state."));
    } finally {
      setLoading(false);
    }
  }, [state, month]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => !q || (pickText(r, ["employeeName", "name"]) ?? "").toLowerCase().includes(q));
  }, [rows, search]);

  const remitted = isRemittedStatus(remittance ? pickText(remittance, ["status"]) : null);
  const amount = remittance
    ? (pickNum(remittance, ["amount", "payeAmount"]) ?? 0)
    : rows.reduce((s, r) => s + (pickNum(r, ["payeAmount", "amount", "paye"]) ?? 0), 0);

  const pay = async () => {
    if (!obligationId) return;
    setBusy(true);
    setPayError("");
    try {
      await payPayrollWalletObligation(obligationId);
      setConfirmOpen(false);
      setNotice("Tax paid from the payroll wallet.");
      await load();
    } catch (e) {
      setPayError(getApiErrorMessage(e, "Could not pay this tax."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-900">{state}</h1>
        <div className="flex items-center gap-3">
          <label className="relative flex cursor-pointer items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700">
            <FiCalendar size={13} />
            {monthLabel(month)}
            <input
              type="month"
              value={month}
              onChange={(e) => e.target.value && setMonth(e.target.value)}
              className="absolute inset-0 cursor-pointer opacity-0"
              aria-label="Select month"
            />
          </label>
          <button
            disabled={remitted || !obligationId || loading}
            onClick={() => {
              setPayError("");
              setConfirmOpen(true);
            }}
            className="rounded-md bg-[#2183C6] px-4 py-2 text-xs font-medium text-white hover:opacity-90 disabled:opacity-40"
          >
            Pay Tax
          </button>
        </div>
      </div>

      {notice && <p className="mt-2 text-xs text-green-600">{notice}</p>}
      {error && <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}
      {!loading && !remittance && rows.length > 0 && (
        <p className="mt-2 text-xs text-slate-500">No tax remittance has been generated for {monthLabel(month)} yet.</p>
      )}
      {!loading && remittance && !remitted && !obligationId && (
        <p className="mt-2 text-xs text-slate-500">This remittance has no payable obligation in the wallet yet.</p>
      )}

      <div className="relative mt-5 w-full max-w-xs">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Payee"
          className="w-full rounded-md border border-slate-300 py-1.5 pl-9 pr-3 text-xs outline-none focus:border-[#2183C6]"
        />
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-xs text-slate-500">
            <tr>
              <th className="py-3 font-medium">Employee</th>
              <th className="py-3 font-medium">Tax ID</th>
              <th className="py-3 font-medium">Gross Salary</th>
              <th className="py-3 font-medium">Tax Amount</th>
              <th className="py-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-slate-400">Loading…</td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-slate-400">No payees found.</td>
              </tr>
            )}
            {!loading &&
              filtered.map((r, idx) => (
                <tr key={pickText(r, ["id", "employeeId"]) ?? idx} className={idx % 2 === 1 ? "bg-slate-50" : ""}>
                  <td className="py-4 text-slate-800">{pickText(r, ["employeeName", "name"]) ?? "-"}</td>
                  <td className="py-4 text-slate-700">{pickText(r, ["tin", "taxIdentificationNumber", "taxId"]) ?? "-"}</td>
                  <td className="py-4 text-slate-700">{naira(pickNum(r, ["grossPay", "grossSalary", "gross", "taxableIncome"]) ?? 0)}</td>
                  <td className="py-4 text-slate-700">{naira(pickNum(r, ["payeAmount", "amount", "paye"]) ?? 0)}</td>
                  <td className="py-4 text-right">
                    <span
                      className={`rounded border px-2.5 py-1 text-[11px] font-medium ${
                        remitted ? "border-green-300 bg-green-50 text-green-600" : "border-red-300 text-red-500"
                      }`}
                    >
                      {remitted ? "Remitted" : "Not Remitted"}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onMouseDown={() => !busy && setConfirmOpen(false)}>
          <div className="w-full max-w-sm rounded-lg bg-white p-6 text-center shadow-xl" onMouseDown={(e) => e.stopPropagation()}>
            <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#2183C6]/10 text-[#2183C6]">
              <FiCheck size={20} />
            </span>
            <p className="mt-3 text-sm font-medium text-slate-900">Pay tax for {monthLabel(month)}?</p>
            <p className="mt-1 text-xs text-slate-500">
              {naira(amount)} will be paid to {state} from the payroll wallet.
            </p>
            {payError && <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">{payError}</p>}
            <div className="mt-5 flex justify-center gap-3">
              <button disabled={busy} onClick={() => setConfirmOpen(false)} className="rounded bg-slate-100 px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 disabled:opacity-50">
                Cancel
              </button>
              <button disabled={busy} onClick={pay} className="rounded bg-[#2183C6] px-4 py-1.5 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50">
                {busy ? "Paying…" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}