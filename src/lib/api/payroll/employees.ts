import api from "@/lib/api/axios";
import type {
  AddEmployeeDeductionBody,
  AddEmployeeDeductionResponse,
  BulkUploadEmployeesResponse,
  CreateEmployeeLoanBody,
  CreateEmployeeLoanResponse,
  CreatePayrollEmployeeBody,
  CreatePayrollEmployeeResponse,
  DeleteEmployeeDeductionResponse,
  EnrollPayrollEmployeeResponse,
  ExportPayrollEmployeesParams,
  GetEmployeeBikResponse,
  GetEmployeePayrollHistoryParams,
  GetEmployeePayrollHistoryResponse,
  GetPayrollEmployeeOverviewResponse,
  GetPayrollEmployeesParams,
  GetPayrollEmployeesResponse,
  RemovePayrollEmployeeEnrollmentResponse,
  UpdateEmployeeBikBody,
  UpdateEmployeeBikResponse,
  UpdateSalaryStructureBody,
  UpdateSalaryStructureResponse,
  UpdateStatutoryProfileBody,
  UpdateStatutoryProfileResponse,
} from "@/lib/api/types/payrollTypes";

export const getPayrollEmployees = async (
  params?: GetPayrollEmployeesParams,
): Promise<GetPayrollEmployeesResponse> => {
  const response = await api.get<GetPayrollEmployeesResponse>(
    "/payroll/employees",
    { params },
  );
  return response.data;
};

export const createPayrollEmployee = async (
  body: CreatePayrollEmployeeBody,
): Promise<CreatePayrollEmployeeResponse> => {
  const response = await api.post<CreatePayrollEmployeeResponse>(
    "/payroll/employees",
    body,
    { timeout: 60000 },
  );
  return response.data;
};

export const exportPayrollEmployeesCsv = async (
  params?: ExportPayrollEmployeesParams,
): Promise<Blob> => {
  const response = await api.get("/payroll/employees/export", {
    params,
    responseType: "blob",
    headers: {
      Accept: "text/csv",
    },
  });
  return response.data;
};

export const exportPayrollEmployees = exportPayrollEmployeesCsv;

export const getPayrollEmployeeBulkTemplate = async (): Promise<Blob> => {
  const response = await api.get("/payroll/employees/bulk-template", {
    responseType: "blob",
    headers: {
      Accept: "text/csv",
    },
  });
  return response.data;
};

export const downloadPayrollEmployeeBulkTemplate =
  getPayrollEmployeeBulkTemplate;

export const bulkUploadPayrollEmployees = async (
  file: File,
): Promise<BulkUploadEmployeesResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<BulkUploadEmployeesResponse>(
    "/payroll/employees/bulk-upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const getPayrollEmployeeOverview = async (
  employeeId: string,
): Promise<GetPayrollEmployeeOverviewResponse> => {
  const response = await api.get<GetPayrollEmployeeOverviewResponse>(
    `/payroll/employees/${employeeId}`,
  );
  return response.data;
};

export const getPayrollEmployee = getPayrollEmployeeOverview;
export const getPayrollEmployeeDetail = getPayrollEmployeeOverview;

export const enrollPayrollEmployee = async (
  employeeId: string,
): Promise<EnrollPayrollEmployeeResponse> => {
  const response = await api.post<EnrollPayrollEmployeeResponse>(
    `/payroll/employees/${employeeId}/enroll`,
  );
  return response.data;
};

export const removePayrollEmployeeEnrollment = async (
  employeeId: string,
): Promise<RemovePayrollEmployeeEnrollmentResponse> => {
  const response = await api.delete<RemovePayrollEmployeeEnrollmentResponse>(
    `/payroll/employees/${employeeId}/enrollment`,
  );
  return response.data;
};

export const updatePayrollEmployeeSalaryStructure = async (
  employeeId: string,
  body: UpdateSalaryStructureBody,
): Promise<UpdateSalaryStructureResponse> => {
  const response = await api.put<UpdateSalaryStructureResponse>(
    `/payroll/employees/${employeeId}/salary-structure`,
    body,
  );
  return response.data;
};

export const updatePayrollEmployeeStatutoryProfile = async (
  employeeId: string,
  body: UpdateStatutoryProfileBody,
): Promise<UpdateStatutoryProfileResponse> => {
  const response = await api.put<UpdateStatutoryProfileResponse>(
    `/payroll/employees/${employeeId}/statutory-profile`,
    body,
  );
  return response.data;
};

