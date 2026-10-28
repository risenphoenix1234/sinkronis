// src/app/tenant-admin/my-plan/renew/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getMyPlanOverview, getMyPlanPlans, renewSubscription } from "@/lib/api/admin";
import { MyPlanOverviewData, MyPlanPlan, PlanKey } from "@/lib/api/types/admin.types";
import {
  RenewalBillingCycle,
  RenewalPeriodPolicy,
  SubscriptionPaymentAttempt,
} from "@/lib/api/types/renewal.types";
import Loader from "@/components/ui/Loader";

interface RenewalPreview {
  planName: string;
  billingCycle: string;
  currency: string;
  subtotal: number | null;
  tax: number | null;
  total: number | null;
  periodPolicy: RenewalPeriodPolicy | string | null;
}

const INTENT_PREFIX = "sinkronis:renewal-intent:";
const PAYMENT_REF_KEY = "sinkronis:renewal-reference";

function getIntentKey(planKey: string, cycle: string): string {
  const storageKey = `${INTENT_PREFIX}${planKey}:${cycle}`;
  try {
    const existing = sessionStorage.getItem(storageKey);
    if (existing) return existing;
    const fresh = `tenant-renewal-${crypto.randomUUID()}`;
    sessionStorage.setItem(storageKey, fresh);
    return fresh;
  } catch {
    return `tenant-renewal-${planKey}-${cycle}`;
  }
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) {
    return Number(value);
  }
  return null;
}

function deepFind(node: unknown, keys: string[], depth = 0): number | null {
  if (!node || typeof node !== "object" || depth > 5) return null;
  const obj = node as Record<string, unknown>;
  for (const k of keys) {
    if (k in obj) {
      const direct = toNumber(obj[k]);
      if (direct !== null) return direct;
      const inner = obj[k];
      if (inner && typeof inner === "object") {
        const o = inner as Record<string, unknown>;
        const nested = toNumber(o.amount) ?? toNumber(o.value);
        if (nested !== null) return nested;
      }
    }
  }
  for (const v of Object.values(obj)) {
    const found = deepFind(v, keys, depth + 1);
    if (found !== null) return found;
  }
  return null;
}

function readName(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const v = value as Record<string, unknown>;
    if (typeof v.name === "string") return v.name;
    if (typeof v.key === "string") return v.key;
  }
  return "";
}

function normalisePreview(res: unknown): RenewalPreview {
  const root = ((res as Record<string, unknown>)?.data ?? res ?? {}) as Record<string, unknown>;
  const p = ((root.preview as Record<string, unknown>) ?? root) as Record<string, unknown>;
  return {
    planName: readName(p.selectedPlan) || readName(p.plan) || "",
    billingCycle: typeof p.billingCycle === "string" ? p.billingCycle : "",
    currency: typeof p.currency === "string" ? p.currency : "NGN",
    subtotal: deepFind(root, ["subtotal", "subTotal", "subtotalAmount"]),
    tax: deepFind(root, ["tax", "taxAmount", "vat"]),
    total: deepFind(root, ["total", "totalAmount", "amountDue", "grandTotal"]),
    periodPolicy: typeof p.periodPolicy === "string" ? p.periodPolicy : null,
  };
}

function money(n: number | null, currency: string) {
  if (n === null) return "—";
  const symbol = currency === "NGN" ? "₦" : `${currency} `;
  return `${symbol}${n.toLocaleString()}`;
}

const policyText: Record<string, string> = {
  EXTEND_FROM_PAID_THROUGH:
    "Your subscription is still within its paid period, so renewal extends from your current expiry date.",
  START_AT_VERIFIED_PAYMENT:
    "Your subscription has expired, so the new period starts only after your payment is verified.",
};

