// src/lib/payroll-payee-groups-static.ts
export type Flag = "Enabled" | "Disabled";

export type GroupRow = {
  slug: string;
  name: string;
  employees: number;
  tax: Flag;
  pension: Flag;
  nsitf: Flag;
  pensionRemit: Flag;
  salaryBreakdown: Flag;
  nhf: Flag;
  nhfRemit: Flag;
};

export const groupRows: GroupRow[] = [
  { slug: "permanent", name: "Permanent", employees: 14, tax: "Enabled", pension: "Enabled", nsitf: "Disabled", pensionRemit: "Disabled", salaryBreakdown: "Enabled", nhf: "Disabled", nhfRemit: "Disabled" },
  { slug: "contract-pensionable", name: "Contract (Pensionable)", employees: 20, tax: "Disabled", pension: "Disabled", nsitf: "Disabled", pensionRemit: "Disabled", salaryBreakdown: "Disabled", nhf: "Disabled", nhfRemit: "Disabled" },
  { slug: "contract-regular", name: "Contract (Regular)", employees: 20, tax: "Disabled", pension: "Disabled", nsitf: "Disabled", pensionRemit: "Disabled", salaryBreakdown: "Disabled", nhf: "Disabled", nhfRemit: "Disabled" },
  { slug: "consultant", name: "Consultant", employees: 3, tax: "Disabled", pension: "Disabled", nsitf: "Disabled", pensionRemit: "Disabled", salaryBreakdown: "Disabled", nhf: "Disabled", nhfRemit: "Disabled" },
];

export type SelectField = { key: string; label: string; options: string[]; value: string };
export type RateField = { key: string; label: string; value: string };
export type SplitItem = { id: number; name: string; percent: string };

export type BreakdownConfig = {
  title: string;
  items: SplitItem[];
  rates: RateField[];
  selects: SelectField[];
};

const onOff = ["Enabled", "Disabled"];
const pensionOptions = ["Employer Pension (10%)", "Employee Pension (8%)"];

export const breakdowns: Record<string, BreakdownConfig> = {
  permanent: {
    title: "Permanent Staff Salary Breakdown",
    items: [
      { id: 1, name: "Basic Salary", percent: "60" },
      { id: 2, name: "Housing", percent: "30" },
      { id: 3, name: "Transport", percent: "20" },
    ],
    rates: [],
    selects: [
      { key: "tax", label: "Payroll Tax", options: onOff, value: "Enabled" },
      { key: "nsitf", label: "Payroll NSITF Contribution", options: onOff, value: "Disabled" },
      { key: "nhf", label: "Payroll NHF Contribution", options: onOff, value: "Disabled" },
      { key: "pension", label: "Payroll Pension", options: pensionOptions, value: "Employer Pension (10%)" },
      { key: "itf", label: "Payroll ITF Contribution", options: onOff, value: "Disabled" },
    ],
  },
  "contract-pensionable": {
    title: "Contract (Pensionable) Salary Breakdown",
    items: [
      { id: 1, name: "Basic Salary", percent: "60" },
      { id: 2, name: "Housing", percent: "30" },
      { id: 3, name: "Transport", percent: "20" },
    ],
    rates: [{ key: "wht", label: "Withholding Tax", value: "10" }],
    selects: [
      { key: "itf", label: "Payroll ITF Contribution", options: onOff, value: "Disabled" },
      { key: "nsitf", label: "Payroll NSITF Contribution", options: onOff, value: "Disabled" },
      { key: "pension", label: "Payroll Pension", options: pensionOptions, value: "Employer Pension (10%)" },
    ],
  },
  "contract-regular": {
    title: "Contract (Regular) Salary Breakdown",
    items: [],
    rates: [{ key: "wht", label: "Withholding Tax", value: "10" }],
    selects: [],
  },
  consultant: {
    title: "Consultant Salary Breakdown",
    items: [],
    rates: [
      { key: "wht", label: "Withholding Tax", value: "10" },
      { key: "vat", label: "VAT", value: "7.5" },
    ],
    selects: [],
  },
};

const CUSTOM_KEY = "payroll-custom-payee-groups";

export type CustomGroup = GroupRow & { breakdown: BreakdownConfig };

export function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function loadCustomGroups(): CustomGroup[] {
  try {
    const raw = sessionStorage.getItem(CUSTOM_KEY);
    return raw ? (JSON.parse(raw) as CustomGroup[]) : [];
  } catch {
    return [];
  }
}

export function saveCustomGroups(groups: CustomGroup[]) {
  try {
    sessionStorage.setItem(CUSTOM_KEY, JSON.stringify(groups));
  } catch {
    return;
  }
}

export function newGroupTemplate(): BreakdownConfig {
  return {
    title: "New Payee Group",
    items: [],
    rates: [
      { key: "wht", label: "Withholding Tax", value: "" },
      { key: "vat", label: "VAT", value: "" },
    ],
    selects: [
      { key: "tax", label: "Payroll Tax", options: onOff, value: "Disabled" },
      { key: "pension", label: "Payroll Pension", options: ["Disabled", ...pensionOptions], value: "Disabled" },
      { key: "pensionRemit", label: "Pension Remittance", options: onOff, value: "Disabled" },
      { key: "nsitf", label: "Payroll NSITF Contribution", options: onOff, value: "Disabled" },
      { key: "nhf", label: "Payroll NHF Contribution", options: onOff, value: "Disabled" },
      { key: "nhfRemit", label: "NHF Remittance", options: onOff, value: "Disabled" },
      { key: "itf", label: "Payroll ITF Contribution", options: onOff, value: "Disabled" },
    ],
  };
}

export function defaultBreakdown(name: string): BreakdownConfig {
  return { ...newGroupTemplate(), title: `${name} Salary Breakdown` };
}

function flag(selects: SelectField[], key: string): Flag {
  const v = selects.find((s) => s.key === key)?.value ?? "Disabled";
  return v === "Disabled" ? "Disabled" : "Enabled";
}

export function rowFromConfig(name: string, employees: number, cfg: BreakdownConfig): GroupRow {
  return {
    slug: slugify(name),
    name,
    employees,
    tax: flag(cfg.selects, "tax"),
    pension: flag(cfg.selects, "pension"),
    nsitf: flag(cfg.selects, "nsitf"),
    pensionRemit: flag(cfg.selects, "pensionRemit"),
    salaryBreakdown: cfg.items.length > 0 ? "Enabled" : "Disabled",
    nhf: flag(cfg.selects, "nhf"),
    nhfRemit: flag(cfg.selects, "nhfRemit"),
  };
}