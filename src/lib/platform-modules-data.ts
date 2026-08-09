// src/lib/platform-modules-data.ts
// Module Management data — kept separate from tenants/billing/users data files.

export type ModuleName = "HRIS" | "Accounting" | "Payroll";

export const ALL_MODULES: ModuleName[] = ["HRIS", "Accounting", "Payroll"];

export interface TenantModuleRow {
  id: string;
  tenant: string;
  industry: string;
  modules: Record<ModuleName, boolean>;
  moduleUsers: Record<ModuleName, number>;
}

export const tenantModuleRows: TenantModuleRow[] = [
  {
    id: "bravo-group",
    tenant: "Bravo Group",
    industry: "Professional Services",
    modules: { HRIS: true, Accounting: true, Payroll: true },
    moduleUsers: { HRIS: 42, Accounting: 8, Payroll: 35 },
  },
  {
    id: "kainos-technologies",
    tenant: "Kainos Technologies",
    industry: "Technology",
    modules: { HRIS: true, Accounting: true, Payroll: true },
    moduleUsers: { HRIS: 180, Accounting: 45, Payroll: 160 },
  },
  {
    id: "zenith-ventures",
    tenant: "Zenith Ventures",
    industry: "Consulting",
    modules: { HRIS: true, Accounting: false, Payroll: false },
    moduleUsers: { HRIS: 12, Accounting: 0, Payroll: 0 },
  },
  {
    id: "pinnacle-foods",
    tenant: "Pinnacle Foods",
    industry: "FMCG",
    modules: { HRIS: true, Accounting: false, Payroll: true },
    moduleUsers: { HRIS: 67, Accounting: 0, Payroll: 60 },
  },
  {
    id: "sterling-logistics",
    tenant: "Sterling Logistics",
    industry: "Logistics",
    modules: { HRIS: false, Accounting: true, Payroll: false },
    moduleUsers: { HRIS: 0, Accounting: 8, Payroll: 0 },
  },
  {
    id: "nova-healthcare",
    tenant: "Nova Healthcare",
    industry: "Healthcare",
    modules: { HRIS: true, Accounting: true, Payroll: true },
    moduleUsers: { HRIS: 210, Accounting: 62, Payroll: 195 },
  },
];