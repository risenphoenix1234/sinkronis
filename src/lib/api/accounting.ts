// src/lib/api/accounting.ts
import api from "./axios";
import {
  AccountingDashboardResponse,
  AccountingReportResponse,
  AdminRole,
  AgentsListResponse,
  CatalogueItemResponse,
  CatalogueItemsResponse,
  CreateCatalogueItemPayload,
  CreateCustomerPayload,
  CreateExpenseCategoryPayload,
  CreateExpensePayload,
  CreateInvoicePayload,
  CreateInvoiceTemplatePayload,
  CreatePaymentRequestPayload,
  CreateProjectPayload,
  CreateWalletAccountPayload,
  CustomerDetailResponse,
  CustomerResponse,
  CustomersListResponse,
  EntityDetail,
  ExpenseCategoriesListResponse,
  ExpenseCategoryResponse,
  ExpenseResponse,
  ExpensesListResponse,
  InviteAgentPayload,
  InviteAgentResponse,
  InviteAgentsBulkPayload,
  InviteAgentsBulkResponse,
  Invoice,
  InvoiceResponse,
  InvoicesListResponse,
  InvoiceTemplate,
  ManualFundingPayload,
  ManualFundingResponse,
  PaymentRequestResponse,
  PaymentRequestsListResponse,
  PaystackInitializePayload,
  PaystackInitializeResponse,
  PaystackVerifyResponse,
  ProjectResponse,
  ProjectsListResponse,
  ReminderSettings,
  ReportEntityKind,
  ReportFilters,
  ReportQuery,
  UpdateAgentPayload,
  UpdateAgentResponse,
  UpdateCustomerPayload,
  UpdateExpensePayload,
  WalletAccountResponse,
  WalletReceiptResponse,
  WalletSummaryResponse,
  WalletTransactionsListResponse,
} from "./types/accounting.types";
import {
  RemindersListResponse,
  ReminderConfigurationResponse,
  UpdateReminderConfigurationPayload,
  ReminderFilter,
} from "@/types/reminder";

const BASE = "/accounting";

export const getAccountingDashboard = async () => {
  const { data } = await api.get<AccountingDashboardResponse>(`${BASE}/dashboard`);
  return data;
};

export const getCustomers = async (params?: { page?: number; limit?: number; search?: string }) => {
  const { data } = await api.get<CustomersListResponse>(`${BASE}/customers`, { params });
  return data;
};

export const createCustomer = async (payload: CreateCustomerPayload) => {
  const { data } = await api.post<CustomerResponse>(`${BASE}/customers`, payload);
  return data;
};

export const updateCustomer = async (id: string, payload: UpdateCustomerPayload) => {
  const { data } = await api.patch<CustomerResponse>(`${BASE}/customers/${id}`, payload);
  return data;
};

export const deleteCustomer = async (id: string) => {
  const { data } = await api.delete(`${BASE}/customers/${id}`);
  return data;
};

export const getCustomerDetail = async (id: string) => {
  const { data } = await api.get<CustomerDetailResponse>(`${BASE}/customers/${id}`);
  return data;
};

export const getInvoices = async (params?: { page?: number; limit?: number; search?: string; status?: string }) => {
  const { data } = await api.get<InvoicesListResponse>(`${BASE}/invoices`, { params });
  return data;
};

export const createInvoice = async (payload: CreateInvoicePayload) => {
  const { data } = await api.post<InvoiceResponse>(`${BASE}/invoices`, payload);
  return data;
};

export const getInvoiceDetail = async (id: string) => {
  const { data } = await api.get<InvoiceResponse>(`${BASE}/invoices/${id}`);
  return data;
};

export const getCatalogueItems = async (params?: { page?: number; limit?: number; search?: string }) => {
  const { data } = await api.get<CatalogueItemsResponse>(`${BASE}/items-services`, { params });
  return data;
};

export const createCatalogueItem = async (payload: CreateCatalogueItemPayload) => {
  const { data } = await api.post<CatalogueItemResponse>(`${BASE}/items-services`, payload);
  return data;
};

export const updateCatalogueItem = async (id: string, payload: Partial<CreateCatalogueItemPayload>) => {
  const { data } = await api.patch<CatalogueItemResponse>(`${BASE}/items-services/${id}`, payload);
  return data;
};

export const deleteCatalogueItem = async (id: string) => {
  const { data } = await api.delete(`${BASE}/items-services/${id}`);
  return data;
};

export const getProjects = async (params?: { page?: number; limit?: number; search?: string }) => {
  const { data } = await api.get<ProjectsListResponse>(`${BASE}/projects`, { params });
  return data;
};

export const createProject = async (payload: CreateProjectPayload) => {
  const { data } = await api.post<ProjectResponse>(`${BASE}/projects`, payload);
  return data;
};

export const updateProject = async (id: string, payload: Partial<CreateProjectPayload>) => {
  const { data } = await api.patch<ProjectResponse>(`${BASE}/projects/${id}`, payload);
  return data;
};

