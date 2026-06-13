// src/components/modals/AddClientModal.tsx
"use client";

interface AddClientModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddClientModal({ open, onClose }: AddClientModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg text-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Add Client</h2>
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
              className="w-full rounded border border-slate-200 px-3 py-2 text-xs"
              placeholder="e.g. Zenith Technologies Ltd"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-500">
              Tax ID (TIN)
            </label>
            <input
              className="w-full rounded border border-slate-200 px-3 py-2 text-xs"
              placeholder="TIN-1234567890"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-500">
              Contact Person
            </label>
            <input
              className="w-full rounded border border-slate-200 px-3 py-2 text-xs"
              placeholder="Mr. Chidi Obi"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-500">
              Email Address
            </label>
            <input
              className="w-full rounded border border-slate-200 px-3 py-2 text-xs"
              placeholder="finance@company.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-500">
              Phone Number
            </label>
            <input
              className="w-full rounded border border-slate-200 px-3 py-2 text-xs"
              placeholder="+234 800 000 0000"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-500">Address</label>
            <textarea
              className="w-full rounded border border-slate-200 px-3 py-2 text-xs"
              rows={2}
              placeholder="Street, City, State"
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
              Save Client (static)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
