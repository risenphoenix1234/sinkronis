"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getInvoiceDetail } from "@/lib/api/accounting";
import { Invoice } from "@/lib/api/types/accounting.types";

const statusStyles: Record<string, string> = {
  PAID: "bg-emerald-50 text-emerald-700",
  SENT: "bg-sky-50 text-sky-700",
  OVERDUE: "bg-rose-50 text-rose-700",
  DRAFT: "bg-slate-100 text-slate-600",
};

const historyDot: Record<string, string> = {
  PAID: "bg-emerald-500",
  SENT: "bg-sky-500",
  DRAFT: "bg-slate-400",
  OVERDUE: "bg-rose-500",
};

function naira(value: number) {
  return `₦${value.toLocaleString()}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getInvoiceDetail(params.id);
        setInvoice(res.data);
      } catch (err) {
        setError("Failed to load invoice.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [params.id]);

  if (loading) {
    return (
      <section className="p-6">
        <p className="text-sm text-slate-400">Loading invoice...</p>
      </section>
    );
  }

  if (error || !invoice) {
    return (
      <section className="p-6">
        <p className="text-sm text-red-500">{error ?? "Invoice not found."}</p>
      </section>
    );
  }

  return (
    <section className="space-y-6 p-6">
      <Link href="/accounting/invoices" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-sky-600">
        ← Back to Invoices
      </Link>

      <div className="flex gap-6">
        <div className="flex-1 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-4 flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-slate-900">{invoice.invoiceNo}</h1>
              <span className={`rounded-full px-3 py-1 text-sm font-medium ${statusStyles[invoice.status]}`}>
                {invoice.status.charAt(0) + invoice.status.slice(1).toLowerCase()}
              </span>
            </div>
            <p className="text-sm text-slate-500">Invoice Detail · Issued {formatDate(invoice.issueDate)}</p>

            <div className="mt-5 grid grid-cols-3 gap-6 text-sm">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Client</p>
                <p className="font-medium text-slate-800">{invoice.client.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">TIN</p>
                <p className="font-medium text-slate-800">{invoice.client.taxId ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Agent</p>
                <p className="font-medium text-slate-800">{invoice.assignedAgent?.name ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Project</p>
                <p className="font-medium text-slate-800">{invoice.project?.name ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Issue Date</p>
                <p className="font-medium text-slate-800">{formatDate(invoice.issueDate)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Due Date</p>
                <p className="font-medium text-slate-800">{formatDate(invoice.dueDate)}</p>
              </div>
            </div>

            {invoice.notes && (
              <div className="mt-4 rounded-md bg-slate-50 px-4 py-3 text-sm text-slate-600">
                {invoice.notes}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-base font-semibold text-slate-800">Line Items</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Item</th>
                    <th className="px-4 py-3 text-right font-medium">Qty</th>
                    <th className="px-4 py-3 text-right font-medium">Unit Price</th>
                    <th className="px-4 py-3 text-right font-medium">VAT</th>
                    <th className="px-4 py-3 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoice.items.map((line) => (
                    <tr key={line.id}>
                      <td className="px-4 py-3 text-base text-slate-800">{line.catalogueItem.name}</td>
                      <td className="px-4 py-3 text-base text-right tabular-nums text-slate-600">{line.quantity}</td>
                      <td className="px-4 py-3 text-base text-right tabular-nums text-slate-600">{naira(line.unitPrice)}</td>
                      <td className="px-4 py-3 text-base text-right tabular-nums text-slate-600">
                        {line.vatApplicable ? `${(line.vatRate * 100).toFixed(0)}%` : "—"}
                      </td>
                      <td className="px-4 py-3 text-base text-right tabular-nums font-medium text-slate-800">
                        {naira(line.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-end">
              <div className="w-64 space-y-2 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="tabular-nums text-slate-800">{naira(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>VAT</span>
                  <span className="tabular-nums text-slate-800">{naira(invoice.vat)}</span>
                </div>
                {invoice.whtApplicable && (
                  <div className="flex justify-between text-slate-500">
                    <span>WHT ({invoice.whtRate}%)</span>
                    <span className="tabular-nums text-rose-600">-{naira(invoice.whtAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-semibold text-slate-900">
                  <span>Amount Payable</span>
                  <span className="tabular-nums">{naira(invoice.amountPayable)}</span>
                </div>
                {invoice.paidAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Paid</span>
                    <span className="tabular-nums">{naira(invoice.paidAmount)}</span>
                  </div>
                )}
                {invoice.balanceDue > 0 && (
                  <div className="flex justify-between font-medium text-rose-600">
                    <span>Balance Due</span>
                    <span className="tabular-nums">{naira(invoice.balanceDue)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-64 shrink-0">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-slate-800">Status History</h2>
            <div className="space-y-4">
              {invoice.statusHistory.map((h) => (
                <div key={h.id} className="flex items-start gap-3">
                  <div className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${historyDot[h.status] ?? "bg-slate-400"}`} />
                  <div>
                    <p className="text-sm font-medium text-slate-800">{h.description}</p>
                    <p className="text-xs text-slate-500">
                      {h.actor.firstName} {h.actor.lastName} · {formatDate(h.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}