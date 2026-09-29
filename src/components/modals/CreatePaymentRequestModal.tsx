"use client";

import { useState } from "react";

interface CreatePaymentRequestModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (input: { title: string; description?: string; amount: string }) => void;
}

export default function CreatePaymentRequestModal({ open, onClose, onCreate }: CreatePaymentRequestModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setAmount("");
  };

  const handleSubmit = async () => {
    if (!title.trim() || !amount.trim()) return;
    setSaving(true);
    try {
      await onCreate({ title: title.trim(), description: description.trim() || undefined, amount: amount.trim() });
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">New Payment Request</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-slate-600">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
              placeholder="e.g. Vendor settlement"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-600">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400 resize-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-600">Amount (₦)</label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
              placeholder="100.00"
            />
          </div>

          <p className="text-xs text-slate-400">
            Payout bank details are pulled automatically from your linked employee profile.
          </p>
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
            disabled={saving || !title.trim() || !amount.trim()}
            className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60"
          >
            {saving ? "Creating..." : "Create Request"}
          </button>
        </div>
      </div>
    </div>
  );
}