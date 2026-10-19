// src/hooks/useManagerList.ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import type {
  ManagerListResponse,
  ManagerPagination,
} from "@/lib/api/types/manager.types";

export function useManagerList<T, P extends object>(
  fetcher: (
    params: P & { page: number; limit: number },
  ) => Promise<ManagerListResponse<T>>,
  params: P,
  limit = 25,
) {
  const [rows, setRows] = useState<T[]>([]);
  const [pagination, setPagination] = useState<ManagerPagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const fetcherRef = useRef(fetcher);
  const paramsRef = useRef(params);
  fetcherRef.current = fetcher;
  paramsRef.current = params;

  const key = JSON.stringify(params);

  useEffect(() => {
    setPage(1);
  }, [key]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetcherRef
      .current({ ...paramsRef.current, page, limit })
      .then((res) => {
        if (cancelled) return;
        setRows(res.data ?? []);
        setPagination(res.pagination ?? null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (axios.isAxiosError(err) && err.response?.status === 403) {
          setError("You don't have permission to view this.");
        } else if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message ?? "Couldn't load this data.");
        } else {
          setError("Couldn't load this data.");
        }
        setRows([]);
        setPagination(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [key, page, limit, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  return { rows, pagination, page, setPage, loading, error, reload };
}