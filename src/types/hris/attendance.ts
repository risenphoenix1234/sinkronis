export type AttendanceStatus = "Attendance Log" | "Department Summary";

export type Attendance = {
  id: string;
  name: string;
  department: string;
  shift: string;
  ot: string;
  date: string;
  clockIn: string;
  clockOut: string;
  hours: string;
 status: "On Time" | "Late" | "On Leave" | "Absent";};

 // types/attendance.ts

export interface AttendanceRecord {
  id: string;
  employee: string;
  employeeCode: string;
  department: string;
  present: number;
  absent: number;
  leave: number;
  late: number;
  hours: number;
  overtime: string;
  rate: number;
}

export type DisputeStatus =
  | "Pending"
  | "Approved"
  | "Rejected";

export interface AttendanceDispute {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;

  issue: string;
  date: string;

  description: string;

  claimedClockIn?: string;
  claimedClockOut?: string;

  status: DisputeStatus;

  resolution?: string;

  createdAt: string;
}