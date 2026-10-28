// src/components/payroll/payroll-settings/DeductionTypes.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createPayrollDeductionTypeItem,
  deleteDeductionTypeRow,
  getApiErrorMessage,
  getDeductionTypeRows,
} from "@/lib/api/payroll";
import type { PayrollSettingTypeRow } from "@/lib/api/types/payroll.types";
import Loader from "@/components/ui/Loader";

export default function DeductionTypes() {
  const [deductions, setDeductions] = useState<PayrollSettingTypeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await getDeductionTypeRows();
      setDeductions(rows.filter((r) => r.active !== false));
      setError("");
    } catch (e) {
      setError(getApiErrorMessage(e, "Could not load deduction types."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAddDeduction = async () => {
    if (name.trim().length < 2) return setError("Deduction name must be at least 2 characters.");
    setSaving(true);
    setError("");
    try {
      await createPayrollDeductionTypeItem(name.trim());
      setName("");
      setShowAddForm(false);
      await load();
    } catch (e) {
      setError(getApiErrorMessage(e, "Could not add this deduction type."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (deduction: PayrollSettingTypeRow) => {
    if (!window.confirm(`Remove ${deduction.name}?`)) return;
    try {
      await deleteDeductionTypeRow(deduction.id);
      await load();
    } catch (e) {
      setError(getApiErrorMessage(e, "Could not remove this deduction type."));
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold leading-7 text-[#25384b]">
            Deduction Types
          </h1>

          <p className="mt-1 text-sm leading-5 text-[#8091a1]">
            Manage the deduction categories that appear on payslips.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="flex h-9 items-center gap-2 rounded-md bg-[#2189cb] px-4 text-sm font-medium text-white transition hover:bg-[#197dbd]"
        >
          <span className="text-base leading-none">+</span>
          Add Type
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {/* Add form */}
      {showAddForm && (
        <div className="flex mt-5 rounded-md border border-[#e1e6ea] bg-white p-5">
          <div className="mt-4 gap-4 w-full">
            {/* Name */}
            <div>
              <label
                htmlFor="deduction-name"
                className="mb-2 block text-sm font-medium text-[#8191a1]"
              >
                Deduction Name
              </label>

              <input
                id="deduction-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Loan Repayment"
                className="h-10 w-full rounded-md border border-[#dce3e8] px-3 text-sm text-[#45596c] outline-none placeholder:text-[#a7b2bc] focus:border-[#2189cb] focus:ring-2 focus:ring-[#2189cb]/10"
              />
            </div>
          </div>

          {/* Form buttons */}
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleAddDeduction}
              disabled={saving}
              className="rounded-md bg-[#2189cb] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#197dbd] disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="rounded-md border border-[#dce3e8] bg-white px-4 py-2 text-sm font-medium text-[#53677a] transition hover:bg-[#f5f7f8]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="mt-5 overflow-hidden rounded-md border border-[#e1e6ea] bg-white">
        {/* Table header */}
        <div className="grid h-[34px] grid-cols-[1.4fr_1fr_80px] items-center border-b border-[#e5e8eb] px-4">
          <div className="text-sm font-medium text-[#8191a1]">
            Deduction Name
          </div>

          <div className="text-sm font-medium text-[#8191a1]">Type</div>

          <div className="text-sm font-medium text-[#8191a1]">Action</div>
        </div>

        {loading && (
          <Loader variant="section" label="Loading" />
        )}

        {!loading && deductions.length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-[#8191a1]">No deduction types yet.</div>
        )}

        {/* Table rows */}
        {!loading &&
          deductions.map((deduction, index) => {
            const statutory = deduction.category === "STATUTORY";
            return (
              <div
                key={deduction.id}
                className={`grid h-[43px] grid-cols-[1.4fr_1fr_80px] items-center px-4 ${
                  index % 2 === 0 ? "bg-white" : "bg-[#f1f2f6]"
                }`}
              >
                {/* Name */}
                <div className="text-sm font-medium text-[#29394a]">
                  {deduction.name}
                </div>

                {/* Type */}
                <div>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      statutory
                        ? "bg-[#ffe0e0] text-[#ff5757]"
                        : "bg-[#f2f5f7] text-[#718396]"
                    }`}
                  >
                    {statutory ? "Statutory" : "Voluntary"}
                  </span>
                </div>

                {/* Action */}
                <div>
                  {deduction.removable && (
                    <button
                      type="button"
                      onClick={() => handleDelete(deduction)}
                      aria-label={`Delete ${deduction.name}`}
                      className="text-base font-normal leading-none text-[#94a5b4] transition hover:text-[#d9534f]"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}