// src/components/modals/AddItemModal.tsx
"use client";

interface AddItemModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddItemModal({ open, onClose }: AddItemModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg text-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Add Item / Service</h2>
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <form className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-slate-500">
              Name
            </label>
            <input
              className="w-full rounded border border-slate-200 px-3 py-2 text-xs"
              placeholder="e.g. HR Software Licence"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-500">
              Type
            </label>
            <select className="w-full rounded border border-slate-200 px-3 py-2 text-xs bg-white">
              <option>Service</option>
              <option>Product</option>
            </select>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-slate-500">
                Unit Price (₦)
              </label>
              <input
                className="w-full rounded border border-slate-200 px-3 py-2 text-xs"
                placeholder="80,000"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-500">
                VAT (%)
              </label>
              <input
                className="w-full rounded border border-slate-200 px-3 py-2 text-xs"
                placeholder="7.5"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-500">
              Description
            </label>
            <textarea
              rows={2}
              className="w-full rounded border border-slate-200 px-3 py-2 text-xs"
              placeholder="Short description of the item or service"
            />
          </div>

          <div className="mt-4 flex justify-end gap-2 pt-2 text-xs">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-slate-200 px-4 py-1.5 text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded bg-sky-600 px-4 py-1.5 font-medium text-white hover:bg-sky-700"
            >
              Save Item (static)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
