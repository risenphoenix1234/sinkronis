export interface LoginPayload {
  organizationSlug: string;
  email: string;
  password: string;
}

export interface LoginUser {
  id: string;
  organizationId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  lastLoginAt: string;
}

export interface LoginResponse {
  user: LoginUser;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}
export interface LoginUser {
  id: string;
  organizationId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  accountType: "PLATFORM_ADMIN" | "TENANT_USER";
  isPlatformAdmin: boolean;
  lastLoginAt: string;
}
export interface MeResponse {
  user: LoginUser;
}