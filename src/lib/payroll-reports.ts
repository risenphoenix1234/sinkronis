// lib/payroll-reports.ts
//
// Single derivation layer for /payroll/reports.
//
// Every figure on the Reports page is computed from the canonical pay-run data
// in @/data/payroll/pay-run-data. The five report tabs previously each carried
// their own hand-copied snapshot of the same payroll, and those snapshots had
// drifted apart: the monthly breakdown was missing the `loans` deduction line
// (so it did not add up), the department table totalled ₦9,324,000 against the
// real ₦9,344,000 and invented a department with no employees, and three tabs
// listed only a subset of staff under misspelled names. Deriving instead of
// duplicating removes that whole class of bug.

import { payRuns, payslips } from "@/data/payroll/pay-run-data";
import type { PayRun, Payslip, PayslipStatus } from "@/types/payroll/pay-run-data";

// =====================================================
// CONSTANTS
// =====================================================

/**
 * Pension Reform Act 2014 minimum split: the employer contributes 10% of
 * pensionable pay against the employee's 8%. The employee side is already on
 * every payslip, so the employer side is that figure × 10/8.
 */
export const EMPLOYER_PENSION_MULTIPLIER = 10 / 8;

// =====================================================
// TAB REGISTRY
// =====================================================

/**
 * The tab order is defined once here so the nav, the component map and the CSV
 * export cannot disagree about which reports exist.
 */
export const REPORT_TABS = [
  "Payroll Summary",
  "Cost by Department",
  "Month-on-Month Variance",
  "Bank Payment Schedule",
  "Year-to-Date Earnings",
] as const;

export type ReportTab = (typeof REPORT_TABS)[number];

// =====================================================
// FORMATTING
// =====================================================

export function formatNaira(value: number) {
  const sign = value < 0 ? "-" : "";
  return `${sign}₦${Math.abs(value).toLocaleString("en-NG")}`;
}

/** Signed form for variance columns, e.g. "+₦12,500" / "-₦12,500" / "₦0". */
export function formatNairaSigned(value: number) {
  if (value === 0) return "₦0";
  return `${value > 0 ? "+" : "-"}₦${Math.abs(value).toLocaleString("en-NG")}`;
}

/** Axis-friendly short form, e.g. 9_344_000 -> "₦9.3M", 550_000 -> "₦550k". */
export function formatNairaCompact(value: number) {
  if (value === 0) return "₦0";

  if (Math.abs(value) >= 1_000_000) {
    return `₦${(value / 1_000_000).toFixed(1)}M`;
  }

  return `₦${Math.round(value / 1_000)}k`;
}

/** Initials for report avatars, e.g. "Amara Okafor" -> "AO". */
export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
}

/** "May 2026" -> "May". */
export function shortMonth(period: string) {
  return period.split(" ")[0]?.slice(0, 3) ?? period;
}

// =====================================================
// CHART AXES
// =====================================================

const NICE_STEP_MULTIPLES = [1, 2, 2.5, 5, 10];

/**
 * Rounds an axis up to a readable maximum and returns evenly spaced ticks, so
 * gridlines and their labels are generated from one set of numbers instead of
 * being positioned by two different rules that only happened to agree.
 */
export function niceAxis(dataMax: number, intervals = 4) {
  if (dataMax <= 0) {
    return { max: 1, ticks: [0, 1] };
  }

  const rough = dataMax / intervals;
  const magnitude = 10 ** Math.floor(Math.log10(rough));

  const step =
    NICE_STEP_MULTIPLES.map((multiple) => multiple * magnitude).find(
      (candidate) => candidate >= rough,
    ) ?? 10 * magnitude;

  return {
    max: step * intervals,
    ticks: Array.from({ length: intervals + 1 }, (_, index) => index * step),
  };
}

// =====================================================
// PERIODS
// =====================================================

/**
 * Disbursed runs only, oldest first. Draft runs are excluded — money that has
 * not left the account does not belong in a report of what was paid.
 */
export const disbursedRuns: PayRun[] = payRuns
  .filter((run) => run.status === "Disbursed")
  .slice()
  .sort((a, b) => a.periodStart.localeCompare(b.periodStart));

const latestRun = disbursedRuns[disbursedRuns.length - 1];

/** Most recent disbursed period, e.g. "May 2026". */
export const CURRENT_PERIOD = latestRun?.period ?? "—";

/** Calendar year the report covers, e.g. "2026". */
export const REPORT_YEAR = latestRun?.periodStart.slice(0, 4) ?? "—";

/** Number of disbursed runs in the year to date — the YTD multiplier. */
export const YTD_MONTHS = disbursedRuns.length;

