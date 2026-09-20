import axios from "axios";
import { logoutAndRedirectToLogin } from "@/utils/authSession";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (token && token !== "undefined" && token !== "null") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle expired/invalid tokens globally: reload to login page
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || "";
      // Only redirect if the 401 is not from the login form itself
      if (!requestUrl.includes("/auth/login")) {
        logoutAndRedirectToLogin("api_401");
      }
    }
    return Promise.reject(error);
  }
);

export default api;