// src/app/manager/layout.tsx
import DashboardLayout from "@/components/layout/DashboardLayout";

const sidebarItems = [
  { label: "Overview", href: "/manager/overview" },
  { label: "Reportees", href: "/manager/reportees" },
  { label: "Attendance", href: "/manager/attendance" },
  { label: "Leave Tracking", href: "/manager/leave-tracking" },
  { label: "Appraisal", href: "/manager/appraisal" },
  { label: "Conduct", href: "/manager/conduct" },
  { label: "Settings", href: "/manager/settings" },
];

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout
      sidebarTitle="Manager"
      sidebarItems={sidebarItems}
    >
      {children}
    </DashboardLayout>
  );
}
