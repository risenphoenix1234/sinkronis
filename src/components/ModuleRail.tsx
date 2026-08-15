// components/ModuleRail.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiUsers, FiDollarSign, FiCreditCard } from "react-icons/fi";

type ModuleKey = "hris" | "accounting" | "payroll";

const modules: { key: ModuleKey; href: string; icon: React.ReactNode; label: string }[] = [
  { key: "hris", href: "/hris/overview", icon: <FiUsers size={18} />, label: "HRIS" },
  { key: "accounting", href: "/accounting/dashboard", icon: <FiDollarSign size={18} />, label: "Accounting" },
  { key: "payroll", href: "/payroll/overview", icon: <FiCreditCard size={18} />, label: "Payroll" },
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
      {/* Logo */}
      <Link
        href="/"
        className="flex h-20 w-full shrink-0 items-center justify-center"
      >
        <Image
          src="/logo.png"
          alt="Sinkronis"
          width={80}
          height={80}
          priority
        />
      </Link>

      {/* Divider */}
      <div className="h-px w-12 shrink-0 bg-white/20" />

      {/* Icons */}
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