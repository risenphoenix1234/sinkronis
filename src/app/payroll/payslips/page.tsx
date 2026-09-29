// app/payroll/payslips/page.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Download, Loader2 } from "lucide-react";
import {
  initials,
} from "@/types/payroll/pay-run-data";
import { naira } from "@/types/payroll/payee-data";
import {
  getTenantPayslips,
  exportTenantPayslipsCsv,
  GetPayslipsData,
  PayslipListItem,
  PayslipsQuarterParam,
} from "@/lib/api/payroll";
import { toast } from "react-toastify";

/* =========================================================
   CONSTANTS
========================================================= */

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

const statusStyles: Record<string, string> = {
  Paid: "bg-[#dcfce7] text-[#15803d]",
  Pending: "bg-[#fef9c3] text-[#a16207]",
  PAID: "bg-[#dcfce7] text-[#15803d]",
  PENDING: "bg-[#fef9c3] text-[#a16207]",
  READY: "bg-[#e0e7ff] text-[#4338ca]",
  FAILED: "bg-[#fee2e2] text-[#b91c1c]",
};

type Selection = { type: "month" | "quarter"; value: number };

/** Convert a numeric quarter index (0-3) to the "Q1"-"Q4" string the API expects. */
function quarterParam(q: number): PayslipsQuarterParam {
  return `Q${q + 1}` as PayslipsQuarterParam;
}

/* =========================================================
   PAGE
========================================================= */

