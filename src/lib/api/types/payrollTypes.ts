// Confirmed against Swagger: GET /api/v1/payroll/dashboard
export type PayRunStatus =
  | "DRAFT"
  | "PROCESSING"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "PENDING_DISBURSEMENT"
  | "DISBURSING"
  | "DISBURSED"
  | "FAILED"
  | "PAID"
  | "CANCELLED";

export type StatutoryObligationStatus = "DUE" | "OVERDUE" | "REMITTED";

export type StatutoryObligationType = "PAYE" | "PENSION" | "NHF" | "NSITF";

export interface PayrollMoneyValue {
  amount: number;
  currency: string;
  period: string;
}

export interface PayrollDashboardLastRunNetPay {
  amount: number;
  currency: string;
  period: string;
  payRunId?: string;
}

export interface PayrollDashboardPendingDisbursement {
  amount: number;
  currency: string;
  period: string;
  payRunId?: string;
  status?: PayRunStatus;
}

export interface PayrollDashboardSummary {
  employeesOnPayroll: number;
  totalMonthlyCost: PayrollMoneyValue;
  lastRunNetPay: PayrollDashboardLastRunNetPay | null;
  pendingDisbursement: PayrollDashboardPendingDisbursement | null;
}

export interface PayrollPendingApproval {
  payRunId: string;
  period: string;
  employees: number;
  totalNet: number;
  currency: string;
  createdAt: string;
  status: "PENDING_APPROVAL";
}

export interface PayrollTrendItem {
  period: string;
  gross: number;
  netPay: number;
}

export interface PayrollDeductionTrendItem {
  period: string;
  paye: number;
  pension: number;
  nhf: number;
}

export interface DepartmentPayrollCostItem {
  departmentId?: string | null;
  departmentName: string;
  grossAmount: number;
}

export interface DepartmentPayrollCosts {
  period: string | null;
  items: DepartmentPayrollCostItem[];
}

export interface StatutoryObligationItem {
  id: string;
  type: StatutoryObligationType;
  label: string;
  amount: number;
  dueDate?: string | null;
  status: StatutoryObligationStatus;
  remittedAt?: string | null;
}

export interface StatutoryObligations {
  period: string | null;
  items: StatutoryObligationItem[];
}

export interface RecentPayRunItem {
  id: string;
  period: string;
  employees: number;
  gross: number;
  netPay: number;
  paye: number;
  status: PayRunStatus;
}

export interface PayrollDashboardActions {
  canRunPayroll: boolean;
  canViewPayslips: boolean;
  canManageDeductions: boolean;
}

export interface PayrollDashboardData {
  period: string;
  currency: string;
  summary: PayrollDashboardSummary;
  pendingApproval: PayrollPendingApproval | null;
  payrollTrend: PayrollTrendItem[];
  deductionTrend: PayrollDeductionTrendItem[];
  departmentCosts: DepartmentPayrollCosts;
  statutoryObligations: StatutoryObligations;
  recentPayRuns: RecentPayRunItem[];
  actions: PayrollDashboardActions;
}

export interface PayrollDashboardResponse {
  success: boolean;
  message: string;
  data: PayrollDashboardData;
}

// Confirmed against live backend: GET /api/v1/payroll/pay-runs/eligibility
export interface GetPayRunEligibilityParams {
  /** ISO date string "YYYY-MM-DD" — start of pay period */
  from: string;
  /** ISO date string "YYYY-MM-DD" — end of pay period (must be >= from) */
  to: string;
}

export interface PayRunEligibilityData {
  employeeCount: number;
}

export interface GetPayRunEligibilityResponse {
  success: boolean;
  message: string;
  data: PayRunEligibilityData;
}

// Confirmed against live backend: GET /api/v1/payroll/pay-runs
export type PayRunSortBy =
  "period" | "createdAt" | "employees" | "gross" | "netPay" | "paye" | "status";

export interface GetPayRunsParams {
  page?: number;
  limit?: number;
  search?: string;
  /** Filter by API-canonical status enum value */
  status?: PayRunStatus;
  sortBy?: PayRunSortBy;
  sortOrder?: "asc" | "desc";
}

/** Single pay-run item returned in the paginated list. */
export interface PayRunListItem {
  id: string;
  period: string;
  createdAt: string;
  employees: number;
  gross: number;
  netPay: number;
  paye: number;
  status: PayRunStatus;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

export interface GetPayRunsResponse {
  success: boolean;
  message: string;
  data: PayRunListItem[];
  pagination: PaginationMeta;
}

// Confirmed against Swagger: POST /api/v1/payroll/pay-runs
export interface CreatePayRunBody {
  /** Human-readable label, e.g. "September 2026 Payroll" */
  periodLabel: string;
  /** ISO date "YYYY-MM-DD" — start of pay period */
  from: string;
  /** ISO date "YYYY-MM-DD" — end of pay period (must be >= from) */
  to: string;
  /** ISO date "YYYY-MM-DD" — intended payment date */
  payDate?: string;
}

export interface PayRunProgress {
  expected: number;
  processed: number;
  failed: number;
  percentage: number;
}

/** Data returned in a 202 response after the run is queued */
export interface CreatedPayRunData {
  id: string;
  status: "PROCESSING";
  expectedEmployeeCount: number;
  processedEmployeeCount: number;
  failedEmployeeCount: number;
  progress: PayRunProgress;
  failureReason: string | null;
}

export interface CreatePayRunResponse {
  success: boolean;
  message: string;
  data: CreatedPayRunData;
}

/** Shape of `details` on a 503 queue-unavailable error */
export interface PayRunQueueError {
  available: boolean;
  reasonCode: string;
  retryable: boolean;
  availableActions: string[];
  nextAction: string;
}

// Confirmed against Swagger: GET /api/v1/payroll/pay-runs/{payRunId}
export type PayslipApiStatus = "PENDING" | "PAID" | "FAILED";

/** Single payslip row returned within a pay-run detail response */
export interface PayRunPayslipItem {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  departmentName: string;
  jobTitle: string;
  gross: number;
  paye: number;
  pension: number;
  nhf: number;
  netPay: number;
  bankName: string;
  bankAccount: string;
  status: PayslipApiStatus;
}

/** Full pay-run detail including header, progress, and paginated payslip rows */
export interface PayRunDetail {
  id: string;
  period: string;
  status: PayRunStatus;
  createdAt: string;
  from: string;
  to: string;
  payDate: string;
  employees: number;
  gross: number;
  netPay: number;
  paye: number;
  failureReason: string | null;
  progress: PayRunProgress;
  payslips: PayRunPayslipItem[];
}

export interface GetPayRunDetailParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetPayRunDetailResponse {
  success: boolean;
  message: string;
  data: PayRunDetail;
  pagination?: PaginationMeta;
}

// Confirmed against Swagger: POST /api/v1/payroll/pay-runs/{payRunId}/approve
export interface ApprovePayRunResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown> | null;
}

// Confirmed against Swagger: GET /api/v1/payroll/pay-runs/{payRunId}/export
// Export immutable pay run employee snapshots as CSV (text/csv).
export type ExportPayRunResponse = Blob;

// Confirmed against Swagger: GET /api/v1/payroll/payees
export type PayeeApiType =
  "CONTRACTOR" | "VENDOR" | "DIRECTOR" | "BOARD_MEMBER";
export type PayeeApiStatus = "ACTIVE" | "INACTIVE";

export interface PayeeBankInfo {
  bankName?: string | null;
  bankCode?: string | null;
  accountNumber?: string | null;
  accountName?: string | null;
}

export interface PayeeListItem {
  id: string;
  name: string;
  type: PayeeApiType;
  status: PayeeApiStatus;
  email: string | null;
  phone: string | null;
  monthlyAmount: number;
  isTaxable: boolean;
  bank?: PayeeBankInfo | null;
}

export interface PayeesSummary {
  totalPayees: number;
  activePayees: number;
  monthlyTotal: number;
}

export interface GetPayeesParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: PayeeApiType;
  status?: PayeeApiStatus;
  taxable?: boolean;
  sortBy?: "name" | "type" | "amount" | "status";
  sortOrder?: "asc" | "desc";
}

export interface GetPayeesResponseData {
  summary: PayeesSummary;
  payees: PayeeListItem[];
}

export interface GetPayeesResponse {
  success: boolean;
  message: string;
  data: GetPayeesResponseData;
  pagination: PaginationMeta;
}

// Confirmed against Swagger: POST /api/v1/payroll/payees
// Create a non-employee Payee
export interface CreatePayeeBody {
  name: string;
  type: PayeeApiType;
  status: PayeeApiStatus;
  email?: string;
  phone?: string;
  bankName?: string;
  bankCode?: string;
  accountNumber?: string;
  accountName?: string;
  tin?: string;
  monthlyAmount: number;
  isTaxable?: boolean;
}

