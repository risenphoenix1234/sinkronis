// src/lib/api/payroll.ts
import axios from "axios";
import api from "./axios";
import type {
  PayeeBonusBody,
  PayeeProrationBody,
  CustomDeductionBody,
  FetchPayeePaymentHistoryParams,
  FetchPayslipsParams,
  PayslipsPage,
  PayrollLoansPage,
  CreatePayrollLoanBody,
  AddPayRunPayeesPayload,
  CreatePayRunPayload,
  CreatePayeeGroupBody,
  CreatePayrollPayeeBody,
  ExternalPayeeBody,
  FetchEligiblePayeesParams,
  FetchPayRunsParams,
  FetchPayeesParams,
  FetchPayeesResult,
  FetchPayrollEmployeesParams,
  FetchPayrollEmployeesResult,
  FetchPensionContributionsParams,
  FetchPensionRemittancesParams,
  FetchTaxByStateParams,
  FetchTaxRemittancesParams,
  FundPayrollWalletBody,
  FundPayrollWalletResponse,
  GetPayrollWalletObligationsParams,
  GetPayrollWalletObligationsResponse,
  GetPayrollWalletResponse,
  GetPayrollWalletTransactionResponse,
  GetPayrollWalletTransactionsParams,
  GetPayrollWalletTransactionsResponse,
  PayPayrollWalletObligationResponse,
  PayRunDetailPage,
  PayRunsPage,
  PayrollDashboardData,
  PayrollEligiblePayee,
  PayrollPagination,
  PayrollPayRun,
  PayrollPayRunItem,
  PayrollPayRunRef,
  PayrollPayee,
  PayrollPayeeGroup,
  PayrollPayeesSummary,
  PayrollRecord,
  PayrollRecordsPage,
  RejectPayRunPayload,
  RemitPensionBody,
  TaxByStateResult,
  UpdatePayeeGroupBody,
  UpdatePayrollPayeeBody,
  PayrollDeductionTypeItem,
} from "./types/payroll.types";

const BASE = "/payroll";

interface PayeesResponse {
  success: boolean;
  message: string;
  data: { summary: PayrollPayeesSummary; payees: PayrollPayee[] };
  pagination: PayrollPagination;
}

interface PayeeResponse {
  success: boolean;
  message: string;
  data: PayrollPayee;
}

interface PayeeGroupsResponse {
  success: boolean;
  message: string;
  data: PayrollPayeeGroup[];
}

interface PayeeGroupResponse {
  success: boolean;
  message: string;
  data: PayrollPayeeGroup;
}

type ValidationIssue = { field?: string; message?: string };

export function getApiErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; validationErrors?: ValidationIssue[] | null }
      | undefined;
    const issues = data?.validationErrors;
    if (Array.isArray(issues) && issues.length > 0) {
      return issues
        .map((i) => (i.field ? `${i.field}: ${i.message ?? "invalid"}` : (i.message ?? "invalid")))
        .join(", ");
    }
    if (data?.message) return data.message;
    if (!error.response) return "Cannot reach the server. Check your connection and try again.";
  }
  return fallback;
}

export const getPayeeGroups = async (): Promise<PayrollPayeeGroup[]> => {
  const { data } = await api.get<PayeeGroupsResponse>(`${BASE}/settings/payee-groups`);
  return data.data;
};

export const createPayeeGroup = async (payload: CreatePayeeGroupBody): Promise<PayrollPayeeGroup> => {
  const { data } = await api.post<PayeeGroupResponse>(`${BASE}/settings/payee-groups`, payload);
  return data.data;
};

export const updatePayeeGroup = async (
  groupId: string,
  payload: UpdatePayeeGroupBody,
): Promise<PayrollPayeeGroup> => {
  const { data } = await api.patch<PayeeGroupResponse>(`${BASE}/settings/payee-groups/${groupId}`, payload);
  return data.data;
};

export const assignPayeeGroup = async (payeeId: string, groupId: string) => {
  const { data } = await api.patch(`${BASE}/payees/${payeeId}/group`, { groupId });
  return data;
};

export const fetchPayees = async (params?: FetchPayeesParams): Promise<FetchPayeesResult> => {
  const { data } = await api.get<PayeesResponse>(`${BASE}/payees`, { params });
  return {
    summary: data.data.summary,
    payees: data.data.payees,
    pagination: data.pagination,
  };
};

