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

// ==========================================
// Employee Inbox Swagger Types
// ==========================================

export interface InboxItem {
  id: string;
  type: string;
  title: string;
  summary: string;
  body?: string;
  isRead: boolean;
  actionRequired: boolean;
  actionUrl?: string | null;
  createdAt: string;
  category?: string;
}

export interface EmployeeInboxData {
  unreadCount: number;
  items: InboxItem[];
}

export interface EmployeeInboxResponse {
  success: boolean;
  message: string;
  data: EmployeeInboxData;
}

export interface GetEmployeeInboxParams {
  filter?: "ALL" | "UNREAD" | "ACTION_REQUIRED";
  page?: number;
  limit?: number;
}

// ==========================================
// Employee Attendance Swagger Types
// ==========================================

export interface AttendanceSummary {
  presentDays: number;
  lateDays: number;
  absentDays: number;
  totalWorkingDays: number;
  attendanceRate: number;
}

export interface AttendanceLogItem {
  id: string;
  date: string;
  clockIn: string | null;
  clockOut: string | null;
  status: "PRESENT" | "LATE" | "ABSENT" | "ON_LEAVE" | "HALF_DAY" | string;
  workHours: number;
  notes?: string | null;
}

export interface EmployeeAttendanceData {
  summary: AttendanceSummary;
  today: AttendanceToday;
  history: AttendanceLogItem[];
}

export interface EmployeeAttendanceResponse {
  success: boolean;
  message: string;
  data: EmployeeAttendanceData;
}

export interface GetEmployeeAttendanceParams {
  month?: string; // YYYY-MM
  startDate?: string;
  endDate?: string;
}

export interface ClockInResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown> | null;
  errorCode?: string | null;
}

export interface ClockOutResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown> | null;
  errorCode?: string | null;
}

// ==========================================
// Employee Attendance Dispute Swagger Types
// ==========================================

export type AttendanceDisputeIssueType =
  | "MISSING_CLOCK_IN"
  | "MISSING_CLOCK_OUT"
  | "INCORRECT_HOURS"
  | "WRONG_SHIFT"
  | "OVERTIME_MISSING"
  | string;

export interface CreateAttendanceDisputePayload {
  issueType: AttendanceDisputeIssueType;
  description: string;
  claimedClockIn?: string | null;
  claimedClockOut?: string | null;
}

export interface AttendanceDisputeResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown> | null;
  errorCode?: string | null;
}

// ==========================================
// Employee Leave Swagger Types
// ==========================================

export interface LeaveBalanceItem {
  id: string;
  leaveTypeId: string;
  leaveTypeName: string;
  allocatedDays: number;
  usedDays: number;
  remainingDays: number;
}

export interface LeaveTypeItem {
  id: string;
  name: string;
  code: string;
  daysAllowed: number;
  isPaid: boolean;
}

export interface LeaveRequestItem {
  id: string;
  leaveTypeId: string;
  leaveType?: {
    id: string;
    name: string;
    code: string;
  };
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "DRAFT" | string;
  managerComment?: string | null;
  relieverEmployeeId?: string | null;
  createdAt: string;
}

export interface EmployeeLeavePageData {
  balances: LeaveBalanceItem[];
  requests: LeaveRequestItem[];
  pendingRequestsCount: number;
  calendar?: Record<string, unknown>;
}

export interface EmployeeLeaveResponse {
  success: boolean;
  message: string;
  data: EmployeeLeavePageData;
}

export interface GetEmployeeLeaveParams {
  month?: string;
  year?: number;
}

export interface CreateEmployeeLeaveRequestPayload {
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  relieverEmployeeId?: string | null;
}

export interface CreateEmployeeLeaveRequestResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown> | null;
  errorCode?: string | null;
}

// ==========================================
// Employee Relievers Swagger Types
// ==========================================

export interface RelieverDepartment {
  id?: string;
  name?: string;
  [key: string]: unknown;
}

export interface EmployeeRelieverItem {
  id: string;
  employeeId: string;
  name: string;
  role?: string | null;
  department?: RelieverDepartment | null;
}

export interface EmployeeRelieversResponse {
  success: boolean;
  message: string;
  data: EmployeeRelieverItem[];
}

export interface GetEmployeeRelieversParams {
  search?: string;
  limit?: number;
}

// ==========================================
// Employee Payslips Swagger Types
// ==========================================

export interface NetPayTrendItem {
  period: string;
  year: number;
  month: number;
  netPay: number;
  currency: string;
}

export interface EmployeePayslipItem {
  id: string;
  period: string;
  year: number;
  month: number;
  grossPay: number;
  totalDeductions: number;
  netPay: number;
  currency: string;
  status: string;
  canDownload: boolean;
}

export interface EmployeePayslipsData {
  selectedYear: number | null;
  availableYears: number[];
  netPayTrend: NetPayTrendItem[];
  payslips: EmployeePayslipItem[];
}

export interface EmployeePayslipsResponse {
  success: boolean;
  message: string;
  data: EmployeePayslipsData;
}

export interface GetEmployeePayslipsParams {
  year?: number;
}

export interface PayslipBreakdownItem {
  code: string;
  name: string;
  amount: number;
}

