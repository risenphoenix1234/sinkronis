// src/app/payroll/wallets/[id]/page.tsx

"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";

import TransactionDetail from "@/components/payroll/wallet/TransactionDetail";
import { walletLedger } from "@/types/payroll/wallet-data";
import { useWallet } from "@/context/payroll/WalletContext";
import { toTransactionDetail } from "@/lib/wallet-transaction";

export default function WalletTransactionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { transactions } = useWallet();

  const ledger = useMemo(() => walletLedger(transactions), [transactions]);
  const entry = ledger.find((item) => item.id === id);

  if (!entry) {
    return (
      <main className="flex min-h-screen flex-col items-enter justify-center gap-3 bg-[#f8fafc] px-4 text-center">
        <p className="text-[15px] font-semibold text-[#344054]">
          Transaction not found
        </p>
        <p className="text-[14px] text-[#8994a3]">
          It may have been reversed, or the link is out of date.
        </p>
        <button
          type="button"
          onClick={() => router.push("/payroll/wallets")}
          className="mt-2 h-9 rounded-md bg-[#1683d8] px-4 text-[13px] font-semibold text-white transition hover:bg-[#1274c2]"
        >
          Back to Wallet
        </button>
      </main>
    );
  }

  return (
    <TransactionDetail
      transaction={toTransactionDetail(entry)}
      onBack={() => router.push("/payroll/wallets")}
    />
  );
}