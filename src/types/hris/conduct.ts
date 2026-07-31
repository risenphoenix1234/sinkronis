export type QueryStatus =
  | "Open"
  | "In Progress"
  | "Resolved";

export interface QueryNote {
  id: string;
  author: string;
  message: string;
  date: string;
  type?: "query" | "response";
}

export interface EmployeeQuery {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  email: string;
  department: string;
  queryType: string;
  date: string;
  status: QueryStatus;
  history: string[];
  notes: QueryNote[];
}
export type Suspension = {
  id: string;
  name: string;
  role: string;
  department: string;
  type: string;
  from: string;
  to: string;
  status: "Open" | "In Progress" | "Resolved";
};