// src/lib/payroll-pension-static.ts
export type Pfa = {
  slug: string;
  name: string;
  initials: string;
  color: string;
  totalAmount: number;
};

export const pfas: Pfa[] = [
  { slug: "access-pensions", name: "Access Pensions Limited", initials: "AP", color: "#F79009", totalAmount: 100000 },
  { slug: "arm-pension-managers", name: "ARM Pension Managers Limited", initials: "ARM", color: "#344054", totalAmount: 100000 },
  { slug: "crusader-sterling-pensions", name: "Crusader Sterling Pensions Limited", initials: "CS", color: "#2E90FA", totalAmount: 100000 },
  { slug: "fcmb-pensions", name: "FCMB Pensions Limited", initials: "FC", color: "#6941C6", totalAmount: 100000 },
  { slug: "zenith-pensions-custodian", name: "Zenith Pensions Custodian Limited", initials: "ZN", color: "#D92D20", totalAmount: 100000 },
  { slug: "trustfund-pensions", name: "Trustfund Pensions Limited", initials: "TF", color: "#12B76A", totalAmount: 100000 },
];

export type PensionRow = {
  id: number;
  employee: string;
  rsaPin: string;
  pensionAmount: number;
  payerContribution: number;
  payeeContribution: number;
};

const employees = ["Lucas Carter", "Olivia White", "James Lee", "Daniel Walker", "David Turner"];

export const pensionRows: PensionRow[] = employees.map((employee, i) => ({
  id: i + 1,
  employee,
  rsaPin: "PEN100012345678",
  pensionAmount: 6000,
  payerContribution: 4000,
  payeeContribution: 2000,
}));
