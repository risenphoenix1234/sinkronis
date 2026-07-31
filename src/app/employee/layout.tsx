// src/app/employee/layout.tsx
import DashboardLayout from "@/components/layout/DashboardLayout";

const sidebarItems = [
  { label: "My Dashboard", href: "/employee/dashboard" },
  { label: "My Profile", href: "/employee/profile" },
  { label: "My Attendance", href: "/employee/attendance" },
  { label: "My Leave", href: "/employee/leave" },
  { label: "My Appraisal", href: "/employee/appraisal" },
  { label: "My Inbox", href: "/employee/inbox" },
];

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout
      navbarTitle="Employee"
      sidebarTitle="Employee"
      sidebarItems={sidebarItems}
    >
      {children}
    </DashboardLayout>
  );
}