export interface EmployeePayslipDetail {
  id: string;
  period: string;
  year: number;
  month: number;
  grossPay: number;
  totalDeductions: number;
  netPay: number;
  currency: string;
  status: string;
  canDownload: boolean;
  breakdownAvailability: "FULL" | "PARTIAL" | "NONE" | string;
  earnings: PayslipBreakdownItem[];
  deductions: PayslipBreakdownItem[];
}

export interface EmployeePayslipDetailResponse {
  success?: boolean;
  message?: string;
  data: EmployeePayslipDetail;
}

// ==========================================
// Employee Appraisal History List Types
// ==========================================

export interface GetEmployeeAppraisalHistoryParams {
  page?: number;
  limit?: number;
}

export interface EmployeeAppraisalRatingObject {
  level?: number;
  label?: string;
  key?: string;
  value?: number;
}

export interface EmployeeAppraisalCycleObject {
  id?: string;
  name?: string;
  periodFrom?: string;
  periodTo?: string;
  submissionDeadline?: string;
  quarter?: string;
  year?: number;
}

export interface EmployeeAppraisalHistoryItem {
  id: string;
  appraisalId?: string;
  cycleName?: string;
  cycle?: string | EmployeeAppraisalCycleObject;
  period?: string;
  periodStart?: string;
  periodEnd?: string;
  finalScore?: number;
  ratingValue?: number;
  rating?: string | EmployeeAppraisalRatingObject;
  completedAt?: string;
  dateCompleted?: string;
  status?: string;
  [key: string]: unknown;
}

export interface EmployeeAppraisalPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

export interface EmployeeAppraisalHistoryResponse {
  success: boolean;
  message: string;
  data: EmployeeAppraisalHistoryItem[];
  pagination: EmployeeAppraisalPagination;
}

// ==========================================
// Employee Appraisal History Detail Types
// ==========================================

export interface HistoricalAppraisalEmployeeManager {
  id?: string;
  name?: string;
  role?: string;
}

export interface HistoricalAppraisalEmployee {
  id?: string;
  employeeCode?: string;
  name?: string;
  role?: string;
  department?: string;
  manager?: HistoricalAppraisalEmployeeManager;
}

export interface HistoricalAppraisalReviewer {
  id?: string;
  name?: string;
  role?: string;
}

export interface HistoricalAppraisalCycle {
  id: string;
  name: string;
  periodFrom: string;
  periodTo: string;
  submissionDeadline: string;
  quarter: string;
  year: number;
}

export interface HistoricalAppraisalTemplate {
  id?: string;
  name?: string;
  version?: number;
}

export interface HistoricalAppraisalObjective {
  id: string;
  title: string;
  weight: number;
}

export interface HistoricalAppraisalCriterion {
  section: string;
  weight: number;
  objectives: HistoricalAppraisalObjective[];
}

export interface HistoricalAppraisalRatingScaleItem {
  value: number;
  key: string;
}

export interface HistoricalAppraisalGoal {
  id: string;
  title: string;
  description?: string;
  successCriteria?: string;
  targetDate?: string;
  status?: string;
  employeeRating?: number;
  employeeComment?: string;
  managerRating?: number;
  managerComment?: string;
}

export interface HistoricalAppraisalReflection {
  questionId: string;
  response: string;
}

export interface HistoricalAppraisalSelfAssessment {
  status?: string;
  reflections?: HistoricalAppraisalReflection[];
  submittedAt?: string;
}

export interface HistoricalAppraisalManagerReview {
  status?: string;
  overallFeedback?: string;
  recommendation?: string;
  submittedAt?: string;
}

export interface HistoricalAppraisalHrApproval {
  decision?: string;
  approvedAt?: string;
}

export interface HistoricalAppraisalAcknowledgement {
  acknowledged?: boolean;
  response?: string;
  acknowledgedAt?: string;
}

export interface HistoricalAppraisalWorkflowStep {
  stage: string;
  completedAt?: string | null;
}

export interface HistoricalAppraisalDetailData {
  appraisalId: string;
  employee?: HistoricalAppraisalEmployee;
  reviewer?: HistoricalAppraisalReviewer;
  cycle?: HistoricalAppraisalCycle;
  template?: HistoricalAppraisalTemplate;
  criteria?: HistoricalAppraisalCriterion[];
  ratingScale?: HistoricalAppraisalRatingScaleItem[];
  stage?: string;
  status?: string;
  goalsConfirmedAt?: string;
  finalScore?: number;
  ratingValue?: number;
  rating?: string;
  goals?: HistoricalAppraisalGoal[];
  selfAssessment?: HistoricalAppraisalSelfAssessment;
  managerReview?: HistoricalAppraisalManagerReview;
  hrApproval?: HistoricalAppraisalHrApproval;
  acknowledgement?: HistoricalAppraisalAcknowledgement;
  workflowHistory?: HistoricalAppraisalWorkflowStep[];
  signOffs?: unknown[];
  [key: string]: unknown;
}

export interface HistoricalAppraisalDetailResponse {
  success: boolean;
  message: string;
  data: HistoricalAppraisalDetailData;
}
