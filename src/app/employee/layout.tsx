// src/app/employee/layout.tsx
"use client";

import { usePathname } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { SidebarItem } from "@/components/layout/Sidebar";
import { useIsManager } from "@/hooks/useIsManager";

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
  { label: "My Payslip", href: "/employee/payslip", icon: "payslips" },
  { label: "My Inbox", href: "/employee/inbox", icon: "inbox" },
];

const managerPortalItem: SidebarItem = {
  label: "Manager Portal",
  href: "/manager/overview",
  icon: "manager" 
};

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/employee/login";
  const isManager = useIsManager(!isLogin);

  if (isLogin) {
    return <>{children}</>;
  }

  const items = isManager ? [...sidebarItems, managerPortalItem] : sidebarItems;

  return (
    <DashboardLayout sidebarTitle="Employee" sidebarItems={items}>
      {children}
    </DashboardLayout>
  );
}