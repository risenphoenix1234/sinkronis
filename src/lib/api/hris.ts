import axios from "axios";
import api from "../api/axios";
import { ActiveAppraisalCycle, ApplyForLeavePayload, ApplyForLeaveResponse, AppraisalCycle, AppraisalTemplate, ApproveLeaveRequestPayload, ApproveLeaveRequestResp, ArchiveAppraisalTemplateResponse, AttendanceDispute, ClockInPayload, ClockInResponse, ClockOutPayload, 
  ClockOutResponse, CreateAppraisalCyclePayload, CreateAppraisalCycleResponse, CreateAppraisalTemplatePayload, CreateAppraisalTemplateResponse, CreateEmployeeFiles, CreateEmployeePayload, 
  CreateEmployeeResponse, DailyAttendanceResponse, EmployeeListItem,
   ExportAttendanceParams,
   GetActiveAppraisalCycleResponse,
   GetAppraisalReviewsParams,
   GetAppraisalReviewsResponse,
   GetAppraisalSettingsResponse,
   GetAppraisalsOverviewResponse,
   GetAppraisalTemplateDetailResponse,
   GetAppraisalTemplatesParams,
   GetAppraisalTemplatesResponse,
   GetAttendanceDisputeResponseId,
   GetAttendanceDisputesParams,
   GetAttendanceDisputesResponse,
   GetAttendanceLogsParams, GetAttendanceLogsResponse, GetAttendanceOverviewResponse, GetDailyAttendanceParams,
    GetDepartmentAttendanceSummaryResponse,
    GetEmployeeActivityParams, GetEmployeeActivityResponse, 
    GetEmployeeAttendanceParams, GetEmployeeAttendanceResponse,
     GetEmployeeDetail, GetEmployeeDetailResponse, GetEmployeesParams,
      GetEmployeesResponse, GetLeaveRequestsParams, GetLeaveRequestsResponse, GetMonthlyAttendanceParams, GetMonthlyAttendanceResponse, GetMyTodayAttendanceResponse, HrisDashboardResponse,
       InviteEmployeePayload, InviteEmployeeResponse, ImportEmployeesResponse, LeaveOverviewResponse, ListAppraisalCyclesResponse, MyTodayAttendance, OverrideAttendancePayload, OverrideAttendanceResponse, RaiseDisputePayload, RaiseDisputeResponse, RejectLeaveRequestPayload, RejectLeaveRequestResponse, ResolveDisputePayload, ResolveDisputeResponse, Role, 
       UpdateAppraisalSettingsPayload, 
       UpdateAppraisalSettingsResponse, 
       UpdateEmployeePayload,
       UpdateEmployeeResponse,
       UpdateEmployeeStatusPayload,
       UpdateEmployeeStatusResponse,
        GetConductRecordsParams,
        GetConductRecordsResponse,
        ConductOverviewData,
        ConductOverviewResponse,
        ConductRecord,
        IssueConductQueryPayload,
        CreateSuspensionPayload,
        DeleteAppraisalCycleResponse,
        LaunchAppraisalCycleResponse,
        CompleteAppraisalCycleResponse,
        GetAppraisalCycleReviewsResponse,
        AppraisalTemplatePayload,
        UpdateAppraisalTemplateResponse,
        AppraisalSettings,
        SelfAssessmentPayload,
         HrisDashboardData,
         AttendanceMetric,
        } from "./types/hrisTypes";

// Re-export so consumers can import from "@/lib/api/hris" directly
export type { HrisDashboardData, AttendanceMetric };

export const getHrisDashboard = () =>
  api.get<HrisDashboardResponse>("/hris/dashboard");

export const getEmployees = async (
  params?: GetEmployeesParams
): Promise<EmployeeListItem[]> => {
  const response = await api.get<GetEmployeesResponse>("/hris/employees", { params });
  return response.data.data; // now correctly an array
};

export const getEmployee = async (employeeId: string): Promise<GetEmployeeDetail> => {
  const response = await api.get<GetEmployeeDetailResponse>(`/hris/employees/${employeeId}`);
  return response.data.data;
};
 
// EMPLOYEE INVITE-EMPLOYEE
export const inviteEmployee = async (
  payload: InviteEmployeePayload
): Promise<InviteEmployeeResponse["data"]> => {
  const response = await api.post<InviteEmployeeResponse>("/hris/employees/invite", payload);
  return response.data.data;
};

