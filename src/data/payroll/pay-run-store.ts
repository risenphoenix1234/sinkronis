// src/data/payroll/pay-run-store.ts

import {
  PayRunDetail,
  PayRunListItem,
  PayRunPayslipItem,
  PayRunStatus,
} from "@/lib/api/types/payrollTypes";
import { UnifiedPayee } from "@/types/payroll/unified-payee";
import rawPayees from "./unified-payees.json";

const RUNS_STORAGE_KEY = "sinkronis_payroll_runs_store_v1";

const initialPayeesList: UnifiedPayee[] = rawPayees as UnifiedPayee[];

// Build default initial seed runs
function buildInitialRuns(): PayRunDetail[] {
  const defaultPayees = initialPayeesList.filter((p) => p.onPayroll);
  const totalGross = defaultPayees.reduce((s, p) => s + p.grossSalary, 0);
  const totalNet = defaultPayees.reduce((s, p) => s + p.netSalary, 0);
  const totalPaye = defaultPayees.reduce((s, p) => s + p.deductions.paye, 0);

  const payslipsMay: PayRunPayslipItem[] = defaultPayees.map((p) => ({
    id: `ps-may-2026-${p.id}`,
    employeeId: p.id,
    employeeName: p.name,
    employeeCode: p.id,
    departmentName: p.department || "Operations",
    jobTitle: `${p.role} (${p.type})`,
    gross: p.grossSalary,
    paye: p.deductions.paye,
    pension: p.deductions.employeePension,
    nhf: p.deductions.nhf,
    netPay: p.netSalary,
    bankName: p.bankName,
    bankAccount: p.bankAccount,
    status: "PAID",
  }));

  const mayRun: PayRunDetail = {
    id: "PR-2026-005",
    period: "May 2026",
    status: "DISBURSED",
    createdAt: "2026-05-18T10:00:00.000Z",
    from: "2026-05-01",
    to: "2026-05-31",
    payDate: "2026-05-26",
    employees: defaultPayees.length,
    gross: totalGross,
    netPay: totalNet,
    paye: totalPaye,
    failureReason: null,
    progress: { expected: defaultPayees.length, processed: defaultPayees.length, failed: 0, percentage: 100 },
    payslips: payslipsMay,
  };

  const aprilRun: PayRunDetail = {
    id: "PR-2026-004",
    period: "April 2026",
    status: "DISBURSED",
    createdAt: "2026-04-18T10:00:00.000Z",
    from: "2026-04-01",
    to: "2026-04-30",
    payDate: "2026-04-25",
    employees: defaultPayees.length,
    gross: totalGross,
    netPay: totalNet,
    paye: totalPaye,
    failureReason: null,
    progress: { expected: defaultPayees.length, processed: defaultPayees.length, failed: 0, percentage: 100 },
    payslips: payslipsMay.map((ps) => ({ ...ps, id: `ps-apr-2026-${ps.employeeId}` })),
  };

  const juneRun: PayRunDetail = {
    id: "PR-2026-006",
    period: "June 2026",
    status: "PENDING_APPROVAL",
    createdAt: "2026-06-18T10:00:00.000Z",
    from: "2026-06-01",
    to: "2026-06-30",
    payDate: "2026-06-25",
    employees: defaultPayees.length,
    gross: totalGross,
    netPay: totalNet,
    paye: totalPaye,
    failureReason: null,
    progress: { expected: defaultPayees.length, processed: defaultPayees.length, failed: 0, percentage: 100 },
    payslips: payslipsMay.map((ps) => ({
      ...ps,
      id: `ps-jun-2026-${ps.employeeId}`,
      status: "PENDING",
    })),
  };

  return [juneRun, mayRun, aprilRun];
}

export function loadStoredPayRuns(): PayRunDetail[] {
  if (typeof window === "undefined") {
    return buildInitialRuns();
  }
  try {
    const raw = window.localStorage.getItem(RUNS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  const defaults = buildInitialRuns();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(RUNS_STORAGE_KEY, JSON.stringify(defaults));
    } catch {
      // ignore
    }
  }
  return defaults;
}

export function saveStoredPayRuns(runs: PayRunDetail[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(RUNS_STORAGE_KEY, JSON.stringify(runs));
  } catch {
    // ignore
  }
}

export function getClientPayRuns(): PayRunListItem[] {
  const runs = loadStoredPayRuns();
  return runs.map((r) => ({
    id: r.id,
    period: r.period,
    status: r.status,
    createdAt: r.createdAt,
    from: r.from,
    to: r.to,
    payDate: r.payDate,
    employees: r.employees,
    gross: r.gross,
    netPay: r.netPay,
    paye: r.paye,
  }));
}

