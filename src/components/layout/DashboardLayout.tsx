// src/components/layout/DashboardLayout.tsx
import type { ReactNode } from "react";

import ModuleRail from "@/components/ModuleRail";
import BrandingTheme from "./BrandingTheme";
import Navbar from "./Navbar";
import Sidebar, { SidebarItem } from "./Sidebar";

interface DashboardLayoutProps {
  sidebarTitle: string;
  sidebarItems: SidebarItem[];
  children: ReactNode;
}

export default function DashboardLayout({
  sidebarTitle,
  sidebarItems,
  children,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <BrandingTheme />

      {/* Full-width top navigation */}
      <Navbar />

      {/* Dashboard body */}
      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Module navigation */}
        <ModuleRail />

        {/* Module sidebar */}
        <Sidebar title={sidebarTitle} items={sidebarItems} />

        {/* Page content */}
        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}