// src/lib/api/payroll/index.ts
/**
 * Payroll API Domain Module (Clean Architecture Facade)
 *
 * Exposes cohesive submodules:
 * - dashboard: Consolidated payroll metrics, charts, trends, and recent runs
 * - payruns: Pay run lifecycle, calculation eligibility, approval, export
 * - payees: Non-payroll payee directory, documents, payment history
 * - payslips: Tenant payslips list, employee breakdown, PDF export
 * - employees: Payroll employee enrollment, BIK, salary structures, loans
 * - deductions: Loan management and voluntary custom deduction types
 * - wallets: Payroll wallet balances, ledger transactions, obligations
 * - tax: State PAYE groups, monthly remittances, annual returns, config
 * - reports: Cost by department, month-on-month variance, schedules, YTD
 * - pension: PFA groups, remittances, AVC, transfers
 * - settings: Consolidated payroll settings, pay periods, statutory rates
 */

export * from "./dashboard";
export * from "./payruns";
export * from "./payees";
export * from "./payslips";
export * from "./employees";
export * from "./deductions";
export * from "./wallets";
export * from "./tax";
export * from "./reports";
export * from "./pension";
export * from "./settings";

// Re-export all domain contracts and DTO types for seamless backward compatibility
export * from "@/lib/api/types/payrollTypes";
