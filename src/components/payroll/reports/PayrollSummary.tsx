"use client";

import ReportCard, {
  ReportTableScroll,
} from "@/components/payroll/reports/ReportCard";
import {
  CURRENT_PERIOD,
  EMPLOYEE_COUNT,
  REPORT_YEAR,
  YTD_MONTHS,
  formatNaira,
  formatNairaCompact,
  monthlyRows,
  monthlyRowsDesc,
  niceAxis,
  runTotals,
  shortMonth,
  type MonthlyRow,
  ytdEmployerCost,
} from "@/lib/payroll-reports";

// =====================================================
// STAT CARDS
// =====================================================

const stats = [
  {
    label: `${CURRENT_PERIOD} Gross`,
    value: formatNaira(runTotals.gross),
    colorClass: "text-blue-600",
  },
  {
    label: `${CURRENT_PERIOD} Net Pay`,
    value: formatNaira(runTotals.netPay),
    colorClass: "text-green-700",
  },
  {
    label: `YTD Employer Cost (${YTD_MONTHS} runs)`,
    value: formatNaira(ytdEmployerCost),
    colorClass: "text-purple-600",
  },
  {
    label: "Employees",
    value: String(EMPLOYEE_COUNT),
    colorClass: "text-amber-700",
  },
];

function StatCard({
  label,
  value,
  colorClass,
}: {
  label: string;
  value: string;
  colorClass: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-5 py-5 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{label}</p>

      <p className={`mt-2 text-2xl font-semibold ${colorClass}`}>{value}</p>
    </div>
  );
}

// =====================================================
// GROSS VS NET CHART
// =====================================================

const SERIES = [
  { key: "gross", label: "Gross", className: "bg-blue-500" },
  { key: "netPay", label: "Net pay", className: "bg-green-600" },
] as const;

function MonthlyChart({ rows }: { rows: MonthlyRow[] }) {
  const axis = niceAxis(Math.max(...rows.map((row) => row.gross)));

  return (
    <ReportCard
      title="Gross vs Net Pay by Month"
      subtitle={`Disbursed pay runs, ${REPORT_YEAR}`}
      action={
        <div className="flex items-center gap-4">
          {SERIES.map((series) => (
            <span
              key={series.key}
              className="flex items-center gap-2 text-sm text-gray-500"
            >
              <span className={`h-2.5 w-2.5 rounded-sm ${series.className}`} />
              {series.label}
            </span>
          ))}
        </div>
      }
    >
      <div className="px-5 pb-5 pt-6 sm:px-6">
        {/* The left gutter holds the tick labels; both the plot and the month
            labels below it sit inside the same padded box, so they share one
            geometry instead of each re-deriving it. */}
        <div className="pl-16">
          <div className="relative h-72 border-b border-l border-gray-300">
            {/* Gridlines and their labels are positioned from the same value,
                so they cannot drift apart. */}
            {axis.ticks.map((tick) => (
              <div
                key={tick}
                className="absolute inset-x-0"
                style={{ bottom: `${(tick / axis.max) * 100}%` }}
              >
                <div className="border-t border-dashed border-gray-200" />

                <span className="absolute right-full -translate-y-1/2 whitespace-nowrap pr-3 text-xs text-gray-500">
                  {formatNairaCompact(tick)}
                </span>
              </div>
            ))}

            <div className="absolute inset-0 flex items-end justify-around gap-4 px-4">
              {rows.map((row) => (
                <div
                  key={row.period}
                  className="flex h-full max-w-[120px] flex-1 items-end justify-center gap-1.5"
                >
                  {SERIES.map((series) => (
                    <div
                      key={series.key}
                      title={`${row.period} ${series.label}: ${formatNaira(row[series.key])}`}
                      className={`w-1/2 rounded-t-sm ${series.className}`}
                      style={{
                        height: `${(row[series.key] / axis.max) * 100}%`,
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-around gap-4 px-4 pt-3">
            {rows.map((row) => (
              <span
                key={row.period}
                className="max-w-[120px] flex-1 text-center text-sm text-gray-500"
              >
                {shortMonth(row.period)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </ReportCard>
  );
}

// =====================================================
// MONTHLY BREAKDOWN TABLE
// =====================================================

const COLUMNS = [
  { key: "period", label: "Month", className: "font-medium text-gray-900" },
  { key: "gross", label: "Gross", className: "text-gray-600" },
  { key: "paye", label: "PAYE", className: "font-medium text-red-600" },
  { key: "pension", label: "Pension", className: "font-medium text-amber-700" },
  { key: "nhf", label: "NHF", className: "text-gray-600" },
  { key: "loans", label: "Loans", className: "text-gray-600" },
  { key: "netPay", label: "Net Pay", className: "font-medium text-green-700" },
  {
    key: "employerCost",
    label: "Employer Cost",
    className: "font-medium text-purple-600",
  },
] as const;

/** Money columns, i.e. everything except the month label. */
const AMOUNT_KEYS = COLUMNS.slice(1).map((column) => column.key);

function MonthlyBreakdownTable({ rows }: { rows: MonthlyRow[] }) {
  const totals = rows.reduce<Record<string, number>>((acc, row) => {
    for (const key of AMOUNT_KEYS) {
      acc[key] = (acc[key] ?? 0) + (row[key] as number);
    }

    return acc;
  }, {});

  return (
    <ReportCard
      title="Monthly Breakdown"
      subtitle="Net pay is gross less PAYE, pension, NHF and loan deductions."
    >
      <ReportTableScroll minWidth={980}>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-left text-sm font-medium text-gray-500">
              {COLUMNS.map((column) => (
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
                key={row.period}
                className={`border-t border-gray-200 ${
                  index % 2 === 1 ? "bg-gray-50" : ""
                }`}
              >
                {COLUMNS.map((column) => (
                  <td
                    key={column.key}
                    className={`whitespace-nowrap px-5 py-3 sm:px-6 ${column.className}`}
                  >
                    {column.key === "period"
                      ? row.period
                      : formatNaira(row[column.key] as number)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold text-gray-900">
              <td className="whitespace-nowrap px-5 py-3 sm:px-6">
                Total ({rows.length} runs)
              </td>

              {AMOUNT_KEYS.map((key) => (
                <td key={key} className="whitespace-nowrap px-5 py-3 sm:px-6">
                  {formatNaira(totals[key] ?? 0)}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </ReportTableScroll>
    </ReportCard>
  );
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function PayrollSummary() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <MonthlyChart rows={monthlyRows} />

      <MonthlyBreakdownTable rows={monthlyRowsDesc} />
    </div>
  );
}
