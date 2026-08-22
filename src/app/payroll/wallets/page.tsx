// src/app/payroll/wallets/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, TrendingDown } from "lucide-react";

import FundWalletModal, {
  FundWalletFormData,
} from "@/components/payroll/wallet/FundWallet";

import {
  formatWalletDate,
  LedgerEntry,
  Obligation,
  TxType,
  walletLedger,
  walletSummary,
} from "@/types/payroll/wallet-data";

import { useWallet } from "@/context/payroll/WalletContext";

import { naira } from "@/types/payroll/payee-data";
import { directionStyles, txTypeStyles } from "@/lib/wallet-styles";

/* =========================================================
   CONSTANTS
========================================================= */

const accountName = "Sinkronis Technologies Ltd — Payroll Account";

/* =========================================================
   PAGE
========================================================= */

export default function PayrollWalletPage() {
  const router = useRouter();

  const { transactions, obligations, fundWallet, payObligation } = useWallet();

  const [showFundModal, setShowFundModal] = useState(false);

  const summary = walletSummary(transactions, obligations);

  const ledger = walletLedger(transactions);

  /*
   * The banner names the run that is blocked, so it needs the payroll
   * obligation rather than the remittances stacked behind it.
   */
  const pendingPayroll = obligations.find(
    (item) => item.txType === "Payroll Disbursement",
  );

  /* =======================================================
     FUND WALLET
  ======================================================= */

  const handleFundWallet = (data: FundWalletFormData) => {
    const amount = Number(data.amount) || 0;

    if (amount <= 0) return;

    fundWallet({
      id: crypto.randomUUID(),
      date: formatWalletDate(new Date()),
      description: `Wallet Funding — ${data.source}`,
      txType: "Wallet Funding",
      reference: data.reference.trim(),
      direction: "Credit",
      amount,
    });
  };

  /* =======================================================
     NAVIGATE TO TRANSACTION DETAIL
  ======================================================= */

  const openTransaction = (entry: LedgerEntry) => {
    router.push(`/payroll/wallets/${entry.id}`);
  };

  return (
    <main
      className="
        min-h-screen
        bg-[#f8fafc]
        p-4
        text-[#263447]
      "
    >
      {/* ===================================================
          HEADER
      ================================================== */}

      <header className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="
              text-[34px]
              font-bold
              leading-tight
              tracking-[-0.8px]
              text-[#263447]
            "
          >
            Payroll Wallet
          </h1>

          <p
            className="
              mt-2
              text-[14px]
              leading-5
              text-[#718096]
            "
          >
            Virtual business account for payroll disbursements and statutory
            remittances.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowFundModal(true)}
          className="
            flex
            h-11
            shrink-0
            items-center
            gap-2
            rounded-md
            bg-[#1683d8]
            px-5
            text-[14px]
            font-semibold
            text-white
            transition
            hover:bg-[#1274c2]
            focus:outline-none
            focus:ring-2
            focus:ring-[#1683d8]/30
          "
        >
          <Plus size={18} strokeWidth={2} />

          <span>Fund Wallet</span>
        </button>
      </header>

      {/* ===================================================
          BALANCE CARD
      ================================================== */}

      <section
        className="
          relative
          mt-6
          overflow-hidden
          rounded-lg
          bg-gradient-to-br
          from-[#1479bc]
          to-[#2f92d2]
          px-8
          py-7
        "
      >
        {/* Decorative rings, clipped by the card. */}

        <span
          className="
            pointer-events-none
            absolute
            -right-10
            top-16
            h-44
            w-44
            rounded-full
            bg-white/[0.07]
          "
        />

        <span
          className="
            pointer-events-none
            absolute
            right-14
            -top-12
            h-32
            w-32
            rounded-full
            bg-white/[0.07]
          "
        />

        <div className="relative">
          <p
            className="
              text-[11px]
              font-semibold
              uppercase
              tracking-[1.4px]
              text-white/75
            "
          >
            {accountName}
          </p>

          <p
            className="
              mt-3
              text-[40px]
              font-bold
              leading-none
              tracking-[-1px]
              text-white
            "
          >
            {naira(summary.balance)}
          </p>

          <div
            className="
              mt-7
              grid
              grid-cols-2
              gap-5
              sm:grid-cols-4
            "
          >
            <HeroStat label="Total Funded" value={naira(summary.funded)} />

            <HeroStat
              label="Total Disbursed"
              value={naira(summary.disbursed)}
            />

            <HeroStat
              label="Pending Payroll"
              value={naira(summary.pendingPayroll)}
            />

            <HeroStat
              label="Pending Obligations"
              value={naira(summary.pendingObligations)}
            />
          </div>
        </div>
      </section>

      {/* ===================================================
          SHORTFALL BANNER
      ================================================== */}

      {summary.shortfall > 0 && pendingPayroll && (
        <section
          className="
            mt-4
            flex
            items-center
            gap-2.5
            rounded-md
            border
            border-[#fbd5d5]
            bg-[#fff5f5]
            px-5
            py-3.5
          "
        >
          <TrendingDown
            size={18}
            strokeWidth={2}
            className="shrink-0 text-[#e8384f]"
          />

          <p className="text-[13.5px] leading-5 text-[#ef5a5a]">
            <span className="font-bold text-[#d92d20]">
              Insufficient balance.
            </span>{" "}
            {pendingPayroll.period} payroll needs {naira(pendingPayroll.amount)}
            . Top up {naira(summary.shortfall)} more.
          </p>
        </section>
      )}

      {/* ===================================================
          PENDING OBLIGATIONS
      ================================================== */}

      <section
        className="
          mt-5
          overflow-hidden
          rounded-lg
          border
          border-[#dce2e8]
          bg-white
        "
      >
        <header
          className="
            border-b
            border-[#e5e9ed]
            px-6
            py-4
          "
        >
          <h2
            className="
              text-[15px]
              font-bold
              text-[#263447]
            "
          >
            Pending Obligations
          </h2>

          <p
            className="
              mt-0.5
              text-[12.5px]
              text-[#8994a3]
            "
          >
            Outstanding disbursements and statutory remittances
          </p>
        </header>

        {obligations.length === 0 ? (
          <div className="py-14 text-center">
            <p className="text-[15px] font-semibold text-[#344054]">
              Nothing outstanding
            </p>

            <p className="mt-1 text-[14px] text-[#8994a3]">
              Every disbursement and remittance has been settled.
            </p>
          </div>
        ) : (
          <div
            className="
              grid
              grid-cols-1
              gap-4
              p-5
              lg:grid-cols-2
            "
          >
            {obligations.map((obligation) => (
              <ObligationCard
                key={obligation.id}
                obligation={obligation}
                onPay={() => payObligation(obligation)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ===================================================
          TRANSACTION HISTORY
      ================================================== */}

      <section
        className="
          mt-5
          overflow-hidden
          rounded-lg
          border
          border-[#dce2e8]
          bg-white
        "
      >
        <header
          className="
            border-b
            border-[#e5e9ed]
            px-6
            py-4
          "
        >
          <h2
            className="
              text-[15px]
              font-bold
              text-[#263447]
            "
          >
            Transaction History
          </h2>
        </header>

        <div className="overflow-x-auto">
          <table
            className="
              w-full
              min-w-[980px]
              border-collapse
              text-left
            "
          >
            <thead>
              <tr
                className="
                  border-b
                  border-[#e5e9ed]
                  text-[13px]
                  font-semibold
                  text-[#718096]
                "
              >
                <th className="px-6 py-3.5 font-semibold">Date</th>
                <th className="px-6 py-3.5 font-semibold">Description</th>
                <th className="px-6 py-3.5 font-semibold">Tx Type</th>
                <th className="px-6 py-3.5 font-semibold">Reference</th>
                <th className="px-6 py-3.5 font-semibold">Direction</th>
                <th className="px-6 py-3.5 font-semibold">Amount</th>
                <th className="px-6 py-3.5 font-semibold">Balance</th>
              </tr>
            </thead>

            <tbody>
              {ledger.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="
                      px-6
                      py-14
                      text-center
                      text-[14px]
                      text-[#8994a3]
                    "
                  >
                    No transactions on this account yet.
                  </td>
                </tr>
              ) : (
                ledger.map((entry, index) => (
                  <LedgerRow
                    key={entry.id}
                    entry={entry}
                    index={index}
                    onOpen={() => openTransaction(entry)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ===================================================
          FUND WALLET MODAL
      ================================================== */}

      <FundWalletModal
        isOpen={showFundModal}
        onClose={() => setShowFundModal(false)}
        onSubmit={handleFundWallet}
      />
    </main>
  );
}

/* =========================================================
   HERO STAT
========================================================= */

type HeroStatProps = {
  label: string;
  value: string;
};

function HeroStat({ label, value }: HeroStatProps) {
  return (
    <div>
      <p
        className="
          text-[10.5px]
          font-semibold
          uppercase
          tracking-[1.1px]
          text-white/70
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1.5
          text-[15px]
          font-bold
          text-white
        "
      >
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   OBLIGATION CARD
========================================================= */

type ObligationCardProps = {
  obligation: Obligation;
  onPay: () => void;
};

function ObligationCard({ obligation, onPay }: ObligationCardProps) {
  return (
    <div
      className="
        flex
        items-start
        justify-between
        gap-4
        rounded-lg
        border
        border-[#e5e9ed]
        px-5
        py-4
      "
    >
      <div className="min-w-0">
        <TypeBadge txType={obligation.txType} />

        <p
          className="
            mt-2.5
            text-[14px]
            font-medium
            text-[#263447]
          "
        >
          {obligation.description}
        </p>

        <p
          className="
            mt-1.5
            text-[12px]
            text-[#a3aeb9]
          "
        >
          Due {obligation.dueDate}
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p
          className="
            text-[15.5px]
            font-bold
            text-[#263447]
          "
        >
          {naira(obligation.amount)}
        </p>

        <button
          type="button"
          onClick={onPay}
          className="
            mt-2.5
            h-8
            rounded-md
            bg-[#1683d8]
            px-4
            text-[12.5px]
            font-semibold
            text-white
            transition
            hover:bg-[#1274c2]
          "
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   LEDGER ROW
========================================================= */

type LedgerRowProps = {
  entry: LedgerEntry;
  index: number;
  onOpen: () => void;
};

function LedgerRow({ entry, index, onOpen }: LedgerRowProps) {
  const isCredit = entry.direction === "Credit";

  return (
    <tr
      role="link"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className={`
        cursor-pointer
        border-b
        border-[#edf0f3]
        text-[13.5px]
        outline-none
        transition-colors
        last:border-b-0
        hover:bg-[#f0f6fc]
        focus-visible:bg-[#eaf3fb]
        ${index % 2 === 1 ? "bg-[#f9fafb]" : "bg-white"}
      `}
    >
      {/* Date */}

      <td className="whitespace-nowrap px-6 py-3.5 text-[#344054]">
        {entry.date}
      </td>

      {/* Description */}

      <td className="px-6 py-3.5 text-[#344054]">{entry.description}</td>

      {/* Tx Type */}

      <td className="px-6 py-3.5">
        <TypeBadge txType={entry.txType} />
      </td>

      {/* Reference */}

      <td
        className="
          whitespace-nowrap
          px-6
          py-3.5
          text-[12.5px]
          font-medium
          tracking-[0.5px]
          text-[#1683d8]
        "
      >
        {entry.reference}
      </td>

      {/* Direction */}

      <td className="px-6 py-3.5">
        <span
          className={`
            inline-flex
            items-center
            rounded-full
            px-2.5
            py-1
            text-[11px]
            font-semibold
            ${directionStyles[entry.direction]}
          `}
        >
          {entry.direction}
        </span>
      </td>

      {/* Amount */}

      <td
        className={`
          whitespace-nowrap
          px-6
          py-3.5
          font-semibold
          ${isCredit ? "text-[#16823b]" : "text-[#ff3b3b]"}
        `}
      >
        {isCredit ? "+" : "-"}
        {naira(entry.amount)}
      </td>
      {/* Balance */}

      <td
        className="
          whitespace-nowrap
          px-6
          py-3.5
          font-semibold
          text-[#263447]
        "
      >
        {naira(entry.balance)}
      </td>
    </tr>
  );
}

/* =========================================================
   TYPE BADGE
========================================================= */

function TypeBadge({ txType }: { txType: TxType }) {
  return (
    <span
      className={`
        inline-flex
        items-center
        whitespace-nowrap
        rounded-full
        px-2.5
        py-1
        text-[10.5px]
        font-semibold
        ${txTypeStyles[txType]}
      `}
    >
      {txType}
    </span>
  );
}
