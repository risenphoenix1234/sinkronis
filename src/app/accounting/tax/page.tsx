// app/tax/page.tsx
"use client";

import Link from "next/link";
import { allInvoices, naira } from "@/lib/reports-data";

const VAT_RATE = 7.5;

// TIN lookup — in a real app this would live on the client record itself.
const tinByClient: Record<string, string> = {
  "Zenith Technologies Ltd": "TIN-2034567890",
  "BlueStar Logistics": "TIN-4056789012",
  "Prestige Global Services": "TIN-3045678901",
};

export default function TaxPage() {
  // Draft invoices haven't been issued yet, so they don't count toward VAT collected.
  const vatableInvoices = allInvoices.filter((inv) => inv.status !== "Draft");

  const totalVatCollected = vatableInvoices.reduce((sum, inv) => sum + inv.vat, 0);

  const companies = Array.from(new Set(vatableInvoices.map((inv) => inv.client)));

  const vatByCompany = companies.map((client) => {
    const clientInvoices = vatableInvoices.filter((inv) => inv.client === client);
    return {
      client,
      tin: tinByClient[client] ?? "—",
      invoiceCount: clientInvoices.length,
      totalInvoiceValue: clientInvoices.reduce((s, inv) => s + inv.total, 0),
      vatAmount: clientInvoices.reduce((s, inv) => s + inv.vat, 0),
    };
  });

  return (
    <section className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Tax</h1>
        <p className="mt-1 text-sm text-slate-500">
          VAT collected at {VAT_RATE}% on applicable invoices
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
          <p className="text-sm text-slate-500">Total VAT Collected</p>
          <p className="mt-2 text-2xl font-semibold text-sky-600">
            {naira(totalVatCollected)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
          <p className="text-sm text-slate-500">Companies (VAT Payers)</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{companies.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
          <p className="text-sm text-slate-500">VAT Rate</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{VAT_RATE}%</p>
          <p className="mt-1 text-xs text-slate-400">FIRS Standard Rate</p>
        </div>
      </div>

      {/* VAT by Company */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-sm font-semibold text-slate-800">VAT by Company</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3 font-medium">Company Name</th>
                <th className="px-6 py-3 font-medium">Tax ID (TIN)</th>
                <th className="px-6 py-3 font-medium">Invoices</th>
                <th className="px-6 py-3 font-medium">Total Invoice Value</th>
                <th className="px-6 py-3 font-medium">VAT Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vatByCompany.map((row) => (
                <tr key={row.client} className="hover:bg-slate-50">
                  <td className="px-6 py-3 text-sm text-slate-700 whitespace-nowrap">
                    {row.client}
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-500 whitespace-nowrap">
                    {row.tin}
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-600 whitespace-nowrap">
                    {row.invoiceCount}
                  </td>
                  <td className="px-6 py-3 text-sm tabular-nums text-slate-700 whitespace-nowrap">
                    {naira(row.totalInvoiceValue)}
                  </td>
                  <td className="px-6 py-3 text-sm tabular-nums font-medium text-sky-600 whitespace-nowrap">
                    {naira(row.vatAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-200 bg-slate-50">
                <td colSpan={4} className="px-6 py-3 text-sm font-semibold text-slate-800">
                  Total VAT
                </td>
                <td className="px-6 py-3 text-sm tabular-nums font-semibold text-sky-600">
                  {naira(totalVatCollected)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Invoice-Level VAT Detail */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-sm font-semibold text-slate-800">Invoice-Level VAT Detail</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3 font-medium">Invoice</th>
                <th className="px-6 py-3 font-medium">Client</th>
                <th className="px-6 py-3 font-medium">Tax ID</th>
                <th className="px-6 py-3 font-medium">Issue Date</th>
                <th className="px-6 py-3 font-medium">Subtotal</th>
                <th className="px-6 py-3 font-medium">VAT ({VAT_RATE}%)</th>
                <th className="px-6 py-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vatableInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3 text-sm whitespace-nowrap">
                    <Link href={`/invoices/${inv.id}`} className="font-medium text-sky-600 hover:underline">
                      {inv.id}
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-700 whitespace-nowrap">
                    {inv.client}
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-500 whitespace-nowrap">
                    {tinByClient[inv.client] ?? "—"}
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-500 whitespace-nowrap">
                    {inv.issueDate}
                  </td>
                  <td className="px-6 py-3 text-sm tabular-nums text-slate-600 whitespace-nowrap">
                    {naira(inv.subtotal)}
                  </td>
                  <td className="px-6 py-3 text-sm tabular-nums font-medium text-sky-600 whitespace-nowrap">
                    {naira(inv.vat)}
                  </td>
                  <td className="px-6 py-3 text-sm tabular-nums font-medium text-slate-800 whitespace-nowrap">
                    {naira(inv.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}