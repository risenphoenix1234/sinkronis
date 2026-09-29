import api from "@/lib/api/axios";
import type {
  GetPayrollBankPaymentScheduleParams,
  GetPayrollBankPaymentScheduleResponse,
  GetPayrollDeptCostParams,
  GetPayrollDeptCostResponse,
  GetPayrollReportSummaryResponse,
  GetPayrollVarianceParams,
  GetPayrollVarianceResponse,
  GetPayrollYtdEarningsResponse,
} from "@/lib/api/types/payrollTypes";

/**
 * Fetch payroll period summary and monthly trend from finalized snapshots.
 * No query parameters per Swagger spec.
 */
export async function getPayrollReportSummary(): Promise<GetPayrollReportSummaryResponse> {
  const response = await api.get<GetPayrollReportSummaryResponse>(
    "/payroll/reports/summary",
  );
  return response.data;
}

/**
 * Fetch payroll cost grouped by snapshotted department.
 * No query parameters per Swagger spec.
 */
export async function getPayrollDepartmentCost(
  params?: GetPayrollDeptCostParams,
): Promise<GetPayrollDeptCostResponse> {
  const response = await api.get<GetPayrollDeptCostResponse>(
    "/payroll/reports/department-cost",
    { params },
  );
  return response.data;
}

export async function getPayrollMonthlyVariance(
  params?: GetPayrollVarianceParams,
): Promise<GetPayrollVarianceResponse> {
  const response = await api.get<GetPayrollVarianceResponse>(
    "/payroll/reports/monthly-variance",
    { params },
  );
  return response.data;
}

/**
 * Fetch snapshot-backed bank payment schedule.
 * Accepts optional query parameters (e.g. period=YYYY-MM).
 */
export async function getPayrollBankPaymentSchedule(
  params?: GetPayrollBankPaymentScheduleParams,
): Promise<GetPayrollBankPaymentScheduleResponse> {
  const response = await api.get<GetPayrollBankPaymentScheduleResponse>(
    "/payroll/reports/bank-payment-schedule",
    { params },
  );
  return response.data;
}

/**
 * Fetch finalized YTD employee earnings.
 * No query parameters per Swagger spec.
 */
export async function getPayrollYtdEarnings(): Promise<GetPayrollYtdEarningsResponse> {
  const response = await api.get<GetPayrollYtdEarningsResponse>(
    "/payroll/reports/ytd-earnings",
  );
  return response.data;
}
