// src/lib/tenants-data.ts

export type Plan = "Starter" | "Growth" | "Enterprise" | "Trial";
export type TenantStatus = "Active" | "Suspended" | "Trial";
export type ModuleName = "HRIS" | "Accounting" | "Payroll";

export interface TenantUser {
  name: string;
  email: string;
  role: string;
  lastActive: string;
  status: "Active" | "Inactive";
}

export interface ActivityEvent {
  text: string;
  by: string;
  at: string;
}

export interface Invoice {
  id: string;
  period: string;
  amount: number;
  status: "Paid" | "Pending" | "Failed";
  date: string;
}

export interface Ticket {
  id: string;
  subject: string;
  priority: "Low" | "Medium" | "High";
  status: "Open" | "Closed";
  assignedTo: string;
  updated: string;
}

export interface TenantDetail {
  id: string;
  company: string;
  industry: string;
  adminEmail: string;
  plan: Plan;
  status: TenantStatus;
  mrr: number;
  country: string;
  createdDate: string;
  about: string;
  activeModules: Record<ModuleName, boolean>;
  users: TenantUser[];
  activity: ActivityEvent[];
  invoices: Invoice[];
  tickets: Ticket[];
}

export const moduleInfo: Record<
  ModuleName,
  { label: string; description: string }
> = {
  HRIS: {
    label: "HRIS",
    description: "Employee records, leave management, onboarding workflows",
  },
  Accounting: {
    label: "Accounting",
    description: "Invoicing, chart of accounts, financial reporting",
  },
  Payroll: {
    label: "Payroll",
    description: "Salary processing, PAYE calculations, payslip generation",
  },
};

