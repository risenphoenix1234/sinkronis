import {
  employerContributions,
  PayRun,
  Payslip,
  payRunReference,
  runPeriodCode,
} from "@/types/payroll/pay-run-data";

/* =========================================================
   TYPES
========================================================= */

export type ObligationType =
  | "Payroll Disbursement"
  | "Pension Remittance"
  | "PAYE Remittance"
  | "NHF Remittance";

export type TxType = ObligationType | "Wallet Funding";

export type TxDirection = "Credit" | "Debit";

export type WalletTransaction = {
  id: string;
  date: string;
  description: string;
  txType: TxType;
  reference: string;
  direction: TxDirection;
  amount: number;
};

export type Obligation = {
  id: string;
  txType: ObligationType;
  description: string;
  /** The run's period, for copy that names the month on its own. */
  period: string;
  reference: string;
  dueDate: string;
  amount: number;
};

/** A ledger entry paired with the wallet balance right after it cleared. */
export type LedgerEntry = WalletTransaction & { balance: number };

/* =========================================================
   DATES
========================================================= */

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** "Aug 17, 2026" — the format every wallet date is written in. */
export function formatWalletDate(date: Date) {
  return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/**
 * A deadline `monthOffset` months after a run's period, landing on `day`.
 * Statutory deadlines fall in the month after the payroll period, so the
 * offset has to roll the year over once it passes December.
 */
export function deadline(run: PayRun, monthOffset: number, day: number) {
  const [year, month] = run.periodStart.split("-").map(Number);
  const index = month - 1 + monthOffset;

  return `${monthNames[index % 12]} ${day}, ${year + Math.floor(index / 12)}`;
}

/* =========================================================
   REMITTANCES
========================================================= */

/**
 * The statutory amounts a run generates alongside its net pay. Pension covers
 * both sides — the employee's withheld 8% and the employer's 10% top-up all go
 * to the PFA — while PAYE and NHF are withheld from the employee only.
 */
export function runRemittances(slips: Payslip[]) {
  return slips.reduce(
    (totals, slip) => ({
      pension:
        totals.pension + slip.pension + employerContributions(slip).pension,
      paye: totals.paye + slip.paye,
      nhf: totals.nhf + slip.nhf,
    }),
    { pension: 0, paye: 0, nhf: 0 },
  );
}

/**
 * Everything a run still owes: net pay to employees plus the three statutory
 * remittances. Deadlines follow the Nigerian schedule — pension within 7 days
 * of the period end, NHF by the 14th, PAYE by the 21st.
 */
export function runObligations(run: PayRun, slips: Payslip[]): Obligation[] {
  const remittances = runRemittances(slips);
  const code = runPeriodCode(run);

  return [
    {
      id: `net-${code}`,
      txType: "Payroll Disbursement",
      description: `${run.period} Payroll (Net Pay)`,
      period: run.period,
      reference: payRunReference(run),
      dueDate: deadline(run, 0, 25),
      amount: run.netPay,
    },
    {
      id: `pen-${code}`,
      txType: "Pension Remittance",
      description: `Pension Remittance — ${run.period}`,
      period: run.period,
      reference: `PEN-${code}`,
      dueDate: deadline(run, 1, 7),
      amount: remittances.pension,
    },
    {
      id: `paye-${code}`,
      txType: "PAYE Remittance",
      description: `PAYE Remittance — ${run.period} (LIRS/FCT/RIRS)`,
      period: run.period,
      reference: `PAYE-${code}`,
      dueDate: deadline(run, 1, 21),
      amount: remittances.paye,
    },
    {
      id: `nhf-${code}`,
      txType: "NHF Remittance",
      description: `NHF Remittance — ${run.period}`,
      period: run.period,
      reference: `NHF-${code}`,
      dueDate: deadline(run, 1, 14),
      amount: remittances.nhf,
    },
  ];
}

/* =========================================================
   LEDGER
========================================================= */

/** Credits minus debits — the balance a set of transactions leaves behind. */
export function netMovement(transactions: WalletTransaction[]) {
  return transactions.reduce(
    (total, tx) => total + (tx.direction === "Credit" ? tx.amount : -tx.amount),
    0,
  );
}

/**
 * Ledger rows newest first, each carrying the balance after it cleared.
 * Balances accumulate oldest-to-newest, so the walk runs backwards through the
 * list and the rows are flipped once it is done.
 */
export function walletLedger(transactions: WalletTransaction[]): LedgerEntry[] {
  const rows: LedgerEntry[] = [];
  let balance = 0;

  for (let index = transactions.length - 1; index >= 0; index -= 1) {
    const tx = transactions[index];

    balance += tx.direction === "Credit" ? tx.amount : -tx.amount;

    rows.push({ ...tx, balance });
  }

  return rows.reverse();
}

/* =========================================================
   SUMMARY
========================================================= */

/**
 * Headline wallet figures. Funded and disbursed are read straight off the
 * ledger so the balance is always what the transactions actually add up to.
 */
export function walletSummary(
  transactions: WalletTransaction[],
  obligations: Obligation[],
) {
  const funded = transactions
    .filter((tx) => tx.direction === "Credit")
    .reduce((total, tx) => total + tx.amount, 0);

  const disbursed = transactions
    .filter((tx) => tx.direction === "Debit")
    .reduce((total, tx) => total + tx.amount, 0);

  const balance = funded - disbursed;

  const pendingPayroll = obligations
    .filter((item) => item.txType === "Payroll Disbursement")
    .reduce((total, item) => total + item.amount, 0);

  const pendingObligations = obligations.reduce(
    (total, item) => total + item.amount,
    0,
  );

  return {
    funded,
    disbursed,
    balance,
    pendingPayroll,
    pendingObligations,
    /* Only the payroll run itself blocks on the balance, not the remittances. */
    shortfall: Math.max(0, pendingPayroll - balance),
  };
}
