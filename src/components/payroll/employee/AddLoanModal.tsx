"use client";

import { X } from "lucide-react";
import { useState } from "react";

type AddLoanModalProps = {
  open: boolean;
  onClose: () => void;
};

type LoanType = "Recurring" | "One-off";

export default function AddLoanModal({ open, onClose }: AddLoanModalProps) {
  const [loanType, setLoanType] = useState<LoanType>("Recurring");

  const [formData, setFormData] = useState({
    purpose: "",
    principal: "",
    monthlyRepayment: "",
    startDate: "",
  });

  if (!open) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log({
      ...formData,
      loanType,
    });

    // Add your API/Redux dispatch here

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      {/* Modal */}
      <div className="w-full max-w-[390px] rounded-md bg-white shadow-xl">
        {/* ============================================================
            HEADER
        ============================================================ */}

        <div className="flex items-center justify-between px-8 pt-8">
          <h2 className="text-lg font-semibold text-[#263342]">
            Add Loan / Advance
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="text-[#667085] transition hover:text-[#263342]"
          >
            <X size={18} strokeWidth={1.8} />
          </button>
        </div>

        {/* ============================================================
            FORM
        ============================================================ */}

        <form onSubmit={handleSubmit} className="px-8 pb-8 pt-6">
          {/* Purpose */}

          <div>
            <label
              htmlFor="purpose"
              className="mb-2 block text-sm font-medium text-[#667085]"
            >
              Purpose <span className="text-[#EF4444]">*</span>
            </label>

            <input
              id="purpose"
              name="purpose"
              type="text"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="e.g. Car Loan"
              required
              className="h-10 w-full rounded border border-[#D0D5DD] px-3 text-sm text-[#263342] outline-none placeholder:text-[#98A2B3] focus:border-[#1683D8] focus:ring-1 focus:ring-[#1683D8]"
            />
          </div>

          {/* Loan Type */}

          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-[#667085]">
              Loan Type
            </label>

            <div className="grid grid-cols-2 overflow-hidden rounded border border-[#D0D5DD]">
              <button
                type="button"
                onClick={() => setLoanType("Recurring")}
                className={`h-9 text-sm font-medium transition ${
                  loanType === "Recurring"
                    ? "bg-[#1683D8] text-white"
                    : "bg-white text-[#667085] hover:bg-[#F8F9FA]"
                }`}
              >
                Recurring
              </button>

              <button
                type="button"
                onClick={() => setLoanType("One-off")}
                className={`h-9 border-l border-[#D0D5DD] text-sm font-medium transition ${
                  loanType === "One-off"
                    ? "bg-[#1683D8] text-white"
                    : "bg-white text-[#667085] hover:bg-[#F8F9FA]"
                }`}
              >
                One-off
              </button>
            </div>

            {loanType === "Recurring" && (
              <p className="mt-1.5 text-xs text-[#98A2B3]">
                Deducted monthly until balance is cleared.
              </p>
            )}
          </div>

          {/* Principal + Monthly Repayment */}

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="principal"
                className="mb-2 block text-sm font-medium text-[#667085]"
              >
                Principal (₦) <span className="text-[#EF4444]">*</span>
              </label>

              <input
                id="principal"
                name="principal"
                type="number"
                value={formData.principal}
                onChange={handleChange}
                required
                className="h-10 w-full rounded border border-[#D0D5DD] px-3 text-sm text-[#263342] outline-none focus:border-[#1683D8] focus:ring-1 focus:ring-[#1683D8]"
              />
            </div>

            <div>
              <label
                htmlFor="monthlyRepayment"
                className="mb-2 block text-sm font-medium text-[#667085]"
              >
                Monthly Repayment (₦)
              </label>

              <input
                id="monthlyRepayment"
                name="monthlyRepayment"
                type="number"
                value={formData.monthlyRepayment}
                onChange={handleChange}
                className="h-10 w-full rounded border border-[#D0D5DD] px-3 text-sm text-[#263342] outline-none focus:border-[#1683D8] focus:ring-1 focus:ring-[#1683D8]"
              />
            </div>
          </div>

          {/* Start Date */}

          <div className="mt-5">
            <label
              htmlFor="startDate"
              className="mb-2 block text-sm font-medium text-[#667085]"
            >
              Start Date
            </label>

            <input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              className="h-10 w-full rounded border border-[#D0D5DD] px-3 text-sm text-[#263342] outline-none focus:border-[#1683D8] focus:ring-1 focus:ring-[#1683D8]"
            />
          </div>

          {/* ============================================================
              ACTIONS
          ============================================================ */}

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded border border-[#D0D5DD] bg-white text-sm font-medium text-[#344054] transition hover:bg-[#F8F9FA]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="h-10 rounded bg-[#1683D8] text-sm font-medium text-white transition hover:bg-[#1175C2]"
            >
              Add Loan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
