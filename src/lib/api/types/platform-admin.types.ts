export interface TenantAction {
  key: string;
  method: string;
  href: string;
  enabled: boolean;
}

export interface TenantPlan {
  key: string;
  name: string;
}

export interface ActiveModule {
  id: string;
  key: string;
  name: string;
}

export interface Tenant {
  organizationId: string;
  organizationName: string;
  companyEmail: string;
  industry: string | null;
  currentPlan: TenantPlan;
  activeModules: ActiveModule[];
  totalUsers: number;
  monthlyRecurringRevenue: number;
  currency: string;
  subscriptionStatus: "ACTIVE" | "TRIAL" | "SUSPENDED";
  lastActiveAt: string | null;
  createdAt: string;
  actions: TenantAction[];
}

export interface TenantListParams {
  search?: string;
  plan?: string;
  status?: string;
  module?: string;
  page?: number;
  limit?: number;
}

export interface TenantListResponse {
  success: boolean;
  message: string;
  data: Tenant[];
  metadata: {
    currency: string;
    filters: {
      search: string | null;
      plan: string | null;
      status: string | null;
      module: string | null;
    };
    sorting: {
      sortBy: string;
      sortOrder: string;
    };
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export type SubscriptionPlan = "HRIS" | "PAYROLL" | "ACCOUNTING" | "ALL_IN_ONE";

export interface CreateTenantDto {
  companyName: string;
  adminEmail: string;
  subscriptionPlan: SubscriptionPlan;
  country: string;
  industry?: string;
}

export interface TenantModule {
  moduleId: string;
  name: string;
  enabled: boolean;
}