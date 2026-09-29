import api from "@/lib/api/axios";
import type {
  AdjustLoanRepaymentBody,
  AdjustLoanRepaymentResponse,
  CloseEarlyLoanBody,
  CloseEarlyLoanResponse,
  CreatePayrollDeductionTypeBody,
  CreatePayrollDeductionTypeResponse,
  CreateTenantCustomDeductionBody,
  CreateTenantCustomDeductionResponse,
  CreateTenantLoanBody,
  CreateTenantLoanResponse,
  DeletePayrollDeductionTypeResponse,
  DeleteTenantCustomDeductionResponse,
  GetPayrollDeductionTypesResponse,
  GetTenantCustomDeductionsParams,
  GetTenantCustomDeductionsResponse,
  GetTenantLoanDetailResponse,
  GetTenantLoansParams,
  GetTenantLoansResponse,
  PauseTenantLoanResponse,
  ResumeTenantLoanResponse,
  UpdatePayrollDeductionTypeBody,
  UpdatePayrollDeductionTypeResponse,
} from "@/lib/api/types/payrollTypes";

export const getTenantLoans = async (
  params?: GetTenantLoansParams,
): Promise<GetTenantLoansResponse> => {
  const response = await api.get<GetTenantLoansResponse>(
    "/payroll/deductions/loans",
    { params },
  );
  return response.data;
};

export const getLoans = getTenantLoans;

export const createTenantLoan = async (
  body: CreateTenantLoanBody,
): Promise<CreateTenantLoanResponse> => {
  const response = await api.post<CreateTenantLoanResponse>(
    "/payroll/deductions/loans",
    body,
  );
  return response.data;
};

export const createLoan = createTenantLoan;

export const getTenantLoanDetail = async (
  loanId: string,
): Promise<GetTenantLoanDetailResponse> => {
  const response = await api.get<GetTenantLoanDetailResponse>(
    `/payroll/deductions/loans/${loanId}`,
  );
  return response.data;
};

export const adjustLoanRepayment = async (
  loanId: string,
  body: AdjustLoanRepaymentBody,
): Promise<AdjustLoanRepaymentResponse> => {
  const response = await api.post<AdjustLoanRepaymentResponse>(
    `/payroll/deductions/loans/${loanId}/adjust-repayment`,
    body,
  );
  return response.data;
};

export const pauseTenantLoan = async (
  loanId: string,
): Promise<PauseTenantLoanResponse> => {
  const response = await api.post<PauseTenantLoanResponse>(
    `/payroll/deductions/loans/${loanId}/pause`,
  );
  return response.data;
};

export const resumeTenantLoan = async (
  loanId: string,
): Promise<ResumeTenantLoanResponse> => {
  const response = await api.post<ResumeTenantLoanResponse>(
    `/payroll/deductions/loans/${loanId}/resume`,
  );
  return response.data;
};

export const closeEarlyTenantLoan = async (
  loanId: string,
  body?: CloseEarlyLoanBody,
): Promise<CloseEarlyLoanResponse> => {
  const response = await api.post<CloseEarlyLoanResponse>(
    `/payroll/deductions/loans/${loanId}/close-early`,
    body || { reason: "Closed early from loan detail page" },
  );
  return response.data;
};

export const exportTenantLoanScheduleCsv = async (
  loanId: string,
): Promise<Blob> => {
  const response = await api.get(
    `/payroll/deductions/loans/${loanId}/export`,
    {
      responseType: "blob",
      headers: {
        Accept: "text/csv",
      },
    },
  );
  return response.data;
};

export const exportTenantLoanSchedule = exportTenantLoanScheduleCsv;
export const exportLoanSchedule = exportTenantLoanScheduleCsv;

export const getTenantCustomDeductions = async (
  params?: GetTenantCustomDeductionsParams,
): Promise<GetTenantCustomDeductionsResponse> => {
  const response = await api.get<GetTenantCustomDeductionsResponse>(
    "/payroll/deductions/custom",
    { params },
  );
  return response.data;
};

export const getCustomDeductions = getTenantCustomDeductions;

export const createTenantCustomDeduction = async (
  body: CreateTenantCustomDeductionBody,
): Promise<CreateTenantCustomDeductionResponse> => {
  const response = await api.post<CreateTenantCustomDeductionResponse>(
    "/payroll/deductions/custom",
    body,
  );
  return response.data;
};

export const createCustomDeduction = createTenantCustomDeduction;

export const getPayrollDeductionTypes = async (): Promise<GetPayrollDeductionTypesResponse> => {
  const response = await api.get<GetPayrollDeductionTypesResponse>(
    "/payroll/settings/deduction-types",
  );
  return response.data;
};

export const createPayrollDeductionType = async (
  body: CreatePayrollDeductionTypeBody,
): Promise<CreatePayrollDeductionTypeResponse> => {
  const response = await api.post<CreatePayrollDeductionTypeResponse>(
    "/payroll/settings/deduction-types",
    body,
  );
  return response.data;
};

export const updatePayrollDeductionType = async (
  id: string | number,
  body: UpdatePayrollDeductionTypeBody,
): Promise<UpdatePayrollDeductionTypeResponse> => {
  const response = await api.patch<UpdatePayrollDeductionTypeResponse>(
    `/payroll/settings/deduction-types/${encodeURIComponent(id)}`,
    body,
  );
  return response.data;
};

export const deletePayrollDeductionType = async (
  id: string | number,
): Promise<DeletePayrollDeductionTypeResponse> => {
  const response = await api.delete<DeletePayrollDeductionTypeResponse>(
    `/payroll/settings/deduction-types/${encodeURIComponent(id)}`,
  );
  return response.data;
};

export const deleteTenantCustomDeduction = async (
  deductionId: string | number,
): Promise<DeleteTenantCustomDeductionResponse> => {
  const response = await api.delete<DeleteTenantCustomDeductionResponse>(
    `/payroll/deductions/custom/${encodeURIComponent(String(deductionId))}`,
  );
  return response.data;
};

export const removeCustomDeduction = deleteTenantCustomDeduction;
