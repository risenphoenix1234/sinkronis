import api from "@/lib/api/axios";
import type {
  PayrollDashboardData,
  PayrollDashboardResponse,
} from "@/lib/api/types/payrollTypes";

/**
 * Fetch consolidated dashboard metrics, charts, trends, and recent runs.
 * Requires payroll:dashboard:view.
 */
export async function getPayrollDashboard(): Promise<PayrollDashboardData> {
  const response = await api.get<PayrollDashboardResponse>("/payroll/dashboard");
  return response.data.data;
}
