import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { CreateEmployeePayload, Department, Employee, EmployeeProfile } from "@/types/hris";

export const getEmployees = async () => {
  const res = await api.get<ApiResponse<Employee[]>>("/hris/employees");
  return res.data;
};

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

export const deleteEmployee = async (id: string) => {
  const res = await api.delete<ApiResponse<null>>(`/hris/employees/${id}`);
  return res.data;
};

// Departments are referenced by createEmployee (departmentId is tenant-validated),
// so we need a way to list them for the create form's dropdown.
export const getDepartments = async () => {
  const res = await api.get<ApiResponse<Department[]>>("/hris/departments");
  return res.data;
};