export function getClientPayRunDetail(id: string): PayRunDetail | null {
  const runs = loadStoredPayRuns();
  return runs.find((r) => r.id === id) || null;
}

export function createClientPayRun(params: {
  periodLabel: string;
  from: string;
  to: string;
  selectedPayees: UnifiedPayee[];
}): PayRunDetail {
  const runs = loadStoredPayRuns();
  const runId = `PR-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;

  const totalGross = params.selectedPayees.reduce((s, p) => s + p.grossSalary, 0);
  const totalNet = params.selectedPayees.reduce((s, p) => s + p.netSalary, 0);
  const totalPaye = params.selectedPayees.reduce((s, p) => s + p.deductions.paye, 0);

  const payslips: PayRunPayslipItem[] = params.selectedPayees.map((p) => ({
    id: `ps-${runId}-${p.id}`,
    employeeId: p.id,
    employeeName: p.name,
    employeeCode: p.id,
    departmentName: p.department || "Operations",
    jobTitle: `${p.role} (${p.type})`,
    gross: p.grossSalary,
    paye: p.deductions.paye,
    pension: p.deductions.employeePension,
    nhf: p.deductions.nhf,
    netPay: p.netSalary,
    bankName: p.bankName,
    bankAccount: p.bankAccount,
    status: "PENDING",
  }));

  const newRun: PayRunDetail = {
    id: runId,
    period: params.periodLabel,
    status: "PENDING_APPROVAL",
    createdAt: new Date().toISOString(),
    from: params.from,
    to: params.to,
    payDate: params.to,
    employees: params.selectedPayees.length,
    gross: totalGross,
    netPay: totalNet,
    paye: totalPaye,
    failureReason: null,
    progress: {
      expected: params.selectedPayees.length,
      processed: params.selectedPayees.length,
      failed: 0,
      percentage: 100,
    },
    payslips,
  };

  const updatedRuns = [newRun, ...runs];
  saveStoredPayRuns(updatedRuns);

  return newRun;
}

export function updateClientPayRunStatus(id: string, status: PayRunStatus): PayRunDetail | null {
  const runs = loadStoredPayRuns();
  const target = runs.find((r) => r.id === id);
  if (!target) return null;

  target.status = status;
  if (status === "DISBURSED") {
    target.payslips = target.payslips.map((p) => ({ ...p, status: "PAID" }));
  }

  saveStoredPayRuns(runs);
  return target;
}

export function addPayeesToClientPayRun(
  runId: string,
  newPayees: UnifiedPayee[],
): PayRunDetail | null {
  const runs = loadStoredPayRuns();
  const run = runs.find((r) => r.id === runId);
  if (!run) return null;

  const existingIds = new Set(run.payslips.map((ps) => ps.employeeId));
  const toAdd = newPayees.filter((p) => !existingIds.has(p.id));

  if (toAdd.length === 0) return run;

  const newPayslips: PayRunPayslipItem[] = toAdd.map((p) => ({
    id: `ps-${runId}-${p.id}`,
    employeeId: p.id,
    employeeName: p.name,
    employeeCode: p.id,
    departmentName: p.department || "Operations",
    jobTitle: `${p.role} (${p.type})`,
    gross: p.grossSalary,
    paye: p.deductions.paye,
    pension: p.deductions.employeePension,
    nhf: p.deductions.nhf,
    netPay: p.netSalary,
    bankName: p.bankName,
    bankAccount: p.bankAccount,
    status: "PENDING",
  }));

  run.payslips = [...run.payslips, ...newPayslips];
  run.gross = run.payslips.reduce((s, ps) => s + ps.gross, 0);
  run.netPay = run.payslips.reduce((s, ps) => s + ps.netPay, 0);
  run.paye = run.payslips.reduce((s, ps) => s + ps.paye, 0);
  run.employees = run.payslips.length;
  run.progress = {
    expected: run.payslips.length,
    processed: run.payslips.length,
    failed: 0,
    percentage: 100,
  };

  saveStoredPayRuns(runs);
  return run;
}

export function removePayeeFromClientPayRun(
  runId: string,
  payeeId: string,
): PayRunDetail | null {
  const runs = loadStoredPayRuns();
  const run = runs.find((r) => r.id === runId);
  if (!run) return null;

  run.payslips = run.payslips.filter((ps) => ps.employeeId !== payeeId);
  run.gross = run.payslips.reduce((s, ps) => s + ps.gross, 0);
  run.netPay = run.payslips.reduce((s, ps) => s + ps.netPay, 0);
  run.paye = run.payslips.reduce((s, ps) => s + ps.paye, 0);
  run.employees = run.payslips.length;
  run.progress = {
    expected: run.payslips.length,
    processed: run.payslips.length,
    failed: 0,
    percentage: 100,
  };

  saveStoredPayRuns(runs);
  return run;
}

