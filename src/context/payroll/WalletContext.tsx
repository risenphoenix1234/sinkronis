"use client";

import { createContext, useContext, useState, ReactNode } from "react";

import {
  formatWalletDate,
  Obligation,
  WalletTransaction,
} from "@/types/payroll/wallet-data";

import {
  pendingObligations as initialObligations,
  walletTransactions as initialTransactions,
} from "@/data/payroll/wallet-data";

type WalletContextType = {
  transactions: WalletTransaction[];
  obligations: Obligation[];
  fundWallet: (transaction: WalletTransaction) => void;
  payObligation: (obligation: Obligation) => void;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] =
    useState<WalletTransaction[]>(initialTransactions);

  const [obligations, setObligations] =
    useState<Obligation[]>(initialObligations);

  const fundWallet = (transaction: WalletTransaction) => {
    setTransactions((prev) => [transaction, ...prev]);
  };

  /* Settling an obligation moves it out of the pending list and into the ledger. */
  const payObligation = (obligation: Obligation) => {
    setTransactions((prev) => [
      {
        id: crypto.randomUUID(),
        date: formatWalletDate(new Date()),
        description: obligation.description,
        txType: obligation.txType,
        reference: obligation.reference,
        direction: "Debit",
        amount: obligation.amount,
      },
      ...prev,
    ]);

    setObligations((prev) =>
      prev.filter((item) => item.id !== obligation.id),
    );
  };

  return (
    <WalletContext.Provider
      value={{ transactions, obligations, fundWallet, payObligation }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error("useWallet must be used inside WalletProvider");
  }

  return context;
}