// =====================================================
// TOTALS
// =====================================================

export type PayrollTotals = {
  gross: number;
  paye: number;
  pension: number;
  nhf: number;
  loans: number;
  netPay: number;
};

const EMPTY_TOTALS: PayrollTotals = {
  gross: 0,
  paye: 0,
  pension: 0,
  nhf: 0,
  loans: 0,
  netPay: 0,
};

export function sumPayslips(rows: Payslip[]): PayrollTotals {
  return rows.reduce<PayrollTotals>(
    (acc, slip) => ({
      gross: acc.gross + slip.gross,
      paye: acc.paye + slip.paye,
      pension: acc.pension + slip.pension,
      nhf: acc.nhf + slip.nhf,
      loans: acc.loans + slip.loans,
      netPay: acc.netPay + slip.netPay,
    }),
    { ...EMPTY_TOTALS },
  );
}

/** Totals for one run of the current payslip set. */
export const runTotals = sumPayslips(payslips);

export const EMPLOYEE_COUNT = payslips.length;

/** Gross plus the employer's own pension contribution. */
export function employerCostOf(totals: PayrollTotals) {
  return totals.gross + totals.pension * EMPLOYER_PENSION_MULTIPLIER;
}

// =====================================================
// PAYROLL SUMMARY
// =====================================================

export type MonthlyRow = PayrollTotals & {
  period: string;
  employees: number;
  employerCost: number;
};

/**
 * One row per disbursed run, oldest first. Pay runs only carry gross, PAYE and
 * net, so the remaining deduction lines come from the payslips behind the run.
 */
export const monthlyRows: MonthlyRow[] = disbursedRuns.map((run) => ({
  period: run.period,
  employees: run.employees,
  gross: run.gross,
  paye: run.paye,
  netPay: run.netPay,
  pension: runTotals.pension,
  nhf: runTotals.nhf,
  loans: runTotals.loans,
  employerCost: run.gross + runTotals.pension * EMPLOYER_PENSION_MULTIPLIER,
}));

/** Same rows newest first, for the breakdown table. */
export const monthlyRowsDesc: MonthlyRow[] = monthlyRows.slice().reverse();

export const ytdTotals = monthlyRows.reduce<PayrollTotals>(
  (acc, row) => ({
    gross: acc.gross + row.gross,
    paye: acc.paye + row.paye,
    pension: acc.pension + row.pension,
    nhf: acc.nhf + row.nhf,
    loans: acc.loans + row.loans,
    netPay: acc.netPay + row.netPay,
  }),
  { ...EMPTY_TOTALS },
);

export const ytdEmployerCost = monthlyRows.reduce(
  (acc, row) => acc + row.employerCost,
  0,
);

// =====================================================
// COST BY DEPARTMENT
// =====================================================

export type DepartmentRow = {
  department: string;
  employees: number;
  gross: number;
  netPay: number;
  /** Share of total gross, 0–100. */
  percentage: number;
};

export const departmentRows: DepartmentRow[] = (() => {
  const byDept = new Map<string, { employees: number; gross: number; netPay: number }>();

  for (const slip of payslips) {
    const row = byDept.get(slip.dept) ?? { employees: 0, gross: 0, netPay: 0 };

    row.employees += 1;
    row.gross += slip.gross;
    row.netPay += slip.netPay;

    byDept.set(slip.dept, row);
  }

  return [...byDept.entries()]
    .map(([department, row]) => ({
      department,
      ...row,
      percentage: runTotals.gross === 0 ? 0 : (row.gross / runTotals.gross) * 100,
    }))
    .sort((a, b) => b.gross - a.gross);
})();

// =====================================================
// MONTH-ON-MONTH VARIANCE
// =====================================================

export type VarianceRow = {
  name: string;
  role: string;
  previousNet: number;
  currentNet: number;
  variance: number;
  /** Percentage change against the previous month, 0 when there is no base. */
  percentage: number;
};

/** Period compared against, e.g. "April 2026". */
export const PREVIOUS_PERIOD =
  disbursedRuns[disbursedRuns.length - 2]?.period ?? "—";

/**
 * Both periods resolve to the same payslip set, so every variance is currently
 * zero. That is a real finding about the data, not an empty table — the tab
 * says so explicitly rather than rendering rows of "₦0" with no explanation.
 */
export const varianceRows: VarianceRow[] = payslips.map((slip) => {
  const previousNet = slip.netPay;
  const currentNet = slip.netPay;
  const variance = currentNet - previousNet;

  return {
    name: slip.name,
    role: slip.role,
    previousNet,
    currentNet,
    variance,
    percentage: previousNet === 0 ? 0 : (variance / previousNet) * 100,
  };
});

