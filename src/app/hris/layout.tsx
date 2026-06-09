import DashboardLayout from "@/components/layout/DashboardLayout";

const sidebarItems = [
  { label: "Overview", href: "/hris/overview" },
  { label: "Add Employee", href: "/hris/add-employee" },
  { label: "Invite Employee", href: "/hris/invite-employee" },
  { label: "Attendance", href: "/hris/attendance" },
  { label: "Leave Tracking", href: "/hris/leave-tracking" },
  { label: "Appraisal", href: "/hris/appraisal" },
  { label: "Conduct", href: "/hris/conduct" },
  { label: "Settings", href: "/hris/settings" },
];

export default function HRISLayout({ children }: { children: React.ReactNode }) {
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
