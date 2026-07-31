// components/modals/FundWalletModal.tsx
"use client";

import { FiX, FiCreditCard, FiFileText } from "react-icons/fi";

type FundingMethod = "gateway" | "manual";

type FundWalletModalProps = {
  open: boolean;
  onClose: () => void;
  onSelectMethod: (method: FundingMethod) => void;
};

export default function FundWalletModal({ open, onClose, onSelectMethod }: FundWalletModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Fund Wallet</h2>
            <p className="mt-0.5 text-sm text-slate-400">Choose a funding method</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <FiX size={18} />
          </button>
        </div>

        {/* Method options */}
        <div className="grid grid-cols-2 gap-3 p-6">
          <button
            onClick={() => onSelectMethod("gateway")}
            className="flex flex-col items-center gap-2 rounded-lg border border-sky-200 bg-sky-50/50 px-4 py-6 text-center hover:border-sky-300 hover:bg-sky-50"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-sky-600">
              <FiCreditCard size={16} />
            </span>
            <span className="text-sm font-medium text-slate-800">Payment Gateway</span>
            <span className="text-xs text-slate-400">Paystack, Flutterwave or Bank Transfer</span>
          </button>

          <button
            onClick={() => onSelectMethod("manual")}
            className="flex flex-col items-center gap-2 rounded-lg border border-slate-200 px-4 py-6 text-center hover:border-slate-300 hover:bg-slate-50"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <FiFileText size={16} />
            </span>
            <span className="text-sm font-medium text-slate-800">Manual Entry</span>
            <span className="text-xs text-slate-400">Log a bank transfer with reference</span>
          </button>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-md border border-slate-200 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}