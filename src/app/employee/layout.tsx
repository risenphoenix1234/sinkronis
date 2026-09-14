// src/app/employee/layout.tsx
import DashboardLayout from "@/components/layout/DashboardLayout";
import { SidebarItem } from "@/components/layout/Sidebar";

const sidebarItems: SidebarItem[] = [
  {
    label: "My Dashboard",
    href: "/employee/dashboard",
    icon: "employee-dashboard",
  },
  { label: "My Profile", href: "/employee/profile", icon: "profile" },
  {
    label: "My Attendance",
    href: "/employee/attendance",
    icon: "employee-attendance",
  },
  { label: "My Leave", href: "/employee/leave", icon: "employee-leave" },
  {
    label: "My Appraisal",
    href: "/employee/appraisal",
    icon: "employee-appraisal",
  },
  { label: "My Payslip", href: "/employee/payslip", icon: "payslips" },

  { label: "My Inbox", href: "/employee/inbox", icon: "inbox" },
];

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout sidebarTitle="Employee" sidebarItems={sidebarItems}>
      {children}
    </DashboardLayout>
  );
}
