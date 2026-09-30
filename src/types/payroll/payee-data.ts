import {
  PayeeType,
  PayeeStatus,
  UnifiedPayee,
} from "./unified-payee";

export type { PayeeType, PayeeStatus, UnifiedPayee };
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
  avatar?: string;
  type: PayeeType;
  role?: string;
  department?: string;
  amount: number;
  status: PayeeStatus;
  onPayroll?: boolean;
  bankName: string;
  bankAccount: string;
  accountName: string;
  taxable: boolean;
  taxType?: "PAYE" | "WHT" | "EXEMPT";
  grossSalary?: number;
  netSalary?: number;
  paymentHistory: PaymentRecord[];
};

export function naira(value: number) {
  return `₦${(value || 0).toLocaleString("en-NG")}`;
}
