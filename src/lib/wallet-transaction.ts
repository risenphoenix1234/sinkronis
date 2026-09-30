// src/lib/payroll/wallet-transaction.ts

import type { Transaction } from "@/components/payroll/wallet/TransactionDetail";
import { LedgerEntry } from "@/types/payroll/wallet-data";
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
      { label: "Reference", value: entry.reference || "\u2014" },
      { label: "Balance After", value: naira(entry.balance) },
      { label: "Narration", value: entry.description || "\u2014" },
      { label: "Transaction Type", value: entry.txType },
      { label: "Direction", value: entry.direction },
    ],
  };
}

export function apiTxToTransactionDetail(tx: any): Transaction {
  if (!tx) return toTransactionDetail({} as LedgerEntry);
  return toTransactionDetail({
    id: tx.id || tx.reference || "",
    date: tx.date || tx.createdAt || new Date().toISOString().split("T")[0],
    description: tx.description || tx.narration || "",
    amount: typeof tx.amount === "number" ? tx.amount : parseFloat(tx.amount) || 0,
    direction: tx.direction || (tx.type === "credit" ? "Credit" : "Debit"),
    balance: typeof tx.balance === "number" ? tx.balance : parseFloat(tx.balance) || 0,
    txType: tx.txType || tx.type || "Disbursement",
    reference: tx.reference || tx.id || "",
  });
}

