// app/payroll/payslips/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Download } from "lucide-react";
import {
  initials,
  PayRun,
  payslipRouteId,
  PayslipStatus,
  totalDeductions,
} from "@/types/payroll/pay-run-data";
import { payRuns, payslips } from "@/data/payroll/pay-run-data";
import { naira } from "@/types/payroll/payee-data";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const YEARS = [2026, 2025];

const statusStyles: Record<PayslipStatus, string> = {
  Paid: "bg-[#dcfce7] text-[#15803d]",
  Pending: "bg-[#fef9c3] text-[#a16207]",
};

/** periodStart is an ISO date ("2026-05-01"), so year/month come straight off it. */
const runYear = (run: PayRun) => Number(run.periodStart.slice(0, 4));
const runMonth = (run: PayRun) => Number(run.periodStart.slice(5, 7)) - 1;

type Selection = { type: "month" | "quarter"; value: number };

/** Default to the most recent month that has actually been disbursed. */
function latestDisbursedMonth(year: number) {
  const months = payRuns
    .filter((run) => runYear(run) === year && run.status === "Disbursed")
    .map(runMonth);
  return months.length ? Math.max(...months) : 0;
}

export default function PayslipsPage() {
  const router = useRouter();

  const [year, setYear] = useState(YEARS[0]);
  const [selection, setSelection] = useState<Selection>({
    type: "month",
    value: latestDisbursedMonth(YEARS[0]),
  });
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("");
  const [status, setStatus] = useState("");

  const departments = useMemo(
    () => Array.from(new Set(payslips.map((s) => s.dept))).sort(),
    [],
  );

  // Which months of the selected year have a pay run at all.
  const monthsWithData = useMemo(() => {
    const set = new Set<number>();
    payRuns.filter((r) => runYear(r) === year).forEach((r) => set.add(runMonth(r)));
    return set;
  }, [year]);

  const quarterHasData = (quarter: number) =>
    [0, 1, 2].some((offset) => monthsWithData.has(quarter * 3 + offset));

  // Runs covered by the current selection — one for a month, up to three for a quarter.
  const selectedRuns = payRuns.filter((run) => {
    if (runYear(run) !== year) return false;
    return selection.type === "month"
      ? runMonth(run) === selection.value
      : Math.floor(runMonth(run) / 3) === selection.value;
  });

  // A draft run has not paid anyone out yet.
  const effectiveStatus = (run: PayRun, slip: PayslipStatus): PayslipStatus =>
    run.status === "Disbursed" ? slip : "Pending";

  const rows = selectedRuns
    .slice()
    .sort((a, b) => runMonth(a) - runMonth(b))
    .flatMap((run) =>
      payslips.map((slip) => ({
        run,
        slip,
        status: effectiveStatus(run, slip.status),
      })),
    );

  const filtered = rows.filter(({ slip, status: rowStatus }) => {
    const q = search.toLowerCase();
    const matchesSearch =
      slip.name.toLowerCase().includes(q) || slip.dept.toLowerCase().includes(q);
    return (
      matchesSearch &&
      (dept ? slip.dept === dept : true) &&
      (status ? rowStatus === status : true)
    );
  });

  const totalNet = filtered.reduce((sum, { slip }) => sum + slip.netPay, 0);

  const periodLabel =
    selection.type === "month"
      ? (selectedRuns[0]?.period ?? `${MONTHS[selection.value]} ${year}`)
      : `Q${selection.value + 1} ${year}`;

  return (
    <div className="min-h-screen bg-[#f7f8fa] p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1f2937]">Payslips</h1>
          <p className="mt-1 text-sm text-[#6b7280]">
            View and download employee payslips by period.
          </p>
        </div>

        <button className="flex shrink-0 items-center gap-2 rounded-md border border-[#e5e7eb] bg-[#f3f4f6] px-4 py-2.5 text-sm font-medium text-[#374151] transition hover:bg-[#e9ebee]">
          <Download size={14} />
          Export CSV
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-5 lg:flex-row">
        {/* Sidebar filters */}
        <aside className="w-full space-y-4 lg:w-[240px] lg:shrink-0">
          <Card label="Year">
            <div className="grid grid-cols-2 gap-2">
              {YEARS.map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setYear(y)}
                  className={`h-10 rounded-md text-sm font-medium transition ${
                    y === year
                      ? "bg-[#1683d8] text-white"
                      : "border border-[#e5e7eb] bg-white text-[#374151] hover:bg-[#f9fafb]"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </Card>

          <Card label="Quarter shortcuts">
            <div className="space-y-2">
              {[0, 1, 2, 3].map((q) => {
                const enabled = quarterHasData(q);
                const active =
                  selection.type === "quarter" && selection.value === q;
                return (
                  <button
                    key={q}
                    type="button"
                    disabled={!enabled}
                    onClick={() => setSelection({ type: "quarter", value: q })}
                    className={`h-10 w-full rounded-md px-3 text-left text-sm font-medium transition ${
                      active
                        ? "bg-[#1683d8] text-white"
                        : enabled
                          ? "bg-[#f1f5f9] text-[#263447] hover:bg-[#e8edf3]"
                          : "cursor-not-allowed bg-[#f8fafc] text-[#cbd5e1]"
                    }`}
                  >
                    Q{q + 1} {year}
                    {!enabled && " (no data)"}
                  </button>
                );
              })}
            </div>
          </Card>

          <Card label="Month">
            <div className="grid grid-cols-3 gap-2">
              {MONTHS.map((month, i) => {
                const enabled = monthsWithData.has(i);
                const active =
                  selection.type === "month" && selection.value === i;
                return (
                  <button
                    key={month}
                    type="button"
                    disabled={!enabled}
                    onClick={() => setSelection({ type: "month", value: i })}
                    className={`h-9 rounded-md text-[13px] font-medium transition ${
                      active
                        ? "bg-[#1683d8] text-white"
                        : enabled
                          ? "border border-[#e5e7eb] bg-white text-[#374151] hover:bg-[#f9fafb]"
                          : "cursor-not-allowed bg-[#f8fafc] text-[#cbd5e1]"
                    }`}
                  >
                    {month}
                  </button>
                );
              })}
            </div>
          </Card>
        </aside>

        {/* Main */}
        <section className="min-w-0 flex-1">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employee or dept..."
              className="h-11 min-w-[220px] flex-1 rounded-md border border-[#e5e7eb] bg-white px-4 text-sm text-[#374151] outline-none placeholder:text-[#9ca3af] focus:border-[#1683d8]"
            />
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="h-11 w-[140px] rounded-md border border-[#e5e7eb] bg-white px-3 text-sm text-[#374151] outline-none focus:border-[#1683d8]"
            >
              <option value="">All Department</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-11 w-[110px] rounded-md border border-[#e5e7eb] bg-white px-3 text-sm text-[#374151] outline-none focus:border-[#1683d8]"
            >
              <option value="">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* Table card */}
          <div className="mt-4 rounded-lg border border-[#e5e7eb] bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f0f0f0] px-6 py-4">
              <h2 className="text-sm font-bold text-[#1f2937]">
                {periodLabel} · {filtered.length} payslip
                {filtered.length === 1 ? "" : "s"}
              </h2>
              <p className="text-xs text-[#6b7280]">
                Total Net:{" "}
                <span className="text-sm font-bold text-[#15803d]">
                  {naira(totalNet)}
                </span>
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#e5e7eb] text-xs text-[#6b7280]">
                    <th className="px-6 py-3 font-medium">Employee</th>
                    <th className="px-4 py-3 font-medium">Department</th>
                    <th className="px-4 py-3 font-medium">Period</th>
                    <th className="px-4 py-3 font-medium">Gross</th>
                    <th className="px-4 py-3 font-medium">Deductions</th>
                    <th className="px-4 py-3 font-medium">Net Pay</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-6 py-10 text-center text-sm text-[#9ca3af]"
                      >
                        No payslips found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map(({ run, slip, status: rowStatus }, index) => (
                      <tr
                        key={`${run.id}-${slip.id}`}
                        className={`border-b border-[#f0f0f0] last:border-b-0 ${
                          index % 2 === 1 ? "bg-[#f9fafb]" : "bg-white"
                        }`}
                      >
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#e8f4fd] text-[10px] font-semibold text-[#1683d8]">
                              {initials(slip.name)}
                            </span>
                            <div>
                              <p className="font-semibold text-[#1f2937]">
                                {slip.name}
                              </p>
                              <p className="mt-0.5 text-xs text-[#9ca3af]">
                                {slip.role}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[#6b7280]">{slip.dept}</td>
                        <td className="px-4 py-3 font-semibold text-[#1f2937]">
                          {run.period}
                        </td>
                        <td className="px-4 py-3 text-[#374151]">
                          {naira(slip.gross)}
                        </td>
                        <td className="px-4 py-3 text-[#ef4444]">
                          ({naira(totalDeductions(slip))})
                        </td>
                        <td className="px-4 py-3 font-semibold text-[#15803d]">
                          {naira(slip.netPay)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[rowStatus]}`}
                          >
                            {rowStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() =>
                              router.push(
                                `/payroll/payslips/${payslipRouteId(run, slip)}`,
                              )
                            }
                            className="rounded-md bg-[#e8f4fd] px-4 py-1.5 text-xs font-medium text-[#1683d8] transition hover:bg-[#d5eafb]"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Card({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-[#e5e7eb] bg-white p-4">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-wide text-[#9ca3af]">
        {label}
      </p>
      {children}
    </div>
  );
}
