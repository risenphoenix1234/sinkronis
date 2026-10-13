// src/components/payroll/deductions/AddLoanModal.tsx
"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/payroll/payee-edit/Modal";
import { Field, ghostBtn, inputCls, primaryBtn } from "@/components/payroll/payee-edit/ui";
import { todayIso } from "@/components/payroll/payee-edit/utils";
import { createPayrollLoan, fetchPayrollEmployees, getApiErrorMessage } from "@/lib/api/payroll";
import type { PayrollEmployeeListItem } from "@/lib/api/types/payroll.types";

const emptyForm = {
  employeeId: "",
  purpose: "",
  originalPrincipal: "",
  openingOutstanding: "",
  externalDisbursementDate: todayIso(),
  repaymentType: "RECURRING",
  recoveryStartDate: todayIso(),
  monthlyRepayment: "",
  notes: "",
  attested: false,
};

const toNumber = (v: string) => Number(v.replace(/[^0-9.]/g, ""));

export default function AddLoanModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) {
  const [employees, setEmployees] = useState<PayrollEmployeeListItem[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setForm({ ...emptyForm, externalDisbursementDate: todayIso(), recoveryStartDate: todayIso() });
    setError("");
    fetchPayrollEmployees({ limit: 100 })
      .then((res) => setEmployees(res.employees))
      .catch(() => setEmployees([]));
  }, [open]);

  const set = (k: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    const principal = toNumber(form.originalPrincipal);
    const outstanding = form.openingOutstanding.trim() === "" ? principal : toNumber(form.openingOutstanding);
    const monthly = toNumber(form.monthlyRepayment);
    if (!form.employeeId) return setError("Select an employee.");
    if (form.purpose.trim().length < 2) return setError("Enter the purpose of the loan.");
    if (!principal) return setError("Enter the loan amount.");
    if (outstanding > principal) return setError("Outstanding balance cannot be more than the loan amount.");
    if (form.repaymentType === "RECURRING" && !monthly) return setError("Enter the monthly repayment.");
    if (!form.attested) return setError("Please confirm the attestation.");
    setSaving(true);
    setError("");
    try {
      await createPayrollLoan({
        employeeId: form.employeeId,
        purpose: form.purpose.trim(),
        originalPrincipal: principal,
        openingOutstanding: outstanding,
        externalDisbursementDate: form.externalDisbursementDate,
        repaymentType: form.repaymentType as "RECURRING" | "ONE_OFF",
        recoveryStartDate: form.recoveryStartDate,
        ...(form.repaymentType === "RECURRING" ? { monthlyRepayment: monthly } : {}),
        ...(form.notes.trim() ? { notes: form.notes.trim() } : {}),
        currency: "NGN",
        attestation: true,
      });
      onCreated();
      onClose();
    } catch (e) {
      setError(getApiErrorMessage(e, "Could not add this loan."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} title="Add Loan" onClose={onClose}>
      <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
        <Field label="Employee">
          <select className={inputCls} value={form.employeeId} onChange={set("employeeId")}>
            <option value="">-select employee-</option>
            {employees.map((e) => (
              <option key={e.employeeId} value={e.employeeId}>
                {e.fullName}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Purpose">
          <input className={inputCls} placeholder="-input purpose-" value={form.purpose} onChange={set("purpose")} />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Loan Amount">
            <input className={inputCls} placeholder="₦0" inputMode="numeric" value={form.originalPrincipal} onChange={set("originalPrincipal")} />
          </Field>
          <Field label="Outstanding Balance">
            <input className={inputCls} placeholder="Same as loan amount" inputMode="numeric" value={form.openingOutstanding} onChange={set("openingOutstanding")} />
          </Field>
          <Field label="Date Disbursed">
            <input type="date" className={inputCls} value={form.externalDisbursementDate} onChange={set("externalDisbursementDate")} />
          </Field>
          <Field label="Recovery Starts">
            <input type="date" className={inputCls} value={form.recoveryStartDate} onChange={set("recoveryStartDate")} />
          </Field>
          <Field label="Repayment Type">
            <select className={inputCls} value={form.repaymentType} onChange={set("repaymentType")}>
              <option value="RECURRING">Monthly</option>
              <option value="ONE_OFF">One-off</option>
            </select>
          </Field>
          {form.repaymentType === "RECURRING" && (
            <Field label="Monthly Repayment">
              <input className={inputCls} placeholder="₦0" inputMode="numeric" value={form.monthlyRepayment} onChange={set("monthlyRepayment")} />
            </Field>
          )}
        </div>
        <Field label="Notes (optional)">
          <textarea className={`${inputCls} h-20 resize-none`} value={form.notes} onChange={set("notes")} />
        </Field>
        <label className="flex items-start gap-2 text-xs text-slate-600">
          <input
            type="checkbox"
            checked={form.attested}
            onChange={(e) => setForm((f) => ({ ...f, attested: e.target.checked }))}
            className="mt-0.5"
          />
          I confirm this loan was disbursed outside Sinkronis and the details above are correct.
        </label>
      </div>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onClose} className={ghostBtn}>Cancel</button>
        <button onClick={submit} disabled={saving} className={`${primaryBtn} disabled:opacity-60`}>
          {saving ? "Saving..." : "Add Loan"}
        </button>
      </div>
    </Modal>
  );
}