export const importEmployees = async (
  file: File | Blob
): Promise<ImportEmployeesResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<ImportEmployeesResponse>(
    "/hris/employees/import",
    formData,
    {
      // Unset instance default JSON header so axios sets the multipart boundary dynamically
      headers: { "Content-Type": undefined },
      timeout: 60000,
    }
  );

  return response.data;
};

export const getRoles = async (): Promise<Role[]> => {
  const response = await api.get<Role[]>("/admin/roles");
  return response.data; // bare array — no envelope on this endpoint
};

export const downloadEmployeeTemplate = async (): Promise<Blob> => {
  const response = await api.get(
    "/hris/employees/import/template",
    {
      responseType: "blob",
    }
  );

  return response.data;
};


export const createEmployee = async (
  data: CreateEmployeePayload,
  files?: CreateEmployeeFiles,
): Promise<CreateEmployeeResponse["data"]> => {
  const hasFiles =
    !!files &&
    (!!files.profileImage || !!files.appointmentLetter || (files.documents?.length ?? 0) > 0);

  if (!hasFiles) {
    const response = await api.post<CreateEmployeeResponse>("/hris/employees", data);
    return response.data.data;
  }

  const formData = new FormData();
  const documentTypes = files?.documents?.map((d) => d.documentType) ?? [];

  formData.append("data", JSON.stringify(data));

  if (files?.profileImage) formData.append("profileImage", files.profileImage);
  if (files?.appointmentLetter) formData.append("appointmentLetter", files.appointmentLetter);
  files?.documents?.forEach(({ file }) => formData.append("documents", file));

  const response = await api.post<CreateEmployeeResponse>("/hris/employees", formData, {
    // Unset the instance's default JSON header so axios can set the multipart
    // boundary itself. Do NOT hardcode "multipart/form-data" here — no boundary.
    headers: { "Content-Type": undefined },
    timeout: 60000, // file uploads need more headroom than the 10s default
  });

  return response.data.data;
};

export const updateEmployee = async (
  employeeId: string,
  payload: UpdateEmployeePayload
): Promise<UpdateEmployeeResponse["data"]> => {
  const response = await api.patch<UpdateEmployeeResponse>(
    `/hris/employees/${employeeId}`,
    payload
  );
  return response.data.data;
};

export const updateEmployeeStatus = async (
  employeeId: string,
  payload: UpdateEmployeeStatusPayload
): Promise<UpdateEmployeeStatusResponse["data"]> => {
  const response = await api.patch<UpdateEmployeeStatusResponse>(
    `/hris/employees/${employeeId}/status`,
    payload
  );
  return response.data.data;
};

export const getEmployeeAttendance = async (
  employeeId: string,
  params?: GetEmployeeAttendanceParams
): Promise<GetEmployeeAttendanceResponse> => {
  const response = await api.get<GetEmployeeAttendanceResponse>(
    `/hris/employees/${employeeId}/attendance`,
    { params }
  );
  return response.data; // returning the full envelope since pagination matters here
};

export const getEmployeeActivity = async (
  employeeId: string,
  params?: GetEmployeeActivityParams
): Promise<GetEmployeeActivityResponse> => {
  const response = await api.get<GetEmployeeActivityResponse>(
    `/hris/employees/${employeeId}/activity`,
    { params }
  );
  return response.data;
};

export const getDailyAttendance = async (
  params?: GetDailyAttendanceParams
): Promise<DailyAttendanceResponse> => {
  const response = await api.get<DailyAttendanceResponse>("/hris/attendance", { params });
  return response.data;
};

export const clockIn = async (payload: ClockInPayload): Promise<ClockInResponse["data"]> => {
  const response = await api.post<ClockInResponse>("/hris/attendance/clock-in", payload);
  return response.data.data;
};

export const getMyTodayAttendance = async (): Promise<MyTodayAttendance | null> => {
  try {
    const response = await api.get<GetMyTodayAttendanceResponse>("/hris/attendance/me/today");
    return response.data.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      return null; // no linked employee — treat as "not clockable", not a hard error
    }
    throw err; // any other error (401, 500, etc.) should still propagate
  }
};

export const getConductOverview = async (): Promise<ConductOverviewData> => {
  const response = await api.get<ConductOverviewResponse>("/hris/conduct/overview");
  return response.data.data;
};

