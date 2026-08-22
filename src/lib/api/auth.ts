import api from "@/lib/axios";

export interface LoginPayload {
  organizationSlug: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    organizationId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    lastLoginAt: string | null;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", payload);
  return response.data;
};
