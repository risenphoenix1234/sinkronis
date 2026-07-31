export type AttendanceStatus = "Present" | "Late" | "Absent";

export interface AttendanceRecord {
  date: string;
  clockIn: string;
  clockOut: string;
  hoursWorked: string;
  status: AttendanceStatus;
}

export interface CalendarDay {
  day: number;
  status?: AttendanceStatus;
}

export interface SummaryCard {
  title: string;
  value: number;
  status: AttendanceStatus | "Working";
}