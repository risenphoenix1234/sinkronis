"use client";

import { useEffect, useState } from "react";
import { FiUploadCloud, FiFileText } from "react-icons/fi";
import FundWalletModal from "@/components/modals/FundWalletModal";
import PayViaGatewayModal from "@/components/modals/PayViaGatewayModal";
import ManualEntryModal, { ManualEntryData } from "@/components/modals/ManualEntryModal";
import WalletReceiptModal from "@/components/modals/WalletReceiptModal";
import {
  getWalletSummary,
  getWalletTransactions,
  createWalletAccount,
  fundWalletManually,
  initializePaystackFunding,
  verifyPaystackFunding,
  getWalletReceipt,
} from "@/lib/api/accounting";
import { WalletSummary, WalletTransactionItem } from "@/lib/api/types/accounting.types";
import Link from "next/link";


type ModalStep = "closed" | "method" | "gateway" | "manual";
type TxnFilter = "all" | "inflow" | "outflow";

function naira(value: number) {
  return `₦${value.toLocaleString()}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

const emptySummary: WalletSummary = { availableBalance: 0, totalInflow: 0, totalOutflow: 0, transactionCount: 0, wallets: [] };

export default function WalletPage() {
  const [step, setStep] = useState<ModalStep>("closed");
  const [filter, setFilter] = useState<TxnFilter>("all");

  const [summary, setSummary] = useState<WalletSummary>(emptySummary);
  const [transactions, setTransactions] = useState<WalletTransactionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [receiptOpen, setReceiptOpen] = useState(false);
  const [receiptTxn, setReceiptTxn] = useState<WalletTransactionItem | null>(null);
  const [receiptLoading, setReceiptLoading] = useState(false);

  const [paystackWaiting, setPaystackWaiting] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryRes, txnRes] = await Promise.all([getWalletSummary(), getWalletTransactions()]);
      setSummary(summaryRes.data);
      setTransactions(txnRes.data.transactions);
    } catch (err) {
      setError("Failed to load wallet data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const filteredTxns = transactions.filter((t) => {
    if (filter === "inflow") return t.direction === "CREDIT";
    if (filter === "outflow") return t.direction === "DEBIT";
    return true;
  });

  // Wallet may not exist yet on first use — create one lazily rather than
  // forcing a separate setup step in the UI.
  const ensureWalletAccountId = async (): Promise<string> => {
    if (summary.wallets.length > 0) return summary.wallets[0].id;
    const res = await createWalletAccount({ name: "Main Wallet" });
    await fetchAll();
    return res.data.id;
  };

  const handleGatewayProceed = async (amount: string) => {
    const walletAccountId = await ensureWalletAccountId();
    const res = await initializePaystackFunding({ walletAccountId, amount });
    const { authorizationUrl, reference } = res.data;

    window.open(authorizationUrl, "_blank", "noopener,noreferrer");
    setStep("closed");
    setPaystackWaiting(true);

    // No callback route wired up in this app yet, so we poll verify from
    // here instead of relying on a redirect back into the app.
    const maxAttempts = 30; // ~2.5 minutes at 5s intervals
    let attempts = 0;
    const poll = setInterval(async () => {
      attempts++;
      try {
        const verifyRes = await verifyPaystackFunding(reference);
        if (verifyRes.data.status === "COMPLETED") {
          clearInterval(poll);
          setPaystackWaiting(false);
          await fetchAll();
        } else if (attempts >= maxAttempts) {
          clearInterval(poll);
          setPaystackWaiting(false);
        }
      } catch {
        if (attempts >= maxAttempts) {
          clearInterval(poll);
          setPaystackWaiting(false);
        }
      }
    }, 5000);
  };

  const handleManualSubmit = async (data: ManualEntryData) => {
    const walletAccountId = await ensureWalletAccountId();
    const descriptionParts = [data.bankName, data.accountPaidInto, data.note].filter(Boolean);
    await fundWalletManually({
      walletAccountId,
      amount: data.amount,
      externalReference: data.reference,
      description: descriptionParts.length > 0 ? descriptionParts.join(" — ") : undefined,
    });
    setStep("closed");
    await fetchAll();
  };

  const handleViewReceipt = async (txn: WalletTransactionItem) => {
    setReceiptLoading(true);
    setReceiptOpen(true);
    try {
      const res = await getWalletReceipt(txn.id);
      setReceiptTxn(res.data);
    } catch {
      setReceiptTxn(txn); // fall back to what we already have if the receipt call fails
    } finally {
      setReceiptLoading(false);
    }
  };

  const primaryWallet = summary.wallets[0];

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
         <Link
  href="/accounting/payment-requests"
  className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 whitespace-nowrap"
>
  <FiUploadCloud size={14} /> Disburse Payment
</Link>
          <button
            onClick={() => setStep("method")}
            className="rounded-md bg-sky-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-700 whitespace-nowrap"
          >
            + Fund Wallet
          </button>
        </div>
      </div>

      {paystackWaiting && (
        <div className="rounded-md bg-sky-50 px-4 py-3 text-sm text-sky-700">
          Waiting for payment confirmation from Paystack — this page will update automatically once it's confirmed.
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
          <p className="text-sm text-slate-500">Available Balance</p>
          <p className="mt-1 text-2xl font-semibold text-sky-600">{naira(summary.availableBalance)}</p>
          <p className="mt-1 text-xs text-slate-400">{summary.transactionCount} total transactions</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-500">↙</span>
            <p className="text-sm text-slate-500">Total Inflow</p>
          </div>
          <p className="mt-1 text-2xl font-semibold text-emerald-600">{naira(summary.totalInflow)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
          <div className="flex items-center gap-1.5">
            <span className="text-rose-500">↗</span>
            <p className="text-sm text-slate-500">Total Outflow</p>
          </div>
          <p className="mt-1 text-2xl font-semibold text-rose-600">{naira(summary.totalOutflow)}</p>
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
              filter === tab.id ? "border-b-2 border-sky-600 text-sky-600" : "text-slate-500 hover:text-slate-700"
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
            {loading && <tr><td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-400">Loading transactions...</td></tr>}
            {!loading && error && <tr><td colSpan={5} className="px-6 py-8 text-center text-sm text-red-500">{error}</td></tr>}
            {!loading && !error && filteredTxns.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50">
                <td className="px-6 py-3 text-sm font-medium text-sky-600 whitespace-nowrap">{t.reference}</td>
                <td className="px-6 py-3 text-sm text-slate-600 whitespace-nowrap">{t.description ?? t.type}</td>
                <td className="px-6 py-3 text-sm text-slate-500 whitespace-nowrap">{formatDate(t.createdAt)}</td>
                <td className={`px-6 py-3 text-sm tabular-nums font-medium whitespace-nowrap ${t.direction === "CREDIT" ? "text-emerald-600" : "text-rose-600"}`}>
                  {t.direction === "CREDIT" ? "+" : "-"}{naira(t.amount)}
                </td>
                <td className="px-6 py-3 text-right whitespace-nowrap">
                  <button onClick={() => handleViewReceipt(t)} className="inline-flex items-center gap-1.5 text-sm text-sky-600 hover:underline">
                    <FiFileText size={13} /> Receipt
                  </button>
                </td>
              </tr>
            ))}
            {!loading && !error && filteredTxns.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-400">No transactions yet.</td></tr>
            )}
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
      <WalletReceiptModal
        open={receiptOpen}
        onClose={() => { setReceiptOpen(false); setReceiptTxn(null); }}
        transaction={receiptLoading ? null : receiptTxn}
        walletName={primaryWallet?.name}
        walletCurrency={primaryWallet?.currency}
      />
    </section>
  );
}