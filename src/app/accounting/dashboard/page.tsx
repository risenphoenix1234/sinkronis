// src/app/accounting/dashboard/page.tsx
"use client";

import { useState } from "react";

type NotificationItem = {
  id: string;
  title: string;
  subtitle: string;
  amount: string;
  meta: string;
  statusColor: "red" | "yellow";
};

const notifications: NotificationItem[] = [
  {
    id: "INV-003",
    title: "Overdue payment",
    subtitle: "Blustar Logistics • 14 days overdue",
    amount: "₦129,000",
    meta: "Invoice • Due 09 May 2026",
    statusColor: "red",
  },
  {
    id: "INV-002",
    title: "Payment due soon",
    subtitle: "Prestige Global Services • Due in 1 day",
    amount: "₦152,300",
    meta: "Invoice • Due 24 May 2026",
    statusColor: "yellow",
  },
  {
    id: "INV-005",
    title: "Overdue payment",
    subtitle: "Acme Corp • 2 days overdue",
    amount: "₦89,000",
    meta: "Invoice • Due 21 May 2026",
    statusColor: "red",
  },
];

export default function AccountingDashboardPage() {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <section className="relative space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Overview</h1>
          <p className="mt-1 text-sm text-slate-500">
            Saturday 23 May 2026
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative w-60">
            <input
              type="text"
              placeholder="Search"
              className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
            <span className="pointer-events-none absolute right-4 top-2.5 text-sm text-slate-400">
              🔍
            </span>
          </div>

          {/* Bell + profile */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm hover:bg-slate-50"
            >
              <span className="text-base">🔔</span>
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-semibold text-white">
                4
              </span>
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-300">
              <span className="text-sm font-semibold text-white">KO</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts stripe */}
      <div className="space-y-1.5 text-sm">
        <div className="flex items-center justify-between rounded-md border border-amber-200 bg-amber-50 px-4 py-2.5">
          <div className="flex items-center gap-2 text-amber-700">
            <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-xs font-bold">
              !
            </span>
            <span className="font-medium">
              1 overdue invoice – ₦129,000 unpaid
            </span>
            <span className="text-slate-500">Blustar Logistics</span>
          </div>
          <button className="text-sm font-medium text-amber-700 underline">
            View
          </button>
        </div>

        <div className="flex items-center justify-between rounded-md border border-amber-100 bg-amber-50/70 px-4 py-2.5">
          <div className="flex items-center gap-2 text-amber-700">
            <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-xs font-bold">
              !
            </span>
            <span className="font-medium">
              1 payment request awaiting approval
            </span>
            <span className="text-slate-500">₦15,250 total</span>
          </div>
          <button className="text-sm font-medium text-amber-700 underline">
            Review
          </button>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* Total Revenue */}
        <div className="rounded-lg border border-emerald-100 bg-emerald-50/60 p-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Total Revenue</span>
            <button className="text-sky-600">View &gt;</button>
          </div>
          <p className="mt-3 text-2xl font-semibold text-emerald-700">
            ₦526,750
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Across all paid invoices
          </p>
        </div>

        {/* Outstanding */}
        <div className="rounded-lg border border-sky-100 bg-sky-50/70 p-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Outstanding</span>
            <button className="text-sky-600">View &gt;</button>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900">
            ₦15,250
          </p>
          <p className="mt-1 text-sm text-slate-500">Awaiting payment</p>
        </div>

        {/* Overdue */}
        <div className="rounded-lg border border-rose-100 bg-rose-50/70 p-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Overdue Amount</span>
            <button className="text-sky-600">View &gt;</button>
          </div>
          <p className="mt-3 text-2xl font-semibold text-rose-600">
            ₦129,000
          </p>
          <p className="mt-1 text-sm text-slate-500">
            1 invoice past due
          </p>
        </div>

        {/* Pending Approvals */}
        <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Pending Approvals</span>
            <button className="text-sky-600">View &gt;</button>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900">1</p>
          <p className="mt-1 text-sm text-slate-500">
            Payment request awaiting action
          </p>
        </div>
      </div>

      {/* Wallet + VAT */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4 lg:col-span-2">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Wallet Balance</span>
            <button className="text-sky-600">View wallets</button>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900">
            ₦489,075
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Available funds for payouts
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>VAT Collected</span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900">
            ₦36,750
          </p>
          <p className="mt-1 text-sm text-slate-500">
            To be remitted this period
          </p>
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid gap-4 xl:grid-cols-3">
        {/* Invoice Status */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-semibold text-slate-800">Invoice Status</span>
            <button className="text-sm text-sky-600">View all</button>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Paid
              </span>
              <span className="font-semibold text-slate-800">3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                Overdue
              </span>
              <span className="font-semibold text-slate-800">1</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
                Draft
              </span>
              <span className="font-semibold text-slate-800">1</span>
            </div>
          </div>
        </div>

        {/* Recent invoices */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 xl:col-span-2">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-800">Recent Invoices</span>
            <button className="text-sm text-sky-600">View all</button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-2">Invoice</th>
                  <th className="px-4 py-2">Client</th>
                  <th className="px-4 py-2 text-right">Amount</th>
                  <th className="px-4 py-2">Due Date</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2.5 text-sky-600">INV-001</td>
                  <td className="px-4 py-2.5">Zenith Technologies Ltd</td>
                  <td className="px-4 py-2.5 text-right">₦63,750</td>
                  <td className="px-4 py-2.5">10 May 2026</td>
                  <td className="px-4 py-2.5 text-emerald-600">Paid</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2.5 text-sky-600">INV-002</td>
                  <td className="px-4 py-2.5">Prestige Global Services</td>
                  <td className="px-4 py-2.5 text-right">₦152,300</td>
                  <td className="px-4 py-2.5">20 May 2026</td>
                  <td className="px-4 py-2.5 text-sky-700">Sent</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2.5 text-sky-600">INV-003</td>
                  <td className="px-4 py-2.5">Blustar Logistics</td>
                  <td className="px-4 py-2.5 text-right">₦129,000</td>
                  <td className="px-4 py-2.5">09 May 2026</td>
                  <td className="px-4 py-2.5 text-rose-600">Overdue</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2.5 text-sky-600">INV-004</td>
                  <td className="px-4 py-2.5">Zenith Technologies Ltd</td>
                  <td className="px-4 py-2.5 text-right">₦85,000</td>
                  <td className="px-4 py-2.5">30 Jun 2026</td>
                  <td className="px-4 py-2.5 text-slate-500">Draft</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent wallet activity */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-semibold text-slate-800">
              Recent Wallet Activity
            </span>
            <button className="text-sm text-sky-600">View all</button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">
                  Payment received – INV-001
                </p>
                <p className="text-sm text-slate-500">
                  Zenith Technologies Ltd • Today
                </p>
              </div>
              <span className="text-sm font-semibold text-emerald-600">
                +₦63,750
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">
                  Transfer to bank – GTBank
                </p>
                <p className="text-sm text-slate-500">
                  Settlement • Yesterday
                </p>
              </div>
              <span className="text-sm font-semibold text-rose-600">
                -₦120,000
              </span>
            </div>
          </div>
        </div>

        {/* Payment Requests */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-semibold text-slate-800">
              Payment Requests
            </span>
            <button className="text-sm text-sky-600">View all</button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">
                  Sola Williams – INV-002
                </p>
                <p className="text-sm text-slate-500">
                  Awaiting approval • ₦15,250
                </p>
              </div>
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                Pending
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notification dropdown / side panel */}
      {showNotifications && (
        <div className="absolute right-0 top-0 z-30 mt-14 w-80 rounded-lg border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 text-sm">
            <span className="font-semibold text-slate-800">Notifications</span>
            <button className="text-sm text-sky-600">
              Mark all as read
            </button>
          </div>

          <div className="max-h-96 space-y-2 overflow-y-auto px-3 py-2 text-sm">
            {notifications.map((n, index) => (
              <div
                key={`${n.id}-${index}`}
                className="rounded-md border border-slate-100 bg-slate-50 px-3 py-2.5"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">
                    {n.title}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      n.statusColor === "red"
                        ? "bg-rose-50 text-rose-600"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {n.statusColor === "red" ? "Overdue" : "Upcoming"}
                  </span>
                </div>
                <p className="text-sm text-slate-500">{n.subtitle}</p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">
                    {n.amount}
                  </span>
                  <span className="text-sm text-sky-600">{n.id}</span>
                </div>
                <p className="mt-1 text-xs text-slate-400">{n.meta}</p>
              </div>
            ))}
          </div>

          <button className="w-full border-t border-slate-100 px-4 py-3 text-center text-sm font-medium text-sky-600">
            View all reminders &gt;
          </button>
        </div>
      )}
    </section>
  );
}