export const createPayrollPayee = async (payload: CreatePayrollPayeeBody): Promise<PayrollPayee> => {
  const { data } = await api.post<PayeeResponse>(`${BASE}/payees`, payload);
  return data.data;
};

export const getPayrollPayee = async (payeeId: string): Promise<PayrollPayee> => {
  const { data } = await api.get<PayeeResponse>(`${BASE}/payees/${payeeId}`);
  return data.data;
};

export const updatePayrollPayee = async (
  payeeId: string,
  payload: UpdatePayrollPayeeBody,
): Promise<PayrollPayee> => {
  const { data } = await api.patch<PayeeResponse>(`${BASE}/payees/${payeeId}`, payload);
  return data.data;
};

export const deletePayrollPayee = async (payeeId: string) => {
  const { data } = await api.delete(`${BASE}/payees/${payeeId}`);
  return data;
};

export const fetchPayrollEmployees = async (
  params?: FetchPayrollEmployeesParams,
): Promise<FetchPayrollEmployeesResult> => {
  const { data } = await api.get<{
    success: boolean;
    message: string;
    data: FetchPayrollEmployeesResult["employees"];
    pagination: PayrollPagination;
  }>(`${BASE}/employees`, { params });
  return { employees: data.data, pagination: data.pagination };
};

export const setPayeePayrollParticipation = async (payeeId: string, onPayroll: boolean) => {
  const { data } = await api.patch(`${BASE}/payees/${payeeId}/toggle-payroll`, { onPayroll });
  return data;
};

export const exportPayeesFile = async (params?: Omit<FetchPayeesParams, "page" | "limit">): Promise<Blob> => {
  const response = await api.get(`${BASE}/payees/export`, {
    params,
    responseType: "blob",
    headers: { Accept: "text/csv" },
  });
  return response.data;
};

export const getPayrollWallet = async (): Promise<GetPayrollWalletResponse> => {
  const { data } = await api.get<GetPayrollWalletResponse>(`${BASE}/wallet`);
  return data;
};

export const fundPayrollWallet = async (payload: FundPayrollWalletBody): Promise<FundPayrollWalletResponse> => {
  const { data } = await api.post<FundPayrollWalletResponse>(`${BASE}/wallet/fund`, payload);
  return data;
};

export const getPayrollWalletTransactions = async (
  params?: GetPayrollWalletTransactionsParams,
): Promise<GetPayrollWalletTransactionsResponse> => {
  const { data } = await api.get<GetPayrollWalletTransactionsResponse>(`${BASE}/wallet/transactions`, { params });
  return data;
};

export const exportPayrollWalletTransactionsCsv = async (): Promise<Blob> => {
  const response = await api.get(`${BASE}/wallet/transactions/export`, {
    responseType: "blob",
    headers: { Accept: "text/csv" },
  });
  return response.data;
};

export const getPayrollWalletTransaction = async (
  transactionId: string,
): Promise<GetPayrollWalletTransactionResponse> => {
  const { data } = await api.get<GetPayrollWalletTransactionResponse>(
    `${BASE}/wallet/transactions/${encodeURIComponent(transactionId)}`,
  );
  return data;
};

export const getPayrollWalletObligations = async (
  params?: GetPayrollWalletObligationsParams,
): Promise<GetPayrollWalletObligationsResponse> => {
  const { data } = await api.get<GetPayrollWalletObligationsResponse>(`${BASE}/wallet/obligations`, { params });
  return data;
};

export const payPayrollWalletObligation = async (
  obligationId: string,
  payload?: Record<string, unknown>,
): Promise<PayPayrollWalletObligationResponse> => {
  const { data } = await api.post<PayPayrollWalletObligationResponse>(
    `${BASE}/wallet/obligations/${encodeURIComponent(obligationId)}/pay`,
    payload,
  );
  return data;
};

export type {
  PayrollWalletData,
  PayrollWalletObligation,
  PayrollWalletTransaction,
} from "./types/payroll.types";

type EligiblePayeeRow = {
  payeeId: string;
  displayName?: string | null;
  type?: string;
  role?: string | null;
  status?: string;
  onPayroll?: boolean;
  taxRegime?: string;
  configuredGross?: number;
  eligible?: boolean;
  reasonCodes?: string[];
};