export interface CreatePayeeResponseData {
  id: string;
  name: string;
  type: PayeeApiType;
  status: PayeeApiStatus;
  email?: string | null;
  phone?: string | null;
  monthlyAmount: number;
  isTaxable: boolean;
  bank?: {
    bankName?: string | null;
    bankCode?: string | null;
    accountNumber?: string | null;
    accountName?: string | null;
  };
  tin?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePayeeResponse {
  success: boolean;
  message: string;
  data: CreatePayeeResponseData;
}

// Confirmed against Swagger: GET /api/v1/payroll/payees/export
// Export filtered tenant Payees as CSV (text/csv).
export type ExportPayeesParams = Omit<GetPayeesParams, "page" | "limit">;
export type ExportPayeesResponse = Blob;

// Confirmed against Swagger: GET /api/v1/payroll/payees/{payeeId}
// Get a tenant Payee (Masked Payee detail)
export interface PayeeDetail {
  id: string;
  name: string;
  type: PayeeApiType;
  status: PayeeApiStatus;
  email?: string | null;
  phone?: string | null;
  monthlyAmount: number;
  isTaxable: boolean;
  bank?: {
    bankName?: string | null;
    bankCode?: string | null;
    accountNumber?: string | null;
    accountName?: string | null;
  } | null;
  tin?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetPayeeDetailResponse {
  success: boolean;
  message: string;
  data: PayeeDetail;
}

// Confirmed against Swagger: PATCH /api/v1/payroll/payees/{payeeId}
// Update future Payee configuration
export interface UpdatePayeeBody {
  name?: string;
  type?: PayeeApiType;
  status?: PayeeApiStatus;
  email?: string;
  phone?: string;
  bankName?: string;
  bankCode?: string;
  accountNumber?: string;
  accountName?: string;
  tin?: string;
  monthlyAmount?: number;
  isTaxable?: boolean;
}

export interface UpdatePayeeResponse {
  success: boolean;
  message: string;
  data: PayeeDetail;
}

// Confirmed against Swagger: DELETE /api/v1/payroll/payees/{payeeId}
// Remove a Payee from future runs
export interface DeletePayeeResponseData {
  id: string;
  status: PayeeApiStatus;
  removed: boolean;
}

export interface DeletePayeeResponse {
  success: boolean;
  message: string;
  data: DeletePayeeResponseData;
}

// Confirmed against Swagger: GET /api/v1/payroll/payees/{payeeId}/payment-history
// Get immutable Payee payment history (Paginated PayRun-backed payment snapshots)
export type PayeePaymentStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED";

export interface PayeePaymentSnapshot {
  id: string;
  period: string; // e.g. "2026-03"
  amount: number; // immutable net payment snapshot
  grossAmount?: number;
  payeTax?: number;
  paymentDate?: string | null;
  reference?: string | null;
  status: PayeePaymentStatus;
  currency?: string;
}

export interface GetPayeePaymentHistoryParams {
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
}

export interface GetPayeePaymentHistoryResponse {
  success: boolean;
  message: string;
  data: PayeePaymentSnapshot[];
  pagination: PaginationMeta;
}

// Confirmed against Swagger: GET /api/v1/payroll/payees/{payeeId}/payment-history/export
// Export Payee payment history as CSV (text/csv)
export type ExportPayeePaymentHistoryResponse = Blob;

// Confirmed against Swagger: GET /api/v1/payroll/payees/{payeeId}/documents
// List Payee document metadata (Tenant Payee documents)
export interface PayeeDocumentItem {
  id: string;
  documentName: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export interface GetPayeeDocumentsResponse {
  success: boolean;
  message: string;
  data: PayeeDocumentItem[];
}

// Confirmed against Swagger: POST /api/v1/payroll/payees/{payeeId}/documents
// Upload a Payee document (JPEG, PNG, or PDF; maximum 10 MB; MIME and file signature are checked)
export interface UploadPayeeDocumentBody {
  documentName: string;
  file: File | Blob;
}

export interface UploadPayeeDocumentData {
  id: string;
  documentName: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt?: string;
  createdAt?: string;
}

export interface UploadPayeeDocumentResponse {
  success: boolean;
  message: string;
  data: UploadPayeeDocumentData;
}

// Confirmed against Swagger: GET /api/v1/payroll/payees/{payeeId}/documents/{documentId}/download
// Download a tenant Payee document (Document stream as Blob)
export type DownloadPayeeDocumentResponse = Blob;

// Confirmed against Swagger: GET /api/v1/payroll/payslips/{payslipId}
// View authoritative payslip snapshot
export interface TenantPayslipEarningItem {
  name: string;
  amount: number;
  type?: string;
}

export interface TenantPayslipDeductionItem {
  name: string;
  amount: number;
  type?: string;
  color?: string;
}

export interface TenantPayslipEmployerContributionItem {
  name: string;
  amount: number;
}

export interface TenantPayslipDetail {
  id: string;
  payRunId?: string;
  employeeId?: string;
  employeeName: string;
  employeeCode?: string;
  email?: string;
  departmentName?: string;
  jobTitle?: string;
  gradeLevel?: string;
  period: string;
  payDate?: string;
  status: string;
  currency?: string;
  grossPay: number;
  gross?: number;
  netPay: number;
  totalDeductions: number;
  deductions?: number;
  bankName?: string;
  bankAccount?: string;
  accountNumber?: string;
  tin?: string;
  pensionNumber?: string;
  earnings?: TenantPayslipEarningItem[];
  deductionsList?: TenantPayslipDeductionItem[];
  deductionsBreakdown?: TenantPayslipDeductionItem[];
  employerContributions?: TenantPayslipEmployerContributionItem[];
  basic?: number;
  housing?: number;
  transport?: number;
  otherAllowances?: number;
  other?: number;
  paye?: number;
  pension?: number;
  nhf?: number;
  loans?: number;
  [key: string]: unknown;
}

export interface GetTenantPayslipDetailResponse {
  success: boolean;
  message: string;
  data: TenantPayslipDetail;
}

// Confirmed against Swagger: GET /api/v1/payroll/payslips/{payslipId}/download
// Download a snapshot-based payslip PDF (PDF binary stream as Blob)
export type DownloadTenantPayslipPdfResponse = Blob;

// ─── Confirmed against Swagger + live API: GET /api/v1/payroll/payslips ────────

/** Status values returned by the payslips list endpoint. */
export type TenantPayslipStatus = "PAID" | "PENDING" | "READY" | "FAILED";

/**
 * Quarter string enum accepted by the backend.
 * The API rejects numeric values (1–4); it expects "Q1"–"Q4".
 */
export type PayslipsQuarterParam = "Q1" | "Q2" | "Q3" | "Q4";

export interface PayslipListFilterDepartment {
  id: string;
  name: string;
}

export interface PayslipListFilters {
  years: number[];
  months: number[];
  departments: PayslipListFilterDepartment[];
  statuses: TenantPayslipStatus[];
}

export interface PayslipListPeriod {
  year: number | null;

