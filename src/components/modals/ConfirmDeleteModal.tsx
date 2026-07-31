// components/modals/ConfirmDeleteModal.tsx
"use client";

import { FiX, FiAlertTriangle } from "react-icons/fi";

type ConfirmDeleteModalProps = {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmDeleteModal({
  open,
  title,
  description,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white shadow-xl">
        <div className="flex items-start justify-between px-6 py-5">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-rose-500">
              <FiAlertTriangle size={16} />
            </span>
            <div>
              <h2 className="text-base font-semibold text-slate-900">{title}</h2>
              <p className="mt-0.5 text-sm text-slate-500">{description}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <FiX size={18} />
          </button>
        </div>
        <div className="flex items-center gap-3 border-t border-slate-100 px-6 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-md border border-slate-200 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-md bg-rose-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}