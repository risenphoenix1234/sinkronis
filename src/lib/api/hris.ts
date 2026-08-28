import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { CreateEmployeePayload, Employee, EmployeeProfile } from "@/types/hris";

// Confirmed against Swagger: GET /hris/employees ("List authenticated tenant employees")
// Response item shape is still a best guess (Employee) — Swagger's collapsed
// list view didn't show the body. If the list page renders wrong/missing
// fields once live, expand this endpoint in Swagger and fix the Employee type.
export const getEmployees = async () => {
  const res = await api.get<ApiResponse<Employee[]>>("/hris/employees");
  return res.data;
};

// Confirmed against Swagger: GET /hris/employees/{employeeId}
// Returns a full profile object (header + sensitive, permission-filtered sections),
// not the flat Employee shape used for list rows / create / update.
export const getEmployee = async (id: string) => {
  const res = await api.get<ApiResponse<EmployeeProfile>>(`/hris/employees/${id}`);
  return res.data;
};

export const createEmployee = async (payload: CreateEmployeePayload) => {
  const res = await api.post<ApiResponse<Employee>>("/hris/employees", payload);
  return res.data;
};

export const updateEmployee = async (id: string, payload: Partial<CreateEmployeePayload>) => {
  const res = await api.patch<ApiResponse<Employee>>(`/hris/employees/${id}`, payload);
  return res.data;
};

// ⚠️ UNCONFIRMED: no DELETE /hris/employees/{employeeId} appeared in the
// full endpoint list from Swagger. It may not exist — status changes might
// be the intended way to deactivate/terminate someone instead (see
// PATCH /hris/employees/{employeeId}/status). Don't wire this to UI yet.
export const deleteEmployee = async (id: string) => {
  const res = await api.delete<ApiResponse<null>>(`/hris/employees/${id}`);
  return res.data;
};

// Dedicated status-change endpoint, confirmed in Swagger:
// PATCH /hris/employees/{employeeId}/status
export const setEmployeeStatus = async (
  id: string,
  payload: { lifecycleStatus?: string; operationalStatus?: string }
) => {
  const res = await api.patch<ApiResponse<Employee>>(`/hris/employees/${id}/status`, payload);
  return res.data;
};

// NOTE: There is no /hris/departments endpoint in Swagger — getDepartments()
// was removed. The create/edit form now takes departmentId as plain text
// until we find where department IDs actually come from (maybe seeded,
// maybe another module's endpoint).
