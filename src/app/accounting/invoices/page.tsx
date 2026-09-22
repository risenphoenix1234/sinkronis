"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CreateInvoiceModal from "@/components/modals/CreateInvoiceModal";
import { getInvoices, createInvoice } from "@/lib/api/accounting";
import { CreateInvoicePayload, Invoice } from "@/lib/api/types/accounting.types";

const statusStyles: Record<string, string> = {
  PAID: "bg-emerald-50 text-emerald-700",
  SENT: "bg-sky-50 text-sky-700",
  OVERDUE: "bg-rose-50 text-rose-700",
  DRAFT: "bg-slate-100 text-slate-600",
};

function naira(value: number) {
  return `₦${value.toLocaleString()}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getInvoices();
      setInvoices(res.data.invoices);
    } catch (err) {
      setError("Failed to load invoices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleCreate = async (payload: CreateInvoicePayload) => {
    try {
      await createInvoice(payload);
      setModalOpen(false);
      await fetchInvoices();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to create invoice.");
    }
  };

  return (
    <section className="space-y-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Invoices</h1>
          <p className="mt-1 text-sm text-slate-500">{invoices.length} invoices total</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalOpen(true)}
            className="rounded-md bg-sky-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-700 whitespace-nowrap"
          >
            + Create Invoice
          </button>
        </div>
      </div>

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
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr>
                <td colSpan={10} className="px-6 py-8 text-center text-sm text-slate-400">Loading invoices...</td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={10} className="px-6 py-8 text-center text-sm text-red-500">{error}</td>
              </tr>
            )}

            {!loading && !error && invoices.map((inv) => (
              <tr
                key={inv.id}
                className="hover:bg-slate-50 cursor-pointer"
                onClick={() => router.push(`/accounting/invoices/${inv.id}`)}
              >
                <td className="px-6 py-3 text-sm font-medium text-sky-600 whitespace-nowrap">{inv.invoiceNo}</td>
                <td className="px-6 py-3 text-base text-slate-800 whitespace-nowrap">{inv.client.name}</td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">{inv.assignedAgent?.name ?? "—"}</td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">{inv.project?.name ?? "—"}</td>
                <td className="px-6 py-3 text-base tabular-nums text-slate-800 whitespace-nowrap">{naira(inv.subtotal)}</td>
                <td className="px-6 py-3 text-base tabular-nums text-slate-600 whitespace-nowrap">{naira(inv.vat)}</td>
                <td className="px-6 py-3 text-base tabular-nums font-medium text-slate-800 whitespace-nowrap">{naira(inv.total)}</td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">{formatDate(inv.issueDate)}</td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">{formatDate(inv.dueDate)}</td>
                <td className="px-6 py-3">
                  <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${statusStyles[inv.status]}`}>
                    {inv.status.charAt(0) + inv.status.slice(1).toLowerCase()}
                  </span>
                </td>
              </tr>
            ))}

            {!loading && !error && invoices.length === 0 && (
              <tr>
                <td colSpan={10} className="px-6 py-8 text-center text-sm text-slate-400">No invoices yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CreateInvoiceModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={handleCreate} />
    </section>
  );
}