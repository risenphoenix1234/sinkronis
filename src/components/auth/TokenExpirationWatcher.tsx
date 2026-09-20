"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  isPublicRoute,
  isTokenExpired,
  getRemainingTokenTime,
  logoutAndRedirectToLogin,
} from "@/utils/authSession";

export default function TokenExpirationWatcher() {
  const pathname = usePathname();

  useEffect(() => {
    // Skip token checks on public and authentication routes
    if (isPublicRoute(pathname)) {
      return;
    }

    const token =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

    // If on a protected route with no valid token, redirect to login
    if (!token) {
      logoutAndRedirectToLogin("no_token");
      return;
    }

    // If token is already expired, reload to login immediately
    if (isTokenExpired(token)) {
      logoutAndRedirectToLogin("token_expired");
      return;
    }

    // Set precise timeout for the moment token expires
    const remainingTime = getRemainingTokenTime(token);
    const timer = setTimeout(() => {
      logoutAndRedirectToLogin("timer_expired");
    }, remainingTime);

    // Regular interval (every 10s) as fallback for OS sleep / background tab throttling
    const interval = setInterval(() => {
      if (isTokenExpired()) {
        logoutAndRedirectToLogin("interval_detected_expired");
      }
    }, 10000);

    // Immediate check when tab becomes active / window gains focus
    const handleActivity = () => {
      if (typeof document !== "undefined" && !document.hidden) {
        if (isTokenExpired()) {
          logoutAndRedirectToLogin("focus_detected_expired");
        }
      }
    };

    window.addEventListener("focus", handleActivity);
    document.addEventListener("visibilitychange", handleActivity);

    // Synchronize token state changes across browser tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "accessToken" && (!e.newValue || isTokenExpired(e.newValue))) {
        logoutAndRedirectToLogin("storage_event_expired");
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
