"use client";

import { useState } from "react";

interface DeleteItemModalProps {
  open: boolean;
  itemName?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteItemModal({ open, itemName, onClose, onConfirm }: DeleteItemModalProps) {
  const [deleting, setDeleting] = useState(false);

  if (!open) return null;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onConfirm();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg text-center text-sm">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-500">
          !
        </div>
        <h2 className="mb-1 text-base font-semibold">Delete Item?</h2>
        <p className="mb-4 text-xs text-slate-500">
          This will remove <span className="font-semibold">{itemName}</span> from your Items &amp; Services list.
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
            onClick={handleDelete}
            disabled={deleting}
            className="rounded bg-rose-600 px-4 py-1.5 font-medium text-white hover:bg-rose-700 disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}