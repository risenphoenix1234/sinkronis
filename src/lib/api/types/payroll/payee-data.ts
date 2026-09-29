export type PayeeType = "Director" | "Vendor" | "Board Member" | "Contractor";
export type PayeeStatus = "Active" | "Inactive";
export type PaymentStatus = "Paid" | "Pending" | "Failed";

export type PaymentRecord = {
  period: string;
  amount: number;
  paymentDate: string;
  reference: string;
  status: PaymentStatus;
};

export type Payee = {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: PayeeType;
  amount: number;
  status: PayeeStatus;
  bankName: string;
  bankAccount: string;
  accountName: string;
  taxable: boolean;
  paymentHistory: PaymentRecord[];
};

export function naira(value: number) {
  return `₦${value.toLocaleString("en-NG")}`;
}
