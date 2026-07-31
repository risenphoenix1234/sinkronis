// components/modals/PayViaGatewayModal.tsx
"use client";

import { useState } from "react";
import { FiX, FiArrowLeft, FiCreditCard, FiHome } from "react-icons/fi";

type Provider = "paystack" | "flutterwave" | "bank_transfer";

const providers: { id: Provider; label: string; icon: React.ReactNode }[] = [
  { id: "paystack", label: "Paystack", icon: <FiCreditCard size={14} /> },
  { id: "flutterwave", label: "Flutterwave", icon: <FiCreditCard size={14} /> },
  { id: "bank_transfer", label: "Bank Transfer", icon: <FiHome size={14} /> },
];

const providerDisplayName: Record<Provider, string> = {
  paystack: "Paystack",
  flutterwave: "Flutterwave",
  bank_transfer: "your bank",
};

type PayViaGatewayModalProps = {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
  onProceed: (provider: Provider, amount: string) => void;
};

export default function PayViaGatewayModal({ open, onClose, onBack, onProceed }: PayViaGatewayModalProps) {
  const [provider, setProvider] = useState<Provider>("paystack");
  const [amount, setAmount] = useState("");

  if (!open) return null;

  const isValid = Number(amount) > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-start gap-3">
            <button onClick={onBack} className="mt-0.5 text-slate-400 hover:text-slate-600">
              <FiArrowLeft size={16} />
            </button>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Pay via Gateway</h2>
              <p className="mt-0.5 text-sm text-slate-400">Select provider and enter amount</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <FiX size={18} />
          </button>
        </div>

        <div className="space-y-4 p-6">
          {/* Provider tabs */}
          <div className="grid grid-cols-3 gap-2">
            {providers.map((p) => (
              <button
                key={p.id}
                onClick={() => setProvider(p.id)}
                className={`flex flex-col items-center gap-1.5 rounded-md border px-2 py-3 text-xs font-medium ${
                  provider === p.id
                    ? "border-sky-400 bg-sky-50 text-sky-700"
                    : "border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                {p.icon}
                {p.label}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div>
            <label className="mb-1 block text-xs text-slate-500">Amount (₦)</label>
            <input
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-400"
            />
          </div>

          {/* Redirect notice */}
          <p className="rounded-md bg-amber-50 px-3 py-2.5 text-xs text-amber-700">
            You will be redirected to <span className="font-medium">{providerDisplayName[provider]}</span> to
            complete this payment securely.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 border-t border-slate-100 px-6 py-4">
          <button
            onClick={onBack}
            className="flex-1 rounded-md border border-slate-200 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            Back
          </button>
          <button
            onClick={() => isValid && onProceed(provider, amount)}
            disabled={!isValid}
            className="flex-1 rounded-md bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-300"
          >
            Proceed to {providerDisplayName[provider]}
          </button>
        </div>
      </div>
    </div>
  );
}