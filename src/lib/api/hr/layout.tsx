// src/app/hr/layout.tsx
import DashboardLayout from "@/components/layout/DashboardLayout";

const sidebarItems = [
  { label: "Overview", href: "/hr/overview" },
  { label: "Employee", href: "/hr/employee" },
  { label: "Attendance", href: "/hr/attendance" },
  { label: "Leave Tracking", href: "/hr/leave-tracking" },
  { label: "Appraisal", href: "/hr/appraisal" },
  { label: "Conduct", href: "/hr/conduct" },
  { label: "Settings", href: "/hr/settings" },
];

export default function HRLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout sidebarTitle="HR" sidebarItems={sidebarItems}>
      {children}
    </DashboardLayout>
  );
}
