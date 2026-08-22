"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiCreditCard, FiDollarSign, FiUsers } from "react-icons/fi";

type ModuleKey = "hris" | "accounting" | "payroll";

type Module = {
  key: ModuleKey;
  href: string;
  icon: ReactNode;
  label: string;
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

function getActiveModule(pathname: string): ModuleKey | null {
  return (
    modules.find((module) => pathname.startsWith(`/${module.key}`))?.key ?? null
  );
}

export default function ModuleRail() {
  const pathname = usePathname();
  const activeModule = getActiveModule(pathname);

  return (
    <nav
      aria-label="Application modules"
      className="sticky top-0 flex h-screen w-28 shrink-0 flex-col items-center bg-sky-600"
    >
      {/* Divider */}
      <div className="mt-2 h-px w-12 bg-white/20" />

      {/* Module navigation */}
      <div className="flex flex-1 flex-col items-center gap-3 pt-3">
        {modules.map((module) => {
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
                  ? "bg-white text-sky-600"
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
