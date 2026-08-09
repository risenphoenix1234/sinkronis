// src/app/platform-admin/billing/page.tsx
"use client";

import { useMemo, useState } from "react";
import { Download, TrendingUp, CheckCircle2, AlertTriangle } from "lucide-react";
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
  naira,
  revenueByPlan,
  initialInvoices,
  invoiceStatusStyles,
  Invoice,
} from "@/lib/platform-billing-data";
import GenerateInvoiceModal, { NewInvoiceInput } from "@/components/modals/GenerateInvoiceModal";

export default function BillingRevenuePage() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [showModal, setShowModal] = useState(false);
  const [nextNum, setNextNum] = useState(43);

  const { mrr, arr, overdue } = useMemo(() => {
    const paidThisPeriod = invoices
      .filter((i) => i.period === "Jul 2026" && i.status !== "Draft")
      .reduce((sum, i) => sum + i.amount, 0);
    const overdueAmount = invoices
      .filter((i) => i.status === "Overdue")
      .reduce((sum, i) => sum + i.amount, 0);
    return { mrr: paidThisPeriod, arr: paidThisPeriod * 12, overdue: overdueAmount };
  }, [invoices]);

  const handleGenerate = (input: NewInvoiceInput) => {
    const id = `INV-2026-${String(nextNum).padStart(4, "0")}`;
    setNextNum((n) => n + 1);
    const newInvoice: Invoice = {
      id,
      tenant: input.tenant,
      period: input.period,
      amount: input.amount,
      status: input.amount > 0 ? "Paid" : "Draft",
      dueDate: "—",
    };
    setInvoices((prev) => [newInvoice, ...prev]);
  };

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
          <button className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + Generate Invoice
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-blue-50">
              <TrendingUp className="h-3.5 w-3.5 text-blue-600" />
            </span>
            <span className="text-xs text-slate-500">Monthly Recurring Revenue</span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{naira(mrr)}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-emerald-50">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            </span>
            <span className="text-xs text-slate-500">Annual Recurring Revenue</span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{naira(arr)}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-amber-50">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
            </span>
            <span className="text-xs text-slate-500">Overdue Amount</span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{naira(overdue)}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-emerald-50">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            </span>
            <span className="text-xs text-slate-500">Churn Rate</span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900">0%</p>
        </div>
      </div>

      {/* Revenue by plan */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-800">Revenue by Plan</h2>
        <p className="text-xs text-slate-500">Stacked monthly contribution by subscription tier</p>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueByPlan} barSize={28}>
              <CartesianGrid vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickFormatter={(v) => `₦${(v / 1_000_000).toFixed(1)}M`}
              />
              <Tooltip formatter={(v: number) => naira(v)} contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: "#e2e8f0" }} />
              <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 12, color: "#64748b" }} />
              <Bar dataKey="Starter" stackId="rev" fill="#c4b5fd" />
              <Bar dataKey="Growth" stackId="rev" fill="#60a5fa" />
              <Bar dataKey="Enterprise" stackId="rev" fill="#4f46e5" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Invoices table */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-800">Invoices</h2>
          <p className="text-xs text-slate-500">All platform invoices — overdue items are highlighted</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-500">
                <th className="px-5 py-3 font-medium">Invoice ID</th>
                <th className="px-5 py-3 font-medium">Tenant</th>
                <th className="px-5 py-3 font-medium">Period</th>
                <th className="px-5 py-3 font-medium">Amount ₦</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Due Date</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => {
                const overdueRow = inv.status === "Overdue";
                return (
                  <tr
                    key={inv.id}
                    className={`border-b border-slate-50 last:border-0 ${
                      overdueRow ? "bg-amber-50/60" : "hover:bg-slate-50"
                    }`}
                  >
                    <td className="px-5 py-3">
                      <span className="font-medium text-blue-600">{inv.id}</span>
                    </td>
                    <td className="px-5 py-3 text-slate-700">{inv.tenant}</td>
                    <td className="px-5 py-3 text-slate-500">{inv.period}</td>
                    <td className="px-5 py-3 text-slate-700">{naira(inv.amount)}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${invoiceStatusStyles[inv.status]}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className={`px-5 py-3 ${overdueRow ? "text-amber-700" : "text-slate-500"}`}>
                      {inv.dueDate}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <button className="text-xs font-medium text-blue-600 hover:underline">Download</button>
                        {overdueRow && (
                          <button className="text-xs font-medium text-amber-600 hover:underline">Send Reminder</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <GenerateInvoiceModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onGenerate={handleGenerate}
      />
    </section>
  );
}