// src/app/accounting/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  TrendingUp,
  Wallet,
} from "lucide-react";
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

const sentenceCase = (value: string) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : "—";

const invoiceStatusStyles: Record<string, string> = {
  PAID: "bg-[#D8F3DC] text-[#1B7A34]",
  SENT: "bg-[#E3F2FD] text-[#1565C0]",
  OVERDUE: "bg-[#FFE5E5] text-[#FF3B30]",
  DRAFT: "bg-[#F4F6F8] text-[#637381]",
};

const isCriticalAlert = (alert: { type: string; severity: string }) =>
  /overdue|critical|high|error|danger/i.test(`${alert.type} ${alert.severity}`);

function ViewAll({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-0.5 text-xs text-[#2183C6] hover:underline"
    >
      View all
      <ChevronRight className="h-3 w-3" />
    </Link>
  );
}

export default function AccountingDashboardPage() {
  const [data, setData] = useState<AccountingDashboardResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <section className="min-h-[calc(100vh-5rem)] bg-[#F4F6F8] p-6">
        <Loader variant="section" label="Loading dashboard" />
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="min-h-[calc(100vh-5rem)] bg-[#F4F6F8] p-6">
        <p className="text-sm text-red-500">{error ?? "No data available."}</p>
      </section>
    );
  }

  const { summary, alerts, invoiceStatus, recentInvoices, recentWalletActivity, paymentRequests } = data;

  const invoiceTotal =
    invoiceStatus.paid + invoiceStatus.sent + invoiceStatus.overdue + invoiceStatus.draft;

  const invoiceRows = [
    { key: "PAID", label: "Paid", count: invoiceStatus.paid, bar: "bg-[#1B7A34]" },
    { key: "SENT", label: "Sent", count: invoiceStatus.sent, bar: "bg-[#1565C0]" },
    { key: "OVERDUE", label: "Overdue", count: invoiceStatus.overdue, bar: "bg-[#FF3B30]" },
    { key: "DRAFT", label: "Draft", count: invoiceStatus.draft, bar: "bg-[#637381]" },
  ];

  return (
    <section className="min-h-[calc(100vh-5rem)] space-y-5 bg-[#F4F6F8] p-6">
      <div>
        <h1 className="text-4xl font-bold text-[#212B36]">Overview</h1>
        <p className="mt-1 text-xs text-[#637381]">
          {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert) => {
            const critical = isCriticalAlert(alert);
            return (
              <div
                key={alert.id}
                className={`flex items-center justify-between rounded-md border px-4 py-2.5 text-xs ${
                  critical
                    ? "border-[#FBD9D9] bg-[#FFF5F5] text-[#FF3B30]"
                    : "border-[#ECE6D5] bg-[#FFFBF0] text-[#856404]"
                }`}
              >
                <div className="flex items-center gap-2">
                  {critical ? <AlertTriangle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                  <span className="font-semibold">{alert.message}</span>
                </div>
                <Link
                  href={critical ? "/accounting/invoices" : "/accounting/payment-requests"}
                  className="flex items-center gap-0.5 font-medium hover:underline"
                >
                  {critical ? "View" : "Review"}
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <div className="flex items-center gap-4 rounded-md border border-[#F3F4F6] bg-white p-5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#D8F3DC] text-[#1B7A34]">
            <TrendingUp className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-[#637381]">Total Revenue</p>
            <p className="mt-1 text-2xl font-bold text-[#212B36]">{naira(summary.totalRevenue)}</p>
            <p className="mt-1 text-[11px] text-[#919EAB]">From paid invoices</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-md border border-[#F3F4F6] bg-white p-5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#E3F2FD] text-[#1565C0]">
            <FileText className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-[#637381]">Outstanding</p>
            <p className="mt-1 text-2xl font-bold text-[#212B36]">{naira(summary.outstanding)}</p>
            <p className="mt-1 text-[11px] text-[#919EAB]">Awaiting payment</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-md border border-[#FAD4D5] bg-[#FAEDEF] p-5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#FFE5E5] text-[#FF3B30]">
            <AlertCircle className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-[#637381]">Overdue Amount</p>
            <p className="mt-1 text-2xl font-bold text-[#FF3B30]">{naira(summary.overdueAmount)}</p>
            <p className="mt-1 text-[11px] text-[#919EAB]">{invoiceStatus.overdue} invoice past due</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-md border border-[#F3F4F6] bg-white p-5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#E3F2FD] text-[#2183C6]">
            <Wallet className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-[#637381]">Wallet Balance</p>
            <p className="mt-1 text-2xl font-bold text-[#212B36]">{naira(summary.walletBalance)}</p>
            <p className="mt-1 text-[11px] text-[#919EAB]">Available funds</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-md border border-[#E7DFC7] bg-[#FAF4E3] p-5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#FFF3CD] text-[#856404]">
            <Clock className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-[#637381]">Pending Approvals</p>
            <p className="mt-1 text-2xl font-bold text-[#856404]">{summary.pendingApprovals}</p>
            <p className="mt-1 text-[11px] text-[#919EAB]">
              {summary.pendingApprovals} request awaiting action
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-md border border-[#F3F4F6] bg-white p-5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#F4F6F8] text-[#637381]">
            <CheckCircle2 className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-[#637381]">VAT Collected</p>
            <p className="mt-1 text-2xl font-bold text-[#212B36]">{naira(summary.vatCollected)}</p>
            <p className="mt-1 text-[11px] text-[#919EAB]">7.5% FIRS — paid invoices</p>
          </div>
        </div>
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-3">
        <div className="rounded-md border border-[#F3F4F6] bg-white p-5">
          <div className="mb-5 flex items-center justify-between">
            <span className="text-sm font-semibold text-[#212B36]">Invoice Status</span>
            <ViewAll href="/accounting/invoices" />
          </div>

          <div className="space-y-5">
            {invoiceRows.map((row) => (
              <div key={row.key}>
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${invoiceStatusStyles[row.key]}`}
                  >
                    {row.label}
                  </span>
                  <span className="text-sm font-semibold text-[#212B36]">{row.count}</span>
                </div>
                <div className="mt-2 h-[3px] w-full rounded-full bg-[#EDEFF2]">
                  <div
                    className={`h-[3px] rounded-full ${row.bar}`}
                    style={{ width: `${invoiceTotal > 0 ? (row.count / invoiceTotal) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-[#F3F4F6] bg-white p-5 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-[#212B36]">Recent Invoices</span>
            <ViewAll href="/accounting/invoices" />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead>
                <tr className="border-b border-dotted border-[#EBEEF0] text-[#919EAB]">
                  <th className="px-3 pb-3 font-normal">Invoice</th>
                  <th className="px-3 pb-3 font-normal">Client</th>
                  <th className="px-3 pb-3 font-normal">Amount</th>
                  <th className="px-3 pb-3 font-normal">Due Date</th>
                  <th className="px-3 pb-3 font-normal">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-6 text-center text-xs text-[#919EAB]">
                      No invoices yet.
                    </td>
                  </tr>
                ) : (
                  recentInvoices.map((inv) => (
                    <tr key={inv.id} className="even:bg-[#F2F2F7]">
                      <td className="px-3 py-3 text-[#2183C6]">{inv.invoiceNumber}</td>
                      <td className="px-3 py-3 text-[#212B36]">{inv.clientName}</td>
                      <td className="px-3 py-3 font-medium text-[#212B36]">{naira(inv.amount)}</td>
                      <td className="whitespace-nowrap px-3 py-3 text-[#637381]">{formatDate(inv.dueDate)}</td>
                      <td className="px-3 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${invoiceStatusStyles[inv.status] ?? "bg-[#F4F6F8] text-[#637381]"}`}
                        >
                          {sentenceCase(inv.status)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid items-start gap-5 md:grid-cols-2">
        <div className="rounded-md border border-[#F3F4F6] bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-[#212B36]">Recent Wallet Activity</span>
            <ViewAll href="/accounting/wallets" />
          </div>

          <div className="space-y-4">
            {recentWalletActivity.length === 0 ? (
              <p className="text-xs text-[#919EAB]">No wallet activity yet.</p>
            ) : (
              recentWalletActivity.map((activity) => {
                const credit = activity.direction === "CREDIT";
                return (
                  <div key={activity.id} className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          credit ? "bg-[#D8F3DC] text-[#1B7A34]" : "bg-[#FFE5E5] text-[#FF3B30]"
                        }`}
                      >
                        {credit ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-xs text-[#212B36]">{activity.description}</p>
                        <p className="text-[11px] text-[#919EAB]">{formatDate(activity.timestamp)}</p>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 text-xs font-semibold ${credit ? "text-[#1B7A34]" : "text-[#FF3B30]"}`}
                    >
                      {credit ? "+" : "-"}
                      {naira(activity.amount)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="rounded-md border border-[#F3F4F6] bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-semibold text-[#212B36]">
              Payment Requests
              {paymentRequests.length > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#856404] text-[11px] font-semibold text-white">
                  {paymentRequests.length}
                </span>
              )}
            </span>
            <ViewAll href="/accounting/payment-requests" />
          </div>

          <div className="space-y-4">
            {paymentRequests.length === 0 ? (
              <p className="text-xs text-[#919EAB]">No pending payment requests.</p>
            ) : (
              paymentRequests.map((req) => (
                <div key={req.id} className="flex items-center justify-between gap-3">
                  <p className="min-w-0 truncate text-xs text-[#212B36]">
                    {req.requestedBy} · <span className="text-[#2183C6]">{req.invoiceReference}</span>
                  </p>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-xs font-semibold text-[#212B36]">{naira(req.amount)}</span>
                    <span className="rounded-full bg-[#FFF3CD] px-2.5 py-1 text-[11px] font-medium text-[#856404]">
                      {sentenceCase(req.status)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}