// components/ModuleRail.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiSettings, FiUsers, FiDollarSign, FiGrid } from "react-icons/fi";

type ModuleKey = "tenant-admin" | "accounting" | "hris" | "platform-admin";

const modules: { key: ModuleKey; href: string; icon: React.ReactNode; label: string }[] = [
  { key: "tenant-admin", href: "/tenant-admin/overview", icon: <FiSettings size={18} />, label: "Tenant Admin" },
  { key: "accounting", href: "/accounting/dashboard", icon: <FiDollarSign size={18} />, label: "Accounting" },
  { key: "hris", href: "/hris/overview", icon: <FiUsers size={18} />, label: "HRIS" },
  { key: "platform-admin", href: "/platform-admin/overview", icon: <FiGrid size={18} />, label: "Platform Admin" },
];

function getActiveModule(pathname: string): ModuleKey | null {
  for (const m of modules) {
    if (pathname.startsWith(`/${m.key}`)) return m.key;
  }
  return null;
}

export default function ModuleRail() {
  const pathname = usePathname();
  const active = getActiveModule(pathname);

  return (
    <nav className="sticky top-0 flex h-screen w-28 shrink-0 flex-col items-center bg-sky-600">
  

      {/* Spacer — matches Sidebar's h-10 module-title row so icons align with the first nav link */}
      <div className="h-10 w-full shrink-0" />

      {/* Icons — pt-3 lines the first icon up with the first sidebar nav row */}
      <div className="flex flex-1 flex-col items-center gap-2 pt-3">
        {modules.map((m) => {
          const isActive = active === m.key;
          return (
            <Link
              key={m.key}
              href={m.href}
              title={m.label}
              className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                isActive
                  ? "bg-white text-sky-600"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              {m.icon}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}