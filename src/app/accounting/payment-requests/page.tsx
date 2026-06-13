"use client";

import { useState } from "react";

type PaymentRequest = {
  id: string;
  agent: string;
  client: string;
  invoice: string;
  amount: string;
  description: string;
  status: "Pending" | "Approved" | "Completed" | "Declined";
  raised: string;
};

const initialRequests: PaymentRequest[] = [
  {
    id: "PR-001",
    agent: "Sade Williams",
    client: "Prestige Global Services",
    invoice: "INV-002",
    amount: "₦5,250",
    description: "Full payment for INV-002 – Prestige Payroll Setup",
    status: "Pending",
    raised: "12 May 2026",
  },
  {
    id: "PR-002",
    agent: "Emeka Okafor",
    client: "Zenith Technologies Ltd",
    invoice: "INV-001",
    amount: "₦526,750",
    description: "Full payment received for INV-001 – Zenith HRIS Deployment",
    status: "Completed",
    raised: "16 Apr 2026",
  },
  {
    id: "PR-003",
    agent: "Emeka Okafor",
    client: "BlueStar Logistics",
    invoice: "INV-003",
    amount: "₦29,000",
    description: "Account request for overdue INV-003. Reason: Invoice not disputed by client today.",
    status: "Declined",
    raised: "03 Nov 2026",
  },
];

const statusStyles: Record<PaymentRequest["status"], string> = {
  Pending: "bg-amber-50 text-amber-700",
  Approved: "bg-sky-50 text-sky-700",
  Completed: "bg-emerald-50 text-emerald-700",
  Declined: "bg-rose-50 text-rose-700",
};

type Filter = "All" | "Pending" | "Approved" | "Completed" | "Declined";

export default function PaymentRequestsPage() {
  const [requests, setRequests] = useState(initialRequests);
  const [filter, setFilter] = useState<Filter>("All");

  const filters: Filter[] = ["All", "Pending", "Approved", "Completed", "Declined"];

  const filtered =
    filter === "All" ? requests : requests.filter((r) => r.status === filter);

  const pendingApproval = requests.filter((r) => r.status === "Pending").length;
  const totalCompleted = requests
    .filter((r) => r.status === "Completed")
    .reduce((sum, r) => {
      const num = parseFloat(r.amount.replace(/[₦,]/g, ""));
      return sum + num;
    }, 0);
  const declined = requests.filter((r) => r.status === "Declined").length;

  const handleApprove = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Approved" } : r))
    );
  };

  const handleDecline = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Declined" } : r))
    );
  };

  const handleMarkComplete = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Completed" } : r))
    );
  };

  return (
    <section className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Payment Requests
          </h1>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
          <p className="text-sm text-slate-500">Pending Approval</p>
          <p className="mt-1 text-3xl font-semibold text-slate-900">
            {pendingApproval}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
          <p className="text-sm text-slate-500">Total Completed</p>
          <p className="mt-1 text-3xl font-semibold text-slate-900">
            ₦{totalCompleted.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
          <p className="text-sm text-slate-500">Declined</p>
          <p className="mt-1 text-3xl font-semibold text-slate-900">
            {declined}
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              filter === f
                ? "border-sky-200 bg-sky-50 font-medium text-sky-700"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-3 font-medium">Request ID</th>
              <th className="px-6 py-3 font-medium">Agent</th>
              <th className="px-6 py-3 font-medium">Client</th>
              <th className="px-6 py-3 font-medium">Invoice</th>
              <th className="px-6 py-3 font-medium">Amount</th>
              <th className="px-6 py-3 font-medium">Description</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Raised</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((req) => (
              <tr key={req.id} className="hover:bg-slate-50">
                <td className="px-6 py-3 text-sm font-medium text-sky-600 whitespace-nowrap">
                  {req.id}
                </td>
                <td className="px-6 py-3 text-base text-slate-800 whitespace-nowrap">
                  {req.agent}
                </td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">
                  {req.client}
                </td>
                <td className="px-6 py-3 text-base text-sky-600 whitespace-nowrap">
                  {req.invoice}
                </td>
                <td className="px-6 py-3 text-base tabular-nums font-medium text-slate-800 whitespace-nowrap">
                  {req.amount}
                </td>
                <td className="px-6 py-3 text-sm text-slate-500 max-w-xs">
                  {req.description}
                </td>
                <td className="px-6 py-3">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${statusStyles[req.status]}`}
                  >
                    {req.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">
                  {req.raised}
                </td>
                <td className="px-6 py-3 text-right whitespace-nowrap">
                  {req.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="mr-2 rounded-md bg-sky-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-sky-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleDecline(req.id)}
                        className="rounded-md border border-rose-200 px-3 py-1.5 text-sm font-medium text-rose-500 hover:bg-rose-50"
                      >
                        Decline
                      </button>
                    </>
                  )}
                  {req.status === "Approved" && (
                    <button
                      onClick={() => handleMarkComplete(req.id)}
                      className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
                    >
                      Mark Complete
                    </button>
                  )}
                  {(req.status === "Completed" || req.status === "Declined") && (
                    <span className="text-sm text-slate-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3">
          <p className="text-sm text-slate-500">
            Showing 1–{filtered.length} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button className="rounded px-2 py-1 text-sm text-slate-400 hover:bg-slate-100">
              ‹
            </button>
            <button className="rounded bg-sky-600 px-3 py-1 text-sm font-medium text-white">
              1
            </button>
            <button className="rounded px-2 py-1 text-sm text-slate-400 hover:bg-slate-100">
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}