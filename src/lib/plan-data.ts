// lib/plan-data.ts

export const naira = (n: number) => `₦${n.toLocaleString()}`;

// ---------------------------------------------------------------------------
// Module catalog — matches the "Plans & Modules" screen exactly
// ---------------------------------------------------------------------------

export type ModuleCatalogId = "hris" | "payroll" | "accounting" | "all-in-one";

export type ModuleCatalogEntry = {
  id: ModuleCatalogId;
  name: string;
  subtitle: string;
  price: number;
  features: string[];
  isBundle?: boolean;
  addonPriceLabel?: string;
  // Short one-line summary used on the Active Modules screen (distinct from
  // the longer bullet list used on the Plans & Modules cards).
  shortDescription: string;
};

export const moduleCatalog: ModuleCatalogEntry[] = [
  {
    id: "hris",
    name: "HRIS",
    subtitle: "Human Resource Information System",
    price: 80000,
    shortDescription: "Employee lifecycle, attendance, leave, appraisals, and conduct.",
    features: [
      "Employee management & profiles",
      "Attendance & biometric integration",
      "Leave management & approvals",
      "Appraisal & OKR-based reviews",
      "Conduct & disciplinary tracking",
      "Organisation setup (departments, branches)",
    ],
  },
  {
    id: "payroll",
    name: "Payroll",
    subtitle: "Payroll Processing",
    price: 10000,
    addonPriceLabel: "₦12,200/month (base + per employee)",
    shortDescription: "Salary computation, PAYE & pension deductions, payslips, and disbursements.",
    features: [
      "Salary computation & pay runs",
      "PAYE & WHT tax management",
      "Pension & statutory remittances",
      "Payslip generation",
      "Deductions & loan management",
      "Wallet for disbursements",
    ],
  },
  {
    id: "accounting",
    name: "Accounting",
    subtitle: "Accounting & Finance",
    price: 80000,
    shortDescription: "Invoicing, VAT & WHT compliance, expenses, agents, and financial reporting.",
    features: [
      "Client & invoice management",
      "VAT & WHT tax compliance",
      "Expense tracking",
      "Sales agent management",
      "Payment requests & approvals",
      "Financial reports & P&L",
    ],
  },
  {
    id: "all-in-one",
    name: "All-in-One",
    subtitle: "Complete Suite — HRIS + Payroll + Accounting",
    price: 150000,
    isBundle: true,
    shortDescription: "Everything in HRIS, Payroll, and Accounting in one unified plan.",
    features: [
      "Everything in HRIS",
      "Everything in Payroll",
      "Everything in Accounting",
      "Single unified dashboard",
      "Cross-module reporting",
      "Priority support",
    ],
  },
];

// The module(s) the tenant currently has active. HRIS is the tenant's base
// plan in this design and can't be removed on its own — only superseded by
// upgrading to the All-in-One bundle.
export const initialActiveModuleIds: ModuleCatalogId[] = ["hris"];

// ---------------------------------------------------------------------------
// Current plan summary — used on the "Overview" tab
// ---------------------------------------------------------------------------

export type CurrentPlan = {
  name: string;
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
  name: "HRIS",
  status: "Active",
  description: "Human Resource Information System — employee lifecycle, attendance, leave, and appraisals.",
  seatsUsed: 44,
  seatsTotal: 50,
  monthlyCost: 80000,
  billingCycle: "Monthly",
  activeModulesCount: 1,
  totalModulesCount: 3,
  renewalDate: "Aug 1, 2026",
  renewalDaysAway: 15,
};

export const EXTRA_SEAT_PRICE = 7500;
export const MIN_SEATS = 44; // currently occupied seats — can't go below this

// ---------------------------------------------------------------------------
// Payment method
// ---------------------------------------------------------------------------

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
  isDefault: true,
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

// ---------------------------------------------------------------------------
// Billing history
// ---------------------------------------------------------------------------

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
  { id: "INV-2026-006", date: "Jun 1, 2026", description: "HRIS Module — Monthly", amount: 80000, status: "Paid", invoiceRef: "INV-2026-006", year: "2026" },
  { id: "INV-2026-005", date: "May 1, 2026", description: "HRIS Module — Monthly", amount: 80000, status: "Paid", invoiceRef: "INV-2026-005", year: "2026" },
  { id: "INV-2026-004", date: "Apr 1, 2026", description: "HRIS Module — Monthly", amount: 80000, status: "Paid", invoiceRef: "INV-2026-004", year: "2026" },
  { id: "INV-2026-003", date: "Mar 1, 2026", description: "HRIS Module — Monthly", amount: 80000, status: "Paid", invoiceRef: "INV-2026-003", year: "2026" },
  { id: "INV-2026-002", date: "Feb 1, 2026", description: "HRIS Module — Monthly + Seats (+5)", amount: 117500, status: "Paid", invoiceRef: "INV-2026-002", year: "2026" },
  { id: "INV-2026-001", date: "Jan 1, 2026", description: "HRIS Module — Monthly", amount: 80000, status: "Paid", invoiceRef: "INV-2026-001", year: "2026" },
];

export function getBillingTotals() {
  const totalPaid2026 = billingHistory
    .filter((b) => b.year === "2026" && b.status === "Paid")
    .reduce((sum, b) => sum + b.amount, 0);
  const thisMonth = billingHistory[0]?.amount ?? 0;
  const annualEstimate = currentPlan.monthlyCost * 12;
  return { totalPaid2026, thisMonth, annualEstimate };
}