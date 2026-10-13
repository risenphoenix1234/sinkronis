// src/app/payroll/layout.tsx
import DashboardLayout from "@/components/layout/DashboardLayout";
import { PayeeProvider } from "@/context/payroll/PayeeContext";
import { DeductionProvider } from "@/context/payroll/DeductionContext";
import { WalletProvider } from "@/context/payroll/WalletContext";
import type { SidebarItem } from "@/components/layout/Sidebar";

const sidebarItems: SidebarItem[] = [
  { label: "Overview", href: "/payroll/overview", icon: "payroll-dashboard" },
  {
    label: "Payee",
    href: "/payroll/payees",
    icon: "payee",
    children: [
      { label: "Active Payee", href: "/payroll/payees" },
      { label: "Invite Payee", href: "/payroll/invite-payee" },
      { label: "Payee Group", href: "/payroll/payee-groups" },
    ],
  },
  {
    label: "Payroll",
    href: "/payroll/payroll",
    icon: "payruns",
    children: [
      { label: "Create Payroll", href: "/payroll/payroll" },
      { label: "Payroll History", href: "/payroll/pay-runs" },
    ],
  },
  { label: "Payslips", href: "/payroll/payslips", icon: "payslips" },
  { label: "Deductions", href: "/payroll/deductions", icon: "deduction" },
  {
    label: "Pension",
    href: "/payroll/pension",
    icon: "pension",
    children: [
      { label: "Payroll Pension", href: "/payroll/pension" },
      { label: "PFAs", href: "/payroll/pfas" },
    ],
  },
  {
    label: "Tax",
    href: "/payroll/tax",
    icon: "payroll-tax",
    children: [
      { label: "Payroll Tax", href: "/payroll/tax" },
      { label: "Tax Portals", href: "/payroll/tax-portals" },
    ],
  },
  { label: "Wallet", href: "/payroll/wallets", icon: "payroll-wallet" },
];

export default function PayrollLayout({ children }: { children: React.ReactNode }) {
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