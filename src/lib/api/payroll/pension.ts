import api from "@/lib/api/axios";
import type {
  AdvancePayrollPfaTransferBody,
  AdvancePayrollPfaTransferResponse,
  CreatePayrollAvcBody,
  CreatePayrollAvcResponse,
  GetPayrollAvcParams,
  GetPayrollAvcResponse,
  GetPayrollPensionContributionsParams,
  GetPayrollPensionContributionsResponse,
  GetPayrollPensionOverviewParams,
  GetPayrollPensionOverviewResponse,
  GetPayrollPensionPfasResponse,
  GetPayrollPensionRemittanceResponse,
  GetPayrollPensionRemittancesParams,
  GetPayrollPensionRemittancesResponse,
  GetPayrollPfaTransferDetailResponse,
  GetPayrollPfaTransfersParams,
  GetPayrollPfaTransfersResponse,
  InitiatePayrollPfaTransferBody,
  InitiatePayrollPfaTransferResponse,
  MarkPayrollPensionRemittedBody,
  MarkPayrollPensionRemittedResponse,
  PausePayrollAvcResponse,
  RemitPayrollPensionPayload,
  RemitPayrollPensionResponse,
  ResumePayrollAvcResponse,
} from "@/lib/api/types/payrollTypes";

function normalizePeriodParam(period?: string): string | undefined {
  if (!period) return undefined;
  if (/^\d{4}-\d{2}$/.test(period)) return period;
  const d = new Date(period);
  if (!isNaN(d.getTime())) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
  }
  return period;
}

/**
 * Fetch snapshot-backed Pension overview.
 * Accepts optional query param `period` (e.g. "September 2026" or "2026-09").
 */
export async function getPayrollPensionOverview(
  params?: GetPayrollPensionOverviewParams,
): Promise<GetPayrollPensionOverviewResponse> {
  const queryParams = params?.period
    ? { ...params, period: normalizePeriodParam(params.period) }
    : params;
  const response = await api.get<GetPayrollPensionOverviewResponse>(
    "/payroll/pension/overview",
    { params: queryParams },
  );
  return response.data;
}

/**
 * List historical employee Pension snapshots.
 * Uses finalized Payslip snapshots; current salary/PFA changes do not rewrite history.
 */
export async function getPayrollPensionContributions(
  params?: GetPayrollPensionContributionsParams,
): Promise<GetPayrollPensionContributionsResponse> {
  const queryParams = params?.period
    ? { ...params, period: normalizePeriodParam(params.period) }
    : params;
  const response = await api.get<GetPayrollPensionContributionsResponse>(
    "/payroll/pension/contributions",
    { params: queryParams },
  );
  return response.data;
}

/**
 * List PFAs represented by tenant pension profiles.
 * Dynamic PFA lookup.
 */
export async function getPayrollPensionPfas(): Promise<GetPayrollPensionPfasResponse> {
  const response = await api.get<GetPayrollPensionPfasResponse>(
    "/payroll/pension/pfas",
  );
  return response.data;
}

/**
 * List immutable PFA-grouped remittance obligations.
 * Accepts optional query parameters (period, status, page, limit).
 */
export async function getPayrollPensionRemittances(
  params?: GetPayrollPensionRemittancesParams,
): Promise<GetPayrollPensionRemittancesResponse> {
  const queryParams = params?.period
    ? { ...params, period: normalizePeriodParam(params.period) }
    : params;
  const response = await api.get<GetPayrollPensionRemittancesResponse>(
    "/payroll/pension/remittances",
    { params: queryParams },
  );
  return response.data;
}

/**
 * Get a single tenant Pension remittance obligation by ID.
 * Returns detailed remittance snapshot and audited status.
 */
export async function getPayrollPensionRemittance(
  id: string | number,
): Promise<GetPayrollPensionRemittanceResponse> {
  const response = await api.get<GetPayrollPensionRemittanceResponse>(
    `/payroll/pension/remittances/${encodeURIComponent(id)}`,
  );
  return response.data;
}

/**
 * Pay Pension remittance from Payroll Wallet / Record external Pension remittance.
 * Uses the authoritative amount and an atomic source-idempotent wallet debit.
 * If paymentReference and remittedAt are not specified, default audited values
 * are provided to satisfy backend schema validation.
 */
