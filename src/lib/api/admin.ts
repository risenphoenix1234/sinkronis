import api from "../api/axios";
import {
  CreateGroupPayload,
  CreateInvitationPayload,
  CreateRolePayload,
  EditUserPayload,
  RoleDetail,
  RoleTemplate,
  TenantDashboardResponse,
  TenantInvitationsResponse,
  TenantRole,
  TenantUserGroupsResponse,
  TenantUsersAnalytics,
  TenantUsersResponse,
  UpdateRolePayload,
  AdminModuleSectionResponse,
  ModuleKey,
  ModuleStatus,
  SecurityPasswordPolicyBody,
  SecurityPolicyResponse,
  SecurityTwoFactorBody,
  RevokeSessionBody,
  RevokeSessionsBulkBody,
  SecuritySessionsParams,
  SecuritySessionsResponse,
  SecurityIpAllowlistEntryBody,
  SecurityIpAllowlistResponse,
  SecurityIpAllowlistToggleBody,
  LoginActivityParams,
  LoginActivityResponse,
  AuditLogParams,
  AuditLogResponse,
  AnnouncementDetailResponse,
  AnnouncementsListResponse,
  LearnMoreResponse,
  NotificationPreferenceResponse,
  OrganizationProfile,
  OrganizationUpdateBody,
  WorkSchedule,
  WorkScheduleBody,
  BranchBody,
  BranchTableResponse,
  DepartmentBody,
  DepartmentTableResponse,
  MyPlanActiveModulesResponse,
  MyPlanAddCardBody,
  MyPlanBillingAddressBody,
  MyPlanBillingAnalyticsResponse,
  MyPlanBillingHistoryParams,
  MyPlanBillingHistoryResponse,
  MyPlanCancelSubscriptionBody,
  MyPlanCardsResponse,
  MyPlanChangeBody,
  MyPlanOverviewResponse,
  MyPlanPaymentMethodResponse,
  MyPlanPlansResponse,
  MyPlanPreviewResponse,
  CacVerificationPayload,
  CacVerificationResponse,
  GeneralLocaleOptionsResponse,
  GeneralLocaleSettings,
  GeneralLocaleSettingsResponse,
  GeneralBrandingSettingsResponse,
  OrganizationDeletionRequestBody,
  OrganizationDeletionRequestResponse,
  OrganizationExportRequestResponse,
  OrganizationExportStatusResponse,
  UpdateBrandingBody,
  UploadLogoResponse,
} from "./types/admin.types";

const BASE = "/admin";

export const getTenantDashboard = async () => {
  const { data } = await api.get<TenantDashboardResponse>(`${BASE}/dashboard`);
  return data;
};
export const getUsersAnalytics = async () => {
  const { data } = await api.get<TenantUsersAnalytics>(`${BASE}/users/analytics`);
  return data;
};

export const getTenantUsers = async (params?: { page?: number; limit?: number; search?: string }) => {
  const { data } = await api.get<TenantUsersResponse>(`${BASE}/users`, { params });
  return data;
};

export const editTenantUser = async (id: string, payload: EditUserPayload) => {
  const { data } = await api.patch(`${BASE}/users/${id}`, payload);
  return data;
};

export const removeTenantUser = async (id: string) => {
  const { data } = await api.delete(`${BASE}/users/${id}`);
  return data;
};

export const getInvitations = async (params?: { page?: number; limit?: number }) => {
  const { data } = await api.get<TenantInvitationsResponse>(`${BASE}/users/invitations`, { params });
  return data;
};

export const createInvitation = async (payload: CreateInvitationPayload) => {
  const { data } = await api.post(`${BASE}/users/invitations`, payload);
  return data;
};

export const resendInvitation = async (id: string) => {
  const { data } = await api.post(`${BASE}/users/invitations/${id}/resend`);
  return data;
};

export const getUserGroups = async (params?: { page?: number; limit?: number }) => {
  const { data } = await api.get<TenantUserGroupsResponse>(`${BASE}/users/groups`, { params });
  return data;
};

export const createUserGroup = async (payload: CreateGroupPayload) => {
  const { data } = await api.post(`${BASE}/users/groups`, payload);
  return data;
};

export const deleteUserGroup = async (id: string) => {
  const { data } = await api.delete(`${BASE}/users/groups/${id}`);
  return data;
};

export const getRoles = async () => {
  const { data } = await api.get<TenantRole[]>(`${BASE}/roles`);
  return data;
};
export const getRoleDetails = async () => {
  const { data } = await api.get<RoleDetail[]>(`${BASE}/roles`);
  return data;
};

