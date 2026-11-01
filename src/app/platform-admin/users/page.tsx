// src/app/platform-admin/users/page.tsx
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
import Loader from "@/components/ui/Loader";

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-[#E8F5E9] text-[#2E7D32]",
  INACTIVE: "bg-[#F4F6F8] text-[#637381]",
  LOCKED: "bg-[#FFF8E1] text-[#F57F17]",
  SUSPENDED: "bg-[#FFEBEE] text-[#C62828]",
};

const statusLabel = (status: string) =>
  status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : "—";

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
    <section className="min-h-[calc(100vh-5rem)] space-y-4 bg-[#F4F6F8] p-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#212B36]">All Users</h1>
        <p className="mt-1 text-sm text-[#637381]">All users across every tenant on the platform</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr_1fr]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#919EAB]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-md border border-[#F2F3F5] bg-white py-2 pl-9 pr-3 text-sm text-[#212B36] outline-none placeholder:text-[#919EAB] focus:border-[#2183C6] focus:ring-1 focus:ring-[#2183C6]"
          />
        </div>

        <select
          value={tenantFilter}
          onChange={(e) => setTenantFilter(e.target.value)}
          className="rounded-md border border-[#F2F3F5] bg-white px-3 py-2 text-sm text-[#637381] outline-none focus:border-[#2183C6] focus:ring-1 focus:ring-[#2183C6]"
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
          className="rounded-md border border-[#F2F3F5] bg-white px-3 py-2 text-sm text-[#637381] outline-none focus:border-[#2183C6] focus:ring-1 focus:ring-[#2183C6]"
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
          className="rounded-md border border-[#F2F3F5] bg-white px-3 py-2 text-sm text-[#637381] outline-none focus:border-[#2183C6] focus:ring-1 focus:ring-[#2183C6]"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="LOCKED">Locked</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="rounded-md border border-[#F2F3F5] bg-white px-4 py-2 text-sm text-[#637381]">
          Total users: <span className="font-semibold text-[#212B36]">{analytics.totalUsers}</span>
        </div>
        <div className="rounded-md border border-[#F2F3F5] bg-white px-4 py-2 text-sm text-[#637381]">
          Active: <span className="font-semibold text-[#2E7D32]">{analytics.activeUsers}</span>
        </div>
        <div className="rounded-md border border-[#F2F3F5] bg-white px-4 py-2 text-sm text-[#637381]">
          Inactive: <span className="font-semibold text-[#C62828]">{analytics.inactiveUsers}</span>
        </div>
      </div>

      <div className="rounded-lg border border-[#F2F3F5] bg-white p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EBEEF0] text-xs text-[#637381]">
                <th className="px-2 py-3 font-medium">Name</th>
                <th className="px-2 py-3 font-medium">Tenant</th>
                <th className="px-2 py-3 font-medium">Role</th>
                <th className="px-2 py-3 font-medium">Module Access</th>
                <th className="px-2 py-3 font-medium">Last Active</th>
                <th className="px-2 py-3 font-medium">Status</th>
                <th className="px-2 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="px-3 py-10 text-center text-sm text-[#919EAB]"><Loader variant="inline" label="Loading users" /></td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td colSpan={7} className="px-3 py-10 text-center text-sm text-red-500">
                    {error}
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                users.map((u) => (
                  <tr key={u.id} className="even:bg-[#F2F2F7]">
                    <td className="px-2 py-3">
                      <p className="font-medium text-[#212B36]">{u.name}</p>
                      <p className="text-[11px] text-[#919EAB]">{u.email}</p>
                    </td>
                    <td className="px-2 py-3 text-[#212B36]">{u.tenant.name}</td>
                    <td className="px-2 py-3 text-[#637381]">{u.role.name}</td>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-1">
                        {u.moduleAccess.length === 0 && <span className="text-xs text-[#919EAB]">—</span>}
                        {u.moduleAccess.map((mod) => (
                          <span
                            key={mod}
                            className="whitespace-nowrap rounded-full bg-[#E3F2FD] px-2 py-0.5 text-[11px] font-medium text-[#2183C6]"
                          >
                            {mod}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-2 py-3 text-[#637381]">{formatDate(u.lastActive)}</td>
                    <td className="px-2 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${statusStyles[u.status] ?? "bg-[#F4F6F8] text-[#637381]"}`}>
                        {statusLabel(u.status)}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-1.5">
                        {u.actions.canDeactivate && (
                          <button
                            onClick={() => handleDeactivate(u.tenant.id, u.id)}
                            disabled={actionLoading}
                            className="whitespace-nowrap rounded bg-[#FFEBEE] px-2 py-1 text-[11px] font-medium text-[#C62828] hover:bg-[#fcdde2] disabled:opacity-60"
                          >
                            Deactivate
                          </button>
                        )}
                        {u.actions.canResetPassword && (
                          <button
                            onClick={() => handleResetPassword(u.tenant.id, u.id)}
                            disabled={actionLoading}
                            className="whitespace-nowrap rounded bg-[#E3F2FD] px-2 py-1 text-[11px] font-medium text-[#2183C6] hover:bg-[#d3e9fb] disabled:opacity-60"
                          >
                            Reset PW
                          </button>
                        )}
                        {u.actions.canImpersonate && (
                          <button
                            onClick={() => handleImpersonate(u.tenant.id)}
                            disabled={actionLoading}
                            className="whitespace-nowrap rounded bg-[#F3E5F5] px-2 py-1 text-[11px] font-medium text-[#7B1FA2] hover:bg-[#ebd5ef] disabled:opacity-60"
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
                  <td colSpan={7} className="px-3 py-10 text-center text-sm text-[#919EAB]">
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