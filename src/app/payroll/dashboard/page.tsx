"use client";

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

const grossNetData = [
  { month: "Jan", gross: 10313640, net: 7045122 },
  { month: "Feb", gross: 10313640, net: 7045122 },
  { month: "Mar", gross: 10313640, net: 7045122 },
  { month: "Apr", gross: 10313640, net: 7045122 },
  { month: "May", gross: 10313640, net: 7045122 },
  { month: "Jun", gross: 10313640, net: 7045122 },
];

const deductionsData = [
  { month: "Jan", paye: 900000, pension: 750000, nhf: 2200000 },
  { month: "Feb", paye: 900000, pension: 750000, nhf: 2100000 },
  { month: "Mar", paye: 900000, pension: 750000, nhf: 2150000 },
  { month: "Apr", paye: 900000, pension: 750000, nhf: 2250000 },
  { month: "May", paye: 900000, pension: 750000, nhf: 2300000 },
  { month: "Jun", paye: 900000, pension: 750000, nhf: 2200000 },
];

const departmentPayroll = [
  { name: "Finance", width: "100%" },
  { name: "Sales & Marketing", width: "81%" },
  { name: "IT & Technology", width: "76%" },
  { name: "Human Resources", width: "70%" },
  { name: "Legal & Compliance", width: "62%" },
  { name: "Operations", width: "50%" },
  { name: "Customer Support", width: "15%" },
];

const obligations = [
  {
    title: "PAYE (LIRS/FCT-IRS/RIRS)",
    amount: "₦1,207,418",
    due: "Due Jul 21, 2026",
    status: "Remitted",
    type: "success",
  },
  {
    title: "Pension (Employee + Employer)",
    amount: "₦1,577,160",
    due: "Due Jul 7, 2026",
    status: "Due",
    type: "warning",
  },
  {
    title: "NHF Remittance",
    amount: "₦168,500",
    due: "Due Jul 14, 2026",
    status: "Remitted",
    type: "success",
  },
  {
    title: "NSITF (Employer)",
    amount: "₦93,440",
    due: "Due Jul 31, 2026",
    status: "Due",
    type: "warning",
  },
];

const quickActions = [
  "Run Payroll",
  "View Payslips",
  "PAYE Remittance",
  "Pension Schedule",
  "Payroll Reports",
  "Manage Deductions",
];

const payRuns = [
  {
    period: "June 2026",
    employees: 18,
    gross: "₦9,344,000",
    netPay: "₦7,045,122",
    paye: "₦1,207,418",
    status: "Draft",
  },
  {
    period: "May 2026",
    employees: 18,
    gross: "₦9,344,000",
    netPay: "₦7,045,122",
    paye: "₦1,207,418",
    status: "Disbursed",
  },
  {
    period: "April 2026",
    employees: 18,
    gross: "₦9,344,000",
    netPay: "₦7,045,122",
    paye: "₦1,207,418",
    status: "Disbursed",
  },
  {
    period: "March 2026",
    employees: 18,
    gross: "₦9,344,000",
    netPay: "₦7,045,122",
    paye: "₦1,207,418",
    status: "Disbursed",
  },
  {
    period: "February 2026",
    employees: 18,
    gross: "₦9,344,000",
    netPay: "₦7,045,122",
    paye: "₦1,207,418",
    status: "Disbursed",
  },
];

