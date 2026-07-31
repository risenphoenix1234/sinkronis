// components/modals/CancelSubscriptionModal.tsx
"use client";

import { useState } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { currentPlan } from "@/lib/plan-data";

type CancelSubscriptionModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const CONFIRM_PHRASE = "CANCEL";

export default function CancelSubscriptionModal({
  open,
  onClose,
  onConfirm,
}: CancelSubscriptionModalProps) {
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
        <div className="flex flex-col items-center px-6 pt-6 text-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-500">
            <FiAlertTriangle size={18} />
          </span>
          <h2 className="mt-3 text-base font-semibold text-slate-900">Cancel Subscription</h2>
          <p className="mt-1.5 text-sm text-slate-500">
            All users will lose access at the end of your current billing period
            ({currentPlan.renewalDate}). Your data will be retained for 30 days. Type{" "}
            <span className="font-semibold text-slate-700">{CONFIRM_PHRASE}</span> to confirm.
          </p>
        </div>

        <div className="px-6 pt-4">
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={CONFIRM_PHRASE}
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-center text-sm text-slate-700 outline-none focus:border-rose-400"
          />
        </div>

        <div className="flex items-center gap-3 px-6 py-5">
          <button
            onClick={handleClose}
            className="flex-1 rounded-md border border-slate-200 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            Keep Plan
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isValid}
            className="flex-1 rounded-md bg-rose-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-300"
          >
            Cancel Subscription
          </button>
        </div>
      </div>
    </div>
  );
}