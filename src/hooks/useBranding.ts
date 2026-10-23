// src/hooks/useBranding.ts
"use client";

import { useEffect, useState } from "react";
import { getBrandingSettings } from "@/lib/api/admin";
import type { GeneralBrandingSettings } from "@/lib/api/types/admin.types";

let cache: GeneralBrandingSettings | null = null;
let inflight = false;
let attempted = false;
const listeners = new Set<(branding: GeneralBrandingSettings | null) => void>();

async function load() {
  if (inflight) return;
  inflight = true;
  attempted = true;
  try {
    const res = await getBrandingSettings();
    cache = res.data;
  } catch {
    // Users without access to branding settings keep the default look.
  } finally {
    inflight = false;
    listeners.forEach((listener) => listener(cache));
  }
}

export function refreshBranding() {
  void load();
}

export function useBranding(): GeneralBrandingSettings | null {
  const [branding, setBranding] = useState<GeneralBrandingSettings | null>(cache);

  useEffect(() => {
    listeners.add(setBranding);
    if (!attempted) void load();
    return () => {
      listeners.delete(setBranding);
    };
  }, []);

  return branding;
}