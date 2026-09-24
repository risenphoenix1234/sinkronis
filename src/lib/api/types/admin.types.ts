export interface TenantDashboardWelcome {
  tenantAdminName: string;
  profileImageUrl: string | null;
  lastLoginAt: string;
}

export interface TenantDashboardAnalytics {
  totalUsers: number;
  activeUsers: number;
  activeModules: number;
  pendingInvitations: number;
}

export interface TenantQuickAction {
  key: string;
  title: string;
  description: string;
  allowed: boolean;
}

export interface TenantActiveModule {
  key: string;
  name: string;
  enabled: boolean;
}

export interface TenantRecentActivity {
  id: string;
  action: string;
  resource: string;
  summary: string;
  actorName: string;
  createdAt: string;
}

export interface TenantSystemAlert {
  id: string;
  type: string;
  title: string;
  message: string;
  severity: string;
}

export interface TenantDashboardResponse {
  search: {
    placeholder: string;
  };
  welcome: TenantDashboardWelcome;
  analytics: TenantDashboardAnalytics;
  quickActions: TenantQuickAction[];
  activeModules: TenantActiveModule[];
  recentActivities: TenantRecentActivity[];
  systemAlerts: TenantSystemAlert[];
}
export interface TenantUserRow {
  id: string;
  user: {
    fullName: string;
    email: string;
  };
  role: string;
  modules: string[];
  status: "ACTIVE" | "INACTIVE";
  lastActive: string | null;
}

