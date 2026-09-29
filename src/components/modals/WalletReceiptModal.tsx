"use client";

import { FiX } from "react-icons/fi";
import { WalletTransactionItem } from "@/lib/api/types/accounting.types";

function naira(value: number, currency: string) {
  return `${currency === "NGN" ? "₦" : currency + " "}${value.toLocaleString()}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

type Props = {
  open: boolean;
  onClose: () => void;
  transaction: WalletTransactionItem | null;
  walletName?: string;
  walletCurrency?: string;
};

export default function WalletReceiptModal({ open, onClose, transaction, walletName, walletCurrency = "NGN" }: Props) {
  if (!open || !transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">Transaction Receipt</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <FiX size={18} />
          </button>
        </div>
        <div className="space-y-3 px-6 py-5">
          <div className="flex justify-between text-sm"><span className="text-slate-500">Reference</span><span className="font-medium text-sky-600">{transaction.reference}</span></div>
          <div className="flex justify-between text-sm"><span className="text-slate-500">Wallet</span><span className="text-slate-800">{walletName ?? "—"}</span></div>
          <div className="flex justify-between text-sm"><span className="text-slate-500">Type</span><span className="text-slate-800">{transaction.type}</span></div>
          <div className="flex justify-between text-sm"><span className="text-slate-500">Direction</span><span className={transaction.direction === "CREDIT" ? "text-emerald-600" : "text-rose-600"}>{transaction.direction}</span></div>
          <div className="flex justify-between text-sm"><span className="text-slate-500">Amount</span><span className="font-medium tabular-nums text-slate-800">{naira(transaction.amount, walletCurrency)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-slate-500">Balance After</span><span className="tabular-nums text-slate-600">{naira(transaction.balanceAfter, walletCurrency)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-slate-500">Description</span><span className="text-slate-600 text-right max-w-[60%]">{transaction.description ?? "—"}</span></div>
          <div className="flex justify-between text-sm"><span className="text-slate-500">Date</span><span className="text-slate-600">{formatDate(transaction.createdAt)}</span></div>
        </div>
        <div className="border-t border-slate-100 px-6 py-4">
          <button onClick={onClose} className="w-full rounded-md border border-slate-200 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}