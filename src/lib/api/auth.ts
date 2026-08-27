import api from "./axios";
import { LoginPayload, LoginResponse, MeResponse } from "./types/auth.types";

export const login = async (payload: LoginPayload) => {
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
