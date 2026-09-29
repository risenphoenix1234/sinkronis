import api from "@/lib/api/axios";
import type {
  CreatePayrollAllowanceTypeBody,
  CreatePayrollAllowanceTypeResponse,
  DeletePayrollAllowanceTypeResponse,
  GetPayrollAllowanceTypesResponse,
  GetPayrollSettingsPayPeriodResponse,
  GetPayrollSettingsResponse,
  GetPayrollStatutoryRatesResponse,
  UpdatePayrollAllowanceTypeBody,
  UpdatePayrollAllowanceTypeResponse,
  UpdatePayrollSettingsPayPeriodBody,
  UpdatePayrollSettingsPayPeriodResponse,
} from "@/lib/api/types/payrollTypes";

/**
 * Get tenant statutory rates (PAYE bands, pension, NHF, NSITF, etc.).
 */
export const getPayrollStatutoryRates = async (): Promise<GetPayrollStatutoryRatesResponse> => {
  const response = await api.get<GetPayrollStatutoryRatesResponse>(
    "/payroll/settings/statutory-rates",
  );
  return response.data;
};

/**
 * Create a tenant allowance type.
 * Requires payroll:salary:update.
 */
export async function createPayrollAllowanceType(
  body: CreatePayrollAllowanceTypeBody,
): Promise<CreatePayrollAllowanceTypeResponse> {
  const response = await api.post<CreatePayrollAllowanceTypeResponse>(
    "/payroll/settings/allowance-types",
    body,
  );
  return response.data;
}

/**
 * List tenant allowance types.
 */
export async function getPayrollAllowanceTypes(): Promise<GetPayrollAllowanceTypesResponse> {
  const response = await api.get<GetPayrollAllowanceTypesResponse>(
    "/payroll/settings/allowance-types",
  );
  return response.data;
}

/**
 * Update a custom allowance type.
 * Requires payroll:salary:update.
 */
export async function updatePayrollAllowanceType(
  id: string,
  body: UpdatePayrollAllowanceTypeBody,
): Promise<UpdatePayrollAllowanceTypeResponse> {
  const response = await api.patch<UpdatePayrollAllowanceTypeResponse>(
    `/payroll/settings/allowance-types/${id}`,
    body,
  );
  return response.data;
}

/**
 * Deactivate a custom allowance type.
 * System types cannot be removed; custom definitions remain for history.
 */
export async function deletePayrollAllowanceType(
  id: string,
): Promise<DeletePayrollAllowanceTypeResponse> {
  const response = await api.delete<DeletePayrollAllowanceTypeResponse>(
    `/payroll/settings/allowance-types/${id}`,
  );
  return response.data;
}

/**
 * Get consolidated tenant Payroll settings.
 * Returns pay period, allowance types, deduction types, and statutory rates.
 * Requires payroll:statutory:view.
 */
export async function getPayrollSettings(): Promise<GetPayrollSettingsResponse> {
  const response = await api.get<GetPayrollSettingsResponse>(
    "/payroll/settings",
  );
  return response.data;
}

/**
 * Get pay-period settings.
 * Requires payroll:statutory:view.
 */
export async function getPayrollSettingsPayPeriod(): Promise<GetPayrollSettingsPayPeriodResponse> {
  const response = await api.get<GetPayrollSettingsPayPeriodResponse>(
    "/payroll/settings/pay-period",
  );
  return response.data;
}

/**
 * Update future pay-period settings.
 * Only MONTHLY is supported. Days 29-31 clamp to month end.
 * Requires payroll:statutory:update.
 */
export async function updatePayrollSettingsPayPeriod(
  body: UpdatePayrollSettingsPayPeriodBody,
): Promise<UpdatePayrollSettingsPayPeriodResponse> {
  const response = await api.put<UpdatePayrollSettingsPayPeriodResponse>(
    "/payroll/settings/pay-period",
    body,
  );
  return response.data;
}
