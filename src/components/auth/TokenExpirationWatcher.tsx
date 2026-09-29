"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  isPublicRoute,
  isTokenExpired,
  getRemainingTokenTime,
  logoutAndRedirectToLogin,
} from "@/utils/authSession";
import { refreshAccessToken } from "@/lib/api/axios"; // see step 2 below

export default function TokenExpirationWatcher() {
  const pathname = usePathname();

  useEffect(() => {
    if (isPublicRoute(pathname)) return;

    const token =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

    if (!token) {
      logoutAndRedirectToLogin("no_token");
      return;
    }

    async function tryRefresh(reason: string) {
      try {
        await refreshAccessToken();
      } catch {
        logoutAndRedirectToLogin(reason);
      }
    }

    if (isTokenExpired(token)) {
      tryRefresh("token_expired");
      return;
    }

    const remainingTime = getRemainingTokenTime(token);
    const timer = setTimeout(() => {
      tryRefresh("timer_expired");
    }, remainingTime);

    const interval = setInterval(() => {
      if (isTokenExpired()) {
        tryRefresh("interval_detected_expired");
      }
    }, 10000);

    const handleActivity = () => {
      if (typeof document !== "undefined" && !document.hidden) {
        if (isTokenExpired()) {
          tryRefresh("focus_detected_expired");
        }
      }
    };

    window.addEventListener("focus", handleActivity);
    document.addEventListener("visibilitychange", handleActivity);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "accessToken" && (!e.newValue || isTokenExpired(e.newValue))) {
        tryRefresh("storage_event_expired");
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      window.removeEventListener("focus", handleActivity);
      document.removeEventListener("visibilitychange", handleActivity);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [pathname]);

  return null;
}