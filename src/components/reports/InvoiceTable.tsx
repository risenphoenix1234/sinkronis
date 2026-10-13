// src/components/reports/InvoiceTable.tsx
"use client";

import Link from "next/link";
import { FiDownload } from "react-icons/fi";
import { Invoice } from "@/lib/api/types/accounting.types";
import { naira } from "@/lib/api/accounting";

interface InvoiceTableProps {
  invoices: Invoice[];
  linkClients?: boolean;
  linkAgents?: boolean;
  linkProjects?: boolean;
  onDownloadCsv: () => void;
  onDownloadPdf: () => void;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const statusStyles: Record<string, string> = {
  PAID: "bg-emerald-50 text-emerald-700",
  SENT: "bg-sky-50 text-sky-700",
  PARTIALLY_PAID: "bg-amber-50 text-amber-700",
  OVERDUE: "bg-rose-50 text-rose-700",
  DRAFT: "bg-slate-100 text-slate-600",
  VOID: "bg-slate-100 text-slate-500",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function formatStatus(status: string) {
  const text = status.replace(/_/g, " ").toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default function InvoiceTable({
  invoices,
  linkClients,
  linkAgents,
  linkProjects,
  onDownloadCsv,
  onDownloadPdf,
  page = 1,
  totalPages = 1,
  onPageChange,
}: InvoiceTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-end gap-2 border-b border-slate-100 px-5 py-3">
        <button
          onClick={onDownloadCsv}
          className="flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
        >
          <FiDownload size={12} /> CSV
        </button>
        <button
          onClick={onDownloadPdf}
          className="flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
        >
          <FiDownload size={12} /> PDF
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-3 font-medium">Invoice</th>
              <th className="px-6 py-3 font-medium">Client</th>
              <th className="px-6 py-3 font-medium">Agent</th>
              <th className="px-6 py-3 font-medium">Project</th>
              <th className="px-6 py-3 font-medium">Total</th>
              <th className="px-6 py-3 font-medium">Issue Date</th>
              <th className="px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-sm text-slate-400">
                  No invoices found.
                </td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-3 text-sm font-medium text-sky-600">
                    <Link href={`/accounting/invoices/${inv.id}`}>{inv.invoiceNo}</Link>
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-sm text-slate-700">
                    {linkClients ? (
                      <Link href={`/accounting/reports/clients/${inv.clientId}`} className="text-sky-600 hover:underline">
                        {inv.client.name}
                      </Link>
                    ) : (
                      inv.client.name
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-sm text-slate-600">
                    {inv.assignedAgent ? (
                      linkAgents ? (
                        <Link
                          href={`/accounting/reports/agents/${inv.assignedAgentId}`}
                          className="text-sky-600 hover:underline"
                        >
                          {inv.assignedAgent.name}
                        </Link>
                      ) : (
                        inv.assignedAgent.name
                      )
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-sm text-slate-600">
                    {inv.project ? (
                      linkProjects ? (
                        <Link
                          href={`/accounting/reports/projects/${inv.projectId}`}
                          className="text-sky-600 hover:underline"
                        >
                          {inv.project.name}
                        </Link>
                      ) : (
                        inv.project.name
                      )
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-sm font-medium tabular-nums text-slate-800">
                    {naira(inv.total)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-sm text-slate-600">{formatDate(inv.issueDate)}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                        statusStyles[inv.status] ?? "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {formatStatus(inv.status)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3 text-sm text-slate-500">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}