export const getConductRecords = async (params?: GetConductRecordsParams): Promise<GetConductRecordsResponse> => {
  const response = await api.get<GetConductRecordsResponse>("/hris/conduct", { params });
  return response.data;
};

export const getConductDetail = async (conductId: string): Promise<ConductRecord> => {
  const response = await api.get<{success: boolean, message: string, data: ConductRecord}>(`/hris/conduct/${conductId}`);
  return response.data.data;
};

export const issueConductQuery = async (payload: IssueConductQueryPayload): Promise<ConductRecord> => {
  const response = await api.post<{success: boolean, message: string, data: ConductRecord}>("/hris/conduct/queries", payload);
  return response.data.data;
};

export const createSuspension = async (payload: CreateSuspensionPayload): Promise<ConductRecord> => {
  const response = await api.post<{success: boolean, message: string, data: ConductRecord}>("/hris/conduct/suspensions", payload);
  return response.data.data;
};

export const transitionConductStatus = async (conductId: string, payload: { status: string, resolutionNote?: string }): Promise<ConductRecord> => {
  const response = await api.patch<{success: boolean, message: string, data: ConductRecord}>(`/hris/conduct/${conductId}/status`, payload);
  return response.data.data;
};


export const clockOut = async (
  attendanceId: string,
  payload?: ClockOutPayload
): Promise<ClockOutResponse["data"]> => {
  const response = await api.post<ClockOutResponse>(
    `/hris/attendance/${attendanceId}/clock-out`,
    payload ?? {}
  );
  return response.data.data;
};

export const getAttendanceLogs = async (
  params?: GetAttendanceLogsParams
): Promise<GetAttendanceLogsResponse> => {
  const response = await api.get<GetAttendanceLogsResponse>("/hris/attendance/logs", { params });
  return response.data;
};

export const getAttendanceOverview = async (
  params?: GetAttendanceLogsParams
): Promise<GetAttendanceOverviewResponse> => {
  const response = await api.get<GetAttendanceOverviewResponse>("/hris/attendance/overview", {
    params,
  });
  return response.data;
};

export const exportAttendanceCsv = async (params?: ExportAttendanceParams): Promise<Blob> => {
  const response = await api.get("/hris/attendance/export", {
    params,
    responseType: "blob",
  });
  return response.data;
};

export const getDepartmentAttendanceSummary = async (): Promise<GetDepartmentAttendanceSummaryResponse> => {
  const response = await api.get<GetDepartmentAttendanceSummaryResponse>(
    "/hris/attendance/departments/summary"
  );
  return response.data;
};

export const getMonthlyAttendance = async (
  params:   GetMonthlyAttendanceParams
): Promise<GetMonthlyAttendanceResponse> => {
  const response = await api.get<GetMonthlyAttendanceResponse>("/hris/attendance/monthly", {
    params,
  });
  return response.data;
};

export const getAttendanceDisputes = async (
  params?: GetAttendanceDisputesParams
): Promise<GetAttendanceDisputesResponse> => {
  const response = await api.get<GetAttendanceDisputesResponse>("/hris/attendance/disputes", {
    params,
  });
  return response.data;
};

export const getAttendanceDisputeId = async (
  disputeId: string
): Promise<GetAttendanceDisputeResponseId> => {
  const response = await api.get<GetAttendanceDisputeResponseId>(
    `/hris/attendance/disputes/${disputeId}`
  );
  return response.data;
};

export const resolveDispute = async (
  disputeId: string,
  payload: ResolveDisputePayload
): Promise<ResolveDisputeResponse["data"]> => {
  const response = await api.patch<ResolveDisputeResponse>(
    `/hris/attendance/disputes/${disputeId}`,
    payload
  );
  return response.data.data;
};

export const overrideAttendance = async (
  attendanceId: string,
  payload: OverrideAttendancePayload
): Promise<OverrideAttendanceResponse["data"]> => {
  const response = await api.patch<OverrideAttendanceResponse>(
    `/hris/attendance/${attendanceId}/override`,
    payload
  );
  return response.data.data;
};

export const raiseAttendanceDispute = async (
  attendanceId: string,
  payload: RaiseDisputePayload
): Promise<RaiseDisputeResponse["data"]> => {
  const response = await api.post<RaiseDisputeResponse>(
    `/hris/attendance/${attendanceId}/disputes`,
    payload
  );
  return response.data.data;
};