export const getRoleTemplates = async () => {
  const { data } = await api.get<RoleTemplate[]>(`${BASE}/roles/templates`);
  return data;
};

export const createRole = async (payload: CreateRolePayload) => {
  const { data } = await api.post<RoleDetail>(`${BASE}/roles`, payload);
  return data;
};

export const updateRole = async (id: string, payload: UpdateRolePayload) => {
  const { data } = await api.patch<RoleDetail>(`${BASE}/roles/${id}`, payload);
  return data;
};

export const deleteRole = async (id: string) => {
  const { data } = await api.delete(`${BASE}/roles/${id}`);
  return data;
};

export const cloneRole = async (id: string, payload: { name: string }) => {
  const { data } = await api.post<RoleDetail>(`${BASE}/roles/${id}/clone`, payload);
  return data;
};

export const getAdminModules = async () => {
  const { data } = await api.get<AdminModuleSectionResponse>(`${BASE}/modules`);
  return data;
};

export const updateModuleStatus = async (moduleKey: ModuleKey, status: ModuleStatus) => {
  const { data } = await api.patch(`${BASE}/modules/${moduleKey}/status`, { status });
  return data;
};

export const getSecurityPolicy = async () => {
  const { data } = await api.get<SecurityPolicyResponse>(`${BASE}/security/policy`);
  return data;
};

export const updatePasswordPolicy = async (payload: SecurityPasswordPolicyBody) => {
  const { data } = await api.put(`${BASE}/security/password-policy`, payload);
  return data;
};
export const updateTwoFactorPolicy = async (payload: SecurityTwoFactorBody) => {
  const { data } = await api.put(`${BASE}/security/two-factor`, payload);
  return data;
};

export const getActiveSessions = async (params?: SecuritySessionsParams) => {
  const { data } = await api.get<SecuritySessionsResponse>(`${BASE}/security/sessions`, { params });
  return data;
};

export const revokeSession = async (id: string, payload?: RevokeSessionBody) => {
  const { data } = await api.post(`${BASE}/security/sessions/${id}/revoke`, payload ?? {});
  return data;
};

export const revokeSessionsBulk = async (payload: RevokeSessionsBulkBody) => {
  const { data } = await api.post(`${BASE}/security/sessions/revoke-bulk`, payload);
  return data;
};

export const revokeAllOtherSessions = async () => {
  const { data } = await api.post(`${BASE}/security/sessions/revoke-all-others`);
  return data;
};

export const getIpAllowlist = async () => {
  const { data } = await api.get<SecurityIpAllowlistResponse>(`${BASE}/security/ip-allowlist`);
  return data;
};

export const addIpAllowlistEntry = async (payload: SecurityIpAllowlistEntryBody) => {
  const { data } = await api.post(`${BASE}/security/ip-allowlist`, payload);
  return data;
};

export const toggleIpAllowlist = async (payload: SecurityIpAllowlistToggleBody) => {
  const { data } = await api.put(`${BASE}/security/ip-allowlist/toggle`, payload);
  return data;
};

export const removeIpAllowlistEntry = async (id: string) => {
  const { data } = await api.delete(`${BASE}/security/ip-allowlist/${id}`);
  return data;
};

export const getLoginActivity = async (params?: LoginActivityParams) => {
  const { data } = await api.get<LoginActivityResponse>(`${BASE}/security/login-activity`, { params });
  return data;
};

export const getAuditLog = async (params?: AuditLogParams) => {
  const { data } = await api.get<AuditLogResponse>(`${BASE}/audit-log`, { params });
  return data;
};

export const exportAuditLogCsv = async (params?: Omit<AuditLogParams, "page" | "limit">) => {
  const response = await api.get(`${BASE}/audit-log/export`, {
    params,
    responseType: "blob",
  });
  return response.data;
};

export const getNotificationPreferences = async (channelKey: "IN_APP" | "EMAIL") => {
  const { data } = await api.get<NotificationPreferenceResponse>(
    `${BASE}/notifications-alerts/preferences/${channelKey}`
  );
  return data;
};

export const toggleNotificationModule = async (
  channelKey: "IN_APP" | "EMAIL",
  moduleKey: string,
  enabled: boolean
) => {
  const { data } = await api.patch<NotificationPreferenceResponse>(
    `${BASE}/notifications-alerts/preferences/${channelKey}/modules/${moduleKey}`,
    { enabled }
  );
  return data;
};

