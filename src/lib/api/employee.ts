import api from "@/lib/axios";
import {
  AttendanceDisputeResponse,
  ClockInResponse,
  ClockOutResponse,
  CreateAttendanceDisputePayload,
  CreateEmployeeLeaveRequestPayload,
  CreateEmployeeLeaveRequestResponse,
  DashboardResponse,
  EmployeeAttendanceData,
  EmployeeAttendanceResponse,
  EmployeeInboxData,
  EmployeeInboxResponse,
  EmployeeLeavePageData,
  EmployeeLeaveResponse,
  EmployeePayslipDetail,
  EmployeePayslipDetailResponse,
  EmployeePayslipsData,
  EmployeePayslipsResponse,
  EmployeeRelieverItem,
  EmployeeRelieversResponse,
  EmployeeAppraisalHistoryItem,
  EmployeeAppraisalHistoryResponse,
  GetEmployeeAppraisalHistoryParams,
  HistoricalAppraisalDetailData,
  HistoricalAppraisalDetailResponse,
  GetEmployeeAttendanceParams,
  GetEmployeeInboxParams,
  GetEmployeeLeaveParams,
  GetEmployeePayslipsParams,
  GetEmployeeRelieversParams,
} from "./types/employeeTypes";

export async function getEmployeeDashboard() {
  const res = await api.get<DashboardResponse>("/employee/dashboard");
  return res.data.data;
}

export async function getEmployeeInbox(
  params?: GetEmployeeInboxParams,
): Promise<EmployeeInboxData> {
  const res = await api.get<EmployeeInboxResponse>("/employee/inbox", {
    params,
  });
  return res.data.data;
}

export async function getEmployeeAttendance(
  params?: GetEmployeeAttendanceParams,
): Promise<EmployeeAttendanceData> {
  const res = await api.get<EmployeeAttendanceResponse>("/employee/attendance", {
    params,
  });
  return res.data.data;
}

export async function getEmployeeLeave(
  params?: GetEmployeeLeaveParams,
): Promise<EmployeeLeavePageData> {
  const res = await api.get<EmployeeLeaveResponse>("/employee/leave", {
    params,
  });
  return res.data.data;
}

export async function clockIn(): Promise<ClockInResponse> {
  const res = await api.post<ClockInResponse>("/employee/attendance/clock-in");
  return res.data;
}

export async function clockOut(): Promise<ClockOutResponse> {
  const res = await api.post<ClockOutResponse>("/employee/attendance/clock-out");
  return res.data;
}

export async function createAttendanceDispute(
  attendanceId: string,
  payload: CreateAttendanceDisputePayload,
): Promise<AttendanceDisputeResponse> {
  const res = await api.post<AttendanceDisputeResponse>(
    `/employee/attendance/${attendanceId}/disputes`,
    payload,
  );
  return res.data;
}

export async function createEmployeeLeaveRequest(
  payload: CreateEmployeeLeaveRequestPayload,
): Promise<CreateEmployeeLeaveRequestResponse> {
  const res = await api.post<CreateEmployeeLeaveRequestResponse>(
    "/employee/leave/requests",
    payload,
  );
  return res.data;
}

export async function getEmployeeRelievers(
  params?: GetEmployeeRelieversParams,
): Promise<EmployeeRelieverItem[]> {
  const res = await api.get<EmployeeRelieversResponse>(
    "/employee/leave/relievers",
    { params },
  );
  return res.data.data;
}

export async function getEmployeePayslips(
  params?: GetEmployeePayslipsParams,
): Promise<EmployeePayslipsData> {
  const res = await api.get<EmployeePayslipsResponse>("/employee/payslips", {
    params,
  });
  return res.data.data;
}

export async function getEmployeePayslipDetail(
  payslipId: string,
): Promise<EmployeePayslipDetail> {
  const res = await api.get<EmployeePayslipDetailResponse>(
    `/employee/payslips/${payslipId}`,
  );
  return res.data.data;
}

export async function downloadEmployeePayslipPdf(
  payslipId: string,
): Promise<Blob> {
  const res = await api.get(`/employee/payslips/${payslipId}/download`, {
    responseType: "blob",
  });
  return res.data;
}

export async function getEmployeeAppraisalHistory(
  params?: GetEmployeeAppraisalHistoryParams,
): Promise<EmployeeAppraisalHistoryResponse> {
  const res = await api.get<EmployeeAppraisalHistoryResponse>(
    "/employee/appraisal/history",
    { params },
  );
  return res.data;
}

export async function getEmployeeAppraisalHistoryDetail(
  appraisalId: string,
): Promise<HistoricalAppraisalDetailData> {
  const res = await api.get<HistoricalAppraisalDetailResponse>(
    `/employee/appraisal/history/${appraisalId}`,
  );
  return res.data.data;
}

export interface NamedResource {
  id?: string;
  name: string;
}

export interface Money {
  amount: number;
  currency: string;
}

export interface ProfileHeaderData {
  employeeId?: string;
  fullName: string;
  profileImage?: string | null;
  role?: NamedResource | null;
  department?: NamedResource | null;
}

export interface PersonalDetailsData {
  fullName?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string | null;
  gender?: string | null;
  phoneNumber?: string | null;
  personalEmail?: string;
  maritalStatus?: string | null;
  address?: string | null;
  nationality?: string | null;
}

export interface WorkDetailsData {
  employeeId?: string;
  pensionId?: string | null;
  taxId?: string | null;
  status?: string;
  department?: NamedResource | Record<string, unknown> | null;
  position?: NamedResource | Record<string, unknown> | null;
  manager?: NamedResource | Record<string, unknown> | null;
  branch?: NamedResource | Record<string, unknown> | null;
  startDate?: string | null;
  employmentType?: string | null;
  workMode?: string | null;
  earnings?: Money | null;
}