// GET /hris/leaves/overview
// No params. Returns bare { pending, approved, rejected } — no success/message/data wrapper.
export const getLeaveOverview = async (): Promise<LeaveOverviewResponse> => {
  const response = await api.get<LeaveOverviewResponse>("/hris/leaves/overview");
  return response.data;
};

// PATCH /hris/leaves/{leaveId}/reject
export const rejectLeaveReq = async (
  leaveId: string,
  payload?: RejectLeaveRequestPayload
): Promise<RejectLeaveRequestResponse["data"]> => {
  const response = await api.patch<RejectLeaveRequestResponse>(
    `/hris/leaves/${leaveId}/reject`,
    payload ?? {}
  );
  return response.data.data;
};

// GET /hris/leaves
export const getLeaveRequests = async (
  params?: GetLeaveRequestsParams
): Promise<GetLeaveRequestsResponse> => {
  const response = await api.get<GetLeaveRequestsResponse>("/hris/leaves", { params });
  return response.data; // full envelope — pagination matters here
};

// POST /hris/leaves
export const applyForLeave = async (
  payload: ApplyForLeavePayload
): Promise<ApplyForLeaveResponse["data"]> => {
  const response = await api.post<ApplyForLeaveResponse>("/hris/leaves", payload);
  return response.data.data;
};

// PATCH /hris/leaves/{leaveId}/approve
export const approveLeaveReq = async (
  leaveId: string,
  payload?: ApproveLeaveRequestPayload
): Promise<ApproveLeaveRequestResp["data"]> => {
  const response = await api.patch<ApproveLeaveRequestResp>(
    `/hris/leaves/${leaveId}/approve`,
    payload ?? {}
  );
  return response.data.data;
};

export const getAppraisalsOverview = async (): Promise<GetAppraisalsOverviewResponse> => {
  const response = await api.get<GetAppraisalsOverviewResponse>("/hris/appraisals/overview");
  return response.data;
};

export const getActiveAppraisalCycle = async (): Promise<ActiveAppraisalCycle | null> => {
  try {
    const response = await api.get<GetActiveAppraisalCycleResponse>("/hris/appraisals/cycles/active");
    return response.data.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      return null; // no open cycle — expected state, not an error
    }
    throw err;
  }
};

export const getAppraisalReviews = async (
  params?: GetAppraisalReviewsParams
): Promise<GetAppraisalReviewsResponse> => {
  const response = await api.get<GetAppraisalReviewsResponse>("/hris/appraisals/reviews", {
    params,
  });
  return response.data;
};

export const getAppraisalCycles = async (): Promise<ListAppraisalCyclesResponse> => {
  const response = await api.get<ListAppraisalCyclesResponse>("/hris/appraisals/cycles");
  return response.data;
};

export const createAppraisalCycle = async (
  payload: CreateAppraisalCyclePayload
): Promise<AppraisalCycle> => {
  const response = await api.post<CreateAppraisalCycleResponse>(
    "/hris/appraisals/cycles",
    payload
  );
  return response.data.data;
};

export const launchAppraisalCycle = async (cycleId: string): Promise<AppraisalCycle> => {
  const response = await api.post<LaunchAppraisalCycleResponse>(
    `/hris/appraisals/cycles/${cycleId}/launch`
  );
  return response.data.data;
};

export const completeAppraisalCycle = async (cycleId: string): Promise<AppraisalCycle> => {
  const response = await api.post<CompleteAppraisalCycleResponse>(
    `/hris/appraisals/cycles/${cycleId}/complete`
  );
  return response.data.data;
};

export const getAppraisalCycleReviews = async (
  cycleId: string,
  params?: { page?: number; limit?: number }
): Promise<GetAppraisalCycleReviewsResponse> => {
  const response = await api.get<GetAppraisalCycleReviewsResponse>(
    `/hris/appraisals/cycles/${cycleId}/reviews`,
    { params }
  );
  return response.data;
};

export const deleteAppraisalCycle = async (
  cycleId: string
): Promise<DeleteAppraisalCycleResponse> => {
  const response = await api.delete<DeleteAppraisalCycleResponse>(
    `/hris/appraisals/cycles/${cycleId}`,
    { data: { confirmation: "DELETE APPRAISAL CYCLE" } }
  );
  return response.data;
};

