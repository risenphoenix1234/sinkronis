// src/app/hris/layout.tsx
import DashboardLayout from "@/components/layout/DashboardLayout";
import ModuleRail from "@/components/ModuleRail";
import { SidebarItem } from "@/components/layout/Sidebar";

const sidebarItems: SidebarItem[] = [
  {
    label: "Overview",
    href: "/hris/overview",
    icon: "dashboard",
  },
  {
    label: "Employee",
    href: "/hris/employees",
    icon: "users",
    children: [
      {
        label: "Add Employee",
        href: "/hris/employees/add",
      },
      {
        label: "Invite Employee",
        href: "/hris/invite-employee",
      },
    ],
  },
  {
    label: "Attendance",
    href: "/hris/attendance",
    icon: "attendance",
  },
  {
    label: "Leave Tracking",
    href: "/hris/leave-tracking",
    icon: "leave",
  },
  {
    label: "Appraisal",
    href: "/hris/appraisal",
    icon: "appraisal",
  },
  {
    label: "Conduct",
    href: "/hris/conduct",
    icon: "conduct",
  },
  {
    label: "Settings",
    href: "/hris/settings",
    icon: "settings",
  },
];

export default function HRISLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <ModuleRail />

      <div className="min-w-0 flex-1 overflow-x-auto">
        <DashboardLayout
          navbarTitle="HRIS"
          sidebarTitle="HRIS"
          sidebarItems={sidebarItems}
        >
          {children}
        </DashboardLayout>
      </div>
    </div>
  );
}