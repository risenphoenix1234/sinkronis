// src/components/payroll/payee-edit/SalaryBreakdownTab.tsx
"use client";

import { useState } from "react";
import { Field, inputCls, naira, primaryBtn } from "./ui";
import { getApiErrorMessage, updatePayrollPayee } from "@/lib/api/payroll";
import type { PayrollPayee } from "@/lib/api/types/payroll.types";

export default function SalaryBreakdownTab({ payee, onUpdated }: { payee: PayrollPayee; onUpdated: (p: PayrollPayee) => void }) {
  const isExternal = !payee.employeeId;
  const [amount, setAmount] = useState(String(payee.grossSalary ?? ""));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    const value = Number(amount.replace(/[^0-9.]/g, ""));
    if (!value) {
      setError("Enter a monthly amount greater than 0.");
      return;
    }
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const updated = await updatePayrollPayee(payee.id, { monthlyAmount: value });
      onUpdated(updated);
      setSaved(true);
    } catch (e) {
      setError(getApiErrorMessage(e, "Could not update the monthly amount."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="border-b border-slate-200 pb-4">
          <p className="text-xs text-slate-500">Gross Salary</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">{naira(payee.grossSalary ?? 0)}</p>
        </div>
        <div className="border-b border-slate-200 pb-4">
          <p className="text-xs text-slate-500">Tax</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">{naira(payee.taxAmount ?? 0)}</p>
        </div>
        <div className="border-b border-slate-200 pb-4">
          <p className="text-xs text-slate-500">Estimated Net Salary</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">{naira(payee.estimatedNetSalary ?? 0)}</p>
        </div>
      </div>

      {isExternal ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Monthly Amount">
              <input
                className={inputCls}
                placeholder="₦0"
                inputMode="numeric"
                value={amount}
                onChange={(e) => {
                  setSaved(false);
                  setAmount(e.target.value);
                }}
              />
            </Field>
          </div>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <div className="mt-6 flex items-center justify-end gap-3">
            {saved && <span className="text-sm text-green-600">Saved</span>}
            <button type="button" onClick={save} disabled={saving} className={`${primaryBtn} disabled:opacity-60`}>
              {saving ? "Saving..." : "Submit"}
            </button>
          </div>
        </>
      ) : (
        <p className="text-sm text-slate-500">This payee is a permanent employee, so the salary comes from their employee record.</p>
      )}
    </div>
  );
}