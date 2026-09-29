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
}

const statusStyles: Record<string, string> = {
  PAID: "bg-emerald-50 text-emerald-700",
  SENT: "bg-sky-50 text-sky-700",
  OVERDUE: "bg-rose-50 text-rose-700",
  DRAFT: "bg-slate-100 text-slate-600",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function InvoiceTable({
  invoices,
  linkClients,
  linkAgents,
  linkProjects,
  onDownloadCsv,
  onDownloadPdf,
}: InvoiceTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-end gap-2 border-b border-slate-100 px-5 py-3">
        <button onClick={onDownloadCsv} className="flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50">
          <FiDownload size={12} /> CSV
        </button>
        <button onClick={onDownloadPdf} className="flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50">
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
                <td colSpan={7} className="px-6 py-10 text-center text-sm text-slate-400">No invoices found.</td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3 text-sm font-medium text-sky-600 whitespace-nowrap">
                    <Link href={`/accounting/invoices/${inv.id}`}>{inv.invoiceNo}</Link>
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-700 whitespace-nowrap">
                    {linkClients ? (
                      <Link href={`/accounting/reports/clients/${inv.clientId}`}className="text-sky-600 hover:underline">{inv.client.name}</Link>
                    ) : inv.client.name}
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-600 whitespace-nowrap">
                    {inv.assignedAgent ? (
                      linkAgents ? (
                        <Link href={`/accounting/reports/agents/${inv.assignedAgentId}`}className="text-sky-600 hover:underline">{inv.assignedAgent.name}</Link>
                      ) : inv.assignedAgent.name
                    ) : "—"}
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-600 whitespace-nowrap">
                    {inv.project ? (
                      linkProjects ? (
                        <Link href={`/accounting/reports/projects/${inv.projectId}`} className="text-sky-600 hover:underline">{inv.project.name}</Link>
                      ) : inv.project.name
                    ) : "—"}
                  </td>
                  <td className="px-6 py-3 text-sm tabular-nums font-medium text-slate-800 whitespace-nowrap">{naira(inv.total)}</td>
                  <td className="px-6 py-3 text-sm text-slate-600 whitespace-nowrap">{formatDate(inv.issueDate)}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${statusStyles[inv.status]}`}>
                      {inv.status.charAt(0) + inv.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}