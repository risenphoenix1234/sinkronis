"use client";

import { useMemo, useState } from "react";

type BIKForm = {
  healthInsurance: string;
  airtimeAllowance: string;
  lunchAllowance: string;
  thirteenthMonth: string;
};

const initialValues: BIKForm = {
  healthInsurance: "28",
  airtimeAllowance: "0",
  lunchAllowance: "0",
  thirteenthMonth: "0",
};

export default function BIK() {
  const [form, setForm] = useState<BIKForm>(initialValues);

  const handleChange = (field: keyof BIKForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const totalBIK = useMemo(() => {
    return (
      Number(form.healthInsurance || 0) +
      Number(form.airtimeAllowance || 0) +
      Number(form.lunchAllowance || 0) +
      Number(form.thirteenthMonth || 0)
    );
  }, [form]);

  const formatCurrency = (value: number) => {
    return `₦${value.toLocaleString("en-NG")}`;
  };

  return (
    <div className="mt-5">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,3fr)_270px]">
        {/* ============================================================
            LEFT - BIK FORM
        ============================================================ */}

        <section className="rounded border border-[#E5E7EB] bg-white">
          <div className="px-6 py-6">
            {/* Heading */}
            <div>
              <h2 className="text-sm font-semibold text-[#263342] sm:text-base">
                Benefit in Kind (BIK)
              </h2>

              <p className="mt-2 text-xs leading-5 text-[#667085]">
                Non-cash benefits provided by the employer. These do not reduce
                employee gross pay but are recorded for compliance.
              </p>
            </div>

            {/* ==========================================================
                FORM FIELDS
            ========================================================== */}

            <div className="mt-5 grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2">
              {/* Health Insurance */}
              <BIKField
                label="HMO / Health Insurance"
                value={form.healthInsurance}
                onChange={(value) => handleChange("healthInsurance", value)}
                description="Monthly employer-funded health plan value"
              />

              {/* Airtime */}
              <BIKField
                label="Airtime Allowance"
                value={form.airtimeAllowance}
                onChange={(value) => handleChange("airtimeAllowance", value)}
                description="Monthly mobile credit provided by employer"
              />

              {/* Lunch */}
              <BIKField
                label="Lunch / Meal Allowance"
                value={form.lunchAllowance}
                onChange={(value) => handleChange("lunchAllowance", value)}
                description="Monthly employer-provided meal benefit"
              />

              {/* 13th Month */}
              <BIKField
                label="13th Month (Annual)"
                value={form.thirteenthMonth}
                onChange={(value) => handleChange("thirteenthMonth", value)}
                description="Annual bonus amount — shown as monthly provision"
              />
            </div>
          </div>
        </section>

        {/* ============================================================
            RIGHT - BIK SUMMARY
        ============================================================ */}

        <section className="rounded border border-[#E5E7EB] bg-white">
          {/* Header */}
          <div className="border-b border-[#E5E7EB] px-5 py-4">
            <h2 className="text-sm font-semibold text-[#263342]">
              BIK Summary
            </h2>
          </div>

          {/* Summary */}
          <div className="px-5 py-4">
            <SummaryRow
              label="HMO / Health Insurance"
              value={formatCurrency(Number(form.healthInsurance || 0))}
            />

            <SummaryRow
              label="Airtime Allowance"
              value={formatCurrency(Number(form.airtimeAllowance || 0))}
            />

            <SummaryRow
              label="Lunch / Meal Allowance"
              value={formatCurrency(Number(form.lunchAllowance || 0))}
            />

            <SummaryRow
              label="13th Month (Annual)"
              value={formatCurrency(Number(form.thirteenthMonth || 0))}
            />

            {/* Total */}
            <div className="mt-1 flex items-center justify-between border-t border-[#F2F4F7] pt-3">
              <span className="text-xs font-semibold text-[#263342]">
                Total Monthly BIK
              </span>

              <span className="text-sm font-bold text-[#1683D8]">
                {formatCurrency(totalBIK)}
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* ================================================================
          SAVE BUTTON
      ================================================================ */}

      <button
        type="button"
        onClick={() => {
          console.log("BIK values:", form);
        }}
        className="mt-4 rounded bg-[#1683D8] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#1275C1] focus:outline-none focus:ring-2 focus:ring-[#1683D8]/30"
      >
        Save BIK
      </button>
    </div>
  );
}

/* ========================================================================
   BIK FIELD
======================================================================== */

type BIKFieldProps = {
  label: string;
  value: string;
  description: string;
  onChange: (value: string) => void;
};

function BIKField({ label, value, description, onChange }: BIKFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-[#667085]">
        {label}
      </label>

      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full rounded border border-[#D9E0E7] bg-white px-3 text-xs text-[#263342] outline-none transition placeholder:text-[#98A2B3] focus:border-[#1683D8] focus:ring-1 focus:ring-[#1683D8]/20"
      />

      <p className="mt-1 text-[10px] leading-4 text-[#98A2B3]">{description}</p>
    </div>
  );
}

/* ========================================================================
   SUMMARY ROW
======================================================================== */

type SummaryRowProps = {
  label: string;
  value: string;
};

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between border-b border-dashed border-[#E5E7EB] py-3">
      <span className="text-xs text-[#667085]">{label}</span>

      <span className="text-xs font-semibold text-[#263342]">{value}</span>
    </div>
  );
}
