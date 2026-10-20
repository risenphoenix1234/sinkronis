// src/components/modals/ManualEntryModal.tsx
"use client";

import { useState } from "react";
import { FiX, FiArrowLeft } from "react-icons/fi";
import BankSelect from "@/components/ui/BankSelect";

export type ManualEntryData = {
  bankName: string;
  bankCode: string;
  accountPaidInto: string;
  amount: string;
  reference: string;
  dateOfPayment: string;
  note: string;
};

type ManualEntryModalProps = {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
  onSubmit: (data: ManualEntryData) => Promise<void>;
};

const emptyForm: ManualEntryData = {
  bankName: "",
  bankCode: "",
  accountPaidInto: "",
  amount: "",
  reference: "",
  dateOfPayment: "",
  note: "",
};

export default function ManualEntryModal({ open, onClose, onBack, onSubmit }: ManualEntryModalProps) {
  const [form, setForm] = useState<ManualEntryData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const update = (field: keyof ManualEntryData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const isValid = form.amount && form.reference;

  const handleSubmit = async () => {
    if (!isValid) return;
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(form);
      setForm(emptyForm);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to log manual funding.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-start gap-3">
            <button onClick={onBack} className="mt-0.5 text-slate-400 hover:text-slate-600">
              <FiArrowLeft size={16} />
            </button>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Manual Entry</h2>
              <p className="mt-0.5 text-sm text-slate-400">Log a bank transfer you've already confirmed</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <FiX size={18} />
          </button>
        </div>

        <div className="max-h-[60vh] space-y-4 overflow-y-auto p-6">
          {error && <div className="rounded-md bg-rose-50 px-3 py-2 text-xs text-rose-600">{error}</div>}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-slate-500">Bank Name</label>
              <BankSelect
                code={form.bankCode}
                name={form.bankName}
                onChange={(bank) =>
                  setForm((f) =>
                    f.bankCode === bank.code && f.bankName === bank.name
                      ? f
                      : { ...f, bankCode: bank.code, bankName: bank.name },
                  )
                }
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-500">Account Paid Into</label>
              <input
                type="text"
                value={form.accountPaidInto}
                onChange={update("accountPaidInto")}
                placeholder="Account number"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-slate-500">Amount (₦)</label>
              <input
                type="number"
                min={0}
                value={form.amount}
                onChange={update("amount")}
                placeholder="0.00"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-500">Date of Payment</label>
              <input
                type="date"
                value={form.dateOfPayment}
                onChange={update("dateOfPayment")}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-500">Reference / Transaction ID</label>
            <input
              type="text"
              value={form.reference}
              onChange={update("reference")}
              placeholder="e.g. TRF-20260520-0091"
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-500">Note (optional)</label>
            <input
              type="text"
              value={form.note}
              onChange={update("note")}
              placeholder="Any extra context for this entry"
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-400"
            />
          </div>

          <p className="rounded-md bg-amber-50 px-3 py-2.5 text-xs text-amber-700">
            This immediately credits your wallet — only submit after you've confirmed the transfer was actually
            received. There is no separate review step.
          </p>
        </div>

        <div className="flex items-center gap-3 border-t border-slate-100 px-6 py-4">
          <button onClick={onBack} className="flex-1 rounded-md border border-slate-200 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || submitting}
            className="flex-1 rounded-md bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-300"
          >
            {submitting ? "Submitting..." : "Submit Entry"}
          </button>
        </div>
      </div>
    </div>
  );
}