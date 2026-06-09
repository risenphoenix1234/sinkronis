// src/app/tenant-admin/layout.tsx
import DashboardLayout from "@/components/layout/DashboardLayout";

const sidebarItems = [
  { label: "Overview", href: "/tenant-admin/overview" },
  { label: "Organisation", href: "/tenant-admin/organisation" },
  { label: "User Management", href: "/tenant-admin/user-management" },
  { label: "Roles & Permissions", href: "/tenant-admin/roles-permissions" },
  { label: "Modules", href: "/tenant-admin/modules" },
  { label: "Security", href: "/tenant-admin/security" },
  { label: "My Plan", href: "/tenant-admin/my-plan" },
  { label: "Audit Log", href: "/tenant-admin/audit-log" },
  { label: "Notifications", href: "/tenant-admin/notifications" },
  { label: "General Settings", href: "/tenant-admin/general-settings" },
  { label: "Settings", href: "/tenant-admin/settings" },
];

export default function TenantAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout
      navbarTitle="Tenant Admin"
      sidebarTitle="Tenant Admin"
      sidebarItems={sidebarItems}
    >
      {children}
    </DashboardLayout>
  );
}
