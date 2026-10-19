// src/hooks/useIsManager.ts
"use client";

import { useEffect, useState } from "react";
import { getMe } from "@/lib/api/auth";

const cache = new Map<string, boolean>();
const inflight = new Map<string, Promise<boolean>>();

function storedUserId(): string {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return "";
    return JSON.parse(raw)?.id ?? "";
  } catch {
    return "";
  }
}

export function useIsManager(enabled = true): boolean | null {
  const [value, setValue] = useState<boolean | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const userId = storedUserId();
    const cached = cache.get(userId);
    if (cached !== undefined) {
      setValue(cached);
      return;
    }

    let cancelled = false;
    let request = inflight.get(userId);
    if (!request) {
      request = getMe()
        .then(({ user }) => {
          const result = user.isManager === true;
          cache.set(userId, result);
          return result;
        })
        .finally(() => {
          inflight.delete(userId);
        });
      inflight.set(userId, request);
    }

    request
      .then((result) => {
        if (!cancelled) setValue(result);
      })
      .catch(() => {
        if (!cancelled) setValue(false);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return value;
}