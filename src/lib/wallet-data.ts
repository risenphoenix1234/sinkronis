// lib/wallet-data.ts
export type WalletTransaction = {
  refId: string;
  description: string;
  date: string;
  amount: number; // positive = inflow, negative = outflow
  hasReceipt: boolean;
};

export const walletTransactions: WalletTransaction[] = [
  { refId: "REF-ZT-001", description: "Payment received", date: "18 Apr 2026", amount: 526750, hasReceipt: false },
  { refId: "REF-COM-001", description: "Agent commission", date: "20 Apr 2026", amount: -52675, hasReceipt: false },
  { refId: "REF-BL-001", description: "Partial payment", date: "02 May 2026", amount: 50000, hasReceipt: false },
  { refId: "REF-VND-001", description: "Vendor payment", date: "05 May 2026", amount: -35000, hasReceipt: true },
];

export const naira = (n: number) => `₦${Math.abs(n).toLocaleString()}`;

export function getWalletSummary() {
  const availableBalance = walletTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalInflow = walletTransactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalOutflow = walletTransactions.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  return { availableBalance, totalInflow, totalOutflow, count: walletTransactions.length };
}