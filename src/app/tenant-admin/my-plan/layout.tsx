// src/app/tenant-admin/my-plan/layout.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getMyPlanOverview } from "@/lib/api/admin";

const tabs = [
  { href: "/tenant-admin/my-plan", label: "Overview" },
  { href: "/tenant-admin/my-plan/plans-upgrade", label: "Plans & Upgrade" },
  { href: "/tenant-admin/my-plan/module-addons", label: "Module Add-ons" },
  { href: "/tenant-admin/my-plan/payment-method", label: "Payment Method" },
  { href: "/tenant-admin/my-plan/billing-history", label: "Billing History" },
];

function badgeClass(status: string) {
  const s = status.toUpperCase();
  if (s === "ACTIVE") return "bg-emerald-50 text-emerald-700";
  if (s === "EXPIRED" || s === "SUSPENDED" || s === "CANCELLED") return "bg-red-50 text-red-700";
  return "bg-amber-50 text-amber-700";
}

function statusLabel(status: string) {
  const s = status.toLowerCase().replace(/_/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function MyPlanLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [planName, setPlanName] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getMyPlanOverview()
      .then((res) => {
        if (cancelled) return;
        setPlanName(res.data.currentPlan.planName);
        setStatus(res.data.subscription.status);
      })
      .catch(() => {
        // badge stays hidden if the overview cannot be loaded
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const needsRenewal = status !== null && ["EXPIRED", "PAST_DUE"].includes(status.toUpperCase());

  return (
    <section className="space-y-5 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">My Plan</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your subscription, modules, seats, and billing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {status && (
            <span className={`rounded-full px-3 py-1.5 text-xs font-medium ${badgeClass(status)}`}>
              {planName ? `${planName} · ` : ""}
              {statusLabel(status)}
            </span>
          )}
          {needsRenewal ? (
            <Link
              href="/tenant-admin/my-plan/renew"
              className="flex items-center gap-2 rounded-md bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700 whitespace-nowrap"
            >
              Renew Subscription
            </Link>
          ) : (
            <Link
              href="/tenant-admin/my-plan/plans-upgrade"
              className="flex items-center gap-2 rounded-md bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700 whitespace-nowrap"
            >
              ⚡ Upgrade Plan
            </Link>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-4 py-2.5 text-sm font-medium ${
                active
                  ? "border-b-2 border-sky-600 text-sky-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {children}
    </section>
  );
}