export const toggleNotificationCategory = async (
  channelKey: "IN_APP" | "EMAIL",
  moduleKey: string,
  categoryId: string,
  enabled: boolean
) => {
  const { data } = await api.patch<NotificationPreferenceResponse>(
    `${BASE}/notifications-alerts/preferences/${channelKey}/modules/${moduleKey}/categories/${categoryId}`,
    { enabled }
  );
  return data;
};

export const getAnnouncements = async (params?: { page?: number; limit?: number }) => {
  const { data } = await api.get<AnnouncementsListResponse>(
    `${BASE}/notifications-alerts/announcements`,
    { params }
  );
  return data;
};

export const getAnnouncement = async (announcementId: string) => {
  const { data } = await api.get<AnnouncementDetailResponse>(
    `${BASE}/notifications-alerts/announcements/${announcementId}`
  );
  return data;
};

export const getAnnouncementLearnMore = async (announcementId: string) => {
  const { data } = await api.get<LearnMoreResponse>(
    `${BASE}/notifications-alerts/announcements/${announcementId}/learn-more`
  );
  return data;
};

export const markAnnouncementRead = async (announcementId: string) => {
  const { data } = await api.post(`${BASE}/notifications-alerts/announcements/${announcementId}/read`);
  return data;
};

export const markAllAnnouncementsRead = async () => {
  const { data } = await api.post(`${BASE}/notifications-alerts/announcements/read-all`);
  return data;
};

export const getOrganizationProfile = async () => {
  const { data } = await api.get<OrganizationProfile>(`${BASE}/organization`);
  return data;
};

export const updateOrganizationProfile = async (payload: OrganizationUpdateBody) => {
  const { data } = await api.patch<OrganizationProfile>(`${BASE}/organization`, payload);
  return data;
};

export const getWorkSchedule = async () => {
  const { data } = await api.get<WorkSchedule>(`${BASE}/organization/work-schedule`);
  return data;
};

export const saveWorkSchedule = async (payload: WorkScheduleBody) => {
  const { data } = await api.put<WorkSchedule>(`${BASE}/organization/work-schedule`, payload);
  return data;
};

export const getDepartmentsTable = async (params?: { page?: number; limit?: number; search?: string }) => {
  const { data } = await api.get<DepartmentTableResponse>(`${BASE}/departments/table`, { params });
  return data;
};

export const createDepartment = async (payload: DepartmentBody) => {
  const { data } = await api.post(`${BASE}/departments`, payload);
  return data;
};

export const deleteDepartment = async (id: string) => {
  const { data } = await api.delete(`${BASE}/departments/${id}`);
  return data;
};

export const getBranchesTable = async (params?: { page?: number; limit?: number; search?: string }) => {
  const { data } = await api.get<BranchTableResponse>(`${BASE}/branches/table`, { params });
  return data;
};

export const createBranch = async (payload: BranchBody) => {
  const { data } = await api.post(`${BASE}/branches`, payload);
  return data;
};

export const deleteBranch = async (id: string) => {
  const { data } = await api.delete(`${BASE}/branches/${id}`);
  return data;
};

export const getMyPlanOverview = async () => {
  const { data } = await api.get<MyPlanOverviewResponse>(`${BASE}/my-plan/overview`);
  return data;
};

export const getMyPlanPlans = async () => {
  const { data } = await api.get<MyPlanPlansResponse>(`${BASE}/my-plan/plans`);
  return data;
};

export const purchaseInitialPlan = async (payload: MyPlanChangeBody) => {
  const { data } = await api.post(`${BASE}/my-plan/subscriptions`, payload);
  return data;
};

export const switchPlan = async (payload: MyPlanChangeBody) => {
  const { data } = await api.patch<MyPlanPreviewResponse>(`${BASE}/my-plan/subscription/plan`, payload);
  return data;
};

export const cancelSubscription = async (payload: MyPlanCancelSubscriptionBody) => {
  const { data } = await api.post(`${BASE}/my-plan/subscription/cancel`, payload);
  return data;
};

export const cancelPendingPlanChange = async (changeId: string) => {
  const { data } = await api.delete(`${BASE}/my-plan/subscription/plan-change/${changeId}`);
  return data;
};

export const getMyPlanActiveModules = async () => {
  const { data } = await api.get<MyPlanActiveModulesResponse>(`${BASE}/my-plan/active-modules`);
  return data;
};

export const getMyPlanPaymentMethod = async () => {
  const { data } = await api.get<MyPlanPaymentMethodResponse>(`${BASE}/my-plan/payment-method`);
  return data;
};

