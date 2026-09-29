export type QueryStatus = "Open" | "In Progress" | "Resolved";
export type Tab = "Query" | "Suspension";
export type Status = "Resolved" | "Pending" | "Open" | "In Progress";

export type AnyEmployee = QueryEmployee | SuspensionEmployee;

export interface QueryItem {
  employeeId: string;
  name: string;
  queryType: string;
  status: QueryStatus;
}

export const statusStyles: Record<QueryStatus, string> = {
  Open: "text-red-500",
  "In Progress": "text-amber-500",
  Resolved: "text-green-500",
};

export interface SuspensionRecord {
  employeeId: string;
  name: string;
  role: string;
  department: string;
  suspensionType: string;
  from: string;
}

export interface EmployeeDetails {
  employeeId: string;
  name: string;
  role: string;
  email: string;
  department: string;
  suspensionType: string;
  from: string;
  to: string;
}
export interface Suspension {
  employeeId: string;
  name: string;
  role: string;
  department: string;
  suspensionType: string;
  from: string;
  to: string;
  status: "Open" | "In Progress" | "Resolved";
}

type HistoryItem = { label: string; date: string };
type Note = { author: string; timestamp: string; tag: string; body: string };

export interface BaseEmployee {
  id: string;
  name: string;
  avatar: string;
  role: string;
  department: string;
  email: string;
  status: Status;
  queryHistory: HistoryItem[];
  notes: Note[];
}

export interface QueryEmployee extends BaseEmployee {
  type: "Query";
  queryType: string;
  date: string;
}

export interface SuspensionEmployee extends BaseEmployee {
  type: "Suspension";
  suspensionType: string;
  from: string;
  to: string;
}
