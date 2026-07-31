// app/tenant-admin/general-settings/layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiGlobe, FiImage, FiShield } from "react-icons/fi";

const subNav = [
  { href: "/tenant-admin/general-settings/locale-region", label: "Locale & Region", icon: FiGlobe },
  { href: "/tenant-admin/general-settings/branding", label: "Branding", icon: FiImage },
  { href: "/tenant-admin/general-settings/data-privacy", label: "Data & Privacy", icon: FiShield },
];

export default function GeneralSettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <section className="flex gap-6 p-6">
      {/* Sub-nav */}
      <aside className="w-56 shrink-0">
        <p className="mb-3 px-2 text-xs font-medium uppercase tracking-wider text-slate-400">
          Settings
        </p>
        <nav className="space-y-0.5">
          {subNav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm ${
                  active
                    ? "bg-sky-50 font-medium text-sky-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon size={15} className={active ? "text-sky-600" : "text-slate-400"} />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1">{children}</div>
    </section>
  );
}