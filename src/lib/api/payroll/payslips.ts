import api from "@/lib/api/axios";
import type {
  ExportPayslipsParams,
  GetPayslipsParams,
  GetPayslipsResponse,
  GetTenantPayslipDetailResponse,
  TenantPayslipDetail,
} from "@/lib/api/types/payrollTypes";

export const getTenantPayslipDetail = async (
  payslipId: string,
): Promise<TenantPayslipDetail> => {
  const response = await api.get<
    GetTenantPayslipDetailResponse | TenantPayslipDetail
  >(`/payroll/payslips/${payslipId}`);
  const payload = response.data;
  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    (payload as GetTenantPayslipDetailResponse).data
  ) {
    return (payload as GetTenantPayslipDetailResponse).data;
  }
  return payload as TenantPayslipDetail;
};

export const getTenantPayslip = getTenantPayslipDetail;
export const getPayslipById = getTenantPayslipDetail;

export const downloadTenantPayslipPdf = async (
  payslipId: string,
): Promise<Blob> => {
  const response = await api.get(`/payroll/payslips/${payslipId}/download`, {
    responseType: "blob",
    headers: {
      Accept: "application/pdf",
    },
  });
  return response.data;
};

export const downloadTenantPayslip = downloadTenantPayslipPdf;

export const getTenantPayslips = async (
  params?: GetPayslipsParams,
): Promise<GetPayslipsResponse> => {
  const response = await api.get<GetPayslipsResponse>("/payroll/payslips", {
    params,
  });
  return response.data;
};

export const getPayslips = getTenantPayslips;

export const exportTenantPayslipsCsv = async (
  params?: ExportPayslipsParams,
): Promise<Blob> => {
  const response = await api.get("/payroll/payslips/export", {
    params,
    responseType: "blob",
    headers: {
      Accept: "text/csv",
    },
  });
  return response.data;
};

export const exportPayslips = exportTenantPayslipsCsv;
