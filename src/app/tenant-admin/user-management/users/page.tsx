"use client";

import { useEffect, useMemo, useState } from "react";
import RowActionsMenu from "@/components/modals/RowActionsMenu";
import { getTenantUsers, editTenantUser, removeTenantUser, getRoles } from "@/lib/api/admin";
import { TenantUserRow, TenantRole } from "@/lib/api/types/admin.types";

const moduleBadgeColor: Record<string, string> = {
  HRIS: "bg-emerald-50 text-emerald-700",
  ACCOUNTING: "bg-sky-50 text-sky-700",
  PAYROLL: "bg-violet-50 text-violet-700",
};

function getInitials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

function formatDate(value: string | null) {
  if (!value) return "Never";
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function UsersPage() {
  const [users, setUsers] = useState<TenantUserRow[]>([]);
  const [roles, setRoles] = useState<TenantRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTenantUsers({ search: search || undefined });
      setUsers(res.data);
    } catch (err) {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(fetchUsers, 400);
    return () => clearTimeout(debounce);
  }, [search]);

  useEffect(() => {
    getRoles().then(setRoles).catch(() => {});
  }, []);

  const handleRemove = async (id: string) => {
    if (!window.confirm("Remove this user from the workspace?")) return;
    try {
      await removeTenantUser(id);
      await fetchUsers();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to remove user.");
    }
  };

  const handleToggleStatus = async (id: string, currentlyActive: boolean) => {
    try {
      await editTenantUser(id, { isActive: !currentlyActive });
      await fetchUsers();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to update status.");
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-100 text-slate-500">
            <tr>
              <th className="px-4 py-2.5 font-medium">User</th>
              <th className="px-4 py-2.5 font-medium">Role</th>
              <th className="px-4 py-2.5 font-medium">Modules</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 font-medium">Last Active</th>
              <th className="px-4 py-2.5 font-medium" />
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">Loading users...</td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-red-500">{error}</td>
              </tr>
            )}

            {!loading && !error && users.map((user) => (
              <tr key={user.id} className="border-b border-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700">
                      {getInitials(user.user.fullName)}
                    </span>
                    <div>
                      <p className="font-medium text-slate-800">{user.user.fullName}</p>
                      <p className="text-xs text-slate-400">{user.user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700">
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {user.modules.map((mod) => (
                      <span key={mod} className={`rounded-full px-2.5 py-1 text-xs font-semibold ${moduleBadgeColor[mod] ?? "bg-slate-100 text-slate-600"}`}>
                        {mod}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${user.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                    {user.status === "ACTIVE" ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">{formatDate(user.lastActive)}</td>
                <td className="px-4 py-3 text-right">
                  <RowActionsMenu
                    onEditAccess={() => handleToggleStatus(user.id, user.status === "ACTIVE")}
                    onRemove={() => handleRemove(user.id)}
                  />
                </td>
              </tr>
            ))}

            {!loading && !error && users.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">No users match your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}