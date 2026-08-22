// data/payroll/wallet-data.ts

import { payRuns, payslips } from "@/data/payroll/pay-run-data";

import {
  netMovement,
  Obligation,
  runObligations,
  runRemittances,
  WalletTransaction,
} from "@/types/payroll/wallet-data";

/**
 * A draft run has been costed but not paid, so everything it owes is still
 * outstanding against the wallet.
 */
export const pendingObligations: Obligation[] = payRuns
  .filter((run) => run.status === "Draft")
  .flatMap((run) => runObligations(run, payslips));

/* =========================================================
   SETTLED HISTORY
========================================================= */

const remittances = runRemittances(payslips);

const netPay = payslips.reduce((total, slip) => total + slip.netPay, 0);

/** The float the account is left holding once every entry below has cleared. */
const closingBalance = 1_454_878;

type SettledMonth = {
  code: string;
  period: string;
  fundedOn: string;
  /** null marks the top-up that squares the account — see balancingTopUp. */
  topUp: number | null;
  disbursedOn: string;
  /** When the *previous* month's statutory remittances left the account. */
  remits: { pension: string; nhf: string; paye: string } | null;
};

/**
 * Months already settled, oldest first. Each one funds the account, clears the
 * previous month's remittances, then disburses its own net pay — which is why
 * May's remittances are still sitting in the pending list rather than here.
 */
const settledMonths: SettledMonth[] = [
  {
    code: "2026-001",
    period: "January 2026",
    fundedOn: "Jan 5, 2026",
    topUp: 12_000_000,
    disbursedOn: "Jan 26, 2026",
    remits: null,
  },
  {
    code: "2026-002",
    period: "February 2026",
    fundedOn: "Feb 3, 2026",
    topUp: 9_000_000,
    disbursedOn: "Feb 25, 2026",
    remits: {
      pension: "Feb 7, 2026",
      nhf: "Feb 14, 2026",
      paye: "Feb 21, 2026",
    },
  },
  {
    code: "2026-003",
    period: "March 2026",
    fundedOn: "Mar 3, 2026",
    topUp: 9_000_000,
    disbursedOn: "Mar 25, 2026",
    remits: {
      pension: "Mar 7, 2026",
      nhf: "Mar 14, 2026",
      paye: "Mar 21, 2026",
    },
  },
  {
    code: "2026-004",
    period: "April 2026",
    fundedOn: "Apr 3, 2026",
    topUp: 9_000_000,
    disbursedOn: "Apr 26, 2026",
    remits: {
      pension: "Apr 7, 2026",
      nhf: "Apr 14, 2026",
      paye: "Apr 21, 2026",
    },
  },
  {
    code: "2026-005",
    period: "May 2026",
    fundedOn: "May 5, 2026",
    topUp: null,
    disbursedOn: "May 26, 2026",
    remits: {
      pension: "May 7, 2026",
      nhf: "May 14, 2026",
      paye: "May 21, 2026",
    },
  },
];

/** Rebuilds the whole settled history, oldest first, for a given final top-up. */
function buildHistory(finalTopUp: number): WalletTransaction[] {
  const history: WalletTransaction[] = [];

  settledMonths.forEach((month, index) => {
    const previous = settledMonths[index - 1];

    history.push({
      id: `fnd-${month.code}`,
      date: month.fundedOn,
      description: `Wallet Funding — ${month.period}`,
      txType: "Wallet Funding",
      reference: `FND-${month.code}`,
      direction: "Credit",
      amount: month.topUp ?? finalTopUp,
    });

    if (month.remits && previous) {
      history.push({
        id: `pen-${previous.code}`,
        date: month.remits.pension,
        description: `Pension Remittance — ${previous.period}`,
        txType: "Pension Remittance",
        reference: `PEN-${previous.code}`,
        direction: "Debit",
        amount: remittances.pension,
      });

      history.push({
        id: `nhf-${previous.code}`,
        date: month.remits.nhf,
        description: `NHF Remittance — ${previous.period}`,
        txType: "NHF Remittance",
        reference: `NHF-${previous.code}`,
        direction: "Debit",
        amount: remittances.nhf,
      });

      history.push({
        id: `paye-${previous.code}`,
        date: month.remits.paye,
        description: `PAYE Remittance — ${previous.period}`,
        txType: "PAYE Remittance",
        reference: `PAYE-${previous.code}`,
        direction: "Debit",
        amount: remittances.paye,
      });
    }

    history.push({
      id: `net-${month.code}`,
      date: month.disbursedOn,
      description: `Payroll Disbursement — ${month.period}`,
      txType: "Payroll Disbursement",
      reference: `PR-${month.code}`,
      direction: "Debit",
      amount: netPay,
    });
  });

  return history;
}

/*
 * The May top-up is the balancing figure: whatever the account needed so that
 * `closingBalance` is left once the May disbursement cleared. Deriving it keeps
 * the wallet in step with the pay-run totals instead of drifting from them.
 */
const balancingTopUp = closingBalance - netMovement(buildHistory(0));

/** Newest first, which is the order the ledger is read in. */
export const walletTransactions: WalletTransaction[] = buildHistory(
  balancingTopUp,
).reverse();
