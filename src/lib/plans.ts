// src/lib/plans.ts
"use client";

import { useEffect, useState } from "react";
import { getPublicPlans, PublicPlan, PublicPlanId } from "@/lib/api/public";

export type ModuleKey = "hris" | "payroll" | "accounting";

export const MODULES: { key: ModuleKey; label: string }[] = [
  { key: "hris", label: "HRIS" },
  { key: "payroll", label: "Payroll" },
  { key: "accounting", label: "Accounting" },
];

const MODULE_ORDER: ModuleKey[] = ["hris", "payroll", "accounting"];

export function planIdForModules(modules: ModuleKey[]): PublicPlanId | null {
  const sorted = MODULE_ORDER.filter((m) => modules.includes(m));
  if (sorted.length === 0) return null;
  if (sorted.length === 3) return "all-in-one";
  return sorted.join("-") as PublicPlanId;
}

export function modulesForPlanId(planId: string | null | undefined): ModuleKey[] {
  if (!planId) return [];
  if (planId === "all-in-one") return [...MODULE_ORDER];
  return planId.split("-").filter((p): p is ModuleKey => MODULE_ORDER.includes(p as ModuleKey));
}

export function planDisplayName(planId: string, plans: PublicPlan[]): string {
  const fromApi = plans.find((p) => p.id === planId)?.displayName;
  if (fromApi) return fromApi;
  if (planId === "all-in-one") return "All-in-One";
  return modulesForPlanId(planId)
    .map((m) => MODULES.find((x) => x.key === m)?.label ?? m)
    .join(" + ");
}

export function monthlyPrice(plan: PublicPlan | undefined): { price: number; currency: string } | null {
  const intervals = plan?.billingIntervals ?? [];
  const monthly = intervals.find((i) => i.interval?.toUpperCase() === "MONTHLY") ?? intervals[0];
  return monthly ? { price: monthly.price, currency: monthly.currency } : null;
}

export function formatMoney(price: number, currency: string) {
  return currency === "NGN" ? `₦${price.toLocaleString("en-NG")}` : `${currency} ${price.toLocaleString()}`;
}

export function usePublicPlans() {
  const [plans, setPlans] = useState<PublicPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    getPublicPlans()
      .then((res) => {
        if (active) setPlans(res.data.filter((p) => !/inactive|archived|disabled|unavailable|retired/i.test(p.status ?? "")));
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { plans, loading, error };
}