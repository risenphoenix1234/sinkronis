"use client";

import { Search } from "lucide-react";

import {
  CustomDeduction,
  CustomDeductionType,
} from "@/types/payroll/deduction-data";

import { naira } from "@/types/payroll/payee-data";

const typeStyles: Record<CustomDeductionType, string> = {
  Recurring: "bg-[#e4f3fc] text-[#1682bd]",
  "One-off": "bg-[#f1f3f5] text-[#697586]",
};

/* =====================================================
   CUSTOM DEDUCTIONS CONTENT
===================================================== */

type CustomDeductionsProps = {
  deductions: CustomDeduction[];
  search: string;
  type: string;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onRemove: (deduction: CustomDeduction) => void;
};

export default function CustomDeductions({
  deductions,
  search,
  type,
  onSearchChange,
  onTypeChange,
  onRemove,
}: CustomDeductionsProps) {
  return (
    <section className="mt-6">
      {/* =================================================
          FILTER BAR
      ================================================= */}

      <div className="flex items-center gap-3">
        {/* Search */}

        <div className="relative w-[300px]">
          <Search
            size={18}
            strokeWidth={1.8}
            className="
              absolute
              left-3.5
              top-1/2
              -translate-y-1/2
              text-[#a0a9b4]
            "
          />

          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search employee or deduction..."
            className="
              h-11
              w-full
              rounded-md
              border
              border-[#dce2e8]
              bg-white
              pl-10
              pr-4
              text-sm
              text-[#344054]
              outline-none
              placeholder:text-sm
              placeholder:text-[#8994a3]
              focus:border-[#087fbd]
              focus:ring-2
              focus:ring-[#087fbd]/10
            "
          />
        </div>

        {/* Type */}

        <select
          value={type}
          onChange={(event) => onTypeChange(event.target.value)}
          className="
            h-11
            w-[135px]
            rounded-md
            border
            border-[#dce2e8]
            bg-white
            px-4
            text-sm
            font-medium
            text-[#344054]
            outline-none
            focus:border-[#087fbd]
            focus:ring-2
            focus:ring-[#087fbd]/10
          "
        >
          <option>All Types</option>
          <option>Recurring</option>
          <option>One-off</option>
        </select>

        {/* Export */}

        <button
          type="button"
          className="
            h-11
            rounded-md
            border
            border-[#dce2e8]
            bg-white
            px-5
            text-sm
            font-medium
            text-[#607083]
            transition
            hover:bg-[#f8fafc]
            hover:text-[#344054]
          "
        >
          Export
        </button>
      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      <CustomDeductionTable deductions={deductions} onRemove={onRemove} />
    </section>
  );
}

/* =====================================================
   CUSTOM DEDUCTION TABLE
===================================================== */

type CustomDeductionTableProps = {
  deductions: CustomDeduction[];
  onRemove: (deduction: CustomDeduction) => void;
};

function CustomDeductionTable({
  deductions,
  onRemove,
}: CustomDeductionTableProps) {
  return (
    <section
      className="
        mt-5
        w-full
        overflow-hidden
        rounded-[4px]
        border
        border-[#dce2e8]
        bg-white
      "
    >
      <div className="w-full overflow-x-auto">
        <div className="min-w-[850px]">
          {/* =========================
              TABLE HEADER
          ========================== */}

          <div
            className="
              grid
              grid-cols-[1.4fr_1.8fr_1.4fr_1.1fr_0.8fr]
              items-center
              border-b
              border-[#dce2e8]
              bg-[#fcfdfe]
              px-4
              py-3
              text-xs
              font-medium
              text-[#718096]
            "
          >
            <span>Employee</span>
            <span>Deduction Name</span>
            <span>Monthly Amount</span>
            <span>Type</span>
            <span>Action</span>
          </div>

          {/* =========================
              TABLE ROWS
          ========================== */}

          {deductions.map((deduction, index) => (
            <CustomDeductionRow
              key={deduction.id}
              deduction={deduction}
              isLast={index === deductions.length - 1}
              onRemove={() => onRemove(deduction)}
            />
          ))}

          {/* =========================
              EMPTY STATE
          ========================== */}

          {deductions.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-base font-semibold text-[#344054]">
                No custom deductions found
              </p>

              <p className="mt-1 text-sm text-[#8994a3]">
                Try changing your search or type filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* =====================================================
   CUSTOM DEDUCTION ROW
===================================================== */

type CustomDeductionRowProps = {
  deduction: CustomDeduction;
  isLast: boolean;
  onRemove: () => void;
};

function CustomDeductionRow({
  deduction,
  isLast,
  onRemove,
}: CustomDeductionRowProps) {
  return (
    <div
      className={`
        grid
        grid-cols-[1.4fr_1.8fr_1.4fr_1.1fr_0.8fr]
        min-h-[58px]
        items-center
        px-4
        text-sm
        transition-colors
        hover:bg-[#f8fbfd]
        ${!isLast ? "border-b border-[#e7ebef]" : ""}
        ${isLast ? "bg-[#f5f6fa]" : "even:bg-[#f5f6fa]"}
      `}
    >
      {/* EMPLOYEE */}

      <div className="font-semibold text-[#263447]">{deduction.employee}</div>

      {/* DEDUCTION NAME */}

      <div className="text-sm text-[#617287]">{deduction.deductionName}</div>

      {/* MONTHLY AMOUNT */}

      <div className="text-sm font-semibold text-[#ff3b3b]">
        ({naira(deduction.monthlyAmount)})
      </div>

      {/* TYPE */}

      <div>
        <span
          className={`
            inline-flex
            items-center
            rounded-full
            px-3
            py-1
            text-xs
            font-medium
            ${typeStyles[deduction.type]}
          `}
        >
          {deduction.type}
        </span>
      </div>

      {/* ACTION */}

      <div>
        <button
          type="button"
          onClick={onRemove}
          className="
            text-sm
            font-medium
            text-[#ff3030]
            transition
            hover:text-[#d91f1f]
          "
        >
          Remove
        </button>
      </div>
    </div>
  );
}