export const deleteProject = async (id: string) => {
  const { data } = await api.delete(`${BASE}/projects/${id}`);
  return data;
};

export const getAgents = async (params?: { page?: number; limit?: number; search?: string }) => {
  const { data } = await api.get<AgentsListResponse>(`${BASE}/agents`, { params });
  return data;
};

export const inviteAgent = async (payload: InviteAgentPayload) => {
  const { data } = await api.post<InviteAgentResponse>(`${BASE}/agents/invite`, payload);
  return data;
};

export const inviteAgentsBulk = async (payload: InviteAgentsBulkPayload) => {
  const { data } = await api.post<InviteAgentsBulkResponse>(`${BASE}/agents/invite-bulk`, payload);
  return data;
};

export const updateAgent = async (id: string, payload: UpdateAgentPayload) => {
  const { data } = await api.patch<UpdateAgentResponse>(`${BASE}/agents/${id}`, payload);
  return data;
};

export const getAdminRoles = async () => {
  const { data } = await api.get<AdminRole[]>(`/admin/roles`);
  return data;
};

export const getAccountingRoles = async () => {
  const roles = await getAdminRoles();
  return roles.filter((r) => r.permissions.some((p) => p.startsWith("accounting:")));
};

export const getPaymentRequests = async (params?: { page?: number; limit?: number }) => {
  const { data } = await api.get<PaymentRequestsListResponse>(`${BASE}/payment-requests`, { params });
  return data;
};

export const createPaymentRequest = async (payload: CreatePaymentRequestPayload) => {
  const { data } = await api.post<PaymentRequestResponse>(`${BASE}/payment-requests`, payload);
  return data;
};

export const approvePaymentRequest = async (id: string) => {
  const { data } = await api.post(`${BASE}/payment-requests/${id}/approve`);
  return data;
};

export const declinePaymentRequest = async (id: string) => {
  const { data } = await api.post(`${BASE}/payment-requests/${id}/decline`);
  return data;
};

export const disbursePaymentRequest = async (id: string) => {
  const { data } = await api.post(`${BASE}/payment-requests/${id}/disburse`);
  return data;
};

export const getExpenses = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const { data } = await api.get<ExpensesListResponse>(`${BASE}/expenses`, { params });
  return data;
};

export const createExpense = async (payload: CreateExpensePayload) => {
  const { data } = await api.post<ExpenseResponse>(`${BASE}/expenses`, payload);
  return data;
};

export const updateExpense = async (id: string, payload: UpdateExpensePayload) => {
  const { data } = await api.patch<ExpenseResponse>(`${BASE}/expenses/${id}`, payload);
  return data;
};

export const voidExpense = async (id: string) => {
  const { data } = await api.delete(`${BASE}/expenses/${id}`);
  return data;
};

export const getExpenseCategories = async () => {
  const { data } = await api.get<ExpenseCategoriesListResponse>(`${BASE}/settings/expense-categories`);
  return data;
};

export const createExpenseCategory = async (payload: CreateExpenseCategoryPayload) => {
  const { data } = await api.post<ExpenseCategoryResponse>(`${BASE}/settings/expense-categories`, payload);
  return data;
};

export const deleteExpenseCategory = async (id: string) => {
  const { data } = await api.delete(`${BASE}/settings/expense-categories/${id}`);
  return data;
};

export const getReminders = async (params?: { filter?: ReminderFilter; page?: number; limit?: number }) => {
  const { data } = await api.get<RemindersListResponse>(`${BASE}/reminders`, { params });
  return data;
};

export const getReminderConfiguration = async () => {
  const { data } = await api.get<ReminderConfigurationResponse>(`${BASE}/reminders/configuration`);
  return data;
};

export const updateReminderConfiguration = async (payload: UpdateReminderConfigurationPayload) => {
  const { data } = await api.put<ReminderConfigurationResponse>(`${BASE}/reminders/configuration`, payload);
  return data;
};

export const markAllRemindersRead = async () => {
  const { data } = await api.post(`${BASE}/reminders/mark-all-read`);
  return data;
};

export const markReminderRead = async (id: string) => {
  const { data } = await api.post(`${BASE}/reminders/${id}/read`);
  return data;
};

export const getWalletSummary = async () => {
  const { data } = await api.get<WalletSummaryResponse>(`${BASE}/wallet/summary`);
  return data;
};

export const getWalletTransactions = async (params?: { page?: number; limit?: number }) => {
  const { data } = await api.get<WalletTransactionsListResponse>(`${BASE}/wallet/transactions`, { params });
  return data;
};

export const createWalletAccount = async (payload: CreateWalletAccountPayload) => {
  const { data } = await api.post<WalletAccountResponse>(`${BASE}/wallet/accounts`, payload);
  return data;
};

export const fundWalletManually = async (payload: ManualFundingPayload) => {
  const { data } = await api.post<ManualFundingResponse>(`${BASE}/wallet/manual-funding`, payload);
  return data;
};

