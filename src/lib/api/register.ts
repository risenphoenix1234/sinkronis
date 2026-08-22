import api from "@/lib/axios";

export interface RegisterPayload {
  organization: {
    name: string;
    slug: string;
    email: string;
    country: string;
    currency: string;
  };
  admin: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
}

export interface RegisterResponse {
  organization: { id: string; slug: string; name: string };
  user: { id: string; email: string };
  tokens: { accessToken: string; refreshToken: string };
}

export const registerOrganization = async (
  payload: RegisterPayload,
): Promise<RegisterResponse> => {
  const res = await api.post<RegisterResponse>("/auth/register", payload);
  return res.data;
};
