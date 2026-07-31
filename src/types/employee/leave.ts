type LeaveStatus = "Approved" | "Pending" | "Rejected";

export interface LeaveBalance {
  type: string;
  used: number;
  total: number;
  color: string;
  dotColor: string;
  barColor: string;
}

export interface LeaveRecord {
  type: string;
  start: string;
  end: string;
  days: number;
  status: LeaveStatus;
  comment: string;
}