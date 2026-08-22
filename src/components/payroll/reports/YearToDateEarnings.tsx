"use client";

import ReportCard, {
  ReportTableScroll,
} from "@/components/payroll/reports/ReportCard";
import {
  REPORT_YEAR,
  YTD_MONTHS,
  formatNaira,
  getInitials,
  ytdEarningsRows,
  type YtdEarningsRow,
} from "@/lib/payroll-reports";

// =====================================================
// AVATAR
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

// =====================================================
// TABLE
// =====================================================

const AMOUNT_COLUMNS = [
  { key: "ytdGross", label: "YTD Gross", className: "text-gray-900" },
  { key: "ytdPaye", label: "YTD PAYE", className: "text-red-600" },
  { key: "ytdPension", label: "YTD Pension", className: "text-amber-700" },
  { key: "ytdNet", label: "YTD Net", className: "text-green-700" },
] as const;

function EarningsTable({ rows }: { rows: YtdEarningsRow[] }) {
  const totals = rows.reduce<Record<string, number>>((acc, row) => {
    for (const column of AMOUNT_COLUMNS) {
      acc[column.key] = (acc[column.key] ?? 0) + row[column.key];
    }

    return acc;
  }, {});

  return (
    <ReportTableScroll minWidth={980}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="text-left text-sm font-medium text-gray-500">
            <th scope="col" className="px-5 py-3 font-medium sm:px-6">
              Employee
            </th>

            <th scope="col" className="px-5 py-3 font-medium sm:px-6">
              Department
            </th>

            {AMOUNT_COLUMNS.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="whitespace-nowrap px-5 py-3 font-medium sm:px-6"
              >
                {column.label}
              </th>
            ))}
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
                    <p className="truncate font-medium leading-5 text-gray-900">
                      {row.name}
                    </p>

                    <p className="truncate text-xs leading-4 text-gray-500">
                      {row.role}
                    </p>
                  </div>
                </div>
              </td>

              <td className="whitespace-nowrap px-5 py-3 text-gray-600 sm:px-6">
                {row.department}
              </td>

              {AMOUNT_COLUMNS.map((column) => (
                <td
                  key={column.key}
                  className={`whitespace-nowrap px-5 py-3 font-medium sm:px-6 ${column.className}`}
                >
                  {formatNaira(row[column.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold text-gray-900">
            <td className="whitespace-nowrap px-5 py-3 sm:px-6">
              Total ({rows.length} employees)
            </td>

            <td className="px-5 py-3 sm:px-6" />

            {AMOUNT_COLUMNS.map((column) => (
              <td
                key={column.key}
                className="whitespace-nowrap px-5 py-3 sm:px-6"
              >
                {formatNaira(totals[column.key] ?? 0)}
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </ReportTableScroll>
  );
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function YearToDateEarnings() {
  return (
    <div className="flex w-full flex-col gap-6">
      <ReportCard
        title={`Year-to-Date Earnings — ${REPORT_YEAR}`}
        // The multiplier is stated because it is the one thing a reader cannot
        // check from the table: YTD figures are per-run amounts across the
        // disbursed runs, and the page previously implied two, three and five
        // months in three different places.
        subtitle={`Accumulated over ${YTD_MONTHS} disbursed pay runs`}
      >
        <EarningsTable rows={ytdEarningsRows} />
      </ReportCard>
    </div>
  );
}
