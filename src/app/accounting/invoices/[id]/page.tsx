import Link from "next/link";

const invoiceData: Record<string, {
  id: string; status: string; issuedDate: string;
  client: string; tin: string; agent: string;
  project: string; issueDate: string; dueDate: string; note: string;
  lineItems: { item: string; qty: number; unitPrice: number; vat: number }[];
  statusHistory: { status: string; label: string; description: string }[];
}> = {
  "INV-001": {
    id: "INV-001", status: "Paid", issuedDate: "01 Apr 2026",
    client: "Zenith Technologies Ltd", tin: "TIN-2034567890",
    agent: "Emeka Okafor", project: "Zenith HRIS Deployment",
    issueDate: "01 Apr 2026", dueDate: "15 Apr 2026",
    note: "Payment within 14 days.",
    lineItems: [
      { item: "HR Software License", qty: 3, unitPrice: 80000, vat: 7.5 },
      { item: "Implementation & Onboarding", qty: 1, unitPrice: 250000, vat: 7.5 },
    ],
    statusHistory: [
      { status: "paid", label: "Paid", description: "Payment received from client" },
      { status: "sent", label: "Sent", description: "Invoice sent to client" },
      { status: "draft", label: "Draft", description: "Invoice created" },
    ],
  },
};

const statusStyles: Record<string, string> = {
  Paid: "bg-emerald-50 text-emerald-700",
  Sent: "bg-sky-50 text-sky-700",
  Overdue: "bg-rose-50 text-rose-700",
  Draft: "bg-slate-100 text-slate-600",
};

const historyDot: Record<string, string> = {
  paid: "bg-emerald-500",
  sent: "bg-sky-500",
  draft: "bg-slate-400",
};

export default function InvoiceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const invoice = invoiceData[params.id];

  if (!invoice) {
    return (
      <div className="p-6 text-slate-500">Invoice not found.</div>
    );
  }

  const subtotal = invoice.lineItems.reduce((s, l) => s + l.qty * l.unitPrice, 0);
  const vatTotal = invoice.lineItems.reduce((s, l) => s + (l.qty * l.unitPrice * l.vat) / 100, 0);
  const total = subtotal + vatTotal;

  return (
    <section className="space-y-6 p-6">
      {/* Back */}
      <Link href="/accounting/invoices" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-sky-600">
        ← Back to Invoices
      </Link>

      <div className="flex gap-6">
        {/* Main */}
        <div className="flex-1 space-y-6">
          {/* Invoice header */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-4 flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-slate-900">{invoice.id}</h1>
              <span className={`rounded-full px-3 py-1 text-sm font-medium ${statusStyles[invoice.status]}`}>
                {invoice.status}
              </span>
            </div>
            <p className="text-sm text-slate-500">Invoice Detail · Issued {invoice.issuedDate}</p>

            {/* Meta grid */}
            <div className="mt-5 grid grid-cols-3 gap-6 text-sm">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Client</p>
                <p className="font-medium text-slate-800">{invoice.client}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">TIN</p>
                <p className="font-medium text-slate-800">{invoice.tin}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Agent</p>
                <p className="font-medium text-slate-800">{invoice.agent}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Project</p>
                <p className="font-medium text-slate-800">{invoice.project}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Issue Date</p>
                <p className="font-medium text-slate-800">{invoice.issueDate}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Due Date</p>
                <p className="font-medium text-slate-800">{invoice.dueDate}</p>
              </div>
            </div>

            {invoice.note && (
              <div className="mt-4 rounded-md bg-slate-50 px-4 py-3 text-sm text-slate-600">
                {invoice.note}
              </div>
            )}
          </div>

          {/* Line items */}
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
                  {invoice.lineItems.map((line, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3 text-base text-slate-800">{line.item}</td>
                      <td className="px-4 py-3 text-base text-right tabular-nums text-slate-600">{line.qty}</td>
                      <td className="px-4 py-3 text-base text-right tabular-nums text-slate-600">
                        ₦{line.unitPrice.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-base text-right tabular-nums text-slate-600">{line.vat}%</td>
                      <td className="px-4 py-3 text-base text-right tabular-nums font-medium text-slate-800">
                        ₦{(line.qty * line.unitPrice).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mt-4 flex justify-end">
              <div className="w-64 space-y-2 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="tabular-nums text-slate-800">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>VAT (7.5%)</span>
                  <span className="tabular-nums text-slate-800">₦{vatTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-semibold text-slate-900">
                  <span>Total</span>
                  <span className="tabular-nums">₦{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status History sidebar */}
        <div className="w-64 shrink-0">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-slate-800">Status History</h2>
            <div className="space-y-4">
              {invoice.statusHistory.map((h, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${historyDot[h.status]}`} />
                  <div>
                    <p className="text-sm font-medium text-slate-800">{h.label}</p>
                    <p className="text-xs text-slate-500">{h.description}</p>
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