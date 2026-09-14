"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { ChevronDown, ChevronUp, Download } from "lucide-react";

type LineItem = {
  label: string;
  amount: number;
};

type Payslip = {
  id: string;
  month: string;
  year: number;
  gross: number;
  deductions: number;
  netPay: number;
  earnings: LineItem[];
  deductionItems: LineItem[];
};

const MONTHLY_NET_PAY = [
  { month: "Jan", net: 342500 },
  { month: "Feb", net: 342500 },
  { month: "Mar", net: 342500 },
  { month: "Apr", net: 342500 },
  { month: "May", net: 342500 },
  { month: "Jun", net: 342500 },
];

const PAYSLIPS: Payslip[] = [
  {
    id: "2026-06",
    month: "June",
    year: 2026,
    gross: 485000,
    deductions: 142500,
    netPay: 342500,
    earnings: [
      { label: "Basic Salary", amount: 300000 },
      { label: "Housing Allowance", amount: 100000 },
      { label: "Transport Allowance", amount: 50000 },
      { label: "Medical Allowance", amount: 35000 },
    ],
    deductionItems: [
      { label: "PAYE Tax", amount: 72500 },
      { label: "Pension (Employee 8%)", amount: 38800 },
      { label: "NHF", amount: 7500 },
      { label: "Loan Deduction", amount: 23700 },
    ],
  },
  {
    id: "2026-05",
    month: "May",
    year: 2026,
    gross: 485000,
    deductions: 142500,
    netPay: 342500,
    earnings: [
      { label: "Basic Salary", amount: 300000 },
      { label: "Housing Allowance", amount: 100000 },
      { label: "Transport Allowance", amount: 50000 },
      { label: "Medical Allowance", amount: 35000 },
    ],
    deductionItems: [
      { label: "PAYE Tax", amount: 72500 },
      { label: "Pension (Employee 8%)", amount: 38800 },
      { label: "NHF", amount: 7500 },
      { label: "Loan Deduction", amount: 23700 },
    ],
  },
  {
    id: "2026-04",
    month: "April",
    year: 2026,
    gross: 485000,
    deductions: 142500,
    netPay: 342500,
    earnings: [
      { label: "Basic Salary", amount: 300000 },
      { label: "Housing Allowance", amount: 100000 },
      { label: "Transport Allowance", amount: 50000 },
      { label: "Medical Allowance", amount: 35000 },
    ],
    deductionItems: [
      { label: "PAYE Tax", amount: 72500 },
      { label: "Pension (Employee 8%)", amount: 38800 },
      { label: "NHF", amount: 7500 },
      { label: "Loan Deduction", amount: 23700 },
    ],
  },
];

const YEARS = [2024, 2025, 2026];

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}

function formatKilo(value: number) {
  return `₦${value / 1000}k`;
}

