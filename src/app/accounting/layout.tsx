// src/app/accounting/layout.tsx
import DashboardLayout from "@/components/layout/DashboardLayout";
import ModuleRail from "@/components/ModuleRail";
import { SidebarItem } from "@/components/layout/Sidebar";

const sidebarItems: SidebarItem[] = [
  {
    label: "Dashboard",
    href: "/accounting/dashboard",
    icon: "dashboard",
  },
  {
    label: "Customer",
    href: "/accounting/clients",
    icon: "customer",
  },
  {
    label: "Items & Services",
    href: "/accounting/items-services",
    icon: "items",
  },
  {
    label: "Projects",
    href: "/accounting/projects",
    icon: "projects",
  },
  {
    label: "Invoices",
    href: "/accounting/invoices",
    icon: "invoices",
  },
  {
    label: "Agents",
    href: "/accounting/agents",
    icon: "agents",
  },
  {
    label: "Payment Requests",
    href: "/accounting/payment-requests",
    icon: "payment",
  },
  {
    label: "Expenses",
    href: "/accounting/expenses",
    icon: "expenses",
  },
  {
    label: "Reminders",
    href: "/accounting/reminders",
    icon: "reminders",
  },
  {
    label: "Reports",
    href: "/accounting/reports",
    icon: "reports",
  },
  {
    label: "Tax",
    href: "/accounting/tax",
    icon: "tax",
  },
  {
    label: "Wallets",
    href: "/accounting/wallets",
    icon: "wallet",
  },
  {
    label: "Settings",
    href: "/accounting/settings",
    icon: "settings",
  },
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