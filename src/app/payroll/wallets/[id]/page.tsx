// src/app/payroll/wallets/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import TransactionDetail, {
  type Transaction,
} from "@/components/payroll/wallet/TransactionDetail";
import {
  apiTxToTransactionDetail,
} from "@/lib/wallet-transaction";
import { getPayrollWalletTransaction } from "@/lib/api/payroll";
import Loader from "@/components/ui/Loader";

export default function WalletTransactionDetailPage() {
  const params = useParams();
  const id =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : "";
  const router = useRouter();

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let isCancelled = false;

    async function fetchDetail() {
      setLoading(true);
      try {
        const res = await getPayrollWalletTransaction(id);
        if (!isCancelled) {
          if (res?.data) {
            setTransaction(apiTxToTransactionDetail(res.data));
          } else {
            setTransaction(null);
          }
        }
      } catch {
        if (!isCancelled) {
          setTransaction(null);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    fetchDetail();

    return () => {
      isCancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#f8fafc] px-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#1683d8]" />
        <Loader variant="section" label="Loading transaction details" />
      </main>
    );
  }

  if (!transaction) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#f8fafc] px-4 text-center">
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
      transaction={transaction}
      onBack={() => router.push("/payroll/wallets")}
    />
  );
}
