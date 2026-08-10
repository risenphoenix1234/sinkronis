// src/app/platform-admin/layout.tsx
import DashboardLayout from "@/components/layout/DashboardLayout";
import ModuleRail from "@/components/ModuleRail";
import { SidebarItem } from "@/components/layout/Sidebar";

const sidebarItems: SidebarItem[] = [
  {
    label: "Dashboard",
    href: "/platform-admin/overview",
    icon: "dashboard",
  },
  {
    label: "Tenants",
    href: "/platform-admin/tenants",
    icon: "tenants",
  },
  {
    label: "Pricing & Plans",
    href: "/platform-admin/plans",
    icon: "pricing",
  },
  {
    label: "Billing & Revenue",
    href: "/platform-admin/billing",
    icon: "billing",
  },
  {
    label: "Users",
    href: "/platform-admin/users",
    icon: "users",
  },
  {
    label: "Modules",
    href: "/platform-admin/modules",
    icon: "modules",
  },
  {
    label: "Analytics",
    href: "/platform-admin/analytics",
    icon: "analytics",
  },
  {
    label: "Support",
    href: "/platform-admin/support",
    icon: "support",
  },
  {
    label: "Settings",
    href: "/platform-admin/settings",
    icon: "settings",
  },
];

export default function PlatformAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <ModuleRail />

      <div className="min-w-0 flex-1 overflow-x-auto">
        <DashboardLayout
          navbarTitle="Platform Admin"
          sidebarTitle="Platform Admin"
          sidebarItems={sidebarItems}
        >
          {children}
        </DashboardLayout>
      </div>
    </div>
  );
}