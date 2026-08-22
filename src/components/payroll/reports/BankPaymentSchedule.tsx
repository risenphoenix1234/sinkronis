"use client";

import { Download } from "lucide-react";

import ReportCard, {
  ReportTableScroll,
} from "@/components/payroll/reports/ReportCard";
import {
  CURRENT_PERIOD,
  bankPaymentRows,
  bankPaymentTotal,
  exportReport,
  formatNaira,
  type BankPaymentRow,
} from "@/lib/payroll-reports";
import type { PayslipStatus } from "@/types/payroll/pay-run-data";

// =====================================================
// STATUS BADGE
// =====================================================

const STATUS_STYLES: Record<PayslipStatus, string> = {
  Paid: "bg-green-50 text-green-700",
  Pending: "bg-amber-50 text-amber-800",
};

function PaymentStatusBadge({ status }: { status: PayslipStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

// =====================================================
// TABLE
// =====================================================

function PaymentTable({ rows }: { rows: BankPaymentRow[] }) {
  return (
    <ReportTableScroll minWidth={950}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="text-left text-sm font-medium text-gray-500">
            <th scope="col" className="w-16 px-5 py-3 font-medium sm:px-6">
              #
            </th>

            <th scope="col" className="px-5 py-3 font-medium sm:px-6">
              Employee
            </th>

            <th scope="col" className="px-5 py-3 font-medium sm:px-6">
              Bank
            </th>

            <th scope="col" className="px-5 py-3 font-medium sm:px-6">
              Account Number
            </th>

            <th scope="col" className="px-5 py-3 font-medium sm:px-6">
              Amount
            </th>

            <th scope="col" className="px-5 py-3 font-medium sm:px-6">
              Status
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr
              key={`${row.accountNumber}-${row.employee}`}
              className={`border-t border-gray-200 transition-colors hover:bg-blue-50/40 ${
                index % 2 === 1 ? "bg-gray-50" : ""
              }`}
            >
              <td className="px-5 py-3 text-gray-500 sm:px-6">{index + 1}</td>

              <td className="whitespace-nowrap px-5 py-3 font-medium text-gray-900 sm:px-6">
                {row.employee}
              </td>

              <td className="whitespace-nowrap px-5 py-3 text-gray-600 sm:px-6">
                {row.bank}
              </td>

              <td className="whitespace-nowrap px-5 py-3 font-mono tracking-wide text-gray-600 sm:px-6">
                {row.accountNumber}
              </td>

              <td className="whitespace-nowrap px-5 py-3 font-medium text-green-700 sm:px-6">
                {formatNaira(row.amount)}
              </td>

              <td className="px-5 py-3 sm:px-6">
                <PaymentStatusBadge status={row.status} />
              </td>
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold text-gray-900">
            <td className="px-5 py-3 sm:px-6" />

            <td className="whitespace-nowrap px-5 py-3 sm:px-6" colSpan={3}>
              Total to disburse ({rows.length} payments)
            </td>

            <td className="whitespace-nowrap px-5 py-3 sm:px-6">
              {formatNaira(bankPaymentTotal)}
            </td>

            <td className="px-5 py-3 sm:px-6" />
          </tr>
        </tfoot>
      </table>
    </ReportTableScroll>
  );
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function BankPaymentSchedule() {
  const pending = bankPaymentRows.filter((row) => row.status === "Pending");

  const banks = new Set(bankPaymentRows.map((row) => row.bank)).size;

  return (
    <div className="flex w-full flex-col gap-6">
      <ReportCard
        title={`Bank Payment Schedule — ${CURRENT_PERIOD}`}
        subtitle={
          pending.length === 0
            ? `${bankPaymentRows.length} payments across ${banks} banks · all paid`
            : `${bankPaymentRows.length} payments across ${banks} banks · ${pending.length} pending`
        }
        action={
          // Previously this only console.logged, so the button looked
          // functional and did nothing. It now produces the same CSV as the
          // page-level Export, from the same rows shown in the table.
          <button
            type="button"
            onClick={() => exportReport("Bank Payment Schedule")}
            className="inline-flex h-9 shrink-0 items-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            <Download className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            Export CSV
          </button>
        }
      >
        <PaymentTable rows={bankPaymentRows} />
      </ReportCard>
    </div>
  );
}