export const initializePaystackFunding = async (payload: PaystackInitializePayload) => {
  const { data } = await api.post<PaystackInitializeResponse>(`${BASE}/wallet/paystack/initialize`, payload);
  return data;
};

export const verifyPaystackFunding = async (reference: string) => {
  const { data } = await api.get<PaystackVerifyResponse>(`${BASE}/wallet/paystack/verify/${reference}`);
  return data;
};

export const getWalletReceipt = async (transactionId: string) => {
  const { data } = await api.get<WalletReceiptResponse>(`${BASE}/wallet/transactions/${transactionId}/receipt`);
  return data;
};

export const getInvoiceTemplates = async () => {
  const { data } = await api.get<{ success: boolean; message: string; data: InvoiceTemplate[] }>(
    `${BASE}/settings/invoice-templates`
  );
  return data;
};

export const createInvoiceTemplate = async (payload: CreateInvoiceTemplatePayload) => {
  const { data } = await api.post<{ success: boolean; message: string; data: InvoiceTemplate }>(
    `${BASE}/settings/invoice-templates`,
    payload
  );
  return data;
};

export const updateInvoiceTemplate = async (id: string, payload: Partial<CreateInvoiceTemplatePayload>) => {
  const { data } = await api.patch<{ success: boolean; message: string; data: InvoiceTemplate }>(
    `${BASE}/settings/invoice-templates/${id}`,
    payload
  );
  return data;
};

export const deleteInvoiceTemplate = async (id: string) => {
  const { data } = await api.delete(`${BASE}/settings/invoice-templates/${id}`);
  return data;
};

export const setDefaultInvoiceTemplate = async (id: string) => {
  const { data } = await api.post<{ success: boolean; message: string; data: InvoiceTemplate }>(
    `${BASE}/settings/invoice-templates/${id}/default`
  );
  return data;
};

export const getReminderSettings = async () => {
  const { data } = await api.get<{ success: boolean; message: string; data: ReminderSettings }>(
    `${BASE}/settings/reminders`
  );
  return data;
};

export const updateReminderSettings = async (payload: ReminderSettings) => {
  const { data } = await api.put<{ success: boolean; message: string; data: ReminderSettings }>(
    `${BASE}/settings/reminders`,
    payload
  );
  return data;
};

export const REPORT_FILTER_KEYS: (keyof ReportFilters)[] = [
  "clientId",
  "agentId",
  "projectId",
  "itemServiceId",
  "status",
  "fromDate",
  "toDate",
];

export const filterLabels: Record<keyof ReportFilters, string> = {
  clientId: "Client",
  agentId: "Agent",
  projectId: "Project",
  itemServiceId: "Item",
  status: "Status",
  fromDate: "From",
  toDate: "To",
};

function cleanParams(params?: object): Record<string, string | number> | undefined {
  if (!params) return undefined;
  const entries = Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "");
  return Object.fromEntries(entries) as Record<string, string | number>;
}

export const getReports = async (query?: ReportQuery) => {
  const { data } = await api.get<AccountingReportResponse>(`${BASE}/reports`, { params: cleanParams(query) });
  return data;
};

export const entityFilters = (kind: ReportEntityKind, id: string): ReportFilters => {
  if (kind === "client") return { clientId: id };
  if (kind === "agent") return { agentId: id };
  return { projectId: id };
};

function resolveEntityName(kind: ReportEntityKind, id: string, invoices: Invoice[]): string {
  if (id === "UNASSIGNED") return kind === "agent" ? "Unassigned agent" : "Unassigned project";
  const first = invoices[0];
  if (kind === "client") return first?.client.name ?? "Client";
  if (kind === "agent") return first?.assignedAgent?.name ?? "Agent";
  return first?.project?.name ?? "Project";
}

export const getEntityReport = async (
  kind: ReportEntityKind,
  id: string,
  options?: { page?: number; limit?: number }
): Promise<EntityDetail> => {
  const res = await getReports({ ...entityFilters(kind, id), page: options?.page, limit: options?.limit });
  const invoices = res.data.invoices ?? [];
  return {
    id,
    name: resolveEntityName(kind, id, invoices),
    summary: res.data.summary,
    invoices,
    pagination: res.data.pagination,
  };
};

async function downloadReport(format: "csv" | "pdf", filters?: ReportFilters) {
  const response = await api.get(`${BASE}/reports/export.${format}`, {
    params: cleanParams(filters),
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = url;
  link.download = `accounting-report.${format}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export const exportCsv = (filters?: ReportFilters) => downloadReport("csv", filters);
export const exportPdf = (filters?: ReportFilters) => downloadReport("pdf", filters);

export function naira(value: number | null | undefined): string {
  return `₦${(value ?? 0).toLocaleString()}`;
}

export const finalizeFinancialSettlementOtp = async (settlementId: string, otp: string) => {
  const { data } = await api.post(`${BASE}/financial-settlements/${settlementId}/finalize-otp`, { otp });
  return data;
};