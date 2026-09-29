// components/reports/InvoiceTable.tsx
"use client";

import Link from "next/link";
import { FiDownload } from "react-icons/fi";
import { Invoice } from "@/lib/api/types/accounting.types";
import { naira, sumInvoices } from "@/lib/api/accounting";

const statusStyles: Record<string, string> = {
  PAID: "bg-emerald-50 text-emerald-600",
  PENDING: "bg-amber-50 text-amber-600",
  SENT: "bg-sky-50 text-sky-600",
  OVERDUE: "bg-rose-50 text-rose-600",
  DRAFT: "bg-slate-100 text-slate-600",
};

const refName = (ref: unknown): string => {
  if (typeof ref === "string") return ref;
  const name = (ref as { name?: string } | null | undefined)?.name;
  return name ?? "—";
};

const itemsText = (inv: Invoice): string => {
  const items = (inv.items ?? []) as unknown as { name?: string; description?: string }[];
  const text = items.map((i) => i.name ?? i.description).filter(Boolean).join(", ");
  return text || "—";
};

interface InvoiceTableProps {
  invoices: Invoice[];
  /** Link the Client column to /reports/clients/[id] */
  linkClients?: boolean;
  /** Link the Agent column to /reports/agents/[id] */
  linkAgents?: boolean;
  /** Link the Project column to /reports/projects/[id] */
  linkProjects?: boolean;
  onDownloadCsv?: () => void;
  onDownloadPdf?: () => void;
}

export default function InvoiceTable({
  invoices,
  linkClients = false,
  linkAgents = false,
  linkProjects = false,
  onDownloadCsv,
  onDownloadPdf,
}: InvoiceTableProps) {
  const totalValue = sumInvoices(invoices);
  const totalSubtotal = invoices.reduce((s, inv) => s + inv.subtotal, 0);
  const totalVat = invoices.reduce((s, inv) => s + inv.vat, 0);

  return (
    <div className="space-y-6">
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
            {invoices.length === 0 && (
              <tr>
                <td colSpan={10} className="px-6 py-10 text-center text-sm text-slate-400">
                  No invoices found.
                </td>
              </tr>
            )}
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50">
                <td className="px-6 py-3 text-sm font-medium text-sky-600 whitespace-nowrap">
                  {inv.id}
                </td>
                <td className="px-6 py-3 text-sm text-slate-600 whitespace-nowrap">
                  {linkClients && inv.clientId ? (
                    <Link href={`/accounting/reports/clients/${inv.clientId}`}className="hover:underline">
                      {refName(inv.client)}
                    </Link>
                  ) : (
                    refName(inv.client)
                  )}
                </td>
                <td className="px-6 py-3 text-sm text-slate-600 whitespace-nowrap">
                  {linkAgents && inv.assignedAgentId ? (
                    <Link href={`/accounting/reports/agents/${inv.assignedAgentId}`}className="hover:underline">
                      {refName(inv.assignedAgent)}
                    </Link>
                  ) : (
                    refName(inv.assignedAgent)
                  )}
                </td>
                <td className="px-6 py-3 text-sm text-slate-600 whitespace-nowrap">
                  {linkProjects && inv.projectId ? (
                    <Link href={`/accounting/reports/projects/${inv.projectId}`} className="hover:underline">
                      {refName(inv.project)}
                    </Link>
                  ) : (
                    refName(inv.project)
                  )}
                </td>
                <td className="px-6 py-3 text-sm text-slate-600 whitespace-nowrap">
                  {itemsText(inv)}
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
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      statusStyles[inv.status?.toUpperCase()] ?? "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm text-slate-500 whitespace-nowrap">{inv.issueDate}</td>
              </tr>
            ))}
          </tbody>
          {invoices.length > 0 && (
            <tfoot>
              <tr className="border-t border-slate-200 bg-slate-50">
                <td colSpan={5} className="px-6 py-3 text-sm font-medium text-slate-700">
                  Totals — {invoices.length} invoice{invoices.length === 1 ? "" : "s"}
                </td>
                <td className="px-6 py-3 text-sm tabular-nums text-slate-600">{naira(totalSubtotal)}</td>
                <td className="px-6 py-3 text-sm tabular-nums text-slate-600">{naira(totalVat)}</td>
                <td className="px-6 py-3 text-sm tabular-nums font-semibold text-slate-900">
                  {naira(totalValue)}
                </td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-500">Export {invoices.length} invoices as:</p>
        <div className="flex items-center gap-3">
          <button
            onClick={onDownloadCsv}
            className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            <FiDownload size={14} /> Download CSV
          </button>
          <button
            onClick={onDownloadPdf}
            className="flex items-center gap-2 rounded-md bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700"
          >
            <FiDownload size={14} /> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}