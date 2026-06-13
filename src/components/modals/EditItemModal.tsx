// src/components/modals/EditItemModal.tsx
"use client";

interface EditItemModalProps {
  open: boolean;
  onClose: () => void;
  itemName?: string;
}

export default function EditItemModal({
  open,
  onClose,
  itemName = "HR Software Licence",
}: EditItemModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg text-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Edit Item / Service</h2>
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
              defaultValue={itemName}
              className="w-full rounded border border-slate-200 px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-500">
              Type
            </label>
            <select
              defaultValue="Service"
              className="w-full rounded border border-slate-200 px-3 py-2 text-xs bg-white"
            >
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
                defaultValue="80,000"
                className="w-full rounded border border-slate-200 px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-500">
                VAT (%)
              </label>
              <input
                defaultValue="7.5"
                className="w-full rounded border border-slate-200 px-3 py-2 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-500">
              Description
            </label>
            <textarea
              defaultValue="Monthly HRIS software licence fee"
              rows={2}
              className="w-full rounded border border-slate-200 px-3 py-2 text-xs"
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
              Save Changes (static)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
