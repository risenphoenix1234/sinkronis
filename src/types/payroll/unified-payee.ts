// src/types/payroll/unified-payee.ts

export type PayeeType =
  | "Permanent"
  | "Contract"
  | "Consultant"
  // Legacy aliases for backward compatibility during prototype migration
  | "Employee"
  | "Contractor"
  | "Vendor"
  | "Director"
  | "Board Member";

export type EmploymentType =
  | "Full-time"
  | "Part-time"
  | "Contract"
  | "Retainer"
  | "N/A";

export type PayeeStatus = "Active" | "Inactive" | "On Leave" | "Suspended";

export type TaxStatus = "PAYE" | "WHT" | "None" | "EXEMPT";
export type TaxType = "PAYE" | "WHT" | "EXEMPT";

export type NigerianState =
  | "Lagos"
  | "Abuja (FCT)"
  | "Rivers"
  | "Kano"
  | "Ogun"
  | "Oyo"
  | "Kaduna"
  | "Edo"
  | "Enugu"
  | "Delta"
  | string;

export interface OtherAllowance {
  name: string;
  amount: number;
  taxable: boolean;
}

export interface CustomDeduction {
  id: string;
  name: string;
  amount: number;
}

export interface PayeeLoan {
  id: string;
  name: string;
  totalAmount: number;
  monthlyDeduction: number;
  balanceRemaining: number;
  status: "Active" | "Completed" | "Paused";
}

export interface BIKBenefit {
  hmo?: number;
  airtime?: number;
  lunch?: number;
  thirteenthMonth?: number;
}

export interface StatutoryIds {
  tin?: string;
  pensionPin?: string;
  pfaName?: string;
  nhfNumber?: string;
}

export interface PayeeDeductionBreakdown {
  paye: number;
  wht?: number;
  employeePension: number;
  employerPension: number;
  nhf: number;
  nsitf: number;
  customDeductions: CustomDeduction[];
  loans?: PayeeLoan[];
  totalDeductions: number;
}

export interface PayeePaymentRecord {
  period: string;
  amount: number;
  paymentDate: string;
  reference: string;
  status: "Paid" | "Pending" | "Failed";
}

export interface UnifiedPayee {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  type: PayeeType;
  role: string;
  department?: string; // Optional/legacy
  dateOnboarded: string; // Required date added/onboarded
  joinDate?: string; // Legacy fallback
  employmentType: EmploymentType;
  status: PayeeStatus;
  onPayroll: boolean;
  stateOfResidence: NigerianState;
  bankName: string;
  bankAccount: string;
  accountName: string;
  taxStatus: TaxStatus;
  taxable: boolean;
  taxType?: TaxType;

  // Earnings
  grossSalary: number;
  basicSalary?: number;
  housingAllowance?: number;
  transportAllowance?: number;
  otherAllowance?: number;
  otherAllowances?: OtherAllowance[];
  bik?: BIKBenefit;

  // Statutory & deductions
  statutory?: StatutoryIds;
  deductions: PayeeDeductionBreakdown;
  loans?: PayeeLoan[];
  netSalary: number;

  paymentHistory: PayeePaymentRecord[];
}

export function formatNaira(value: number): string {
  return `₦${(value || 0).toLocaleString("en-NG")}`;
}

export function normalizePayeeType(
  raw?: string,
): "Permanent" | "Contract" | "Consultant" {
  if (!raw) return "Permanent";
  const lower = raw.toLowerCase();
  if (lower === "contract" || lower === "contractor" || lower === "vendor") {
    return "Contract";
  }
  if (
    lower === "consultant" ||
    lower === "director" ||
    lower === "board member"
  ) {
    return "Consultant";
  }
  return "Permanent";
}

export function getDefaultTaxStatus(
  type: "Permanent" | "Contract" | "Consultant",
): TaxStatus {
  switch (type) {
    case "Contract":
      return "WHT";
    case "Consultant":
      return "None";
    case "Permanent":
    default:
      return "PAYE";
  }
}

