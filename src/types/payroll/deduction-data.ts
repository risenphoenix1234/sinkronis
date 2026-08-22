export type LoanStatus = "Active" | "Paused" | "Closed";

export type CustomDeductionType = "Recurring" | "One-off";

export type Loan = {
  id: string;
  employee: string;
  purpose: string;
  principal: number;
  outstanding: number;
  monthly: number;
  startDate: string;
  status: LoanStatus;
};

export type CustomDeduction = {
  id: string;
  employee: string;
  deductionName: string;
  monthlyAmount: number;
  type: CustomDeductionType;
};

/**
 * Initials for a row avatar.
 * Example: "Chukwuemeka Adeyemi" -> "CA".
 */
export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

/**
 * How much of the principal has been paid off so far.
 */
export function repaid(loan: Loan): number {
  return Math.max(0, loan.principal - loan.outstanding);
}

/**
 * Repayment progress as a whole percentage, clamped to 0-100.
 */
export function repaidPercent(loan: Loan): number {
  if (loan.principal <= 0) {
    return 0;
  }

  const percentage = (repaid(loan) / loan.principal) * 100;

  return Math.min(100, Math.max(0, Math.round(percentage)));
}

/**
 * Total instalments in the loan term.
 * The final instalment may be a partial payment.
 */
export function termMonths(loan: Loan): number {
  if (loan.monthly <= 0) {
    return 0;
  }

  return Math.ceil(loan.principal / loan.monthly);
}

/**
 * Instalments already collected.
 */
export function monthsPaid(loan: Loan): number {
  if (loan.monthly <= 0) {
    return 0;
  }

  return Math.floor(repaid(loan) / loan.monthly);
}

/**
 * Instalments still to be collected.
 */
export function monthsRemaining(loan: Loan): number {
  if (loan.monthly <= 0) {
    return 0;
  }

  return Math.ceil(loan.outstanding / loan.monthly);
}

export type ScheduleRow = {
  month: number;
  date: string;
  opening: number;
  repayment: number;
  closing: number;
  isCurrent: boolean;
};

/**
 * The design abbreviates September as "Sept";
 * every other month is three letters.
 */
const scheduleMonths: string[] = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Straight-line amortization from the loan's start date.
 *
 * Every instalment is the monthly repayment except the last,
 * which collects only the remaining balance so the closing
 * balance lands exactly on zero.
 *
 * The current month is the next instalment due —
 * the one after everything already repaid.
 */
export function amortizationSchedule(loan: Loan): ScheduleRow[] {
  if (loan.monthly <= 0 || loan.principal <= 0) {
    return [];
  }

  const startDateParts = loan.startDate.split("-");

  const startYear = Number(startDateParts[0]);
  const startMonth = Number(startDateParts[1]);

  if (
    !Number.isFinite(startYear) ||
    !Number.isFinite(startMonth) ||
    startMonth < 1 ||
    startMonth > 12
  ) {
    return [];
  }

  const current = monthsPaid(loan);
  const rows: ScheduleRow[] = [];

  let opening = loan.principal;

  const totalMonths = termMonths(loan);

  for (let index = 0; index < totalMonths; index += 1) {
    const offset = startMonth - 1 + index;

    const year = startYear + Math.floor(offset / 12);
    const monthIndex = offset % 12;

    const repayment = Math.min(loan.monthly, opening);
    const closing = Math.max(0, opening - repayment);

    rows.push({
      month: index + 1,
      date: `${scheduleMonths[monthIndex]} ${year}`,
      opening,
      repayment,
      closing,
      isCurrent: index === current,
    });

    opening = closing;
  }

  return rows;
}

/**
 * Only active loans are collected from salaries,
 * so paused and closed loans are excluded.
 */
export function loanSummary(loans: Loan[]) {
  const active = loans.filter((loan) => loan.status === "Active");

  return {
    activeCount: active.length,
    monthlyTotal: active.reduce((sum, loan) => sum + loan.monthly, 0),
    outstandingTotal: active.reduce((sum, loan) => sum + loan.outstanding, 0),
  };
}
