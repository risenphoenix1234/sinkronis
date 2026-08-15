// src/lib/tenant-modules-data.ts
// Tenant Admin > Modules data.

export type ModuleStatus = "Active" | "Coming Soon";

export interface TenantModule {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  status: ModuleStatus;
  activeUsers?: number;
  features: string[];
  statusNote: string;
  icon: "hris" | "accounting" | "payroll";
  href: string;
}

export const tenantModules: TenantModule[] = [
  {
    id: "hris",
    name: "HRIS",
    subtitle: "Human Resource Information System",
    description:
      "Manage your entire employee lifecycle — onboarding, attendance, leave, appraisals, and disciplinary records — all in one place.",
    status: "Active",
    activeUsers: 44,
    features: [
      "Employee Directory",
      "Attendance Tracking",
      "Leave Management",
      "Performance Appraisals",
      "Conduct & Discipline",
    ],
    statusNote: "Module is Active and running normally.",
    icon: "hris",
    href: "/hris/overview",
  },
  {
    id: "accounting",
    name: "Accounting",
    subtitle: "Accounting & Finance",
    description:
      "Full-featured accounting suite for invoicing, expense tracking, VAT compliance, agent payments, and financial reporting.",
    status: "Active",
    activeUsers: 12,
    features: [
      "Invoicing & Billing",
      "Expense Management",
      "Payment Requests",
      "Tax & VAT Reporting",
      "Wallet Ledger",
    ],
    statusNote: "Module is Active and running normally.",
    icon: "accounting",
    href: "/accounting/dashboard",
  },
  {
    id: "payroll",
    name: "Payroll",
    subtitle: "Payroll Processing",
    description:
      "Automate salary computations, statutory deductions (PAYE, pension, NHF), payslip generation, and direct bank integration.",
    status: "Coming Soon",
    features: [
      "Salary Computation",
      "PAYE & Pension Deductions",
      "Payslip Generation",
      "Bank Transfer Integration",
      "Payroll Reports",
    ],
    statusNote: "This module is not yet available on your plan.",
    icon: "payroll",
    href: "/payroll/overview",
  },
];