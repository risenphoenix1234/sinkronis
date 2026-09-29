"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  Clock3,
  DollarSign,
  TrendingUp,
  Users,
  RefreshCw,
  Loader2,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getPayrollDashboard } from "@/lib/api/payroll";
import type { PayrollDashboardData, PayRunStatus } from "@/lib/api/payroll";

const MONTH_NAMES = [
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

function formatPeriodLabel(periodStr?: string | null): string {
  if (!periodStr) return "—";
  if (periodStr.includes("-")) {
    const [year, month] = periodStr.split("-");
    const mIndex = parseInt(month, 10) - 1;
    if (mIndex >= 0 && mIndex < 12) {
      const fullMonth = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ][mIndex];
      return `${fullMonth} ${year}`;
    }
  }
  return periodStr;
}

function formatShortMonth(periodStr?: string | null): string {
  if (!periodStr) return "";
  if (periodStr.includes("-")) {
    const [, month] = periodStr.split("-");
    const mIndex = parseInt(month, 10) - 1;
    if (mIndex >= 0 && mIndex < 12) {
      return MONTH_NAMES[mIndex];
    }
  }
  return periodStr;
}

export default function PayrollPage() {
  const router = useRouter();

  const [dashboardData, setDashboardData] =
    useState<PayrollDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPayrollDashboard();
      setDashboardData(data);
    } catch (err: unknown) {
      console.error("Failed to load payroll dashboard:", err);
      let errMsg = "Failed to load payroll dashboard. Please try again.";
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 403) {
          errMsg =
            "Access denied. Payroll module entitlement or permission required.";
        } else if (err.response?.data?.message) {
          errMsg = err.response.data.message;
        }
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const currencySymbol = dashboardData?.currency === "USD" ? "$" : "₦";

  const formatCurrency = useCallback(
    (value?: number | null) => {
      const val = typeof value === "number" ? value : 0;
      return `${currencySymbol}${val.toLocaleString("en-NG")}`;
    },
    [currencySymbol],
  );

  const formatCompact = useCallback(
    (value: number) => {
      if (value >= 1_000_000) {
        return `${currencySymbol}${(value / 1_000_000).toFixed(1)}M`;
      }
      if (value >= 1_000) {
        return `${currencySymbol}${(value / 1_000).toFixed(0)}K`;
      }
      return `${currencySymbol}${value}`;
    },
    [currencySymbol],
  );

  // Formatted data for Payroll Trend Line Chart
  const payrollTrendChartData = useMemo(() => {
    if (
      !dashboardData?.payrollTrend ||
      dashboardData.payrollTrend.length === 0
    ) {
      return [];
    }
    return dashboardData.payrollTrend.map((item) => ({
      month: formatShortMonth(item.period),
      period: item.period,
      gross: item.gross ?? 0,
      net: item.netPay ?? 0,
    }));
  }, [dashboardData]);

  // Formatted data for Deductions Trend Bar Chart
  const deductionTrendChartData = useMemo(() => {
    if (
      !dashboardData?.deductionTrend ||
      dashboardData.deductionTrend.length === 0
    ) {
      return [];
    }
    return dashboardData.deductionTrend.map((item) => ({
      month: formatShortMonth(item.period),
      period: item.period,
      paye: item.paye ?? 0,
      pension: item.pension ?? 0,
      nhf: item.nhf ?? 0,
    }));
  }, [dashboardData]);

  // Department cost max for percentage width calculation
  const maxDepartmentCost = useMemo(() => {
    const items = dashboardData?.departmentCosts?.items ?? [];
    if (items.length === 0) return 0;
    return Math.max(...items.map((i) => i.grossAmount || 0));
  }, [dashboardData]);

  // Max value for line chart Y-axis
  const maxTrendValue = useMemo(() => {
    if (payrollTrendChartData.length === 0) return 1000000;
    const max = Math.max(
      ...payrollTrendChartData.map((d) => Math.max(d.gross, d.net)),
    );
    return max > 0 ? Math.ceil(max * 1.15) : 1000000;
  }, [payrollTrendChartData]);

  const renderStatusBadge = (status?: PayRunStatus | string) => {
    switch (status) {
      case "DISBURSED":
      case "PAID":
      case "APPROVED":
        return (
          <span className="inline-flex rounded-full bg-[#DCFCE7] px-2.5 py-1 text-xs font-medium text-[#15803D]">
            {status.replace(/_/g, " ")}
          </span>
        );
      case "DRAFT":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-2.5 py-1 text-xs font-medium text-[#A16207]">
            <Clock3 size={11} />
            Draft
          </span>
        );
      case "PENDING_APPROVAL":
      case "PENDING_DISBURSEMENT":
      case "PROCESSING":
      case "DISBURSING":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#DBEAFE] px-2.5 py-1 text-xs font-medium text-[#1E40AF]">
            <Clock size={11} />
            {status.replace(/_/g, " ")}
          </span>
        );
      case "FAILED":
      case "CANCELLED":
        return (
          <span className="inline-flex rounded-full bg-[#FEE2E2] px-2.5 py-1 text-xs font-medium text-[#B91C1C]">
            {status.replace(/_/g, " ")}
          </span>
        );
      default:
        return (
          <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            {status || "Unknown"}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
        <Loader2 className="h-9 w-9 animate-spin text-[#1683D8]" />
        <p className="mt-3 text-sm font-medium text-slate-600">
          Loading payroll dashboard…
        </p>
      </main>
    );
  }

  const summary = dashboardData?.summary;
  const pendingApproval = dashboardData?.pendingApproval;
  const departmentCosts = dashboardData?.departmentCosts;
  const statutoryObligations = dashboardData?.statutoryObligations;
  const recentPayRuns = dashboardData?.recentPayRuns ?? [];
  const actions = dashboardData?.actions;

  const currentPeriodLabel = formatPeriodLabel(dashboardData?.period);

  return (
    <main className="min-h-screen bg-[#F8F9FA] p-4 text-[#263342] sm:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1F2937]">Payroll</h1>
          <p className="mt-1 text-base text-[#6B7280]">
            Manage salary processing, statutory deductions, and disbursements
            for {currentPeriodLabel}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* <button
            type="button"
            onClick={loadDashboard}
            title="Refresh dashboard"
            className="flex items-center gap-1.5 rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-medium text-[#6B7280] shadow-2xs hover:bg-[#F8FAFC]"
          >
            <RefreshCw size={13} />
            <span>Refresh</span>
          </button> */}

          <button
            type="button"
            disabled={actions?.canRunPayroll === false}
            onClick={() => router.push("/payroll/pay-runs")}
            className="flex w-fit items-center gap-2 rounded-md bg-[#1683D8] px-5 py-2.5 text-sm font-medium text-white shadow-2xs transition hover:bg-[#0F74C2] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/70 text-[10px]">
              ▶
            </span>
            Run Payroll
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Employees on Payroll",
            value: String(summary?.employeesOnPayroll ?? 0),
            subtitle: "Active employees",
            icon: <Users size={19} />,
            iconBg: "bg-[#DBEAFE]",
            iconColor: "text-[#1683D8]",
          },
          {
            title: "Total Monthly Cost",
            value: formatCurrency(summary?.totalMonthlyCost?.amount),
            subtitle: `Period: ${formatPeriodLabel(summary?.totalMonthlyCost?.period)}`,
            icon: <DollarSign size={19} />,
            iconBg: "bg-[#DCFCE7]",
            iconColor: "text-[#16A34A]",
          },
          {
            title: "Last Run Net Pay",
            value: summary?.lastRunNetPay
              ? formatCurrency(summary.lastRunNetPay.amount)
              : "₦0",
            subtitle: summary?.lastRunNetPay
              ? formatPeriodLabel(summary.lastRunNetPay.period)
              : "No prior run recorded",
            icon: <TrendingUp size={19} />,
            iconBg: "bg-[#F3E8FF]",
            iconColor: "text-[#9333EA]",
          },
          {
            title: "Pending Disbursement",
            value: summary?.pendingDisbursement
              ? formatCurrency(summary.pendingDisbursement.amount)
              : "₦0",
            subtitle: summary?.pendingDisbursement
              ? `${formatPeriodLabel(summary.pendingDisbursement.period)} (${summary.pendingDisbursement.status || "Pending"})`
              : "No pending disbursements",
            icon: <Clock size={19} />,
            iconBg: "bg-[#FEF3C7]",
            iconColor: "text-[#D97706]",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-2xs"
          >
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-[#6B7280]">{card.title}</p>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-md ${card.iconBg}`}
              >
                <span className={card.iconColor}>{card.icon}</span>
              </div>
            </div>

            <p className="mt-3 text-2xl font-bold text-[#1F2937]">
              {card.value}
            </p>

            <p className="mt-1 text-sm text-[#9CA3AF] truncate">
              {card.subtitle}
            </p>
          </div>
        ))}
      </div>

      {/* Pending Approval Banner (only displayed if pendingApproval exists) */}
      {pendingApproval && (
        <div className="mt-6 flex flex-col gap-4 rounded-md border border-[#FDE68A] bg-[#FFFBEB] px-5 py-4 sm:flex-row sm:items-center sm:justify-between shadow-2xs">
          <div className="flex items-start gap-3">
            <AlertTriangle
              size={20}
              className="mt-0.5 shrink-0 text-[#D97706]"
            />
            <div>
              <p className="text-sm font-semibold text-[#1F2937]">
                {formatPeriodLabel(pendingApproval.period)} payroll is pending
                approval
              </p>
              <p className="mt-1 text-sm text-[#6B7280]">
                {pendingApproval.employees} employees · Total net:{" "}
                {formatCurrency(pendingApproval.totalNet)}
                {pendingApproval.createdAt &&
                  ` · Created ${new Date(
                    pendingApproval.createdAt,
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push(
                pendingApproval.payRunId
                  ? `/payroll/pay-runs/${pendingApproval.payRunId}`
                  : "/payroll/pay-runs",
              )
            }
            className="flex w-fit shrink-0 items-center gap-2 rounded-md bg-[#8A6100] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#705000]"
          >
            Review & Approve
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Payroll Trend */}
        <section className="rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#1F2937]">
                6-Month Payroll Cost Trend
              </h2>
              <p className="mt-1 text-sm text-[#6B7280]">
                Gross vs Net Pay trend across recent pay periods
              </p>
            </div>
          </div>

          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={payrollTrendChartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#F0F0F0"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={formatCompact}
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, maxTrendValue]}
                />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{
                    fontSize: 13,
                    color: "#6B7280",
                    paddingTop: 8,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="gross"
                  name="Gross"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="net"
                  name="Net Pay"
                  stroke="#16A34A"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Deductions Breakdown */}
        <section className="rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-2xs">
          <h2 className="text-base font-semibold text-[#1F2937]">
            Monthly Deductions Breakdown
          </h2>
          <p className="mt-1 text-sm text-[#6B7280]">
            PAYE, Pension, and NHF contributions
          </p>

          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deductionTrendChartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#F0F0F0"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={formatCompact}
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend
                  verticalAlign="bottom"
                  iconType="square"
                  wrapperStyle={{
                    fontSize: 13,
                    color: "#6B7280",
                    paddingTop: 8,
                  }}
                />
                <Bar
                  dataKey="paye"
                  name="PAYE"
                  stackId="a"
                  fill="#EF4444"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="pension"
                  name="Pension"
                  stackId="a"
                  fill="#A16207"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="nhf"
                  name="NHF"
                  stackId="a"
                  fill="#9333EA"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* Department Payroll + Sidebar */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,3fr)_320px]">
        {/* Department Payroll */}
        <section className="flex flex-col min-h-[440px] rounded-lg border border-[#E5E7EB] bg-white shadow-2xs">
          <div className="border-b border-[#E5E7EB] px-5 py-4">
            <h2 className="text-base font-semibold text-[#263342]">
              Department Payroll Cost —{" "}
              {formatPeriodLabel(
                departmentCosts?.period || dashboardData?.period,
              )}
            </h2>
            <p className="mt-1 text-sm text-[#8492A6]">
              Gross salary distributed by department
            </p>
          </div>

          <div className="flex-1 p-5">
            {!departmentCosts?.items || departmentCosts.items.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center text-center text-sm text-[#8492A6]">
                <p>No department payroll cost recorded for this period.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {departmentCosts.items.map((department) => {
                  const widthPercent =
                    maxDepartmentCost > 0
                      ? Math.max(
                          8,
                          Math.round(
                            (department.grossAmount / maxDepartmentCost) * 100,
                          ),
                        )
                      : 0;

                  return (
                    <div
                      key={department.departmentId || department.departmentName}
                      className="grid grid-cols-[130px_minmax(0,1fr)_100px] items-center gap-3"
                    >
                      <span
                        className="truncate text-right text-xs font-medium text-[#667085]"
                        title={department.departmentName}
                      >
                        {department.departmentName}
                      </span>

                      <div className="relative h-5 w-full rounded-sm bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-sm bg-[#2587C8] transition-all duration-300"
                          style={{ width: `${widthPercent}%` }}
                        />
                      </div>

                      <span className="text-right text-xs font-semibold text-[#1F2937]">
                        {formatCurrency(department.grossAmount)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Sidebar: Statutory Obligations + Quick Actions */}
        <div className="space-y-4">
          {/* Statutory Obligations */}
          <section className="rounded-lg border border-[#E5E7EB] bg-white shadow-2xs">
            <div className="border-b border-[#E5E7EB] px-5 py-4">
              <h2 className="text-base font-semibold text-[#1F2937]">
                Statutory Obligations
              </h2>
              <p className="mt-0.5 text-xs text-[#8492A6]">
                {formatPeriodLabel(
                  statutoryObligations?.period || dashboardData?.period,
                )}
              </p>
            </div>

            <div className="divide-y divide-[#F0F2F5] px-5">
              {!statutoryObligations?.items ||
              statutoryObligations.items.length === 0 ? (
                <div className="py-6 text-center text-xs text-[#8492A6]">
                  No statutory obligations recorded.
                </div>
              ) : (
                statutoryObligations.items.map((item) => {
                  const dueLabel = item.dueDate
                    ? `Due ${new Date(item.dueDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}`
                    : "No due date";

                  return (
                    <div key={item.id} className="py-3">
                      <div className="flex items-start justify-between gap-3">
                        <p
                          className="text-sm font-medium text-[#263342] truncate"
                          title={item.label || item.type}
                        >
                          {item.label || item.type}
                        </p>
                        <span className="whitespace-nowrap text-sm font-semibold text-[#1F2937]">
                          {formatCurrency(item.amount)}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-[#98A2B3]">
                          {dueLabel}
                        </span>

                        {item.status === "REMITTED" ? (
                          <span className="flex items-center gap-1 rounded-full bg-[#DCFCE7] px-2.5 py-0.5 text-xs font-medium text-[#15803D]">
                            <CheckCircle2 size={11} />
                            Remitted
                          </span>
                        ) : item.status === "OVERDUE" ? (
                          <span className="flex items-center gap-1 rounded-full bg-[#FEE2E2] px-2.5 py-0.5 text-xs font-medium text-[#B91C1C]">
                            <AlertTriangle size={11} />
                            Overdue
                          </span>
                        ) : (
                          <span className="rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-xs font-medium text-[#A16207]">
                            Due
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* Quick Actions */}
          <section className="rounded-lg border border-[#E5E7EB] bg-white shadow-2xs">
            <div className="border-b border-[#E5E7EB] px-5 py-4">
              <h2 className="text-base font-semibold text-[#1F2937]">
                Quick Actions
              </h2>
            </div>

            <div>
              {[
                {
                  label: "Run Payroll",
                  href: "/payroll/pay-runs",
                  enabled: actions?.canRunPayroll !== false,
                },
                {
                  label: "View Payslips",
                  href: "/payroll/payslips",
                  enabled: actions?.canViewPayslips !== false,
                },
                {
                  label: "PAYE Remittance",
                  href: "/payroll/tax",
                  enabled: true,
                },
                {
                  label: "Pension Schedule",
                  href: "/payroll/pension",
                  enabled: true,
                },
                {
                  label: "Payroll Reports",
                  href: "/payroll/reports",
                  enabled: true,
                },
                {
                  label: "Manage Deductions",
                  href: "/payroll/deductions",
                  enabled: actions?.canManageDeductions !== false,
                },
              ].map((action) => (
                <button
                  key={action.label}
                  type="button"
                  disabled={!action.enabled}
                  onClick={() => router.push(action.href)}
                  className="flex w-full items-center justify-between border-b border-[#F0F2F5] px-5 py-3 text-left text-sm text-[#344054] transition hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed last:border-none"
                >
                  <span>{action.label}</span>
                  <ChevronRight size={15} className="text-[#98A2B3]" />
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Recent Pay Runs */}
      <section className="mt-6 overflow-hidden rounded-lg border border-[#E5E7EB] bg-white shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
          <h2 className="text-base font-semibold text-[#1F2937]">
            Recent Pay Runs
          </h2>

          <button
            type="button"
            onClick={() => router.push("/payroll/pay-runs")}
            className="flex items-center gap-1 text-sm font-medium text-[#2388D0] hover:underline"
          >
            View all
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-slate-50/50 text-left">
                {[
                  "Period",
                  "Employees",
                  "Gross",
                  "Net Pay",
                  "PAYE",
                  "Status",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-5 py-3 text-xs font-medium text-[#8492A6]"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {recentPayRuns.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-8 text-center text-sm text-[#8492A6]"
                  >
                    No recent pay runs found for this organization.
                  </td>
                </tr>
              ) : (
                recentPayRuns.map((run, index) => (
                  <tr
                    key={run.id || `${run.period}-${index}`}
                    className={`border-b border-[#E5E7EB] transition hover:bg-slate-50/60 ${
                      index % 2 === 1 ? "bg-[#FBFBFC]" : "bg-white"
                    }`}
                  >
                    <td className="px-5 py-3.5 text-sm font-medium text-[#263342]">
                      {formatPeriodLabel(run.period)}
                    </td>

                    <td className="px-5 py-3.5 text-sm text-[#667085]">
                      {run.employees ?? 0}
                    </td>

                    <td className="px-5 py-3.5 text-sm text-[#667085]">
                      {formatCurrency(run.gross)}
                    </td>

                    <td className="px-5 py-3.5 text-sm font-semibold text-[#263342]">
                      {formatCurrency(run.netPay)}
                    </td>

                    <td className="px-5 py-3.5 text-sm text-[#FF4D4F]">
                      {formatCurrency(run.paye)}
                    </td>

                    <td className="px-5 py-3.5">
                      {renderStatusBadge(run.status)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
