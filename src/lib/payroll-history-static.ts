// src/lib/payroll-history-static.ts
export type RunStatus = "Pending" | "Paid";

export type PayRun = {
  id: string;
  name: string;
  title: string;
  range: string;
  payDate: string;
  employees: number;
  net: number;
  tax: number;
  pension: number;
  totalCharge: number | null;
  status: RunStatus;
};

const months = [
  { m: "June", range: "1 Jun - 28 Jun 2024" },
  { m: "May", range: "1 May - 28 May 2024" },
  { m: "April", range: "1 Apr - 28 Apr 2024" },
  { m: "March", range: "1 Mar - 28 Mar 2024" },
  { m: "February", range: "1 Feb - 28 Feb 2024" },
  { m: "January", range: "1 Jan - 28 Jan 2024" },
];

export const payRuns: PayRun[] = Array.from({ length: 17 }, (_, i) => {
  const base = months[i % months.length];
  const year = 2024 - Math.floor(i / months.length);
  const pending = i === 0;
  return {
    id: String(i + 1),
    name: `${base.m} Payroll`,
    title: `24th ${base.m} Payroll`,
    range: i < months.length ? base.range : base.range.replace("2024", String(year)),
    payDate: i === 0 ? "24 Feb 2024" : "24 Jan 2024",
    employees: pending ? 60 : 58,
    net: 700000,
    tax: 50000,
    pension: 30000,
    totalCharge: pending ? null : 4140000,
    status: pending ? "Pending" : "Paid",
  };
});

export const runSummary = {
  totalCharged: 4140000,
  totalSalaries: 1140000,
  totalEmployees: 60,
  totalTax: 30000,
  totalPension: 30000,
};

export type RunEmployee = {
  id: number;
  name: string;
  group: string;
  payment: number;
  tax: number;
  pension: number;
  takeHome: number;
  bonus: number;
};

const names = [
  "Lucas Carter",
  "Olivia White",
  "James Lee",
  "Daniel Walker",
  "David Turner",
  "Sophia Adams",
  "Emily Johnson",
  "Bright Adams",
];

export const runEmployees: RunEmployee[] = Array.from({ length: 120 }, (_, i) => ({
  id: i + 1,
  name: i < names.length ? names[i] : `${names[i % names.length]} ${Math.floor(i / names.length) + 1}`,
  group: "Permanent Staff",
  payment: 22000,
  tax: 22000,
  pension: 22000,
  takeHome: 22000,
  bonus: 22000,
}));

export const frequencyOptions = ["Once a Month", "Twice a Month", "Weekly"];
export const bonusModeOptions = ["Single Entry", "Multiple Entries"];
