// src/app/manager/layout.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { SidebarItem } from "@/components/layout/Sidebar";
import { useIsManager } from "@/hooks/useIsManager";

const sidebarItems: SidebarItem[] = [
  { label: "Overview", href: "/manager/overview" },
  { label: "Appraisal", href: "/manager/appraisal" },
  { label: "Employee Portal", href: "/employee/dashboard" },
];

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isManager = useIsManager();

  useEffect(() => {
    if (isManager === false) {
      router.replace("/employee/dashboard");
    }
  }, [isManager, router]);

  if (isManager !== true) {
    return <p className="p-6 text-sm text-slate-400">Checking access...</p>;
  }

  return (
    <DashboardLayout sidebarTitle="Manager" sidebarItems={sidebarItems}>
      {children}
    </DashboardLayout>
  );
}