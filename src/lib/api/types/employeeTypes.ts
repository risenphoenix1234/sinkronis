export interface NamedRef {
  id: string;
  name: string;
}

export interface DashboardEmployee {
  id: string;
  employeeId: string;
  firstName: string;
  fullName: string;
  role: NamedRef;
  department: NamedRef;
  branch: NamedRef;
}

export type AttendanceStatus = "NOT_CLOCKED_IN" | "CLOCKED_IN" | "CLOCKED_OUT";

export interface AttendanceToday {
  status: AttendanceStatus;
  clockInAt: string | null;
  clockOutAt: string | null;
  workedMinutes: number;
  canClockIn: boolean;
  canClockOut: boolean;
  shift: {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
  } | null;
}

export interface DashboardSummary {
  annualLeaveRemaining: {
    leaveType: string;
    remainingDays: number;
    usedDays: number;
    totalDays: number;
  };
  nextPayday: {
    date: string;
    period: string;
  };
  attendanceThisMonth: {
    presentDays: number;
    expectedWorkingDays: number;
    attendanceRate: number;
  };
}

// Match these to whatever your backend actually sends for `status`.
export type ActionItemStatus = "Action Required" | "Approved" | "Upcoming";

export interface ActionItem {
  id: string;
  type: string;
  title: string;
  description: string;
  status: ActionItemStatus;
  dueDate: string;
  sourceModule: string;
  sourceRecordId: string;
  actionRequired: boolean;
  createdAt: string;
}

export interface RecentPayslip {
  id: string;
  period: string;
  grossPay: number;
  totalDeductions: number;
  netPay: number;
  currency: string;
  status: string;
  availableForDownload: boolean;
}

export interface DashboardData {
  currentDate: string;
  timeZone: string;
  employee: DashboardEmployee;
  attendanceToday: AttendanceToday;
  summary: DashboardSummary;
  actionItems: ActionItem[];
  recentPayslip: RecentPayslip | null;
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}
