// types/leave.ts

export interface LeaveHistory {
  leaveType: string;
  from: string;
  to: string;
  remainingLeave: string;
  status: "Pending" | "Approved" | "Rejected";
}