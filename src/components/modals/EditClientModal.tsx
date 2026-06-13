// src/components/modals/EditClientModal.tsx
"use client";

interface EditClientModalProps {
  open: boolean;
  onClose: () => void;
  // optional: pass prefilled name for display
  clientName?: string;
}

export default function EditClientModal({
  open,
  onClose,
  clientName = "Zenith Technologies Ltd",
}: EditClientModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg text-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Edit Client</h2>
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
              Company Name
            </label>
            <input
              defaultValue={clientName}
              className="w-full rounded border border-slate-200 px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-500">
              Tax ID (TIN)
            </label>
            <input
              defaultValue="TIN-2034567890"
              className="w-full rounded border border-slate-200 px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-500">
              Contact Person
            </label>
            <input
              defaultValue="Mr. Chidi Obi"
              className="w-full rounded border border-slate-200 px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-500">
              Email Address
            </label>
            <input
              defaultValue="finance@zenithtech.ng"
              className="w-full rounded border border-slate-200 px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-500">
              Phone Number
            </label>
            <input
              defaultValue="+234 800 123 4567"
              className="w-full rounded border border-slate-200 px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-500">Address</label>
            <textarea
              defaultValue="Victoria Island, Lagos"
              className="w-full rounded border border-slate-200 px-3 py-2 text-xs"
              rows={2}
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
