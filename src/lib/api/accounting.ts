import api from "./axios";
import { AccountingDashboardResponse, CatalogueItemResponse, CatalogueItemsResponse, CreateCatalogueItemPayload, CreateCustomerPayload, CreateInvoicePayload, CreateProjectPayload, CustomerDetailResponse, CustomerResponse, CustomersListResponse, InvoiceResponse, InvoicesListResponse, ProjectResponse, ProjectsListResponse, UpdateCustomerPayload } from "./types/accounting.types";

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