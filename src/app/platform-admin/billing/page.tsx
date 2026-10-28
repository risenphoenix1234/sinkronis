"use client";

import { useEffect, useState } from "react";
import { TrendingUp, CheckCircle2, AlertTriangle, Download } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  getPlatformBilling,
  getInvoices,
  generateInvoice,
  sendInvoiceReminder,
  downloadInvoicePdf,
  exportInvoicesCsv,
  getTenants,
} from "@/lib/api/platform-admin";
import { PlatformBillingResponse, PlatformInvoice } from "@/lib/api/types/platform-admin.types";
import GenerateInvoiceModal, { NewInvoiceInput } from "@/components/modals/GenerateInvoiceModal";
import Loader from "@/components/ui/Loader";

function naira(value: number) {
  return `₦${value.toLocaleString()}`;
}

function formatMonth(monthStr: string) {
  const [year, month] = monthStr.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("en-GB", { month: "short" });
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const invoiceStatusStyles: Record<string, string> = {
  PAID: "bg-green-50 text-green-700",
  OVERDUE: "bg-red-50 text-red-700",
  DRAFT: "bg-slate-100 text-slate-600",
};

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export default function BillingRevenuePage() {
  const [data, setData] = useState<PlatformBillingResponse["data"] | null>(null);
  const [invoices, setInvoices] = useState<PlatformInvoice[]>([]);
  const [tenantOptions, setTenantOptions] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [billingRes, invoicesRes, tenantsRes] = await Promise.all([
        getPlatformBilling({ page: 1, limit: 25 }),
        getInvoices({ page: 1, limit: 25 }),
        getTenants({ page: 1, limit: 100 }),
      ]);
      setData(billingRes.data);
      setInvoices(invoicesRes.data);
      setTenantOptions(tenantsRes.data.map((t) => ({ id: t.organizationId, name: t.organizationName })));
    } catch (err) {
      setError("Failed to load billing data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleGenerate = async (input: NewInvoiceInput) => {
    try {
      await generateInvoice(input);
      setShowModal(false);
      await fetchAll();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to generate invoice.");
    }
  };

  const handleReminder = async (invoiceId: string) => {
    setActionLoading(invoiceId);
    try {
      await sendInvoiceReminder(invoiceId);
      alert("Reminder sent.");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to send reminder.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDownload = async (invoice: PlatformInvoice) => {
    setActionLoading(invoice.id);
    try {
      const blob = await downloadInvoicePdf(invoice.id);
      triggerBlobDownload(blob, `${invoice.invoiceNumber}.pdf`);
    } catch (err: any) {
      alert("Failed to download invoice.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleExportCsv = async () => {
    setActionLoading("export");
    try {
      const blob = await exportInvoicesCsv();
      const today = new Date().toISOString().slice(0, 10);
      triggerBlobDownload(blob, `platform-invoices-${today}.csv`);
    } catch (err: any) {
      alert("Failed to export CSV.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <section className="p-6">
        <Loader variant="section" label="Loading billing data" />
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

  const { analytics, revenueByPlan } = data;

  const chartData = revenueByPlan.map((m) => ({
    month: formatMonth(m.month),
    HRIS: m.plans.HRIS,
    Payroll: m.plans.PAYROLL,
    Accounting: m.plans.ACCOUNTING,
    "All-in-One": m.plans.ALL_IN_ONE,
  }));

  return (
    <section className="space-y-5 bg-slate-50 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Billing &amp; Revenue</h1>
          <p className="mt-1 text-sm text-slate-500">
            Platform-wide revenue tracking and invoice management
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            disabled={actionLoading === "export"}
            className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            <Download className="h-4 w-4" />
            {actionLoading === "export" ? "Exporting..." : "Export CSV"}
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
          >
            + Generate Invoice
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-blue-50">
              <TrendingUp className="h-3.5 w-3.5 text-blue-600" />
            </span>
            <span className="text-xs text-slate-500">Monthly Recurring Revenue</span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{naira(analytics.mrr)}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-emerald-50">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            </span>
            <span className="text-xs text-slate-500">Annual Recurring Revenue</span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{naira(analytics.arr)}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-amber-50">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
            </span>
            <span className="text-xs text-slate-500">Overdue Amount</span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{naira(analytics.totalOverdueAmount)}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-emerald-50">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            </span>
            <span className="text-xs text-slate-500">Churn Rate</span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{analytics.churnRate}%</p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-800">Revenue by Plan</h2>
        <p className="text-xs text-slate-500">Stacked monthly contribution by subscription tier</p>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barSize={28}>
              <CartesianGrid vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickFormatter={(v) => `₦${(v / 1_000_000).toFixed(1)}M`}
              />
              <Tooltip formatter={(v) => naira(Number(v))} contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: "#e2e8f0" }} />
              <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 12, color: "#64748b" }} />
              <Bar dataKey="HRIS" stackId="rev" fill="#c4b5fd" />
              <Bar dataKey="Payroll" stackId="rev" fill="#fb923c" />
              <Bar dataKey="Accounting" stackId="rev" fill="#60a5fa" />
              <Bar dataKey="All-in-One" stackId="rev" fill="#4f46e5" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-800">Invoices</h2>
          <p className="text-xs text-slate-500">All platform invoices — overdue items are highlighted</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-500">
                <th className="px-5 py-3 font-medium">Invoice ID</th>
                <th className="px-5 py-3 font-medium">Tenant</th>
                <th className="px-5 py-3 font-medium">Period</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Due Date</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-400">
                    No invoices yet.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className={`border-b border-slate-50 last:border-0 ${
                      inv.isOverdue ? "bg-amber-50/60" : "hover:bg-slate-50"
                    }`}
                  >
                    <td className="px-5 py-3">
                      <span className="font-medium text-sky-600">{inv.invoiceNumber}</span>
                    </td>
                    <td className="px-5 py-3 text-slate-700">{inv.tenant.name}</td>
                    <td className="px-5 py-3 text-slate-500">{inv.period}</td>
                    <td className="px-5 py-3 text-slate-700">{naira(inv.amount)}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${invoiceStatusStyles[inv.status]}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className={`px-5 py-3 ${inv.isOverdue ? "text-amber-700" : "text-slate-500"}`}>
                      {formatDate(inv.dueDate)}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {inv.actions.canDownload && (
                          <button
                            onClick={() => handleDownload(inv)}
                            disabled={actionLoading === inv.id}
                            className="text-xs font-medium text-sky-600 hover:underline disabled:opacity-60"
                          >
                            Download
                          </button>
                        )}
                        {inv.actions.canSendReminder && (
                          <button
                            onClick={() => handleReminder(inv.id)}
                            disabled={actionLoading === inv.id}
                            className="text-xs font-medium text-amber-600 hover:underline disabled:opacity-60"
                          >
                            Send Reminder
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <GenerateInvoiceModal
        open={showModal}
        tenants={tenantOptions}
        onClose={() => setShowModal(false)}
        onGenerate={handleGenerate}
      />
    </section>
  );
}