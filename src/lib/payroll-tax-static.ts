// src/lib/payroll-tax-static.ts
export type TaxState = {
  slug: string;
  name: string;
  initials: string;
  color: string;
};

const names = [
  "Abia","Adamawa","Akwa-Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara",
];

const palette = ["#2183C6", "#12B76A", "#F79009", "#6941C6", "#D92D20", "#344054"];

const toSlug = (n: string) => n.toLowerCase().replace(/\s+/g, "-");

export const allStates: TaxState[] = names.map((n, i) => ({
  slug: toSlug(n),
  name: `${n} State`,
  initials: n.replace(/-/g, " ").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
  color: palette[i % palette.length],
}));

export const payrollTaxStates: TaxState[] = ["Lagos", "Ondo", "Osun", "Oyo", "Kwara"]
  .map((n) => allStates.find((s) => s.slug === toSlug(n)))
  .filter((s): s is TaxState => Boolean(s));

export type TaxRow = {
  id: number;
  employee: string;
  taxId: string;
  grossSalary: number;
  taxAmount: number;
};

const employees = ["Lucas Carter", "Olivia White", "James Lee", "Daniel Walker", "David Turner"];

export const taxRows: TaxRow[] = employees.map((employee, i) => ({
  id: i + 1,
  employee,
  taxId: "TIN1000123456",
  grossSalary: 150000,
  taxAmount: 10000,
}));
