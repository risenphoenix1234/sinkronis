// src/lib/platform-analytics-data.ts
// Analytics data — kept separate from other platform-admin data files.

export const newTenantsOverTime = [
  { month: "Feb", tenants: 1 },
  { month: "Mar", tenants: 3 },
  { month: "Apr", tenants: 2 },
  { month: "May", tenants: 0 },
  { month: "Jun", tenants: 2 },
  { month: "Jul", tenants: 2 },
];

export const mrrGrowth = [
  { month: "Feb", mrr: 1250000 },
  { month: "Mar", mrr: 1400000 },
  { month: "Apr", mrr: 1450000 },
  { month: "May", mrr: 1550000 },
  { month: "Jun", mrr: 1610000 },
  { month: "Jul", mrr: 1670000 },
];

export const moduleUsageByMonth = [
  { month: "Feb", HRIS: 3, Accounting: 0, Payroll: 0 },
  { month: "Mar", HRIS: 0, Accounting: 0, Payroll: 5 },
  { month: "Apr", HRIS: 0, Accounting: 0, Payroll: 3 },
  { month: "May", HRIS: 0, Accounting: 0, Payroll: 3 },
  { month: "Jun", HRIS: 0, Accounting: 0, Payroll: 5 },
  { month: "Jul", HRIS: 0, Accounting: 0, Payroll: 5 },
];

export interface ChurnByPlan {
  plan: string;
  count: number;
  color: string;
}

export const churnByPlan: ChurnByPlan[] = [
  { plan: "Starter", count: 0, color: "#94a3b8" },
  { plan: "Growth", count: 0, color: "#60a5fa" },
  { plan: "Enterprise", count: 0, color: "#4f46e5" },
  { plan: "Trial", count: 1, color: "#f97316" },
];

export const totalChurnNote = "Total churn: 1 trial expired";

export interface TopTenantActivity {
  rank: number;
  company: string;
  lastLogin: string;
  sessionsThisMonth: number;
  pagesVisited: number;
}

export const topTenantsByActivity: TopTenantActivity[] = [
  { rank: 1, company: "Nova Healthcare", lastLogin: "7 Jul 2026", sessionsThisMonth: 142, pagesVisited: 2340 },
  { rank: 2, company: "Kainos Technologies", lastLogin: "6 Jul 2026", sessionsThisMonth: 118, pagesVisited: 1980 },
  { rank: 3, company: "Pinnacle Foods", lastLogin: "7 Jul 2026", sessionsThisMonth: 94, pagesVisited: 1450 },
  { rank: 4, company: "Bravo Group", lastLogin: "7 Jul 2026", sessionsThisMonth: 87, pagesVisited: 1320 },
  { rank: 5, company: "Zenith Ventures", lastLogin: "5 Jul 2026", sessionsThisMonth: 34, pagesVisited: 560 },
];

export interface AtRiskTenant {
  id: string;
  company: string;
  plan: string;
  lastActive: string;
  daysInactive: number;
  status: string;
}

export const atRiskTenants: AtRiskTenant[] = [
  {
    id: "sterling-logistics",
    company: "Sterling Logistics",
    plan: "Trial",
    lastActive: "2 Jul 2026",
    daysInactive: 5,
    status: "Trial",
  },
];