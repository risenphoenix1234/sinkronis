// src/data/payroll/unified-payee-data.ts

import {
  UnifiedPayee,
  normalizePayeeType,
  getDefaultTaxStatus,
  calculatePayeeDeductions,
} from "@/types/payroll/unified-payee";
import rawPayees from "./unified-payees.json";

function normalizeRawPayee(p: any): UnifiedPayee {
  const normType = normalizePayeeType(p.type);
  const taxStatus = p.taxStatus || getDefaultTaxStatus(normType);
  const dateOnboarded = p.dateOnboarded || p.joinDate || "2024-01-15";

  // Recalculate deductions to ensure 5% WHT or 0% tax or PAYE
  const calc = calculatePayeeDeductions({
    type: normType,
    grossSalary: p.grossSalary,
    basicSalary: p.basicSalary,
    housingAllowance: p.housingAllowance,
    transportAllowance: p.transportAllowance,
    otherAllowance: p.otherAllowance,
    taxStatus,
    taxable: p.taxable,
    customDeductions: p.deductions?.customDeductions,
    loans: p.loans,
  });

  return {
    ...p,
    type: normType,
    taxStatus,
    dateOnboarded,
    joinDate: dateOnboarded,
    deductions: calc.deductions,
    netSalary: calc.netSalary,
  };
}

export const initialUnifiedPayees: UnifiedPayee[] = (rawPayees as any[]).map(
  normalizeRawPayee,
);

const STORAGE_KEY = "sinkronis_payroll_unified_payees_v2";

export function loadUnifiedPayees(): UnifiedPayee[] {
  if (typeof window === "undefined") {
    return initialUnifiedPayees;
  }
  try {
    const item = window.localStorage.getItem(STORAGE_KEY);
    if (!item) {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(initialUnifiedPayees),
      );
      return initialUnifiedPayees;
    }
    const parsed = JSON.parse(item);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map(normalizeRawPayee);
    }
  } catch {
    // ignore json error
  }
  return initialUnifiedPayees;
}

export function saveUnifiedPayees(payees: UnifiedPayee[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payees));
  } catch {
    // ignore
  }
}
