export type AttendanceStatus = "Present" | "Late" | "Absent" | "Weekend";

export interface AttendanceRecord {
  date: string;
  clockIn: string;
  clockOut: string;
  hoursWorked: string;
  status: "Present" | "Late" | "Absent";
}

export interface CalendarDay {
  day: number;
  status?: AttendanceStatus;
  isWeekend?: boolean;
}

export interface AttendanceSummary {
  present: number;
  late: number;
  absent: number;
  workingDays: number;
}

export type {
  AttendanceCalendarData,
  AttendanceCalendarDayItem,
  AttendanceDispute,
  AttendanceItemStatus,
  AttendanceLogItem,
  AttendanceShift,
  AttendanceSummaryData,
  AttendanceTodayData,
  ClockState,
  DayType,
  EmployeeAttendanceData,
  EmployeeAttendanceResponse,
  GetEmployeeAttendanceParams,
} from "@/lib/api/types/employeeTypes";
