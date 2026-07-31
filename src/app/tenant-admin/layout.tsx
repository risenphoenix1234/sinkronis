// src/app/tenant-admin/layout.tsx
import DashboardLayout from "@/components/layout/DashboardLayout";
import ModuleRail from "@/components/ModuleRail";

const sidebarItems = [
  { label: "Overview", href: "/tenant-admin/overview" },
  {
    label: "Organisation",
    href: "/tenant-admin/organisation",
    children: [
      {
        label: "Company",
        href: "/tenant-admin/organisation/company-profile",
      },
      {
        label: "Departments",
        href: "/tenant-admin/organisation/departments",
      },
      {
        label: "Branches & Locations",
        href: "/tenant-admin/organisation/branches-locations",
      },
      {
        label: "Work Schedule",
        href: "/tenant-admin/organisation/work-schedule",
      },
    ],
  },
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
    <div className="flex h-screen overflow-hidden">
      <ModuleRail />
      <div className="min-w-0 flex-1 overflow-x-auto">
        <DashboardLayout
          navbarTitle="Tenant Admin"
          sidebarTitle="Tenant Admin"
          sidebarItems={sidebarItems}
        >
          {children}
        </DashboardLayout>
      </div>
    </div>
  );
}