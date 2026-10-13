// src/app/payroll/pension/[slug]/page.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { FiCheck, FiSearch } from "react-icons/fi";
import {
  getApiErrorMessage,
  getPensionContributions,
  getPensionRemittance,
  remitPensionRemittance,
} from "@/lib/api/payroll";
import type { PayrollRecord } from "@/lib/api/types/payroll.types";
import { isRemittedStatus, monthLabel, pickNum, pickText } from "@/lib/payroll-pick";

const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;
const today = () => new Date().toISOString().slice(0, 10);

const inputCls =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-[#2183C6]";

export default function PfaDetailPage() {
  const params = useParams<{ slug: string }>();
  const id = decodeURIComponent(params.slug);

  const [remittance, setRemittance] = useState<PayrollRecord | null>(null);
  const [rows, setRows] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [reference, setReference] = useState("");
  const [remittedAt, setRemittedAt] = useState(today);
  const [receipt, setReceipt] = useState("");
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const r = await getPensionRemittance(id);
      setRemittance(r);
      const pfa = pickText(r, ["pfaName", "pfa", "name"]);
      const period = pickText(r, ["period"]);
      const list = await getPensionContributions({
        pfa: pfa ?? undefined,
        period: period ?? undefined,
        limit: 100,
      });
      setRows(list.items);
    } catch (e) {
      setError(getApiErrorMessage(e, "Could not load this PFA."));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => !q || (pickText(r, ["employeeName", "name", "employee"]) ?? "").toLowerCase().includes(q));
  }, [rows, search]);

  if (loading && !remittance) return <div className="p-6 text-sm text-slate-400">Loading…</div>;
  if (!remittance) return <div className="p-6 text-sm text-red-600">{error || "Remittance not found."}</div>;

  const pfaName = pickText(remittance, ["pfaName", "pfa", "name"]) ?? "PFA";
  const period = pickText(remittance, ["period"]);
  const status = pickText(remittance, ["status"]);
  const remitted = isRemittedStatus(status);
  const total =
    pickNum(remittance, ["totalAmount", "totalContribution", "total"]) ??
    (pickNum(remittance, ["employeeContribution", "employeePension"]) ?? 0) +
      (pickNum(remittance, ["employerContribution", "employerPension"]) ?? 0);

  const submit = async () => {
    if (!reference.trim()) {
      setFormError("Enter the payment reference.");
      return;
    }
    setBusy(true);
    setFormError("");
    try {
      await remitPensionRemittance(id, {
        paymentReference: reference.trim(),
        remittedAt,
        receiptReference: receipt.trim() || undefined,
      });
      setConfirmOpen(false);
      setNotice("Pension remittance recorded.");
      setReference("");
      setReceipt("");
      await load();
    } catch (e) {
      setFormError(getApiErrorMessage(e, "Could not record this remittance."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-900">{pfaName} (PFAs)</h1>
        <div className="flex items-center gap-3">
          {period && (
            <span className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700">
              {/^\d{4}-\d{2}$/.test(period) ? monthLabel(period) : period}
            </span>
          )}
          <button
            disabled={remitted}
            onClick={() => {
              setFormError("");
              setConfirmOpen(true);
            }}
            className="rounded-md bg-[#2183C6] px-4 py-2 text-xs font-medium text-white hover:opacity-90 disabled:opacity-40"
          >
            Pay Pension
          </button>
        </div>
      </div>

      {notice && <p className="mt-2 text-xs text-green-600">{notice}</p>}
      {error && <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}

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
              <th className="py-3 font-medium">RSA Pin</th>
              <th className="py-3 font-medium">Pension Amount</th>
              <th className="py-3 font-medium">Payer Contribution</th>
              <th className="py-3 font-medium">Payee Contribution</th>
              <th className="py-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-400">No payees found.</td>
              </tr>
            )}
            {filtered.map((r, idx) => {
              const employee = pickNum(r, ["employeeContribution", "employeePension"]) ?? 0;
              const employer = pickNum(r, ["employerContribution", "employerPension"]) ?? 0;
              const amount = pickNum(r, ["total", "totalContribution"]) ?? employee + employer;
              return (
                <tr key={pickText(r, ["id", "employeeId"]) ?? idx} className={idx % 2 === 1 ? "bg-slate-50" : ""}>
                  <td className="py-4 text-slate-800">{pickText(r, ["employeeName", "name", "employee"]) ?? "-"}</td>
                  <td className="py-4 text-slate-700">{pickText(r, ["pensionPin", "rsaPin", "pin"]) ?? "-"}</td>
                  <td className="py-4 text-slate-700">{naira(amount)}</td>
                  <td className="py-4 text-slate-700">{naira(employer)}</td>
                  <td className="py-4 text-slate-700">{naira(employee)}</td>
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
              );
            })}
          </tbody>
        </table>
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onMouseDown={() => !busy && setConfirmOpen(false)}>
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl" onMouseDown={(e) => e.stopPropagation()}>
            <div className="text-center">
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#2183C6]/10 text-[#2183C6]">
                <FiCheck size={20} />
              </span>
              <p className="mt-3 text-sm font-medium text-slate-900">Record pension payment to {pfaName}?</p>
              <p className="mt-1 text-xs text-slate-500">{naira(total)} will be marked as remitted.</p>
            </div>
            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-slate-700">Payment reference</span>
                <input className={inputCls} value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Bank transfer reference" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-slate-700">Date paid</span>
                <input type="date" className={inputCls} value={remittedAt} onChange={(e) => setRemittedAt(e.target.value)} />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-slate-700">Receipt reference (optional)</span>
                <input className={inputCls} value={receipt} onChange={(e) => setReceipt(e.target.value)} />
              </label>
            </div>
            {formError && <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">{formError}</p>}
            <div className="mt-5 flex justify-center gap-3">
              <button disabled={busy} onClick={() => setConfirmOpen(false)} className="rounded bg-slate-100 px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 disabled:opacity-50">
                Cancel
              </button>
              <button disabled={busy} onClick={submit} className="rounded bg-[#2183C6] px-4 py-1.5 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50">
                {busy ? "Saving…" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}