import api from "../api/axios";
import {
  Tenant,
  TenantListParams,
  TenantListResponse,
  CreateTenantDto,
  CreateTenantResponse,
  TenantModule,
  PlatformDashboardResponse,
  TenantDetailResponse,
  TenantUsersResponse,
  TenantModulesResponse,
  TenantBillingResponse,
  TenantActivityResponse,
  TenantSupportResponse,
  PlatformUsersParams,
  PlatformUsersResponse,
  PlatformBillingResponse,
  PricingResponse,
  PlatformSupportParams,
  PlatformSupportResponse,
  ModuleAnalyticsResponse,
  FeatureFlag,
  PasswordPolicy,
  PlatformConfiguration,
  PlatformSettingsResponse,
  EmailTemplate,
  MaintenanceMode,
  GenerateInvoicePayload,
  GenerateInvoiceResponse,
  InvoiceListParams,
  InvoiceListResponse,
  SendReminderResponse,
  AssignTicketPayload,
  CreateTicketPayload,
  SupportTicketDetailResponse,
  UpdateResolutionNotesPayload,
  UpdateTicketStatusPayload,
  PlatformAnalyticsResponse,
  ModuleManagementResponse,
} from "./types/platform-admin.types";

const BASE = "/platform-admin";

export const getPlatformDashboard = async (params?: {
  page?: number;
  limit?: number;
  activityLimit?: number;
}) => {
  const { data } = await api.get<PlatformDashboardResponse>(`${BASE}/dashboard`, { params });
  return data;
};

export const getTenants = async (params?: TenantListParams) => {
  const { data } = await api.get<TenantListResponse>(`${BASE}/tenants`, { params });
  return data;
};

export const getTenantById = async (tenantId: string) => {
  const { data } = await api.get<TenantDetailResponse>(`${BASE}/tenants/${tenantId}`);
  return data;
};

export const getTenantOverview = async (tenantId: string) => {
  const { data } = await api.get(`${BASE}/tenants/${tenantId}/overview`);
  return data;
};

export const createTenant = async (payload: CreateTenantDto) => {
  const { data } = await api.post<CreateTenantResponse>(`${BASE}/tenants`, payload);
  return data;
};

export const suspendTenant = async (tenantId: string) => {
  const { data } = await api.patch(`${BASE}/tenants/${tenantId}/suspend`);
  return data;
};

export const activateTenant = async (tenantId: string) => {
  const { data } = await api.patch<Tenant>(`${BASE}/tenants/${tenantId}/activate`);
  return data;
};

export const getTenantUsers = async (tenantId: string) => {
  const { data } = await api.get<TenantUsersResponse>(`${BASE}/tenants/${tenantId}/users`);
  return data;
};

export const deactivateTenantUser = async (tenantId: string, userId: string) => {
  const { data } = await api.patch(`${BASE}/tenants/${tenantId}/users/${userId}/deactivate`);
  return data;
};

export const resetTenantUserPassword = async (tenantId: string, userId: string) => {
  const { data } = await api.post(`${BASE}/tenants/${tenantId}/users/${userId}/reset-password`);
  return data;
};

export const getTenantModules = async (tenantId: string) => {
  const { data } = await api.get<TenantModulesResponse>(`${BASE}/tenants/${tenantId}/modules`);
  return data;
};

export const enableTenantModule = async (tenantId: string, moduleKey: string, reason?: string) => {
  const { data } = await api.patch(
    `${BASE}/modules/tenants/${tenantId}/${moduleKey}/enable`,
    { reason: reason ?? "Enabled via Platform Admin" }
  );
  return data;
};

export const disableTenantModule = async (tenantId: string, moduleKey: string, reason: string) => {
  const { data } = await api.patch(
    `${BASE}/modules/tenants/${tenantId}/${moduleKey}/disable`,
    { reason }
  );
  return data;
};

export const getTenantBilling = async (tenantId: string) => {
  const { data } = await api.get<TenantBillingResponse>(`${BASE}/tenants/${tenantId}/billing`);
  return data;
};

export const overrideTenantSubscription = async (tenantId: string, payload: any) => {
  const { data } = await api.patch(`${BASE}/tenants/${tenantId}/subscription/override`, payload);
  return data;
};

export const getTenantActivity = async (tenantId: string) => {
  const { data } = await api.get<TenantActivityResponse>(`${BASE}/tenants/${tenantId}/activity`);
  return data;
};

export const getTenantSupportTickets = async (tenantId: string) => {
  const { data } = await api.get<TenantSupportResponse>(`${BASE}/tenants/${tenantId}/support-tickets`);
  return data;
};

export const impersonateTenant = async (tenantId: string) => {
  const { data } = await api.post(`${BASE}/tenants/${tenantId}/impersonate`);
  return data;
};

export const exitImpersonation = async () => {
  const { data } = await api.post(`${BASE}/impersonation/exit`);
  return data;
};

export const getPlatformUsers = async (params?: PlatformUsersParams) => {
  const { data } = await api.get<PlatformUsersResponse>(`${BASE}/users`, { params });
  return data;
};

