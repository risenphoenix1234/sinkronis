"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  getPlatformUsers,
  deactivateTenantUser,
  resetTenantUserPassword,
  impersonateTenant,
} from "@/lib/api/platform-admin";
import { PlatformUserRecord } from "@/lib/api/types/platform-admin.types";

const moduleStyles: Record<string, string> = {
  HRIS: "bg-sky-50 text-sky-600",
  ACCOUNTING: "bg-purple-50 text-purple-600",
  PAYROLL: "bg-orange-50 text-orange-600",
};

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700",
  INACTIVE: "bg-slate-100 text-slate-500",
  LOCKED: "bg-amber-50 text-amber-700",
  SUSPENDED: "bg-red-50 text-red-700",
};

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function UsersPage() {
  const [users, setUsers] = useState<PlatformUserRecord[]>([]);
  const [analytics, setAnalytics] = useState({ totalUsers: 0, activeUsers: 0, inactiveUsers: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [tenantFilter, setTenantFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPlatformUsers({
        search: searchTerm || undefined,
        tenantId: tenantFilter || undefined,
        roleId: roleFilter || undefined,
        status: statusFilter || undefined,
      });
      setUsers(res.data.users);
      setAnalytics(res.data.analytics);
    } catch (err) {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(fetchUsers, 400);
    return () => clearTimeout(debounce);
  }, [searchTerm, tenantFilter, roleFilter, statusFilter]);

  // Derive unique tenant and role options from loaded users (id + name pairs)
  const tenantOptions = useMemo(() => {
    const map = new Map<string, string>();
    users.forEach((u) => map.set(u.tenant.id, u.tenant.name));
    return Array.from(map.entries());
  }, [users]);

  const roleOptions = useMemo(() => {
    const map = new Map<string, string>();
    users.forEach((u) => map.set(u.role.id, u.role.name));
    return Array.from(map.entries());
  }, [users]);

  const handleDeactivate = async (tenantId: string, userId: string) => {
    setActionLoading(true);
    try {
      await deactivateTenantUser(tenantId, userId);
      await fetchUsers();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to deactivate user.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetPassword = async (tenantId: string, userId: string) => {
    setActionLoading(true);
    try {
      await resetTenantUserPassword(tenantId, userId);
      alert("Password reset email sent.");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to send password reset.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleImpersonate = async (tenantId: string) => {
    setActionLoading(true);
    try {
      await impersonateTenant(tenantId);
      alert("Impersonation started.");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to start impersonation.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <section className="space-y-4 bg-slate-50 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">All Users</h1>
        <p className="mt-1 text-sm text-slate-500">All users across every tenant on the platform</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr_1fr]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          />
        </div>

        <select
          value={tenantFilter}
          onChange={(e) => setTenantFilter(e.target.value)}
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
        >
          <option value="">All Tenants</option>
          {tenantOptions.map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
        >
          <option value="">All Roles</option>
          {roleOptions.map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="LOCKED">Locked</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
          Total users: <span className="font-semibold text-slate-900">{analytics.totalUsers}</span>
        </div>
        <div className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
          Active: <span className="font-semibold text-emerald-600">{analytics.activeUsers}</span>
        </div>
        <div className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
          Inactive: <span className="font-semibold text-red-500">{analytics.inactiveUsers}</span>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-500">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Tenant</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Module Access</th>
                <th className="px-5 py-3 font-medium">Last Active</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-400">
                    Loading users...
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-red-500">
                    {error}
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                users.map((u) => (
                  <tr key={u.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-800">{u.name}</p>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </td>
                    <td className="px-5 py-3 text-slate-700">{u.tenant.name}</td>
                    <td className="px-5 py-3 text-slate-700">{u.role.name}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {u.moduleAccess.length === 0 && <span className="text-xs text-slate-400">—</span>}
                        {u.moduleAccess.map((mod) => (
                          <span
                            key={mod}
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${moduleStyles[mod] ?? "bg-slate-100 text-slate-600"}`}
                          >
                            {mod}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-500">{formatDate(u.lastActive)}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[u.status]}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {u.actions.canDeactivate && (
                          <button
                            onClick={() => handleDeactivate(u.tenant.id, u.id)}
                            disabled={actionLoading}
                            className="text-xs font-medium text-red-600 hover:underline disabled:opacity-60"
                          >
                            Deactivate
                          </button>
                        )}
                        {u.actions.canResetPassword && (
                          <button
                            onClick={() => handleResetPassword(u.tenant.id, u.id)}
                            disabled={actionLoading}
                            className="text-xs font-medium text-sky-600 hover:underline disabled:opacity-60"
                          >
                            Reset PW
                          </button>
                        )}
                        {u.actions.canImpersonate && (
                          <button
                            onClick={() => handleImpersonate(u.tenant.id)}
                            disabled={actionLoading}
                            className="text-xs font-medium text-purple-600 hover:underline disabled:opacity-60"
                          >
                            Impersonate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

              {!loading && !error && users.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-400">
                    No users match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}