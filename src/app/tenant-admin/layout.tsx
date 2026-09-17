// src/app/tenant-admin/layout.tsx
import DashboardLayout from "@/components/layout/DashboardLayout";

import { SidebarItem } from "@/components/layout/Sidebar";

const sidebarItems: SidebarItem[] = [
  {
    label: "Overview",
    href: "/tenant-admin/overview",
    icon: "dashboard",
  },
  {
    label: "Organisation",
    href: "/tenant-admin/organisation",
    icon: "organisation",
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
  {
    label: "User Management",
    href: "/tenant-admin/user-management",
    icon: "users",
  },
  {
    label: "Roles & Permissions",
    href: "/tenant-admin/roles-permissions",
    icon: "permissions",
  },
  {
    label: "Modules",
    href: "/tenant-admin/modules",
    icon: "modules",
  },
  {
    label: "Security",
    href: "/tenant-admin/security",
    icon: "security",
  },
  {
    label: "My Plan",
    href: "/tenant-admin/my-plan",
    icon: "pricing",
  },
  {
    label: "Audit Log",
    href: "/tenant-admin/audit-log",
    icon: "audit",
  },
  {
    label: "Notifications",
    href: "/tenant-admin/notifications-alerts",
    icon: "notifications",
  },
  // {
  //   label: "Settings",
  //   href: "/tenant-admin/general-settings",
  //   icon: "settings",
  // },
];

export default function TenantAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="min-w-0 flex-1 overflow-x-auto">
        <DashboardLayout
          sidebarTitle="Tenant Admin"
          sidebarItems={sidebarItems}
        >
          {children}
        </DashboardLayout>
      </div>
    </div>
  );
}