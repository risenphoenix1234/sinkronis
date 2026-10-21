// src/lib/api/employee.ts
import api from "@/lib/api/axios";
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
  AcknowledgeAppraisalResponse,
  CreateEmployeeAppraisalGoalPayload,
  CreateEmployeeAppraisalGoalResponse,
  EmployeeAppraisalDetailResponse,
  EmployeeAppraisalGoalsResponse,
  EmployeeSelfAssessmentResponse,
  SaveSelfAssessmentDraftResponse,
  SubmitSelfAssessmentResponse,
  EmployeeAppraisalDetailData,
  EmployeeAppraisalOverviewData,
  EmployeeAppraisalGoalsData,
  UpdateEmployeeAppraisalGoalPayload,
  UpdateEmployeeAppraisalGoalResponse,
  EmployeeSelfAssessmentData,
  SaveSelfAssessmentDraftPayload,
  SaveSelfAssessmentDraftData,
  SubmitSelfAssessmentPayload,
  SubmitSelfAssessmentData,
  AcknowledgeAppraisalPayload,
  AcknowledgeAppraisalData,
  HistoricalAppraisalGoal,
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
 
export async function getEmployeeAppraisalDetail(
  appraisalId: string,
): Promise<EmployeeAppraisalDetailData> {
  const res = await api.get<EmployeeAppraisalDetailResponse>(
    `/employee/appraisal/${appraisalId}`,
  );
  return res.data.data;
}
 
export async function getEmployeeAppraisalOverview(): Promise<EmployeeAppraisalOverviewData> {
  const res = await api.get<{
    success: boolean;
    data: EmployeeAppraisalOverviewData;
  }>("/employee/appraisal");
  return res.data.data;
}
 
export async function getEmployeeAppraisalGoals(
  appraisalId: string,
): Promise<EmployeeAppraisalGoalsData> {
  const res = await api.get<EmployeeAppraisalGoalsResponse>(
    `/employee/appraisal/${appraisalId}/goals`,
  );
  return res.data.data;
}
 
export async function createEmployeeAppraisalGoal(
  appraisalId: string,
  payload: CreateEmployeeAppraisalGoalPayload,
): Promise<HistoricalAppraisalGoal> {
  const formattedPayload: CreateEmployeeAppraisalGoalPayload = {
    ...payload,
    targetDate: payload.targetDate.includes("T")
      ? payload.targetDate.split("T")[0]
      : payload.targetDate,
  };
  const res = await api.post<CreateEmployeeAppraisalGoalResponse>(
    `/employee/appraisal/${appraisalId}/goals`,
    formattedPayload,
  );
  return res.data.data;
}
 
export async function updateEmployeeAppraisalGoal(
  appraisalId: string,
  goalId: string,
  payload: UpdateEmployeeAppraisalGoalPayload,
): Promise<UpdateEmployeeAppraisalGoalResponse> {
  const res = await api.patch<UpdateEmployeeAppraisalGoalResponse>(
    `/employee/appraisal/${appraisalId}/goals/${goalId}`,
    payload,
  );
  return res.data;
}
 
export async function getEmployeeSelfAssessment(
  appraisalId: string,
): Promise<EmployeeSelfAssessmentData> {
  const res = await api.get<EmployeeSelfAssessmentResponse>(
    `/employee/appraisal/${appraisalId}/self-assessment`,
  );
  return res.data.data;
}
 
export async function saveEmployeeSelfAssessmentDraft(
  appraisalId: string,
  payload: SaveSelfAssessmentDraftPayload,
): Promise<SaveSelfAssessmentDraftData> {
  const res = await api.put<SaveSelfAssessmentDraftResponse>(
    `/employee/appraisal/${appraisalId}/self-assessment/draft`,
    payload,
  );
  return res.data.data;
}
 
export async function submitEmployeeSelfAssessment(
  appraisalId: string,
  payload: SubmitSelfAssessmentPayload,
): Promise<SubmitSelfAssessmentData> {
  const res = await api.post<SubmitSelfAssessmentResponse>(
    `/employee/appraisal/${appraisalId}/self-assessment/submit`,
    payload,
  );
  return res.data.data;
}
 
export async function acknowledgeEmployeeAppraisal(
  appraisalId: string,
  payload: AcknowledgeAppraisalPayload,
): Promise<AcknowledgeAppraisalData> {
  const res = await api.post<AcknowledgeAppraisalResponse>(
    `/employee/appraisal/${appraisalId}/acknowledge`,
    payload,
  );
  return res.data.data;
}