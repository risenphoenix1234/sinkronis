// src/lib/api/platformAdmin.ts
import api from "@/lib/axios";
import { ApiResponse } from "@/lib/api/types/api";

export interface Tenant {
  id: string;
  organizationName: string;
  // add more fields once you have real tenant data to inspect
}

export const getTenants = async () => {
  const res = await api.get<ApiResponse<Tenant[]>>("/platform-admin/tenants");
  return res.data; // full envelope: { success, message, data, metadata, pagination }
};

export const setTenantModule = async (
  tenantId: string,
  moduleId: "hris" | "payroll" | "accounting",
  enabled: boolean,
) => {
  const res = await api.patch(
    `/platform-admin/tenants/${tenantId}/modules/${moduleId}`,
    {
      enabled,
    },
  );
  return res.data;
};

export const overrideTenantSubscription = async (
  tenantId: string,
  plan: "ALL_IN_ONE",
  reason: string,
) => {
  const res = await api.patch(
    `/platform-admin/tenants/${tenantId}/subscription/override`,
    {
      plan,
      reason,
    },
  );
  return res.data;
};
// "HRIS" | "PAYROLL" | "ACCOUNTING" | 