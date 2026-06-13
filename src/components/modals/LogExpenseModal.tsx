"use client";

import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function LogExpenseModal({ open, onClose }: Props) {
  const [form, setForm] = useState({
    date: "",
    category: "",
    description: "",
    amount: "",
    reference: "",
    loggedBy: "",
  });

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Log Expense</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
        </div>
        <p className="mb-5 text-sm text-slate-500">Record a new business expense.</p>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-slate-600">Date</label>
              <input name="date" type="date" value={form.date} onChange={handleChange}
                className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-600">Category</label>
              <select name="category" value={form.category} onChange={handleChange}
                className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400 bg-white">
                <option value="">Select</option>
                <option>Software & Subscriptions</option>
                <option>Travel & Transport</option>
                <option>Office Supplies</option>
                <option>Marketing & Advertising</option>
                <option>Agent Commissions</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-600">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={2}
              className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400 resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-slate-600">Amount (₦)</label>
              <input name="amount" type="number" value={form.amount} onChange={handleChange}
                className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-600">Reference / Receipt No.</label>
              <input name="reference" value={form.reference} onChange={handleChange}
                className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-600">Logged By</label>
            <input name="loggedBy" value={form.loggedBy} onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400" />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose}
            className="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
            Cancel
          </button>
          <button onClick={onClose}
            className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700">
            Log Expense
          </button>
        </div>
      </div>
    </div>
  );
}