"use client";

import { useState } from "react";
import { login, LoginPayload, LoginResponse } from "@/lib/api/auth";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (payload: LoginPayload): Promise<LoginResponse> => {
    setLoading(true);
    setError(null);

    try {
      const data = await login(payload);
      localStorage.setItem("accessToken", data.tokens.accessToken);
      localStorage.setItem("refreshToken", data.tokens.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        "Invalid email or password. Please try again.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { signIn, loading, error };
}
