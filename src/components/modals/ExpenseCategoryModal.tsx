// components/modals/ExpenseCategoryModal.tsx
"use client";

import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { ExpenseCategory } from "@/lib/settings-data";

type ExpenseCategoryModalProps = {
  open: boolean;
  mode: "edit" | "create";
  category: ExpenseCategory | null;
  onClose: () => void;
  onSave: (data: Omit<ExpenseCategory, "id">, id?: string) => void;
};

const emptyForm = { name: "", description: "" };

export default function ExpenseCategoryModal({
  open,
  mode,
  category,
  onClose,
  onSave,
}: ExpenseCategoryModalProps) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (mode === "edit" && category) {
      setForm({ name: category.name, description: category.description });
    } else {
      setForm(emptyForm);
    }
  }, [mode, category, open]);

  if (!open) return null;

  const isValid = form.name.trim().length > 0;
  const title = mode === "edit" ? "Edit Category" : "New Expense Category";
  const submitLabel = mode === "edit" ? "Save Changes" : "Create Category";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-base font-semibold text-slate-900">{title}</h2>
            <p className="mt-0.5 text-sm text-slate-400">Used when logging or filtering expenses</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <FiX size={18} />
          </button>
        </div>

        <div className="space-y-4 p-6">
          <div>
            <label className="mb-1 block text-xs text-slate-500">Category Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Utilities"
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              placeholder="What kind of expenses fall under this category"
              className="w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-slate-100 px-6 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-md border border-slate-200 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => isValid && onSave(form, category?.id)}
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