import api from "@/lib/api/axios";
import type {
  FundPayrollWalletBody,
  FundPayrollWalletResponse,
  GetPayrollWalletObligationsParams,
  GetPayrollWalletObligationsResponse,
  GetPayrollWalletResponse,
  GetPayrollWalletTransactionResponse,
  GetPayrollWalletTransactionsParams,
  GetPayrollWalletTransactionsResponse,
  PayPayrollWalletObligationResponse,
} from "@/lib/api/types/payrollTypes";

export const getPayrollWallet = async (): Promise<GetPayrollWalletResponse> => {
  const response = await api.get<GetPayrollWalletResponse>("/payroll/wallet");
  return response.data;
};

export const fundPayrollWallet = async (
  body: FundPayrollWalletBody,
): Promise<FundPayrollWalletResponse> => {
  const response = await api.post<FundPayrollWalletResponse>(
    "/payroll/wallet/fund",
    body,
  );
  return response.data;
};

export const getPayrollWalletTransactions = async (
  params?: GetPayrollWalletTransactionsParams,
): Promise<GetPayrollWalletTransactionsResponse> => {
  const response = await api.get<GetPayrollWalletTransactionsResponse>(
    "/payroll/wallet/transactions",
    { params },
  );
  return response.data;
};

export const exportPayrollWalletTransactionsCsv = async (): Promise<Blob> => {
  const response = await api.get("/payroll/wallet/transactions/export", {
    responseType: "blob",
    headers: {
      Accept: "text/csv",
    },
  });
  return response.data;
};

export const exportPayrollWalletTransactions =
  exportPayrollWalletTransactionsCsv;

export const getPayrollWalletTransaction = async (
  transactionId: string,
): Promise<GetPayrollWalletTransactionResponse> => {
  const response = await api.get<GetPayrollWalletTransactionResponse>(
    `/payroll/wallet/transactions/${encodeURIComponent(transactionId)}`,
  );
  return response.data;
};

export const getPayrollWalletObligations = async (
  params?: GetPayrollWalletObligationsParams,
): Promise<GetPayrollWalletObligationsResponse> => {
  const response = await api.get<GetPayrollWalletObligationsResponse>(
    "/payroll/wallet/obligations",
    { params },
  );
  return response.data;
};

export const payPayrollWalletObligation = async (
  obligationId: string,
  body?: Record<string, unknown>,
): Promise<PayPayrollWalletObligationResponse> => {
  const response = await api.post<PayPayrollWalletObligationResponse>(
    `/payroll/wallet/obligations/${encodeURIComponent(obligationId)}/pay`,
    body,
  );
  return response.data;
};
