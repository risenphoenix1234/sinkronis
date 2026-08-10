// lib/plan-data.ts
export const naira = (n: number) => `₦${n.toLocaleString()}`;

export type ModuleKey = "hris" | "accounting" | "payroll";

export type ModuleInfo = {
  key: ModuleKey;
  name: string;
  description: string;
  includedInPlan: boolean;
  monthlyPrice: number; // 0 if included
  active: boolean;
};

export const modules: ModuleInfo[] = [
  {
    key: "hris",
    name: "HRIS",
    description: "Human Resource Information System — employee lifecycle, attendance, leave, appraisals, and discipline management.",
    includedInPlan: true,
    monthlyPrice: 0,
    active: true,
  },
  {
    key: "accounting",
    name: "Accounting",
    description: "Accounting & Finance — invoicing, expense tracking, VAT compliance, agents, and financial reporting.",
    includedInPlan: true,
    monthlyPrice: 0,
    active: true,
  },
  {
    key: "payroll",
    name: "Payroll",
    description: "Payroll Processing — salary computation, PAYE & pension deductions, payslips, and bank integration.",
    includedInPlan: false,
    monthlyPrice: 100000,
    active: false,
  },
];

export type CurrentPlan = {
  name: "Starter" | "Business" | "Enterprise";
  status: "Active";
  description: string;
  seatsUsed: number;
  seatsTotal: number;
  monthlyCost: number;
  billingCycle: "Monthly" | "Annual";
  activeModulesCount: number;
  totalModulesCount: number;
  renewalDate: string;
  renewalDaysAway: number;
};

export const currentPlan: CurrentPlan = {
  name: "Business",
  status: "Active",
  description: "For growing organisations that need HR and finance in one place.",
  seatsUsed: 44,
  seatsTotal: 50,
  monthlyCost: 450000,
  billingCycle: "Monthly",
  activeModulesCount: 2,
  totalModulesCount: 3,
  renewalDate: "Jul 1, 2026",
  renewalDaysAway: 18,
};

export const EXTRA_SEAT_PRICE = 7500;
export const MIN_SEATS = 44; // currently occupied seats — can't go below this

export type PlanTier = {
  id: "starter" | "business" | "enterprise";
  name: string;
  tagline: string;
  price: number | null; // null = custom pricing
  priceSuffix: string;
  seatsLimit: string;
  features: string[];
  isMostPopular: boolean;
  isCurrent: boolean;
};

export const planTiers: PlanTier[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Perfect for small teams getting started with HR management.",
    price: 150000,
    priceSuffix: "per month",
    seatsLimit: "Up to 10 seats",
    features: [
      "Up to 10 user seats",
      "HRIS module",
      "Attendance & Leave tracking",
      "Basic reporting",
      "Email support",
    ],
    isMostPopular: false,
    isCurrent: false,
  },
  {
    id: "business",
    name: "Business",
    tagline: "For growing organisations that need HR and finance in one place.",
    price: 450000,
    priceSuffix: "per month",
    seatsLimit: "Up to 50 seats",
    features: [
      "Up to 50 user seats",
      "HRIS + Accounting modules",
      "Audit log & security controls",
      "Custom roles & permissions",
      "Advanced reporting",
      "Priority email support",
    ],
    isMostPopular: true,
    isCurrent: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Custom solutions for large organisations with complex needs.",
    price: null,
    priceSuffix: "Contact us for pricing",
    seatsLimit: "Unlimited seats",
    features: [
      "Unlimited user seats",
      "All modules (incl. Payroll)",
      "Dedicated account manager",
      "Custom integrations & API",
      "SLA-backed uptime guarantee",
      "On-site training & onboarding",
    ],
    isMostPopular: false,
    isCurrent: false,
  },
];

export type SavedCard = {
  brand: "Visa" | "Mastercard";
  last4: string;
  cardholderName: string;
  expiry: string;
  isDefault: boolean;
};

export const savedCard: SavedCard = {
  brand: "Visa",
  last4: "4242",
  cardholderName: "...",
  expiry: "...",
  isDefault: true, // add this line
};

export type BillingAddress = {
  companyName: string;
  billingEmail: string;
  address: string;
  state: string;
  country: string;
};

export const billingAddress: BillingAddress = {
  companyName: "Sinkronis Technologies Ltd",
  billingEmail: "billing@sinkronis.com",
  address: "14 Adeola Odeku Street, Victoria Island, Lagos",
  state: "Lagos",
  country: "Nigeria",
};

export type BillingHistoryEntry = {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: "Paid" | "Failed" | "Pending";
  invoiceRef: string;
  year: "2026" | "2025";
};

export const billingHistory: BillingHistoryEntry[] = [
  { id: "INV-2026-006", date: "Jun 1, 2026", description: "Business Plan — Monthly", amount: 450000, status: "Paid", invoiceRef: "INV-2026-006", year: "2026" },
  { id: "INV-2026-005", date: "May 1, 2026", description: "Business Plan — Monthly", amount: 450000, status: "Paid", invoiceRef: "INV-2026-005", year: "2026" },
  { id: "INV-2026-004", date: "Apr 1, 2026", description: "Business Plan — Monthly", amount: 450000, status: "Paid", invoiceRef: "INV-2026-004", year: "2026" },
  { id: "INV-2026-003", date: "Mar 1, 2026", description: "Business Plan — Monthly", amount: 450000, status: "Paid", invoiceRef: "INV-2026-003", year: "2026" },
  { id: "INV-2026-002", date: "Feb 1, 2026", description: "Business Plan — Monthly + Seats (+5)", amount: 487500, status: "Paid", invoiceRef: "INV-2026-002", year: "2026" },
  { id: "INV-2026-001", date: "Jan 1, 2026", description: "Business Plan — Monthly", amount: 450000, status: "Paid", invoiceRef: "INV-2026-001", year: "2026" },
];

export function getBillingTotals() {
  const totalPaid2026 = billingHistory
    .filter((b) => b.year === "2026" && b.status === "Paid")
    .reduce((sum, b) => sum + b.amount, 0);
  const thisMonth = billingHistory[0]?.amount ?? 0;
  const annualEstimate = currentPlan.monthlyCost * 12;
  return { totalPaid2026, thisMonth, annualEstimate };
}