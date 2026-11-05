// src/lib/api/public.ts
import axios from "axios";

// Public endpoints: no auth. Plain axios so the logged-in interceptors
// (token attach, refresh, logout redirect) never run for visitors.
const publicApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

export type PublicPlanId =
  | "hris"
  | "payroll"
  | "accounting"
  | "hris-payroll"
  | "hris-accounting"
  | "payroll-accounting"
  | "all-in-one";

export interface PublicBillingInterval {
  interval: string;
  price: number;
  currency: string;
}

export type CompanyRegistrationType = "RC" | "BN" | "LP" | "LLP";

export interface PublicPlan {
  id: string;
  displayName: string;
  description?: string;
  includedModules?: string[];
  features?: string[];
  billingIntervals?: PublicBillingInterval[];
  trial?: unknown;
  status?: string;
}

export interface PublicPlansResponse {
  success: boolean;
  data: PublicPlan[];
}

export interface TenantAccessRequestPayload {
  companyName: string;
  applicantFirstName: string;
  applicantLastName: string;
  applicantEmail: string;
  applicantPhone?: string;
  country: string;
  industry?: string;
  message?: string;
  planId: PublicPlanId;
  billingCycle: "MONTHLY";
  registrationType?: CompanyRegistrationType;
  registrationNumber?: string;
  idempotencyKey: string;
}

export interface TenantAccessRequestResponse {
  success: boolean;
  message: string;
  data: {
    requestReference: string;
    status: "PENDING";
    submittedAt: string;
  };
}

export const getPublicPlans = async () => {
  const { data } = await publicApi.get<PublicPlansResponse>("/public/plans");
  return data;
};

export const submitTenantAccessRequest = async (payload: TenantAccessRequestPayload) => {
  const { data } = await publicApi.post<TenantAccessRequestResponse>(
    "/public/tenant-access-requests",
    payload,
  );
  return data;
};