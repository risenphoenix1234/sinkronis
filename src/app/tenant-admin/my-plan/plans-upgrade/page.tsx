// app/tenant-admin/my-plan/plans-upgrade/page.tsx
"use client";

import { useState } from "react";
import { FiCheck } from "react-icons/fi";
import { planTiers, naira } from "@/lib/plan-data";

const ANNUAL_DISCOUNT_PCT = 10;

export default function PlansUpgradePage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  const getDisplayPrice = (price: number | null) => {
    if (price === null) return null;
    if (billingCycle === "monthly") return price;
    return Math.round((price * 12 * (1 - ANNUAL_DISCOUNT_PCT / 100)) / 12);
  };

  const handlePlanAction = (planId: string, isCurrent: boolean) => {
    if (planId === "enterprise") {
      console.log("Contact sales");
      return;
    }
    console.log(isCurrent ? "Current plan, no action" : `Switching to ${planId}`);
  };

  return (
    <div className="space-y-6">
      {/* Billing cycle toggle */}
      <div className="flex justify-center">
        <div className="flex items-center rounded-full border border-slate-200 bg-white p-1">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              billingCycle === "monthly" ? "bg-slate-900 text-white" : "text-slate-500"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("annual")}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium ${
              billingCycle === "annual" ? "bg-slate-900 text-white" : "text-slate-500"
            }`}
          >
            Annual
            <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
              Save {ANNUAL_DISCOUNT_PCT}%
            </span>
          </button>
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-3 gap-5">
        {planTiers.map((tier) => {
          const displayPrice = getDisplayPrice(tier.price);
          return (
            <div
              key={tier.id}
              className={`relative flex flex-col rounded-xl border bg-white p-6 ${
                tier.isMostPopular
                  ? "border-sky-500 shadow-md ring-1 ring-sky-100"
                  : "border-slate-200"
              }`}
            >
              {tier.isMostPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-sky-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                  Most Popular
                </span>
              )}

              <h3 className="mt-2 text-lg font-semibold text-slate-900">{tier.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{tier.tagline}</p>

              <div className="mt-4">
                {displayPrice !== null ? (
                  <>
                    <span className="text-2xl font-semibold text-slate-900">
                      {naira(displayPrice)}
                    </span>
                    <span className="text-sm text-slate-400"> /month</span>
                  </>
                ) : (
                  <span className="text-base font-medium text-slate-700">{tier.priceSuffix}</span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-slate-400">{tier.seatsLimit}</p>

              <ul className="mt-5 flex-1 space-y-2.5">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                    <FiCheck size={15} className="mt-0.5 shrink-0 text-emerald-500" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePlanAction(tier.id, tier.isCurrent)}
                disabled={tier.isCurrent}
                className={`mt-6 w-full rounded-md px-4 py-2.5 text-sm font-medium ${
                  tier.isCurrent
                    ? "cursor-not-allowed border border-slate-200 text-slate-400"
                    : tier.id === "enterprise"
                    ? "border border-slate-200 text-slate-700 hover:bg-slate-50"
                    : tier.id === "starter"
                    ? "border border-slate-200 text-slate-700 hover:bg-slate-50"
                    : "bg-sky-600 text-white hover:bg-sky-700"
                }`}
              >
                {tier.isCurrent
                  ? "Current Plan"
                  : tier.id === "enterprise"
                  ? "Contact Sales"
                  : tier.id === "starter"
                  ? "Downgrade to Starter"
                  : "Upgrade to Business"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Full Feature Comparison */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
        <button className="text-sm font-medium text-sky-600 hover:underline">
          Full Feature Comparison
        </button>
      </div>
    </div>
  );
}