export const getAppraisalSettingsDebug = async (): Promise<unknown> => {
  const response = await api.get("/hris/appraisals/settings");
  return response.data;
};

export const updateAppraisalSettingsDebug = async (): Promise<unknown> => {
  // harmless no-op-ish update — sets to the same value your PATCH example showed
  const response = await api.patch("/hris/appraisals/settings", {
    defaultReviewFrequency: "MONTHLY",
  });
  return response.data;
};

export const getAppraisalTemplatesDebug = async (): Promise<unknown> => {
  const response = await api.get("/hris/appraisals/templates");
  return response.data;
};

export const getAppraisalTemplateDetailDebug = async (templateId: string): Promise<unknown> => {
  const response = await api.get(`/hris/appraisals/templates/${templateId}`);
  return response.data;
};

export const archiveAppraisalTemplateDebug = async (templateId: string): Promise<unknown> => {
  const response = await api.delete(`/hris/appraisals/templates/${templateId}`);
  return response.data;
};

export const createAppraisalTemplateDebug = async (): Promise<unknown> => {
  const response = await api.post("/hris/appraisals/templates", {
    name: `__SCHEMA_TEST_TEMPLATE_${Date.now()}__`,
    isDefault: false,
    sections: [
      {
        section: "KRA",
        weight: 50,
        objectives: [
          {
            title: "Test Objective",
            weight: 50,
            keyResults: [
              { description: "Test Key Result", kpiWeight: 50, target: 10, initiatives: "Test initiative" },
            ],
          },
        ],
      },
      {
        section: "BEHAVIOURAL",
        weight: 50,
        objectives: [
          {
            title: "Test Behavioural Objective",
            weight: 50,
            keyResults: [
              { description: "Test Behavioural Key Result", kpiWeight: 50, target: 10, initiatives: "Test initiative" },
            ],
          },
        ],
      },
    ],
     
reflectionQuestions: [{ id: "resource_01SCHEMATEST0000000000001", question: "Sample reflection question" }],
managerReviewQuestions: [{ id: "resource_01SCHEMATEST0000000000002", question: "Sample manager question" }],
    quarterScoring: true,
    signOffTypes: ["EMPLOYEE"],
  });
  return response.data;
};

// lib/api/hris.ts — fix updateAppraisalTemplateDebug's payload

export const updateAppraisalTemplateDebug = async (templateId: string): Promise<unknown> => {
  const response = await api.patch(`/hris/appraisals/templates/${templateId}`, {
    name: "__SCHEMA_TEST_TEMPLATE_EDITED__",
    description: "Schema probe edit — safe to delete",
    sections: [
      {
        section: "KRA",
        weight: 50,
        objectives: [
          {
            title: "Test Objective",
            weight: 50,
            keyResults: [
              { description: "Test Key Result", kpiWeight: 50, target: 10, initiatives: "Test initiative" },
            ],
          },
        ],
      },
      {
        section: "BEHAVIOURAL",
        weight: 50,
        objectives: [
          {
            title: "Test Behavioural Objective",
            weight: 50,
            keyResults: [
              { description: "Test Behavioural Key Result", kpiWeight: 50, target: 10, initiatives: "Test initiative" },
            ],
          },
        ],
      },
    ],
    reflectionQuestions: [
      { id: "resource_01SCHEMATEST0000000000001", question: "Sample reflection question", required: true },
    ],
    managerReviewQuestions: [
      { id: "resource_01SCHEMATEST0000000000002", question: "Sample manager question", required: true },
    ],
    quarterScoring: true,
    signOffTypes: ["EMPLOYEE"],
    isDefault: false,
  });
  return response.data;
};

export const getAppraisalSettings = async (): Promise<AppraisalSettings> => {
  const response = await api.get<GetAppraisalSettingsResponse>("/hris/appraisals/settings");
  return response.data.data;
};

export const updateAppraisalSettings = async (
  payload: UpdateAppraisalSettingsPayload
): Promise<AppraisalSettings> => {
  const response = await api.patch<UpdateAppraisalSettingsResponse>(
    "/hris/appraisals/settings",
    payload
  );
  return response.data.data;
};

export const getAppraisalTemplates = async (
  params?: GetAppraisalTemplatesParams
): Promise<GetAppraisalTemplatesResponse> => {
  const response = await api.get<GetAppraisalTemplatesResponse>("/hris/appraisals/templates", {
    params,
  });
  return response.data;
};

