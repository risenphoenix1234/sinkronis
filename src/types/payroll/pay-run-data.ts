export type PayRunStatus = "Disbursed" | "Draft";

export type PayslipStatus = "Paid" | "Pending";

export type Payslip = {
  id: string;
  name: string;
  role: string;
  dept: string;
  gross: number;
  paye: number;
  pension: number;
  nhf: number;
  loans: number;
  netPay: number;
  bankName: string;
  bankAccount: string;
  status: PayslipStatus;
};

export type PayRun = {
  id: string;
  period: string;
  createdAt: string;
  periodStart: string;
  periodEnd: string;
  approvedAt?: string;
  disbursedAt?: string;
  employees: number;
  gross: number;
  netPay: number;
  paye: number;
  status: PayRunStatus;
};

/** Initials for the payslip avatar, e.g. "Amara Okafor" -> "AO". */
export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

/** All deductions withheld from a payslip's gross pay. */
export function totalDeductions(slip: Payslip) {
  return slip.paye + slip.pension + slip.nhf + slip.loans;
}

/**
 * Earnings components behind a payslip's gross. Allowances are the standard
 * percentages of basic salary — housing 20%, transport 10%, other 5% — so
 * gross is 1.35x basic and basic is recovered from it. "Other" absorbs any
 * rounding remainder, which keeps the four lines summing to gross exactly.
 */
export function earningsBreakdown(slip: Payslip) {
  const basic = Math.round(slip.gross / 1.35);
  const housing = Math.round(basic * 0.2);
  const transport = Math.round(basic * 0.1);

  return {
    basic,
    housing,
    transport,
    other: slip.gross - basic - housing - transport,
  };
}

/**
 * Employer-side costs. These are paid on top of gross and never withheld,
 * so they do not affect net pay. Pension is 10% of the pensionable base
 * (basic + housing + transport) and NSITF is 1% of gross.
 */
export function employerContributions(slip: Payslip) {
  const { basic, housing, transport } = earningsBreakdown(slip);
  const pensionable = basic + housing + transport;

  return {
    pension: Math.round(pensionable * 0.1),
    nsitf: Math.round(slip.gross * 0.01),
  };
}

/** Short code used in a payslip's pay reference, e.g. "Human Resources" -> "HR". */
const deptCodes: Record<string, string> = {
  "Human Resources": "HR",
  Finance: "FIN",
  Operations: "OPS",
  "IT & Technology": "IT",
  "Sales & Marketing": "SAL",
  "Legal & Compliance": "LEG",
};

/** Falls back to the first three letters for a department with no code. */
function deptCode(dept: string) {
  return deptCodes[dept] ?? dept.slice(0, 3).toUpperCase();
}

/** The year-and-month suffix shared by a run's references, e.g. "2026-005". */
export function runPeriodCode(run: PayRun) {
  const [year, month] = run.periodStart.split("-");

  return `${year}-${month.padStart(3, "0")}`;
}

/** Run-level reference, e.g. "PR-2026-005". */
export function payRunReference(run: PayRun) {
  return `PR-${runPeriodCode(run)}`;
}

/** Stable per-run payslip reference, e.g. "ps-PR-2026-005-HR-001". */
export function payReference(run: PayRun, slip: Payslip) {
  return `ps-${payRunReference(run)}-${deptCode(slip.dept)}-${slip.id.padStart(
    3,
    "0",
  )}`;
}

/** Route id for a single payslip — a payslip only means something within a run. */
export function payslipRouteId(run: PayRun, slip: Payslip) {
  return `${run.id}-${slip.id}`;
}

/**
 * Splits a payslipRouteId back into its run and payslip ids. Run ids may be
 * UUIDs containing hyphens while payslip ids never are, so the split happens
 * at the last hyphen rather than the first.
 */
export function parsePayslipRouteId(routeId: string) {
  const at = routeId.lastIndexOf("-");
  if (at < 1) return { runId: "", slipId: "" };

  return { runId: routeId.slice(0, at), slipId: routeId.slice(at + 1) };
}
