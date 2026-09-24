"use client";

import { useEffect, useState } from "react";
import { getCustomers, getCatalogueItems, getProjects } from "@/lib/api/accounting";
import { Customer, CatalogueItem, ProjectListItem, CreateInvoicePayload } from "@/lib/api/types/accounting.types";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: CreateInvoicePayload) => void;
};

interface LineItemInput {
  catalogueItemId: string;
  quantity: string;
}

export default function CreateInvoiceModal({ open, onClose, onCreate }: Props) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [catalogueItems, setCatalogueItems] = useState<CatalogueItem[]>([]);
  const [projects, setProjects] = useState<ProjectListItem[]>([]);

  const [clientId, setClientId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [whtApplicable, setWhtApplicable] = useState(false);
  const [whtRate, setWhtRate] = useState<5 | 10>(5);
  const [lineItems, setLineItems] = useState<LineItemInput[]>([{ catalogueItemId: "", quantity: "1" }]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      getCustomers().then((res) => setCustomers(res.data.customers)).catch(() => {});
      getCatalogueItems().then((res) => setCatalogueItems(res.data.items)).catch(() => {});
      getProjects().then((res) => setProjects(res.data.projects)).catch(() => {});
    }
  }, [open]);

  if (!open) return null;

  const resetForm = () => {
    setClientId("");
    setProjectId("");
    setDueDate("");
    setNotes("");
    setWhtApplicable(false);
    setWhtRate(5);
    setLineItems([{ catalogueItemId: "", quantity: "1" }]);
  };

  const updateLine = (index: number, field: keyof LineItemInput, value: string) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
  };

  const addLine = () => setLineItems([...lineItems, { catalogueItemId: "", quantity: "1" }]);
  const removeLine = (i: number) => setLineItems(lineItems.filter((_, idx) => idx !== i));

  const validLines = lineItems.filter((l) => l.catalogueItemId && l.quantity);

  const estimatedTotal = validLines.reduce((sum, line) => {
    const item = catalogueItems.find((c) => c.id === line.catalogueItemId);
    if (!item) return sum;
    return sum + item.unitPrice * Number(line.quantity || 0);
  }, 0);

  const handleSubmit = async () => {
    if (!clientId || !dueDate || validLines.length === 0) return;
    setSaving(true);
    try {
      await onCreate({
        clientId,
        projectId: projectId || undefined,
        dueDate,
        notes: notes.trim() || undefined,
        whtApplicable,
        whtRate: whtApplicable ? whtRate : undefined,
        items: validLines,
      });
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Create Invoice</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-slate-600">Client</label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400 bg-white"
              >
                <option value="">Select a client</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.companyName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-600">Project (optional)</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400 bg-white"
              >
                <option value="">No project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-600">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-600">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400 resize-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={whtApplicable}
                onChange={(e) => setWhtApplicable(e.target.checked)}
              />
              Apply Withholding Tax (WHT)
            </label>
            {whtApplicable && (
              <select
                value={whtRate}
                onChange={(e) => setWhtRate(Number(e.target.value) as 5 | 10)}
                className="rounded-md border border-slate-200 px-2 py-1 text-sm outline-none bg-white"
              >
                <option value={5}>5%</option>
                <option value={10}>10%</option>
              </select>
            )}
          </div>

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
                    <th className="px-3 py-2 text-right font-medium w-20">Qty</th>
                    <th className="px-3 py-2 text-right font-medium w-28">Unit Price</th>
                    <th className="px-3 py-2 text-right font-medium w-28">Amount</th>
                    <th className="w-8" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lineItems.map((line, i) => {
                    const item = catalogueItems.find((c) => c.id === line.catalogueItemId);
                    return (
                      <tr key={i}>
                        <td className="px-3 py-2">
                          <select
                            value={line.catalogueItemId}
                            onChange={(e) => updateLine(i, "catalogueItemId", e.target.value)}
                            className="w-full outline-none text-sm text-slate-800 bg-transparent"
                          >
                            <option value="">Select item</option>
                            {catalogueItems.map((c) => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            min="1"
                            value={line.quantity}
                            onChange={(e) => updateLine(i, "quantity", e.target.value)}
                            className="w-full outline-none text-sm text-right text-slate-800 bg-transparent"
                          />
                        </td>
                        <td className="px-3 py-2 text-right text-slate-600 tabular-nums">
                          {item ? `₦${item.unitPrice.toLocaleString()}` : "—"}
                        </td>
                        <td className="px-3 py-2 text-right text-slate-700 tabular-nums">
                          {item ? `₦${(item.unitPrice * Number(line.quantity || 0)).toLocaleString()}` : "—"}
                        </td>
                        <td className="px-3 py-2 text-center">
                          {lineItems.length > 1 && (
                            <button onClick={() => removeLine(i)} className="text-rose-400 hover:text-rose-600 text-base leading-none">×</button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-3 text-right text-sm">
              <p className="text-base font-semibold text-slate-900">
                Estimated Total: ₦{estimatedTotal.toLocaleString()}
              </p>
              <p className="text-xs text-slate-400">Final total, VAT and WHT are calculated by the server.</p>
            </div>
          </div>

          {catalogueItems.length === 0 && (
            <div className="rounded-md border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-700">
              No items or services in your catalogue yet — add one under Items &amp; Services first.
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !clientId || !dueDate || validLines.length === 0}
            className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60"
          >
            {saving ? "Creating..." : "Create Invoice"}
          </button>
        </div>
      </div>
    </div>
  );
}