export interface TenantUsersResponse {
  data: TenantUserRow[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface TenantUsersAnalytics {
  totalUsers: number;
  activeUsers: number;
  pendingInvitations: number;
}

export interface TenantInvitation {
  id: string;
  email: string;
  role: string;
  modules: string[];
  sentAt: string;
  status: "PENDING" | "EXPIRED";
}

export interface TenantInvitationsResponse {
  data: TenantInvitation[];
  meta: { page: number; limit: number; total: number };
}

export interface TenantUserGroup {
  id: string;
  name: string;
  type: "DEPARTMENT" | "FUNCTION";
  description?: string;
  memberCount: number;
}

export interface TenantUserGroupsResponse {
  data: TenantUserGroup[];
  meta: { page: number; limit: number; total: number };
}

export interface TenantRole {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  canModify: boolean;
  canDelete: boolean;
}

export interface EditUserPayload {
  roleId?: string;
  isActive?: boolean;
}

export interface CreateInvitationPayload {
  email: string;
  roleId: string;
  moduleAccess: string[];
}

export interface CreateGroupPayload {
  name: string;
  type: "DEPARTMENT" | "FUNCTION";
  description?: string;
}
export interface PermissionItem {
  key: string;
  resource: string;
  action: string;
  label: string;
  description: string;
}

export interface PermissionGroup {
  module: string;
  label: string;
  permissions: PermissionItem[];
}

export interface RoleDetail {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  isSystem: boolean;
  canModify: boolean;
  canDelete: boolean;
  lockedReason: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: string[];
  permissionGroups: PermissionGroup[];
}

export interface RoleTemplate {
  key: string;
  name: string;
  description: string;
  permissionKeys: string[];
  permissionCount: number;
  modules: string[];
}

export interface CreateRolePayload {
  name: string;
  description?: string;
  permissionKeys?: string[];
  templateKey?: string;
  cloneFromRoleId?: string;
}

export interface UpdateRolePayload {
  name?: string;
  description?: string;
  permissionKeys?: string[];
}

export type ModuleKey = "hris" | "accounting" | "payroll";
export type ModuleStatus = "ACTIVE" | "INACTIVE" | "COMING_SOON";

export interface AdminModuleAnalytics {
  totalModules: number;
  activeModules: number;
  comingSoonModules: number;
  inactiveModules: number;
}

export interface AdminModuleAction {
  label: string;
  kind: string;
  canOpen: boolean;
}

export interface AdminModuleCard {
  key: ModuleKey;
  name: string;
  status: ModuleStatus;
  description: string;
  tabs: string[];
  activeUsers: number;
  action: AdminModuleAction;
  openPath: string;
  canLaunch: boolean;
  isEnabled: boolean;
}

export interface AdminModuleSectionResponse {
  analytics: AdminModuleAnalytics;
  modules: AdminModuleCard[];
}

export interface ModuleStatusUpdateBody {
  status: ModuleStatus;
}
export interface SecurityPolicyResponse {
  minPasswordLength: number;
  passwordExpiryDays: number | null;
  lockoutMaxAttempts: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumber: boolean;
  requireSpecialCharacter: boolean;
  twoFactorEnabled: boolean;
  enforceTwoFactorForAllUsers: boolean;
  allowAuthenticatorApp: boolean;
  allowSmsOtp: boolean;
  allowEmailOtp: boolean;
  ipAllowlistEnabled: boolean;
  methodAvailability: {
    authenticatorApp: boolean;
    smsOtp: boolean;
    emailOtp: boolean;
  };
}

export interface SecurityPasswordPolicyBody {
  minPasswordLength: number;
  passwordExpiryDays: number | null;
  lockoutMaxAttempts: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumber: boolean;
  requireSpecialCharacter: boolean;
}

export interface SecurityTwoFactorBody {
  twoFactorEnabled: boolean;
  enforceTwoFactorForAllUsers: boolean;
  allowAuthenticatorApp: boolean;
  allowSmsOtp: boolean;
  allowEmailOtp: boolean;
}

export type SessionStatus = "CURRENT" | "ACTIVE" | "REVOKED";

export interface SecuritySession {
  id: string;
  userId: string;
  userName: string;
  email: string;
  status: SessionStatus;
  device: string;
  ipAddress: string;
  location: {
    state: string | null;
    country: string | null;
  };
  lastSeenAt: string;
  createdAt: string;
  expiresAt: string;
  revokedAt: string | null;
  revokeReason: string | null;
}

export interface SecuritySessionsResponse {
  page: number;
  limit: number;
  total: number;
  data: SecuritySession[];
}

export interface SecuritySessionsParams {
  page?: number;
  limit?: number;
  userId?: string;
  status?: "ACTIVE" | "REVOKED" | "ALL";
}

export interface RevokeSessionBody {
  reason?: string;
}

export interface RevokeSessionsBulkBody {
  sessionIds: string[];
  reason?: string;
}
export interface SecurityIpAllowlistEntry {
  id: string;
  value: string;
  label: string | null;
  createdAt?: string;
}

export interface SecurityIpAllowlistResponse {
  enabled: boolean;
  entries: SecurityIpAllowlistEntry[];
}

export interface SecurityIpAllowlistEntryBody {
  value: string;
  label?: string;
}

export interface SecurityIpAllowlistToggleBody {
  enabled: boolean;
}

export type LoginActivityStatus = "SUCCESS" | "FAILED" | "BLOCKED";

export interface LoginActivityEvent {
  id: string;
  eventType: string;
  status: LoginActivityStatus;
  reasonCode: string | null;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  emailAttempted: string;
  ipAddress: string;
  device: string;
  location: {
    state: string | null;
    country: string | null;
  };
  occurredAt: string;
}

export interface LoginActivityResponse {
  page: number;
  limit: number;
  total: number;
  data: LoginActivityEvent[];
}

export interface LoginActivityParams {
  page?: number;
  limit?: number;
  status?: LoginActivityStatus;
  userId?: string;
  from?: string;
  to?: string;
}
export interface AuditLogUser {
  id: string;
  name: string;
  email: string;
}

export interface AuditLogRecord {
  id: string;
  sequence: number;
  timestamp: string;
  user: AuditLogUser;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
  resourceId: string;
}

export interface AuditLogFilterOption {
  value: string;
  label: string;
  email?: string;
}

export interface AuditLogFilters {
  search: string;
  selectedUserId: string;
  selectedAction: string;
  selectedModule: string;
  dateFilter: "day" | "month" | "year" | null;
  date: string | null;
  from: string | null;
  to: string | null;
  users: AuditLogFilterOption[];
  actions: AuditLogFilterOption[];
  modules: AuditLogFilterOption[];
  dateFilters: AuditLogFilterOption[];
}

export interface AuditLogPagination {
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface AuditLogResponse {
  section: string;
  records: AuditLogRecord[];
  filters: AuditLogFilters;
  pagination: AuditLogPagination;
  readOnly: boolean;
}

export interface AuditLogParams {
  page?: number;
  limit?: number;
  search?: string;
  userId?: string;
  action?: string;
  module?: string;
  from?: string;
  to?: string;
}
export type NotificationChannelKey = "IN_APP" | "EMAIL";
export type NotificationModuleStatus = "ENABLED" | "PARTIAL" | "DISABLED";

export interface NotificationCategory {
  notificationId: string;
  categoryKey: string;
  categoryName: string;
  description: string;
  configuredEnabled: boolean;
  enabled: boolean;
}

export interface NotificationModulePrefs {
  moduleKey: "hris" | "accounting" | "payroll";
  moduleName: string;
  entitled: boolean;
  controlsEnabled: boolean;
  moduleStatus: NotificationModuleStatus;
  toggleAll: boolean;
  notifications: NotificationCategory[];
}

export interface NotificationChannelInfo {
  id: string;
  key: NotificationChannelKey;
  name: string;
  description: string;
}

export interface NotificationPreferenceData {
  channel: NotificationChannelInfo;
  modules: NotificationModulePrefs[];
}

export interface NotificationPreferenceResponse {
  success: boolean;
  message: string;
  data: NotificationPreferenceData;
}

export interface NotificationToggleBody {
  enabled: boolean;
}

export type AnnouncementType = string;
export type AnnouncementReadStatus = "READ" | "UNREAD";

export interface Announcement {
  id: string;
  type: AnnouncementType;
  title: string;
  body: string;
  publishedAt: string;
  readStatus: AnnouncementReadStatus;
  readAt: string | null;
  learnMoreUrl?: string | null;
}

export interface AnnouncementsListResponse {
  success: boolean;
  message: string;
  data: Announcement[];
  metadata: {
    unreadCount: number;
    filters: {
      type: string | null;
      readStatus: string;
      sort: string;
    };
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AnnouncementDetailResponse {
  success: boolean;
  message: string;
  data: Announcement;
}

export interface LearnMoreResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    content: string;
  };
}
export interface OrganizationProfile {
  id: string;
  name: string;
  profileImageUrl: string | null;
  email: string;
  phone: string | null;
  industry: string | null;
  address: string | null;
  registrationAddress: string | null;
  country: string;
  currency: string;
  taxId: string | null;
  cacNumber: string | null;
  website: string | null;
  fiscalYearStart: string | null;
  companySize: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationUpdateBody {
  name?: string;
  email?: string;
  phone?: string;
  industry?: string;
  address?: string;
  registrationAddress?: string;
  country?: string;
  currency?: string;
  taxId?: string;
  cacNumber?: string;
  website?: string;
  fiscalYearStart?: string;
  companySize?: string;
}

export interface WorkScheduleSummary {
  workingDays: number;
  workStartTime: string;
  workEndTime: string;
  breakDurationMinutes: number;
}

export interface WorkSchedule {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
  workStartTime: string;
  workEndTime: string;
  breakDurationMinutes: number;
  summary: WorkScheduleSummary;
}

export interface WorkScheduleBody {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
  workStartTime: string;
  workEndTime: string;
  breakDurationMinutes: number;
}
export interface DepartmentTableRow {
  id: string;
  departmentName: string;
  headOfDepartment: string | null;
  employeeCount: number;
  dateCreated: string;
}

export interface DepartmentTableResponse {
  data: DepartmentTableRow[];
  meta: { page: number; limit: number; total: number };
}

export interface DepartmentBody {
  name: string;
  description?: string;
  headEmployeeId?: string;
}

export interface BranchTableRow {
  id: string;
  branchName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  dateCreated: string;
}

export interface BranchTableResponse {
  data: BranchTableRow[];
  meta: { page: number; limit: number; total: number };
}

export interface BranchBody {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
}
export interface MyPlanSubscription {
  status: string;
  planKey: string;
  planName: string;
  renewalDate: string;
  reminderDate: string;
  reminderLeadDays: number;
  reminderEnabled: boolean;
  monthlyCost: number;
  billingCycle: "MONTHLY" | "YEARLY";
  currency: string;
  cancelAtPeriodEnd: boolean;
  automaticRenewal: boolean;
}

export interface MyPlanCurrentPlan {
  planId: string;
  planCode: string;
  planName: string;
  status: string;
  monthlyCost: number;
  renewalDate: string;
  subscriptionStart: string;
  currentBillingPeriod: { start: string; end: string };
  employeeCount: number;
  activeModuleCount: number;
  includedModules: string[];
  features: string[];
}

export interface MyPlanActiveModule {
  key: string;
  name: string;
  status: string;
  includedInPlan: boolean;
  monthlyCost: number;
  monthlyPrice: number;
  billingFrequency: string;
  activationDate: string;
  canManage: boolean;
  description: string;
}

export interface MyPlanCostBreakdownItem {
  code: string;
  description: string;
  amount: number;
}

export interface MyPlanPaymentMethodSummary {
  selectedMethod: string;
  methods: { key: string; label: string; selected: boolean; isDefault: boolean }[];
  currentCard: { last4: string; brand: string; expiry: string; cardHolderName: string } | null;
  hasDefaultCard: boolean;
  addNewCard: {
    label: string;
    presentation: string;
    action: { method: string; href: string };
    fields: { name: string; label: string; type: string; required: boolean }[];
  };
  billingEmail: string;
}

export interface MyPlanQuickAction {
  key: string;
  label: string;
  method: string;
  href: string;
}

export interface MyPlanOverviewData {
  section: string;
  tenant: { id: string; name: string };
  subscription: MyPlanSubscription;
  currentPlan: MyPlanCurrentPlan;
  renewal: { renewalDate: string; daysUntilRenewal: number };
  activeModules: MyPlanActiveModule[];
  activeModuleCount: number;
  analytics: {
    currentPlan: string;
    subscriptionStatus: string;
    statusCounts: { active: number; pending: number; expired: number; cancelled: number };
    renewalDate: string;
    monthlyCost: number;
    numberOfEmployees: number;
    numberOfActiveModules: number;
  };
  costBreakdown: {
    items: MyPlanCostBreakdownItem[];
    totalMonthlyCost: number;
    total: number;
    basePlanCost: number;
    grandMonthlyTotal: number;
  };
  paymentMethod: MyPlanPaymentMethodSummary;
  quickActions: MyPlanQuickAction[];
}

export interface MyPlanOverviewResponse {
  success: boolean;
  message: string;
  data: MyPlanOverviewData;
}

export type PlanKey = "hris" | "payroll" | "accounting" | "all-in-one";

export interface MyPlanPlan {
  key: PlanKey;
  name: string;
  monthlyCost: number;
  pricingModel: string;
  yearlyCost: number;
  includedModules: string[];
  description: string;
  features: string[];
  isCurrent: boolean;
  currentPlan: boolean;
  active: boolean;
  availableForSwitch: boolean;
  monthlyEquivalentOnYearly: number;
  annualSavings: number;
  annualDiscountPercent: number;
  canUpgrade: boolean;
  canDowngrade: boolean;
}

export interface MyPlanPlansData {
  section: string;
  currentPlanKey: string;
  billingCycle: string;
  currency: string;
  purpose: string;
  plans: MyPlanPlan[];
}

export interface MyPlanPlansResponse {
  success: boolean;
  message: string;
  data: MyPlanPlansData;
}

export interface MyPlanChangeBody {
  planKey: PlanKey;
  billingCycle: "MONTHLY" | "YEARLY";
  confirm: boolean;
  paymentReference?: string;
  automaticRenewal?: boolean;
}

export interface MyPlanPreviewData {
  confirmationRequired: boolean;
  preview: {
    currentPlan: { key: string; name: string };
    currentMonthlyCost: number;
    selectedPlan: { key: string; name: string };
    selectedMonthlyCost: number;
    totalMonthlyCostAfterChange: number;
    effectiveDate: string;
    billingImpact: number;
    proratedCharges: number;
    currency: string;
  };
  scheduledChange: Record<string, unknown>;
  billingRecord: Record<string, unknown>;
}

export interface MyPlanPreviewResponse {
  success: boolean;
  message: string;
  data: MyPlanPreviewData;
}

export interface MyPlanCancelSubscriptionBody {
  confirmationText?: string;
  confirmCancel: boolean;
  keepPlan: boolean;
}

export interface MyPlanActiveModuleDetail {
  code: string;
  name: string;
  description: string;
  active: boolean;
  includedInCurrentPlan: boolean;
  canDisable: boolean;
  standalonePlanPrice: number;
  currency: string;
}

export interface MyPlanActiveModulesData {
  currentPlan: { code: string; name: string };
  modules: MyPlanActiveModuleDetail[];
}

export interface MyPlanActiveModulesResponse {
  success: boolean;
  message: string;
  data: MyPlanActiveModulesData;
}

export interface MyPlanCountryOption {
  value: string;
  label: string;
}

export interface MyPlanBillingAddressField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  disabledWhen?: string;
}

export interface MyPlanPaymentMethodData {
  section: string;
  title: string;
  paymentMethod: MyPlanPaymentMethodSummary;
  billingAddress: {
    values: {
      companyName: string;
      billingEmail: string;
      address: string;
      country: string;
      state: string;
    };
    fields: MyPlanBillingAddressField[];
    countryDropdown: { searchable: boolean; options: MyPlanCountryOption[] };
  };
}

export interface MyPlanPaymentMethodResponse {
  success: boolean;
  message: string;
  data: MyPlanPaymentMethodData;
}

export interface MyPlanAddCardBody {
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string;
  cvv: string;
  makeDefault?: boolean;
}

export interface MyPlanCard {
  id: string;
  last4: string;
  brand: string;
  cardHolderName: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export interface MyPlanCardsResponse {
  success: boolean;
  message: string;
  data: MyPlanCard[];
}

export interface MyPlanBillingAddressBody {
  companyName: string;
  billingEmail: string;
  address: string;
  country: string;
  state: string;
}

export interface MyPlanBillingHistoryItem {
  invoiceId: string;
  date: string;
  description: string;
  amountPaid: number;
  currency: string;
  paymentStatus: "paid" | "pending" | "failed" | "cancelled";
  invoiceNumber: string;
  downloadUrl: string;
}

export interface MyPlanBillingHistoryResponse {
  success: boolean;
  message: string;
  data: MyPlanBillingHistoryItem[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface MyPlanBillingHistoryParams {
  page?: number;
  limit?: number;
  year?: number;
  status?: "paid" | "pending" | "failed" | "cancelled";
}

export interface MyPlanBillingAnalytics {
  section: string;
  year: number;
  currency: string;
  totalPaidYearly: number;
  monthlyPaid: number;
  annualEstimate: number;
  activeMonthlySubscription: number;
}

export interface MyPlanBillingAnalyticsResponse {
  success: boolean;
  message: string;
  data: MyPlanBillingAnalytics;
}
export interface CacVerificationPayload {
  cacNumber: string;
}

export interface CacVerificationData {
  verified: boolean;
  verificationStatus: "VERIFIED" | "MISMATCH" | "FAILED" | "PROVIDER_UNAVAILABLE";
  available: boolean;
  reasonCode: string;
  retryable: boolean;
  availableActions: string[];
  nextAction: string | null;
  registrationNumber: string;
  registeredName: string | null;
  registryStatus: string | null;
  provider: string;
  checkedAt: string;
  verifiedAt: string | null;
}

export interface CacVerificationResponse {
  success: boolean;
  message: string;
  data: CacVerificationData;
}