export async function remitPayrollPension(
  id: string | number,
  payload?: RemitPayrollPensionPayload,
): Promise<RemitPayrollPensionResponse> {
  const body: RemitPayrollPensionPayload = {
    paymentReference: payload?.paymentReference ?? `REF-${Date.now()}`,
    remittedAt: payload?.remittedAt ?? new Date().toISOString().split("T")[0],
    ...(payload?.receiptReference ? { receiptReference: payload.receiptReference } : {}),
  };
  const response = await api.post<RemitPayrollPensionResponse>(
    `/payroll/pension/remittances/${encodeURIComponent(id)}/remit`,
    body,
  );
  return response.data;
}

/**
 * Record externally-paid Pension remittance.
 * Audits external payment reference and date.
 */
export async function markPayrollPensionRemitted(
  id: string | number,
  body?: Partial<MarkPayrollPensionRemittedBody>,
): Promise<MarkPayrollPensionRemittedResponse> {
  const payload: MarkPayrollPensionRemittedBody = {
    paymentReference: body?.paymentReference ?? `REF-${Date.now()}`,
    remittedAt: body?.remittedAt ?? new Date().toISOString().split("T")[0],
    ...(body?.receiptReference ? { receiptReference: body.receiptReference } : {}),
  };
  const response = await api.post<MarkPayrollPensionRemittedResponse>(
    `/payroll/pension/remittances/${encodeURIComponent(id)}/mark-remitted`,
    payload,
  );
  return response.data;
}

/**
 * List tenant AVC records (Voluntary Pension Contributions).
 * Supports optional pagination parameters.
 */
export async function getPayrollAvc(
  params?: GetPayrollAvcParams,
): Promise<GetPayrollAvcResponse> {
  const response = await api.get<GetPayrollAvcResponse>(
    "/payroll/pension/avc",
    { params },
  );
  return response.data;
}

/**
 * Create an effective-dated AVC record.
 */
export async function createPayrollAvc(
  body: CreatePayrollAvcBody,
): Promise<CreatePayrollAvcResponse> {
  const response = await api.post<CreatePayrollAvcResponse>(
    "/payroll/pension/avc",
    body,
  );
  return response.data;
}

/**
 * Pause future AVC application.
 */
export async function pausePayrollAvc(
  id: string | number,
): Promise<PausePayrollAvcResponse> {
  const response = await api.post<PausePayrollAvcResponse>(
    `/payroll/pension/avc/${encodeURIComponent(id)}/pause`,
  );
  return response.data;
}

/**
 * Resume future AVC application.
 */
export async function resumePayrollAvc(
  id: string | number,
): Promise<ResumePayrollAvcResponse> {
  const response = await api.post<ResumePayrollAvcResponse>(
    `/payroll/pension/avc/${encodeURIComponent(id)}/resume`,
  );
  return response.data;
}

/**
 * List PFA transfer history.
 */
export async function getPayrollPfaTransfers(
  params?: GetPayrollPfaTransfersParams,
): Promise<GetPayrollPfaTransfersResponse> {
  const response = await api.get<GetPayrollPfaTransfersResponse>(
    "/payroll/pension/pfa-transfers",
    { params },
  );
  return response.data;
}

/**
 * Get PFA transfer detail by ID.
 */
export async function getPayrollPfaTransfer(
  id: string | number,
): Promise<GetPayrollPfaTransferDetailResponse> {
  const response = await api.get<GetPayrollPfaTransferDetailResponse>(
    `/payroll/pension/pfa-transfers/${encodeURIComponent(id)}`,
  );
  return response.data;
}

/**
 * Initiate PFA transfer without changing current PFA.
 */
export async function initiatePayrollPfaTransfer(
  body: InitiatePayrollPfaTransferBody,
): Promise<InitiatePayrollPfaTransferResponse> {
  const response = await api.post<InitiatePayrollPfaTransferResponse>(
    "/payroll/pension/pfa-transfers",
    body,
  );
  return response.data;
}

/**
 * Advance the validated PFA transfer lifecycle.
 * The employee profile is updated only when the transfer reaches COMPLETED.
 */
export async function advancePayrollPfaTransfer(
  id: string | number,
  body: AdvancePayrollPfaTransferBody,
): Promise<AdvancePayrollPfaTransferResponse> {
  const response = await api.post<AdvancePayrollPfaTransferResponse>(
    `/payroll/pension/pfa-transfers/${encodeURIComponent(id)}/advance`,
    body,
  );
  return response.data;
}

/**
 * Export general Pension contribution data as CSV.
 * 200: text/csv
 */
export const exportPayrollPensionCsv = async (): Promise<Blob> => {
  const response = await api.get("/payroll/pension/export", {
    responseType: "blob",
    headers: {
      Accept: "text/csv",
    },
  });
  return response.data;
};
