"use client";

import { useState } from "react";
import { FiX, FiArrowLeft, FiCreditCard, FiHome } from "react-icons/fi";

type Provider = "paystack" | "flutterwave" | "bank_transfer";

const providers: { id: Provider; label: string; icon: React.ReactNode; available: boolean }[] = [
  { id: "paystack", label: "Paystack", icon: <FiCreditCard size={14} />, available: true },
  { id: "flutterwave", label: "Flutterwave", icon: <FiCreditCard size={14} />, available: false },
  { id: "bank_transfer", label: "Bank Transfer", icon: <FiHome size={14} />, available: false },
];

type PayViaGatewayModalProps = {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
  onProceed: (amount: string) => Promise<void>;
};

export default function PayViaGatewayModal({ open, onClose, onBack, onProceed }: PayViaGatewayModalProps) {
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const isValid = Number(amount) > 0;

  const handleProceed = async () => {
    if (!isValid) return;
    setSubmitting(true);
    setError(null);
    try {
      await onProceed(amount);
      setAmount("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to start payment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-start gap-3">
            <button onClick={onBack} className="mt-0.5 text-slate-400 hover:text-slate-600">
              <FiArrowLeft size={16} />
            </button>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Pay via Gateway</h2>
              <p className="mt-0.5 text-sm text-slate-400">Enter amount to fund via Paystack</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <FiX size={18} />
          </button>
        </div>

        <div className="space-y-4 p-6">
          <div className="grid grid-cols-3 gap-2">
            {providers.map((p) => (
              <button
                key={p.id}
                disabled={!p.available}
                className={`flex flex-col items-center gap-1.5 rounded-md border px-2 py-3 text-xs font-medium ${
                  p.available
                    ? "border-sky-400 bg-sky-50 text-sky-700"
                    : "border-slate-100 text-slate-300 cursor-not-allowed"
                }`}
              >
                {p.icon}
                {p.label}
                {!p.available && <span className="text-[10px] text-slate-300">Coming soon</span>}
              </button>
            ))}
          </div>

          {error && <div className="rounded-md bg-rose-50 px-3 py-2 text-xs text-rose-600">{error}</div>}

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

          <p className="rounded-md bg-amber-50 px-3 py-2.5 text-xs text-amber-700">
            You will be redirected to <span className="font-medium">Paystack</span> in a new tab to complete this
            payment securely. Your wallet will update automatically once payment is confirmed.
          </p>
        </div>

        <div className="flex items-center gap-3 border-t border-slate-100 px-6 py-4">
          <button onClick={onBack} className="flex-1 rounded-md border border-slate-200 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
            Back
          </button>
          <button
            onClick={handleProceed}
            disabled={!isValid || submitting}
            className="flex-1 rounded-md bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-300"
          >
            {submitting ? "Starting..." : "Proceed to Paystack"}
          </button>
        </div>
      </div>
    </div>
  );
}