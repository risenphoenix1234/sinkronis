"use client";

import ReportCard, {
  ReportTableScroll,
} from "@/components/payroll/reports/ReportCard";
import {
  CURRENT_PERIOD,
  departmentRows,
  formatNaira,
  formatNairaCompact,
  niceAxis,
  runTotals,
  type DepartmentRow,
} from "@/lib/payroll-reports";

// =====================================================
// CHART
// =====================================================

/** Row pitch shared by the label column and the bar column. */
const ROW_HEIGHT = 28;
const ROW_GAP = 6;

function DepartmentChart({ rows }: { rows: DepartmentRow[] }) {
  const axis = niceAxis(Math.max(...rows.map((row) => row.gross)));

  return (
    <ReportCard
      title="Gross Payroll Cost by Department"
      subtitle={CURRENT_PERIOD}
    >
      <div className="px-5 py-5 sm:px-6">
        <div className="flex w-full">
          {/* Labels and bars are two columns of the same grid rhythm. They
              previously used different spacing rules — justify-between here,
              gap-1 there — which left the last label ~7px below its bar. */}
          <div
            className="flex w-[130px] shrink-0 flex-col"
            style={{ gap: ROW_GAP }}
          >
            {rows.map((row) => (
              <div
                key={row.department}
                className="flex items-center justify-end pr-3 text-xs text-gray-600"
                style={{ height: ROW_HEIGHT }}
              >
                <span className="truncate">{row.department}</span>
              </div>
            ))}
          </div>

          <div className="relative min-w-0 flex-1">
            {/* Gridlines share the tick positions with the labels below. */}
            <div className="pointer-events-none absolute inset-0">
              {axis.ticks.map((tick) => (
                <div
                  key={tick}
                  className="absolute top-0 h-full border-l border-dashed border-gray-200"
                  style={{ left: `${(tick / axis.max) * 100}%` }}
                />
              ))}
            </div>

            <div className="relative flex flex-col" style={{ gap: ROW_GAP }}>
              {rows.map((row) => (
                <div
                  key={row.department}
                  className="flex items-center"
                  style={{ height: ROW_HEIGHT }}
                >
                  <div
                    title={`${row.department}: ${formatNaira(row.gross)}`}
                    className="h-6 rounded-sm bg-blue-500"
                    style={{ width: `${(row.gross / axis.max) * 100}%` }}
                  />
                </div>
              ))}
            </div>

            <div className="relative mt-2 h-8 border-t border-gray-300">
              {axis.ticks.map((tick, index) => (
                <div
                  key={tick}
                  className="absolute top-0"
                  style={{
                    left: `${(tick / axis.max) * 100}%`,
                    transform:
                      index === 0
                        ? "translateX(0)"
                        : index === axis.ticks.length - 1
                          ? "translateX(-100%)"
                          : "translateX(-50%)",
                  }}
                >
                  <div className="h-1 w-px bg-gray-300" />

                  <span className="mt-1 block whitespace-nowrap text-xs text-gray-500">
                    {formatNairaCompact(tick)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ReportCard>
  );
}

// =====================================================
// TABLE
// =====================================================

function DepartmentTable({ rows }: { rows: DepartmentRow[] }) {
  const employees = rows.reduce((acc, row) => acc + row.employees, 0);

  // Bars are scaled against the largest share so the widest department fills
  // the track. Scaling by a fixed multiplier made a 21.6% share render a 65%
  // bar, which contradicted the number printed beside it.
  const maxPercentage = Math.max(...rows.map((row) => row.percentage));

  return (
    <ReportCard title="Department Breakdown">
      <ReportTableScroll minWidth={760}>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-left text-sm font-medium text-gray-500">
              <th scope="col" className="px-5 py-3 font-medium sm:px-6">
                Department
              </th>

              <th scope="col" className="px-5 py-3 font-medium sm:px-6">
                Employees
              </th>

              <th scope="col" className="px-5 py-3 font-medium sm:px-6">
                Gross Salary
              </th>

              <th scope="col" className="px-5 py-3 font-medium sm:px-6">
                Net Pay
              </th>

              <th scope="col" className="px-5 py-3 font-medium sm:px-6">
                % of Total
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr
                key={row.department}
                className={`border-t border-gray-200 ${
                  index % 2 === 1 ? "bg-gray-50" : ""
                }`}
              >
                <td className="whitespace-nowrap px-5 py-3 font-medium text-gray-900 sm:px-6">
                  {row.department}
                </td>

                <td className="px-5 py-3 text-gray-600 sm:px-6">
                  {row.employees}
                </td>

                <td className="whitespace-nowrap px-5 py-3 font-medium text-gray-900 sm:px-6">
                  {formatNaira(row.gross)}
                </td>

                <td className="whitespace-nowrap px-5 py-3 font-medium text-green-700 sm:px-6">
                  {formatNaira(row.netPay)}
                </td>

                <td className="px-5 py-3 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 w-[100px] shrink-0 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{
                          width: `${
                            maxPercentage === 0
                              ? 0
                              : (row.percentage / maxPercentage) * 100
                          }%`,
                        }}
                      />
                    </div>

                    <span className="text-gray-600">
                      {row.percentage.toFixed(1)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold text-gray-900">
              <td className="whitespace-nowrap px-5 py-3 sm:px-6">Total</td>

              <td className="px-5 py-3 sm:px-6">{employees}</td>

              <td className="whitespace-nowrap px-5 py-3 sm:px-6">
                {formatNaira(runTotals.gross)}
              </td>

              <td className="whitespace-nowrap px-5 py-3 sm:px-6">
                {formatNaira(runTotals.netPay)}
              </td>

              <td className="px-5 py-3 sm:px-6">100.0%</td>
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

export default function CostByDepartment() {
  return (
    <div className="flex w-full flex-col gap-6">
      <DepartmentChart rows={departmentRows} />

      <DepartmentTable rows={departmentRows} />
    </div>
  );
}
