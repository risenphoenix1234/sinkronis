"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CreateInvoiceModal from "@/components/modals/CreateInvoiceModal";

type Invoice = {
  id: string;
  client: string;
  agent: string;
  project: string;
  subtotal: string;
  vat: string;
  total: string;
  issueDate: string;
  dueDate: string;
  status: "Paid" | "Sent" | "Overdue" | "Draft";
};

const staticInvoices: Invoice[] = [
  {
    id: "INV-001", client: "Zenith Technologies Ltd", agent: "Emeka Okafor",
    project: "Zenith HRIS Deployment", subtotal: "₦490,000", vat: "₦36,750",
    total: "₦526,750", issueDate: "01 Apr 2026", dueDate: "15 Apr 2026", status: "Paid",
  },
  {
    id: "INV-002", client: "Prestige Global Services", agent: "Sade Williams",
    project: "Prestige Payroll Setup", subtotal: "₦14,500", vat: "₦750",
    total: "₦15,250", issueDate: "09 May 2026", dueDate: "20 May 2026", status: "Sent",
  },
  {
    id: "INV-003", client: "BlueStar Logistics", agent: "Emeka Okafor",
    project: "BlueStar Annual Contract", subtotal: "₦20,000", vat: "₦9,000",
    total: "₦29,000", issueDate: "01 Jan 2026", dueDate: "30 Apr 2026", status: "Overdue",
  },
  {
    id: "INV-004", client: "Zenith Technologies Ltd", agent: "Emeka Okafor",
    project: "Zenith HRIS Deployment", subtotal: "₦60,000", vat: "₦6,000",
    total: "₦66,000", issueDate: "14 May 2026", dueDate: "30 Jun 2026", status: "Draft",
  },
];

const statusStyles: Record<Invoice["status"], string> = {
  Paid: "bg-emerald-50 text-emerald-700",
  Sent: "bg-sky-50 text-sky-700",
  Overdue: "bg-rose-50 text-rose-700",
  Draft: "bg-slate-100 text-slate-600",
};

export default function InvoicesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  return (
    <section className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Invoices</h1>
          <p className="mt-1 text-sm text-slate-500">
            {staticInvoices.length} invoices total
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
            ⬇ Download Report
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="rounded-md bg-sky-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-700 whitespace-nowrap"
          >
            + Create Invoice
          </button>
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        {["All Client", "All Agents", "All Projects", "All Status"].map((f) => (
          <select key={f} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none">
            <option>{f}</option>
          </select>
        ))}
        <input type="date" className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none" />
        <input type="date" className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none" />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-3 font-medium">Invoice</th>
              <th className="px-6 py-3 font-medium">Client</th>
              <th className="px-6 py-3 font-medium">Agent</th>
              <th className="px-6 py-3 font-medium">Project</th>
              <th className="px-6 py-3 font-medium">Subtotal</th>
              <th className="px-6 py-3 font-medium">VAT</th>
              <th className="px-6 py-3 font-medium">Total</th>
              <th className="px-6 py-3 font-medium">Issue Date</th>
              <th className="px-6 py-3 font-medium">Due Date</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {staticInvoices.map((inv) => (
              <tr
                key={inv.id}
                className="hover:bg-slate-50 cursor-pointer"
                onClick={() => router.push(`/accounting/invoices/${inv.id}`)}
              >
                <td className="px-6 py-3 text-sm font-medium text-sky-600 whitespace-nowrap">
                  {inv.id}
                </td>
                <td className="px-6 py-3 text-base text-slate-800 whitespace-nowrap">{inv.client}</td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">{inv.agent}</td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">{inv.project}</td>
                <td className="px-6 py-3 text-base tabular-nums text-slate-800 whitespace-nowrap">{inv.subtotal}</td>
                <td className="px-6 py-3 text-base tabular-nums text-slate-600 whitespace-nowrap">{inv.vat}</td>
                <td className="px-6 py-3 text-base tabular-nums font-medium text-slate-800 whitespace-nowrap">{inv.total}</td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">{inv.issueDate}</td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">{inv.dueDate}</td>
                <td className="px-6 py-3">
                  <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${statusStyles[inv.status]}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <button className="rounded px-3 py-1.5 text-sm text-slate-500 hover:bg-sky-50 hover:text-sky-600 mr-2">Edit</button>
                  <button className="rounded px-3 py-1.5 text-sm text-rose-500 hover:bg-rose-50">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CreateInvoiceModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}