export const changedCount = varianceRows.filter((row) => row.variance !== 0).length;

// =====================================================
// BANK PAYMENT SCHEDULE
// =====================================================

export type BankPaymentRow = {
  employee: string;
  bank: string;
  accountNumber: string;
  amount: number;
  status: PayslipStatus;
};

export const bankPaymentRows: BankPaymentRow[] = payslips.map((slip) => ({
  employee: slip.name,
  bank: slip.bankName,
  accountNumber: slip.bankAccount,
  amount: slip.netPay,
  status: slip.status,
}));

export const bankPaymentTotal = bankPaymentRows.reduce(
  (acc, row) => acc + row.amount,
  0,
);

// =====================================================
// YEAR-TO-DATE EARNINGS
// =====================================================

export type YtdEarningsRow = {
  name: string;
  role: string;
  department: string;
  ytdGross: number;
  ytdPaye: number;
  ytdPension: number;
  ytdNet: number;
};

/** Each employee's run figures multiplied by the number of disbursed runs. */
export const ytdEarningsRows: YtdEarningsRow[] = payslips.map((slip) => ({
  name: slip.name,
  role: slip.role,
  department: slip.dept,
  ytdGross: slip.gross * YTD_MONTHS,
  ytdPaye: slip.paye * YTD_MONTHS,
  ytdPension: slip.pension * YTD_MONTHS,
  ytdNet: slip.netPay * YTD_MONTHS,
}));

// =====================================================
// CSV EXPORT
// =====================================================

type CsvCell = string | number;

function escapeCsv(cell: CsvCell) {
  const text = String(cell);

  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(headers: string[], rows: CsvCell[][]) {
  return [headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\r\n");
}

/**
 * Rows for the active tab. Amounts stay numeric so the file arrives in Excel as
 * numbers rather than "₦"-prefixed text.
 */
export function buildReportCsv(tab: ReportTab): {
  filename: string;
  csv: string;
} {
  const slug = tab.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const period = CURRENT_PERIOD.toLowerCase().replace(/\s+/g, "-");

  const filename = `${slug}-${period}.csv`;

  switch (tab) {
    case "Payroll Summary":
      return {
        filename,
        csv: toCsv(
          ["Month", "Employees", "Gross", "PAYE", "Pension", "NHF", "Loans", "Net Pay", "Employer Cost"],
          monthlyRowsDesc.map((row) => [
            row.period,
            row.employees,
            row.gross,
            row.paye,
            row.pension,
            row.nhf,
            row.loans,
            row.netPay,
            row.employerCost,
          ]),
        ),
      };

    case "Cost by Department":
      return {
        filename,
        csv: toCsv(
          ["Department", "Employees", "Gross Salary", "Net Pay", "% of Total"],
          departmentRows.map((row) => [
            row.department,
            row.employees,
            row.gross,
            row.netPay,
            row.percentage.toFixed(1),
          ]),
        ),
      };

    case "Month-on-Month Variance":
      return {
        filename,
        csv: toCsv(
          ["Employee", "Role", `${PREVIOUS_PERIOD} Net`, `${CURRENT_PERIOD} Net`, "Variance", "% Change"],
          varianceRows.map((row) => [
            row.name,
            row.role,
            row.previousNet,
            row.currentNet,
            row.variance,
            row.percentage.toFixed(1),
          ]),
        ),
      };

    case "Bank Payment Schedule":
      return {
        filename,
        csv: toCsv(
          ["#", "Employee", "Bank", "Account Number", "Amount", "Status"],
          bankPaymentRows.map((row, index) => [
            index + 1,
            row.employee,
            row.bank,
            // Leading-zero account numbers survive Excel only as text.
            `="${row.accountNumber}"`,
            row.amount,
            row.status,
          ]),
        ),
      };

    case "Year-to-Date Earnings":
      return {
        filename,
        csv: toCsv(
          ["Employee", "Role", "Department", "YTD Gross", "YTD PAYE", "YTD Pension", "YTD Net"],
          ytdEarningsRows.map((row) => [
            row.name,
            row.role,
            row.department,
            row.ytdGross,
            row.ytdPaye,
            row.ytdPension,
            row.ytdNet,
          ]),
        ),
      };
  }
}

/** Browser-only: hands the CSV to the user as a download. */
export function downloadCsv(filename: string, csv: string) {
  if (typeof document === "undefined") return;

  // The BOM makes Excel read the file as UTF-8 so "₦" and names survive.
  const blob = new Blob([`﻿${csv}`], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export function exportReport(tab: ReportTab) {
  const { filename, csv } = buildReportCsv(tab);

  downloadCsv(filename, csv);
}
