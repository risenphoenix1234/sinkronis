// ─────────────────────────────────────────────────────────────────────────
// PASTE THIS INTO services/accounting.ts (the file with `api`, `BASE`, and
// all your other accounting calls). It reuses the same `api` axios instance
// and `BASE = "/accounting"` already defined there, so it must live in that
// file (or wherever those two are in scope) rather than as a separate module.
// ─────────────────────────────────────────────────────────────────────────

import { Invoice } from "./types/accounting.types"; // already imported at the top of your file — don't duplicate

// ⚠️ VERIFY IN SWAGGER: these are my best-guess query param names for
// GET /api/v1/accounting/reports. The only ones confirmed by your test call
// are status/page/limit/sortBy/sortOrder (they showed up in `appliedFilters`
// on the default, unfiltered call). clientId/agentId/projectId/catalogueItemId
// /dateFrom/dateTo are assumptions — if the real names differ, only
// `AccountingReportFilters` and the two `params` lines below need updating.
export interface AccountingReportFilters {
  clientId?: string;
  agentId?: string;
  projectId?: string;
  catalogueItemId?: string;
  status?: "ALL" | "PAID" | "SENT" | "OVERDUE" | "DRAFT";
  dateFrom?: string; // "YYYY-MM-DD"
  dateTo?: string; // "YYYY-MM-DD"
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface AccountingReportSummary {
  totalRevenue: number;
  outstanding: number;
  overdue: number;
  vatCollected: number;
  totalExpenses: number;
  netProfit: number;
}

export interface AccountingReportResponse {
  success: boolean;
  message: string;
  data: {
    appliedFilters: Record<string, unknown>;
    summary: AccountingReportSummary;
    invoices: Invoice[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

export const getAccountingReport = async (filters?: AccountingReportFilters) => {
  const { data } = await api.get<AccountingReportResponse>(`${BASE}/reports`, { params: filters });
  return data;
};

// Both export endpoints stream a file, so we pull it as a blob (keeping the
// Authorization header your `api` instance already attaches) rather than
// linking straight to the URL, which wouldn't carry the auth token.
async function downloadReportFile(path: string, filters: AccountingReportFilters | undefined, filename: string) {
  const response = await api.get(`${BASE}${path}`, {
    params: filters,
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export const downloadReportCsv = (filters?: AccountingReportFilters) =>
  downloadReportFile("/reports/export.csv", filters, "accounting-report.csv");

export const downloadReportPdf = (filters?: AccountingReportFilters) =>
  downloadReportFile("/reports/export.pdf", filters, "accounting-report.pdf");

// ─────────────────────────────────────────────────────────────────────────
// GET /api/v1/accounting/projects/{id} — confirmed real via console test.
// Note this invoice shape is slimmer than the main `Invoice` type: no
// `items`, no `project` (redundant — it's this project), and `client` only
// appears once at the top level rather than per-invoice.
// ─────────────────────────────────────────────────────────────────────────

export interface ProjectDetailInvoice {
  id: string;
  organizationId: string;
  clientId: string;
  invoiceNo: string;
  issueDate: string;
  dueDate: string;
  status: "DRAFT" | "SENT" | "PAID" | "OVERDUE";
  subtotal: number;
  taxAmount: string;
  total: number;
  whtApplicable: boolean;
  whtRate: number | null;
  whtAmount: number;
  amountPayable: number;
  notes: string | null;
  projectId: string;
  assignedAgentId: string | null;
  sentAt: string | null;
  paidAt: string | null;
  voidedAt: string | null;
  paymentReference: string | null;
  createdAt: string;
  updatedAt: string;
  assignedAgent: { id: string; reference: string; name: string } | null;
  payments: unknown[];
  vat: number;
}

export interface ProjectFinancialSummary {
  projectValue: number;
  totalBilled: number;
  totalPaid: number;
  invoiceCount: number;
  billedVsValuePercentage: number;
}

export interface ProjectDetail {
  id: string;
  organizationId: string;
  reference: string;
  name: string;
  clientId: string;
  assignedAgentId: string | null;
  value: number;
  startDate: string;
  endDate: string | null;
  status: "ACTIVE" | "ON_HOLD" | "COMPLETED";
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  client: { id: string; reference: string; name: string };
  assignedAgent: { id: string; reference: string; name: string } | null;
  invoices: ProjectDetailInvoice[];
  financialSummary: ProjectFinancialSummary;
}

export interface ProjectDetailResponse {
  success: boolean;
  message: string;
  data: ProjectDetail;
}

export const getProjectDetail = async (id: string) => {
  const { data } = await api.get<ProjectDetailResponse>(`${BASE}/projects/${id}`);
  return data;
};
