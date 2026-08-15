"use client";

import { useState } from "react";

type SalaryFieldProps = {
  label: string;
  value: string;
  onChange?: (value: string) => void;
};

type Deduction = {
  label: string;
  value: string;
  color?: string;
};

const deductions: Deduction[] = [
  {
    label: "PAYE (Monthly)",
    value: "₦13,177",
    color: "text-[#FF0000]",
  },
  {
    label: "Employee Pension (8%)",
    value: "₦18,720",
    color: "text-[#A16207]",
  },
  {
    label: "Employer Pension (10%)",
    value: "₦23,400",
    color: "text-[#A16207]",
  },
  {
    label: "NHF (2.5% of Basic)",
    value: "₦4,500",
    color: "text-[#9333EA]",
  },
  {
    label: "NSITF (Employer 1%)",
    value: "₦2,430",
    color: "text-[#A16207]",
  },
];

export default function PayBreakdown() {
  const [salary, setSalary] = useState({
    basicSalary: "180000",
    housingAllowance: "36000",
    transportAllowance: "18000",
    otherAllowance: "9000",
    otherAllowances: "",
  });

  const [startDate, setStartDate] = useState("");

  const [prorationMethod, setProrationMethod] = useState<
    "working" | "calendar"
  >("working");

  const handleChange = (field: keyof typeof salary, value: string) => {
    setSalary((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_285px]">
      {/* LEFT SIDE */}
      <div className="space-y-4">
        {/* ============================================================ */}
        {/* EARNINGS */}
        {/* ============================================================ */}

        <section className="rounded border border-[#E1E5EA] bg-white">
          <div className="border-b border-[#E5E7EB] px-6 py-5">
            <h2 className="text-sm font-semibold text-[#263342]">Earnings</h2>
          </div>

          <div className="px-6 py-5">
            <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2">
              <SalaryField
                label="Basic Salary"
                value={salary.basicSalary}
                onChange={(value) => handleChange("basicSalary", value)}
              />

              <SalaryField
                label="Housing Allowance"
                value={salary.housingAllowance}
                onChange={(value) => handleChange("housingAllowance", value)}
              />

              <SalaryField
                label="Transport Allowance"
                value={salary.transportAllowance}
                onChange={(value) => handleChange("transportAllowance", value)}
              />

              <SalaryField
                label="Other Allowance"
                value={salary.otherAllowance}
                onChange={(value) => handleChange("otherAllowance", value)}
              />
            </div>

            {/* Other Allowances */}
            <div className="mt-4 flex items-center justify-between">
              <label className="text-xs font-medium text-[#667085]">
                Other Allowances
              </label>

              <button
                type="button"
                className="text-xs font-medium text-[#1683D8] transition hover:text-[#0D6EBA]"
                onClick={() => {
                  // Add allowance logic can go here
                }}
              >
                + Add
              </button>
            </div>

            {salary.otherAllowances && (
              <div className="mt-2">
                <input
                  type="text"
                  value={salary.otherAllowances}
                  onChange={(e) =>
                    handleChange("otherAllowances", e.target.value)
                  }
                  className="h-10 w-full rounded border border-[#D9DEE5] bg-white px-3 text-sm text-[#263342] outline-none focus:border-[#1683D8] focus:ring-1 focus:ring-[#1683D8]/10"
                />
              </div>
            )}
          </div>
        </section>

        {/* ============================================================ */}
        {/* PRORATION */}
        {/* ============================================================ */}

        <section className="rounded border border-[#E1E5EA] bg-white">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-5">
            <h2 className="text-sm font-semibold text-[#263342]">Proration</h2>

            <p className="text-xs text-[#667085]">
              Leave blank if employee worked the full month
            </p>
          </div>

          <div className="px-6 py-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Start Date */}
              <div>
                <label className="mb-2 block text-xs font-medium text-[#667085]">
                  Resume / Start Date (this month)
                </label>

                <input
                  type="text"
                  placeholder="dd/mm/yyy"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-10 w-full rounded border border-[#D9DEE5] bg-white px-3 text-sm text-[#263342] outline-none placeholder:text-[#98A2B3] focus:border-[#1683D8] focus:ring-1 focus:ring-[#1683D8]/10"
                />
              </div>

              {/* Proration Method */}
              <div>
                <label className="mb-2 block text-xs font-medium text-[#667085]">
                  Proration Method
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setProrationMethod("working")}
                    className={`h-10 rounded border text-xs font-medium transition ${
                      prorationMethod === "working"
                        ? "border-[#1683D8] bg-[#F0F8FE] text-[#1683D8]"
                        : "border-[#D9DEE5] bg-white text-[#667085] hover:bg-[#F9FAFB]"
                    }`}
                  >
                    Working Days
                  </button>

                  <button
                    type="button"
                    onClick={() => setProrationMethod("calendar")}
                    className={`h-10 rounded border text-xs font-medium transition ${
                      prorationMethod === "calendar"
                        ? "border-[#1683D8] bg-[#F0F8FE] text-[#1683D8]"
                        : "border-[#D9DEE5] bg-white text-[#667085] hover:bg-[#F9FAFB]"
                    }`}
                  >
                    Calendar Days
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SAVE BUTTON */}
        {/* ============================================================ */}

        <button
          type="button"
          onClick={() => {
            console.log("Salary structure:", salary);
            console.log("Start date:", startDate);
            console.log("Proration:", prorationMethod);
          }}
          className="h-10 rounded-md bg-[#2388D0] px-5 text-sm font-medium text-white transition hover:bg-[#1976B8]"
        >
          Save Salary Structure
        </button>
      </div>

      {/* ============================================================== */}
      {/* RIGHT SIDE - COMPUTED DEDUCTIONS */}
      {/* ============================================================== */}

      <section className="rounded border border-[#E1E5EA] bg-white">
        <div className="border-b border-[#E5E7EB] px-5 py-5">
          <h2 className="text-sm font-semibold text-[#263342]">
            Computed Deductions
          </h2>
        </div>

        <div className="px-5 py-4">
          {deductions.map((deduction) => (
            <div
              key={deduction.label}
              className="flex items-center justify-between border-b border-dashed border-[#E5E7EB] py-3"
            >
              <span className="text-xs text-[#667085]">{deduction.label}</span>

              <span
                className={`text-xs font-semibold ${
                  deduction.color ?? "text-[#263342]"
                }`}
              >
                {deduction.value}
              </span>
            </div>
          ))}

          {/* Net Pay */}
          <div className="flex items-center justify-between pt-4">
            <span className="text-sm font-semibold text-[#263342]">
              Net Pay
            </span>

            <span className="text-sm font-bold text-[#15803D]">₦206,603</span>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ====================================================================== */
/* SALARY FIELD */
/* ====================================================================== */

function SalaryField({ label, value, onChange }: SalaryFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-[#667085]">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-10 w-full rounded border border-[#D9DEE5] bg-white px-3 text-sm text-[#263342] outline-none transition focus:border-[#1683D8] focus:ring-1 focus:ring-[#1683D8]/10"
      />
    </div>
  );
}
