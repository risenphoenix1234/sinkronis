// src/lib/api/auth.ts
import api from "../api/axios";
import {
  EmployeeLoginPayload,
  LoginPayload,
  LoginResponse,
  MeResponse,
} from "./types/auth.types";

// Re-export so consumers can import from "@/lib/api/auth" directly
export type { EmployeeLoginPayload, LoginPayload, LoginResponse };

export const login = async (payload: LoginPayload) => {
  const { data } = await api.post<LoginResponse>("/auth/login", payload);
  return data;
};

export const employeeLogin = async (
  payload: EmployeeLoginPayload,
): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>("/auth/login", payload);
  return data;
};

export interface AcceptInvitationPayload {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface AcceptInvitationResponse {
  message: string;
  organization: {
    name: string;
    slug: string;
  };
  email: string;
}

export const acceptTenantInvitation = async (payload: AcceptInvitationPayload) => {
  const { data } = await api.post<AcceptInvitationResponse>(
    "/auth/tenant-invitations/accept",
    payload
  );
  return data;
};

export const getMe = async () => {
  const { data } = await api.get<MeResponse>("/auth/me");
  return data;
};
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export const refreshToken = async (currentRefreshToken: string) => {
  const { data } = await api.post<RefreshTokenResponse>("/auth/refresh", {
    refreshToken: currentRefreshToken,
  });
  return data;
};

export interface ForgotPasswordPayload {
  email: string;
  organizationSlug?: string;
}

export interface ForgotPasswordResponse {
  message: string;
  expiresInSeconds: number;
}

export const forgotPassword = async (payload: ForgotPasswordPayload) => {
  const { data } = await api.post<ForgotPasswordResponse>(
    "/auth/forgot-password",
    payload,
  );
  return data;
};

export interface VerifyResetOtpPayload {
  email: string;
  otp: string;
  organizationSlug?: string;
}

export interface VerifyResetOtpResponse {
  message: string;
  resetToken: string;
}

export const verifyResetOtp = async (payload: VerifyResetOtpPayload) => {
  const { data } = await api.post<VerifyResetOtpResponse>(
    "/auth/forgot-password/verify-otp",
    payload,
  );
  return data;
};

export interface ResetPasswordPayload {
  resetToken: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  message?: string;
}

export const resetPassword = async (payload: ResetPasswordPayload) => {
  const { data } = await api.post<ResetPasswordResponse>(
    "/auth/reset-password",
    payload,
  );
  return data;
};