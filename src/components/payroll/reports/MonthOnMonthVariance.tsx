"use client";

import ReportCard, {
  ReportTableScroll,
} from "@/components/payroll/reports/ReportCard";
import {
  CURRENT_PERIOD,
  EMPLOYEE_COUNT,
  PREVIOUS_PERIOD,
  changedCount,
  formatNaira,
  formatNairaSigned,
  getInitials,
  shortMonth,
  varianceRows,
  type VarianceRow,
} from "@/lib/payroll-reports";

// =====================================================
// CELLS
// =====================================================

function EmployeeAvatar({ name }: { name: string }) {
  return (
    <div
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[11px] font-semibold text-blue-600"
      aria-hidden="true"
    >
      {getInitials(name)}
    </div>
  );
}

/**
 * The badge now reflects the row it describes. It previously rendered the same
 * grey pill for "Changed" and "No change", which made the two states
 * indistinguishable at a glance — the one job a status badge has.
 */
function ChangeBadge({ variance }: { variance: number }) {
  if (variance === 0) {
    return (
      <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
        No change
      </span>
    );
  }

  const increased = variance > 0;

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
        increased ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
      }`}
    >
      {increased ? "Increase" : "Decrease"}
    </span>
  );
}

function varianceToneClass(variance: number) {
  if (variance === 0) return "text-gray-500";

  return variance > 0 ? "text-green-700" : "text-red-600";
}

// =====================================================
// TABLE
// =====================================================

function VarianceTable({ rows }: { rows: VarianceRow[] }) {
  const previousTotal = rows.reduce((acc, row) => acc + row.previousNet, 0);
  const currentTotal = rows.reduce((acc, row) => acc + row.currentNet, 0);
  const varianceTotal = currentTotal - previousTotal;

  const totalPercentage =
    previousTotal === 0 ? 0 : (varianceTotal / previousTotal) * 100;

  return (
    <ReportTableScroll minWidth={980}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="text-left text-sm font-medium text-gray-500">
            <th scope="col" className="px-5 py-3 font-medium sm:px-6">
              Employee
            </th>

            <th scope="col" className="px-5 py-3 font-medium sm:px-6">
              {shortMonth(PREVIOUS_PERIOD)} Net
            </th>

            <th scope="col" className="px-5 py-3 font-medium sm:px-6">
              {shortMonth(CURRENT_PERIOD)} Net
            </th>

            <th scope="col" className="px-5 py-3 font-medium sm:px-6">
              Variance
            </th>

            <th scope="col" className="px-5 py-3 font-medium sm:px-6">
              % Change
            </th>

            <th scope="col" className="px-5 py-3 font-medium sm:px-6">
              Change
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.name}
              className={`border-t border-gray-200 transition-colors hover:bg-blue-50/40 ${
                index % 2 === 1 ? "bg-gray-50" : ""
              }`}
            >
              <td className="px-5 py-3 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                  <EmployeeAvatar name={row.name} />

                  <div className="min-w-0">
                    <p className="truncate font-medium text-gray-900">
                      {row.name}
                    </p>

                    <p className="truncate text-xs text-gray-500">{row.role}</p>
                  </div>
                </div>
              </td>

              <td className="whitespace-nowrap px-5 py-3 text-gray-600 sm:px-6">
                {formatNaira(row.previousNet)}
              </td>

              <td className="whitespace-nowrap px-5 py-3 text-gray-600 sm:px-6">
                {formatNaira(row.currentNet)}
              </td>

              <td
                className={`whitespace-nowrap px-5 py-3 font-medium sm:px-6 ${varianceToneClass(
                  row.variance,
                )}`}
              >
                {formatNairaSigned(row.variance)}
              </td>

              <td
                className={`whitespace-nowrap px-5 py-3 sm:px-6 ${varianceToneClass(
                  row.variance,
                )}`}
              >
                {row.variance > 0 ? "+" : ""}
                {row.percentage.toFixed(1)}%
              </td>

              <td className="px-5 py-3 sm:px-6">
                <ChangeBadge variance={row.variance} />
              </td>
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold text-gray-900">
            <td className="whitespace-nowrap px-5 py-3 sm:px-6">
              Total ({rows.length} employees)
            </td>

            <td className="whitespace-nowrap px-5 py-3 sm:px-6">
              {formatNaira(previousTotal)}
            </td>

            <td className="whitespace-nowrap px-5 py-3 sm:px-6">
              {formatNaira(currentTotal)}
            </td>

            <td
              className={`whitespace-nowrap px-5 py-3 sm:px-6 ${varianceToneClass(
                varianceTotal,
              )}`}
            >
              {formatNairaSigned(varianceTotal)}
            </td>

            <td
              className={`whitespace-nowrap px-5 py-3 sm:px-6 ${varianceToneClass(
                varianceTotal,
              )}`}
            >
              {varianceTotal > 0 ? "+" : ""}
              {totalPercentage.toFixed(1)}%
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

export default function MonthOnMonthVariance() {
  return (
    <div className="flex w-full flex-col gap-6">
      {/* A table of eighteen ₦0 rows reads as broken. It isn't: the two runs
          carry an identical payslip set, so the honest report is that nothing
          moved — stated up front rather than left for the reader to infer. */}
      {changedCount === 0 && (
        <div
          role="status"
          className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900 sm:px-6"
        >
          <p className="font-medium">
            No net pay changed between {PREVIOUS_PERIOD} and {CURRENT_PERIOD}.
          </p>

          <p className="mt-1 text-amber-800">
            All {EMPLOYEE_COUNT} employees were paid the same amount in both
            periods, so every variance below is ₦0.
          </p>
        </div>
      )}

      <ReportCard
        title={`Net Pay Variance — ${PREVIOUS_PERIOD} vs ${CURRENT_PERIOD}`}
        subtitle={`${changedCount} of ${varianceRows.length} employees changed`}
      >
        <VarianceTable rows={varianceRows} />
      </ReportCard>
    </div>
  );
}