export const setDefaultPaymentCard = async (paymentCardId: string) => {
  const { data } = await api.patch(`${BASE}/my-plan/payment-method`, { paymentCardId });
  return data;
};

export const getMyPlanCards = async () => {
  const { data } = await api.get<MyPlanCardsResponse>(`${BASE}/my-plan/payment-method/cards`);
  return data;
};

export const addPaymentCard = async (payload: MyPlanAddCardBody) => {
  const { data } = await api.post(`${BASE}/my-plan/payment-method/cards`, payload);
  return data;
};

export const updatePaymentCard = async (
  cardId: string,
  payload: { cardHolderName?: string; expMonth?: number; expYear?: number; makeDefault?: boolean }
) => {
  const { data } = await api.patch(`${BASE}/my-plan/payment-method/cards/${cardId}`, payload);
  return data;
};

export const removePaymentCard = async (cardId: string) => {
  const { data } = await api.delete(`${BASE}/my-plan/payment-method/cards/${cardId}`);
  return data;
};

export const saveBillingAddress = async (payload: MyPlanBillingAddressBody) => {
  const { data } = await api.patch(`${BASE}/my-plan/payment-method/billing-address`, payload);
  return data;
};

export const getBillingHistory = async (params?: MyPlanBillingHistoryParams) => {
  const { data } = await api.get<MyPlanBillingHistoryResponse>(`${BASE}/my-plan/billing-history`, { params });
  return data;
};

export const exportBillingHistoryCsv = async (params?: { year?: number; status?: string }) => {
  const response = await api.get(`${BASE}/my-plan/billing-history/export`, {
    params,
    responseType: "blob",
  });
  return response.data;
};

export const getBillingAnalytics = async (year?: number) => {
  const { data } = await api.get<MyPlanBillingAnalyticsResponse>(`${BASE}/my-plan/billing-analytics`, {
    params: { year },
  });
  return data;
};

export const downloadInvoicePdf2 = async (invoiceId: string) => {
  const response = await api.get(`${BASE}/my-plan/invoices/${invoiceId}/download`, {
    responseType: "blob",
  });
  return response.data;
};

export const verifyCacNumber = async (payload: CacVerificationPayload) => {
  const { data } = await api.post<CacVerificationResponse>(
    `${BASE}/organization/cac-verification`,
    payload
  );
  return data;
};

export const getLocaleSettings = async () => {
  const { data } = await api.get<GeneralLocaleSettingsResponse>(
    `${BASE}/general-settings/locale`
  );
  return data;
};

export const saveLocaleSettings = async (payload: GeneralLocaleSettings) => {
  const { data } = await api.put<GeneralLocaleSettingsResponse>(
    `${BASE}/general-settings/locale`,
    payload
  );
  return data;
};

export const getLocaleOptions = async () => {
  const { data } = await api.get<GeneralLocaleOptionsResponse>(
    `${BASE}/general-settings/locale/options`
  );
  return data;
};

export const getBrandingSettings = async () => {
  const { data } = await api.get<GeneralBrandingSettingsResponse>(`${BASE}/general-settings/branding`);
  return data;
};

export const updateBrandingSettings = async (payload: UpdateBrandingBody) => {
  const { data } = await api.patch<GeneralBrandingSettingsResponse>(
    `${BASE}/general-settings/branding`,
    payload
  );
  return data;
};

export const uploadBrandingLogo = async (file: File) => {
  const formData = new FormData();
  formData.append("logo", file);
  const { data } = await api.post<UploadLogoResponse>(
    `${BASE}/general-settings/branding/logo`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
};

export const requestOrganizationExport = async () => {
  const { data } = await api.post<OrganizationExportRequestResponse>(
    `${BASE}/general-settings/data-privacy/exports`
  );
  return data;
};

export const getOrganizationExportStatus = async (exportId: string) => {
  const { data } = await api.get<OrganizationExportStatusResponse>(
    `${BASE}/general-settings/data-privacy/exports/${exportId}`
  );
  return data;
};

export const downloadOrganizationExport = async (exportId: string) => {
  const response = await api.get(
    `${BASE}/general-settings/data-privacy/exports/${exportId}/download`,
    { responseType: "blob" }
  );
  return response.data;
};

export const requestOrganizationDeletion = async (payload: OrganizationDeletionRequestBody) => {
  const { data } = await api.post<OrganizationDeletionRequestResponse>(
    `${BASE}/general-settings/data-privacy/deletion-request`,
    payload
  );
  return data;
};