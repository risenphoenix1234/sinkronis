"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getInvoices } from "@/lib/api/accounting";
import { Invoice } from "@/lib/api/types/accounting.types";
import Loader from "@/components/ui/Loader";

function naira(value: number) {
  return `₦${value.toLocaleString()}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function TaxPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      setError(null);
      try {
        // NOTE: fetching a large page rather than implementing pagination here —
        // fine for now (tenant has 3 invoices), but revisit if tax reporting
        // needs to cover tenants with hundreds of invoices.
        const res = await getInvoices({ limit: 100 });
        setInvoices(res.data.invoices);
      } catch (err) {
        setError("Failed to load invoices.");
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  // Draft invoices haven't been issued yet, so they don't count toward VAT collected.
  // CONFIRMED via live data: GET /accounting/invoices still returns DRAFT rows,
  // so this client-side filter is necessary, not redundant.
  const vatableInvoices = invoices.filter((inv) => inv.status !== "DRAFT");

  const totalVatCollected = vatableInvoices.reduce((sum, inv) => sum + inv.vat, 0);
  const totalSubtotal = vatableInvoices.reduce((sum, inv) => sum + inv.subtotal, 0);

  // Effective rate computed from real data rather than asserting a fixed constant —
  // the mock's hardcoded 7.5% doesn't match live invoices, which compute at 8%.
  const effectiveVatRate = totalSubtotal > 0 ? (totalVatCollected / totalSubtotal) * 100 : 0;

  const companies = Array.from(new Set(vatableInvoices.map((inv) => inv.client.id)));

  const vatByCompany = companies.map((clientId) => {
    const clientInvoices = vatableInvoices.filter((inv) => inv.client.id === clientId);
    const client = clientInvoices[0].client;
    return {
      clientId,
      name: client.name,
      taxId: client.taxId ?? "—",
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
          VAT collected on sent, paid, and overdue invoices
        </p>
      </div>

      {loading && <Loader variant="section" label="Loading tax data" />}
      {!loading && error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && (
        <>
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
              <p className="text-sm text-slate-500">Effective VAT Rate</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {effectiveVatRate.toFixed(1)}%
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Computed from invoiced amounts — rate is set per catalogue item, not tenant-wide
              </p>
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
                    <tr key={row.clientId} className="hover:bg-slate-50">
                      <td className="px-6 py-3 text-sm text-slate-700 whitespace-nowrap">{row.name}</td>
                      <td className="px-6 py-3 text-sm text-slate-500 whitespace-nowrap">{row.taxId}</td>
                      <td className="px-6 py-3 text-sm text-slate-600 whitespace-nowrap">{row.invoiceCount}</td>
                      <td className="px-6 py-3 text-sm tabular-nums text-slate-700 whitespace-nowrap">
                        {naira(row.totalInvoiceValue)}
                      </td>
                      <td className="px-6 py-3 text-sm tabular-nums font-medium text-sky-600 whitespace-nowrap">
                        {naira(row.vatAmount)}
                      </td>
                    </tr>
                  ))}
                  {vatByCompany.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-400">
                        No VAT-applicable invoices yet.
                      </td>
                    </tr>
                  )}
                </tbody>
                {vatByCompany.length > 0 && (
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
                )}
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
                    <th className="px-6 py-3 font-medium">VAT</th>
                    <th className="px-6 py-3 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vatableInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50">
                      <td className="px-6 py-3 text-sm whitespace-nowrap">
                        <Link href={`/accounting/invoices/${inv.id}`} className="font-medium text-sky-600 hover:underline">
                          {inv.invoiceNo}
                        </Link>
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-700 whitespace-nowrap">{inv.client.name}</td>
                      <td className="px-6 py-3 text-sm text-slate-500 whitespace-nowrap">{inv.client.taxId ?? "—"}</td>
                      <td className="px-6 py-3 text-sm text-slate-500 whitespace-nowrap">{formatDate(inv.issueDate)}</td>
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
                  {vatableInvoices.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-400">
                        No invoices to display.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </section>
  );
}