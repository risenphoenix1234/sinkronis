// src/lib/api/manager.ts
import api from "../api/axios";
import {
  ManagerAttendanceParams,
  ManagerAttendanceRecord,
  ManagerLeaveRequest,
  ManagerLeaveRequestsParams,
  ManagerListResponse,
  ManagerReportee,
  ManagerReporteesParams,
} from "./types/manager.types";

export const getManagerReportees = async (
  params?: ManagerReporteesParams,
): Promise<ManagerListResponse<ManagerReportee>> => {
  const { data } = await api.get<ManagerListResponse<ManagerReportee>>(
    "/hris/manager/reportees",
    { params },
  );
  return data;
};

export const getManagerAttendance = async (
  params?: ManagerAttendanceParams,
): Promise<ManagerListResponse<ManagerAttendanceRecord>> => {
  const { data } = await api.get<ManagerListResponse<ManagerAttendanceRecord>>(
    "/hris/manager/attendance",
    { params },
  );
  return data;
};

export const getManagerLeaveRequests = async (
  params?: ManagerLeaveRequestsParams,
): Promise<ManagerListResponse<ManagerLeaveRequest>> => {
  const { data } = await api.get<ManagerListResponse<ManagerLeaveRequest>>(
    "/hris/manager/leave-requests",
    { params },
  );
  return data;
};