export const tenantsData: Record<string, TenantDetail> = {
  "zenith-ventures": {
    id: "zenith-ventures",
    company: "Zenith Ventures",
    industry: "Consulting",
    adminEmail: "info@zenithventures.ng",
    plan: "Starter",
    status: "Active",
    mrr: 45000,
    country: "Nigeria",
    createdDate: "18 Jan 2026",
    about:
      "Zenith Ventures is a Consulting company based in Nigeria, currently on the Starter plan. They have 12 active users across HRIS modules. Their monthly revenue contribution to the platform is ₦45,000. The account was created on 18 Jan 2026 and was last active on 5 Jul 2026.",
    activeModules: { HRIS: true, Accounting: false, Payroll: false },
    users: [
      { name: "Admin User", email: "admin@zenithventures.ng", role: "Admin", lastActive: "7 Jul 2026", status: "Active" },
      { name: "HR Manager", email: "hr@zenithventures.ng", role: "HR Manager", lastActive: "6 Jul 2026", status: "Active" },
      { name: "Finance Lead", email: "finance@zenithventures.ng", role: "Finance Lead", lastActive: "5 Jul 2026", status: "Active" },
      { name: "Employee A", email: "employee.a@zenithventures.ng", role: "Employee", lastActive: "4 Jul 2026", status: "Active" },
      { name: "Employee B", email: "employee.b@zenithventures.ng", role: "Employee", lastActive: "1 Jul 2026", status: "Inactive" },
    ],
    activity: [
      { text: "User login", by: "info@zenithventures.ng", at: "2026-07-07 09:32" },
      { text: "Payroll run initiated", by: "hr@zenithventures.ng", at: "2026-07-06 14:20" },
      { text: "Invoice #INV-2026-06 generated", by: "finance@zenithventures.ng", at: "2026-06-01 00:00" },
      { text: "3 new employees added via bulk import", by: "admin@zenithventures.ng", at: "2026-05-28 10:15" },
      { text: "Module Payroll enabled", by: "admin@zenithventures.ng", at: "2026-05-15 16:45" },
      { text: "Plan set to Starter", by: "admin@zenithventures.ng", at: "2026-05-01 09:00" },
    ],
    invoices: [
      { id: "INV-2026-06", period: "June 2026", amount: 45000, status: "Paid", date: "1 Jun 2026" },
      { id: "INV-2026-05", period: "May 2026", amount: 45000, status: "Paid", date: "1 May 2026" },
      { id: "INV-2026-04", period: "April 2026", amount: 45000, status: "Paid", date: "1 Apr 2026" },
      { id: "INV-2026-03", period: "March 2026", amount: 45000, status: "Paid", date: "1 Mar 2026" },
    ],
    tickets: [
      { id: "TKT-002", subject: "Cannot upload employee documents", priority: "Medium", status: "Open", assignedTo: "Unassigned", updated: "6 Jul 2026" },
    ],
  },
  "bravo-group": {
    id: "bravo-group",
    company: "Bravo Group",
    industry: "Retail",
    adminEmail: "admin@bravogroup.ng",
    plan: "Growth",
    status: "Active",
    mrr: 185000,
    country: "Nigeria",
    createdDate: "3 Feb 2026",
    about:
      "Bravo Group is a Retail company based in Nigeria, currently on the Growth plan. They have 42 active users across HRIS, Accounting and Payroll modules. Their monthly revenue contribution to the platform is ₦185,000.",
    activeModules: { HRIS: true, Accounting: true, Payroll: true },
    users: [
      { name: "Admin User", email: "admin@bravogroup.ng", role: "Admin", lastActive: "7 Jul 2026", status: "Active" },
      { name: "Ops Lead", email: "ops@bravogroup.ng", role: "Operations", lastActive: "7 Jul 2026", status: "Active" },
    ],
    activity: [
      { text: "Plan upgraded to Growth", by: "admin@bravogroup.ng", at: "2026-06-10 11:00" },
      { text: "Module Payroll enabled", by: "admin@bravogroup.ng", at: "2026-05-02 09:30" },
    ],
    invoices: [
      { id: "INV-2026-06", period: "June 2026", amount: 185000, status: "Paid", date: "1 Jun 2026" },
      { id: "INV-2026-05", period: "May 2026", amount: 185000, status: "Paid", date: "1 May 2026" },
    ],
    tickets: [],
  },
  "kainos-technologies": {
    id: "kainos-technologies",
    company: "Kainos Technologies",
    industry: "Technology",
    adminEmail: "info@kainostech.ng",
    plan: "Enterprise",
    status: "Active",
    mrr: 540000,
    country: "Nigeria",
    createdDate: "12 Nov 2025",
    about:
      "Kainos Technologies is a Technology company based in Nigeria, currently on the Enterprise plan with 180 active users across all modules.",
    activeModules: { HRIS: true, Accounting: true, Payroll: true },
    users: [
      { name: "Admin User", email: "admin@kainostech.ng", role: "Admin", lastActive: "6 Jul 2026", status: "Active" },
    ],
    activity: [
      { text: "Added Payroll module", by: "admin@kainostech.ng", at: "2026-07-27 10:00" },
    ],
    invoices: [
      { id: "INV-2026-06", period: "June 2026", amount: 540000, status: "Paid", date: "1 Jun 2026" },
    ],
    tickets: [],
  },
  "pinnacle-foods": {
    id: "pinnacle-foods",
    company: "Pinnacle Foods",
    industry: "Manufacturing",
    adminEmail: "ops@pinnaclefoods.ng",
    plan: "Growth",
    status: "Active",
    mrr: 220000,
    country: "Nigeria",
    createdDate: "2 Mar 2026",
    about:
      "Pinnacle Foods is a Manufacturing company based in Nigeria, currently on the Growth plan with 67 active users across HRIS and Payroll.",
    activeModules: { HRIS: true, Accounting: false, Payroll: true },
    users: [
      { name: "Admin User", email: "ops@pinnaclefoods.ng", role: "Admin", lastActive: "7 Jul 2026", status: "Active" },
    ],
    activity: [
      { text: "Renewed Growth plan", by: "ops@pinnaclefoods.ng", at: "2026-07-22 08:00" },
    ],
    invoices: [
      { id: "INV-2026-06", period: "June 2026", amount: 220000, status: "Paid", date: "1 Jun 2026" },
    ],
    tickets: [],
  },
  "sterling-logistics": {
    id: "sterling-logistics",
    company: "Sterling Logistics",
    industry: "Logistics",
    adminEmail: "hello@sterlinglog.ng",
    plan: "Trial",
    status: "Trial",
    mrr: 0,
    country: "Nigeria",
    createdDate: "30 Jun 2026",
    about:
      "Sterling Logistics is a Logistics company based in Nigeria, currently on a Trial of the Accounting module with 8 users.",
    activeModules: { HRIS: false, Accounting: true, Payroll: false },
    users: [
      { name: "Admin User", email: "hello@sterlinglog.ng", role: "Admin", lastActive: "2 Jul 2026", status: "Active" },
    ],
    activity: [
      { text: "Started a Trial", by: "hello@sterlinglog.ng", at: "2026-06-30 12:00" },
    ],
    invoices: [],
    tickets: [],
  },
  "nova-healthcare": {
    id: "nova-healthcare",
    company: "Nova Healthcare",
    industry: "Healthcare",
    adminEmail: "admin@novahealthcare.ng",
    plan: "Enterprise",
    status: "Active",
    mrr: 680000,
    country: "Nigeria",
    createdDate: "15 Sep 2025",
    about:
      "Nova Healthcare is a Healthcare company based in Nigeria, currently on the Enterprise plan with 210 active users across all modules.",
    activeModules: { HRIS: true, Accounting: true, Payroll: true },
    users: [
      { name: "Admin User", email: "admin@novahealthcare.ng", role: "Admin", lastActive: "7 Jul 2026", status: "Active" },
    ],
    activity: [
      { text: "Upgraded to Enterprise", by: "admin@novahealthcare.ng", at: "2026-08-06 09:00" },
    ],
    invoices: [
      { id: "INV-2026-06", period: "June 2026", amount: 680000, status: "Paid", date: "1 Jun 2026" },
    ],
    tickets: [],
  },
};

export function getTenant(id: string): TenantDetail {
  return tenantsData[id] ?? tenantsData["zenith-ventures"];
}

export function formatNaira(value: number) {
  return value === 0 ? "₦0" : `₦${value.toLocaleString()}`;
}