/**
 * Calculates statutory deductions & PAYE based on Sinkronis Payroll spec:
 * - Permanent:
 *     - CRA: max(₦200,000, 1% of Gross) + 20% of Gross
 *     - PIT Act Brackets: 0%, 15%, 18%, 21%, 23%, 25%
 *     - Pension: 8% employee, 10% employer (Basic + Housing + Transport)
 *     - NHF: 2.5% of Basic
 *     - NSITF: 1% employer
 * - Contract:
 *     - Fixed 5% Withholding Tax (WHT)
 * - Consultant:
 *     - No Tax (0%)
 */
export function calculatePayeeDeductions(data: {
  type: PayeeType;
  grossSalary: number;
  basicSalary?: number;
  housingAllowance?: number;
  transportAllowance?: number;
  otherAllowance?: number;
  taxStatus?: TaxStatus;
  taxable?: boolean;
  customDeductions?: CustomDeduction[];
  loans?: PayeeLoan[];
}): { deductions: PayeeDeductionBreakdown; netSalary: number } {
  const normType = normalizePayeeType(data.type);
  const {
    grossSalary,
    basicSalary = 0,
    housingAllowance = 0,
    transportAllowance = 0,
    taxable = true,
  } = data;

  const taxStatus = data.taxStatus || getDefaultTaxStatus(normType);
  const custom = data.customDeductions || [];
  const customSum = custom.reduce((sum, item) => sum + item.amount, 0);
  const loans = data.loans || [];
  const loanSum = loans
    .filter((l) => l.status === "Active")
    .reduce((sum, item) => sum + item.monthlyDeduction, 0);

  // 1. Consultant: No Tax (0%)
  if (normType === "Consultant" || taxStatus === "None") {
    const totalDeductions = customSum + loanSum;
    const netSalary = Math.max(0, grossSalary - totalDeductions);
    return {
      deductions: {
        paye: 0,
        wht: 0,
        employeePension: 0,
        employerPension: 0,
        nhf: 0,
        nsitf: 0,
        customDeductions: custom,
        loans,
        totalDeductions,
      },
      netSalary,
    };
  }

  // 2. Contract: 5% Withholding Tax (WHT)
  if (normType === "Contract" || taxStatus === "WHT") {
    const wht = taxable !== false ? Math.round(grossSalary * 0.05) : 0;
    const totalDeductions = wht + customSum + loanSum;
    const netSalary = Math.max(0, grossSalary - totalDeductions);
    return {
      deductions: {
        paye: 0,
        wht,
        employeePension: 0,
        employerPension: 0,
        nhf: 0,
        nsitf: 0,
        customDeductions: custom,
        loans,
        totalDeductions,
      },
      netSalary,
    };
  }

  // 3. Permanent: Full PAYE + Pension + NHF
  const pensionable = basicSalary + housingAllowance + transportAllowance;
  const employeePension = Math.round(pensionable * 0.08);
  const employerPension = Math.round(pensionable * 0.1);
  const nhf = Math.round(basicSalary * 0.025);
  const nsitf = Math.round(grossSalary * 0.01);

  let paye = 0;
  if (taxable !== false && taxStatus === "PAYE") {
    const annualGross = grossSalary * 12;
    const annualPension = employeePension * 12;
    const annualNHF = nhf * 12;
    const cra = Math.max(200000, annualGross * 0.01) + annualGross * 0.2;
    let taxableIncome = Math.max(
      0,
      annualGross - cra - annualPension - annualNHF,
    );

    let annualTax = 0;
    const bands = [
      { limit: 800000, rate: 0 },
      { limit: 1400000, rate: 0.15 },
      { limit: 6800000, rate: 0.18 },
      { limit: 4000000, rate: 0.21 },
      { limit: 12000000, rate: 0.23 },
      { limit: Infinity, rate: 0.25 },
    ];

    for (const band of bands) {
      if (taxableIncome <= 0) break;
      const portion = Math.min(taxableIncome, band.limit);
      annualTax += portion * band.rate;
      taxableIncome -= portion;
    }

    paye = Math.round(annualTax / 12);
  }

  const totalDeductions =
    paye + employeePension + nhf + customSum + loanSum;
  const netSalary = Math.max(0, grossSalary - totalDeductions);

  return {
    deductions: {
      paye,
      wht: 0,
      employeePension,
      employerPension,
      nhf,
      nsitf,
      customDeductions: custom,
      loans,
      totalDeductions,
    },
    netSalary,
  };
}