function YearFilter({
  selectedYear,
  onSelect,
}: {
  selectedYear: number;
  onSelect: (year: number) => void;
}) {
  return (
    <div className="flex items-center gap-3 py-4">
      <span className="text-sm text-[#667085]">Filter by year:</span>
      <div className="flex gap-2">
        {YEARS.map((year) => {
          const active = year === selectedYear;
          return (
            <button
              key={year}
              type="button"
              onClick={() => onSelect(year)}
              className={`h-8 rounded-md px-4 text-sm font-medium transition ${
                active
                  ? "bg-[#1683D8] text-white"
                  : "border border-[#D9DEE7] bg-white text-[#344054] hover:bg-[#F9FAFB]"
              }`}
            >
              {year}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function NetPayChart() {
  return (
    <div className="rounded-lg border border-[#EAECF0] bg-white p-6 shadow-sm">
      <h2 className="text-base font-bold text-[#1D2433]">
        Net Pay — Last 6 Months
      </h2>
      <p className="mt-1 text-sm text-[#98A2B3]">Jan 2026 – Jun 2026</p>

      <div className="mt-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={MONTHLY_NET_PAY} barCategoryGap="28%">
            <CartesianGrid vertical={false} stroke="#EEF1F5" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#98A2B3", fontSize: 12 }}
              dy={8}
            />
            <YAxis
              domain={[0, 360000]}
              ticks={[0, 90000, 180000, 270000, 360000]}
              tickFormatter={formatKilo}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#98A2B3", fontSize: 11 }}
              width={48}
            />
            <Bar dataKey="net" fill="#2388D0" radius={[0, 0, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function SummaryField({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <span className="text-sm text-[#667085]">
      {label}{" "}
      <span className={`font-semibold ${valueClassName ?? "text-[#1D2433]"}`}>
        {value}
      </span>
    </span>
  );
}

function PayslipCard({
  payslip,
  expanded,
  onToggle,
}: {
  payslip: Payslip;
  expanded: boolean;
  onToggle: () => void;
}) {
  const grossTotal = payslip.earnings.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="rounded-lg border border-[#EAECF0] bg-white shadow-sm">
      <div className="flex items-start justify-between gap-4 p-6">
        <div>
          <h3 className="text-base font-bold text-[#1D2433]">
            {payslip.month} {payslip.year}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1">
            <SummaryField label="Gross" value={formatNaira(payslip.gross)} />
            <SummaryField
              label="Deductions"
              value={`-${formatNaira(payslip.deductions)}`}
              valueClassName="text-[#F04438]"
            />
            <SummaryField
              label="Net Pay"
              value={formatNaira(payslip.netPay)}
              valueClassName="text-[#12B76A]"
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            className="flex h-9 items-center gap-1.5 rounded-md border border-[#D9DEE7] bg-white px-3.5 text-sm font-medium text-[#1683D8] transition hover:bg-[#F5FAFF]"
          >
            <Download size={15} />
            Download PDF
          </button>
          <button
            type="button"
            onClick={onToggle}
            className="flex h-9 items-center gap-1.5 rounded-md border border-[#D9DEE7] bg-white px-3.5 text-sm font-medium text-[#344054] transition hover:bg-[#F9FAFB]"
          >
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            {expanded ? "Hide" : "View Full Breakdown"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-[#EAECF0] px-6 pb-6 pt-5">
          <div className="grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
            {/* Earnings */}
            <div>
              <h4 className="text-sm font-bold text-[#1D2433]">Earnings</h4>
              <div className="mt-3 divide-y divide-[#F0F2F5]">
                {payslip.earnings.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-2.5 text-sm"
                  >
                    <span className="text-[#667085]">{item.label}</span>
                    <span className="text-[#1D2433]">
                      {formatNaira(item.amount)}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between py-2.5 text-sm font-bold text-[#1D2433]">
                  <span>Gross Total</span>
                  <span>{formatNaira(grossTotal)}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div>
              <h4 className="text-sm font-bold text-[#1D2433]">Deductions</h4>
              <div className="mt-3 divide-y divide-[#F0F2F5]">
                {payslip.deductionItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-2.5 text-sm"
                  >
                    <span className="text-[#667085]">{item.label}</span>
                    <span className="text-[#F04438]">
                      -{formatNaira(item.amount)}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between py-2.5 text-sm font-bold text-[#1D2433]">
                  <span>Total Deductions</span>
                  <span className="text-[#F04438]">
                    -{formatNaira(payslip.deductions)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between rounded-md border border-[#BBF0D0] bg-[#EAF9EF] px-5 py-4">
            <span className="text-sm font-bold text-[#1D2433]">Net Pay</span>
            <span className="text-lg font-bold text-[#12B76A]">
              {formatNaira(payslip.netPay)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MyPayslipsPage() {
  const [selectedYear, setSelectedYear] = useState(2026);
  const [expandedId, setExpandedId] = useState<string | null>(PAYSLIPS[0].id);

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] px-6 py-8 sm:px-10">
      <div className="mx-auto">
        <header>
          <h1 className="text-2xl font-bold text-[#1D2433]">My Payslips</h1>
          <p className="mt-1 text-sm text-[#98A2B3]">
            View and download your monthly payslips
          </p>
        </header>

        <div className="mt-6">
          <NetPayChart />
        </div>

        <YearFilter selectedYear={selectedYear} onSelect={setSelectedYear} />

        <div className="flex flex-col gap-5 pb-10">
          {PAYSLIPS.map((payslip) => (
            <PayslipCard
              key={payslip.id}
              payslip={payslip}
              expanded={expandedId === payslip.id}
              onToggle={() => toggle(payslip.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
