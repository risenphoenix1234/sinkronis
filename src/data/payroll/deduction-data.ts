import { CustomDeduction, Loan } from "@/types/payroll/deduction-data";

export const loans: Loan[] = [
  {
    id: "1",
    employee: "Chukwuemeka Adeyemi",
    purpose: "Car Loan",
    principal: 2_000_000,
    outstanding: 1_200_000,
    monthly: 100_000,
    startDate: "2025-06-01",
    status: "Active",
  },
  {
    id: "2",
    employee: "Tunde Babatunde",
    purpose: "Personal Loan",
    principal: 500_000,
    outstanding: 250_000,
    monthly: 50_000,
    startDate: "2025-09-01",
    status: "Active",
  },
  {
    id: "3",
    employee: "Emeka Nwosu",
    purpose: "Home Improvement",
    principal: 800_000,
    outstanding: 640_000,
    monthly: 40_000,
    startDate: "2025-11-01",
    status: "Active",
  },
  {
    id: "4",
    employee: "Damilola Afolabi",
    purpose: "Laptop Purchase",
    principal: 300_000,
    outstanding: 150_000,
    monthly: 30_000,
    startDate: "2025-10-01",
    status: "Paused",
  },
];

export const customDeductions: CustomDeduction[] = [
  {
    id: "1",
    employee: "Ngozi Eze",
    deductionName: "Cooperative Contribution",
    monthlyAmount: 10_000,
    type: "Recurring",
  },
  {
    id: "2",
    employee: "Chiamaka Obi",
    deductionName: "Union Dues",
    monthlyAmount: 2_000,
    type: "Recurring",
  },
  {
    id: "3",
    employee: "Musa Danladi",
    deductionName: "Staff Welfare Fund",
    monthlyAmount: 5_000,
    type: "Recurring",
  },
  {
    id: "4",
    employee: "Rukayat Oladele",
    deductionName: "Cooperative Contribution",
    monthlyAmount: 15_000,
    type: "Recurring",
  },
];
