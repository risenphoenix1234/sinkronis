"use client";

import { useEffect, useState } from "react";
import { getAccountingDashboard } from "@/lib/api/accounting";
import { AccountingDashboardResponse } from "@/lib/api/types/accounting.types";
import Loader from "@/components/ui/Loader";

function naira(value: number) {
  return `₦${value.toLocaleString()}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const invoiceStatusStyles: Record<string, string> = {
  PAID: "text-emerald-600",
  SENT: "text-sky-700",
  OVERDUE: "text-rose-600",
  DRAFT: "text-slate-500",
};

export default function AccountingDashboardPage() {
  const [data, setData] = useState<AccountingDashboardResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getAccountingDashboard();
        setData(res.data);
      } catch (err) {
        setError("Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <section className="p-6">
        <Loader variant="section" label="Loading dashboard" />
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="p-6">
        <p className="text-sm text-red-500">{error ?? "No data available."}</p>
      </section>
    );
  }

  const { summary, alerts, invoiceStatus, recentInvoices, recentWalletActivity, paymentRequests } = data;

  return (
    <section className="relative space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Overview</h1>
          <p className="mt-1 text-sm text-slate-500">
            {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-60">
            <input
              type="text"
              placeholder="Search"
              className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
            <span className="pointer-events-none absolute right-4 top-2.5 text-sm text-slate-400">🔍</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm hover:bg-slate-50"
            >
              <span className="text-base">🔔</span>
              {alerts.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-semibold text-white">
                  {alerts.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="space-y-1.5 text-sm">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between rounded-md border border-amber-200 bg-amber-50 px-4 py-2.5">
              <div className="flex items-center gap-2 text-amber-700">
                <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-xs font-bold">!</span>
                <span className="font-medium">{alert.message}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-emerald-100 bg-emerald-50/60 p-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Total Revenue</span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-emerald-700">{naira(summary.totalRevenue)}</p>
          <p className="mt-1 text-sm text-slate-500">Across all paid invoices</p>
        </div>

        <div className="rounded-lg border border-sky-100 bg-sky-50/70 p-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Outstanding</span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{naira(summary.outstanding)}</p>
          <p className="mt-1 text-sm text-slate-500">Awaiting payment</p>
        </div>

        <div className="rounded-lg border border-rose-100 bg-rose-50/70 p-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Overdue Amount</span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-rose-600">{naira(summary.overdueAmount)}</p>
          <p className="mt-1 text-sm text-slate-500">{invoiceStatus.overdue} invoice(s) past due</p>
        </div>

        <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Pending Approvals</span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{summary.pendingApprovals}</p>
          <p className="mt-1 text-sm text-slate-500">Payment request(s) awaiting action</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4 lg:col-span-2">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Wallet Balance</span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{naira(summary.walletBalance)}</p>
          <p className="mt-1 text-sm text-slate-500">Available funds for payouts</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>VAT Collected</span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{naira(summary.vatCollected)}</p>
          <p className="mt-1 text-sm text-slate-500">To be remitted this period</p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-semibold text-slate-800">Invoice Status</span>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Paid
              </span>
              <span className="font-semibold text-slate-800">{invoiceStatus.paid}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                Overdue
              </span>
              <span className="font-semibold text-slate-800">{invoiceStatus.overdue}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
                Draft
              </span>
              <span className="font-semibold text-slate-800">{invoiceStatus.draft}</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 xl:col-span-2">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-800">Recent Invoices</span>
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
                {recentInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-sm text-slate-400">
                      No invoices yet.
                    </td>
                  </tr>
                ) : (
                  recentInvoices.map((inv) => (
                    <tr key={inv.id} className="border-t">
                      <td className="px-4 py-2.5 text-sky-600">{inv.invoiceNumber}</td>
                      <td className="px-4 py-2.5">{inv.clientName}</td>
                      <td className="px-4 py-2.5 text-right">{naira(inv.amount)}</td>
                      <td className="px-4 py-2.5">{formatDate(inv.dueDate)}</td>
                      <td className={`px-4 py-2.5 ${invoiceStatusStyles[inv.status]}`}>{inv.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-semibold text-slate-800">Recent Wallet Activity</span>
          </div>

          <div className="space-y-3">
            {recentWalletActivity.length === 0 ? (
              <p className="text-sm text-slate-400">No wallet activity yet.</p>
            ) : (
              recentWalletActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">{activity.description}</p>
                    <p className="text-sm text-slate-500">{formatDate(activity.timestamp)}</p>
                  </div>
                  <span className={`text-sm font-semibold ${activity.direction === "CREDIT" ? "text-emerald-600" : "text-rose-600"}`}>
                    {activity.direction === "CREDIT" ? "+" : "-"}{naira(activity.amount)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-semibold text-slate-800">Payment Requests</span>
          </div>

          <div className="space-y-2">
            {paymentRequests.length === 0 ? (
              <p className="text-sm text-slate-400">No pending payment requests.</p>
            ) : (
              paymentRequests.map((req) => (
                <div key={req.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">{req.requestedBy} – {req.invoiceReference}</p>
                    <p className="text-sm text-slate-500">{naira(req.amount)}</p>
                  </div>
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    {req.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}