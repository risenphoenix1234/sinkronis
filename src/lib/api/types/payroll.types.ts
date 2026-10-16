// src/lib/api/types/payroll.types.ts
export type PayrollPayeeType = "PERMANENT" | "CONTRACT" | "CONSULTANT";
export type PayrollPayeeTaxRegime = "PAYE" | "WHT" | "EXEMPT";
export type PayrollPayeeStatus = "ACTIVE" | "INACTIVE" | "ON_LEAVE" | "SUSPENDED";
export type PayrollPayeeLifecycleStatus = "ACTIVE" | "INACTIVE";

export interface PayrollPayeeGroup {
  id: string;
  name: string;
  description?: string | null;
  displayColor?: string | null;
  active: boolean;
}

export interface PayrollPayeeBank {
  bankName?: string | null;
  bankCode?: string | null;
  accountNumber?: string | null;
  accountName?: string | null;
  providerVerified?: boolean;
}

export interface PayrollPayee {
  id: string;
  employeeId?: string | null;
  name?: string | null;
  type?: PayrollPayeeType | "CONTRACTOR" | "VENDOR" | "DIRECTOR" | "BOARD_MEMBER";
  group?: PayrollPayeeGroup | null;
  status?: PayrollPayeeStatus;
  payrollLifecycleStatus?: PayrollPayeeLifecycleStatus;
  taxStatus?: PayrollPayeeTaxRegime | "LEGACY_UNSPECIFIED";
  legacy?: boolean;
  onPayroll?: boolean;
  role?: string | null;
  dateOnboarded?: string | null;
  email?: string | null;
  phone?: string | null;
  grossSalary?: number;
  estimatedNetSalary?: number;
  taxAmount?: number;
  calculationStatus?: string;
  bank?: PayrollPayeeBank;
}

export interface PayrollPayeesSummary {
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
  monthlyTotal: number;
  monthlyTotalMeaning?: string;
  legacyExcludedFromMonthlyTotal?: number;
}

export interface PayrollPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FetchPayeesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: PayrollPayeeLifecycleStatus;
}

export interface FetchPayeesResult {
  summary: PayrollPayeesSummary;
  payees: PayrollPayee[];
  pagination: PayrollPagination;
}

export interface PermanentPayeeBody {
  type: "PERMANENT";
  employeeId: string;
  taxRegime?: "PAYE";
  onPayroll?: boolean;
}

export interface ExternalPayeeBody {
  type: "CONTRACT" | "CONSULTANT";
  taxRegime?: PayrollPayeeTaxRegime;
  name: string;
  externalRole?: string | null;
  dateOnboarded?: string;
  status?: PayrollPayeeStatus;
  onPayroll?: boolean;
  email?: string | null;
  phone?: string | null;
  bankName?: string | null;
  bankCode?: string | null;
  accountNumber?: string;
  accountName?: string | null;
  tin?: string | null;
  monthlyAmount: number;
}

export type CreatePayrollPayeeBody = PermanentPayeeBody | ExternalPayeeBody;

export interface UpdatePayrollPayeeBody {
  type?: PayrollPayeeType;
  taxRegime?: PayrollPayeeTaxRegime;
  name?: string | null;
  externalRole?: string | null;
  dateOnboarded?: string | null;
  status?: PayrollPayeeStatus;
  email?: string | null;
  phone?: string | null;
  bankName?: string | null;
  bankCode?: string | null;
  accountNumber?: string | null;
  accountName?: string | null;
  tin?: string | null;
  monthlyAmount?: number | null;
}

export interface CreatePayeeGroupBody {
  name: string;
  description?: string;
  displayColor?: string;
}

