// src/hooks/useBanks.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  getBanks,
  type Bank,
  type BankDirectoryMetadata,
  type BankDirectoryResponse,
} from "@/lib/api/common";

const CLIENT_TTL_MS = 10 * 60 * 1000;

let cache: {
  banks: Bank[];
  metadata?: BankDirectoryMetadata;
  at: number;
} | null = null;
let inflight: Promise<BankDirectoryResponse> | null = null;

function toMessage(err: unknown): string {
  if (
    axios.isAxiosError(err) &&
    err.response?.data?.details?.reasonCode === "BANK_DIRECTORY_UNAVAILABLE"
  ) {
    return "The bank list is temporarily unavailable. Please try again.";
  }
  return "Couldn't load the bank list. Please try again.";
}

export function useBanks() {
  const [banks, setBanks] = useState<Bank[]>(cache?.banks ?? []);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState<string | null>(null);
  const [stale, setStale] = useState(cache?.metadata?.stale ?? false);

  const load = useCallback(async (force = false) => {
    if (!force && cache && Date.now() - cache.at < CLIENT_TTL_MS) {
      setBanks(cache.banks);
      setStale(cache.metadata?.stale ?? false);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (!inflight) {
        inflight = getBanks().finally(() => {
          inflight = null;
        });
      }
      const res = await inflight;
      const list = [...res.data]
        .filter((bank) => bank.active)
        .sort((a, b) => a.name.localeCompare(b.name));
      cache = { banks: list, metadata: res.metadata, at: Date.now() };
      setBanks(list);
      setStale(res.metadata?.stale === true);
    } catch (err) {
      setError(toMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const reload = useCallback(() => load(true), [load]);

  return { banks, loading, error, stale, reload };
}