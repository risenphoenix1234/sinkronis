import api from "@/lib/api/axios";
import type {
  CreatePayeeBody,
  CreatePayeeResponse,
  DeletePayeeResponse,
  DeletePayeeResponseData,
  ExportPayeesParams,
  GetPayeeDetailResponse,
  GetPayeeDocumentsResponse,
  GetPayeePaymentHistoryParams,
  GetPayeePaymentHistoryResponse,
  GetPayeesParams,
  GetPayeesResponse,
  PayeeDetail,
  PayeeDocumentItem,
  UpdatePayeeBody,
  UpdatePayeeResponse,
  UploadPayeeDocumentBody,
  UploadPayeeDocumentData,
  UploadPayeeDocumentResponse,
} from "@/lib/api/types/payrollTypes";

export const getPayees = async (
  params?: GetPayeesParams,
): Promise<GetPayeesResponse> => {
  const response = await api.get<GetPayeesResponse>("/payroll/payees", {
    params,
  });
  return response.data;
};

export const createPayee = async (
  body: CreatePayeeBody,
): Promise<CreatePayeeResponse> => {
  const response = await api.post<CreatePayeeResponse>("/payroll/payees", body);
  return response.data;
};

export const exportPayeesCsv = async (
  params?: ExportPayeesParams,
): Promise<Blob> => {
  const response = await api.get("/payroll/payees/export", {
    params,
    responseType: "blob",
    headers: {
      Accept: "text/csv",
    },
  });
  return response.data;
};

export const exportPayees = exportPayeesCsv;

export const getPayeeDetail = async (payeeId: string): Promise<PayeeDetail> => {
  const response = await api.get<GetPayeeDetailResponse>(
    `/payroll/payees/${payeeId}`,
  );
  return response.data.data;
};

export const updatePayee = async (
  payeeId: string,
  body: UpdatePayeeBody,
): Promise<PayeeDetail> => {
  const response = await api.patch<UpdatePayeeResponse>(
    `/payroll/payees/${payeeId}`,
    body,
  );
  return response.data.data;
};

export const deletePayee = async (
  payeeId: string,
): Promise<DeletePayeeResponseData> => {
  const response = await api.delete<DeletePayeeResponse>(
    `/payroll/payees/${payeeId}`,
  );
  return response.data.data;
};

export const getPayeePaymentHistory = async (
  payeeId: string,
  params?: GetPayeePaymentHistoryParams,
): Promise<GetPayeePaymentHistoryResponse> => {
  const response = await api.get<GetPayeePaymentHistoryResponse>(
    `/payroll/payees/${payeeId}/payment-history`,
    { params },
  );
  return response.data;
};

export const exportPayeePaymentHistoryCsv = async (
  payeeId: string,
): Promise<Blob> => {
  const response = await api.get(
    `/payroll/payees/${payeeId}/payment-history/export`,
    {
      responseType: "blob",
      headers: {
        Accept: "text/csv",
      },
    },
  );
  return response.data;
};

export const exportPayeePaymentHistory = exportPayeePaymentHistoryCsv;

export const getPayeeDocuments = async (
  payeeId: string,
): Promise<PayeeDocumentItem[]> => {
  const response = await api.get<GetPayeeDocumentsResponse>(
    `/payroll/payees/${payeeId}/documents`,
  );
  return response.data.data;
};

export const uploadPayeeDocument = async (
  payeeId: string,
  body: UploadPayeeDocumentBody | FormData,
): Promise<UploadPayeeDocumentData> => {
  let formData: FormData;
  if (body instanceof FormData) {
    formData = body;
  } else {
    formData = new FormData();
    formData.append("documentName", body.documentName);
    formData.append("file", body.file);
  }

  const response = await api.post<UploadPayeeDocumentResponse>(
    `/payroll/payees/${payeeId}/documents`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data.data;
};

export const downloadPayeeDocument = async (
  payeeId: string,
  documentId: string,
): Promise<Blob> => {
  const response = await api.get(
    `/payroll/payees/${payeeId}/documents/${documentId}/download`,
    {
      responseType: "blob",
      headers: {
        Accept: "application/octet-stream",
      },
    },
  );
  return response.data;
};
