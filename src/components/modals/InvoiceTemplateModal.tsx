// components/modals/InvoiceTemplateModal.tsx
"use client";

import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { InvoiceTemplate, PaymentTerm, paymentTermOptions } from "@/lib/settings-data";

type InvoiceTemplateModalProps = {
  open: boolean;
  mode: "edit" | "create";
  template: InvoiceTemplate | null;
  onClose: () => void;
  onSave: (data: Omit<InvoiceTemplate, "id" | "isDefault">, id?: string) => void;
};

const emptyForm = {
  name: "",
  paymentTerm: "Net 14" as PaymentTerm,
  headerNote: "",
  footerNote: "",
};

export default function InvoiceTemplateModal({
  open,
  mode,
  template,
  onClose,
  onSave,
}: InvoiceTemplateModalProps) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (mode === "edit" && template) {
      setForm({
        name: template.name,
        paymentTerm: template.paymentTerm,
        headerNote: template.headerNote,
        footerNote: template.footerNote,
      });
    } else {
      setForm(emptyForm);
    }
  }, [mode, template, open]);

  if (!open) return null;

  const isValid = form.name.trim().length > 0;
  const title = mode === "edit" ? "Edit Template" : "New Invoice Template";
  const subtitle =
    mode === "edit" ? "Customize this invoice template" : "Set up a new invoice template";
  const submitLabel = mode === "edit" ? "Save Changes" : "Create Template";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-base font-semibold text-slate-900">{title}</h2>
            <p className="mt-0.5 text-sm text-slate-400">{subtitle}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <FiX size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4 p-6">
          <div>
            <label className="mb-1 block text-xs text-slate-500">Template Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Retainer Invoice"
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-500">Payment Terms</label>
            <select
              value={form.paymentTerm}
              onChange={(e) => setForm((f) => ({ ...f, paymentTerm: e.target.value as PaymentTerm }))}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-sky-400"
            >
              {paymentTermOptions.map((term) => (
                <option key={term} value={term}>
                  {term}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-500">Header Note</label>
            <textarea
              value={form.headerNote}
              onChange={(e) => setForm((f) => ({ ...f, headerNote: e.target.value }))}
              rows={2}
              placeholder="A short message shown at the top of the invoice"
              className="w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-500">Footer Note</label>
            <textarea
              value={form.footerNote}
              onChange={(e) => setForm((f) => ({ ...f, footerNote: e.target.value }))}
              rows={2}
              placeholder="A short message shown at the bottom of the invoice"
              className="w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-400"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 border-t border-slate-100 px-6 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-md border border-slate-200 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => isValid && onSave(form, template?.id)}
            disabled={!isValid}
            className="flex-1 rounded-md bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-300"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}