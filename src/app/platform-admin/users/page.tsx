// src/app/platform-admin/users/page.tsx
"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  allUsers,
  moduleStyles,
  statusStyles,
  ModuleName,
  PlatformUser,
} from "@/lib/platform-users-data";

const ALL_MODULES: ModuleName[] = ["HRIS", "Accounting", "Payroll"];

export default function UsersPage() {
  const [users, setUsers] = useState<PlatformUser[]>(allUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [tenantFilter, setTenantFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");

  const tenants = useMemo(
    () => Array.from(new Set(users.map((u) => u.tenant))).sort(),
    [users]
  );
  const roles = useMemo(
    () => Array.from(new Set(users.map((u) => u.role))).sort(),
    [users]
  );

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        !searchTerm ||
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTenant = !tenantFilter || u.tenant === tenantFilter;
      const matchesRole = !roleFilter || u.role === roleFilter;
      const matchesModule = !moduleFilter || u.moduleAccess.includes(moduleFilter as ModuleName);
      return matchesSearch && matchesTenant && matchesRole && matchesModule;
    });
  }, [users, searchTerm, tenantFilter, roleFilter, moduleFilter]);

  const totalUsers = users.length;
  const activeCount = users.filter((u) => u.status === "Active").length;
  const inactiveCount = users.filter((u) => u.status === "Inactive").length;

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u
      )
    );
  };

  return (
    <section className="space-y-4 bg-slate-50 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">All Users</h1>
        <p className="mt-1 text-sm text-slate-500">All users across every tenant on the platform</p>
      </div>

      {/* Filters */}
      <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr_1fr]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <select
          value={tenantFilter}
          onChange={(e) => setTenantFilter(e.target.value)}
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Tenants</option>
          {tenants.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Roles</option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <select
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Modules</option>
          {ALL_MODULES.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Stat pills */}
      <div className="flex flex-wrap gap-3">
        <div className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
          Total users: <span className="font-semibold text-slate-900">{totalUsers}</span>
        </div>
        <div className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
          Active: <span className="font-semibold text-emerald-600">{activeCount}</span>
        </div>
        <div className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
          Inactive: <span className="font-semibold text-red-500">{inactiveCount}</span>
        </div>
      </div>

      {/* Table */}
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
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <p className="font-medium text-slate-800">{u.name}</p>
                    <p className="text-xs text-slate-400">{u.email}</p>
                  </td>
                  <td className="px-5 py-3 text-slate-700">{u.tenant}</td>
                  <td className="px-5 py-3 text-slate-700">{u.role}</td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {u.moduleAccess.map((mod) => (
                        <span
                          key={mod}
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${moduleStyles[mod]}`}
                        >
                          {mod}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-500">{u.lastActive}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[u.status]}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleStatus(u.id)}
                        className={`text-xs font-medium hover:underline ${
                          u.status === "Active" ? "text-red-600" : "text-emerald-600"
                        }`}
                      >
                        {u.status === "Active" ? "Deactivate" : "Activate"}
                      </button>
                      <button className="text-xs font-medium text-blue-600 hover:underline">
                        Reset PW
                      </button>
                      <button className="text-xs font-medium text-purple-600 hover:underline">
                        Impersonate
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
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