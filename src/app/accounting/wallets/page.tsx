// app/wallet/page.tsx
"use client";

import { useState } from "react";
import { FiUploadCloud, FiFileText } from "react-icons/fi";
import { walletTransactions, naira, getWalletSummary } from "@/lib/wallet-data";
import FundWalletModal from "@/components/modals/FundWalletModal";
import PayViaGatewayModal from "@/components/modals/PayViaGatewayModal";
import ManualEntryModal, { ManualEntryData } from "@/components/modals/ManualEntryModal";

type ModalStep = "closed" | "method" | "gateway" | "manual";
type TxnFilter = "all" | "inflow" | "outflow";

export default function WalletPage() {
  const [step, setStep] = useState<ModalStep>("closed");
  const [filter, setFilter] = useState<TxnFilter>("all");

  const { availableBalance, totalInflow, totalOutflow, count } = getWalletSummary();

  const filteredTxns = walletTransactions.filter((t) => {
    if (filter === "inflow") return t.amount > 0;
    if (filter === "outflow") return t.amount < 0;
    return true;
  });

  const handleGatewayProceed = (provider: string, amount: string) => {
    // Hook up to actual gateway redirect (Paystack/Flutterwave) or bank transfer instructions here.
    console.log("Proceeding to gateway:", provider, amount);
    setStep("closed");
  };

  const handleManualSubmit = (data: ManualEntryData) => {
    // Hook up to API call to log the pending manual entry here.
    console.log("Manual entry submitted:", data);
    setStep("closed");
  };

  return (
    <section className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Wallet</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage funds, disbursements, and transaction history
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 whitespace-nowrap">
            <FiUploadCloud size={14} /> Disburse Payment
          </button>
          <button
            onClick={() => setStep("method")}
            className="rounded-md bg-sky-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-700 whitespace-nowrap"
          >
            + Fund Wallet
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
          <p className="text-sm text-slate-500">Available Balance</p>
          <p className="mt-1 text-2xl font-semibold text-sky-600">{naira(availableBalance)}</p>
          <p className="mt-1 text-xs text-slate-400">{count} total transactions</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-500">↙</span>
            <p className="text-sm text-slate-500">Total Inflow</p>
          </div>
          <p className="mt-1 text-2xl font-semibold text-emerald-600">{naira(totalInflow)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
          <div className="flex items-center gap-1.5">
            <span className="text-rose-500">↗</span>
            <p className="text-sm text-slate-500">Total Outflow</p>
          </div>
          <p className="mt-1 text-2xl font-semibold text-rose-600">{naira(totalOutflow)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200">
        {([
          { id: "all", label: "All Transactions" },
          { id: "inflow", label: "Inflow" },
          { id: "outflow", label: "Outflow" },
        ] as const).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium ${
              filter === tab.id
                ? "border-b-2 border-sky-600 text-sky-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Transactions table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-3 font-medium">Ref ID</th>
              <th className="px-6 py-3 font-medium">Description</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Amount</th>
              <th className="px-6 py-3 font-medium text-right">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTxns.map((t) => (
              <tr key={t.refId} className="hover:bg-slate-50">
                <td className="px-6 py-3 text-sm font-medium text-sky-600 whitespace-nowrap">
                  {t.refId}
                </td>
                <td className="px-6 py-3 text-sm text-slate-600 whitespace-nowrap">
                  {t.description}
                </td>
                <td className="px-6 py-3 text-sm text-slate-500 whitespace-nowrap">{t.date}</td>
                <td
                  className={`px-6 py-3 text-sm tabular-nums font-medium whitespace-nowrap ${
                    t.amount > 0 ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {t.amount > 0 ? "+" : "-"}
                  {naira(t.amount)}
                </td>
                <td className="px-6 py-3 text-right whitespace-nowrap">
                  {t.hasReceipt ? (
                    <button className="inline-flex items-center gap-1.5 text-sm text-sky-600 hover:underline">
                      <FiFileText size={13} /> Receipt
                    </button>
                  ) : (
                    <span className="text-sm text-slate-300">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal flow */}
      <FundWalletModal
        open={step === "method"}
        onClose={() => setStep("closed")}
        onSelectMethod={(method) => setStep(method === "gateway" ? "gateway" : "manual")}
      />
      <PayViaGatewayModal
        open={step === "gateway"}
        onClose={() => setStep("closed")}
        onBack={() => setStep("method")}
        onProceed={handleGatewayProceed}
      />
      <ManualEntryModal
        open={step === "manual"}
        onClose={() => setStep("closed")}
        onBack={() => setStep("method")}
        onSubmit={handleManualSubmit}
      />
    </section>
  );
}