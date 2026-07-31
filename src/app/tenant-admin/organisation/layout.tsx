// src/app/tenant-admin/organisation/layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Company Profile", href: "/tenant-admin/organisation/company-profile" },
  { label: "Departments", href: "/tenant-admin/organisation/departments" },
  { label: "Branches & Locations", href: "/tenant-admin/organisation/branches-locations" },
  { label: "Work Schedule", href: "/tenant-admin/organisation/work-schedule" },
];

export default function OrganisationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Organisation</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your company profile, departments, locations, and work
          schedule.
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