// src/app/accounting/layout.tsx
import DashboardLayout from "@/components/layout/DashboardLayout";
import ModuleRail from "@/components/ModuleRail";

const sidebarItems = [
  { label: "Dashboard", href: "/accounting/dashboard" },
  { label: "Customer", href: "/accounting/clients" },
  { label: "Items & Services", href: "/accounting/items-services" },
  { label: "Projects", href: "/accounting/projects" },
  { label: "Invoices", href: "/accounting/invoices" },
  { label: "Agents", href: "/accounting/agents" },
  { label: "Payment Requests", href: "/accounting/payment-requests" },
  { label: "Expenses", href: "/accounting/expenses" },
  { label: "Reminders", href: "/accounting/reminders" },
  { label: "Reports", href: "/accounting/reports" },
  { label: "Tax", href: "/accounting/tax" },
  { label: "Wallets", href: "/accounting/wallets" },
  { label: "Settings", href: "/accounting/settings" },
];

export default function AccountingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <ModuleRail />
      <div className="min-w-0 flex-1 overflow-x-auto">
        <DashboardLayout
          navbarTitle="Accounting"
          sidebarTitle="Accounting"
          sidebarItems={sidebarItems}
        >
          {children}
        </DashboardLayout>
      </div>
    </div>
  );
}