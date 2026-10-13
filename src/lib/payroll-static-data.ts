// src/lib/payroll-static-data.ts
export const payrollUserName = "Tochikwu";

export const overviewStats = [
  { label: "Total Payees", value: "100", change: "+4", note: "this month" },
  { label: "Active Payees", value: "92", change: "+2", note: "this month" },
  { label: "Next Payroll", value: "25 Apr", change: "", note: "in 5 days" },
  { label: "Pending Approvals", value: "3", change: "", note: "awaiting action" },
];

export const payrollSummaryTotal = 32600000;

export const monthlyPayroll = [
  { month: "Jan", amount: 24000000 },
  { month: "Feb", amount: 26500000 },
  { month: "Mar", amount: 28000000 },
  { month: "Apr", amount: 32600000 },
  { month: "May", amount: 0 },
  { month: "Jun", amount: 0 },
  { month: "Jul", amount: 0 },
  { month: "Aug", amount: 0 },
  { month: "Sep", amount: 0 },
  { month: "Oct", amount: 0 },
  { month: "Nov", amount: 0 },
  { month: "Dec", amount: 0 },
];

export const payeeGroups = [
  { name: "Permanent Staff", value: 60, color: "#6941C6" },
  { name: "Contract (Pensionable)", value: 8, color: "#2E90FA" },
  { name: "Contract (Regular)", value: 12, color: "#66C61C" },
  { name: "Consultant", value: 20, color: "#F79009" },
];

export const formatNaira = (n: number) => `₦${n.toLocaleString("en-NG")}`;
export const formatNairaExact = (n: number) =>
  `₦${n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const formatMillions = (n: number) => `₦${(n / 1_000_000).toFixed(1)}M`;