export interface EmergencyContactData {
  id?: string | null;
  name?: string | null;
  relationship?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
}

export interface DocumentItem {
  id: string;
  documentType?: string;
  documentName?: string;
  originalFileName?: string;
  dateAdded?: string;
  downloadAvailable?: boolean;
}

export interface PendingUpdateRequest {
  id?: string;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt?: string;
}

export interface BankDetailsData {
  accountName?: string | null;
  accountNumberMasked?: string | null;
  last4?: string | null;
  bank?: { code?: string | null; name?: string | null } | null;
  accountType?: string | null;
  pendingUpdateRequest?: PendingUpdateRequest | null;
}

export interface EmployeeProfile {
  header: ProfileHeaderData;
  personalDetails: PersonalDetailsData;
  workDetails: WorkDetailsData;
  emergencyContact?: EmergencyContactData | null;
  documents: DocumentItem[];
  bankDetails?: BankDetailsData | null;
}

export interface EmployeeProfileResponse {
  success: boolean;
  message: string;
  data: EmployeeProfile;
}

export async function getEmployeeProfile(): Promise<EmployeeProfile> {
  const res = await api.get<EmployeeProfileResponse>("/employee/profile");
  return res.data.data;
}

export interface UpdatePersonalDetailsPayload {
  phoneNumber?: string | null;
  personalEmail?: string | null;
  address?: string | null;
  maritalStatus?: string | null;
  nationality?: string | null;
}

export async function updatePersonalDetails(payload: UpdatePersonalDetailsPayload): Promise<void> {
  await api.patch("/employee/profile/personal-details", payload);
}

export async function uploadProfilePhoto(file: File): Promise<void> {
  const formData = new FormData();
  formData.append("photo", file);
  await api.patch("/employee/profile/photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export interface BankUpdateRequestPayload {
  bankCode: string;
  bankName: string;
  accountNumber: string | number;
  accountName: string;
  accountType: string;
  reason?: string;
}

export async function requestBankDetailsUpdate(payload: BankUpdateRequestPayload): Promise<void> {
  await api.post("/employee/profile/bank-details/update-request", payload);
}

export async function downloadEmployeeDocument(documentId: string): Promise<Blob> {
  const res = await api.get(`/employee/profile/documents/${documentId}/download`, {
    responseType: "blob",
  });
  return res.data;
}

export const SWAGGER_SAMPLE_EMPLOYEE_PROFILE: EmployeeProfile = {
  header: {
    employeeId: "employee_01J9Z6Y2K7M8N9P0Q1R2S3T4V5",
    fullName: "Ada Okafor",
    profileImage: null,
    role: {
      id: "resource_01J9Z6Y2K7M8N9P0Q1R2S3T4V5",
      name: "Software Engineer",
    },
    department: {
      id: "resource_01J9Z6Y2K7M8N9P0Q1R2S3T4V5",
      name: "Engineering",
    },
  },
  personalDetails: {
    fullName: "Ada Okafor",
    firstName: "Ada",
    lastName: "Okafor",
    dateOfBirth: "2026-09-15T09:00:00.000Z",
    gender: "Female",
    phoneNumber: "+2348012345678",
    personalEmail: "ada.okafor@acmelogistics.com",
    maritalStatus: "Single",
    address: "12 Marina Road, Lagos",
    nationality: "Nigerian",
  },
  workDetails: {
    employeeId: "employee_01J9Z6Y2K7M8N9P0Q1R2S3T4V5",
    pensionId: "pension_01J9Z6Y2K7M8N9P0Q1R2S3T4V5",
    taxId: "tax_01J9Z6Y2K7M8N9P0Q1R2S3T4V5",
    status: "ACTIVE",
    department: { id: "resource_01J9Z6Y2K7M8N9P0Q1R2S3T4V5", name: "Engineering" },
    position: { id: "resource_01J9Z6Y2K7M8N9P0Q1R2S3T4V5", name: "Software Engineer" },
    manager: { id: "resource_01J9Z6Y2K7M8N9P0Q1R2S3T4V5", name: "Adaeze Obi" },
    branch: { id: "resource_01J9Z6Y2K7M8N9P0Q1R2S3T4V5", name: "Lagos HQ" },
    startDate: "2026-09-15T09:00:00.000Z",
    employmentType: "Full-Time",
    workMode: "Hybrid",
    earnings: {
      amount: 250000,
      currency: "NGN",
    },
  },
  emergencyContact: {
    id: "resource_01J9Z6Y2K7M8N9P0Q1R2S3T4V5",
    name: "Emeka Okafor",
    relationship: "Brother",
    phoneNumber: "+2348012345678",
    address: "12 Marina Road, Lagos",
  },
  documents: [
    {
      id: "resource_01J9Z6Y2K7M8N9P0Q1R2S3T4V5",
      documentType: "Contract",
      documentName: "Employment Contract",
      originalFileName: "employment-contract.pdf",
      dateAdded: "2026-09-15T09:00:00.000Z",
      downloadAvailable: true,
    },
  ],
  bankDetails: {
    accountName: "Ada Okafor",
    accountNumberMasked: "******6789",
    last4: "6789",
    bank: {
      code: "EXAMPLE-001",
      name: "Access Bank",
    },
    accountType: "CURRENT",
    pendingUpdateRequest: {
      id: "resource_01J9Z6Y2K7M8N9P0Q1R2S3T4V5",
      status: "PENDING",
      submittedAt: "2026-09-15T09:00:00.000Z",
    },
  },
};