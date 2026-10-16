// src/lib/api/types/hris.ts
export type LifecycleStatus =
  "PROBATION" | "ACTIVE" | "TERMINATED" | "ON_LEAVE";
export type OperationalStatus = "ACTIVE" | "INACTIVE";
export type WorkMode = "ONSITE" | "REMOTE" | "HYBRID";

export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  departmentId: string;
  departmentName?: string;
  position: string;
  joinedDate: string;
  lifecycleStatus: LifecycleStatus;
  operationalStatus: OperationalStatus;
  workMode: WorkMode;
  monthlySalary: number;
}

export interface CreateEmployeePayload {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  departmentId: string;
  position: string;
  joinedDate: string;
  lifecycleStatus: LifecycleStatus;
  operationalStatus: OperationalStatus;
  workMode: WorkMode;
  monthlySalary: number;
}

export interface Department {
  id: string;
  name: string;
}

// Shape returned by GET /hris/employees/{employeeId}.
// This is a full "profile" view, not the flat create/update payload shape.
// Sensitive sections (bankDetails, nextOfKin, guarantor, payrollOverview) are
// permission-filtered by the backend — they may come back as {} for users
// without access, so every field inside them is optional/untyped-safe here.

export interface EmployeeDocument {
  id: string;
  type: string;
  fileName: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

export interface EmployeeProfileHeader {
  id: string;
  employeeId: string;
  name: string;
  role: string;
  department: {
    id: string;
    name: string;
  };
  status: string;
  operationalStatus: OperationalStatus;
  lifecycleStatus: LifecycleStatus;
  joinedDate: string;
  phoneNumber: string;
  profileImage: string | null;
}

export interface EmployeeProfile {
  header: EmployeeProfileHeader;
  // These sections are permission-filtered: treat as possibly empty objects
  // with unknown shape until we see a populated example from an authorized user.
  personalInformation: Record<string, unknown>;
  bankDetails: Record<string, unknown>;
  attendanceOverview: Record<string, unknown>;
  leaveOverview: Record<string, unknown>;
  payrollOverview: Record<string, unknown>;
  nextOfKin: Record<string, unknown>;
  guarantor: Record<string, unknown>;
  documents: EmployeeDocument[];
}