export const updateStatutoryProfile = updatePayrollEmployeeStatutoryProfile;

export const addPayrollEmployeeDeduction = async (
  employeeId: string,
  body: AddEmployeeDeductionBody,
): Promise<AddEmployeeDeductionResponse> => {
  try {
    const response = await api.post<AddEmployeeDeductionResponse>(
      `/payroll/employees/${employeeId}/deductions`,
      body,
    );
    return response.data;
  } catch (err: unknown) {
    const axiosErr = err as {
      response?: { data?: { message?: string; errorCode?: string } };
    };
    // If voluntary deduction type needs to be configured first, auto-provision and retry
    if (
      body.name &&
      axiosErr.response?.data?.message?.includes(
        "active voluntary deduction type",
      )
    ) {
      try {
        const typeRes = await api.post<{
          success: boolean;
          data: { id: string };
        }>("/payroll/settings/deduction-types", { name: body.name });
        const deductionTypeId = typeRes.data?.data?.id;
        if (deductionTypeId) {
          const retryRes = await api.post<AddEmployeeDeductionResponse>(
            `/payroll/employees/${employeeId}/deductions`,
            { ...body, deductionTypeId },
          );
          return retryRes.data;
        }
      } catch {
        throw err;
      }
    }
    throw err;
  }
};

export const createPayrollEmployeeDeduction = addPayrollEmployeeDeduction;

export const deletePayrollEmployeeDeduction = async (
  employeeId: string,
  deductionId: string,
): Promise<DeleteEmployeeDeductionResponse> => {
  const response = await api.delete<DeleteEmployeeDeductionResponse>(
    `/payroll/employees/${employeeId}/deductions/${deductionId}`,
  );
  return response.data;
};

export const deactivatePayrollEmployeeDeduction =
  deletePayrollEmployeeDeduction;

export const createPayrollEmployeeLoan = async (
  employeeId: string,
  body: CreateEmployeeLoanBody,
): Promise<CreateEmployeeLoanResponse> => {
  const response = await api.post<CreateEmployeeLoanResponse>(
    `/payroll/employees/${employeeId}/loans`,
    body,
  );
  return response.data;
};

export const addPayrollEmployeeLoan = createPayrollEmployeeLoan;

export const getPayrollEmployeeBik = async (
  employeeId: string,
): Promise<GetEmployeeBikResponse> => {
  const response = await api.get<GetEmployeeBikResponse>(
    `/payroll/employees/${employeeId}/bik`,
  );
  return response.data;
};

export const getEmployeeBik = getPayrollEmployeeBik;

export const updatePayrollEmployeeBik = async (
  employeeId: string,
  body: UpdateEmployeeBikBody,
): Promise<UpdateEmployeeBikResponse> => {
  const payload = {
    hmoHealthInsurance: Number(body.hmoHealthInsurance) || 0,
    airtimeAllowance: Number(body.airtimeAllowance) || 0,
    mealAllowance: Number(body.mealAllowance) || 0,
    thirteenthMonthAnnual: Number(body.thirteenthMonthAnnual) || 0,
  };
  const response = await api.put<UpdateEmployeeBikResponse>(
    `/payroll/employees/${encodeURIComponent(employeeId)}/bik`,
    payload,
  );
  return response.data;
};

export const saveEmployeeBik = updatePayrollEmployeeBik;

export const getPayrollEmployeeHistory = async (
  employeeId: string,
  params?: GetEmployeePayrollHistoryParams,
): Promise<GetEmployeePayrollHistoryResponse> => {
  const response = await api.get<GetEmployeePayrollHistoryResponse>(
    `/payroll/employees/${employeeId}/payroll-history`,
    { params },
  );
  return response.data;
};

export const getEmployeePayrollHistory = getPayrollEmployeeHistory;

export const exportPayrollEmployeeHistoryCsv = async (
  employeeId: string,
): Promise<Blob> => {
  const response = await api.get(
    `/payroll/employees/${employeeId}/payroll-history/export`,
    {
      responseType: "blob",
      headers: {
        Accept: "text/csv",
      },
    },
  );
  return response.data;
};

export const exportPayrollEmployeeHistory = exportPayrollEmployeeHistoryCsv;