export const getAppraisalTemplateDetail = async (
  templateId: string
): Promise<AppraisalTemplate> => {
  const response = await api.get<GetAppraisalTemplateDetailResponse>(
    `/hris/appraisals/templates/${templateId}`
  );
  return response.data.data;
};

export const createAppraisalTemplate = async (
  payload: CreateAppraisalTemplatePayload
): Promise<AppraisalTemplate> => {
  const response = await api.post<CreateAppraisalTemplateResponse>(
    "/hris/appraisals/templates",
    payload
  );
  return response.data.data;
};

export const updateAppraisalTemplate = async (
  templateId: string,
  payload: AppraisalTemplatePayload
): Promise<AppraisalTemplate> => {
  const response = await api.patch<UpdateAppraisalTemplateResponse>(
    `/hris/appraisals/templates/${templateId}`,
    payload
  );
  return response.data.data;
};

export const archiveAppraisalTemplate = async (
  templateId: string
): Promise<AppraisalTemplate> => {
  const response = await api.delete<ArchiveAppraisalTemplateResponse>(
    `/hris/appraisals/templates/${templateId}`
  );
  return response.data.data;
};

//debug

// lib/api/hris.ts — temporary, for schema discovery

export const createAppraisalCycleDebug = async (): Promise<unknown> => {
  const response = await api.post("/hris/appraisals/cycles", {
    cycleName: `__WORKFLOW_TEST_${Date.now()}__`,
    templateId: "cmttps5hv00014ntq2z6k4zh8", // real, confirmed template id from earlier
    periodFrom: "2026-10-01",
    periodTo: "2026-12-31",
    submissionDeadline: "2027-01-07", // fixes the placeholder bug — was never actually tested
    launchMode: "SAVE_AS_DRAFT",
  });
  return response.data;
};

export const launchAppraisalCycleDebug = async (cycleId: string): Promise<unknown> => {
  const response = await api.post(`/hris/appraisals/cycles/${cycleId}/launch`);
  return response.data;
};

export const getCycleReviewsDebug = async (cycleId: string): Promise<unknown> => {
  const response = await api.get(`/hris/appraisals/cycles/${cycleId}/reviews`);
  return response.data;
};

export const getAppraisalDetail = async (appraisalId: string): Promise<Record<string, unknown>> => {
  const response = await api.get<{ success: boolean; message: string; data: Record<string, unknown> }>(
    `/hris/appraisals/${appraisalId}`
  );
  return response.data.data;
};

export const getAppraisalDetailDebug = async (appraisalId: string): Promise<unknown> => {
  const response = await api.get(`/hris/appraisals/${appraisalId}`);
  return response.data;
};

export const completeGoalsDebug = async (appraisalId: string): Promise<unknown> => {
  const response = await api.post(`/hris/appraisals/${appraisalId}/goals/complete`);
  return response.data;
};

export const rateGoalDebug = async (appraisalId: string, goalId: string): Promise<unknown> => {
  const response = await api.patch(`/hris/appraisals/${appraisalId}/goals/${goalId}`, {
    rating: 4,
    comment: "Identified and resolved 3 bottlenecks, saving ~5 hrs/week.",
  });
  return response.data;
};

export const getSelfAssessmentDebug = async (appraisalId: string): Promise<unknown> => {
  const response = await api.get(`/hris/appraisals/${appraisalId}/self-assessment`);
  return response.data;
};

export const getManagerReviewDebug = async (appraisalId: string): Promise<unknown> => {
  const response = await api.get(`/hris/appraisals/${appraisalId}/manager-review`);
  return response.data;
};

export const getHrApprovalDebug = async (appraisalId: string): Promise<unknown> => {
  const response = await api.get(`/hris/appraisals/${appraisalId}/hr-approval`);
  return response.data;
};

export const acknowledgeAppraisalDebug = async (appraisalId: string): Promise<unknown> => {
  const response = await api.post(`/hris/appraisals/${appraisalId}/acknowledge`, {});
  return response.data;
};

export const deleteAppraisalCycleDebug = async (cycleId: string): Promise<unknown> => {
  const response = await api.delete(`/hris/appraisals/cycles/${cycleId}`, {
    data: { confirmation: "DELETE APPRAISAL CYCLE" },
  });
  return response.data;
};