export interface UpdatePayeeGroupBody {
  name?: string;
  description?: string | null;
  displayColor?: string | null;
  active?: boolean;
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
  | "WALLET_FUNDING"
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
  pagination?: PayrollPagination;
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
  pagination?: PayrollPagination;
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

export interface PayrollEmployeeListItem {
  employeeId: string;
  employeeCode: string;
  fullName: string;
  initials?: string;
  role?: string | null;
  department?: { id?: string; name?: string } | string | null;
  employmentType?: string | null;
  employeeStatus?: string;
  payrollStatus?: string;
  grossPay?: number;
  netPay?: number;
  paye?: number;
}

export interface FetchPayrollEmployeesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface FetchPayrollEmployeesResult {
  employees: PayrollEmployeeListItem[];
  pagination: PayrollPagination;
}

// ADD to the bottom of src/lib/api/types/payroll.types.ts (paste only, don't replace the file)
export type PayrollPayRunSelectionMode = "ALL_ELIGIBLE" | "EMPTY";

export interface PayrollEligiblePayee extends PayrollPayee {
  eligible?: boolean;
  ineligibleReason?: string | null;
}

export interface FetchEligiblePayeesParams {
  from?: string;
  to?: string;
  payRunId?: string;
}

export interface CreatePayRunPayload {
  periodLabel: string;
  from: string;
  to: string;
  payDate?: string;
  selectionMode?: PayrollPayRunSelectionMode;
}

export interface AddPayRunPayeesPayload {
  payeeIds: string[];
}

export interface PayrollPayRunTotals {
  gross: number;
  netPay: number;
  permanentNetPay: number;
  externalNetPay: number;
  paye: number;
  wht: number;
  pension: number;
  employerPension: number;
  nhf: number;
  loans: number;
  otherDeductions: number;
}

export type PayrollPayRunStatus =
  | "DRAFT"
  | "PROCESSING"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED_FOR_REWORK"
  | "PENDING_DISBURSEMENT"
  | "DISBURSING"
  | "DISBURSED"
  | "FAILED"
  | "PAID"
  | "CANCELLED";

export interface PayrollPayRun {
  id: string;
  periodLabel: string;
  periodStart: string;
  periodEnd: string;
  payDate: string | null;
  createdAt: string;
  computedAt: string | null;
  approvedAt: string | null;
  approvedById: string | null;
  rejectedAt: string | null;
  rejectedById: string | null;
  rejectionReason: string | null;
  replacesPayrollRunId: string | null;
  replacementPayrollRunId: string | null;
  revisionRootRunId: string | null;
  revisionNumber: number;
  disbursedAt: string | null;
  membershipVersion: string;
  participantsFrozenAt: string | null;
  participantCount: number;
  permanentEmployeeCount: number;
  externalPayeeCount: number;
  employeeCount: number;
  expectedEmployeeCount: number;
  processedEmployeeCount: number;
  failedEmployeeCount: number;
  processedParticipantCount: number;
  failedParticipantCount: number;
  progress: { expected: number; processed: number; failed: number; percentage: number };
  failureReason: string | null;
  totals: PayrollPayRunTotals;
  status: PayrollPayRunStatus;
  paymentState: string;
  availableActions: string[];
  canApprove?: boolean;
  canReject?: boolean;
  canInitiatePayment?: boolean;
  approvalBlockedReason?: string | null;
  requiresIndependentApprover?: boolean;
}

export type PayrollPayRunRef = PayrollPayRun;

// ADD to the bottom of src/lib/api/types/payroll.types.ts (paste only)
// export interface PayrollPayRunItem {
//   id?: string;
//   participantId?: string;
//   payeeId?: string;
//   name?: string | null;
//   fullName?: string | null;
//   payeeName?: string | null;
//   group?: { name?: string | null } | string | null;
//   groupName?: string | null;
//   gross?: number;
//   grossPay?: number;
//   netPay?: number;
//   paye?: number;
//   wht?: number;
//   pension?: number;
//   status?: string;
//   [key: string]: unknown;
// }

export interface PayrollPayRunItem {
  participantId?: string | null;
  payeeId?: string | null;
  employeeId?: string | null;
  displayName?: string | null;
  participantType?: "PERMANENT" | "CONTRACT" | "CONSULTANT";
  group?: { id?: string; name?: string } | null;
  resultType?: "PAYSLIP" | "PAYEE_PAYMENT";
  resultId?: string;
  baseCompensation?: number;
  bonus?: number;
  cashGross?: number;
  paye?: number;
  wht?: number;
  employeePension?: number;
  employerPension?: number;
  nhf?: number;
  nsitf?: number;
  avc?: number;
  loans?: number;
  customDeductions?: number;
  netPay?: number;
  currency?: string | null;
  resultStatus?: string;
}

export interface FetchPayRunsParams {
  page?: number;
  limit?: number;
}

export interface PayRunsPage {
  items: PayrollPayRun[];
  pagination: PayrollPagination;
}

export interface PayRunDetailPage {
  payRun: PayrollPayRun;
  items: PayrollPayRunItem[];
  pagination: PayrollPagination;
}

export interface RejectPayRunPayload {
  reason: string;
}



 
export interface PayrollDashboardTrendPoint {
  period: string;
  gross: number;
  netPay: number;
  permanentNetPay: number;
  externalNetPay: number;
}

export interface PayrollDashboardDeductionPoint {
  period: string;
  paye: number;
  wht: number;
  pension: number;
  employerPension: number;
  nhf: number;
}

export interface PayrollDashboardData {
  period: string;
  currency: string;
  summary: {
    employeesOnPayroll: number;
    participantsOnPayroll: number;
    externalPayeesOnPayroll: number;
    totalMonthlyCost: { amount: number; currency: string; period: string };
    currentRunTotals: unknown;
    lastRunNetPay: unknown;
    pendingDisbursement: unknown;
  };
  pendingApproval: { id?: string; payRunId?: string; [key: string]: unknown } | null;
  payrollTrend: PayrollDashboardTrendPoint[];
  deductionTrend: PayrollDashboardDeductionPoint[];
  payeeGroupDistribution: {
    basis: string;
    payRunId: string | null;
    period: string | null;
    items: Record<string, unknown>[];
  };
  departmentCosts: { period: string | null; items: Record<string, unknown>[] };
  statutoryObligations: { period: string | null; items: Record<string, unknown>[] };
  recentPayRuns: PayrollPayRun[];
  actions: { canRunPayroll: boolean; canViewPayslips: boolean; canManageDeductions: boolean };
}

// ADD to the bottom of src/lib/api/types/payroll.types.ts (paste only)
export type PayrollRecord = Record<string, unknown>;

export interface PayrollRecordsPage {
  items: PayrollRecord[];
  pagination: PayrollPagination | null;
}

export interface FetchPensionRemittancesParams {
  period?: string;
  status?: string;
  pfa?: string;
  page?: number;
  limit?: number;
}

export interface FetchPensionContributionsParams {
  period?: string;
  search?: string;
  pfa?: string;
  page?: number;
  limit?: number;
}

export interface RemitPensionBody {
  paymentReference: string;
  remittedAt: string;
  receiptReference?: string;
}

export interface FetchTaxByStateParams {
  state?: string;
  period?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface TaxByStateResult {
  groups: PayrollRecord[];
  employees: PayrollRecord[];
  pagination: PayrollPagination | null;
}

export interface FetchTaxRemittancesParams {
  state?: string;
  period?: string;
  status?: string;
  page?: number;
  limit?: number;
}

// ADD to the bottom of src/lib/api/types/payroll.types.ts (paste only)
export type PayeeBonusFrequency = "ONCE" | "MULTIPLE";

export interface PayeeBonusBody {
  amount: number;
  frequency: PayeeBonusFrequency;
  justification: string;
  effectiveFrom: string;
  effectiveTo?: string;
}

export type PayeeProrationBasis = "WORKING_DAYS" | "CALENDAR_DAYS";

export interface PayeeProrationBody {
  payFrom: string;
  payUntil: string;
  basis: PayeeProrationBasis;
  justification: string;
}

// REPLACE the existing CustomDeductionBody interface in src/lib/api/types/payroll.types.ts with the two interfaces below
export interface CustomDeductionBody {
  employeeId: string;
  deductionTypeId: string;
  amount: number;
  name: string;
  type: "ONE_OFF" | "RECURRING";
}

export interface PayrollDeductionTypeItem {
  id: string;
  name: string;
  category?: string;
}

export interface FetchPayeePaymentHistoryParams {
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
}


// ADD to the bottom of src/lib/api/types/payroll.types.ts (paste only)
export interface FetchPayslipsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  departmentId?: string;
}

export interface PayslipsTotals {
  payslipCount?: number;
  totalGross?: number;
  totalDeductions?: number;
  totalNetPay?: number;
}

export interface PayslipsFilters {
  statuses?: string[];
  departments?: { id: string; name: string }[];
}

export interface PayslipsPage {
  totals: PayslipsTotals;
  filters: PayslipsFilters;
  items: PayrollRecord[];
  pagination: PayrollPagination | null;
}

export interface PayrollLoansSummary {
  activeLoans?: number;
  monthlyLoanDeductions?: number;
  totalOutstanding?: number;
}

export interface PayrollLoansPage {
  summary: PayrollLoansSummary;
  items: PayrollRecord[];
  pagination: PayrollPagination | null;
}

export interface CreatePayrollLoanBody {
  employeeId: string;
  purpose: string;
  originalPrincipal: number;
  openingOutstanding: number;
  externalDisbursementDate: string;
  repaymentType: "RECURRING" | "ONE_OFF";
  recoveryStartDate: string;
  monthlyRepayment?: number;
  currency?: "NGN";
  attestation: true;
  externalReference?: string;
  notes?: string;
}

 
export interface PayPeriodSettings {
  payFrequency: string;
  defaultPayDay: number;
  version?: number;
  updatedAt?: string | null;
}

export interface UpdatePayPeriodBody {
  payFrequency: "MONTHLY";
  defaultPayDay: number;
}

export interface PayrollSettingTypeRow {
  id: string;
  code?: string;
  name: string;
  category?: string;
  taxTreatment?: "TAXABLE" | "TAX_EXEMPT";
  systemDefined?: boolean;
  active?: boolean;
  removable?: boolean;
  editable?: boolean;
}

export interface CreateAllowanceTypeBody {
  name: string;
  taxTreatment: "TAXABLE" | "TAX_EXEMPT";
}

export interface StatutoryRatesData {
  paye: {
    bands: { threshold: number | null; rate: string }[];
    remittanceDueDay?: number;
  };
  pension: { employeeRate: string; employerRate: string; basis: string[] };
  nhf: { employeeRate: string; basis: string };
  nsitf: { employerRate: string; basis: string };
}