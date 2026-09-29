import axios from "axios";
import { logoutAndRedirectToLogin } from "@/utils/authSession";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (token && token !== "undefined" && token !== "null") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshing: Promise<string> | null = null;

export async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("No refresh token");

  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
    { refreshToken },
    { timeout: 30000 }
  );

  localStorage.setItem("accessToken", data.tokens.accessToken);
  localStorage.setItem("refreshToken", data.tokens.refreshToken);
  return data.tokens.accessToken;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const url = original?.url || "";
    const isAuthCall = url.includes("/auth/login") || url.includes("/auth/refresh");


if (!error.response && original && !original._coldStartRetry) {
      original._coldStartRetry = true;
      try {
        return await api(original);
      } catch (retryError) {
        return Promise.reject(retryError);
      }
    }


    if (error.response?.status === 401 && original && !isAuthCall && !original._retry) {
      original._retry = true;
      try {
        refreshing ??= refreshAccessToken().finally(() => {
          refreshing = null;
        });
        const token = await refreshing;
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch {
        const latest = localStorage.getItem("accessToken");
        const sent = String(original.headers?.Authorization ?? "").replace("Bearer ", "");
        if (latest && latest !== sent) {
          original.headers.Authorization = `Bearer ${latest}`;
          return api(original);
        }
        logoutAndRedirectToLogin("refresh_failed");
      }
    }
    return Promise.reject(error);
  }
);

export default api;