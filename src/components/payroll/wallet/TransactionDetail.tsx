"use client";

import { ArrowLeft } from "lucide-react";
import type { FC } from "react";

/**
 * TransactionDetail
 * ------------------
 * Matches the "Wallet Funding" transaction detail screen from Figma.
 *
 * This component is intentionally data-driven: pass it a `Transaction`
 * object (e.g. built via `toTransactionDetail(entry)` from a wallet
 * ledger row) and it will render. Nothing is hardcoded except sensible
 * layout & style.
 */

export type TransactionDirection = "credit" | "debit";

export type TransactionDetailRow = {
  label: string;
  value: string;
};

export interface Transaction {
  /** Pill label at the top of the header, e.g. "Funding" */
  badge: string;
  /** Tailwind classes for the badge pill, e.g. "bg-[#dcf5e4] text-[#16823b]".
   *  Falls back to emerald if omitted. */
  badgeClassName?: string;
  /** Small label on the right of the header, e.g. "Money In" / "Money Out" */
  flowLabel: string;
  /** Main title, e.g. "Wallet Funding" */
  title: string;
  /** ISO date string or any pre-formatted date string */
  date: string;
  /** Numeric amount (in Naira, or your base currency unit) */
  amount: number;
  /** Determines +/- sign and color/badge tone */
  direction: TransactionDirection;
  /** Table rows shown below the header */
  details: TransactionDetailRow[];
}

export interface TransactionDetailProps {
  transaction: Transaction;
  /** Called when the back button is pressed. Defaults to history.back(). */
  onBack?: () => void;
  /** Currency symbol, defaults to Naira */
  currencySymbol?: string;
  className?: string;
}

function formatAmount(amount: number, currencySymbol: string): string {
  const formatted = Math.abs(amount).toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `${currencySymbol}${formatted}`;
}

function formatDate(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date; // already formatted, pass through
  return parsed.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export const TransactionDetail: FC<TransactionDetailProps> = ({
  transaction,
  onBack,
  currencySymbol = "\u20A6",
  className = "",
}) => {
  const {
    badge,
    badgeClassName,
    flowLabel,
    title,
    date,
    amount,
    direction,
    details,
  } = transaction;

  const isCredit = direction === "credit";
  const sign = isCredit ? "+" : "-";

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 px-6 py-6 sm:px-10 ${className}`}>
      {/* Back navigation */}
      <button
        type="button"
        onClick={handleBack}
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
      >
        <ArrowLeft size={16} strokeWidth={2} />
        Back to Wallet
      </button>

      {/* Card */}
      <div className="mx-auto max-w-xl overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
        {/* Header */}
        <div className="bg-gradient-to-br from-sky-700 to-sky-600 px-7 pb-6 pt-6 text-white">
          <div className="flex items-start justify-between">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                badgeClassName ?? "bg-emerald-100 text-emerald-700"
              }`}
            >
              {badge}
            </span>
            <span className="text-xs font-medium text-sky-100">
              {flowLabel}
            </span>
          </div>

          <h1 className="mt-4 text-lg font-semibold text-white">{title}</h1>

          <div className="mt-1 flex items-end justify-between">
            <p className="text-xs text-sky-100">{formatDate(date)}</p>
            <p className="text-2xl font-bold tracking-tight text-white">
              {sign}
              {formatAmount(amount, currencySymbol)}
            </p>
          </div>
        </div>

        {/* Details list */}
        <dl className="divide-y divide-slate-100 px-7 py-2">
          {details.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between py-3.5"
            >
              <dt className="text-sm text-slate-400">{row.label}</dt>
              <dd className="text-sm font-semibold text-slate-800">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default TransactionDetail;
