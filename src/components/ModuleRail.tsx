// src/components/ModuleRail.tsx
"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiCreditCard, FiDollarSign, FiHome, FiUsers } from "react-icons/fi";

type ModuleKey = "tenant-admin" | "hris" | "accounting" | "payroll";

type Module = {
  key: ModuleKey;
  href: string;
  icon: ReactNode;
  label: string;
};

const adminModule: Module = {
  key: "tenant-admin",
  href: "/tenant-admin/overview",
  icon: <FiHome size={18} />,
  label: "Admin Setup",
};

const modules: readonly Module[] = [
  {
    key: "hris",
    href: "/hris/dashboard",
    icon: <FiUsers size={18} />,
    label: "HRIS",
  },
  {
    key: "accounting",
    href: "/accounting/dashboard",
    icon: <FiDollarSign size={18} />,
    label: "Accounting",
  },
  {
    key: "payroll",
    href: "/payroll/dashboard",
    icon: <FiCreditCard size={18} />,
    label: "Payroll",
  },
];

function getActiveModule(
  pathname: string,
  list: readonly Module[]
): ModuleKey | null {
  return list.find((module) => pathname.startsWith(`/${module.key}`))?.key ?? null;
}

export default function ModuleRail() {
  const pathname = usePathname();
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      const user = raw ? JSON.parse(raw) : null;
      setShowAdmin(
        user?.accountType === "TENANT_USER" &&
          !pathname.startsWith("/employee") &&
          !pathname.startsWith("/manager")
      );
    } catch {
      setShowAdmin(false);
    }
  }, [pathname]);

  const visibleModules = showAdmin ? [adminModule, ...modules] : modules;
  const activeModule = getActiveModule(pathname, visibleModules);

  return (
    <nav
      aria-label="Application modules"
      className="sticky top-20 flex h-[calc(100vh-5rem)] w-28 shrink-0 flex-col items-center self-start bg-[var(--brand-rail)]"
    >
      {/* Divider */}
      <div className="mt-2 h-px w-12 bg-white/20" />

      {/* Module navigation */}
      <div className="flex flex-1 flex-col items-center gap-3 pt-3">
        {visibleModules.map((module) => {
          const isActive = activeModule === module.key;

          return (
            <Link
              key={module.key}
              href={module.href}
              title={module.label}
              aria-label={module.label}
              aria-current={isActive ? "page" : undefined}
              className={[
                "flex h-10 w-10 items-center justify-center rounded-lg",
                "transition-colors duration-150",
                isActive
                  ? "bg-white text-[var(--brand-rail)]"
                  : "text-white/80 hover:bg-white/10 hover:text-white",
              ].join(" ")}
            >
              {module.icon}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}