export const fetchEligiblePayees = async (params: FetchEligiblePayeesParams): Promise<PayrollEligiblePayee[]> => {
  const rows: EligiblePayeeRow[] = [];
  let page = 1;
  let totalPages = 1;
  do {
    const { data } = await api.get<{
      data: EligiblePayeeRow[];
      pagination?: { totalPages: number };
    }>(`${BASE}/pay-runs/eligible-payees`, { params: { ...params, page } });
    rows.push(...(Array.isArray(data.data) ? data.data : []));
    totalPages = data.pagination?.totalPages ?? 1;
    page += 1;
  } while (page <= totalPages);

  const known = new Map<string, PayrollPayee>();
  let listPage = 1;
  let listPages = 1;
  do {
    const res = await fetchPayees({ page: listPage, limit: 100 });
    res.payees.forEach((p) => known.set(p.id, p));
    listPages = res.pagination?.totalPages ?? 1;
    listPage += 1;
  } while (listPage <= listPages);

  return rows
    .filter((r) => !r.reasonCodes?.includes("PAYEE_REMOVED"))
    .map((r) => {
      const p = known.get(r.payeeId);
      return {
        ...(p ?? {}),
        id: r.payeeId,
        name: r.displayName ?? p?.name ?? null,
        type: (r.type ?? p?.type) as PayrollPayee["type"],
        role: r.role ?? p?.role ?? null,
        status: (r.status ?? p?.status) as PayrollPayee["status"],
        onPayroll: r.onPayroll ?? p?.onPayroll,
        grossSalary: p?.grossSalary ?? r.configuredGross ?? 0,
        eligible: r.eligible,
        ineligibleReason: r.reasonCodes && r.reasonCodes.length > 0 ? r.reasonCodes.join(", ") : null,
      };
    });
};

export const createPayRun = async (payload: CreatePayRunPayload): Promise<PayrollPayRunRef> => {
  const { data } = await api.post<{
    success: boolean;
    message: string;
    data: { run: PayrollPayRunRef; selectionMode: string; selectedParticipantCount: number };
  }>(`${BASE}/pay-runs`, payload);
  return data.data.run;
};

export const addPayRunPayees = async (payRunId: string, payload: AddPayRunPayeesPayload) => {
  const { data } = await api.post(`${BASE}/pay-runs/${payRunId}/payees`, payload);
  return data;
};

export const processPayRun = async (payRunId: string) => {
  const { data } = await api.post(`${BASE}/pay-runs/${payRunId}/process`);
  return data;
};

export const getPayRuns = async (params?: FetchPayRunsParams): Promise<PayRunsPage> => {
  const { data } = await api.get<{ success: boolean; message: string; data: PayrollPayRun[]; pagination: PayrollPagination }>(
    `${BASE}/pay-runs`,
    { params },
  );
  return { items: data.data ?? [], pagination: data.pagination };
};

export const getPayRun = async (payRunId: string, params?: FetchPayRunsParams): Promise<PayRunDetailPage> => {
  const { data } = await api.get<{
    success: boolean;
    message: string;
    data: { payRun: PayrollPayRun; items: PayrollPayRunItem[] };
    pagination: PayrollPagination;
  }>(`${BASE}/pay-runs/${payRunId}`, { params });
  return { payRun: data.data.payRun, items: data.data.items ?? [], pagination: data.pagination };
};

export const approvePayRun = async (payRunId: string) => {
  const { data } = await api.post(`${BASE}/pay-runs/${payRunId}/approve`);
  return data;
};

export const rejectPayRun = async (payRunId: string, payload: RejectPayRunPayload) => {
  const { data } = await api.post(`${BASE}/pay-runs/${payRunId}/reject`, payload);
  return data;
};

export const cancelPayRun = async (payRunId: string) => {
  const { data } = await api.post(`${BASE}/pay-runs/${payRunId}/cancel`);
  return data;
};

export const exportPayRun = async (payRunId: string): Promise<Blob> => {
  const response = await api.get(`${BASE}/pay-runs/${payRunId}/export`, { responseType: "blob" });
  return response.data;
};

export const getPayrollDashboard = async (): Promise<PayrollDashboardData> => {
  const { data } = await api.get<{ success: boolean; message: string; data: PayrollDashboardData }>(`${BASE}/dashboard`);
  return data.data;
};

