// src/lib/wallet-transaction.ts

import type { Transaction } from "@/components/payroll/wallet/TransactionDetail";
import type { PayrollWalletTransaction } from "@/lib/api/types/payroll.types";
import { LedgerEntry, TxType } from "@/types/payroll/wallet-data";
import { naira } from "@/types/payroll/payee-data";
import { txTypeStyles } from "./wallet-styles";

/**
 * Maps a wallet ledger row to the props TransactionDetail needs.
 * Keeps the detail page decoupled from LedgerEntry's exact shape —
 * if wallet-data.ts changes, only this function needs updating.
 */
export function toTransactionDetail(entry: LedgerEntry): Transaction {
  const isCredit = entry.direction === "Credit";

  return {
    badge: entry.txType,
    badgeClassName: txTypeStyles[entry.txType],
    flowLabel: isCredit ? "Money In" : "Money Out",
    title: entry.txType,
    date: entry.date,
    amount: entry.amount,
    direction: isCredit ? "credit" : "debit",
    details: [
      { label: "Reference", value: entry.reference || "—" },
      { label: "Balance After", value: naira(entry.balance) },
      { label: "Narration", value: entry.description || "—" },
      { label: "Transaction Type", value: entry.txType },
      { label: "Direction", value: entry.direction },
    ],
  };
}

const apiTypeLabels: Record<string, string> = {
  FUNDING: "Wallet Funding",
  WALLET_FUNDING: "Wallet Funding",
  PAYROLL_DISBURSEMENT: "Payroll Disbursement",
  PAYE_REMITTANCE: "PAYE Remittance",
  PENSION_REMITTANCE: "Pension Remittance",
  NHF_REMITTANCE: "NHF Remittance",
  PAYEE_PAYMENT: "Payee Payment",
  REVERSAL: "Reversal",
};

const fallbackBadge = "bg-slate-100 text-slate-600";

/**
 * Maps a wallet transaction from the API to the props TransactionDetail needs.
 */
export function apiTxToTransactionDetail(tx: PayrollWalletTransaction): Transaction {
  const isCredit = tx.direction === "CREDIT";
  const label = apiTypeLabels[tx.transactionType] ?? tx.transactionType;

  const details = [
    { label: "Reference", value: tx.reference || "—" },
    { label: "Transfer Reference", value: tx.transferReference || "—" },
    { label: "Balance Before", value: typeof tx.balanceBefore === "number" ? naira(tx.balanceBefore) : "—" },
    { label: "Balance After", value: typeof tx.balanceAfter === "number" ? naira(tx.balanceAfter) : "—" },
    { label: "Narration", value: tx.description || "—" },
    { label: "Transaction Type", value: label },
    { label: "Direction", value: isCredit ? "Credit" : "Debit" },
  ];

  return {
    badge: label,
    badgeClassName: txTypeStyles[label as TxType] ?? fallbackBadge,
    flowLabel: isCredit ? "Money In" : "Money Out",
    title: label,
    date: tx.date,
    amount: tx.amount,
    direction: isCredit ? "credit" : "debit",
    details,
  };
}