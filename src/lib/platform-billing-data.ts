// src/lib/platform-billing-data.ts
// Billing-only data — kept separate from pa-tenants-data.ts.

export const naira = (n: number) => `\u20A6${n.toLocaleString("en-NG")}`;

export type InvoiceStatus = "Paid" | "Overdue" | "Draft";

export interface Invoice {
  id: string;
  tenant: string;
  period: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
}

export const invoiceStatusStyles: Record<InvoiceStatus, string> = {
  Paid: "bg-emerald-50 text-emerald-700",
  Overdue: "bg-amber-100 text-amber-700",
  Draft: "bg-slate-100 text-slate-500",
};

export const revenueByPlan = [
  { month: "Feb", Starter: 120000, Growth: 480000, Enterprise: 650000 },
  { month: "Mar", Starter: 140000, Growth: 520000, Enterprise: 700000 },
  { month: "Apr", Starter: 150000, Growth: 560000, Enterprise: 760000 },
  { month: "May", Starter: 165000, Growth: 600000, Enterprise: 810000 },
  { month: "Jun", Starter: 175000, Growth: 630000, Enterprise: 860000 },
  { month: "Jul", Starter: 185000, Growth: 660000, Enterprise: 900000 },
];

export const initialInvoices: Invoice[] = [
  { id: "INV-2026-0042", tenant: "Bravo Group", period: "Jul 2026", amount: 185000, status: "Paid", dueDate: "5 Jul 2026" },
  { id: "INV-2026-0041", tenant: "Kainos Technologies", period: "Jul 2026", amount: 540000, status: "Paid", dueDate: "5 Jul 2026" },
  { id: "INV-2026-0040", tenant: "Nova Healthcare", period: "Jul 2026", amount: 680000, status: "Paid", dueDate: "5 Jul 2026" },
  { id: "INV-2026-0039", tenant: "Pinnacle Foods", period: "Jul 2026", amount: 220000, status: "Overdue", dueDate: "2 Jul 2026" },
  { id: "INV-2026-0038", tenant: "Zenith Ventures", period: "Jul 2026", amount: 45000, status: "Overdue", dueDate: "1 Jul 2026" },
  { id: "INV-2026-0037", tenant: "Sterling Logistics", period: "Jul 2026", amount: 0, status: "Draft", dueDate: "31 Jul 2026" },
  { id: "INV-2026-0036", tenant: "Bravo Group", period: "Jun 2026", amount: 185000, status: "Paid", dueDate: "5 Jun 2026" },
  { id: "INV-2026-0035", tenant: "Kainos Technologies", period: "Jun 2026", amount: 540000, status: "Paid", dueDate: "5 Jun 2026" },
];