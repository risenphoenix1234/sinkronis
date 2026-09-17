// components/modals/AddPlanConfirmModal.tsx
"use client";

import { FiX } from "react-icons/fi";

interface AddPlanConfirmModalProps {
  open: boolean;
  currentPlanLabel: string;
  newPlanLabel: string;
  billingImpact?: number;
  proratedCharges?: number;
  effectiveDate?: string;
  currency?: string;
  confirming?: boolean;
  error?: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

function formatMoney(amount: number, currency: string) {
  const symbol = currency === "NGN" ? "₦" : `${currency} `;
  return `${symbol}${amount.toLocaleString()}`;
}

export default function AddPlanConfirmModal({
  open,
  currentPlanLabel,
  newPlanLabel,
  billingImpact,
  proratedCharges,
  effectiveDate,
  currency = "NGN",
  confirming = false,
  error,
  onCancel,
  onConfirm,
}: AddPlanConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Change Plan</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Review your plan change before confirming.
            </p>
          </div>
          <button
            onClick={onCancel}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <FiX size={16} />
          </button>
        </div>

        <div className="mt-5 space-y-3 rounded-md bg-slate-50 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Current plan</span>
            <span className="font-medium text-slate-800">{currentPlanLabel}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">New plan</span>
            <span className="font-medium text-sky-600">{newPlanLabel}</span>
          </div>
          {typeof billingImpact === "number" && (
            <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-sm">
              <span className="text-slate-500">Monthly cost change</span>
              <span
                className={`font-medium ${billingImpact >= 0 ? "text-emerald-600" : "text-rose-600"}`}
              >
                {billingImpact >= 0 ? "+" : ""}
                {formatMoney(billingImpact, currency)}
              </span>
            </div>
          )}
          {typeof proratedCharges === "number" && proratedCharges > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Prorated charge today</span>
              <span className="font-medium text-slate-800">
                {formatMoney(proratedCharges, currency)}
              </span>
            </div>
          )}
          {effectiveDate && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Effective</span>
              <span className="font-medium text-slate-800">
                {new Date(effectiveDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">{error}</div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            disabled={confirming}
            className="flex-1 rounded-md border border-slate-200 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={confirming}
            className="flex-1 rounded-md bg-sky-600 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60"
          >
            {confirming ? "Confirming..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}