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

export interface CreateTenantAdminSummary {
  userId: string;
  email: string;
  invitationStatus: string;
}

export interface CreateTenantSubscriptionSummary {
  planKey: string;
  planName: string;
  status: string;
  monthlyCost: number;
  renewalDate: string;
}

export interface CreateTenantModuleSummary {
  id: string;
  name: string;
}

export interface CreateTenantOnboardingSummary {
  delivery: string;
  expiresAt: string;
}

export interface CreateTenantResponseData {
  organizationId: string;
  companyName: string;
  slug: string;
  admin: CreateTenantAdminSummary;
  subscription: CreateTenantSubscriptionSummary;
  activeModules: CreateTenantModuleSummary[];
  country: string;
  createdAt: string;
  onboarding: CreateTenantOnboardingSummary;
}

export interface CreateTenantResponse {
  success: boolean;
  message: string;
  data: CreateTenantResponseData;
}

export interface TenantModule {
  moduleId: string;
  name: string;
  enabled: boolean;
}
export interface DashboardAnalytics {
  currency: string;
  totalTenants: number;
  activeTenants: number;
  totalUsers: number;
  platformMrr: number;
  averageModulesPerTenant: number;
}

export interface RevenueMonth {
  month: string;
  year: number;
  monthlyRevenue: number;
}

export interface DashboardRevenueTrend {
  currency: string;
  months: RevenueMonth[];
}

export interface ModuleAdoptionItem {
  moduleId: string;
  moduleName: string;
  tenantCount: number;
  percentageAdoption: number;
}

export interface DashboardModuleAdoption {
  denominator: string;
  totalActiveTenants: number;
  modules: ModuleAdoptionItem[];
}

export interface DashboardActivityItem {
  activityId: string;
  eventType: string;
  description: string;
  organization: {
    id: string;
    name: string;
  };
  initiatedBy: {
    id: string;
    name: string;
    email: string;
  };
  timestamp: string;
  severity: "INFO" | "WARNING" | "ERROR";
}

export interface TenantHealthModule {
  key: string;
  name: string;
}

export interface TenantHealthRecord {
  organizationId: string;
  organizationName: string;
  currentPlan: TenantPlan;
  userCount: number;
  activeModules: TenantHealthModule[];
  lastActiveDate: string | null;
  monthlyRecurringRevenue: number;
  currency: string;
  subscriptionStatus: "ACTIVE" | "TRIAL" | "SUSPENDED";
  registrationDate: string;
}

