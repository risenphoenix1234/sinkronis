export interface LoginPayload {
  organizationSlug?: string;
  email: string;
  password: string;
  twoFactorMethod?: "AUTHENTICATOR_APP" | "SMS_OTP" | "EMAIL_OTP";
}

export interface EmployeeLoginPayload {
  organizationSlug?: string;
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
  accountType: "PLATFORM_ADMIN" | "TENANT_USER";
  isPlatformAdmin: boolean;
  isManager?: boolean;
  reporteeCount?: number;
  lastLoginAt: string;
}

export interface LoginResponse {
  user: LoginUser;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface MeResponse {
  user: LoginUser;
}