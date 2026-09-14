// src/app/employee/layout.tsx
import DashboardLayout from "@/components/layout/DashboardLayout";

const sidebarItems = [
  { label: "Overview", href: "/employee/overview" },
  { label: "Attendance", href: "/employee/attendance" },
  { label: "Leave Tracking", href: "/employee/leave-tracking" },
  { label: "Appraisal", href: "/employee/appraisal" },
  { label: "Conduct", href: "/employee/conduct" },
  { label: "Settings", href: "/employee/settings" },
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
