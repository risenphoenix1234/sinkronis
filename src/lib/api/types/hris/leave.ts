export type LeaveStatus = "Pending" | "Approved" | "Rejected";

export interface LeaveRequest {
  id: number;
  employee: string;
  department: string;
  leaveType: string;
  from: string;
  to: string;
  days: string;
  status: LeaveStatus;
}
