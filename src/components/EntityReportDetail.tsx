// components/EntityReportDetail.tsx
"use client";

import Link from "next/link";
import { FiArrowLeft, FiDownload } from "react-icons/fi";
import {
  EntityDetail,
  InvoiceRow,
  getInvoicesForEntity,
  naira,
  statusStyles,
} from "@/lib/reports-data";

const typeLabel: Record<EntityDetail["type"], string> = {
  client: "Clients",
  agent: "Agents",
  project: "Projects",
};

export default function EntityReportDetail({
  detail,
}: {
  detail: EntityDetail;
}) {
  const invoices = getInvoicesForEntity(detail);

  const totalInvoices = invoices.length;
  const revenuePaid = invoices
    .filter((i) => i.status === "Paid")
    .reduce((sum, i) => sum + i.total, 0);
  const outstanding = invoices
    .filter((i) => i.status === "Sent" || i.status === "Overdue")
    .reduce((sum, i) => sum + i.total, 0);
  const vatCharged = invoices.reduce((sum, i) => sum + i.vat, 0);

  const subtotalSum = invoices.reduce((s, i) => s + i.subtotal, 0);
  const vatSum = invoices.reduce((s, i) => s + i.vat, 0);
  const totalSum = invoices.reduce((s, i) => s + i.total, 0);

  return (
    <section className="space-y-6 p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-slate-400">
        <Link href="/accounting/reports" className="hover:text-slate-600">
          Reports
        </Link>
        <span>/</span>
        <span>{typeLabel[detail.type]}</span>
        <span>/</span>
        <span className="text-slate-600">{detail.name}</span>
      </div>

      {/* Header card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/accounting/reports"
              className="flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              <FiArrowLeft size={14} /> Back
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-slate-900">
                  {detail.name}
                </h1>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  {detail.status}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-slate-400">
                {detail.meta.map((m) => (
                  <span key={m.label}>
                    {m.label}: <span className="text-slate-500">{m.value}</span>
                  </span>
                ))}
                <span>{detail.invitedOrStarted}</span>
              </div>
            </div>
          </div>
          <button className="flex items-center gap-2 rounded-md bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700 whitespace-nowrap">
            <FiDownload size={14} /> Download Report
          </button>
        </div>

        {/* Stats row */}
        <div className="mt-5 grid grid-cols-4 gap-4 border-t border-slate-100 pt-5">
          <div>
            <p className="text-xs text-slate-400">Total Invoices</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">
              {totalInvoices}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Revenue Paid</p>
            <p className="mt-1 text-xl font-semibold text-emerald-600">
              {naira(revenuePaid)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Outstanding</p>
            <p className="mt-1 text-xl font-semibold text-rose-600">
              {outstanding > 0 ? naira(outstanding) : "₦0"}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">VAT Charged</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">
              {naira(vatCharged)}
            </p>
          </div>
        </div>
      </div>

      {/* Invoice table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-3 font-medium">Invoice ID</th>
              <th className="px-6 py-3 font-medium">Client</th>
              <th className="px-6 py-3 font-medium">Agent</th>
              <th className="px-6 py-3 font-medium">Project</th>
              <th className="px-6 py-3 font-medium">Items / Services</th>
              <th className="px-6 py-3 font-medium">Subtotal</th>
              <th className="px-6 py-3 font-medium">VAT</th>
              <th className="px-6 py-3 font-medium">Total</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Issue Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.map((inv: InvoiceRow) => (
              <tr key={inv.id} className="hover:bg-slate-50">
                <td className="px-6 py-3 text-sm font-medium text-sky-600 whitespace-nowrap">
                  {inv.id}
                </td>
                <td className="px-6 py-3 text-sm text-slate-600 whitespace-nowrap">
                  {inv.client}
                </td>
                <td className="px-6 py-3 text-sm text-slate-600 whitespace-nowrap">
                  {inv.agent}
                </td>
                <td className="px-6 py-3 text-sm text-slate-600 whitespace-nowrap">
                  {inv.project}
                </td>
                <td className="px-6 py-3 text-sm text-slate-600 whitespace-nowrap">
                  {inv.itemsServices}
                </td>
                <td className="px-6 py-3 text-sm tabular-nums text-slate-600 whitespace-nowrap">
                  {naira(inv.subtotal)}
                </td>
                <td className="px-6 py-3 text-sm tabular-nums text-slate-600 whitespace-nowrap">
                  {naira(inv.vat)}
                </td>
                <td className="px-6 py-3 text-sm tabular-nums font-medium text-slate-800 whitespace-nowrap">
                  {naira(inv.total)}
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[inv.status]}`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm text-slate-500 whitespace-nowrap">
                  {inv.issueDate}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-slate-200 bg-slate-50">
              <td
                colSpan={5}
                className="px-6 py-3 text-sm font-medium text-slate-700"
              >
                Totals — {totalInvoices} invoices
              </td>
              <td className="px-6 py-3 text-sm tabular-nums font-semibold text-slate-900">
                {naira(subtotalSum)}
              </td>
              <td className="px-6 py-3 text-sm tabular-nums font-semibold text-slate-900">
                {naira(vatSum)}
              </td>
              <td className="px-6 py-3 text-sm tabular-nums font-semibold text-slate-900">
                {naira(totalSum)}
              </td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Export bar */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-500">
          Export {totalInvoices} invoices as:
        </p>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
            <FiDownload size={14} /> Download CSV
          </button>
          <button className="flex items-center gap-2 rounded-md bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700">
            <FiDownload size={14} /> Download PDF
          </button>
        </div>
      </div>
    </section>
  );
}