export default function RenewSubscriptionPage() {
  const [overview, setOverview] = useState<MyPlanOverviewData | null>(null);
  const [plans, setPlans] = useState<MyPlanPlan[]>([]);
  const [planKey, setPlanKey] = useState<PlanKey | "">("");
  const [cycle, setCycle] = useState<RenewalBillingCycle>("MONTHLY");
  const [automaticRenewal, setAutomaticRenewal] = useState(true);
  const [preview, setPreview] = useState<RenewalPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [ov, pl] = await Promise.all([getMyPlanOverview(), getMyPlanPlans()]);
        setOverview(ov.data);
        setPlans(pl.data.plans);
        const current = pl.data.currentPlanKey as PlanKey;
        setPlanKey(current);
        setCycle(ov.data.subscription.billingCycle ?? "MONTHLY");
        setAutomaticRenewal(ov.data.subscription.automaticRenewal ?? true);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load your plan.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const selectedPlan = useMemo(
    () => plans.find((p) => p.key === planKey) ?? null,
    [plans, planKey],
  );

  const resetPreview = () => setPreview(null);

  const buildBody = (confirm: boolean) => ({
    planKey: planKey as PlanKey,
    billingCycle: cycle,
    confirm,
    automaticRenewal,
    idempotencyKey: getIntentKey(planKey, cycle),
  });

  const handlePreview = async () => {
    if (!planKey) return;
    setBusy(true);
    setError(null);
    try {
      const res = await renewSubscription(buildBody(false));
      setPreview(normalisePreview(res));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not preview the renewal.");
    } finally {
      setBusy(false);
    }
  };

  const handleConfirm = async () => {
    if (!planKey) return;
    setBusy(true);
    setError(null);
    try {
      const res = await renewSubscription(buildBody(true));
      const payment = (res?.data?.payment ?? null) as SubscriptionPaymentAttempt | null;
      if (!payment?.reference) {
        setError("Checkout was not created. Please try again.");
        return;
      }
      try {
        sessionStorage.setItem(PAYMENT_REF_KEY, payment.reference);
      } catch {
        // ignore storage failures
      }
      if (payment.authorizationUrl) {
        window.location.href = payment.authorizationUrl;
      } else {
        window.location.href = `/tenant-admin/my-plan/renew/status?reference=${encodeURIComponent(payment.reference)}`;
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not start checkout.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Loader variant="page" label="Loading renewal" />;

  if (!overview) {
    return <p className="p-6 text-sm text-red-500">{error || "Something went wrong."}</p>;
  }

  const status = overview.subscription.status;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Renew subscription</h2>
            <p className="mt-1 text-sm text-slate-500">
              Current plan: {overview.currentPlan.planName} · Status: {status}
            </p>
          </div>
          <Link
            href="/tenant-admin/my-plan"
            className="text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            Back
          </Link>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Plan</label>
            <select
              value={planKey}
              onChange={(e) => {
                setPlanKey(e.target.value as PlanKey);
                resetPreview();
              }}
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
            >
              {plans.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.name}
                  {p.isCurrent ? " (current)" : ""}
                </option>
              ))}
            </select>
            {selectedPlan?.description && (
              <p className="mt-1 text-xs text-slate-500">{selectedPlan.description}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Billing cycle
            </label>
            <div className="mt-1 flex gap-2">
              {(["MONTHLY", "YEARLY"] as RenewalBillingCycle[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setCycle(c);
                    resetPreview();
                  }}
                  className={`rounded-md border px-4 py-2 text-sm font-medium ${
                    cycle === c
                      ? "border-sky-600 bg-sky-50 text-sky-700"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {c === "MONTHLY" ? "Monthly" : "Yearly"}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={automaticRenewal}
              onChange={(e) => {
                setAutomaticRenewal(e.target.checked);
                resetPreview();
              }}
              className="h-4 w-4 rounded border-slate-300"
            />
            Renew automatically
          </label>
        </div>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        {!preview && (
          <button
            type="button"
            onClick={handlePreview}
            disabled={busy || !planKey}
            className="mt-5 rounded-md bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60"
          >
            {busy ? "Calculating..." : "Preview renewal"}
          </button>
        )}
      </div>

      {preview && (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-800">Renewal summary</h3>
          <div className="mt-3 divide-y divide-slate-100 text-sm">
            <div className="flex justify-between py-2.5">
              <span className="text-slate-600">Plan</span>
              <span className="text-slate-800">{preview.planName || selectedPlan?.name || "—"}</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="text-slate-600">Billing cycle</span>
              <span className="text-slate-800">{preview.billingCycle || cycle}</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="text-slate-600">Subtotal</span>
              <span className="text-slate-800">{money(preview.subtotal, preview.currency)}</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="text-slate-600">Tax</span>
              <span className="text-slate-800">{money(preview.tax, preview.currency)}</span>
            </div>
            <div className="flex justify-between py-2.5 font-semibold">
              <span className="text-slate-800">Total</span>
              <span className="text-sky-600">{money(preview.total, preview.currency)}</span>
            </div>
          </div>

          {preview.periodPolicy && (
            <p className="mt-3 rounded-md bg-slate-50 p-3 text-xs text-slate-600">
              {policyText[preview.periodPolicy] ?? preview.periodPolicy}
            </p>
          )}

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={busy}
              className="rounded-md bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60"
            >
              {busy ? "Starting checkout..." : "Confirm and pay"}
            </button>
            <button
              type="button"
              onClick={resetPreview}
              disabled={busy}
              className="rounded-md border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Change
            </button>
          </div>
        </div>
      )}
    </div>
  );
}