  quarter: string | null;
  month: number | null;
  label: string | null;
}

export interface PayslipListTotals {
  payslipCount: number;
  totalGross: number;
  totalDeductions: number;
  totalNetPay: number;
}

/** A single row in the payslips list. */
export interface PayslipListItem {
  id: string;
  employeeId?: string;
  employeeName: string;
  employeeCode?: string;
  departmentName?: string;
  jobTitle?: string;
  period: string;
  payDate?: string;
  status: TenantPayslipStatus;
  grossPay: number;
  netPay: number;
  totalDeductions: number;
  currency?: string;
  [key: string]: unknown;
}

/** Query parameters accepted by GET /api/v1/payroll/payslips. */
export interface GetPayslipsParams {
  year?: number;
  month?: number;
  quarter?: PayslipsQuarterParam;
  departmentId?: string;
  status?: TenantPayslipStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface GetPayslipsData {
  period: PayslipListPeriod;
  totals: PayslipListTotals;
  filters: PayslipListFilters;
  payslips: PayslipListItem[];
}

export interface GetPayslipsResponse {
  success: boolean;
  message: string;
  data: GetPayslipsData;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Confirmed against Swagger: GET /api/v1/payroll/payslips/export
// Accepts the same filter params as the list; returns CSV Blob.
export interface ExportPayslipsParams {
  year?: number;
  month?: number;
  quarter?: PayslipsQuarterParam;
  departmentId?: string;
  status?: TenantPayslipStatus;
  search?: string;
}

// ─── Confirmed against Swagger + live API: GET /api/v1/payroll/employees ────────

export type PayrollEmployeeStatus =
  "ACTIVE" | "ON_LEAVE" | "SUSPENDED" | "TERMINATED";

export type PayrollEmployeePayrollStatus = "ON_PAYROLL" | "OFF_PAYROLL";

export type PayrollEmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT";

export type PayrollEmployeeSortBy =
  "name" | "department" | "gross" | "netPay" | "status";

export interface PayrollEmployeeDepartment {
  id: string;
  name: string;
}

/** A single row returned by GET /api/v1/payroll/employees. */
export interface PayrollEmployeeItem {
  employeeId: string;
  employeeCode: string;
  fullName: string;
  initials: string;
  role: string | null;
  department: PayrollEmployeeDepartment | null;
  employmentType: PayrollEmploymentType | null;
  employeeStatus: PayrollEmployeeStatus;
  payrollStatus: PayrollEmployeePayrollStatus;
  grossPay: number;
  netPay: number;
  paye: number;
}

/** Query params accepted by GET /api/v1/payroll/employees. */
export interface GetPayrollEmployeesParams {
  page?: number;
  limit?: number;
  search?: string;
  departmentId?: string;
  status?: PayrollEmployeeStatus;
  employmentType?: PayrollEmploymentType;
  payrollStatus?: PayrollEmployeePayrollStatus;
  sortBy?: PayrollEmployeeSortBy;
  sortOrder?: "asc" | "desc";
}

export interface GetPayrollEmployeesResponse {
  success: boolean;
  message: string;
  data: PayrollEmployeeItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ─── Confirmed against Swagger + live API: POST /api/v1/payroll/employees ────────

export interface CreatePayrollEmployeeSalaryProration {
  resumeDate?: string;
  method?: "WORKING_DAYS" | "CALENDAR_DAYS";
}

export interface CreatePayrollEmployeeSalaryAdditionalAllowance {
  name: string;
  amount: number;
  taxable: boolean;
}

export interface CreatePayrollEmployeeSalary {
  basicSalary: number;
  housingAllowance?: number;
  transportAllowance?: number;
  otherAllowance?: number;
  additionalAllowances?: CreatePayrollEmployeeSalaryAdditionalAllowance[];
  effectiveFrom?: string; // "YYYY-MM-DD"
  proration?: CreatePayrollEmployeeSalaryProration;
}

/** Request body for POST /api/v1/payroll/employees. */
export interface CreatePayrollEmployeeBody {
  fullName: string;
  role: string;
  departmentId?: string;
  email?: string;
  phone?: string;
  state?: string;
  employmentType?: PayrollEmploymentType;
  taxStatus?: string;
  bankName?: string;
  accountNumber?: string;
  salary: CreatePayrollEmployeeSalary;
  enroll?: boolean;
}

/** Bank detail in the created employee personal details. */
export interface CreatedPayrollEmployeeBankInfo {
  bankName: string;
  maskedAccountNumber: string;
}

/** personalDetails in 201 response data. */
export interface CreatedPayrollEmployeePersonalDetails {
  employeeCode: string;
  email: string | null;
  phone: string | null;
  joinDate: string | null;
  taxState: string | null;
  taxStatus: string | null;
  bank: CreatedPayrollEmployeeBankInfo | null;
  tin: string | null;
  pensionPin: string | null;
  pfa: string | null;
  nhfNumber: string | null;
}

/** paySummary in 201 response data. */
export interface CreatedPayrollEmployeePaySummary {
  basicSalary: number;
  housingAllowance: number;
  transportAllowance: number;
  otherAllowance: number;
  additionalAllowances: CreatePayrollEmployeeSalaryAdditionalAllowance[];
  gross: number;
  paye: number;
  employeePension: number;
  employerPension: number;
  nhf: number;
  nsitf: number;
  customDeductions: number;
  loanDeductions: number;
  netPay: number;
  employerCost: number;
  statutoryRuleVersion: string;
  availability: string;
  employerContributions: {
    employerPension: number;
    nsitf: number;
  };
}

/** salaryStructure in 201 response data. */
export interface CreatedPayrollEmployeeSalaryStructure {
  id: string;
  organizationId: string;
  employeeId: string;
  title: string;
  basic: string;
  housing: string;
  transport: string;
  otherAllowance: string;
  additionalAllowances: CreatePayrollEmployeeSalaryAdditionalAllowance[];
  prorationResumeDate: string | null;
  prorationMethod: string | null;
  effectiveFrom: string;
  effectiveTo: string | null;
  createdAt: string;
  updatedAt: string;
}

/** statutoryProfile in 201 response data. */
export interface CreatedPayrollEmployeeStatutoryProfile {
  id: string;
  organizationId: string;
  employeeId: string;
  taxState: string | null;
  taxStatus: string | null;
  tin: string | null;
  pensionPin: string | null;
  pfaName: string | null;
  nhfNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Full `data` payload of the 201 response. */
export interface CreatedPayrollEmployeeData {
  employee: PayrollEmployeeItem;
  personalDetails: CreatedPayrollEmployeePersonalDetails;
  paySummary: CreatedPayrollEmployeePaySummary;
  salaryStructure: CreatedPayrollEmployeeSalaryStructure;
  statutoryProfile: CreatedPayrollEmployeeStatutoryProfile;
  deductions: unknown[];
  loans: unknown[];
  bik: null | unknown;
}

export interface CreatePayrollEmployeeResponse {
  success: boolean;
  message: string;
  data: CreatedPayrollEmployeeData;
}

// ─── GET /api/v1/payroll/employees/export ─────────────────────────

export interface ExportPayrollEmployeesParams {
  search?: string;
  departmentId?: string;
  status?: PayrollEmployeeStatus;
  employmentType?: PayrollEmploymentType;
  payrollStatus?: PayrollEmployeePayrollStatus;
}

// ─── POST /api/v1/payroll/employees/bulk-upload ────────────────────

export interface BulkUploadEmployeesResultItem {
  row?: number;
  fullName?: string;
  email?: string;
  success?: boolean;
  error?: string;
  employeeId?: string;
}

export interface BulkUploadEmployeesData {
  totalRows?: number;
  importedCount?: number;
  failedCount?: number;
  errors?: Array<BulkUploadEmployeesResultItem | string>;
  results?: BulkUploadEmployeesResultItem[];
  [key: string]: unknown;
}

export interface BulkUploadEmployeesResponse {
  success: boolean;
  message: string;
  data: BulkUploadEmployeesData;
}

// ─── GET /api/v1/payroll/employees/{employeeId} ────────────────────

export interface PayrollEmployeeDeductionItem {
  id: string;
  name: string;
  amount: number;
  frequency: "MONTHLY" | "ONE_OFF" | string;
  active: boolean;
}

export interface PayrollEmployeeLoanItem {
  id: string;
  purpose: string;
  type: "RECURRING" | "ONE_OFF" | string;
  principal: number;
  monthlyRepayment: number;
  outstanding: number;
  repaid: number;
  status: "ACTIVE" | "COMPLETED" | string;
  startDate?: string;
  [key: string]: unknown;
}

export interface PayrollEmployeeBik {
  hmoHealthInsurance: number;
  airtimeAllowance: number;
  mealAllowance: number;
  thirteenthMonthAnnual: number;
  totalMonthlyBik: number;
  annualValue: number;
  [key: string]: unknown;
}

// ─── GET /api/v1/payroll/employees/{employeeId}/bik ───────────────

// 200 — Monthly BIK and separate annual value (additionalProperties: true)
export interface GetEmployeeBikResponse {
  success?: boolean;
  message?: string;
  data?: PayrollEmployeeBik | Record<string, unknown>;
  errorCode?: string | null;
}

// ─── PUT /api/v1/payroll/employees/{employeeId}/bik ───────────────

// BIK fields from Swagger schema — BIK remains outside cash gross/net preview
export interface UpdateEmployeeBikBody {
  hmoHealthInsurance: number;
  airtimeAllowance: number;
  mealAllowance: number;
  thirteenthMonthAnnual: number;
  totalMonthlyBik?: number;
  annualValue?: number;
  [key: string]: unknown;
}

// 200 — Updated BIK (additionalProperties: true)
export interface UpdateEmployeeBikResponse {
  success?: boolean;
  message?: string;
  data?: PayrollEmployeeBik | Record<string, unknown>;
  errorCode?: string | null;
  validationErrors?: unknown;
  [key: string]: unknown;
}

export interface PayrollEmployeeOverviewPersonalDetails {
  employeeCode?: string;
  email?: string | null;
  phone?: string | null;
  joinDate?: string | null;
  taxState?: string | null;
  taxStatus?: string | null;
  bank?: CreatedPayrollEmployeeBankInfo | null;
  tin?: string | null;
  pensionPin?: string | null;
  pfa?: string | null;
  pfaName?: string | null;
  nhfNumber?: string | null;
  [key: string]: unknown;
}

export interface PayrollEmployeeOverviewStatutoryProfile {
  taxState?: string | null;
  taxStatus?: string | null;
  tin?: string | null;
  pensionPin?: string | null;
  nhfNumber?: string | null;
  pfaName?: string | null;
  [key: string]: unknown;
}

export interface PayrollEmployeeOverviewPaySummary {
  basicSalary: number;
  housingAllowance: number;
  transportAllowance: number;
  otherAllowance: number;
  gross: number;
  paye: number;
  employeePension: number;
  employerPension: number;
  nhf: number;
  nsitf: number;
  customDeductions: number;
  loanDeductions: number;
  netPay: number;
  employerCost: number;
  availability?: string;
  [key: string]: unknown;
}

export interface PayrollEmployeeOverviewData {
  employee: PayrollEmployeeItem;
  personalDetails: PayrollEmployeeOverviewPersonalDetails;
  paySummary: PayrollEmployeeOverviewPaySummary;
  salaryStructure: Record<string, unknown>;
  statutoryProfile: PayrollEmployeeOverviewStatutoryProfile;
  deductions: PayrollEmployeeDeductionItem[];
  loans: PayrollEmployeeLoanItem[];
  bik: PayrollEmployeeBik | null;
}

export interface GetPayrollEmployeeOverviewResponse {
  success?: boolean;
  message?: string;
  data: PayrollEmployeeOverviewData;
}

// POST /api/v1/payroll/employees/{employeeId}/enroll
// Idempotent — 200 on success, 409 if salary/bank config missing
export interface EnrollPayrollEmployeeResponse {
  success?: boolean;
  message?: string;
  data?: Record<string, unknown>;
  errorCode?: string | null;
  missingFields?: string[];
}

// DELETE /api/v1/payroll/employees/{employeeId}/enrollment
// 200 on success, 409 if employee is in an active pay run
export interface RemovePayrollEmployeeEnrollmentResponse {
  success?: boolean;
  message?: string;
  data?: Record<string, unknown>;
  errorCode?: string | null;
}

// PUT /api/v1/payroll/employees/{employeeId}/salary-structure
// Confirmed against Swagger: PayrollSalaryStructure schema

export type ProrationMethod = "WORKING_DAYS" | "CALENDAR_DAYS";

export interface AdditionalAllowanceItem {
  name: string;
  amount: number;
  taxable: boolean;
}

export interface SalaryStructureProration {
  resumeDate?: string | null; // format: date, nullable
  method?: ProrationMethod | null; // nullable
}

export interface UpdateSalaryStructureBody {
  basicSalary: number; // required, minimum 0
  housingAllowance?: number;
  transportAllowance?: number;
  otherAllowance?: number;
  additionalAllowances?: AdditionalAllowanceItem[];
  effectiveFrom?: string; // format: date (YYYY-MM-DD)
  proration?: SalaryStructureProration;
}

// 200 — Salary structure and preview (additionalProperties: true)
export interface UpdateSalaryStructureResponse {
  success?: boolean;
  message?: string;
  data?: Record<string, unknown>;
  errorCode?: string | null;
}

// ─── PUT /api/v1/payroll/employees/{employeeId}/statutory-profile ──

export type PayrollTaxStatus = "PAYE" | "EXEMPT" | "CONTRACTOR";

export interface UpdateStatutoryProfileBody {
  taxState?: string | null;
  taxStatus?: PayrollTaxStatus;
  tin?: string | null;
  pensionPin?: string | null;
  nhfNumber?: string | null;
  pfaName?: string | null;
}

// 200 — Masked statutory profile (additionalProperties: true)
export interface UpdateStatutoryProfileResponse {
  success?: boolean;
  message?: string;
  data?: Record<string, unknown>;
  errorCode?: string | null;
}

// ─── POST /api/v1/payroll/employees/{employeeId}/deductions ───────

export interface AddEmployeeDeductionBody {
  name?: string;
  amount: number;
  deductionTypeId?: string;
  frequency?: "MONTHLY" | "ONE_OFF";
}

export interface AddEmployeeDeductionData {
  id: string;
  deductionTypeId?: string;
  organizationId?: string;
  employeeId: string;
  name: string;
  amount: number | string;
  frequency: "MONTHLY" | "ONE_OFF" | string;
  active: boolean;
  effectiveFrom?: string;
  effectiveTo?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// 201 — Deduction created (additionalProperties: true)
export interface AddEmployeeDeductionResponse {
  success?: boolean;
  message?: string;
  data?: AddEmployeeDeductionData | Record<string, unknown>;
  errorCode?: string | null;
}

// ─── DELETE /api/v1/payroll/employees/{employeeId}/deductions/{deductionId} ─

// 200 — Deduction deactivated (additionalProperties: true)
export interface DeleteEmployeeDeductionResponse {
  success?: boolean;
  message?: string;
  data?: { id?: string; active?: boolean } | Record<string, unknown>;
  errorCode?: string | null;
}

// ─── POST /api/v1/payroll/employees/{employeeId}/loans ────────────

export type PayrollLoanType = "RECURRING" | "ONE_OFF";

export interface CreateEmployeeLoanBody {
  purpose: string;
  type: PayrollLoanType;
  principal: number;
  monthlyRepayment?: number | null;
  startDate: string;
}

export interface CreateEmployeeLoanData {
  id: string;
  purpose: string;
  type?: PayrollLoanType | string;
  loanType?: PayrollLoanType | string;
  principal: number | string;
  monthlyRepayment?: number | string | null;
  startDate?: string;
  status: "ACTIVE" | "COMPLETED" | string;
  outstanding?: number | string;
  repaid?: number | string;
  [key: string]: unknown;
}

// 201 — Loan created (additionalProperties: true)
export interface CreateEmployeeLoanResponse {
  success?: boolean;
  message?: string;
  data?: CreateEmployeeLoanData | Record<string, unknown>;
  errorCode?: string | null;
}

// ─── GET /api/v1/payroll/employees/{employeeId}/payroll-history ────
// Uses finalized/reportable Payslip snapshots, never the current salary config.
// Requires payroll:payslips:view permission (403 if missing).

/** Single payslip snapshot row returned in the paginated history list. */
export interface EmployeePayrollHistoryItem {
  id: string;
  /** Human-readable period label e.g. "September 2026 Payroll" */
  periodLabel?: string;
  /** ISO period start date */
  from?: string;
  /** ISO period end date */
  to?: string;
  /** ISO pay date */
  payDate?: string;
  gross?: number | string;
  netPay?: number | string;
  paye?: number | string;
  pension?: number | string;
  status?: string;
  [key: string]: unknown;
}

export interface GetEmployeePayrollHistoryParams {
  page?: number;
  limit?: number;
}

/** 200 — Paginated history (additionalProperties: true) */
export interface GetEmployeePayrollHistoryResponse {
  success?: boolean;
  message?: string;
  data?: EmployeePayrollHistoryItem[] | Record<string, unknown>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  errorCode?: string | null;
}

// ─── GET /api/v1/payroll/employees/{employeeId}/payroll-history/export ────────
// Export immutable employee Payroll history as safe CSV.
// Returns text/csv as a Blob — no JSON envelope.
// Typed as void here; the actual return is Promise<Blob> in the service layer.
export type ExportEmployeePayrollHistoryResponse = Blob;

// ─── GET /api/v1/payroll/deductions/loans ────────────────────────────────────
// List tenant loans with summary. Supports employee/purpose search, lifecycle filtering, safe sorting and pagination.
// Requires payroll:loans:view permission.

export type PayrollLoanStatus =
  "ACTIVE" | "PAUSED" | "COMPLETED" | "CLOSED_EARLY" | "CANCELLED";

export interface TenantLoanSummary {
  activeLoans: number;
  monthlyLoanDeductions: number;
  totalOutstanding: number;
  [key: string]: unknown;
}

export interface TenantLoanEmployee {
  id: string;
  employeeId: string;
  fullName: string;
  [key: string]: unknown;
}

export type TenantLoanAction =
  "VIEW" | "ADJUST_REPAYMENT" | "PAUSE" | "RESUME" | "CLOSE_EARLY" | "EXPORT";

export interface TenantLoanScheduleItem {
  installment: number;
  month: string;
  date: string;
  openingBalance: number;
  repayment: number;
  closingBalance: number;
  installmentStatus?: string;
  isCurrent: boolean;
  [key: string]: unknown;
}

export interface TenantLoanItem {
  id: string;
  employee: TenantLoanEmployee;
  purpose: string;
  principalAmount: number;
  outstandingAmount: number;
  repaidAmount: number;
  monthlyRepayment: number;
  repaymentProgressPercent: number;
  startDate: string;
  projectedEndDate?: string;
  remainingInstallments?: number;
  status: PayrollLoanStatus;
  availableActions?: TenantLoanAction[];
  schedule?: TenantLoanScheduleItem[];
  repayments?: unknown[];
  [key: string]: unknown;
}

export interface GetTenantLoansData {
  summary: TenantLoanSummary;
  loans: TenantLoanItem[];
  [key: string]: unknown;
}

export interface GetTenantLoansParams {
  search?: string;
  status?: PayrollLoanStatus;
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

export interface GetTenantLoansResponse {
  success: boolean;
  message: string;
  data: GetTenantLoansData;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasPreviousPage?: boolean;
    hasNextPage?: boolean;
  };
  errorCode?: string | null;
  [key: string]: unknown;
}

export interface CreateTenantLoanBody {
  employeeId: string;
  purpose: string;
  principalAmount: number;
  monthlyRepayment: number;
  startDate: string;
}

export interface CreateTenantLoanResponse {
  success: boolean;
  message: string;
  data: TenantLoanItem;
  errorCode?: string | null;
  [key: string]: unknown;
}

// ─── GET /api/v1/payroll/deductions/loans/{loanId} ─────────────────────────────
// Balances, progress, schedule and posted repayments

export interface GetTenantLoanDetailResponse {
  success: boolean;
  message: string;
  data: TenantLoanItem;
  errorCode?: string | null;
  [key: string]: unknown;
}

// ─── POST /api/v1/payroll/deductions/loans/{loanId}/adjust-repayment ───────────
// Adjust future loan repayment. Historical repayments remain unchanged.

export interface AdjustLoanRepaymentBody {
  monthlyRepayment: number;
}

export interface AdjustLoanRepaymentResponse {
  success: boolean;
  message: string;
  data: TenantLoanItem;
  errorCode?: string | null;
  [key: string]: unknown;
}

// ─── POST /api/v1/payroll/deductions/loans/{loanId}/pause ───────────────────────
// Pause future loan deductions.

export interface PauseTenantLoanResponse {
  success: boolean;
  message: string;
  data: TenantLoanItem;
  errorCode?: string | null;
  [key: string]: unknown;
}

// ─── POST /api/v1/payroll/deductions/loans/{loanId}/resume ──────────────────────
// Resume future loan deductions.

export interface ResumeTenantLoanResponse {
  success: boolean;
  message: string;
  data: TenantLoanItem;
  errorCode?: string | null;
  [key: string]: unknown;
}

// ─── POST /api/v1/payroll/deductions/loans/{loanId}/close-early ─────────────────
// Close a loan from future payroll deductions.

export interface CloseEarlyLoanBody {
  reason?: string;
}

export interface CloseEarlyLoanResponse {
  success: boolean;
  message: string;
  data: TenantLoanItem;
  errorCode?: string | null;
  [key: string]: unknown;
}

// ─── GET /api/v1/payroll/deductions/custom ──────────────────────────────────────
// List tenant custom deductions.

export type TenantCustomDeductionType = "RECURRING" | "ONE_OFF";
export type TenantCustomDeductionStatus = "ACTIVE" | "INACTIVE";

export interface TenantCustomDeductionEmployee {
  id: string;
  employeeId: string;
  fullName: string;
  [key: string]: unknown;
}

export interface TenantCustomDeductionItem {
  id: string;
  employee: TenantCustomDeductionEmployee;
  name: string;
  amount: number;
  type: TenantCustomDeductionType | string;
  status: TenantCustomDeductionStatus | string;
  effectiveFrom: string;
  effectiveTo: string | null;
  availableActions?: string[];
  [key: string]: unknown;
}

export interface GetTenantCustomDeductionsParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface GetTenantCustomDeductionsResponse {
  success: boolean;
  message: string;
  data: TenantCustomDeductionItem[];
  pagination?: PaginationMeta;
  errorCode?: string | null;
  [key: string]: unknown;
}

// ─── POST /api/v1/payroll/deductions/custom ─────────────────────────────────────
// Create recurring custom deduction. Feeds future PayRun computations only.

export interface CreateTenantCustomDeductionBody {
  employeeId: string;
  deductionTypeId: string;
  amount: number;
  name?: string;
  type?: "RECURRING" | "ONE_OFF";
  frequency?: "MONTHLY" | "ONE_OFF";
  effectiveFrom?: string;
  [key: string]: unknown;
}

export interface CreateTenantCustomDeductionData {
  id: string;
  deductionTypeId: string;
  organizationId?: string;
  employeeId: string;
  name?: string;
  amount: number | string;
  frequency?: string;
  active?: boolean;
  effectiveFrom?: string;
  effectiveTo?: string | null;
  [key: string]: unknown;
}

export interface CreateTenantCustomDeductionResponse {
  success: boolean;
  message: string;
  data: CreateTenantCustomDeductionData;
  errorCode?: string | null;
  validationErrors?: unknown;
  [key: string]: unknown;
}

export interface PayrollDeductionTypeItem {
  id: string;
  name: string;
  category?: "STATUTORY" | "VOLUNTARY" | string;
  code?: string;
  systemDefined?: boolean;
  active?: boolean;
  removable?: boolean;
  editable?: boolean;
  [key: string]: unknown;
}

export interface GetPayrollDeductionTypesResponse {
  success: boolean;
  message: string;
  data: PayrollDeductionTypeItem[];
  errorCode?: string | null;
  validationErrors?: unknown;
  [key: string]: unknown;
}

// ─── POST /api/v1/payroll/settings/deduction-types ────────────────────────────
// Create a voluntary deduction type.
// Clients cannot create statutory types. Loan Repayment remains owned by Loans.
// 201: Created as VOLUNTARY  |  409: Duplicate

export interface CreatePayrollDeductionTypeBody {
  name: string;
  [key: string]: unknown;
}

export interface CreatePayrollDeductionTypeResponse {
  success: boolean;
  message: string;
  data: PayrollDeductionTypeItem;
  errorCode?: string | null;
  validationErrors?: unknown;
  [key: string]: unknown;
}

// ─── PATCH /api/v1/payroll/settings/deduction-types/{id} ─────────────────────
// Update a voluntary deduction type.
// 200: Updated  |  409: System type protected or duplicate

export interface UpdatePayrollDeductionTypeBody {
  name?: string;
  [key: string]: unknown;
}

export interface UpdatePayrollDeductionTypeResponse {
  success: boolean;
  message: string;
  data: PayrollDeductionTypeItem;
  errorCode?: string | null;
  validationErrors?: unknown;
  [key: string]: unknown;
}

// ─── DELETE /api/v1/payroll/settings/deduction-types/{id} ────────────────────
// Deactivate a voluntary deduction type.
// 200: Deactivated  |  409: System type protected

export interface DeletePayrollDeductionTypeResponse {
  success: boolean;
  message: string;
  data: PayrollDeductionTypeItem;
  errorCode?: string | null;
  validationErrors?: unknown;
  [key: string]: unknown;
}

// ─── GET /api/v1/payroll/settings/statutory-rates ───────────────────────────
// Get structured statutory configuration.
// Read-only for tenant users. Exposes SystemConfig PAYE/CRA, pension, NHF, and NSITF.
// 200: Nigerian statutory configuration  |  403: Permission required

export interface PayrollStatutoryPayeBand {
  threshold: number | null;
  rate: string | number;
  [key: string]: unknown;
}

export interface PayrollStatutoryPayeConfig {
  bands?: PayrollStatutoryPayeBand[];
  annualDeductions?: string[];
  remittanceDueDay?: number;
  craRelief?: string;
  [key: string]: unknown;
}

export interface PayrollStatutoryPensionConfig {
  employeeRate: string | number;
  employerRate: string | number;
  basis: string[] | string;
  remittanceDeadline?: string;
  [key: string]: unknown;
}

export interface PayrollStatutoryNhfConfig {
  employeeRate: string | number;
  basis: string;
  remittance?: string;
  [key: string]: unknown;
}

export interface PayrollStatutoryNsitfConfig {
  employerRate: string | number;
  basis: string;
  frequency?: string;
  [key: string]: unknown;
}

export interface PayrollStatutoryRatesData {
  version?: string;
  jurisdiction?: string;
  effectiveFrom?: string;
  paye?: PayrollStatutoryPayeConfig;
  pension?: PayrollStatutoryPensionConfig;
  nhf?: PayrollStatutoryNhfConfig;
  nsitf?: PayrollStatutoryNsitfConfig;
  source?: string;
  readOnly?: boolean;
  rowVersion?: number;
  [key: string]: unknown;
}

export interface GetPayrollStatutoryRatesResponse {
  success: boolean;
  message: string;
  data: PayrollStatutoryRatesData;
  errorCode?: string | null;
  validationErrors?: unknown;
  [key: string]: unknown;
}





// ─── DELETE /api/v1/payroll/deductions/custom/{deductionId} ──────────────────
// Deactivate a custom deduction. Stops future payroll deductions while
// preserving historical Payslip snapshots.
// 200: Deduction deactivated ({})  |  404: Tenant deduction not found

export interface DeleteTenantCustomDeductionResponse {
  success?: boolean;
  message?: string;
  data?: Record<string, unknown> | null;
  errorCode?: string | null;
  [key: string]: unknown;
}

// ─── GET /api/v1/payroll/wallet ──────────────────────────────────────────────
// Get tenant Payroll Wallet overview.
// Returns ledger-backed balance, confirmed funding/disbursement totals,
// authoritative pending payroll/statutory obligations and shortfall.
// Requires payroll:statutory:view.

export interface PayrollWalletInfo {
  id: string;
  accountName: string;
  currency?: string;
  currentBalance: number;
  [key: string]: unknown;
}

export interface PayrollWalletSummary {
  totalFunded: number;
  totalDisbursed: number;
  pendingPayroll: number;
  pendingObligations: number;
  [key: string]: unknown;
}

export interface PayrollWalletBalanceHealth {
  hasSufficientBalance: boolean;
  currentBalance: number;
  requiredForPendingPayroll: number;
  shortfall: number;
  [key: string]: unknown;
}

export interface PayrollWalletData {
  wallet: PayrollWalletInfo;
  summary: PayrollWalletSummary;
  balanceHealth: PayrollWalletBalanceHealth;
  [key: string]: unknown;
}

export interface GetPayrollWalletResponse {
  success: boolean;
  message: string;
  data: PayrollWalletData;
  errorCode?: string | null;
  [key: string]: unknown;
}

// ─── POST /api/v1/payroll/wallet/fund ────────────────────────────────────────
// Record authorized manual wallet funding.
// Creates one idempotent CREDIT ledger entry using a unique transfer reference.
// Requires payroll:statutory:update.

export interface FundPayrollWalletBody {
  amount: number;
  transferReference: string;
}

export interface FundPayrollWalletResponse {
  success?: boolean;
  message?: string;
  data?: Record<string, unknown> | null;
  errorCode?: string | null;
  [key: string]: unknown;
}

// ─── GET /api/v1/payroll/wallet/transactions ─────────────────────────────────
// List immutable wallet transactions
// Query params: type, direction, search, page, limit
// 200: Paginated transactions

export type PayrollWalletTransactionType =
  | "FUNDING"
  | "PAYROLL_DISBURSEMENT"
  | "PAYE_REMITTANCE"
  | "PENSION_REMITTANCE"
  | "NHF_REMITTANCE"
  | "PAYEE_PAYMENT"
  | "REVERSAL";

export type PayrollWalletTransactionDirection = "CREDIT" | "DEBIT";

export interface PayrollWalletTransaction {
  id: string;
  date: string;
  description: string;
  transactionType: PayrollWalletTransactionType;
  reference: string;
  transferReference?: string | null;
  direction: PayrollWalletTransactionDirection;
  amount: number;
  balanceBefore?: number;
  balanceAfter?: number;
  sourceType?: string | null;
  sourceId?: string | null;
  [key: string]: unknown;
}

export interface GetPayrollWalletTransactionsParams {
  type?: PayrollWalletTransactionType;
  direction?: PayrollWalletTransactionDirection;
  search?: string;
  page?: number;
  limit?: number;
}

export interface GetPayrollWalletTransactionsResponse {
  success: boolean;
  message: string;
  data: PayrollWalletTransaction[];
  pagination?: PaginationMeta;
  errorCode?: string | null;
  validationErrors?: unknown;
  [key: string]: unknown;
}

// ─── GET /api/v1/payroll/wallet/transactions/export ──────────────────────────
// Export filtered wallet ledger as CSV (text/csv).
export type ExportPayrollWalletTransactionsResponse = Blob;

// ─── GET /api/v1/payroll/wallet/transactions/{transactionId} ─────────────────
// View tenant wallet transaction
// 200: Transaction detail
// 404: Tenant-owned transaction not found

export interface GetPayrollWalletTransactionResponse {
  success: boolean;
  message: string;
  data: PayrollWalletTransaction;
  errorCode?: string | null;
  [key: string]: unknown;
}

// ─── GET /api/v1/payroll/wallet/obligations ──────────────────────────────────
// List payable payroll and statutory obligations
// 200: Authoritative pending obligations with canonical pagination metadata
// 400: Invalid page or limit

export type PayrollWalletObligationType =
  | "PAYROLL_DISBURSEMENT"
  | "PAYEE_PAYMENT"
  | "PAYE_REMITTANCE"
  | "PENSION_REMITTANCE"
  | "NHF_REMITTANCE";

export type PayrollWalletObligationStatus = "DUE" | "OVERDUE";

export type PayrollWalletObligationAction = "PAY_NOW";

export interface PayrollWalletObligation {
  id: string;
  obligationType: PayrollWalletObligationType;
  title: string;
  period: string;
  amount: number;
  dueDate?: string | null;
  status: PayrollWalletObligationStatus;
  sourceId: string;
  availableActions?: PayrollWalletObligationAction[];
  [key: string]: unknown;
}

export interface GetPayrollWalletObligationsParams {
  page?: number;
  limit?: number;
}

export interface GetPayrollWalletObligationsResponse {
  success: boolean;
  message: string;
  data: PayrollWalletObligation[];
  pagination?: PaginationMeta;
  errorCode?: string | null;
  validationErrors?: unknown;
  [key: string]: unknown;
}

// ─── POST /api/v1/payroll/wallet/obligations/{obligationId}/pay ──────────────
// Pay an authoritative wallet obligation
// Amount is resolved server-side. Debit, ledger entry and source transition are atomic and source-idempotent.
// 200: Paid or existing idempotent transaction
// 403: Write permission required
// 409: Not payable or insufficient funds

export interface PayPayrollWalletObligationResponse {
  success: boolean;
  message: string;
  data?: PayrollWalletTransaction | Record<string, unknown> | null;
  errorCode?: string | null;
  [key: string]: unknown;
}

// ─── GET /api/v1/payroll/tax/overview ─────────────────────────────────────────
// Get tenant PAYE overview for a tax year
// 200: State authority count, YTD deducted/remitted and next due date

export interface PayrollTaxOverviewData {
  stateAuthorityCount?: number;
  stateAuthoritiesCount?: number;
  totalStateAuthorities?: number;
  ytdPayeDeducted?: number | string;
  ytdDeducted?: number | string;
  totalYtdDeducted?: number | string;
  ytdRemitted?: number | string;
  ytdPayeRemitted?: number | string;
  totalYtdRemitted?: number | string;
  nextDueDate?: string | null;
  dueDate?: string | null;
  nextRemittanceDueDate?: string | null;
  taxYear?: number | string;
  year?: number | string;
  currency?: string;
  [key: string]: unknown;
}

export interface GetPayrollTaxOverviewParams {
  year?: number | string;
  taxYear?: number | string;
  [key: string]: unknown;
}

export interface GetPayrollTaxOverviewResponse {
  success: boolean;
  message: string;
  data: PayrollTaxOverviewData;
  errorCode?: string | null;
  validationErrors?: unknown;
  [key: string]: unknown;
}

// ─── GET /api/v1/payroll/tax/employees-by-state ──────────────────────────────
// List finalized employee PAYE grouped by snapshotted state
// 200: Groups and paginated employee tax rows

export interface EmployeeTaxRow {
  id?: string | number;
  employeeId?: string;
  employeeName?: string;
  name?: string;
  email?: string;
  department?: string;
  state?: string;
  grossPay?: number;
  taxableIncome?: number;
  payeAmount?: number | string;
  amount?: number | string;
  status?: string;
  period?: string;
  [key: string]: unknown;
}

export interface StateTaxGroup {
  id?: string | number;
  state: string;
  stateName?: string;
  shortName?: string;
  authorityName?: string;
  name?: string;
  employeeCount?: number;
  employees?: number | EmployeeTaxRow[];
  totalPaye?: number | string;
  totalAmount?: number | string;
  amount?: string | number;
  color?: "blue" | "purple" | "green" | "yellow" | "red" | string;
  period?: string;
  [key: string]: unknown;
}

export interface PayrollTaxEmployeesByStateData {
  groups?: StateTaxGroup[];
  stateAuthorities?: StateTaxGroup[];
  items?: StateTaxGroup[] | EmployeeTaxRow[];
  data?: StateTaxGroup[] | EmployeeTaxRow[];
  employees?: EmployeeTaxRow[];
  pagination?: PaginationMeta;
  [key: string]: unknown;
}

export interface GetPayrollTaxEmployeesByStateParams {
  search?: string;
  state?: string;
  page?: number;
  limit?: number;
  period?: string;
  year?: number | string;
  [key: string]: unknown;
}

export interface GetPayrollTaxEmployeesByStateResponse {
  success: boolean;
  message: string;
  data: PayrollTaxEmployeesByStateData | StateTaxGroup[];
  pagination?: PaginationMeta;
  errorCode?: string | null;
  validationErrors?: unknown;
  [key: string]: unknown;
}

// ─── GET /api/v1/payroll/tax/remittances ─────────────────────────────────────
// List generated PAYE remittance obligations
// 200: Paginated remittances

export type PayrollTaxRemittanceStatus =
  | "Remitted"
  | "Pending"
  | "REMITTED"
  | "PENDING"
  | "OVERDUE"
  | "DUE"
  | string;

export interface PayrollTaxRemittanceItem {
  id?: string | number;
  remittanceId?: string;
  period: string;
  state: string;
  authority?: string;
  authorityName?: string;
  authorityCode?: string;
  code?: string;
  employees?: number;
  employeeCount?: number;
  amount: number | string;
  payeAmount?: number | string;
  dueDate?: string | null;
  status: PayrollTaxRemittanceStatus;
  receiptUrl?: string | null;
  reference?: string | null;
  [key: string]: unknown;
}

export interface PayrollTaxRemittancesData {
  remittances?: PayrollTaxRemittanceItem[];
  items?: PayrollTaxRemittanceItem[];
  data?: PayrollTaxRemittanceItem[];
  pagination?: PaginationMeta;
  [key: string]: unknown;
}

export interface GetPayrollTaxRemittancesParams {
  page?: number;
  limit?: number;
  status?: string;
  period?: string;
  year?: number | string;
  state?: string;
  search?: string;
  [key: string]: unknown;
}

export interface GetPayrollTaxRemittancesResponse {
  success: boolean;
  message: string;
  data: PayrollTaxRemittancesData | PayrollTaxRemittanceItem[];
  pagination?: PaginationMeta;
  errorCode?: string | null;
  validationErrors?: unknown;
  [key: string]: unknown;
}

export interface GetPayrollTaxRemittanceReceiptParams {
  remittanceId: string | number;
}

// ─── GET /api/v1/payroll/tax/annual-returns ──────────────────────────────────
// Get PAYE annual-return/YTD rows
// 200: Snapshot-backed annual rows

export interface AnnualReturnEmployeeRow {
  id?: string | number;
  employeeId?: string;
  name?: string;
  employeeName?: string;
  firstName?: string;
  lastName?: string;
  department?: string;
  state?: string;
  stateName?: string;
  irs?: string;
  authorityCode?: string;
  tin?: string;
  taxIdentificationNumber?: string;
  ytdGross?: number | string;
  grossPay?: number | string;
  totalGross?: number | string;
  ytdPaye?: number | string;
  payeAmount?: number | string;
  totalPaye?: number | string;
  effectiveRate?: number | string;
  rate?: number | string;
  taxYear?: number | string;
  period?: string;
  [key: string]: unknown;
}

export interface PayrollTaxAnnualReturnsData {
  rows?: AnnualReturnEmployeeRow[];
  employees?: AnnualReturnEmployeeRow[];
  items?: AnnualReturnEmployeeRow[];
  data?: AnnualReturnEmployeeRow[];
  totalYtdPaye?: number | string;
  ytdPaye?: number | string;
  totalYtdGross?: number | string;
  taxYear?: number | string;
  period?: string;
  pagination?: PaginationMeta;
  [key: string]: unknown;
}

export interface GetPayrollTaxAnnualReturnsParams {
  year?: number | string;
  taxYear?: number | string;
  state?: string;
  search?: string;
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

export interface GetPayrollTaxAnnualReturnsResponse {
  success: boolean;
  message: string;
  data: PayrollTaxAnnualReturnsData | AnnualReturnEmployeeRow[];
  errorCode?: string | null;
  validationErrors?: unknown;
  pagination?: PaginationMeta;
  [key: string]: unknown;
}

// ─── GET /api/v1/payroll/tax/annual-returns/export ───────────────────────────
// Export PAYE annual-return rows
// 200: CSV (text/csv)

export interface ExportPayrollTaxAnnualReturnsParams {
  year?: number | string;
  taxYear?: number | string;
  state?: string;
  [key: string]: unknown;
}

// ─── GET /api/v1/payroll/tax/config ──────────────────────────────────────────
// Get the PAYE configuration used by Payroll
// Returns tenant-configured bands/CRA/contribution metadata or an explicit NOT_CONFIGURED state; no Figma rates are hardcoded.

export interface PayeTaxBandConfig {
  id?: string | number;
  band?: string;
  name?: string;
  minAmount?: number;
  maxAmount?: number | null;
  rate: number | string;
  order?: number;
  description?: string;
  [key: string]: unknown;
}

export interface CraGuideConfig {
  id?: string | number;
  title: string;
  description: string;
  percentage?: number;
  fixedAmount?: number;
  cap?: number | null;
  [key: string]: unknown;
}

export interface ContributionMetadataConfig {
  name?: string;
  title?: string;
  description?: string;
  employeeRate?: number | string;
  employerRate?: number | string;
  rate?: number | string;
  basis?: string;
  [key: string]: unknown;
}

export interface PayrollTaxConfigData {
  status?: "CONFIGURED" | "NOT_CONFIGURED" | string;
  isConfigured?: boolean;
  taxYear?: number | string;
  year?: number | string;
  bands?: PayeTaxBandConfig[];
  payeBands?: PayeTaxBandConfig[];
  taxBands?: PayeTaxBandConfig[];
  craGuides?: CraGuideConfig[];
  cra?: CraGuideConfig[] | Record<string, unknown>;
  contributions?: ContributionMetadataConfig[] | Record<string, unknown>;
  metadata?: Record<string, unknown>;
  notes?: string;
  description?: string;
  [key: string]: unknown;
}

export interface GetPayrollTaxConfigResponse {
  success: boolean;
  message: string;
  data: PayrollTaxConfigData;
  errorCode?: string | null;
  validationErrors?: unknown;
  [key: string]: unknown;
}

// ─── GET /api/v1/payroll/reports/summary ──────────────────────────────────────
// Get Payroll Summary from finalized snapshots
// 200: Period summary and monthly trend (schema: {})

/** A single monthly entry in the trend array returned by the summary endpoint. */
export interface PayrollReportMonthlyTrend {
  period?: string;
  month?: string;
  label?: string;
  gross?: number | string;
  netPay?: number | string;
  net?: number | string;
  paye?: number | string;
  pension?: number | string;
  nhf?: number | string;
  loans?: number | string;
  employerCost?: number | string;
  employees?: number;
  [key: string]: unknown;
}

export interface PayrollReportSummaryNested {
  gross?: number | string;
  netPay?: number | string;
  employerCost?: number | string;
  employeeCount?: number;
  ytdCost?: number | string;
  [key: string]: unknown;
}

export interface PayrollReportSummaryData {
  // Period / Year
  period?: string | null;
  year?: number;
  currentPeriod?: string;
  // Live nested backend summary structure
  summary?: PayrollReportSummaryNested;
  // Monthly trend / breakdown
  monthlyTrend?: PayrollReportMonthlyTrend[];
  monthlyBreakdown?: PayrollReportMonthlyTrend[];
  trend?: PayrollReportMonthlyTrend[];
  monthly?: PayrollReportMonthlyTrend[];
  months?: PayrollReportMonthlyTrend[];
  rows?: PayrollReportMonthlyTrend[];
  // Flat legacy/fallback fields
  gross?: number | string;
  totalGross?: number | string;
  netPay?: number | string;
  totalNetPay?: number | string;
  net?: number | string;
  paye?: number | string;
  totalPaye?: number | string;
  pension?: number | string;
  nhf?: number | string;
  loans?: number | string;
  employerCost?: number | string;
  employees?: number;
  employeeCount?: number;
  [key: string]: unknown;
}

export interface GetPayrollReportSummaryResponse {
  success: boolean;
  message: string;
  data: PayrollReportSummaryData;
  errorCode?: string | null;
  validationErrors?: unknown;
  [key: string]: unknown;
}

// ─── GET /api/v1/payroll/reports/department-cost ──────────────────────────────
// Get historical cost by snapshotted department
// 200: Department costs and percentages (schema: {})

/** One department entry from the department-cost endpoint. */
export interface PayrollDeptCostRow {
  department?: string;
  departmentId?: string | null;
  departmentName?: string;
  dept?: string;
  name?: string;
  employees?: number;
  employeeCount?: number;
  headcount?: number;
  gross?: number | string;
  grossAmount?: number | string;
  grossSalary?: number | string;
  totalGross?: number | string;
  netPay?: number | string;
  net?: number | string;
  totalNet?: number | string;
  percentage?: number | string;
  share?: number | string;
  percentageOfTotal?: number | string;
  [key: string]: unknown;
}

export interface PayrollDeptCostData {
  period?: string | null;
  year?: number;
  currentPeriod?: string;
  departments?: PayrollDeptCostRow[];
  rows?: PayrollDeptCostRow[];
  items?: PayrollDeptCostRow[];
  data?: PayrollDeptCostRow[];
  totalGross?: number | string;
  totalNetPay?: number | string;
  totalEmployees?: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  [key: string]: unknown;
}

export interface GetPayrollDeptCostParams {
  period?: string;
  [key: string]: unknown;
}

export type PayrollDeptCostResponseData =
  | PayrollDeptCostData
  | PayrollDeptCostRow[];

export interface GetPayrollDeptCostResponse {
  success: boolean;
  message: string;
  data: PayrollDeptCostResponseData;
  errorCode?: string | null;
  validationErrors?: unknown;
  [key: string]: unknown;
}

// ─── GET /api/v1/payroll/reports/monthly-variance ─────────────────────────────
// Compare employee net pay between two periods
// 200: Increase, decrease, no-change, new and removed rows (schema: {})

/** One employee row returned by the monthly-variance endpoint. */
export interface PayrollVarianceRow {
  // Employee identity
  employeeId?: string | number;
  id?: string | number;
  name?: string;
  employeeName?: string;
  employee?: string;
  role?: string;
  jobTitle?: string;
  position?: string;
  department?: string;
  dept?: string;
  // Net pay figures
  previousNet?: number | string;
  previousNetPay?: number | string;
  previousPay?: number | string;
  currentNet?: number | string;
  currentNetPay?: number | string;
  currentPay?: number | string;
  // Pre-computed variance fields (backend may supply these)
  variance?: number | string;
  varianceAmount?: number | string;
  difference?: number | string;
  percentage?: number | string;
  percentageChange?: number | string;
  changePercent?: number | string;
  // Change category
  changeType?: string;
  status?: string;
  [key: string]: unknown;
}

export interface PayrollVarianceData {
  rows?: PayrollVarianceRow[];
  employees?: PayrollVarianceRow[];
  items?: PayrollVarianceRow[];
  data?: PayrollVarianceRow[];
  // Swagger 200 description: "Increase, decrease, no-change, new and removed rows"
  increase?: PayrollVarianceRow[];
  increases?: PayrollVarianceRow[];
  decrease?: PayrollVarianceRow[];
  decreases?: PayrollVarianceRow[];
  noChange?: PayrollVarianceRow[];
  no_change?: PayrollVarianceRow[];
  new?: PayrollVarianceRow[];
  newRows?: PayrollVarianceRow[];
  removed?: PayrollVarianceRow[];
  removedRows?: PayrollVarianceRow[];
  // Period labels the backend may include
  currentPeriod?: string;
  previousPeriod?: string;
  period?: string;
  comparisonPeriod?: string;
  // Aggregate counts
  changedCount?: number;
  totalChanged?: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  [key: string]: unknown;
}

export type PayrollVarianceResponseData =
  | PayrollVarianceData
  | PayrollVarianceRow[];

export interface GetPayrollVarianceParams {
  previousPeriod?: string;
  currentPeriod?: string;
  [key: string]: unknown;
}

export interface GetPayrollVarianceResponse {
  success: boolean;
  message: string;
  data: PayrollVarianceResponseData;
  errorCode?: string | null;
  validationErrors?: unknown;
  [key: string]: unknown;
}

// ─── GET /api/v1/payroll/reports/bank-payment-schedule ────────────────────────
// Get snapshot-backed bank payment schedule
// 200: Payment rows with actual payment state (schema: {})

/** One payment row returned by the bank-payment-schedule endpoint. */
export interface PayrollBankPaymentRow {
  // Employee name
  employee?: string;
  employeeName?: string;
  name?: string;
  // Bank details
  bank?: string;
  bankName?: string;
  institution?: string;
  accountNumber?: string;
  accountNo?: string;
  account?: string;
  // Amount
  amount?: number | string;
  netPay?: number | string;
  net?: number | string;
  payment?: number | string;
  // Status — backend may use various casings / values
  status?: string;
  paymentStatus?: string;
  state?: string;
  [key: string]: unknown;
}

export interface GetPayrollBankPaymentScheduleParams {
  period?: string;
  [key: string]: unknown;
}

export interface PayrollBankPaymentData {
  rows?: PayrollBankPaymentRow[];
  payments?: PayrollBankPaymentRow[];
  employees?: PayrollBankPaymentRow[];
  items?: PayrollBankPaymentRow[];
  data?: PayrollBankPaymentRow[];
  period?: string | null;
  currentPeriod?: string;
  year?: number;
  month?: string;
  total?: number | string;
  totalAmount?: number | string;
  count?: number;
  pagination?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export type PayrollBankPaymentResponseData =
  | PayrollBankPaymentData
  | PayrollBankPaymentRow[];

export interface GetPayrollBankPaymentScheduleResponse {
  success: boolean;
  message: string;
  data: PayrollBankPaymentResponseData;
  errorCode?: string | null;
  validationErrors?: unknown;
  [key: string]: unknown;
}

// ─── GET /api/v1/payroll/reports/ytd-earnings ────────────────────────────────
// Get finalized YTD employee earnings
// YTD Pension means employee statutory pension plus applied AVC; employer pension is excluded.
// 200: Paginated YTD rows (schema: {})

/** One employee row returned by the ytd-earnings endpoint. */
export interface PayrollYtdEarningsRow {
  employeeId?: string | number;
  id?: string | number;
  name?: string;
  employeeName?: string;
  employee?: string;
  role?: string;
  jobTitle?: string;
  position?: string;
  department?: string;
  dept?: string;
  // Figures
  gross?: number | string;
  ytdGross?: number | string;
  totalGross?: number | string;
  paye?: number | string;
  ytdPaye?: number | string;
  totalPaye?: number | string;
  pension?: number | string;
  ytdPension?: number | string;
  totalPension?: number | string;
  net?: number | string;
  netPay?: number | string;
  ytdNet?: number | string;
  totalNet?: number | string;
  [key: string]: unknown;
}

export interface PayrollYtdEarningsData {
  rows?: PayrollYtdEarningsRow[];
  employees?: PayrollYtdEarningsRow[];
  items?: PayrollYtdEarningsRow[];
  data?: PayrollYtdEarningsRow[];
  year?: number;
  reportYear?: number | string;
  period?: string | null;
  currentPeriod?: string;
  monthsCount?: number;
  disbursedRunsCount?: number;
  totalGross?: number | string;
  totalPaye?: number | string;
  totalPension?: number | string;
  totalNet?: number | string;
  pagination?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    hasPreviousPage?: boolean;
    hasNextPage?: boolean;
  };
  [key: string]: unknown;
}

export type PayrollYtdEarningsResponseData =
  | PayrollYtdEarningsData
  | PayrollYtdEarningsRow[];

export interface GetPayrollYtdEarningsResponse {
  success: boolean;
  message: string;
  data: PayrollYtdEarningsResponseData;
  errorCode?: string | null;
  validationErrors?: unknown;
  pagination?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  [key: string]: unknown;
}

// ─── GET /api/v1/payroll/pension/overview ─────────────────────────────────────
// Get snapshot-backed Pension overview
// 200: Employee/employer pension, AVC and counts (schema: {})

export interface GetPayrollPensionOverviewParams {
  /** Period query parameter, e.g. "September 2026" */
  period?: string;
  [key: string]: unknown;
}

export interface PayrollPensionOverviewSummary {
  employeeContribution?: number | string;
  employerContribution?: number | string;
  totalMonthlyPension?: number | string;
  activeAvcAmount?: number | string;
  [key: string]: unknown;
}

export interface PayrollPensionOverviewCounts {
  employees?: number;
  pfas?: number;
  activeAvcs?: number;
  pendingRemittances?: number;
  activeTransfers?: number;
  [key: string]: unknown;
}

export interface PayrollPensionOverviewData {
  period?: string | null;
  summary?: PayrollPensionOverviewSummary;
  counts?: PayrollPensionOverviewCounts;
  // Fallback flat properties for backwards compatibility
  employeePension?: number | string;
  employeeContribution?: number | string;
  employeeContributions?: number | string;
  totalEmployeePension?: number | string;
  employee8Percent?: number | string;
  employerPension?: number | string;
  employerContribution?: number | string;
  employerContributions?: number | string;
  totalEmployerPension?: number | string;
  employer10Percent?: number | string;
  totalPension?: number | string;
  totalMonthlyPension?: number | string;
  total?: number | string;
  totalContributions?: number | string;
  activeAvcAmount?: number | string;
  avcAmount?: number | string;
  totalAvc?: number | string;
  avc?: number | string;
  voluntaryContributions?: number | string;
  employeeCount?: number;
  totalEmployees?: number;
  enrolledEmployees?: number;
  activeAvcCount?: number;
  avcCount?: number;
  [key: string]: unknown;
}

export interface GetPayrollPensionOverviewResponse {
  success: boolean;
  message: string;
  data: PayrollPensionOverviewData;
  errorCode?: string | null;
  validationErrors?: unknown;
  [key: string]: unknown;
}

// ─── GET /api/v1/payroll/pension/contributions ───────────────────────────────
// List historical employee Pension snapshots
// Uses finalized Payslip snapshots; current salary/PFA changes do not rewrite history.
// 200: Paginated contributions (schema: {})

export interface GetPayrollPensionContributionsParams {
  period?: string;
  search?: string;
  pfa?: string;
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

export interface PayrollPensionContributionItem {
  id: string | number;
  employeeId?: string;
  employeeName?: string;
  name?: string;
  employee?: string;
  initials?: string;
  department?: string;
  dept?: string;
  pfa?: string;
  pfaName?: string;
  pensionPin?: string;
  pin?: string;
  rsaPin?: string;
  employeeContribution?: number | string;
  employeePension?: number | string;
  employerContribution?: number | string;
  employerPension?: number | string;
  avc?: number | string | null;
  voluntaryContribution?: number | string | null;
  total?: number | string;
  totalContribution?: number | string;
  period?: string;
  month?: string;
  year?: number;
  [key: string]: unknown;
}

export interface GetPayrollPensionContributionsResponse {
  success: boolean;
  message: string;
  data: PayrollPensionContributionItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    [key: string]: unknown;
  };
  errorCode?: string | null;
  validationErrors?: unknown;
  [key: string]: unknown;
}

// ─── GET /api/v1/payroll/pension/pfas ─────────────────────────────────────────
// List PFAs represented by tenant pension profiles
// 200: Dynamic PFA lookup (schema: {})

export type PayrollPfaItem =
  | string
  | {
    id?: string;
    name?: string;
    pfa?: string;
    pfaName?: string;
    code?: string;
    count?: number;
    memberCount?: number;
    [key: string]: unknown;
  };

export interface GetPayrollPensionPfasResponse {
  success: boolean;
  message: string;
  data: PayrollPfaItem[];
  errorCode?: string | null;
  validationErrors?: unknown;
  [key: string]: unknown;
}

// ─── GET /api/v1/payroll/pension/remittances ─────────────────────────────────
// List immutable PFA-grouped remittance obligations
// 200: Paginated remittances (schema: {})

export type PayrollPensionRemittanceStatus =
  | "REMITTED"
  | "PENDING"
  | "Remitted"
  | "Pending"
  | string;

export interface PayrollPensionRemittanceItem {
  id: string | number;
  pfa?: string;
  pfaName?: string;
  members?: number;
  memberCount?: number;
  employeeCount?: number;
  employeeContribution?: number | string;
  employeePension?: number | string;
  employerContribution?: number | string;
  employerPension?: number | string;
  total?: number | string;
  totalContribution?: number | string;
  totalAmount?: number | string;
  dueDate?: string;
  remittedAt?: string | null;
  status?: PayrollPensionRemittanceStatus;
  period?: string;
  receiptReference?: string | null;
  paymentReference?: string | null;
  [key: string]: unknown;
}

export interface GetPayrollPensionRemittancesParams {
  period?: string;
  status?: string;
  pfa?: string;
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

export interface GetPayrollPensionRemittancesResponse {
  success: boolean;
  message: string;
  data: PayrollPensionRemittanceItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    [key: string]: unknown;
  };
  errorCode?: string | null;
  validationErrors?: unknown;
  [key: string]: unknown;
}

// ─── GET /api/v1/payroll/pension/remittances/{id} ─────────────────────────────
// Get a tenant Pension remittance
// 200: Remittance detail (schema: {})
// 404: Not found

export interface GetPayrollPensionRemittanceResponse {
  success: boolean;
  message: string;
  data: PayrollPensionRemittanceItem;
  errorCode?: string | null;
  validationErrors?: unknown;
  [key: string]: unknown;
}

// ─── POST /api/v1/payroll/pension/remittances/{id}/remit ──────────────────────
// Pay Pension remittance from Payroll Wallet / Record external pension remittance
// 200: Wallet transaction / External remittance evidence recorded and audited
// 409: Already paid or insufficient funds / Already remitted

export interface RemitPayrollPensionPayload {
  paymentReference?: string;
  remittedAt?: string; // YYYY-MM-DD
  receiptReference?: string;
}

export interface RemitPayrollPensionResponse {
  success: boolean;
  message: string;
  data: Record<string, unknown> | null;
  errorCode?: string | null;
  validationErrors?: unknown;
  [key: string]: unknown;
}

// ─── POST /api/v1/payroll/pension/remittances/{id}/mark-remitted ──────────────
// Record externally-paid Pension remittance
// 200: Remittance marked and audited
// 409: Already remitted

export interface MarkPayrollPensionRemittedBody {
  paymentReference: string;
  remittedAt: string; // YYYY-MM-DD
  receiptReference?: string;
}

export interface MarkPayrollPensionRemittedResponse {
  success: boolean;
  message: string;
  data: Record<string, unknown> | null;
  errorCode?: string | null;
  validationErrors?: unknown;
  [key: string]: unknown;
}

// ─── GET /api/v1/payroll/pension/avc ─────────────────────────────────────────
// List tenant AVC records
// 200: Paginated AVC records

export interface PayrollAvcEmployee {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  [key: string]: unknown;
}

export type PayrollAvcStatus = "ACTIVE" | "PAUSED" | "INACTIVE" | "CANCELLED" | string;

export interface PayrollAvcItem {
  id: string;
  organizationId?: string;
  employeeId: string;
  monthlyAmount: number;
  startDate: string;
  endDate?: string | null;
  status: PayrollAvcStatus;
  createdAt?: string;
  updatedAt?: string;
  employee?: PayrollAvcEmployee | null;
  [key: string]: unknown;
}

export interface GetPayrollAvcParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  employeeId?: string;
  [key: string]: unknown;
}

export interface GetPayrollAvcResponse {
  success: boolean;
  message: string;
  data: PayrollAvcItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  errorCode?: string | null;
  validationErrors?: unknown;
  [key: string]: unknown;
}

// ─── POST /api/v1/payroll/pension/avc ─────────────────────────────────────────
// Create an effective-dated AVC
// 201: AVC created
// 409: Overlapping AVC

export interface CreatePayrollAvcBody {
  employeeId: string;
  monthlyAmount: number;
  startDate: string; // YYYY-MM-DD
}

export interface CreatePayrollAvcResponse {
  success: boolean;
  message: string;
  data: PayrollAvcItem;
  errorCode?: string | null;
  validationErrors?: unknown;
  [key: string]: unknown;
}

// ─── POST /api/v1/payroll/pension/avc/{id}/pause ──────────────────────────────
// Pause future AVC application
// 200: AVC paused
// 409: Invalid transition

export interface PausePayrollAvcResponse {
  success: boolean;
  message: string;
  data: PayrollAvcItem;
  errorCode?: string | null;
  validationErrors?: unknown;
  [key: string]: unknown;
}

// ─── POST /api/v1/payroll/pension/avc/{id}/resume ─────────────────────────────
// Resume future AVC application
// 200: AVC resumed
// 409: Invalid transition

export interface ResumePayrollAvcResponse {
  success: boolean;
  message: string;
  data: PayrollAvcItem | Record<string, unknown>;
  errorCode?: string | null;
  validationErrors?: unknown;
  [key: string]: unknown;
}

// ─── GET /api/v1/payroll/pension/pfa-transfers ─────────────────────────────────
// List PFA transfer history
// 200: Paginated transfers

export interface PayrollPfaTransferEmployee {
  id?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  employeeCode?: string;
  [key: string]: unknown;
}

export interface PayrollPfaTransferItem {
  id: string | number;
  organizationId?: string;
  employeeId?: string;
  employeeName?: string;
  employee?: PayrollPfaTransferEmployee | null;
  fromPfa?: string;
  fromPfaName?: string;
  toPfa?: string;
  toPfaName?: string;
  initiatedDate?: string;
  initiatedAt?: string;
  createdAt?: string;
  status?: string;
  currentStep?: number;
  step?: number;
  reason?: string | null;
  notes?: string | null;
  [key: string]: unknown;
}

export interface GetPayrollPfaTransfersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  [key: string]: unknown;
}

export interface GetPayrollPfaTransfersResponse {
  success: boolean;
  message: string;
  data: PayrollPfaTransferItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasPreviousPage?: boolean;
    hasNextPage?: boolean;
    [key: string]: unknown;
  };
  errorCode?: string | null;
  validationErrors?: unknown;
  [key: string]: unknown;
}

// ─── GET /api/v1/payroll/pension/pfa-transfers/{id} ─────────────────────────────
// Get PFA transfer detail
// 200: Transfer detail
// 404: Not found

export interface GetPayrollPfaTransferDetailResponse {
  success: boolean;
  message: string;
  data: PayrollPfaTransferItem;
  errorCode?: string | null;
  validationErrors?: unknown;
  [key: string]: unknown;
}

// ─── POST /api/v1/payroll/pension/pfa-transfers ────────────────────────────────
// Initiate PFA transfer without changing current PFA
// 201: Transfer initiated
// 409: Mismatch or unresolved transfer

export interface InitiatePayrollPfaTransferBody {
  employeeId: string;
  currentPfa: string;
  newPfa: string;
  externalReference?: string;
  [key: string]: unknown;
}

export interface InitiatePayrollPfaTransferResponse {
  success?: boolean;
  message?: string;
  data?: PayrollPfaTransferItem | Record<string, unknown> | null;
  errorCode?: string | null;
  validationErrors?: unknown;
  [key: string]: unknown;
}

// ─── POST /api/v1/payroll/pension/pfa-transfers/{id}/advance ───────────────────
// Advance the validated PFA transfer lifecycle
// 200: Transfer advanced
// 409: Invalid transition

export type PayrollPfaTransferNextStatus =
  | "PENCOM_REVIEW"
  | "OLD_PFA_PROCESSING"
  | "NEW_PFA_CONFIRMATION"
  | "COMPLETED";

export interface AdvancePayrollPfaTransferBody {
  nextStatus: PayrollPfaTransferNextStatus | string;
  externalReference?: string;
  [key: string]: unknown;
}

export interface AdvancePayrollPfaTransferResponse {
  success?: boolean;
  message?: string;
  data?: PayrollPfaTransferItem | Record<string, unknown> | null;
  errorCode?: string | null;
  validationErrors?: unknown;
  [key: string]: unknown;
}

// ─── POST /api/v1/payroll/settings/allowance-types ───────────────────────────
// Create a tenant allowance type.
// Requires payroll:salary:update.

export type PayrollAllowanceTaxTreatment = "TAXABLE" | "TAX_EXEMPT";

export interface CreatePayrollAllowanceTypeBody {
  name: string;
  taxTreatment: PayrollAllowanceTaxTreatment;
}

export interface PayrollAllowanceTypeItem {
  id: string;
  code?: string;
  name: string;
  taxTreatment: PayrollAllowanceTaxTreatment;
  systemDefined?: boolean;
  active?: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  removable?: boolean;
  editable?: boolean;
  [key: string]: unknown;
}

export interface CreatePayrollAllowanceTypeResponse {
  success: boolean;
  message: string;
  data: PayrollAllowanceTypeItem;
  errorCode?: string | null;
  validationErrors?: unknown;
  [key: string]: unknown;
}

// ─── GET /api/v1/payroll/settings/allowance-types ────────────────────────────
// List allowance types.
// System salary components are protected.

export interface GetPayrollAllowanceTypesResponse {
  success: boolean;
  message: string;
  data: PayrollAllowanceTypeItem[];
  errorCode?: string | null;
  validationErrors?: unknown;
  [key: string]: unknown;
}

// ─── PATCH /api/v1/payroll/settings/allowance-types/{id} ─────────────────────
// Update a custom allowance type.
// 200: Updated, 404: Not found, 409: Protected or duplicate.

export interface UpdatePayrollAllowanceTypeBody {
  name?: string;
  taxTreatment?: PayrollAllowanceTaxTreatment;
  [key: string]: unknown;
}

export interface UpdatePayrollAllowanceTypeResponse {
  success: boolean;
  message: string;
  data: PayrollAllowanceTypeItem;
  errorCode?: string | null;
  validationErrors?: unknown;
  [key: string]: unknown;
}

// ─── DELETE /api/v1/payroll/settings/allowance-types/{id} ────────────────────
// Deactivate a custom allowance type.
// System types cannot be removed; custom definitions remain for history.
// 200: Deactivated, 409: System type protected

export interface DeletePayrollAllowanceTypeResponse {
  success: boolean;
  message: string;
  data: PayrollAllowanceTypeItem;
  errorCode?: string | null;
  validationErrors?: unknown;
  [key: string]: unknown;
}



// ─── GET /api/v1/payroll/settings ────────────────────────────────────────────
// Get consolidated tenant Payroll settings.
// Returns pay period, allowance types, deduction types, and statutory rates.
// Requires payroll:statutory:view.
// 200: Payroll settings ({}), 401: Authentication required, 403: Permission required

export interface PayrollSettingsPayPeriod {
  frequency?: string;        // e.g. "MONTHLY", "WEEKLY"
  payDay?: number | string;  // day-of-month or label
  startDate?: string;
  endDate?: string;
  [key: string]: unknown;
}

export interface GetPayrollSettingsResponse {
  success: boolean;
  message: string;
  data: {
    payPeriod?: PayrollSettingsPayPeriod;
    allowanceTypes?: PayrollAllowanceTypeItem[];
    deductionTypes?: PayrollDeductionTypeItem[];
    statutoryRates?: Record<string, unknown>;
    [key: string]: unknown;
  } | null;
  errorCode?: string | null;
  validationErrors?: unknown;
  [key: string]: unknown;
}

// ─── GET & PUT /api/v1/payroll/settings/pay-period ──────────────────────────

export interface PayrollSettingsPayPeriodData {
  payFrequency: "MONTHLY" | string;
  defaultPayDay: number;
  version?: number;
  updatedAt?: string | null;
  [key: string]: unknown;
}

export interface GetPayrollSettingsPayPeriodResponse {
  success: boolean;
  message: string;
  data: PayrollSettingsPayPeriodData;
  errorCode?: string | null;
  validationErrors?: unknown;
  [key: string]: unknown;
}

export interface UpdatePayrollSettingsPayPeriodBody {
  payFrequency: "MONTHLY";
  defaultPayDay: number;
}

export interface UpdatePayrollSettingsPayPeriodResponse {
  success: boolean;
  message: string;
  data?: PayrollSettingsPayPeriodData | Record<string, unknown> | null;
  errorCode?: string | null;
  validationErrors?: unknown;
  [key: string]: unknown;
}
