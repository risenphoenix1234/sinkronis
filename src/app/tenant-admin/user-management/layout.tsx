// src/app/tenant-admin/user-management/layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import InviteUserModal from "@/components/modals/InviteUserModal";
import { getUsersAnalytics, createInvitation, getRoleDetails } from "@/lib/api/admin";
import { TenantUsersAnalytics, RoleDetail } from "@/lib/api/types/admin.types";

const tabs = [
  { label: "Users", href: "/tenant-admin/user-management/users" },
  { label: "Pending Invitations", href: "/tenant-admin/user-management/pending-invitations" },
  { label: "User Groups", href: "/tenant-admin/user-management/user-groups" },
];

export default function UserManagementLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [analytics, setAnalytics] = useState<TenantUsersAnalytics | null>(null);
  const [roles, setRoles] = useState<RoleDetail[]>([]);

  const fetchAnalytics = async () => {
    try {
      const res = await getUsersAnalytics();
      setAnalytics(res);
    } catch (err) {
      // silent fail on metrics, non-critical
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await getRoleDetails();
      setRoles(res);
    } catch (err) {
      // silent fail, modal will show empty state
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchRoles();
  }, []);

  const handleInvite = async (invite: { email: string; roleId: string; modules: string[] }) => {
    try {
      await createInvitation({ email: invite.email, roleId: invite.roleId, moduleAccess: invite.modules });
      setInviteOpen(false);
      fetchAnalytics();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to send invitation.");
    }
  };

  return (
    <section className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">User Management</h1>
          <p className="mt-1 text-sm text-slate-500">Manage team access, roles, and module permissions.</p>
        </div>

        <button
          onClick={() => setInviteOpen(true)}
          className="flex items-center gap-1.5 rounded-md bg-[#2183C6] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1c70ab]"
        >
          <span className="text-base leading-none">+</span> Invite User
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>Total Users</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-sky-600">👥</span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{analytics?.totalUsers ?? "—"}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>Active Users</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">✓</span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{analytics?.activeUsers ?? "—"}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>Pending Invitations</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600">🕐</span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{analytics?.pendingInvitations ?? "—"}</p>
        </div>
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
                  isActive ? "border-[#2183C6] text-[#2183C6]" : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div>{children}</div>

      <InviteUserModal open={inviteOpen} roles={roles} onClose={() => setInviteOpen(false)} onSend={handleInvite} />
    </section>
  );
}