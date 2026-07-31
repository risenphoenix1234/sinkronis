// app/tenant-admin/my-plan/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { FiCreditCard, FiZap, FiUsers, FiPlus, FiDownload, FiX } from "react-icons/fi";
import { currentPlan, modules, savedCard, naira } from "@/lib/plan-data";
import ManageSeatsModal from "@/components/modals/ManageSeatsModal";
import CancelSubscriptionModal from "@/components/modals/CancelSubscriptionModal";

export default function MyPlanOverviewPage() {
  const [seatsModalOpen, setSeatsModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [seatsTotal, setSeatsTotal] = useState(currentPlan.seatsTotal);

  const seatsRemaining = seatsTotal - currentPlan.seatsUsed;
  const usagePct = Math.round((currentPlan.seatsUsed / seatsTotal) * 100);

  const handleUpdateSeats = (newSeatCount: number) => {
    // Hook up to API call to update the subscription's seat count here.
    console.log("Updating seats to:", newSeatCount);
    setSeatsTotal(newSeatCount);
  };

  const handleConfirmCancel = () => {
    // Hook up to API call to cancel the subscription here.
    console.log("Subscription cancelled");
    setCancelModalOpen(false);
  };

  return (
    <div className="grid grid-cols-3 gap-5">
      {/* Left column — Current Plan + Seat Usage + Active Modules */}
      <div className="col-span-2 space-y-5">
        {/* Current Plan card */}
        <div className="rounded-xl bg-gradient-to-br from-sky-600 to-sky-700 p-6 text-white">
          <div className="flex items-start justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-sky-100">
              Current Plan
            </p>
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium">
              {currentPlan.status}
            </span>
          </div>
          <h2 className="mt-1 text-2xl font-semibold">{currentPlan.name}</h2>
          <p className="mt-1 text-sm text-sky-100">{currentPlan.description}</p>

          <div className="mt-5 grid grid-cols-4 gap-4 border-t border-white/15 pt-4">
            <div>
              <p className="text-xs text-sky-100">Seats Used</p>
              <p className="mt-0.5 text-base font-semibold">
                {currentPlan.seatsUsed} / {seatsTotal}
              </p>
            </div>
            <div>
              <p className="text-xs text-sky-100">Monthly Cost</p>
              <p className="mt-0.5 text-base font-semibold">{naira(currentPlan.monthlyCost)}</p>
            </div>
            <div>
              <p className="text-xs text-sky-100">Billing Cycle</p>
              <p className="mt-0.5 text-base font-semibold">{currentPlan.billingCycle}</p>
            </div>
            <div>
              <p className="text-xs text-sky-100">Active Modules</p>
              <p className="mt-0.5 text-base font-semibold">
                {currentPlan.activeModulesCount} of {currentPlan.totalModulesCount}
              </p>
            </div>
          </div>
        </div>

        {/* Seat Usage */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">Seat Usage</h3>
            <button
              onClick={() => setSeatsModalOpen(true)}
              className="flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              <FiUsers size={12} /> Manage Seats
            </button>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {currentPlan.seatsUsed} of {seatsTotal} seats occupied
          </p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-sky-500"
              style={{ width: `${usagePct}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-400">
            {seatsRemaining > 0 ? `${seatsRemaining} seats remaining` : "No seats remaining"}
          </p>
        </div>

        {/* Active Modules */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">Active Modules</h3>
            <Link
              href="/tenant-admin/my-plan/module-addons"
              className="text-xs font-medium text-sky-600 hover:underline"
            >
              Manage →
            </Link>
          </div>
          <div className="mt-3 divide-y divide-slate-100">
            {modules.map((m) => (
              <div key={m.key} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-md text-sm font-semibold ${
                      m.active ? "bg-sky-50 text-sky-600" : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {m.name[0]}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{m.name}</p>
                    <p className="text-xs text-slate-400">
                      {m.includedInPlan ? "Included in plan" : `${naira(m.monthlyPrice)}/mo`}
                    </p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    m.active
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {m.active ? "Active" : "Inactive"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right column — Renewal + Payment Method + Quick Actions */}
      <div className="space-y-5">
        {/* Renewal */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <span className="text-amber-500">📅</span>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Renewal in {currentPlan.renewalDaysAway} days
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                Your plan renews on {currentPlan.renewalDate}. Reminder sent 7 days before.
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
                <FiZap size={14} className="text-slate-400" /> Upgrade Plan
              </span>
              <span className="text-slate-300">→</span>
            </Link>
            <button
              onClick={() => setSeatsModalOpen(true)}
              className="flex w-full items-center justify-between rounded-md px-2 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              <span className="flex items-center gap-2">
                <FiUsers size={14} className="text-slate-400" /> Manage Seats
              </span>
              <span className="text-slate-300">→</span>
            </button>
            <Link
              href="/tenant-admin/my-plan/module-addons"
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
      <ManageSeatsModal
        open={seatsModalOpen}
        onClose={() => setSeatsModalOpen(false)}
        onUpdate={handleUpdateSeats}
      />
      <CancelSubscriptionModal
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}