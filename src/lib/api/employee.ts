import axios from "axios";
import { DashboardResponse } from "./types/employeeTypes";

export async function getEmployeeDashboard() {
  const res = await axios.get<DashboardResponse>("/api/v1/employee/dashboard");
  return res.data.data; // unwrap to just the `data` payload
}

export async function clockIn() {
  await axios.post("/api/v1/employee/attendance/clock-in");
}

export async function clockOut() {
  await axios.post("/api/v1/employee/attendance/clock-out");
}

// types/employee.ts

export interface NamedResource {
  id: string;
  name: string;
}

export interface Money {
  amount: number;
  currency: string;
}

export interface ProfileHeaderData {
  employeeId: string;
  fullName: string;
  profileImage: string | null;
  role: NamedResource;
  department: NamedResource;
}

export interface PersonalDetailsData {
  fullName: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  personalEmail: string;
  maritalStatus: string;
  address: string;
  nationality: string;
}

export interface WorkDetailsData {
  employeeId: string;
  pensionId: string;
  taxId: string;
  status: string;
  department: NamedResource | Record<string, never>;
  position: NamedResource | Record<string, never>;
  manager: NamedResource | Record<string, never>;
  branch: NamedResource | Record<string, never>;
  startDate: string;
  employmentType: string;
  workMode: string;
  earnings: Money;
}

export interface EmergencyContactData {
  id: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  address: string;
}

export interface DocumentItem {
  id: string;
  documentType: string;
  documentName: string;
  originalFileName: string;
  dateAdded: string;
  downloadAvailable: boolean;
}

export interface PendingUpdateRequest {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string;
}

export interface BankDetailsData {
  accountName: string;
  accountNumberMasked: string;
  last4: string;
  bank: { code: string; name: string };
  accountType: string;
  pendingUpdateRequest: PendingUpdateRequest | null;
}

export interface EmployeeProfile {
  header: ProfileHeaderData;
  personalDetails: PersonalDetailsData;
  workDetails: WorkDetailsData;
  emergencyContact: EmergencyContactData;
  documents: DocumentItem[];
  bankDetails: BankDetailsData;
}

export interface EmployeeProfileResponse {
  success: boolean;
  message: string;
  data: EmployeeProfile;
}