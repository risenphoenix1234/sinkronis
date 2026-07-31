// src/components/layout/DashboardLayout.tsx
import Navbar from "./Navbar";
import Sidebar, { SidebarItem } from "./Sidebar";

interface DashboardLayoutProps {
  navbarTitle: string;
  sidebarTitle: string;
  sidebarItems: SidebarItem[];
  children: React.ReactNode;
}

export default function DashboardLayout({
  navbarTitle,
  sidebarTitle,
  sidebarItems,
  children,
}: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar title={sidebarTitle} items={sidebarItems} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar title={navbarTitle} />
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4">
          <div className="mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}