import type { ReactNode } from "react";

<<<<<<< HEAD
import DashboardLayout from "@/components/layout/DashboardLayout";
import { SidebarItem } from "@/components/layout/Sidebar";
import { DeductionProvider } from "@/context/payroll/DeductionContext";
import { PayeeProvider } from "@/context/payroll/PayeeContext";
import { WalletProvider } from "@/context/payroll/WalletContext";

const sidebarItems: SidebarItem[] = [
  {
    label: "Dashboard",
    href: "/payroll/dashboard",
    icon: "payroll-dashboard",
  },
  {
    label: "Employees",
    href: "/payroll/employees",
    icon: "employee",
  },
  {
    label: "Payees",
    href: "/payroll/payees",
    icon: "payee",
  },
  {
    label: "Pay Runs",
    href: "/payroll/pay-runs",
    icon: "payruns",
  },
  {
    label: "Payslips",
    href: "/payroll/payslips",
    icon: "payslips",
  },
  {
    label: "Deductions",
    href: "/payroll/deductions",
    icon: "deduction",
  },
  {
    label: "Wallets",
    href: "/payroll/wallets",
    icon: "payroll-wallet",
  },
  {
    label: "Tax (PAXE)",
    href: "/payroll/tax",
    icon: "payroll-tax",
  },
  {
    label: "Pension",
    href: "/payroll/pension",
    icon: "pension",
  },
  {
    label: "Reports",
    href: "/payroll/reports",
    icon: "payroll-reports",
  },
=======
const sidebarItems = [
  { label: "Overview", href: "/payroll/overview" },
  { label: "Payees", href: "/payroll/payees" },
  { label: "Payroll", href: "/payroll/payroll" },
  { label: "Pension", href: "/payroll/pension" },
  { label: "Tax", href: "/payroll/tax" },
  { label: "Settings", href: "/payroll/settings" },
>>>>>>> origin/platform-admin
];

interface PayrollLayoutProps {
  children: ReactNode;
}

export default function PayrollLayout({ children }: PayrollLayoutProps) {
  return (
    <PayeeProvider>
      <DeductionProvider>
        <WalletProvider>
          <DashboardLayout sidebarTitle="Payroll" sidebarItems={sidebarItems}>
            {children}
          </DashboardLayout>
        </WalletProvider>
      </DeductionProvider>
    </PayeeProvider>
  );
}
