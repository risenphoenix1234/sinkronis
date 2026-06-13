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
    <div className="flex min-h-screen">
      <Sidebar title={sidebarTitle} items={sidebarItems} />
      <div className="flex flex-1 flex-col">
        <Navbar title={navbarTitle} />
        <main className="flex-1 bg-slate-50 p-4">
          <div className="mx-auto ">{children}</div>
        </main>
      </div>
    </div>
  );
}
