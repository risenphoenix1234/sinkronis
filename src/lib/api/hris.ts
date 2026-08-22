import api from "@/lib/axios";

export interface CreateEmployeePayload {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  departmentId: string;
  position: string;
  joinedDate: string; // ISO date string
  lifecycleStatus: "PROBATION" | "ACTIVE" | "TERMINATED" | string;
  operationalStatus: "ACTIVE" | "INACTIVE" | string;
  workMode: "ONSITE" | "REMOTE" | "HYBRID" | string;
  monthlySalary: number;
}

export const createEmployee = async (payload: CreateEmployeePayload) => {
  const res = await api.post("/hris/employees", payload);
  return res.data;
};
