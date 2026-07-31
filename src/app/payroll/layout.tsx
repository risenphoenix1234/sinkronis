// src/app/payroll/layout.tsx
import DashboardLayout from "@/components/layout/DashboardLayout";

const sidebarItems = [
  { label: "Overview", href: "/payroll/overview" },
  {
    label: "Payees",
    href: "/payroll/payees", // ← clicking the group label goes to list
    children: [
      { label: "Active Payee", href: "/payroll/payees/active-payee" },
      { label: "Invite Payee", href: "/payroll/payees/invite-payee" },
      { label: "Payee Group", href: "/payroll/payees/payee-group" },
    ],
  },
  { label: "Payroll", href: "/payroll/payroll" },
  { label: "Pension", href: "/payroll/pension" },
  { label: "Tax", href: "/payroll/tax" },
  { label: "Settings", href: "/payroll/settings" },
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