const asRecords = (raw: unknown): PayrollRecord[] => {
  if (Array.isArray(raw)) return raw as PayrollRecord[];
  if (raw && typeof raw === "object") {
    const obj = raw as PayrollRecord;
    for (const key of ["items", "data", "remittances", "rows", "employees", "groups"]) {
      if (Array.isArray(obj[key])) return obj[key] as PayrollRecord[];
    }
  }
  return [];
};

const listOf = async (path: string, params?: object): Promise<PayrollRecordsPage> => {
  const { data } = await api.get<{ data: unknown; pagination?: PayrollPagination }>(`${BASE}${path}`, { params });
  return { items: asRecords(data.data), pagination: data.pagination ?? null };
};

export const getPensionRemittances = (params?: FetchPensionRemittancesParams) => listOf("/pension/remittances", params);

export const getPensionContributions = (params?: FetchPensionContributionsParams) =>
  listOf("/pension/contributions", params);

export const getPensionRemittance = async (id: string): Promise<PayrollRecord> => {
  const { data } = await api.get<{ data: PayrollRecord }>(`${BASE}/pension/remittances/${encodeURIComponent(id)}`);
  return data.data;
};

export const remitPensionRemittance = async (id: string, payload: RemitPensionBody) => {
  const { data } = await api.post(`${BASE}/pension/remittances/${encodeURIComponent(id)}/remit`, payload);
  return data;
};

export const getTaxEmployeesByState = async (params?: FetchTaxByStateParams): Promise<TaxByStateResult> => {
  const { data } = await api.get<{ data: unknown; pagination?: PayrollPagination }>(`${BASE}/tax/employees-by-state`, {
    params,
  });
  const raw = data.data;
  if (Array.isArray(raw)) return { groups: raw as PayrollRecord[], employees: [], pagination: data.pagination ?? null };
  const obj = (raw ?? {}) as PayrollRecord;
  return {
    groups: Array.isArray(obj.groups) ? (obj.groups as PayrollRecord[]) : [],
    employees: Array.isArray(obj.employees) ? (obj.employees as PayrollRecord[]) : [],
    pagination: data.pagination ?? null,
  };
};

export const getTaxRemittances = (params?: FetchTaxRemittancesParams) => listOf("/tax/remittances", params);

export const bulkCreatePayrollPayees = async (payees: ExternalPayeeBody[]) => {
  const { data } = await api.post<{ success?: boolean; message?: string; data?: unknown }>(`${BASE}/payees/bulk`, payees);
  return data;
};

export const getPayeeBonuses = (payeeId: string) => listOf(`/payees/${payeeId}/bonuses`);

export const createPayeeBonus = async (payeeId: string, body: PayeeBonusBody) => {
  const { data } = await api.post(`${BASE}/payees/${payeeId}/bonuses`, body);
  return data;
};

export const updatePayeeBonus = async (payeeId: string, bonusId: string, body: Partial<PayeeBonusBody>) => {
  const { data } = await api.patch(`${BASE}/payees/${payeeId}/bonuses/${bonusId}`, body);
  return data;
};

export const deletePayeeBonus = async (payeeId: string, bonusId: string) => {
  const { data } = await api.delete(`${BASE}/payees/${payeeId}/bonuses/${bonusId}`);
  return data;
};

export const getPayeeProrations = (payeeId: string) => listOf(`/payees/${payeeId}/proration-overrides`);

export const createPayeeProration = async (payeeId: string, body: PayeeProrationBody) => {
  const { data } = await api.post(`${BASE}/payees/${payeeId}/proration-overrides`, body);
  return data;
};

export const updatePayeeProration = async (payeeId: string, overrideId: string, body: Partial<PayeeProrationBody>) => {
  const { data } = await api.patch(`${BASE}/payees/${payeeId}/proration-overrides/${overrideId}`, body);
  return data;
};

export const deletePayeeProration = async (payeeId: string, overrideId: string) => {
  const { data } = await api.delete(`${BASE}/payees/${payeeId}/proration-overrides/${overrideId}`);
  return data;
};

export const getPayeePaymentHistory = (payeeId: string, params?: FetchPayeePaymentHistoryParams) =>
  listOf(`/payees/${payeeId}/payment-history`, params);

export const exportPayeePaymentHistory = async (payeeId: string): Promise<Blob> => {
  const response = await api.get(`${BASE}/payees/${payeeId}/payment-history/export`, { responseType: "blob" });
  return response.data;
};

export const getCustomDeductions = (params?: { page?: number; limit?: number }) => listOf("/deductions/custom", params);

