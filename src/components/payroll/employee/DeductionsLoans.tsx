"use client";

import { useState } from "react";
import AddLoanModal from "./AddLoanModal";

type CustomDeduction = {
  name: string;
  amount: string;
};

export default function DeductionsLoans() {
  const [addLoanOpen, setAddLoanOpen] = useState(false);
  const [customDeductions, setCustomDeductions] = useState<CustomDeduction[]>([
    {
      name: "Collect",
      amount: "10000",
    },
  ]);

  const addDeduction = () => {
    setCustomDeductions((prev) => [
      ...prev,
      {
        name: "",
        amount: "",
      },
    ]);
  };

  const removeDeduction = (index: number) => {
    setCustomDeductions((prev) =>
      prev.filter((_, deductionIndex) => deductionIndex !== index),
    );
  };

  const updateDeduction = (
    index: number,
    field: keyof CustomDeduction,
    value: string,
  ) => {
    setCustomDeductions((prev) =>
      prev.map((deduction, deductionIndex) =>
        deductionIndex === index
          ? {
              ...deduction,
              [field]: value,
            }
          : deduction,
      ),
    );
  };

  return (
    <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1.05fr_1fr]">
      {/* ================================================================ */}
      {/* LEFT COLUMN */}
      {/* ================================================================ */}

      <div className="space-y-5">
        {/* ============================================================ */}
        {/* TAX & STATUTORY IDS */}
        {/* ============================================================ */}

        <section className="rounded border border-[#E5E7EB] bg-white">
          <div className="px-5 py-5 sm:px-6">
            <h2 className="text-sm font-semibold text-[#263342]">
              Tax & Statutory IDs
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              {/* Tax ID */}

              <div>
                <label className="mb-2 block text-[11px] font-medium text-[#667085]">
                  Tax ID (TIN)
                </label>

                <input
                  type="text"
                  defaultValue="1234567-0007"
                  className="h-9 w-full rounded border border-[#D0D5DD] bg-white px-2.5 text-xs text-[#263342] outline-none transition focus:border-[#1683D8] focus:ring-1 focus:ring-[#1683D8]"
                />
              </div>

              {/* Pension PIN */}

              <div>
                <label className="mb-2 block text-[11px] font-medium text-[#667085]">
                  Pension PIN
                </label>

                <input
                  type="text"
                  defaultValue="PENI00078901"
                  className="h-9 w-full rounded border border-[#D0D5DD] bg-white px-2.5 text-xs text-[#263342] outline-none transition focus:border-[#1683D8] focus:ring-1 focus:ring-[#1683D8]"
                />
              </div>

              {/* NHF Number */}

              <div>
                <label className="mb-2 block text-[11px] font-medium text-[#667085]">
                  NHF Number
                </label>

                <input
                  type="text"
                  defaultValue="NHF/007/2022"
                  className="h-9 w-full rounded border border-[#D0D5DD] bg-white px-2.5 text-xs text-[#263342] outline-none transition focus:border-[#1683D8] focus:ring-1 focus:ring-[#1683D8]"
                />
              </div>

              {/* PFA Name */}

              <div>
                <label className="mb-2 block text-[11px] font-medium text-[#667085]">
                  PFA Name
                </label>

                <input
                  type="text"
                  defaultValue="Leadway Pension"
                  className="h-9 w-full rounded border border-[#D0D5DD] bg-white px-2.5 text-xs text-[#263342] outline-none transition focus:border-[#1683D8] focus:ring-1 focus:ring-[#1683D8]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* CUSTOM DEDUCTIONS */}
        {/* ============================================================ */}

        <section className="rounded border border-[#E5E7EB] bg-white">
          <div className="px-5 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#263342]">
                Custom Deductions
              </h2>

              <button
                type="button"
                onClick={addDeduction}
                className="text-xs font-medium text-[#1683D8] hover:text-[#0F6FB8]"
              >
                + Add
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {customDeductions.map((deduction, index) => (
                <div key={index} className="flex items-center gap-2">
                  {/* Deduction name */}

                  <input
                    type="text"
                    value={deduction.name}
                    onChange={(e) =>
                      updateDeduction(index, "name", e.target.value)
                    }
                    placeholder="Deduction name"
                    className="h-9 min-w-0 flex-1 rounded border border-[#D0D5DD] px-2.5 text-xs text-[#263342] outline-none transition placeholder:text-[#98A2B3] focus:border-[#1683D8] focus:ring-1 focus:ring-[#1683D8]"
                  />

                  {/* Amount */}

                  <input
                    type="text"
                    value={deduction.amount}
                    onChange={(e) =>
                      updateDeduction(index, "amount", e.target.value)
                    }
                    placeholder="Amount"
                    className="h-9 w-[105px] rounded border border-[#D0D5DD] px-2.5 text-xs text-[#263342] outline-none transition placeholder:text-[#98A2B3] focus:border-[#1683D8] focus:ring-1 focus:ring-[#1683D8]"
                  />

                  {/* Remove */}

                  <button
                    type="button"
                    onClick={() => removeDeduction(index)}
                    className="flex h-8 w-6 items-center justify-center text-sm text-[#98A2B3] transition hover:text-[#EF4444]"
                    aria-label="Remove deduction"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SAVE */}
        {/* ============================================================ */}

        <button
          type="button"
          className="h-10 rounded bg-[#1683D8] px-4 text-xs font-semibold text-white transition hover:bg-[#1174C2]"
        >
          Save
        </button>
      </div>

      {/* ================================================================ */}
      {/* RIGHT COLUMN — LOANS & ADVANCES */}
      {/* ================================================================ */}

      <section className="rounded border border-[#E5E7EB] bg-white">
        {/* Header */}

        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-3">
          <h2 className="text-sm font-semibold text-[#263342]">
            Loans & Advances
          </h2>

          <button
            type="button"
            onClick={() => setAddLoanOpen(true)}
            className="rounded bg-[#1683D8] px-3.5 py-2 text-xs font-medium text-white transition hover:bg-[#1174C2]"
          >
            + Add Loan
          </button>
        </div>

        {/* Loan card */}

        <div className="p-3">
          <div className="rounded border border-[#E5E7EB] bg-white px-4 py-4">
            {/* Loan title */}

            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xs font-semibold text-[#263342]">
                  car loan
                </h3>

                <p className="mt-1 text-[10px] text-[#667085]">
                  Started 2000-12-12 · ₦1,000/mo
                </p>
              </div>

              <span className="rounded-full bg-[#DCFCE7] px-3 py-1 text-[10px] font-medium text-[#15803D]">
                Active
              </span>
            </div>

            {/* Loan details */}

            <div className="mt-3 grid grid-cols-3 gap-4">
              <div>
                <p className="text-[9px] text-[#98A2B3]">Principal</p>

                <p className="mt-1 text-xs font-semibold text-[#263342]">
                  ₦10,000
                </p>
              </div>

              <div>
                <p className="text-[9px] text-[#98A2B3]">Outstanding</p>

                <p className="mt-1 text-xs font-semibold text-[#EF4444]">
                  ₦10,000
                </p>
              </div>

              <div>
                <p className="text-[9px] text-[#98A2B3]">Repaid</p>

                <p className="mt-1 text-xs font-semibold text-[#15803D]">₦0</p>
              </div>
            </div>

            {/* Progress bar */}

            <div className="mt-3 h-1 rounded-full bg-[#F2F4F7]">
              <div className="h-1 w-0 rounded-full bg-[#1683D8]" />
            </div>
          </div>
        </div>
      </section>
      <AddLoanModal open={addLoanOpen} onClose={() => setAddLoanOpen(false)} />
    </div>
  );
}
