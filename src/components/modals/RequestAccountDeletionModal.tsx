// components/modals/RequestAccountDeletionModal.tsx
"use client";

import { useState } from "react";
import { FiX, FiAlertTriangle } from "react-icons/fi";

type RequestAccountDeletionModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const CONFIRM_PHRASE = "DELETE";

export default function RequestAccountDeletionModal({
  open,
  onClose,
  onConfirm,
}: RequestAccountDeletionModalProps) {
  const [confirmText, setConfirmText] = useState("");

  if (!open) return null;

  const isValid = confirmText === CONFIRM_PHRASE;

  const handleClose = () => {
    setConfirmText("");
    onClose();
  };

  const handleConfirm = () => {
    if (!isValid) return;
    setConfirmText("");
    onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white shadow-xl">
        <div className="flex items-start justify-between px-6 py-5">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-rose-500">
              <FiAlertTriangle size={16} />
            </span>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Request Account Deletion</h2>
              <p className="mt-0.5 text-sm text-slate-500">
                This permanently deletes your organisation's data. This cannot be undone.
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="text-slate-400 hover:text-slate-600">
            <FiX size={18} />
          </button>
        </div>

        <div className="px-6 pb-2">
          <label className="mb-1 block text-xs text-slate-500">
            Type <span className="font-mono font-semibold text-slate-700">{CONFIRM_PHRASE}</span> to confirm
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={CONFIRM_PHRASE}
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-rose-400"
          />
        </div>

        <div className="flex items-center gap-3 px-6 py-5">
          <button
            onClick={handleClose}
            className="flex-1 rounded-md border border-slate-200 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isValid}
            className="flex-1 rounded-md bg-rose-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-300"
          >
            Request Deletion
          </button>
        </div>
      </div>
    </div>
  );
}