// src/lib/payroll-create-static.ts
export type PayrollRow = {
  id: number;
  name: string;
  group: "Permanent Staff" | "Contract Staff" | "Consultant Staff";
  gross: number;
  tax: number;
  pension: number;
  net: number;
  bonus: number;
  deduction: number;
};

const names = [
  "Chloe Davis",
  "Lucas Carter",
  "William King",
  "Aidon Robinson",
  "Michael Young",
  "James Lee",
  "Daniel Turner",
  "Sophia Adams",
  "Olivia White",
  "Emily Johnson",
];

const groups: PayrollRow["group"][] = ["Permanent Staff", "Contract Staff", "Consultant Staff"];

export const payrollRows: PayrollRow[] = Array.from({ length: 120 }, (_, i) => {
  const gross = 150000;
  const tax = 10000;
  const pension = 5000;
  return {
    id: i + 1,
    name: i < names.length ? names[i] : `${names[i % names.length]} ${Math.floor(i / names.length) + 1}`,
    group: groups[i % groups.length],
    gross,
    tax,
    pension,
    net: gross - tax - pension,
    bonus: 5000,
    deduction: 2000,
  };
});

export const payrollStats = {
  totalSalary: 4140000,
  totalTax: 140000,
  totalEmployees: 60,
  totalPension: 540000,
};

export const groupFilterOptions = ["All Staff", "Permanent Staff", "Contract Staff", "Consultant Staff"];
export const monthFilterOptions = ["December", "November", "October"];
export const frequencyOptions = ["Once a Month", "Twice a Month", "Weekly"];
