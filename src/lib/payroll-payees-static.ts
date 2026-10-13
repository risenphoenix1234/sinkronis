// src/lib/payroll-payees-static.ts
export type PayeeStatus = "Active" | "Inactive";

export type StaticPayee = {
  id: string;
  name: string;
  email: string;
  phone: string;
  group: string;
  status: PayeeStatus;
};

export const staticPayees: StaticPayee[] = [
  { id: "p1", name: "Adaeze Okafor", email: "adaeze.okafor@company.com", phone: "08031234567", group: "Permanent Staff", status: "Active" },
  { id: "p2", name: "Ibrahim Musa", email: "ibrahim.musa@company.com", phone: "08029876543", group: "Permanent Staff", status: "Active" },
  { id: "p3", name: "Chinedu Eze", email: "chinedu.eze@company.com", phone: "07035551122", group: "Contract (Pensionable)", status: "Active" },
  { id: "p4", name: "Funke Adeyemi", email: "funke.adeyemi@company.com", phone: "09012345678", group: "Contract (Regular)", status: "Active" },
  { id: "p5", name: "Tunde Bakare", email: "tunde.bakare@company.com", phone: "08157778899", group: "Consultant", status: "Inactive" },
];
