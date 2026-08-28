import api from "../axios";
import {
  Tenant,
  TenantListParams,
  TenantListResponse,
  CreateTenantDto,
  TenantModule,
} from "./types/platform-admin.types";

const BASE = "/platform-admin";

// Dashboard
export const getPlatformDashboard = async () => {
  const { data } = await api.get(`${BASE}/dashboard`);
  return data;
};

// Tenants
export const getTenants = async (params?: TenantListParams) => {
  const { data } = await api.get<TenantListResponse>(`${BASE}/tenants`, { params });
  return data;
};

export const getTenantById = async (tenantId: string) => {
  const { data } = await api.get<Tenant>(`${BASE}/tenants/${tenantId}`);
  return data;
};

export const getTenantOverview = async (tenantId: string) => {
  const { data } = await api.get(`${BASE}/tenants/${tenantId}/overview`);
  return data;
};

export const createTenant = async (payload: CreateTenantDto) => {
  const { data } = await api.post<Tenant>(`${BASE}/tenants`, payload);
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

// Tenant Users
export const getTenantUsers = async (tenantId: string) => {
  const { data } = await api.get(`${BASE}/tenants/${tenantId}/users`);
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

// Tenant Modules
export const getTenantModules = async (tenantId: string) => {
  const { data } = await api.get<TenantModule[]>(`${BASE}/tenants/${tenantId}/modules`);
  return data;
};

export const updateTenantModule = async (tenantId: string, moduleId: string, enabled: boolean) => {
  const { data } = await api.patch(`${BASE}/tenants/${tenantId}/modules/${moduleId}`, { enabled });
  return data;
};

// Tenant Billing
export const getTenantBilling = async (tenantId: string) => {
  const { data } = await api.get(`${BASE}/tenants/${tenantId}/billing`);
  return data;
};

export const overrideTenantSubscription = async (tenantId: string, payload: any) => {
  const { data } = await api.patch(`${BASE}/tenants/${tenantId}/subscription/override`, payload);
  return data;
};

// Tenant Activity / Support
export const getTenantActivity = async (tenantId: string) => {
  const { data } = await api.get(`${BASE}/tenants/${tenantId}/activity`);
  return data;
};

export const getTenantSupportTickets = async (tenantId: string) => {
  const { data } = await api.get(`${BASE}/tenants/${tenantId}/support-tickets`);
  return data;
};

// Impersonation
export const impersonateTenant = async (tenantId: string) => {
  const { data } = await api.post(`${BASE}/tenants/${tenantId}/impersonate`);
  return data;
};

export const exitImpersonation = async () => {
  const { data } = await api.post(`${BASE}/impersonation/exit`);
  return data;
};