export default function PayslipsPage() {
  const router = useRouter();

  // ── Filter state ──────────────────────────────────────
  const [year, setYear] = useState(YEARS[0]);
  const [selection, setSelection] = useState<Selection>({
    type: "month",
    value: new Date().getMonth(),
  });
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("");
  const [status, setStatus] = useState("");

  // ── API state ─────────────────────────────────────────
  const [apiData, setApiData] = useState<GetPayslipsData | null>(null);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [exportingCsv, setExportingCsv] = useState(false);

  /* =====================================================
     FETCH
  ===================================================== */

  const fetchPayslips = useCallback(async () => {
    setApiLoading(true);
    setApiError(null);

    try {
      const params: Parameters<typeof getTenantPayslips>[0] = {
        year,
        ...(selection.type === "month"
          ? { month: selection.value + 1 }
          : { quarter: quarterParam(selection.value) }),
        ...(dept ? { departmentId: dept } : {}),
        ...(status ? { status: status as PayslipListItem["status"] } : {}),
        ...(search ? { search } : {}),
        limit: 50,
      };
      const res = await getTenantPayslips(params);
      setApiData(res.data);
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { status?: number; data?: { message?: string } };
      };
      if (axiosErr.response?.status === 403) {
        setApiError(
          "You do not have permission to view tenant payslips (payroll:payslips:view required).",
        );
      } else {
        setApiError(
          axiosErr.response?.data?.message ?? "Failed to load payslips.",
        );
      }
    } finally {
      setApiLoading(false);
    }
  }, [year, selection, dept, status, search]);

  /* =====================================================
     EXPORT CSV
  ===================================================== */

  const handleExportCsv = async () => {
    if (exportingCsv) return;
    setExportingCsv(true);
    try {
      const params: Parameters<typeof exportTenantPayslipsCsv>[0] = {
        year,
        ...(selection.type === "month"
          ? { month: selection.value + 1 }
          : { quarter: quarterParam(selection.value) }),
        ...(dept ? { departmentId: dept } : {}),
        ...(status ? { status: status as PayslipListItem["status"] } : {}),
        ...(search ? { search } : {}),
      };
      const blob = await exportTenantPayslipsCsv(params);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payslips_${year}${selection.type === "month" ? `_${MONTHS[selection.value]}` : `_Q${selection.value + 1}`}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Payslips exported successfully");
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { status?: number; data?: Blob | { message?: string } };
      };
      let errorMsg = "Failed to export payslips. Please try again.";
      if (axiosErr.response?.status === 403) {
        errorMsg =
          "You do not have permission to export payslips (payroll:payslips:view required).";
      } else if (axiosErr.response?.data instanceof Blob) {
        try {
          const text = await axiosErr.response.data.text();
          const parsed = JSON.parse(text);
          if (parsed?.message) {
            errorMsg = parsed.message;
          }
        } catch {
          // ignore parsing error
        }
      } else if (
        axiosErr.response?.data &&
        typeof axiosErr.response.data === "object" &&
        "message" in axiosErr.response.data
      ) {
        errorMsg =
          (axiosErr.response.data as { message?: string }).message || errorMsg;
      }
      toast.error(errorMsg);
    } finally {
      setExportingCsv(false);
    }
  };

  useEffect(() => {
    fetchPayslips();
  }, [fetchPayslips]);

  /* =====================================================
     DERIVED DATA
  ===================================================== */

  // Available years — dynamically merge API filter years with default YEARS
  const availableYears = useMemo(() => {
    if (apiData?.filters?.years && apiData.filters.years.length > 0) {
      return Array.from(new Set([...apiData.filters.years, ...YEARS])).sort(
        (a, b) => b - a,
      );
    }
    return YEARS;
  }, [apiData]);

  // Years/months with data from API filter metadata
  const monthsWithData = useMemo<Set<number>>(() => {
    if (apiData && apiData.filters.months.length > 0) {
      return new Set(apiData.filters.months.map((m) => m - 1)); // API is 1-based
    }
    return new Set<number>();
  }, [apiData]);

  const quarterHasData = (quarter: number) =>
    [0, 1, 2].some((offset) => monthsWithData.has(quarter * 3 + offset));

  // Departments for dropdown
  const departments = useMemo(() => {
    if (apiData && apiData.filters.departments.length > 0) {
      return apiData.filters.departments.map((d) => ({
        id: d.id,
        name: d.name,
      }));
    }
    return [];
  }, [apiData]);

  // API payslips
  const apiRows: PayslipListItem[] = apiData?.payslips ?? [];

  // Period label
  const periodLabel =
    apiData?.period.label ??
    (selection.type === "month"
      ? `${MONTHS[selection.value]} ${year}`
      : `Q${selection.value + 1} ${year}`);

  // Total net pay
  const totalNet = apiData?.totals.totalNetPay ?? 0;

  // Row count label
  const rowCount = apiRows.length;

  /* =====================================================
     UI
  ===================================================== */

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

        <button
          onClick={handleExportCsv}
          disabled={exportingCsv}
          className="flex shrink-0 items-center gap-2 rounded-md border border-[#e5e7eb] bg-[#f3f4f6] px-4 py-2.5 text-sm font-medium text-[#374151] transition hover:bg-[#e9ebee] disabled:opacity-60"
        >
          {exportingCsv ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Download size={14} />
          )}
          {exportingCsv ? "Exporting..." : "Export CSV"}
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-5 lg:flex-row">
        {/* ───────────────────────────────────────────────
            SIDEBAR FILTERS
        ─────────────────────────────────────────────── */}
        <aside className="w-full space-y-4 lg:w-[240px] lg:shrink-0">
          <Card label="Year">
            <div className="grid grid-cols-2 gap-2">
              {availableYears.map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setYear(y)}
                  className={`h-10 rounded-md text-sm font-medium transition ${y === year
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
                const active =
                  selection.type === "quarter" && selection.value === q;
                return (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setSelection({ type: "quarter", value: q })}
                    className={`h-10 w-full rounded-md px-3 text-left text-sm font-medium transition ${active
                        ? "bg-[#1683d8] text-white"
                        : "bg-[#f1f5f9] text-[#263447] hover:bg-[#e8edf3]"
                      }`}
                  >
                    Q{q + 1} {year}
                  </button>
                );
              })}
            </div>
          </Card>

          <Card label="Month">
            <div className="grid grid-cols-3 gap-2">
              {MONTHS.map((month, i) => {
                const active =
                  selection.type === "month" && selection.value === i;
                return (
                  <button
                    key={month}
                    type="button"
                    onClick={() => setSelection({ type: "month", value: i })}
                    className={`h-9 rounded-md text-[13px] font-medium transition ${active
                        ? "bg-[#1683d8] text-white"
                        : "border border-[#e5e7eb] bg-white text-[#374151] hover:bg-[#f9fafb]"
                      }`}
                  >
                    {month}
                  </button>
                );
              })}
            </div>
          </Card>
        </aside>

        {/* ───────────────────────────────────────────────
            MAIN CONTENT
        ─────────────────────────────────────────────── */}
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
              className="h-11 w-[160px] rounded-md border border-[#e5e7eb] bg-white px-3 text-sm text-[#374151] outline-none focus:border-[#1683d8]"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-11 w-[120px] rounded-md border border-[#e5e7eb] bg-white px-3 text-sm text-[#374151] outline-none focus:border-[#1683d8]"
            >
              <option value="">All Status</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="READY">Ready</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>

          {/* Table card */}
          <div className="mt-4 rounded-lg border border-[#e5e7eb] bg-white">
            {/* Table header bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f0f0f0] px-6 py-4">
              <h2 className="text-sm font-bold text-[#1f2937]">
                {periodLabel} · {rowCount} payslip{rowCount === 1 ? "" : "s"}
              </h2>
              <p className="text-xs text-[#6b7280]">
                Total Net:{" "}
                <span className="text-sm font-bold text-[#15803d]">
                  {naira(totalNet)}
                </span>
              </p>
            </div>

            {/* Loading */}
            {apiLoading && (
              <div className="flex flex-col items-center justify-center py-16 text-[#9ca3af]">
                <Loader2 className="h-7 w-7 animate-spin text-[#1683d8]" />
                <p className="mt-3 text-sm font-medium text-[#6b7280]">
                  Loading payslips...
                </p>
              </div>
            )}

            {/* Table */}
            {!apiLoading && (
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
                    {/* ── API rows ── */}
                    {apiRows.length > 0 &&
                      apiRows.map((row, index) => (
                        <tr
                          key={row.id}
                          className={`border-b border-[#f0f0f0] last:border-b-0 ${index % 2 === 1 ? "bg-[#f9fafb]" : "bg-white"
                            }`}
                        >
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-3">
                              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#e8f4fd] text-[10px] font-semibold text-[#1683d8]">
                                {initials(row.employeeName)}
                              </span>
                              <div>
                                <p className="font-semibold text-[#1f2937]">
                                  {row.employeeName}
                                </p>
                                <p className="mt-0.5 text-xs text-[#9ca3af]">
                                  {row.jobTitle ?? row.employeeCode ?? ""}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-[#6b7280]">
                            {row.departmentName ?? "—"}
                          </td>
                          <td className="px-4 py-3 font-semibold text-[#1f2937]">
                            {row.period}
                          </td>
                          <td className="px-4 py-3 text-[#374151]">
                            {naira(row.grossPay)}
                          </td>
                          <td className="px-4 py-3 text-[#ef4444]">
                            ({naira(row.totalDeductions)})
                          </td>
                          <td className="px-4 py-3 font-semibold text-[#15803d]">
                            {naira(row.netPay)}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[row.status] ??
                                "bg-[#f3f4f6] text-[#6b7280]"
                                }`}
                            >
                              {row.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() =>
                                router.push(`/payroll/payslips/${row.id}`)
                              }
                              className="rounded-md bg-[#e8f4fd] px-4 py-1.5 text-xs font-medium text-[#1683d8] transition hover:bg-[#d5eafb]"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}

                    {/* ── Empty state ── */}
                    {!apiLoading &&
                      !apiError &&
                      apiRows.length === 0 && (
                        <tr>
                          <td
                            colSpan={8}
                            className="px-6 py-10 text-center text-sm text-[#9ca3af]"
                          >
                            No payslips found for {periodLabel}.
                          </td>
                        </tr>
                      )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

/* =========================================================
   CARD (sidebar section wrapper — preserved)
========================================================= */

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
