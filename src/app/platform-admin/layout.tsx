// src/app/platform-admin/layout.tsx
import DashboardLayout from "@/components/layout/DashboardLayout";

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
    <DashboardLayout
      navbarTitle="Platform Admin"
      sidebarTitle="Platform Admin"
      sidebarItems={sidebarItems}
    >
      {children}
    </DashboardLayout>
  );
}