export const getPlatformBilling = async (params?: { page?: number; limit?: number }) => {
  const { data } = await api.get<PlatformBillingResponse>(`${BASE}/billing`, { params });
  return data;
};

export const getPricingPlans = async () => {
  const { data } = await api.get<PricingResponse>(`${BASE}/pricing`);
  return data;
};

export const getPlatformSupportTickets = async (params?: PlatformSupportParams) => {
  const { data } = await api.get<PlatformSupportResponse>(`${BASE}/support/tickets`, { params });
  return data;
};
export const getModuleAnalytics = async () => {
  const { data } = await api.get<ModuleAnalyticsResponse>(`${BASE}/modules/analytics`);
  return data;
};

export const getPlatformSettings = async () => {
  const { data } = await api.get<PlatformSettingsResponse>(`${BASE}/settings`);
  return data;
};

export const updatePlatformConfiguration = async (payload: Partial<PlatformConfiguration>) => {
  const { data } = await api.patch<{ success: boolean; data: PlatformConfiguration }>(
    `${BASE}/settings/configuration`,
    payload
  );
  return data;
};

export const updatePasswordPolicy = async (payload: Partial<PasswordPolicy>) => {
  const { data } = await api.patch<{ success: boolean; data: PasswordPolicy }>(
    `${BASE}/settings/password-policy`,
    payload
  );
  return data;
};

export const updateFeatureFlag = async (key: string, enabled: boolean) => {
  const { data } = await api.patch<{ success: boolean; data: FeatureFlag }>(
    `${BASE}/settings/feature-flags/${key}`,
    { enabled }
  );
  return data;
};

export const updateEmailTemplate = async (key: string, payload: { subject: string; body: string }) => {
  const { data } = await api.patch<{ success: boolean; data: EmailTemplate }>(
    `${BASE}/settings/email-templates/${key}`,
    payload
  );
  return data;
};
export const updateMaintenanceMode = async (payload: { enabled: boolean; message?: string }) => {
  const { data } = await api.patch<{ success: boolean; data: MaintenanceMode }>(
    `${BASE}/settings/maintenance`,
    payload
  );
  return data;
};

export const getInvoices = async (params?: InvoiceListParams) => {
  const { data } = await api.get<InvoiceListResponse>(`${BASE}/billing/invoices`, { params });
  return data;
};

export const generateInvoice = async (payload: GenerateInvoicePayload) => {
  const { data } = await api.post<GenerateInvoiceResponse>(`${BASE}/billing/invoices`, payload);
  return data;
};

export const sendInvoiceReminder = async (invoiceId: string) => {
  const { data } = await api.post<SendReminderResponse>(`${BASE}/billing/invoices/${invoiceId}/reminder`);
  return data;
};

export const downloadInvoicePdf = async (invoiceId: string) => {
  const response = await api.get(`${BASE}/billing/invoices/${invoiceId}/download`, {
    responseType: "blob",
  });
  return response.data;
};

export const exportInvoicesCsv = async (params?: Omit<InvoiceListParams, "page" | "limit">) => {
  const response = await api.get(`${BASE}/billing/invoices/export`, {
    params,
    responseType: "blob",
  });
  return response.data;
};
export const createSupportTicket = async (payload: CreateTicketPayload) => {
  const { data } = await api.post<SupportTicketDetailResponse>(`${BASE}/support/tickets`, payload);
  return data;
};

export const getSupportTicketDetail = async (ticketId: string) => {
  const { data } = await api.get<SupportTicketDetailResponse>(`${BASE}/support/tickets/${ticketId}`);
  return data;
};

export const assignSupportTicket = async (ticketId: string, payload: AssignTicketPayload) => {
  const { data } = await api.patch<SupportTicketDetailResponse>(
    `${BASE}/support/tickets/${ticketId}/assign`,
    payload
  );
  return data;
};

export const updateTicketResolutionNotes = async (ticketId: string, payload: UpdateResolutionNotesPayload) => {
  const { data } = await api.patch<SupportTicketDetailResponse>(
    `${BASE}/support/tickets/${ticketId}/resolution-notes`,
    payload
  );
  return data;
};

export const updateTicketStatus = async (ticketId: string, payload: UpdateTicketStatusPayload) => {
  const { data } = await api.patch<SupportTicketDetailResponse>(
    `${BASE}/support/tickets/${ticketId}/status`,
    payload
  );
  return data;
};

export const resolveSupportTicket = async (ticketId: string) => {
  const { data } = await api.patch<SupportTicketDetailResponse>(`${BASE}/support/tickets/${ticketId}/resolve`);
  return data;
};
export const getPlatformAnalytics = async () => {
  const { data } = await api.get<PlatformAnalyticsResponse>(`${BASE}/analytics`);
  return data;
};

export const sendAtRiskCheckIn = async (tenantId: string) => {
  const { data } = await api.post(`${BASE}/analytics/at-risk/${tenantId}/check-in`);
  return data;
};
export const getModuleManagement = async (params?: { page?: number; limit?: number }) => {
  const { data } = await api.get<ModuleManagementResponse>(`${BASE}/modules`, { params });
  return data;
};