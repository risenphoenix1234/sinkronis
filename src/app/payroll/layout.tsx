// src/app/payroll/layout.tsx
import DashboardLayout from "@/components/layout/DashboardLayout";

const sidebarItems = [
  { label: "Dashboard", href: "/payroll/dashboard" },
  {
    label: "Employees",
    href: "/payroll/employees",
  },

  { label: "Payees", href: "/payroll/payees" },
  { label: "Pay Runs", href: "/payroll/pay-runs" },

  { label: "Payslips", href: "/payroll/payslips" },
  { label: "Deductions", href: "/payroll/deductions" },
  { label: "Wallets", href: "/payroll/wallets" },

  { label: "Tax (PAXE)", href: "/payroll/tax" },
  { label: "Pension", href: "/payroll/pension" },
  { label: "Reports", href: "/payroll/reports" },
  { label: "Settings", href: "/payroll/setting" },
];

export default function PayrollLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout
      navbarTitle="Payroll"
      sidebarTitle="Payroll"
      sidebarItems={sidebarItems}
    >
      {children}
    </DashboardLayout>
  );
}
