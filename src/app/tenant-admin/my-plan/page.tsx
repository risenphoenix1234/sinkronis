// app/tenant-admin/my-plan/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { FiZap, FiPlus, FiDownload, FiX, FiUsers, FiDollarSign, FiBookOpen } from "react-icons/fi";
import {
  currentPlan,
  moduleCatalog,
  initialActiveModuleIds,
  savedCard,
  naira,
} from "@/lib/plan-data";
import CancelSubscriptionModal from "@/components/modals/CancelSubscriptionModal";

const moduleIcons = {
  hris: FiUsers,
  payroll: FiDollarSign,
  accounting: FiBookOpen,
} as const;

export default function MyPlanOverviewPage() {
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const isAllInOne = initialActiveModuleIds.includes("all-in-one");
  const individualModules = moduleCatalog.filter((m) => !m.isBundle);

  // Cost breakdown: whatever is actually active today, priced individually,
  // or the single bundle line if the tenant is on All-in-One.
  const activeLineItems = isAllInOne
    ? moduleCatalog.filter((m) => m.isBundle)
    : moduleCatalog.filter((m) => initialActiveModuleIds.includes(m.id));
  const totalPerMonth = activeLineItems.reduce((sum, m) => sum + m.price, 0);

  const handleConfirmCancel = () => {
    // Hook up to API call to cancel the subscription here.
    console.log("Subscription cancelled");
    setCancelModalOpen(false);
  };

  return (
    <div className="grid grid-cols-3 gap-5">
      {/* Left column — Current Plan + Cost Breakdown + Active Modules */}
      <div className="col-span-2 space-y-5">
        {/* Current Plan card */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-sky-600 to-sky-700 p-6 text-white">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10"
          />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-sky-100">
                Current Plan
              </p>
              <h2 className="mt-1 text-2xl font-semibold">{currentPlan.name}</h2>
              <p className="mt-1 text-sm text-sky-100">{currentPlan.description}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5 text-right">
              <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium">
                {currentPlan.status}
              </span>
              <span className="text-xs text-sky-100">Renews {currentPlan.renewalDate}</span>
            </div>
          </div>

          <div className="relative mt-6 grid grid-cols-3 gap-4 border-t border-white/15 pt-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-sky-100">Monthly Cost</p>
              <p className="mt-0.5 text-base font-semibold">{naira(currentPlan.monthlyCost)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-sky-100">Employees</p>
              <p className="mt-0.5 text-base font-semibold">{currentPlan.seatsUsed}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-sky-100">Active Modules</p>
              <p className="mt-0.5 text-base font-semibold">{currentPlan.activeModulesCount}</p>
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-800">Cost Breakdown</h3>
          <div className="mt-3 divide-y divide-slate-100">
            {activeLineItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3 text-sm">
                <span className="text-slate-600">{item.name}</span>
                <span className="text-slate-800">{naira(item.price)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between py-3 text-sm font-semibold">
              <span className="text-slate-800">Total per month</span>
              <span className="text-sky-600">{naira(totalPerMonth)}</span>
            </div>
          </div>
        </div>

        {/* Active Modules */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">Active Modules</h3>
            <Link
              href="/tenant-admin/my-plan/plans-upgrade"
              className="text-xs font-medium text-sky-600 hover:underline"
            >
              Manage →
            </Link>
          </div>
          <div className="mt-3 divide-y divide-slate-100">
            {individualModules.map((m) => {
              const active = isAllInOne || initialActiveModuleIds.includes(m.id);
              const Icon = moduleIcons[m.id as keyof typeof moduleIcons];
              return (
                <div key={m.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-md ${
                        active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      <Icon size={16} />
                    </span>
                    <div>
                      <p className={`text-sm font-medium ${active ? "text-slate-800" : "text-slate-400"}`}>
                        {m.name}
                      </p>
                      <p className="text-xs text-slate-400">{m.subtitle}</p>
                    </div>
                  </div>
                  {active ? (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      Active
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">Inactive</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right column — Renewal + Payment Method + Quick Actions */}
      <div className="space-y-5">
        {/* Renewal */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-amber-100 text-amber-500">
              📅
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Renewal in {currentPlan.renewalDaysAway} days
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                Your plan renews on {currentPlan.renewalDate}.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-800">Payment Method</p>
            <Link
              href="/tenant-admin/my-plan/payment-method"
              className="text-xs font-medium text-sky-600 hover:underline"
            >
              Edit
            </Link>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <span className="flex h-8 w-11 items-center justify-center rounded-md bg-slate-900 text-[10px] font-bold tracking-wide text-white">
              {savedCard.brand.toUpperCase()}
            </span>
            <div>
              <p className="text-sm text-slate-700">•••• •••• •••• {savedCard.last4}</p>
              <p className="text-xs text-slate-400">Expires {savedCard.expiry}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-semibold text-slate-800">Quick Actions</p>
          <div className="mt-3 space-y-1">
            <Link
              href="/tenant-admin/my-plan/plans-upgrade"
              className="flex items-center justify-between rounded-md px-2 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              <span className="flex items-center gap-2">
                <FiZap size={14} className="text-slate-400" /> Change Plan
              </span>
              <span className="text-slate-300">→</span>
            </Link>
            <Link
              href="/tenant-admin/my-plan/plans-upgrade"
              className="flex items-center justify-between rounded-md px-2 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              <span className="flex items-center gap-2">
                <FiPlus size={14} className="text-slate-400" /> Add Module
              </span>
              <span className="text-slate-300">→</span>
            </Link>
            <Link
              href="/tenant-admin/my-plan/billing-history"
              className="flex items-center justify-between rounded-md px-2 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              <span className="flex items-center gap-2">
                <FiDownload size={14} className="text-slate-400" /> Download Invoice
              </span>
              <span className="text-slate-300">→</span>
            </Link>
            <button
              onClick={() => setCancelModalOpen(true)}
              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-rose-500 hover:bg-rose-50"
            >
              <FiX size={14} /> Cancel Subscription
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CancelSubscriptionModal
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}