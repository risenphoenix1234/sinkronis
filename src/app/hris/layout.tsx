// src/app/hris/layout.tsx
import DashboardLayout from "@/components/layout/DashboardLayout";

import { SidebarItem } from "@/components/layout/Sidebar";

const sidebarItems: SidebarItem[] = [
  {
    label: "Overview",
    href: "/hris/dashboard",
    icon: "overview",
  },
  {
    label: "Employee",
    href: "/hris/employees",
    icon: "hris-employee",
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
    label: "Bank Requests",
    href: "/hris/bank-requests",
    icon: "bank-requests",
  },
  {
    label: "Leave Setup",
    href: "/hris/leave-settings",
    icon: "leave-setup",
  },
];

export default function HRISLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="min-w-0 flex-1 overflow-x-auto">
        <DashboardLayout sidebarTitle="HRIS" sidebarItems={sidebarItems}>
          {children}
        </DashboardLayout>
      </div>
    </div>
  );
}
