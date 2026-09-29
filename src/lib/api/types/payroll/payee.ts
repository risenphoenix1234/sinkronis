export type PayeeTab = "Active Payee" | "Inactive Payee" | "Pending Payee";
export type Group = "Permanent" | "Contract";

export interface Payee {
  id: number;
  name: string;
  email: string;
  phone: string;
  group: Group;
}
