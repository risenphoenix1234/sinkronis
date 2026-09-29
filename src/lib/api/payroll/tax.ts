import api from "@/lib/api/axios";
import type {
  ExportPayrollTaxAnnualReturnsParams,
  GetPayrollTaxAnnualReturnsParams,
  GetPayrollTaxAnnualReturnsResponse,
  GetPayrollTaxConfigResponse,
  GetPayrollTaxEmployeesByStateParams,
  GetPayrollTaxEmployeesByStateResponse,
  GetPayrollTaxOverviewParams,
  GetPayrollTaxOverviewResponse,
  GetPayrollTaxRemittancesParams,
  GetPayrollTaxRemittancesResponse,
} from "@/lib/api/types/payrollTypes";

/**
 * Get tenant PAYE overview for a tax year
 * 200: State authority count, YTD deducted/remitted and next due date
 */
export const getPayrollTaxOverview = async (
  params?: GetPayrollTaxOverviewParams,
): Promise<GetPayrollTaxOverviewResponse> => {
  const response = await api.get<GetPayrollTaxOverviewResponse>(
    "/payroll/tax/overview",
    { params },
  );
  return response.data;
};

export const getPayrollTaxEmployeesByState = async (
  params?: GetPayrollTaxEmployeesByStateParams,
): Promise<GetPayrollTaxEmployeesByStateResponse> => {
  const response = await api.get<GetPayrollTaxEmployeesByStateResponse>(
    "/payroll/tax/employees-by-state",
    { params },
  );
  return response.data;
};

export const getPayrollTaxRemittances = async (
  params?: GetPayrollTaxRemittancesParams,
): Promise<GetPayrollTaxRemittancesResponse> => {
  const response = await api.get<GetPayrollTaxRemittancesResponse>(
    "/payroll/tax/remittances",
    { params },
  );
  return response.data;
};

export const getPayrollTaxRemittanceReceipt = async (
  remittanceId: string | number,
): Promise<Blob> => {
  const response = await api.get(
    `/payroll/tax/remittances/${encodeURIComponent(remittanceId)}/receipt`,
    {
      responseType: "blob",
      headers: {
        Accept: "text/plain, */*",
      },
    },
  );
  return response.data;
};

/**
 * Get PAYE annual-return/YTD rows
 * 200: Snapshot-backed annual rows
 */
export const getPayrollTaxAnnualReturns = async (
  params?: GetPayrollTaxAnnualReturnsParams,
): Promise<GetPayrollTaxAnnualReturnsResponse> => {
  const response = await api.get<GetPayrollTaxAnnualReturnsResponse>(
    "/payroll/tax/annual-returns",
    { params },
  );
  return response.data;
};

/**
 * Export PAYE annual-return rows
 * 200: CSV (text/csv)
 */
export const exportPayrollTaxAnnualReturnsCsv = async (
  params?: ExportPayrollTaxAnnualReturnsParams,
): Promise<Blob> => {
  const response = await api.get("/payroll/tax/annual-returns/export", {
    params,
    responseType: "blob",
    headers: {
      Accept: "text/csv, */*",
    },
  });
  return response.data;
};

export const exportPayrollTaxAnnualReturns = exportPayrollTaxAnnualReturnsCsv;

/**
 * Get the PAYE configuration used by Payroll
 * Returns tenant-configured bands/CRA/contribution metadata or an explicit NOT_CONFIGURED state; no Figma rates are hardcoded.
 */
export const getPayrollTaxConfig = async (): Promise<GetPayrollTaxConfigResponse> => {
  const response = await api.get<GetPayrollTaxConfigResponse>(
    "/payroll/tax/config",
  );
  return response.data;
};
