export type Trend = "UP" | "DOWN";

export interface EmployeeOverview {
  totalEmployees: number;
  activeEmployees: number;
  activeEmployeePercentage: number;
  employeesOnLeave: number;
  pendingLeaveApprovals: number;
}

export interface NewHires {
  currentMonth: number;
  previousMonth: number;
  difference: number;
  trend: Trend;
}

export interface AttendanceMetric {
  count: number;
  previousDayCount: number;
  difference: number;
  trend: Trend;
}

export interface AttendanceOverview {
  onTime: AttendanceMetric;
  lateClockIn: AttendanceMetric;
  earlyClockIn: AttendanceMetric;
  absent: AttendanceMetric;
  noClockIn: AttendanceMetric;
  noClockOut: AttendanceMetric;
}

export interface RecentActivity {
  id: string;
  type: string;
  employeeId: string;
  employeeName: string;
  description: string;
  createdAt: string;
}

export interface PendingLeaveRequest {
  id: string;
  employee: {
    id: string;
    name: string;
  };
  department: {
    id: string;
    name: string;
  };
  type: string;
  days: number;
  from: string;
  to: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface HeadcountByDepartment {
  departmentId: string;
  departmentName: string;
  headcount: number;
}

export interface HrisDashboardData {
  currentDate: string;
  timeZone: string;
  employeeOverview: EmployeeOverview;
  newHires: NewHires;
  attendanceOverview: AttendanceOverview;
  attendanceClassification: Record<string, unknown>;
  recentActivity: RecentActivity[];
  pendingLeaveRequests: PendingLeaveRequest[];
  headcountByDepartment: HeadcountByDepartment[];
}

export interface HrisDashboardResponse {
  success: boolean;
  message: string;
  data: HrisDashboardData;
}

export interface EmployeeListItem {
  id: string;
  employeeId: string;
  name: string;
  role: string;
  department: { id: string; name: string } | null;
  status: string;
  operationalStatus: string;
  lifecycleStatus: string;
  joinedDate: string;
  phoneNumber: string;
  profileImage: string | null;
}

export type EmployeeSortBy =
  | "name"
  | "employeeId"
  | "joinedDate"
  | "status"
  | "department";

export type SortOrder = "asc" | "desc";

export interface Employee {
  id: string;
  organizationId: string;
  employee: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  departmentId: string;
  hireDate: string;
  status: string;
  lifecycleStatus: string;
  employmentType: EmploymentType;
  workMode: WorkMode;
  profileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetEmployeesResponse {
  success: boolean;
  message: string;
  data: EmployeeListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface GetEmployeesParams {
  page?: number;
  limit?: number;
  search?: string;
  departmentId?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface InviteEmployeePayload {
  email: string;
  roleId: string;
  moduleAccess?: string[];
}

// Confirmed against a real response — POST /hris/employees/invite
export interface InvitedEmployee {
  id: string;
  email: string;
  role: string; // role name, not roleId
  moduleAccess: string[];
  sentDate: string;
  status: "PENDING" | "ACCEPTED" | "EXPIRED" | string; // only PENDING confirmed so far
}

export interface InviteEmployeeResponse {
  success: boolean;
  message: string;
  data: InvitedEmployee;
}

// Confirmed against a real response — GET /admin/roles.
// Note: unlike every other endpoint so far, this returns a bare array,
// not wrapped in { success, message, data }.
export interface RolePermissionGroup {
  module: string;
  label: string;
  // permissions/actions/resources are large nested structures we don't
  // need for a role picker — left loose rather than fully typed out.
  permissions: unknown[];
  actions: Record<string, unknown>;
  resources: unknown[];
}

export interface Role {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  isSystem: boolean;
  canModify: boolean;
  canDelete: boolean;
  lockedReason: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: string[];
  permissionGroups: RolePermissionGroup[];
}

export type Gender = "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
export type MaritalStatus = "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED" | "OTHER";
export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN";
export type WorkMode = "ONSITE" | "REMOTE" | "HYBRID";
export type AccountType = "SAVINGS" | "CURRENT";

// Matches CreateEmployeeRequest inline employeeStatus enum directly
export type CreateEmployeeStatus = "ACTIVE" | "INACTIVE" | "ON_LEAVE" | "SUSPENDED" | "TERMINATED";

// Swagger CreateEmployeeRequest source of truth:
export interface CreateEmployeePayload {
  employeeId: string;
  firstName: string;
  lastName: string;
  personalEmail: string;
  phoneNumber?: string;
  gender?: Gender;
  dateOfBirth?: string;
  nationality?: string;
  maritalStatus?: MaritalStatus;
  address?: string;

  nextOfKinFirstName?: string;
  nextOfKinLastName?: string;
  nextOfKinContact?: string;
  nextOfKinAddress?: string;

  bankName?: string;
  bankCode?: string;
  accountNumber?: string;
  accountName?: string;
  accountType?: AccountType;

  employeeStatus?: CreateEmployeeStatus | EmployeeStatus;
  taxId?: string;
  pensionId?: string;
  departmentId?: string;
  position?: string;
  workMode?: WorkMode;
  dateJoined?: string;
  earnings?: number;
  employmentType?: EmploymentType;

  guarantorFirstName?: string;
  guarantorLastName?: string;
  guarantorRelationship?: string;
  guarantorPhone?: string;
  guarantorAddress?: string;

  documentType?: DocumentType;
}

export type DocumentType =
  | "IDENTIFICATION"
  | "CERTIFICATE"
  | "CONTRACT"
  | "TAX_DOCUMENT"
  | "PENSION_DOCUMENT"
  | "OTHER";

// Sent as the "data" field when files are attached.
export interface CreateEmployeeMultipartData extends CreateEmployeePayload {
  documentTypes?: string[];
}

export interface CreateEmployeeFiles {
  profileImage?: File | null;
  appointmentLetter?: File | null;
  documents?: { file: File; documentType?: string }[]; // max 9, enforced client-side
}

export interface CreateEmployeeResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    organizationId: string;
    employeeNo: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
    jobTitle?: string | null;
    departmentId?: string | {
      id: string;
      name: string;
    } | null;    
    hireDate?: string | null;
    status: string;
    lifecycleStatus?: string | null;
    employmentType?: EmploymentType | null;
    workMode?: WorkMode | null;
    profileImageUrl?: string | null;
    createdAt?: string;
    updatedAt?: string;
    documents?: { originalName: string; mimeType: string; size: number }[];
  };
}

export interface EmployeeDetailHeader {
  id: string;
  employeeId: string;
  name: string;
  role: string;
  profileImage: string | null;
  status: string;
  operationalStatus: string;
  lifecycleStatus: string;
  joinedDate: string;
}

export interface EmployeeDetailPersonalInfo {
  fullName: string;
  gender: Gender;
  employmentType: EmploymentType;
  emailAddress: string;
  dateOfBirth: string;
  department: { id: string; name: string } | null;
  phoneNumber: string;
  address: string;
  role: string;
  city: string | null;
  nationality: string;
  state: string | null;
  workMode: WorkMode;
  maritalStatus: MaritalStatus;
}

export interface EmployeeDetailBankDetails {
  bankName: string;
  accountNumber: string; // may be masked, e.g. "****6789"
  monthlySalary: number | null; // null when masked
  masked: boolean;
}

export interface EmployeeDetailNextOfKin {
  firstName: string;
  lastName: string;
  contact: string;
  address: string;
}

export interface EmployeeDetailGuarantor {
  firstName: string;
  lastName: string;
  relationship: string;
  phone: string;
  address: string;
}

export interface EmployeeDetailDocument {
  originalName: string;
  mimeType: string;
  size: number;
  url?: string;
}

export interface EmployeeDetail {
  header: EmployeeDetailHeader;
  personalInformation: EmployeeDetailPersonalInfo;
  bankDetails: EmployeeDetailBankDetails;
  // Unconfirmed inner shapes — API returned {} for all three in the example.
  // Typing loosely until a populated response is seen.
  attendanceOverview: Record<string, unknown>;
  leaveOverview: Record<string, unknown>;
  payrollOverview: Record<string, unknown>;
  nextOfKin: EmployeeDetailNextOfKin | null;
  guarantor: EmployeeDetailGuarantor | null;
  documents: EmployeeDetailDocument[];
}

export interface GetEmployeeResponse {
  success: boolean;
  message: string;
  data: EmployeeDetail;
}

export interface EmployeeProfileDocument {
  id: string;
  type?: string;
  fileName?: string;
  originalName?: string;
  mimeType?: string;
  size?: number;
  uploadedAt?: string;
  downloadPath?: string;
}

export interface EmployeeProfileBankDetails {
  bankName?: string | null;
  accountNumber?: string | null;
  accountName?: string | null;
  bankCode?: string | null;
  accountType?: string | null;
  monthlySalary?: string | number | null;
  masked?: boolean;
}

export interface EmployeeProfileNextOfKin {
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  contact?: string | null;
  address?: string | null;
  relationship?: string | null;
}

export interface EmployeeProfileGuarantor {
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  phone?: string | null;
  address?: string | null;
  relationship?: string | null;
}

export interface EmployeeProfileAttendanceOverview {
  presentDays?: number | null;
  lateArrivals?: number | null;
  absentDays?: number | null;
  overtimeHours?: number | null;
  availability?: Record<string, unknown>;
}

export interface EmployeeProfileLeaveOverview {
  usedApprovedDays?: number | null;
  balances?: unknown[];
  availability?: string;
}

export interface EmployeeProfilePayrollOverview {
  available?: boolean;
  salaryStructure?: unknown;
}

export interface GetEmployeeDetail {
  header: {
    id: string;
    employeeId: string;
    name: string;
    role?: string | null;
    department?: {
      id: string;
      name: string;
    } | null;
    status: string;
    operationalStatus?: string;
    lifecycleStatus?: string;
    joinedDate?: string | null;
    phoneNumber?: string | null;
    profileImage?: string | null;
  };
  personalInformation: {
    fullName?: string | null;
    gender?: Gender | string | null;
    employmentType?: EmploymentType | string | null;
    emailAddress?: string | null;
    personalEmail?: string | null;
    dateOfBirth?: string | null;
    department?: { id: string; name: string } | string | null;
    phoneNumber?: string | null;
    address?: string | null;
    role?: string | null;
    position?: string | null;
    city?: string | null;
    nationality?: string | null;
    state?: string | null;
    workMode?: WorkMode | string | null;
    maritalStatus?: MaritalStatus | string | null;
    earnings?: string | number | null;
  } | Record<string, unknown>;
  bankDetails?: EmployeeProfileBankDetails | Record<string, unknown> | null;
  attendanceOverview?: EmployeeProfileAttendanceOverview | Record<string, unknown> | null;
  leaveOverview?: EmployeeProfileLeaveOverview | Record<string, unknown> | null;
  payrollOverview?: EmployeeProfilePayrollOverview | Record<string, unknown> | null;
  nextOfKin?: EmployeeProfileNextOfKin | Record<string, unknown> | null;
  guarantor?: EmployeeProfileGuarantor | Record<string, unknown> | null;
  documents: EmployeeProfileDocument[];
}

export interface GetEmployeeDetailResponse {
  success: boolean;
  message: string;
  data: GetEmployeeDetail;
}

export type UpdateEmployeePayload = Partial<CreateEmployeePayload>;

export interface UpdateEmployeeResponse {
  success: boolean;
  message: string;
  data: unknown; // shape not shown in Swagger for this endpoint yet
}

export type EmployeeStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "ON_LEAVE"
  | "SUSPENDED"
  | "CONFIRMED"
  | "PROBATION"
  | "EXITED";

export type EmployeeStatusChangeValue = EmployeeStatus;

export interface UpdateEmployeeStatusPayload {
  status: EmployeeStatus;
  effectiveDate: string; // format: "YYYY-MM-DD"
}

export interface UpdatedEmployeeStatusRecord {
  id: string;
  organizationId: string;
  departmentId: string | null;
  teamId?: string | null;
  employeeNo: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  hireDate: string;
  status: EmployeeStatus;
  lifecycleStatus?: string;
  lifecycleEffectiveAt?: string | null;
  [key: string]: unknown;
}

export interface UpdateEmployeeStatusResponse {
  success: boolean;
  message: string;
  data: UpdatedEmployeeStatusRecord;
}

// POST /hris/employees/import — Bulk-import employees from CSV
export interface ImportEmployeesData {
  imported: number;
  failed: number;
}

export interface ImportEmployeesResponse {
  success: boolean;
  message: string;
  data: ImportEmployeesData;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  clockIn: string | null;
  clockOut: string | null;
  status: string; // e.g. "ON_TIME" | "LATE" | "ABSENT" — unconfirmed enum
}

export interface GetEmployeeAttendanceResponse {
  success: boolean;
  message: string;
  data: AttendanceRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface GetEmployeeAttendanceParams {
  page?: number;
  limit?: number;
}

// GET /hris/employees/{employeeId}/activity — full confirmed shape below at EmployeeActivityRecord (line ~513)

export interface GetEmployeeActivityResponse {
  success: boolean;
  message: string;
  data: EmployeeActivityRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface GetEmployeeActivityParams {
  page?: number;
  limit?: number;
}

// Confirmed against a real response — GET /hris/employees/{employeeId}/activity
export interface EmployeeActivityMetadata {
  changedFields?: string[];
  ipAddress?: string;
  userAgent?: string;
}

export interface EmployeeActivityRecord {
  id: string;
  action: string; // e.g. "HRIS_EMPLOYEE_CREATED" | "HRIS_EMPLOYEE_UPDATED" — open string, more values likely exist
  actorUserId: string;
  summary: string;
  createdAt: string;
  metadata: EmployeeActivityMetadata;
}

export interface GetDailyAttendanceParams {
  date?: string; // "YYYY-MM-DD"
}

export interface GetMonthlyAttendanceParams {
  month?: string; // "YYYY-MM"
  year?: number;
  page?: number;
  limit?: number;
}

// Confirmed against a real response — GET /hris/attendance
export interface DailyAttendanceAnalytics {
  onTime: number;
  late: number;
  absent: number;
  onLeave: number;
  noClockOut: number;
  // there may be more fields here (e.g. noClockIn, earlyClockIn) — this
  // object had 5 keys visible in the console but was truncated; expand
  // this interface if more turn up once records exist
}

export interface DailyAttendanceRecord {
  // UNCONFIRMED — records was empty ([]) in the test response, so the
  // per-employee record shape is still unknown. Fill this in once an
  // employee actually clocks in/out and a real record appears.
  [key: string]: unknown;
}

export interface DailyAttendanceData {
  analytics: DailyAttendanceAnalytics;
  employeeCount: number;
  records: DailyAttendanceRecord[];
  selectedDate: string;
}

export interface DailyAttendanceResponse {
  success: boolean;
  message: string;
  data: DailyAttendanceData;
}

// Confirmed against Swagger: POST /hris/attendance/clock-in
export interface ClockInPayload {
  employeeId: string;
  note?: string;
}

export interface ClockInResponse {
  success: boolean;
  message: string;
  data: unknown; // shape not shown in Swagger yet — inspect once tested live
}

// GetMyTodayAttendanceResponse — full version below, after MyTodayAttendance is defined

// POST /hris/attendance/{id}/clock-out
export interface ClockOutPayload {
  note?: string;
}

export interface ClockOutResponse {
  success: boolean;
  message: string;
  data: unknown;
}

// GET /hris/attendance/me/today — no example schema for the 200 case yet,
// but both response codes are now confirmed: 200 "Tenant-local clock,
// shift, and attendance", 404 "User has no linked employee" (matches the
// error we saw from clock-in when testing an unlinked account).
export interface MyTodayAttendance {
  employeeId: string;
  // remaining fields unconfirmed — inspect via a real response before
  // relying on anything beyond employeeId
  [key: string]: unknown;
}

export interface GetMyTodayAttendanceResponse {
  success: boolean;
  message: string;
  data: MyTodayAttendance | null;
}

export interface AttendanceOverviewAvailability {
  daysAbsent?: string; // explanatory note when the metric can't be computed yet
  onLeave?: string;
}

export interface ConductRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  email: string;
  department: string;
  queryType: string;
  date: string;
  status: string;
  history?: string[];
  notes?: unknown[];
}

export interface GetConductRecordsResponse {
  success: boolean;
  message: string;
  data: ConductRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface GetConductRecordsParams {
  type?: string;
  employee?: string;
  department?: string;
  status?: string;
  date?: string;
  page?: number;
  limit?: number;
}

export interface IssueConductQueryPayload {
  employeeId: string;
  queryType: string;
  notes: string;
}

export interface CreateSuspensionPayload {
  employeeId: string;
  queryType: string;
  durationValue: number;
  durationUnit: string;
  notes: string;
}

export interface ConductOverviewData {
  totalQueries: number;
  activeSuspensions: number;
  inProgress: number;
}

export interface ConductOverviewResponse {
  success: boolean;
  message: string;
  data: ConductOverviewData;
}

export interface AttendanceOverviewData {
  range: {
    from: string;
    to: string;
    timeZone: string;
  };
  attendanceRate: number;
  daysPresent: number;
  daysAbsent: number | null;
  onLeave: number | null;
  lateClockIns: number;
  totalHours: number;
  availability: AttendanceOverviewAvailability;
}

export interface GetAttendanceOverviewResponse {
  success: boolean;
  message: string;
  data: AttendanceOverviewData;
}

export interface ExportAttendanceParams {
  from?: string;
  to?: string;
  departmentId?: string;
}

export interface DepartmentAttendanceSummary {
  department: string;
  employees: number;
  onTime: number;
  late: number;
  absent: number;
  onLeave: number;
  hours: number;
  rate: number;
  [key: string]: unknown;
}

export interface GetDepartmentAttendanceSummaryResponse {
  success: boolean;
  message: string;
  data: DepartmentAttendanceSummary[];
}


export interface MonthlyAttendanceRecord {
  [key: string]: unknown; // shape unknown until tested
}

export interface MonthlyAttendanceAvailability {
  absent?: string;
  onLeave?: string;
  rate?: string;
  // other fields may exist once real data populates these — treat as
  // partial/optional since only these three appeared with zero records
}

export interface GetMonthlyAttendanceMetadata {
  month: string;
  availability: MonthlyAttendanceAvailability;
}

export interface GetMonthlyAttendanceResponse {
  success: boolean;
  message: string;
  data: MonthlyAttendanceRecord[];
  metadata: GetMonthlyAttendanceMetadata;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface AttendanceDispute {
  [key: string]: unknown;
}

export interface GetAttendanceDisputesParams {
  page?: number;
  limit?: number;
  status?: string;
}

export interface GetAttendanceDisputesResponse {
  success: boolean;
  message: string;
  data: AttendanceDispute[]; // per-dispute shape still unknown — zero records seen
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// GET /hris/attendance/disputes/{disputeId} — "Get a tenant attendance dispute".
// No example schema shown, but this individual record should match the
// shape of entries in GET /hris/attendance/disputes' data array — both
// unconfirmed until real dispute data exists.
export interface GetAttendanceDisputeResponseId {
  success: boolean;
  message: string;
  data: AttendanceDispute;
}

export interface ResolveDisputePayload {
  status: "APPROVED" | "REJECTED";
  resolutionNote: string;
}

export interface ResolveDisputeResponse {
  success: boolean;
  message: string;
  data: unknown; // shape not shown in Swagger yet
}

// Confirmed against Swagger: PATCH /hris/attendance/{attendanceId}/override
export interface OverrideAttendancePayload {
  clockIn?: string; // "HH:mm"
  clockOut?: string; // "HH:mm"
  status?: string; // e.g. "ABSENT" — exact enum not shown, likely matches attendance status vocabulary
  reason: string; // mandatory per the description
}

export interface OverrideAttendanceResponse {
  success: boolean;
  message: string;
  data: unknown; // shape not shown in Swagger yet
}

export interface RaiseDisputePayload {
  issueType: string; // e.g. "MISSING_CLOCK_IN" — full enum not shown, only this example value confirmed
  description: string;
  claimedClockIn?: string; // "HH:mm"
  claimedClockOut?: string; // "HH:mm"
}

export interface RaiseDisputeResponse {
  success: boolean;
  message: string;
  data: unknown; // shape not shown in Swagger yet
}

export interface AttendanceLogEntry {
  id?: string;
  name?: string;
  department?: string;
  shift?: string;
  clockIn?: string;
  clockOut?: string;
  hours?: string;
  ot?: string;
  status?: string;
  date?: string;
  [key: string]: unknown;
}

export interface GetAttendanceLogsParams {
  page?: number;
  limit?: number;
  search?: string;
  departmentId?: string;
  employeeId?: string;
  from?: string; // "YYYY-MM-DD" — confirmed
  to?: string;   // "YYYY-MM-DD" — confirmed
  status?: string;
}

export interface GetAttendanceLogsMetadata {
  selectedRange: {
    from: string;
    to: string;
    timeZone: string;
  };
}

export interface GetAttendanceLogsResponse {
  success: boolean;
  message: string;
  data: AttendanceLogEntry[];
  metadata: GetAttendanceLogsMetadata;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// PATCH /hris/leave-requests/{id}/approve
// Requires hris:leave:approve permission. No request body — id is a path param only.
// Response shape not shown in Swagger; leaving loose until tested live.
export interface ApproveLeaveRequestResponse {
  success: boolean;
  message: string;
  data: unknown;
}

// Confirmed against Swagger example — GET /hris/leaves/overview
// No envelope here, unlike most other endpoints — bare object, similar to
// getRoles(). Counts are scoped to the authenticated tenant.
export interface LeaveOverviewResponse {
  pending: number;
  approved: number;
  rejected: number;
}

export type Status = "Pending" | "Approved" | "Rejected";

export interface LeaveRequest {
  id: string; // required for approve/reject calls — backend must include this
  employee: string;
  department: string;
  leaveType: string;
  from: string;
  to: string;
  days: number;
  status: Status;
}

export interface RejectLeaveRequestPayload {
  reason?: string;
}

export interface RejectLeaveRequestResponse {
  success: boolean;
  message: string;
  data: unknown; // shape not shown in Swagger yet
}

export type LeaveRequestStatusFilter = "ALL" | "PENDING" | "APPROVED" | "REJECTED";

export interface GetLeaveRequestsParams {
  page?: number;
  limit?: number;
  status?: LeaveRequestStatusFilter;
}

export interface LeaveRequestRecord {
  id: string;
  employee: {
    id: string;
    name: string;
  };
  department: {
    id: string;
    name: string;
  } | null;
  leaveType: string;
  from: string;
  to: string;
  days: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reason?: string;
}

export interface GetLeaveRequestsResponse {
  success: boolean;
  message: string;
  data: LeaveRequestRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ApplyForLeavePayload {
  employeeId?: string;
  leaveType: string;
  fromDate: string; // "YYYY-MM-DD"
  toDate: string; // "YYYY-MM-DD"
  reason: string;
}

export interface ApplyForLeaveResponse {
  success: boolean;
  message: string;
  data: LeaveRequestRecord;
}

export interface ApproveLeaveRequestPayload {
  comment?: string; // optional, employee-visible manager comment
}

export interface ApproveLeaveRequestResp {
  success: boolean;
  message: string;
  data: LeaveRequestRecord; // assumed — unconfirmed, "Leave approved" only in docs
}

export interface AppraisalsAnalytics {
  totalEmployees: number;
  completed: number;
  inProgress: number;
  pendingHR: number;
}

export interface AppraisalsOverviewData {
  analytics: AppraisalsAnalytics;
  activeCycle: Record<string, unknown> | null;
  workflow: Record<string, unknown>;
}

export interface GetAppraisalsOverviewResponse {
  success: boolean;
  message: string;
  data: AppraisalsOverviewData;
}

export interface ActiveAppraisalCycle {
  id: string;
  name: string;
  status: string; // e.g. "OPEN" — only this value confirmed via the 404 message
  acknowledgmentPercentage: number;
  workflowCounts: Record<string, number>;
  [key: string]: unknown; // catch-all for unconfirmed fields (template, dates, etc.)
}

export interface GetActiveAppraisalCycleResponse {
  success: boolean;
  message: string;
  data: ActiveAppraisalCycle;
}

export interface AppraisalReviewEmployee {
  id?: string;
  employeeId?: string;
  name?: string;
  role?: string;
}

export interface AppraisalReviewCycle {
  id?: string;
  name?: string;
}

export interface AppraisalReviewTemplate {
  id?: string;
  name?: string;
}

export interface AppraisalReviewDepartment {
  id?: string;
  name?: string;
}

export interface AppraisalReviewManager {
  id?: string;
  name?: string;
}

export interface AppraisalReview {
  appraisalId: string;
  id?: string;
  employee?: AppraisalReviewEmployee | null;
  employeeName?: string;
  name?: string;
  role?: string;
  department?: AppraisalReviewDepartment | string | null;
  manager?: AppraisalReviewManager | string | null;
  cycle?: AppraisalReviewCycle | string | null;
  template?: AppraisalReviewTemplate | string | null;
  stage?: string;
  status?: string;
  score?: number | null;
  ratingValue?: number | null;
  rating?: string | null;
  action?: string;
  [key: string]: unknown;
}

export interface GetAppraisalReviewsParams {
  page?: number;
  limit?: number;
  cycleId?: string;
  status?: string;
  stage?: string;
  departmentId?: string;
  search?: string;
}

export interface GetAppraisalReviewsResponse {
  success: boolean;
  message: string;
  data: AppraisalReview[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface GetAppraisalTemplatesParams {
  page?: number;
  limit?: number;
}

export interface KeyResultInput {
  id?: string; // likely optional on create — backend probably generates this
  description: string;
  kpiWeight: number;
  target: number;
  initiatives: string;
}

export interface ObjectiveInput {
  id?: string;
  title: string;
  weight: number;
  keyResults: KeyResultInput[];
}

export type SignOffType = "EMPLOYEE" | "MANAGER" | "HR"; // only EMPLOYEE confirmed; MANAGER/HR inferred from workflow stages seen elsewhere

export type TemplateSectionType = "KRA" | "BEHAVIOURAL"; // confirmed — exactly these two required

export interface TemplateSectionInput {
  section: TemplateSectionType;
  weight: number;
  objectives: ObjectiveInput[];
}

export interface RatingScaleEntry {
  key: string; // e.g. "OUTSTANDING" | "ABOVE_EXPECTATION" | "MEETS_EXPECTATION" | "BELOW_EXPECTATION" | "POOR_PERFORMANCE"
  value: number;
  minimum?: number;
  minimumExclusive?: number;
}

export interface KeyResult {
  id: string;
  description: string;
  kpiWeight: number;
  target: number;
  initiatives: string;
}

export type AppraisalKeyResult = KeyResult;

export interface Objective {
  id: string;
  title: string;
  weight: number;
  keyResults: KeyResult[];
}

export interface TemplateSection {
  section: TemplateSectionType;
  weight: number;
  objectives: Objective[];
}

export interface DeleteAppraisalCyclePayload {
  confirmation: "DELETE APPRAISAL CYCLE";
}

export interface AppraisalCycleProgress {
  acknowledged: number;
  totalEmployees: number;
  percentage: number;
}

export interface AppraisalCycleSummary {
  id: string;
  name: string;
  description: string | null;
  status: "DRAFT" | "ACTIVE" | "COMPLETED"; // COMPLETED unconfirmed — complete endpoint never succeeded in testing (409, needs all appraisals acknowledged first)
  template: {
    id: string;
    name: string;
  };
  periodFrom: string;
  periodTo: string;
  submissionDeadline: string;
  progress: AppraisalCycleProgress;
}

export interface ListAppraisalCyclesResponse {
  success: boolean;
  message: string;
  data: AppraisalCycleSummary[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface AppraisalCycle {
  id: string;
  organizationId: string;
  title: string;
  description: string | null;
  periodStart: string;
  periodEnd: string;
  status: "DRAFT" | "ACTIVE" | "COMPLETED";
  quarter: string;
  year: number;
  deadline: string;
  templateId: string;
  templateSnapshot: {
    managerReviewQuestions: Record<string, unknown>[];
    reflectionQuestions: Record<string, unknown>[];
    quarterScoring: boolean;
    ratingScale: RatingScaleEntry[];
    sections: TemplateSection[];
    signOffTypes: SignOffType[];
    templateMetadata: {
      id: string;
      name: string;
      version: number;
    };
  };
  launchedAt: string | null; // stayed null even immediately after a successful launch in testing — don't rely on this to detect "is launched", use status instead
  launchedById: string | null;
  createdAt: string;
  updatedAt: string;
  enrolledEmployees: number;
  template?: AppraisalTemplate; // present on launch response, absent on create response — unconfirmed why
}

export interface CreateAppraisalCyclePayload {
  cycleName: string;
  templateId: string;
  periodFrom: string;
  periodTo: string;
  submissionDeadline: string; // confirmed required — 400s without it
  description?: string;
  launchMode: "SAVE_AS_DRAFT" | "LAUNCH_AS_ACTIVE";
}

export interface CreateAppraisalCycleResponse {
  success: boolean;
  message: string;
  data: AppraisalCycle;
}

export interface LaunchAppraisalCycleResponse {
  success: boolean;
  message: string;
  data: AppraisalCycle;
}

export interface CompleteAppraisalCycleResponse {
  success: boolean;
  message: string;
  data: AppraisalCycle;
}

export interface AppraisalReviewRecord {
  appraisalId: string;
  employee: {
    id: string;
    employeeId: string;
    name: string;
    role: string;
  };
  department: { id: string; name: string } | null;
  manager: { id: string; name: string } | null; // null seen in testing — shape guessed to mirror employee/department, unconfirmed
  cycle: {
    id: string;
    name: string;
  };
  template: {
    id: string;
    name: string;
  };
  stage: string; // "GOAL_SETTING" confirmed; other stages likely mirror the workflow endpoints (self-assessment, manager-review, hr-approval, acknowledge, sign-off) — unconfirmed enum
  status: string; // "IN_PROGRESS" confirmed; others unconfirmed
  score: number | null;
  ratingValue: number | null;
  rating: string | null;
}

export interface GetAppraisalCycleReviewsResponse {
  success: boolean;
  message: string;
  data: AppraisalReviewRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface DeleteAppraisalCycleResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    deleted: boolean;
    deletedAppraisals: number;
  };
}

export interface AppraisalTemplateQuestion {
  id: string;
  question: string;
  required: boolean;
}

export interface AppraisalSettings {
  id: string;
  organizationId: string;
  defaultReviewFrequency: "MONTHLY" | "QUARTERLY" | "BIANNUAL" | "ANNUAL"; // only MONTHLY confirmed; others inferred from UI
  updatedById: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAppraisalSettingsResponse {
  success: boolean;
  message: string;
  data: AppraisalSettings;
}

export interface UpdateAppraisalSettingsPayload {
  defaultReviewFrequency: AppraisalSettings["defaultReviewFrequency"];
}

export interface UpdateAppraisalSettingsResponse {
  success: boolean;
  message: string;
  data: AppraisalSettings;
}

export interface AppraisalTemplateSummary {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  version: number;
  archivedAt: string | null;
  totalWeight: number;
  summary: {
    sectionAObjectives: number;
    sectionAKeyResults: number;
    sectionBObjectives: number;
    sectionBKeyResults: number;
    quarterScoring: boolean;
  };
}

export interface GetAppraisalTemplatesResponse {
  success: boolean;
  message: string;
  data: AppraisalTemplateSummary[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface AppraisalTemplateConfiguration {
  sections: TemplateSection[];
  reflectionQuestions: AppraisalTemplateQuestion[];
  managerReviewQuestions: AppraisalTemplateQuestion[];
  quarterScoring: boolean;
  signOffTypes: SignOffType[];
  ratingScale: RatingScaleEntry[];
}

export interface AppraisalTemplate {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  configuration: AppraisalTemplateConfiguration;
  isDefault: boolean;
  version: number;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppraisalTemplatePayload {
  name: string;
  description: string;
  isDefault: boolean;
  sections: TemplateSectionInput[];
  reflectionQuestions: AppraisalTemplateQuestion[];
  managerReviewQuestions: AppraisalTemplateQuestion[];
  quarterScoring: boolean;
  signOffTypes: SignOffType[];
}

export interface CreateAppraisalTemplateResponse {
  success: boolean;
  message: string;
  data: AppraisalTemplate;
}

export interface GetAppraisalTemplateDetailResponse {
  success: boolean;
  message: string;
  data: AppraisalTemplate;
}

export interface AppraisalTemplatePayload {
  name: string;
  description: string;
  sections: TemplateSection[];
  reflectionQuestions: AppraisalTemplateQuestion[];
  managerReviewQuestions: AppraisalTemplateQuestion[];
  quarterScoring: boolean;
  signOffTypes: SignOffType[];
  isDefault: boolean;
}

export interface UpdateAppraisalTemplateResponse {
  success: boolean;
  message: string;
  data: AppraisalTemplate;
}

export interface ArchiveAppraisalTemplateResponse {
  success: boolean;
  message: string;
  data: AppraisalTemplate;
}

export type AppraisalStatus =
  | "GOAL_SETTING"
  | "SELF_ASSESSMENT"
  | "MANAGER_REVIEW"
  | "PENDING_HR_APPROVAL"
  | "ACKNOWLEDGEMENT"
  | "COMPLETED";

export interface AppraisalEmployee {
  id?: string;
  name: string;
  title: string;
  department: string;
  managerName: string;
  avatarInitials: string;
}

export interface AppraisalSummary {
  id: string;
  cycleTitle: string;      // e.g. "Q2 2026 Review"
  templateName: string;    // e.g. "Standard Performance Review"
  status: AppraisalStatus;
  statusLabel: string;     // e.g. "Pending HR Approval"
  overallScorePercent: number; // e.g. 63
  overallRatingLabel: string;  // e.g. "Below Expectation"
}

export type GoalStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

export interface Goal {
  id: string;
  title: string;
  description: string;
  successCriteria: string;
  targetDate: string; // ISO date
  status: GoalStatus;
  employeeRating?: number;
  employeeRatingLabel?: string;
  employeeComment?: string;
  managerRating?: number;
  managerRatingLabel?: string;
  managerComment?: string;
}

export const WORKFLOW_STEPS = [
  "GOAL_SETTING",
  "SELF_ASSESSMENT",
  "MANAGER_REVIEW",
  "PENDING_HR_APPROVAL",
  "ACKNOWLEDGEMENT",
] as const satisfies readonly AppraisalStatus[];

export interface SelfAssessmentPayload {
  sections: {
    section: string;
    totalWeight: number;
    objectives: {
      title: string;
      weight: number;
      keyResults: {
        keyResult: string;
        kpiWeight: number;
        target: number;
        comment: string;
        // add "achieved" field here once confirmed from GET
      }[];
    }[];
  }[];
  submit: boolean;
}