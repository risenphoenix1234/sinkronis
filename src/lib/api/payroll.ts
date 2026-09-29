// src/lib/api/payroll.ts
/**
 * Payroll API Gateway (Clean Architecture Entry Point)
 *
 * Re-exports the modular payroll domain submodules located under `src/lib/api/payroll/*`
 * to maintain 100% backward compatibility for all existing imports.
 */

export * from "./payroll/index";
