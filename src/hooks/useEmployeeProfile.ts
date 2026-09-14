// hooks/useEmployeeProfile.ts
"use client";

import { EmployeeProfile, EmployeeProfileResponse } from "@/lib/api/employee";
import { useCallback, useEffect, useState } from "react";

interface UseEmployeeProfileResult {
  profile: EmployeeProfile | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (patch: Partial<EmployeeProfile>) => void;
  refetch: () => void;
}

export function useEmployeeProfile(): UseEmployeeProfileResult {
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/employee/profile");
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);

        const json: EmployeeProfileResponse = await res.json();
        if (!json.success) throw new Error(json.message || "Failed to load profile");

        if (!cancelled) setProfile(json.data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        if (!cancelled) setIsLoading(false);
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

  return { profile, isLoading, error, updateProfile, refetch };
}