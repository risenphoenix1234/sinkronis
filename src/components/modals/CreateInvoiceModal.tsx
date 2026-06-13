"use client";

import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

type LineItem = {
  item: string;
  qty: number;
  unitPrice: number;
  vat: number;
};

export default function CreateInvoiceModal({ open, onClose }: Props) {
  const [form, setForm] = useState({
    client: "",
    tin: "",
    agent: "",
    project: "",
    issueDate: "",
    dueDate: "",
    note: "",
  });

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { item: "", qty: 1, unitPrice: 0, vat: 7.5 },
  ]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLineChange = (
    index: number,
    field: keyof LineItem,
    value: string | number
  ) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
  };

  const addLine = () =>
    setLineItems([...lineItems, { item: "", qty: 1, unitPrice: 0, vat: 7.5 }]);

  const removeLine = (i: number) =>
    setLineItems(lineItems.filter((_, idx) => idx !== i));

  const subtotal = lineItems.reduce(
    (sum, l) => sum + l.qty * l.unitPrice,
    0
  );
  const vatTotal = lineItems.reduce(
    (sum, l) => sum + (l.qty * l.unitPrice * l.vat) / 100,
    0
  );
  const total = subtotal + vatTotal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Create Invoice</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
        </div>

        <div className="space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-slate-600">Client</label>
              <input name="client" value={form.client} onChange={handleChange}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-600">TIN</label>
              <input name="tin" value={form.tin} onChange={handleChange}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400" />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-slate-600">Agent</label>
              <input name="agent" value={form.agent} onChange={handleChange}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-600">Project</label>
              <input name="project" value={form.project} onChange={handleChange}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400" />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-slate-600">Issue Date</label>
              <input name="issueDate" value={form.issueDate} onChange={handleChange} type="date"
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-600">Due Date</label>
              <input name="dueDate" value={form.dueDate} onChange={handleChange} type="date"
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400" />
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="mb-1 block text-sm text-slate-600">Note</label>
            <textarea name="note" value={form.note} onChange={handleChange} rows={2}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400 resize-none" />
          </div>

          {/* Line Items */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-700">Line Items</p>
              <button onClick={addLine} className="text-xs text-sky-600 hover:underline">+ Add line</button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-slate-100">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-xs text-slate-500">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Item</th>
                    <th className="px-3 py-2 text-right font-medium w-16">Qty</th>
                    <th className="px-3 py-2 text-right font-medium w-28">Unit Price</th>
                    <th className="px-3 py-2 text-right font-medium w-20">VAT %</th>
                    <th className="px-3 py-2 text-right font-medium w-28">Amount</th>
                    <th className="w-8" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lineItems.map((line, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2">
                        <input value={line.item} onChange={(e) => handleLineChange(i, "item", e.target.value)}
                          className="w-full outline-none text-sm text-slate-800 bg-transparent" placeholder="Item name" />
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" value={line.qty} onChange={(e) => handleLineChange(i, "qty", +e.target.value)}
                          className="w-full outline-none text-sm text-right text-slate-800 bg-transparent" />
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" value={line.unitPrice} onChange={(e) => handleLineChange(i, "unitPrice", +e.target.value)}
                          className="w-full outline-none text-sm text-right text-slate-800 bg-transparent" />
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" value={line.vat} onChange={(e) => handleLineChange(i, "vat", +e.target.value)}
                          className="w-full outline-none text-sm text-right text-slate-800 bg-transparent" />
                      </td>
                      <td className="px-3 py-2 text-right text-slate-700 tabular-nums">
                        ₦{(line.qty * line.unitPrice).toLocaleString()}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {lineItems.length > 1 && (
                          <button onClick={() => removeLine(i)} className="text-rose-400 hover:text-rose-600 text-base leading-none">×</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mt-3 space-y-1 text-sm text-right">
              <p className="text-slate-500">Subtotal: <span className="text-slate-800 tabular-nums font-medium">₦{subtotal.toLocaleString()}</span></p>
              <p className="text-slate-500">VAT: <span className="text-slate-800 tabular-nums font-medium">₦{vatTotal.toLocaleString()}</span></p>
              <p className="text-base font-semibold text-slate-900">Total: ₦{total.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose}
            className="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
            Cancel
          </button>
          <button className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700">
            Create Invoice
          </button>
        </div>
      </div>
    </div>
  );
}