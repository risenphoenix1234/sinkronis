// lib/settings-data.ts
export type PaymentTerm = "Due on Receipt" | "Net 7" | "Net 14" | "Net 30";

export const paymentTermOptions: PaymentTerm[] = [
  "Due on Receipt",
  "Net 7",
  "Net 14",
  "Net 30",
];

export type InvoiceTemplate = {
  id: string;
  name: string;
  paymentTerm: PaymentTerm;
  headerNote: string;
  footerNote: string;
  isDefault: boolean;
};

export const initialInvoiceTemplates: InvoiceTemplate[] = [
  {
    id: "tpl-standard",
    name: "Standard Invoice",
    paymentTerm: "Net 14",
    headerNote: "Thank you for doing business with us.",
    footerNote: "Payment is due within 14 days of invoice date.",
    isDefault: true,
  },
  {
    id: "tpl-project",
    name: "Project Invoice",
    paymentTerm: "Net 30",
    headerNote: "Invoice for professional services rendered.",
    footerNote: "Payment is due within 30 days of invoice date.",
    isDefault: false,
  },
];

export type ExpenseCategory = {
  id: string;
  name: string;
  description: string;
};

export const initialExpenseCategories: ExpenseCategory[] = [
  { id: "cat-software", name: "Software & Subscriptions", description: "Recurring SaaS tools and licenses" },
  { id: "cat-travel", name: "Travel & Transport", description: "Site visits, client meetings, logistics" },
  { id: "cat-office", name: "Office Supplies", description: "Stationery, consumables, small equipment" },
  { id: "cat-marketing", name: "Marketing & Advertising", description: "Campaigns, sponsorships, promotions" },
  { id: "cat-commissions", name: "Agent Commissions", description: "Payouts to sales agents on closed deals" },
];

export type ReminderRule = {
  id: string;
  label: string;
  trigger: string;
  enabled: boolean;
};

export const initialReminderRules: ReminderRule[] = [
  { id: "rem-overdue", label: "Invoice Overdue", trigger: "When an invoice passes its due date", enabled: true },
  { id: "rem-due-soon", label: "Payment Due Soon", trigger: "3 days before an invoice is due", enabled: true },
  { id: "rem-draft", label: "Draft Invoice Stale", trigger: "7 days after an invoice stays in draft", enabled: false },
  { id: "rem-expense", label: "Expense Approval Pending", trigger: "When an expense awaits approval for 2+ days", enabled: true },
];