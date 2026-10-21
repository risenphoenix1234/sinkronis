// hooks/useEmployeeProfile.ts
"use client";

import { EmployeeProfile, getEmployeeProfile } from "@/lib/api/employee";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

interface UseEmployeeProfileResult {
  profile: EmployeeProfile | null;
  isLoading: boolean;
  error: string | null;
  errorCode: string | null;
 
  updateProfile: (patch: Partial<EmployeeProfile>) => void;
  refetch: () => void;
}

export function useEmployeeProfile(): UseEmployeeProfileResult {
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      setErrorCode(null);

      try {
        const data = await getEmployeeProfile();
        if (!cancelled) {
          setProfile(data);
        }
      } catch (err) {
        if (!cancelled) {
          if (axios.isAxiosError(err)) {
            const status = err.response?.status;
            const backendMessage =
              err.response?.data?.message || err.response?.data?.error;

            if (status === 401) {
              setError("Your session has expired. Please sign in again.");
              setErrorCode("UNAUTHORIZED");
            } else if (status === 403) {
              setError("You do not have access to the Employee Portal.");
              setErrorCode("FORBIDDEN");
            } else if (status === 404) {
              setError(
                backendMessage ||
                  "Authenticated user is not linked to an employee record.",
              );
              setErrorCode("NOT_LINKED");
            } else {
              setError(
                backendMessage ||
                  `Failed to load employee profile (${status || "error"}).`,
              );
              setErrorCode(`HTTP_${status || "UNKNOWN"}`);
            }
          } else {
            setError(
              err instanceof Error ? err.message : "Something went wrong",
            );
            setErrorCode("UNKNOWN");
          }
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);
 

  const updateProfile = useCallback((patch: Partial<EmployeeProfile>) => {
    setProfile((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  const refetch = useCallback(() => setReloadKey((k) => k + 1), []);

  return {
    profile,
    isLoading,
    error,
    errorCode,
    updateProfile,
    refetch,
  };
}