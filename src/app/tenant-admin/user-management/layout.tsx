// src/app/tenant-admin/user-management/layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import InviteUserModal from "@/components/modals/InviteUserModal";

const tabs = [
  { label: "Users", href: "/tenant-admin/user-management/users" },
  {
    label: "Pending Invitations",
    href: "/tenant-admin/user-management/pending-invitations",
  },
  {
    label: "User Groups",
    href: "/tenant-admin/user-management/user-groups",
  },
];

const tabCounts: Record<string, number> = {
  "/tenant-admin/user-management/users": 8,
  "/tenant-admin/user-management/pending-invitations": 2,
  "/tenant-admin/user-management/user-groups": 3,
};

export default function UserManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <section className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            User Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage team access, roles, and module permissions.
          </p>
        </div>

        <button
          onClick={() => setInviteOpen(true)}
          className="flex items-center gap-1.5 rounded-md bg-[#2183C6] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1c70ab]"
        >
          <span className="text-base leading-none">+</span> Invite User
        </button>
      </div>

      {/* Metric cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>Total Users</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-sky-600">
              👥
            </span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900">8</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>Active Users</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              ✓
            </span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900">7</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>Pending Invitations</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600">
              🕐
            </span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900">2</p>
        </div>
      </div>

      {/* Top tabs */}
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
                <span
                  className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-semibold ${
                    isActive
                      ? "bg-sky-100 text-sky-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {tabCounts[tab.href]}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div>{children}</div>

      <InviteUserModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onSend={() => setInviteOpen(false)}
      />
    </section>
  );
}