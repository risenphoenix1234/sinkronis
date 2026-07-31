// src/app/tenant-admin/security/layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Password Policy", href: "/tenant-admin/security/password-policy" },
  { label: "Two-Factor Auth", href: "/tenant-admin/security/two-factor-auth" },
  { label: "Active Sessions", href: "/tenant-admin/security/active-sessions" },
  { label: "IP Restriction", href: "/tenant-admin/security/ip-restriction" },
  { label: "Login Activity", href: "/tenant-admin/security/login-activity" },
];

export default function SecurityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Security</h1>
        <p className="mt-1 text-sm text-slate-500">
          Control platform-wide security settings and activity.
        </p>
      </div>

      <div className="border-b border-slate-200">
        <nav className="flex gap-6 text-sm">
          {tabs.map((tab) => {
            const isActive = pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`-mb-px border-b-2 px-1 pb-3 font-medium transition-colors ${
                  isActive
                    ? "border-[#2183C6] text-[#2183C6]"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div>{children}</div>
    </section>
  );
}