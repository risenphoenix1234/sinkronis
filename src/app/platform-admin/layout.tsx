// src/app/platform-admin/layout.tsx
import DashboardLayout from "@/components/layout/DashboardLayout";
import ModuleRail from "@/components/ModuleRail";

const sidebarItems = [
  { label: "Overview", href: "/platform-admin/overview" },
  { label: "Profile", href: "/platform-admin/profile" },
  { label: "Users", href: "/platform-admin/users" },
  { label: "Plans", href: "/platform-admin/plans" },
  { label: "Wallet", href: "/platform-admin/wallet" },
  { label: "Settings", href: "/platform-admin/settings" },
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