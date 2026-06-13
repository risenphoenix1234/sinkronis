// src/components/modals/DeleteClientModal.tsx
"use client";

interface DeleteClientModalProps {
  open: boolean;
  onClose: () => void;
  clientName?: string;
}

export default function DeleteClientModal({
  open,
  onClose,
  clientName = "Zenith Technologies Ltd",
}: DeleteClientModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg text-center text-sm">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-500">
          !
        </div>
        <h2 className="mb-1 text-base font-semibold">Delete Client?</h2>
        <p className="mb-4 text-xs text-slate-500">
          This will permanently remove{" "}
          <span className="font-semibold">{clientName}</span> and all related
          records from your clients list (static demo only).
        </p>

        <div className="flex justify-center gap-2 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-slate-200 px-4 py-1.5 text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded bg-rose-600 px-4 py-1.5 font-medium text-white hover:bg-rose-700"
          >
            Delete (static)
          </button>
        </div>
      </div>
    </div>
  );
}
