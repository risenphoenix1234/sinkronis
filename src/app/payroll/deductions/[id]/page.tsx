// src/app/payroll/deductions/[id]/page.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FiArrowLeft, FiDownload } from "react-icons/fi";
import LoanStatusBadge from "@/components/payroll/deductions/LoanStatusBadge";
import Modal from "@/components/payroll/payee-edit/Modal";
import { Field, ghostBtn, inputCls, primaryBtn } from "@/components/payroll/payee-edit/ui";
import { downloadBlob } from "@/components/payroll/payee-edit/utils";
import {
  adjustPayrollLoanRepayment,
  closePayrollLoanEarly,
  exportPayrollLoanSchedule,
  getApiErrorMessage,
  getLoanDetail,
  pausePayrollLoan,
  resumePayrollLoan,
} from "@/lib/api/payroll";
import { pickNum, pickText } from "@/lib/payroll-pick";
import type { PayrollRecord } from "@/lib/api/types/payroll.types";

const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;
const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }) : "-";

export default function LoanDetailPage() {
  const params = useParams<{ id: string }>();
  const [loan, setLoan] = useState<PayrollRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [adjusting, setAdjusting] = useState(false);
  const [newAmount, setNewAmount] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setLoan(await getLoanDetail(params.id));
    } catch (e) {
      setError(getApiErrorMessage(e, "Could not load this loan."));
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    load();
  }, [load]);

  const run = async (action: () => Promise<unknown>, failure: string) => {
    setBusy(true);
    setError("");
    try {
      await action();
      await load();
    } catch (e) {
      setError(getApiErrorMessage(e, failure));
    } finally {
      setBusy(false);
    }
  };

  const status = pickText(loan, ["status"]);
  const emp = loan?.employee as PayrollRecord | undefined;
  const name = pickText(loan, ["employeeName", "fullName", "displayName"]) ?? pickText(emp, ["fullName", "name", "displayName"]) ?? "Loan";
  const monthly = loan ? pickNum(loan, ["monthlyRepayment"]) : null;
  const isActive = status === "ACTIVE";
  const isPaused = status === "PAUSED";

  const submitAdjust = async () => {
    const value = Number(newAmount.replace(/[^0-9.]/g, ""));
    if (!value) return setError("Enter a monthly repayment greater than 0.");
    setAdjusting(false);
    await run(() => adjustPayrollLoanRepayment(params.id, value), "Could not adjust the repayment.");
  };

  const exportSchedule = async () => {
    try {
      downloadBlob(await exportPayrollLoanSchedule(params.id), "loan-schedule.csv");
    } catch (e) {
      setError(getApiErrorMessage(e, "Could not export the schedule."));
    }
  };

  const tiles = loan
    ? [
        { label: "Loan Amount", value: naira(pickNum(loan, ["originalPrincipal", "principalAmount"]) ?? 0) },
        { label: "Outstanding", value: naira(pickNum(loan, ["outstandingAmount"]) ?? 0) },
        { label: "Repaid", value: naira(pickNum(loan, ["repaidAmount"]) ?? 0) },
        { label: "Monthly Repayment", value: monthly === null ? "-" : naira(monthly) },
      ]
    : [];

  const details: [string, string][] = loan
    ? [
        ["Purpose", pickText(loan, ["purpose"]) ?? "-"],
        ["Repayment Type", loan.repaymentType === "ONE_OFF" ? "One-off" : "Monthly"],
        ["Date Disbursed", fmtDate(pickText(loan, ["externalDisbursementDate"]))],
        ["Recovery Starts", fmtDate(pickText(loan, ["recoveryStartDate"]))],
        ["Reference", pickText(loan, ["externalReference"]) ?? "-"],
        ["Notes", pickText(loan, ["notes"]) ?? "-"],
      ]
    : [];

  return (
    <div className="p-6">
      <Link href="/payroll/deductions" className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800">
        <FiArrowLeft size={13} /> Back to Loan Deductions
      </Link>

      {loading && !loan && <p className="mt-6 text-sm text-slate-400">Loading loan…</p>}
      {error && <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}

      {loan && (
        <>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">{name}</h1>
              <p className="mt-1">
                <LoanStatusBadge status={status} />
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={exportSchedule} className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
                Export Schedule <FiDownload size={13} />
              </button>
              {(isActive || isPaused) && loan.repaymentType !== "ONE_OFF" && (
                <button
                  disabled={busy}
                  onClick={() => {
                    setNewAmount(monthly === null ? "" : String(monthly));
                    setAdjusting(true);
                  }}
                  className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Adjust Repayment
                </button>
              )}
              {isActive && (
                <button
                  disabled={busy}
                  onClick={() => run(() => pausePayrollLoan(params.id), "Could not pause this loan.")}
                  className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Pause
                </button>
              )}
              {isPaused && (
                <button
                  disabled={busy}
                  onClick={() => run(() => resumePayrollLoan(params.id), "Could not resume this loan.")}
                  className="rounded-md bg-[#2183C6] px-3 py-2 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
                >
                  Resume
                </button>
              )}
              {(isActive || isPaused) && (
                <button
                  disabled={busy}
                  onClick={() => {
                    if (window.confirm("Close this loan early? This stops all further deductions.")) {
                      run(() => closePayrollLoanEarly(params.id), "Could not close this loan.");
                    }
                  }}
                  className="rounded-md border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  Close Early
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {tiles.map((t) => (
              <div key={t.label} className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                <p className="text-xs text-slate-500">{t.label}</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{t.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 max-w-2xl rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Loan Details</h2>
            <dl className="divide-y divide-slate-100">
              {details.map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-6 py-2.5 text-sm">
                  <dt className="text-slate-500">{label}</dt>
                  <dd className="text-right font-medium text-slate-800">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </>
      )}

      <Modal open={adjusting} title="Adjust Repayment" onClose={() => setAdjusting(false)}>
        <Field label="New Monthly Repayment">
          <input className={inputCls} placeholder="₦0" inputMode="numeric" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} />
        </Field>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={() => setAdjusting(false)} className={ghostBtn}>Cancel</button>
          <button onClick={submitAdjust} className={primaryBtn}>Save</button>
        </div>
      </Modal>
    </div>
  );
}