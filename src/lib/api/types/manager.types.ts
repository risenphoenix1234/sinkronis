// src/lib/api/types/manager.types.ts
export interface ManagerPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ManagerListResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: ManagerPagination;
}

export interface ManagerListParams {
  page?: number;
  limit?: number;
}

export interface ManagerReportee {
  id: string;
  employeeId: string;
  name: string;
  jobTitle: string | null;
  status: string;
  lifecycleStatus: string | null;
  profileImageUrl: string | null;
  department: { id: string; name: string } | null;
  team: { id: string; name: string } | null;
}

export interface ManagerReporteesParams extends ManagerListParams {
  search?: string;
}

export interface ManagerAttendanceRecord {
  id: string;
  employeeRecordId: string;
  employeeId: string;
  name: string;
  department: string | null;
  date: string;
  clockIn: string | null;
  clockOut: string | null;
  hours: number | null;
  overtime: number | null;
  status: string;
  flags: string[];
}

export interface ManagerAttendanceParams extends ManagerListParams {
  date?: string;
  from?: string;
  to?: string;
  status?: string;
}

export interface ManagerLeaveRequest {
  id: string;
  employee: {
    id: string;
    employeeId: string;
    name: string;
    department: { id: string; name: string } | null;
  };
  leaveType: string;
  from: string;
  to: string;
  days: number;
  status: string;
  reason: string | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  managerComment: string | null;
  rejectionReason: string | null;
}

export interface ManagerLeaveRequestsParams extends ManagerListParams {
  from?: string;
  to?: string;
  status?: string;
}