export interface DashboardTenantHealth {
  records: TenantHealthRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PlatformDashboard {
  analytics: DashboardAnalytics;
  revenueTrend: DashboardRevenueTrend;
  moduleAdoption: DashboardModuleAdoption;
  recentActivity: DashboardActivityItem[];
  tenantHealth: DashboardTenantHealth;
  metadata: {
    generatedAt: string;
    currency: string;
    activityLimit: number;
  };
}

export interface PlatformDashboardResponse {
  success: boolean;
  message: string;
  data: PlatformDashboard;
}
export interface TenantDetailOrganization {
  organizationId: string;
  organizationName: string;
  companyEmail: string;
  industry: string | null;
  currentPlan: TenantPlan;
  subscriptionStatus: "ACTIVE" | "TRIAL" | "SUSPENDED";
  country: string;
  createdAt: string;
  updatedAt: string;
  monthlyRecurringRevenue: number;
}

export interface TenantDetailSummary {
  totalUsers: number;
  activeUsers: number;
  activeModules: { id: string; key: string; name: string }[];
  monthlyRecurringRevenue: number;
  currency: string;
  lastLoginDate: string | null;
  daysSinceLastLogin: number;
}

export interface TenantDetailResponse {
  success: boolean;
  message: string;
  data: {
    organization: TenantDetailOrganization;
    summary: TenantDetailSummary;
  };
}

export interface TenantUserRecord {
  userId: string;
  fullName: string;
  email: string;
  role: string;
  lastActive: string;
  accountStatus: "ACTIVE" | "INACTIVE";
  recordType: string;
}

export interface TenantUsersResponse {
  success: boolean;
  message: string;
  data: {
    totalUsers: number;
    users: TenantUserRecord[];
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

export interface TenantModuleRecord {
  moduleId: string;
  moduleName: string;
  status: "ACTIVE" | "INACTIVE";
  includedInPlan: boolean;
  canDisable: boolean;
}

export interface TenantModulesResponse {
  success: boolean;
  message: string;
  data: {
    currentPlan: TenantPlan;
    modules: TenantModuleRecord[];
  };
}

export interface TenantBillingResponse {
  success: boolean;
  message: string;
  data: {
    currentSubscription: {
      currentPlan: TenantPlan;
      monthlyCost: number;
      billingCycle: string;
      renewalDate: string;
      subscriptionStatus: string;
      currency: string;
    };
    invoices: TenantInvoice[];
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

export interface TenantActivityRecord {
  activityId: string;
  eventType: string;
  description: string;
  performedBy: {
    id: string;
    name: string;
    email: string;
  };
  timestamp: string;
  ipAddress: string;
}

export interface TenantActivityResponse {
  success: boolean;
  message: string;
  data: TenantActivityRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface TenantSupportResponse {
  success: boolean;
  message: string;
  data: TenantSupportTicket[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface TenantInvoice {
  invoiceId: string;
  billingPeriod: string;
  amount: number;
  paymentStatus: "PAID" | "PENDING" | "FAILED";
  invoiceDate: string;
  invoiceIdentifier: string;
}

export interface TenantSupportTicket {
  ticketId: string;
  ticketNumber: string;
  subject: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "OPEN" | "CLOSED";
  assignedTo: {
    id: string;
    name: string;
    email: string;
  };
  updatedAt: string;
}

export interface PlatformUserRecord {
  id: string;
  name: string;
  email: string;
  tenant: {
    id: string;
    name: string;
  };
  role: {
    id: string;
    name: string;
  };
  moduleAccess: string[];
  lastActive: string | null;
  status: "ACTIVE" | "INACTIVE" | "LOCKED" | "SUSPENDED";
  createdAt: string;
  updatedAt: string;
  actions: {
    canDeactivate: boolean;
    canResetPassword: boolean;
    canImpersonate: boolean;
  };
}

export interface PlatformUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  tenantId?: string;
  roleId?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface PlatformUsersResponse {
  success: boolean;
  message: string;
  data: {
    analytics: {
      totalUsers: number;
      activeUsers: number;
      inactiveUsers: number;
    };
    users: PlatformUserRecord[];
    pagination: {
      currentPage: number;
      pageSize: number;
      totalPages: number;
      totalRecords: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    appliedFilters: {
      search: string | null;
      tenantId: string | null;
      roleId: string | null;
      status: string;
      sortBy: string;
      sortOrder: string;
    };
  };
}
export interface BillingAnalytics {
  mrr: number;
  arr: number;
  totalOverdueAmount: number;
  churnRate: number;
  currency: string;
  period: {
    startDate: string;
    endDateExclusive: string;
  };
}

export interface RevenueByPlanMonth {
  month: string;
  plans: {
    HRIS: number;
    PAYROLL: number;
    ACCOUNTING: number;
    ALL_IN_ONE: number;
  };
  totalRevenue: number;
}

export interface PlatformInvoice {
  invoiceId: string;
  tenantName: string;
  billingPeriod: string;
  amount: number;
  paymentStatus: "PAID" | "PENDING" | "OVERDUE" | "DRAFT";
  invoiceDate: string;
  dueDate: string;
}

export interface PlatformBillingResponse {
  success: boolean;
  message: string;
  data: {
    analytics: BillingAnalytics;
    revenueByPlan: RevenueByPlanMonth[];
    invoices: {
      data: PlatformInvoice[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
      };
    };
  };
}
export interface PricingOverview {
  totalRevenue: number;
  moduleRevenue: {
    hris: number;
    accounting: number;
    payroll: number;
  };
  allInOneRevenue: number;
  totalActiveTenants: number;
  totalActiveSubscriptions: number;
  currency: string;
}

export interface PricingFeature {
  id: string;
  name: string;
  description: string;
  module: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface PricingModule {
  id: string;
  key: string;
  name: string;
  description: string;
  activeTenantCount: number;
  monthlyPrice: number;
  baseMonthlyPrice: number;
  features: PricingFeature[];
  monthlyRevenue: number;
  currency: string;
  pricingModel: "FIXED" | "PER_EMPLOYEE";
  status: "ACTIVE" | "INACTIVE";
  updatedAt: string;
  totalEmployees: number;
  revenueContributionPercentage: number;
  rowVersion: number;
  includedModules: string[];
}

export interface PricingResponse {
  success: boolean;
  message: string;
  data: {
    overview: PricingOverview;
    modules: PricingModule[];
  };
}

export interface PlatformSupportTicket {
  ticketId: string;
  tenant: {
    id: string;
    name: string;
  };
  subject: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  assignedTo: {
    id: string;
    name: string;
  } | null;
  updatedAt: string;
}

export interface PlatformSupportParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface PlatformSupportResponse {
  success: boolean;
  message: string;
  data: PlatformSupportTicket[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
export interface ModuleAnalyticsItem {
  module: string;
  tenantCount: number;
  activeUserCount: number;
}

export interface ModuleAnalyticsResponse {
  success: boolean;
  message: string;
  data: {
    modules: ModuleAnalyticsItem[];
  };
}
export interface PlatformConfiguration {
  defaultCurrency: string;
  vatRate: number;
  defaultTimezone: string;
  supportEmail: string;
  updatedAt: string | null;
  updatedBy: { id: string; name: string } | null;
}

export interface PasswordPolicy {
  minimumLength: number;
  passwordExpiryDays: number;
  accountLockoutAttempts: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumber: boolean;
  requireSpecialCharacter: boolean;
  updatedAt: string | null;
  updatedBy: { id: string; name: string } | null;
}

export interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  updatedAt: string | null;
  updatedBy: string | null;
}

export interface EmailTemplate {
  key: string;
  name: string;
  subject: string;
  body: string;
  availableVariables: string[];
  updatedAt: string | null;
  updatedBy: string | null;
}

export interface MaintenanceMode {
  enabled: boolean;
  message: string;
  enabledAt: string | null;
  enabledById: string | null;
  updatedAt: string | null;
  updatedBy: { id: string; name: string } | null;
}

export interface PlatformSettingsResponse {
  success: boolean;
  message: string;
  data: {
    configuration: PlatformConfiguration;
    passwordPolicy: PasswordPolicy;
    featureFlags: FeatureFlag[];
    emailTemplates: EmailTemplate[];
    maintenance: MaintenanceMode;
  };
}
export interface PlatformInvoice {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  tenantId: string;
  tenantName: string;
  tenant: {
    id: string;
    name: string;
  };
  period: string;
  billingPeriod: string;
  amount: number;
  currency: string;
  status: "PAID" | "OVERDUE" | "DRAFT";
  isOverdue: boolean;
  invoiceDate: string;
  dueDate: string;
  paidAt: string | null;
  pricingSnapshot: object | null;
  actions: {
    canDownload: boolean;
    canSendReminder: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "PAID" | "OVERDUE" | "DRAFT";
  tenantId?: string;
  period?: string;
  year?: number;
  month?: number;
  startDate?: string;
  endDate?: string;
  sortBy?: "dueDate" | "amount" | "createdAt" | "tenantName";
  sortOrder?: "asc" | "desc";
}

export interface InvoiceListResponse {
  success: boolean;
  message: string;
  data: PlatformInvoice[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface GenerateInvoicePayload {
  tenantId: string;
  period: string;
  amount: number;
}

export interface GenerateInvoiceResponse {
  success: boolean;
  message: string;
  data: PlatformInvoice;
}

export interface SendReminderResponse {
  success: boolean;
  message: string;
  data: {
    invoiceId: string;
    reminderId: string;
    status: "SENT";
    sentAt: string;
  };
}
export interface SupportTicketPerson {
  id: string;
  name: string;
}

export interface SupportTicketDetail {
  ticketId: string;
  tenant: {
    id: string;
    name: string;
  };
  subject: string;
  priority: "MEDIUM" | "HIGH" | "CRITICAL";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  assignedTo: SupportTicketPerson | null;
  description: string;
  openedAt: string;
  resolutionNotes: string | null;
  resolvedAt: string | null;
  resolvedBy: SupportTicketPerson | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketPayload {
  tenantId: string;
  subject: string;
  priority: "MEDIUM" | "HIGH" | "CRITICAL";
  description: string;
}

export interface SupportTicketDetailResponse {
  success: boolean;
  message: string;
  data: SupportTicketDetail;
}

export interface AssignTicketPayload {
  assignedToId: string;
}

export interface UpdateResolutionNotesPayload {
  resolutionNotes: string;
}

export interface UpdateTicketStatusPayload {
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
}

export interface NewTenantsMonth {
  month: string;
  newTenants: number;
}

export interface MrrGrowthMonth {
  month: string;
  mrr: number;
  currency: string;
}

export interface ModuleUsageMonth {
  month: string;
  modules: { HRIS: number; ACCOUNTING: number; PAYROLL: number } | null;
  availability: "NOT_TRACKED" | "TRACKED_MONTH_END";
}

export interface ChurnByPlanItem {
  plan: string;
  churnedTenants: number;
}

export interface TopTenantActivity {
  tenantId: string;
  company: string;
  lastLogin: string | null;
  sessionsThisMonth: number;
  pagesVisited: number;
}

export interface AtRiskTenant {
  tenantId: string;
  company: string;
  plan: string | null;
  lastActive: string | null;
  daysInactive: number;
  activityState: "INACTIVE" | "NEVER_ACTIVE";
  status: "AT_RISK";
}

export interface PlatformAnalyticsResponse {
  success: boolean;
  message: string;
  data: {
    newTenantsOverTime: NewTenantsMonth[];
    mrrGrowth: MrrGrowthMonth[];
    moduleUsageByMonth: ModuleUsageMonth[];
    churnByPlan: ChurnByPlanItem[];
    totalChurn: number;
    topTenantsByActivity: TopTenantActivity[];
    atRiskTenants: AtRiskTenant[];
  };
}
export interface ModuleManagementAnalyticsItem {
  module: string;
  tenantCount: number;
  activeUserCount: number;
}

export interface TenantModuleStatus {
  module: string;
  enabled: boolean;
  activeUserCount: number;
}

export interface TenantModuleRow {
  id: string;
  name: string;
  email: string;
  status: string;
  plan: string | null;
  modules: TenantModuleStatus[];
  enabledModules: string[];
  disabledModules: string[];
  usage: number;
  lastUpdatedAt: string | null;
}

export interface ModuleManagementResponse {
  success: boolean;
  message: string;
  data: {
    analytics: {
      modules: ModuleManagementAnalyticsItem[];
    };
    tenants: TenantModuleRow[];
    pagination: {
      currentPage: number;
      pageSize: number;
      totalPages: number;
      totalRecords: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}