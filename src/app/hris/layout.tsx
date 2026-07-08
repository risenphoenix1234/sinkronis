// src/app/hris/layout.tsx
import DashboardLayout from "@/components/layout/DashboardLayout";

const sidebarItems = [
  { label: "Overview", href: "/hris/overview" },
  {
    label: "Employee",
    href: "/hris/employees", // ← clicking the group label goes to list
    children: [
      { label: "Add Employee", href: "/hris/employees/add" },
      { label: "Invite Employee", href: "/hris/invite-employee" },
    ],
  },
  { label: "Attendance", href: "/hris/attendance" },
  { label: "Leave Tracking", href: "/hris/leave-tracking" },
  { label: "Appraisal", href: "/hris/appraisal" },
  { label: "Conduct", href: "/hris/conduct" },
  { label: "Settings", href: "/hris/settings" },
];

export default function HRISLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout
      navbarTitle="HRIS"
      sidebarTitle="HRIS"
      sidebarItems={sidebarItems}
    >
      {children}
    </DashboardLayout>
  );
}
