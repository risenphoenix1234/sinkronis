"use client";

import { useEffect, useState } from "react";
import { ExpenseItem, UpdateExpensePayload, ExpenseCategory } from "@/lib/api/types/accounting.types";
import { getExpenseCategories } from "@/lib/api/accounting";

type Props = {
  open: boolean;
  onClose: () => void;
  expense: ExpenseItem | null;
  onSave: (id: string, payload: UpdateExpensePayload) => Promise<void>;
};

export default function EditExpenseModal({ open, onClose, expense, onSave }: Props) {
  const [form, setForm] = useState({
    expenseDate: "",
    category: "",
    description: "",
    amount: "",
    receiptReference: "",
  });
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    getExpenseCategories()
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, [open]);

  useEffect(() => {
    if (expense) {
      setForm({
        expenseDate: expense.expenseDate.slice(0, 10),
        category: expense.category,
        description: expense.description,
        amount: String(expense.amount),
        receiptReference: expense.receiptReference ?? "",
      });
      setError(null);
    }
  }, [expense]);

  if (!open || !expense) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    try {
      await onSave(expense.id, {
        expenseDate: form.expenseDate,
        category: form.category,
        description: form.description,
        amount: form.amount,
        receiptReference: form.receiptReference.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update expense.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Edit Expense</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
        </div>
        <p className="mb-5 text-sm text-slate-500">Update expense details.</p>

        {error && (
          <div className="mb-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-slate-600">Date</label>
              <input name="expenseDate" type="date" value={form.expenseDate} onChange={handleChange}
                className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-600">Category</label>
              <select name="category" value={form.category} onChange={handleChange}
                className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400 bg-white">
                <option value="">Select</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
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
              <input name="amount" value={form.amount} onChange={handleChange}
                className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-600">Reference / Receipt No.</label>
              <input name="receiptReference" value={form.receiptReference} onChange={handleChange}
                className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400" />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose}
            className="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={saving}
            className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}