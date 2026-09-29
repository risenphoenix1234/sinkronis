import api from "@/lib/api/axios";
import type {
  ApprovePayRunResponse,
  CreatePayRunBody,
  CreatePayRunResponse,
  CreatedPayRunData,
  GetPayRunDetailParams,
  GetPayRunDetailResponse,
  GetPayRunEligibilityParams,
  GetPayRunEligibilityResponse,
  GetPayRunsParams,
  GetPayRunsResponse,
  PayRunDetail,
  PayRunEligibilityData,
  PayRunListItem,
} from "@/lib/api/types/payrollTypes";

export const getPayRunEligibility = async (
  params: GetPayRunEligibilityParams,
): Promise<PayRunEligibilityData> => {
  const response = await api.get<GetPayRunEligibilityResponse>(
    "/payroll/pay-runs/eligibility",
    { params },
  );
  return response.data.data;
};

export const getPayRuns = async (
  params?: GetPayRunsParams,
): Promise<{
  data: PayRunListItem[];
  pagination: GetPayRunsResponse["pagination"];
}> => {
  const response = await api.get<GetPayRunsResponse>("/payroll/pay-runs", {
    params,
  });
  return {
    data: response.data.data,
    pagination: response.data.pagination,
  };
};

export const createPayRun = async (
  body: CreatePayRunBody,
): Promise<CreatedPayRunData> => {
  const response = await api.post<CreatePayRunResponse>(
    "/payroll/pay-runs",
    body,
  );
  return response.data.data;
};

export const getPayRunDetail = async (
  payRunId: string,
  params?: GetPayRunDetailParams,
): Promise<{
  data: PayRunDetail;
  pagination: GetPayRunDetailResponse["pagination"];
}> => {
  const response = await api.get<GetPayRunDetailResponse>(
    `/payroll/pay-runs/${payRunId}`,
    { params },
  );
  return {
    data: response.data.data,
    pagination: response.data.pagination,
  };
};

export const approvePayRun = async (
  payRunId: string,
): Promise<ApprovePayRunResponse> => {
  const response = await api.post<ApprovePayRunResponse>(
    `/payroll/pay-runs/${payRunId}/approve`,
  );
  return response.data;
};

export const exportPayRunCsv = async (payRunId: string): Promise<Blob> => {
  const response = await api.get(`/payroll/pay-runs/${payRunId}/export`, {
    responseType: "blob",
    headers: {
      Accept: "text/csv",
    },
  });
  return response.data;
};

export const exportPayRun = exportPayRunCsv;