export const proposeGoalDebug = async (appraisalId: string): Promise<unknown> => {
  const response = await api.post(`/hris/appraisals/${appraisalId}/goals`, {
    title: "Process Optimisation Initiative",
    description: "Identify and eliminate 3 operational inefficiencies.",
    successCriteria: "Reduce average process time by 20% across 3 identified bottlenecks.", // was missing
    targetDate: "2026-12-15",
  });
  return response.data;
};

export const submitSelfAssessmentDebug = async (appraisalId: string): Promise<unknown> => {
  const response = await api.post(`/hris/appraisals/${appraisalId}/self-assessment`, {
    sections: [
      {
        section: "KRA",
        totalWeight: 50,
        objectives: [
          {
            title: "Test Objective",
            weight: 50,
            keyResults: [
              {
                keyResult: "Test Key Result",
                kpiWeight: 50,
                target: 10,
                comment: "Delivered on target.", // kept — wasn't rejected as unrecognized
              },
            ],
          },
        ],
      },
      {
        section: "BEHAVIOURAL",
        totalWeight: 50,
        objectives: [
          {
            title: "Test Behavioural Objective",
            weight: 50,
            keyResults: [
              {
                keyResult: "Test Behavioural Key Result",
                kpiWeight: 50,
                target: 10,
                comment: "Delivered on target.",
              },
            ],
          },
        ],
      },
    ],
    submit: true,
  });
  return response.data;
};

export const submitManagerReviewDebug = async (appraisalId: string): Promise<unknown> => {
  const response = await api.post(`/hris/appraisals/${appraisalId}/manager-review`, {
    overallFeedback: "Strong quarter — consistently met KRA targets and showed initiative on process improvements.",
    recommendation: "ON_TRACK", // real enum: ON_TRACK | NEEDS_IMPROVEMENT | EXCEEDS_EXPECTATION
    submit: true,
  });
  return response.data;
};

export const submitHrApprovalDebug = async (appraisalId: string): Promise<unknown> => {
  const response = await api.post(`/hris/appraisals/${appraisalId}/hr-approval`, {
    decision: "APPROVED", // fixed — was "APPROVE"
  });
  return response.data;
};

export const signOffAppraisalDebug = async (appraisalId: string): Promise<unknown> => {
  const response = await api.post(`/hris/appraisals/${appraisalId}/sign-off`, {
    signOffType: "EMPLOYEE", // matches templateSnapshot.signOffTypes from step 1's response
  });
  return response.data;
};

export const submitSelfAssessment = async (
  appraisalId: string,
  payload: SelfAssessmentPayload
): Promise<unknown> => {
  const response = await api.post(
    `/hris/appraisals/${appraisalId}/self-assessment`,
    payload
  );
  return response.data;
};

// Add these near getEmployeeActivity in hris.ts

export const getEmployeeLeaveHistory = async (
  employeeId: string,
  params?: { page?: number; limit?: number },
): Promise<{ success: boolean; message: string; data: unknown[] }> => {
  const response = await api.get(`/hris/employees/${employeeId}/leave-history`, { params });
  return response.data;
};

// Permission-protected per the Swagger description — expect a 403 for
// non-payroll-authorized roles and handle it as a distinct empty state,
// not a generic load error.
export const getEmployeePayrollHistory = async (
  employeeId: string,
  params?: { page?: number; limit?: number },
): Promise<{ success: boolean; message: string; data: unknown[] }> => {
  const response = await api.get(`/hris/employees/${employeeId}/payroll-history`, { params });
  return response.data;
};

export const getEmployeeAppraisals = async (
  employeeId: string,
): Promise<{ success: boolean; message: string; data: unknown[] }> => {
  const response = await api.get(`/hris/employees/${employeeId}/appraisals`);
  return response.data;
};

export const getEmployeeConduct = async (
  employeeId: string,
): Promise<{ success: boolean; message: string; data: unknown[] }> => {
  const response = await api.get(`/hris/employees/${employeeId}/conduct`);
  return response.data;
};

// Downloads a specific employee document. Returns a blob — caller is
// responsible for turning it into an <a download> link, same pattern as
// downloadEmployeeTemplate.
export const downloadEmployeeDocument = async (
  employeeId: string,
  documentId: string,
): Promise<Blob> => {
  const response = await api.get(
    `/hris/employees/${employeeId}/documents/${documentId}/download`,
    { responseType: "blob" },
  );
  return response.data;
};