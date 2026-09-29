import type { ReactNode } from "react";

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
    icon: "employees",
  },
  {
    label: "Payees",
    href: "/payroll/payees",
    icon: "payees",
  },
  {
    label: "Pay Runs",
    href: "/payroll/pay-runs",
    icon: "pay-runs",
  },
  {
    label: "Payslips",
    href: "/payroll/payslips",
    icon: "payslips",
  },
  {
    label: "Deductions",
    href: "/payroll/deductions",
    icon: "deductions",
  },
  {
    label: "Wallet",
    href: "/payroll/wallets",
    icon: "wallets",
  },
  {
    label: "Tax (PAYE)",
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
  {
    label: "Settings",
    href: "/payroll/settings",
    icon: "payroll-settings",
  },
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
