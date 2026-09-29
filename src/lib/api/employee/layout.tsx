// src/app/employee/layout.tsx
"use client";

import { usePathname } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { SidebarItem } from "@/components/layout/Sidebar";

const sidebarItems: SidebarItem[] = [
  {
    label: "My Dashboard",
    href: "/employee/dashboard",
    icon: "dashboard",
  },
  { label: "My Profile", href: "/employee/profile", icon: "profile" },
  {
    label: "My Attendance",
    href: "/employee/attendance",
    icon: "attendance",
  },
  { label: "My Leave", href: "/employee/leave", icon: "leave" },
  {
    label: "My Appraisal",
    href: "/employee/appraisal",
    icon: "appraisal",
  },
  { label: "My Payslip", href: "/employee/payslip", icon: "payslip" },
  { label: "My Inbox", href: "/employee/inbox", icon: "inbox" },
];

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === "/employee/login") {
    return <>{children}</>;
  }

  return (
    <DashboardLayout sidebarTitle="Employee" sidebarItems={sidebarItems}>
      {children}
    </DashboardLayout>
  );
}
