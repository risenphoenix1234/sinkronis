import api from "./axios";
import { AccountingDashboardResponse, AccountingReportResponse, AdminRole, AgentsListResponse, CatalogueItemResponse, CatalogueItemsResponse, CreateCatalogueItemPayload, CreateCustomerPayload, CreateExpenseCategoryPayload, CreateExpensePayload, CreateInvoicePayload, CreateInvoiceTemplatePayload, CreatePaymentRequestPayload, CreateProjectPayload, CreateWalletAccountPayload, CustomerDetailResponse, CustomerResponse, CustomersListResponse, DrillEntry, EntityDetail, ExpenseCategoriesListResponse, ExpenseCategoryResponse, ExpenseResponse, ExpensesListResponse, InviteAgentPayload, InviteAgentResponse, InviteAgentsBulkPayload, InviteAgentsBulkResponse, Invoice, InvoiceResponse, InvoicesListResponse, InvoiceTemplate, ManualFundingPayload, ManualFundingResponse, PaymentRequestResponse, PaymentRequestsListResponse, PaystackInitializePayload, PaystackInitializeResponse, PaystackVerifyResponse, ProjectResponse, ProjectsListResponse, ReminderSettings, ReportFilters, ReportGroup, UpdateAgentPayload, UpdateAgentResponse, UpdateCustomerPayload, UpdateExpensePayload, WalletAccountResponse, WalletReceiptResponse, WalletSummaryResponse, WalletTransactionsListResponse } from "./types/accounting.types";

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


export const getInvoiceDetail = async (id: string) => {
  const { data } = await api.get<InvoiceResponse>(`${BASE}/invoices/${id}`);
  return data;
};

export const getAgents = async (params?: { page?: number; limit?: number; search?: string }) => {
  const { data } = await api.get<AgentsListResponse>(`${BASE}/agents`, { params });
  return data;
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
export const getExpenses = async (params?: { page?: number; limit?: number; search?: string; category?: string; startDate?: string; endDate?: string }) => {
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

import {
  RemindersListResponse,
  ReminderConfigurationResponse,
  UpdateReminderConfigurationPayload,
  ReminderFilter,
} from "@/types/reminder";

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

// Note: bare array response, not the usual {success, message, data} wrapper
export const getAdminRoles = async () => {
  const { data } = await api.get<AdminRole[]>(`/admin/roles`);
  return data;
};

export const getAccountingRoles = async () => {
  const roles = await getAdminRoles();
  return roles.filter((r) => r.permissions.some((p) => p.startsWith("accounting:")));
};

export const getReports = async (params?: { page?: number; limit?: number }) => {
  const { data } = await api.get<AccountingReportResponse>(`${BASE}/reports`, { params });
  return data;
};

export const exportReportsCsv = async () => {
  const response = await api.get(`${BASE}/reports/export.csv`, { responseType: "blob" });
  return response.data;
};

export const exportReportsPdf = async () => {
  const response = await api.get(`${BASE}/reports/export.pdf`, { responseType: "blob" });
  return response.data;
};

// --- Client-side helpers until backend confirms filter/grouping query params ---

export function filterInvoicesLocally(invoices: Invoice[], filters: ReportFilters): Invoice[] {
  return invoices.filter((inv) => {
    if (filters.clientId && inv.clientId !== filters.clientId) return false;
    if (filters.agentId && inv.assignedAgentId !== filters.agentId) return false;
    if (filters.projectId && inv.projectId !== filters.projectId) return false;
    if (filters.catalogueItemId && !inv.items.some((i) => i.catalogueItemId === filters.catalogueItemId)) return false;
    if (filters.status && inv.status !== filters.status) return false;
    if (filters.dateFrom && new Date(inv.issueDate) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(inv.issueDate) > new Date(filters.dateTo)) return false;
    return true;
  });
}

 export const getProjectDetail = async (id: string): Promise<EntityDetail> => {
  const res = await getReports();
  const invoices = filterInvoicesLocally(res.data.invoices ?? [], { projectId: id });
  return { id, name: invoices[0]?.project?.name ?? "Project", invoices };
};

export const getClientDetail = async (id: string): Promise<EntityDetail> => {
  const res = await getReports();
  const invoices = filterInvoicesLocally(res.data.invoices ?? [], { clientId: id });
  return { id, name: invoices[0]?.client?.name ?? "Client", invoices };
};

export const getAgentDetail = async (id: string): Promise<EntityDetail> => {
  const res = await getReports();
  const invoices = filterInvoicesLocally(res.data.invoices ?? [], { agentId: id });
  return { id, name: invoices[0]?.assignedAgent?.name ?? "Agent", invoices };
};

async function downloadReport(kind: "csv" | "pdf", filters?: ReportFilters) {
  const response = await api.get(`${BASE}/reports/export.${kind}`, {
    params: filters,
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = url;
  link.download = `accounting-report.${kind}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export const exportCsv = (filters?: ReportFilters) => downloadReport("csv", filters);
export const exportPdf = (filters?: ReportFilters) => downloadReport("pdf", filters);


 

const emptyGroup = (id: string, name: string): ReportGroup => ({
  id,
  name,
  invoiceCount: 0,
  invoiceValue: 0,
  revenuePaid: 0,
  outstanding: 0,
  vatCharged: 0,
});

function addToGroup(group: ReportGroup, inv: Invoice) {
  group.invoiceCount += 1;
  group.invoiceValue += inv.total;
  group.vatCharged += inv.vat;
  if (inv.status?.toUpperCase() === "PAID") group.revenuePaid += inv.total;
  else group.outstanding += inv.total;
}

export function groupInvoicesByClient(invoices: Invoice[]): DrillEntry[] {
  const map = new Map<string, DrillEntry>();
  invoices.forEach((inv) => {
    const existing = map.get(inv.clientId) ?? emptyGroup(inv.clientId, inv.client.name);
    addToGroup(existing, inv);
    map.set(inv.clientId, existing);
  });
  return Array.from(map.values());
}

export function groupInvoicesByAgent(invoices: Invoice[]): DrillEntry[] {
  const map = new Map<string, DrillEntry>();
  invoices.forEach((inv) => {
    if (!inv.assignedAgentId || !inv.assignedAgent) return;
    const existing = map.get(inv.assignedAgentId) ?? emptyGroup(inv.assignedAgentId, inv.assignedAgent.name);
    addToGroup(existing, inv);
    map.set(inv.assignedAgentId, existing);
  });
  return Array.from(map.values());
}

export function groupInvoicesByProject(invoices: Invoice[]): DrillEntry[] {
  const map = new Map<string, DrillEntry>();
  invoices.forEach((inv) => {
    if (!inv.projectId || !inv.project) return;
    const existing = map.get(inv.projectId) ?? emptyGroup(inv.projectId, inv.project.name);
    addToGroup(existing, inv);
    map.set(inv.projectId, existing);
  });
  return Array.from(map.values());
}



export function sumInvoices(invoices: Invoice[]): number {
  return invoices.reduce((sum, inv) => sum + inv.total, 0);
}

export const filterLabels: Record<keyof ReportFilters, string> = {
  clientId: "Client",
  agentId: "Agent",
  projectId: "Project",
  catalogueItemId: "Item",
  status: "Status",
  dateFrom: "From",
  dateTo: "To",
};

export function naira(value: number): string {
  return `₦${value.toLocaleString()}`;
}
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

// PATCH body not yet confirmed against a real response — same fields as create, all optional
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