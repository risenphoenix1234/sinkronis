// src/app/tenant-admin/notifications-alerts/layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "In-App", href: "/tenant-admin/notifications/in-app" },
  { label: "Email", href: "/tenant-admin/notifications/email" },
  {
    label: "Announcements",
    href: "/tenant-admin/notifications/announcements",
    badge: 2,
  },
];

export default function NotificationsAlertsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Notifications &amp; Alerts
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Configure which notifications are sent per module, and read
          platform announcements.
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
                className={`-mb-px flex items-center gap-1.5 border-b-2 px-1 pb-3 font-medium transition-colors ${
                  isActive
                    ? "border-[#2183C6] text-[#2183C6]"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
                {tab.badge ? (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-xs font-semibold text-white">
                    {tab.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>

      <div>{children}</div>
    </section>
  );
}