export const createCustomDeduction = async (body: CustomDeductionBody) => {
  const { data } = await api.post(`${BASE}/deductions/custom`, body);
  return data;
};

export const deleteCustomDeduction = async (deductionId: string) => {
  const { data } = await api.delete(`${BASE}/deductions/custom/${deductionId}`);
  return data;
};

export const getPayslipsPage = async (params?: FetchPayslipsParams): Promise<PayslipsPage> => {
  const { data } = await api.get<{ data: PayrollRecord; pagination?: PayrollPagination }>(`${BASE}/payslips`, { params });
  const d = (data.data ?? {}) as PayrollRecord;
  return {
    totals: (d.totals ?? {}) as PayslipsPage["totals"],
    filters: (d.filters ?? {}) as PayslipsPage["filters"],
    items: asRecords(d.payslips),
    pagination: data.pagination ?? null,
  };
};

export const getPayslipDetail = async (payslipId: string): Promise<PayrollRecord> => {
  const { data } = await api.get<{ data: PayrollRecord }>(`${BASE}/payslips/${payslipId}`);
  const d = (data.data ?? {}) as PayrollRecord;
  const inner = d.payslip;
  return inner && typeof inner === "object" ? { ...d, ...(inner as PayrollRecord) } : d;
};

export const downloadPayslipFile = async (payslipId: string): Promise<Blob> => {
  const response = await api.get(`${BASE}/payslips/${payslipId}/download`, { responseType: "blob" });
  return response.data;
};

export const exportPayslipsFile = async (params?: FetchPayslipsParams): Promise<Blob> => {
  const response = await api.get(`${BASE}/payslips/export`, { params, responseType: "blob" });
  return response.data;
};

export const getLoansPage = async (params?: { page?: number; limit?: number }): Promise<PayrollLoansPage> => {
  const { data } = await api.get<{ data: PayrollRecord; pagination?: PayrollPagination }>(`${BASE}/deductions/loans`, { params });
  const d = (data.data ?? {}) as PayrollRecord;
  return {
    summary: (d.summary ?? {}) as PayrollLoansPage["summary"],
    items: asRecords(d.loans),
    pagination: data.pagination ?? null,
  };
};

export const getLoanDetail = async (loanId: string): Promise<PayrollRecord> => {
  const { data } = await api.get<{ data: PayrollRecord }>(`${BASE}/deductions/loans/${loanId}`);
  const d = (data.data ?? {}) as PayrollRecord;
  const inner = d.loan;
  return inner && typeof inner === "object" ? { ...d, ...(inner as PayrollRecord) } : d;
};

export const createPayrollLoan = async (body: CreatePayrollLoanBody) => {
  const { data } = await api.post(`${BASE}/deductions/loans`, body);
  return data;
};

export const pausePayrollLoan = async (loanId: string) => {
  const { data } = await api.post(`${BASE}/deductions/loans/${loanId}/pause`, {});
  return data;
};

export const resumePayrollLoan = async (loanId: string) => {
  const { data } = await api.post(`${BASE}/deductions/loans/${loanId}/resume`, {});
  return data;
};

export const closePayrollLoanEarly = async (loanId: string) => {
  const { data } = await api.post(`${BASE}/deductions/loans/${loanId}/close-early`, {});
  return data;
};

export const adjustPayrollLoanRepayment = async (loanId: string, monthlyRepayment: number) => {
  const { data } = await api.post(`${BASE}/deductions/loans/${loanId}/adjust-repayment`, { monthlyRepayment });
  return data;
};

export const exportPayrollLoanSchedule = async (loanId: string): Promise<Blob> => {
  const response = await api.get(`${BASE}/deductions/loans/${loanId}/export`, { responseType: "blob" });
  return response.data;
};


// ADD to the bottom of src/lib/api/payroll.ts (paste only)
export const getPayrollDeductionTypeList = async (): Promise<PayrollDeductionTypeItem[]> => {
  const { data } = await api.get<{ data: PayrollDeductionTypeItem[] }>(`${BASE}/settings/deduction-types`);
  return Array.isArray(data.data) ? data.data : [];
};

export const createPayrollDeductionTypeItem = async (name: string): Promise<PayrollDeductionTypeItem> => {
  const { data } = await api.post<{ data: PayrollDeductionTypeItem }>(`${BASE}/settings/deduction-types`, { name });
  return data.data;
};