export default function PayrollPage() {
  const formatNaira = (value: number) => `₦${value.toLocaleString("en-NG")}`;

  const formatCompact = (value: number) => {
    if (value >= 1_000_000) {
      return `₦${(value / 1_000_000).toFixed(1)}M`;
    }

    if (value >= 1_000) {
      return `₦${(value / 1_000).toFixed(0)}K`;
    }

    return `₦${value}`;
  };

  return (
    <main className="min-h-screen bg-[#F8F9FA] p-4 text-[#263342] sm:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Payroll</h1>

          <p className="mt-1 text-base text-[#6B7280]">
            Manage salary processing, statutory deductions, and disbursements.
          </p>
        </div>

        <button
          type="button"
          className="flex w-fit items-center gap-2 rounded-md bg-[#1683D8] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#0F74C2]"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/70 text-[10px]">
            ▶
          </span>
          Run Payroll
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Employees on Payroll",
            value: "16",
            subtitle: "Active employees",
            icon: <Users size={19} />,
            iconBg: "bg-[#DBEAFE]",
            iconColor: "text-[#1683D8]",
          },
          {
            title: "Total Monthly Cost",
            value: formatNaira(10313640),
            subtitle: "Incl. employer pension",
            icon: <DollarSign size={19} />,
            iconBg: "bg-[#DCFCE7]",
            iconColor: "text-[#16A34A]",
          },
          {
            title: "Last Run Net Pay",
            value: formatNaira(7045122),
            subtitle: "May 2026",
            icon: <TrendingUp size={19} />,
            iconBg: "bg-[#F3E8FF]",
            iconColor: "text-[#9333EA]",
          },
          {
            title: "Pending Disbursement",
            value: formatNaira(7045122),
            subtitle: "June 2026",
            icon: <Clock size={19} />,
            iconBg: "bg-[#FEF3C7]",
            iconColor: "text-[#D97706]",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-lg border border-[#E5E7EB] bg-white p-5"
          >
            <div className="flex items-start justify-between">
              <p className="text-sm text-[#6B7280]">{card.title}</p>

              <div
                className={`flex h-9 w-9 items-center justify-center rounded-md ${card.iconBg}`}
              >
                <span className={card.iconColor}>{card.icon}</span>
              </div>
            </div>

            <p className="mt-3 text-2xl font-bold text-[#1F2937]">
              {card.value}
            </p>

            <p className="mt-1 text-sm text-[#9CA3AF]">{card.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Approval Banner */}
      <div className="mt-6 flex flex-col gap-4 rounded-md border border-[#FDE68A] bg-[#FFFBEB] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="mt-0.5 shrink-0 text-[#D97706]" />

          <div>
            <p className="text-sm font-semibold text-[#1F2937]">
              June 2026 payroll is pending approval
            </p>

            <p className="mt-1 text-sm text-[#6B7280]">
              18 employees · Total net: {formatNaira(7045122)} · Created Jun 18,
              2026
            </p>
          </div>
        </div>

        <button
          type="button"
          className="flex w-fit shrink-0 items-center gap-2 rounded-md bg-[#8A6100] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#705000]"
        >
          Review & Approve
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Payroll Trend */}
        <section className="rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-[#1F2937]">
            6-Month Payroll Cost Trend
          </h2>

          <p className="mt-1 text-sm text-[#6B7280]">
            Gross vs Net Pay — Jan to Jun 2026
          </p>

          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={grossNetData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#F0F0F0"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  tick={{
                    fontSize: 12,
                    fill: "#6B7280",
                  }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickLine={false}
                />

                <YAxis
                  tickFormatter={formatCompact}
                  tick={{
                    fontSize: 12,
                    fill: "#6B7280",
                  }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 10000000]}
                />

                <Tooltip formatter={(value) => formatNaira(Number(value))} />

                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{
                    fontSize: 13,
                    color: "#6B7280",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="gross"
                  name="Gross"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={false}
                />

                <Line
                  type="monotone"
                  dataKey="net"
                  name="Net Pay"
                  stroke="#16A34A"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Deductions */}
        <section className="rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-[#1F2937]">
            Monthly Deductions Breakdown
          </h2>

          <p className="mt-1 text-sm text-[#6B7280]">
            PAYE, Pension, NHF — Jan to Jun 2026
          </p>

          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deductionsData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#F0F0F0"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  tick={{
                    fontSize: 12,
                    fill: "#6B7280",
                  }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickLine={false}
                />

                <YAxis
                  tickFormatter={formatCompact}
                  tick={{
                    fontSize: 12,
                    fill: "#6B7280",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip formatter={(value) => formatNaira(Number(value))} />

                <Legend
                  verticalAlign="bottom"
                  iconType="square"
                  wrapperStyle={{
                    fontSize: 13,
                    color: "#6B7280",
                  }}
                />

                <Bar dataKey="paye" name="PAYE" stackId="a" fill="#EF4444" />

                <Bar
                  dataKey="pension"
                  name="Pension"
                  stackId="a"
                  fill="#A16207"
                />

                <Bar dataKey="nhf" name="NHF" stackId="a" fill="#9333EA" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* Department Payroll + Sidebar */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,3fr)_280px]">
        {/* Department Payroll */}
        <section className="min-h-[495px] overflow-hidden rounded-lg border border-[#E5E7EB] bg-white">
          <div className="border-b border-[#E5E7EB] px-5 py-4">
            <h2 className="text-base font-semibold text-[#263342]">
              Department Payroll Cost — May 2026
            </h2>

            <p className="mt-1 text-sm text-[#8492A6]">
              Gross salary by department
            </p>
          </div>

          <div className="px-5 py-5">
            <div className="space-y-3">
              {departmentPayroll.map((department) => (
                <div
                  key={department.name}
                  className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-3"
                >
                  <span className="text-right text-xs text-[#667085]">
                    {department.name}
                  </span>

                  <div className="relative h-5">
                    <div
                      className="h-full rounded-sm bg-[#2587C8]"
                      style={{
                        width: department.width,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Axis */}
            <div className="ml-[123px] mt-3 flex justify-between text-xs text-[#98A2B3]">
              <span>₦0K</span>
              <span>₦550K</span>
              <span>₦1.1M</span>
              <span>₦1.6M</span>
              <span>₦2.2M</span>
            </div>
          </div>
        </section>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Statutory Obligations */}
          <section className="rounded-lg border border-[#E5E7EB] bg-white">
            <div className="border-b border-[#E5E7EB] px-5 py-4">
              <h2 className="text-base font-semibold">
                Statutory Obligations — May 2026
              </h2>
            </div>

            <div className="px-5">
              {obligations.map((item, index) => (
                <div
                  key={item.title}
                  className={`py-3 ${
                    index !== obligations.length - 1
                      ? "border-b border-[#F0F2F5]"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-[#263342]">
                      {item.title}
                    </p>

                    <span className="whitespace-nowrap text-sm font-semibold">
                      {item.amount}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-[#98A2B3]">{item.due}</span>

                    {item.type === "success" ? (
                      <span className="flex items-center gap-1 rounded-full bg-[#DCFCE7] px-2.5 py-1 text-xs font-medium text-[#15803D]">
                        <CheckCircle2 size={11} />
                        {item.status}
                      </span>
                    ) : (
                      <span className="rounded-full bg-[#FEF3C7] px-2.5 py-1 text-xs font-medium text-[#A16207]">
                        {item.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Actions */}
          <section className="rounded-lg border border-[#E5E7EB] bg-white">
            <div className="border-b border-[#E5E7EB] px-5 py-4">
              <h2 className="text-base font-semibold">Quick Actions</h2>
            </div>

            <div>
              {quickActions.map((action) => (
                <button
                  key={action}
                  type="button"
                  className="flex w-full items-center justify-between border-b border-[#F0F2F5] px-5 py-3.5 text-left text-sm text-[#344054] transition hover:bg-[#F8FAFC]"
                >
                  <span>{action}</span>

                  <ChevronRight size={16} className="text-[#98A2B3]" />
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Recent Pay Runs */}
      <section className="mt-6 overflow-hidden rounded-lg border border-[#E5E7EB] bg-white">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
          <h2 className="text-base font-semibold">Recent Pay Runs</h2>

          <button
            type="button"
            className="flex items-center gap-1 text-sm font-medium text-[#2388D0] hover:underline"
          >
            View all
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr className="border-b border-[#E5E7EB] text-left">
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
              {payRuns.map((run, index) => (
                <tr
                  key={run.period}
                  className={`border-b border-[#E5E7EB] ${
                    index % 2 === 1 ? "bg-[#F1F2F6]" : "bg-white"
                  }`}
                >
                  <td className="px-5 py-3.5 text-sm font-medium text-[#263342]">
                    {run.period}
                  </td>

                  <td className="px-5 py-3.5 text-sm text-[#667085]">
                    {run.employees}
                  </td>

                  <td className="px-5 py-3.5 text-sm text-[#667085]">
                    {run.gross}
                  </td>

                  <td className="px-5 py-3.5 text-sm font-semibold text-[#263342]">
                    {run.netPay}
                  </td>

                  <td className="px-5 py-3.5 text-sm text-[#FF4D4F]">
                    {run.paye}
                  </td>

                  <td className="px-5 py-3.5">
                    {run.status === "Draft" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-2.5 py-1 text-xs font-medium text-[#A16207]">
                        <Clock3 size={11} />
                        Draft
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-[#DCFCE7] px-2.5 py-1 text-xs font-medium text-[#15803D]">
                        Disbursed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
