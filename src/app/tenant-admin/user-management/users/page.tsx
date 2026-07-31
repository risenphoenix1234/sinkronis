// src/app/tenant-admin/user-management/users/page.tsx
"use client";

import { useMemo, useState } from "react";
import RowActionsMenu from "@/components/modals/RowActionsMenu";


type UserRow = {
  id: string;
  name: string;
  email: string;
  initials: string;
  initialsColor: string;
  role: "Owner" | "Admin" | "Manager" | "Employee";
  modules: string[];
  status: "Active" | "Inactive";
  lastActive: string;
};

const initialUsers: UserRow[] = [
  {
    id: "u-1",
    name: "Chukwuemeka Obi",
    email: "c.obi@sinkronis.com",
    initials: "CO",
    initialsColor: "bg-violet-100 text-violet-700",
    role: "Owner",
    modules: ["HRIS", "Accounting", "Payroll"],
    status: "Active",
    lastActive: "Today, 9:41 AM",
  },
  {
    id: "u-2",
    name: "Amaro Nwosu",
    email: "a.nwosu@sinkronis.com",
    initials: "AN",
    initialsColor: "bg-rose-100 text-rose-700",
    role: "Admin",
    modules: ["HRIS", "Accounting"],
    status: "Active",
    lastActive: "Today, 8:15 AM",
  },
  {
    id: "u-3",
    name: "Tunde Adeyemi",
    email: "t.adeyemi@sinkronis.com",
    initials: "TA",
    initialsColor: "bg-sky-100 text-sky-700",
    role: "Manager",
    modules: ["HRIS"],
    status: "Active",
    lastActive: "Yesterday, 5:00 PM",
  },
  {
    id: "u-4",
    name: "Fatima Bello",
    email: "f.bello@sinkronis.com",
    initials: "FB",
    initialsColor: "bg-amber-100 text-amber-700",
    role: "Manager",
    modules: ["Accounting"],
    status: "Active",
    lastActive: "Yesterday, 3:22 PM",
  },
  {
    id: "u-5",
    name: "Ngozi Eze",
    email: "n.eze@sinkronis.com",
    initials: "NE",
    initialsColor: "bg-emerald-100 text-emerald-700",
    role: "Employee",
    modules: ["HRIS"],
    status: "Active",
    lastActive: "2 days ago",
  },
  {
    id: "u-6",
    name: "Emeka Okeke",
    email: "e.okeke@sinkronis.com",
    initials: "EO",
    initialsColor: "bg-sky-100 text-sky-700",
    role: "Employee",
    modules: ["HRIS"],
    status: "Active",
    lastActive: "2 days ago",
  },
  {
    id: "u-7",
    name: "Chisom Igwe",
    email: "c.igwe@sinkronis.com",
    initials: "CI",
    initialsColor: "bg-violet-100 text-violet-700",
    role: "Employee",
    modules: ["Accounting"],
    status: "Inactive",
    lastActive: "3 weeks ago",
  },
  {
    id: "u-8",
    name: "Babatunde Okafor",
    email: "b.okafor@sinkronis.com",
    initials: "BO",
    initialsColor: "bg-rose-100 text-rose-700",
    role: "Employee",
    modules: ["HRIS"],
    status: "Active",
    lastActive: "Today, 7:55 AM",
  },
];

const moduleBadgeColor: Record<string, string> = {
  HRIS: "bg-emerald-50 text-emerald-700",
  Accounting: "bg-sky-50 text-sky-700",
  Payroll: "bg-violet-50 text-violet-700",
};

const roleBadgeColor: Record<UserRow["role"], string> = {
  Owner: "bg-violet-50 text-violet-700",
  Admin: "bg-rose-50 text-rose-700",
  Manager: "bg-amber-50 text-amber-700",
  Employee: "bg-slate-100 text-slate-600",
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [moduleFilter, setModuleFilter] = useState("All");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchesSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);
      const matchesRole = roleFilter === "All" || u.role === roleFilter;
      const matchesStatus =
        statusFilter === "All" || u.status === statusFilter;
      const matchesModule =
        moduleFilter === "All" || u.modules.includes(moduleFilter);
      return matchesSearch && matchesRole && matchesStatus && matchesModule;
    });
  }, [users, search, roleFilter, statusFilter, moduleFilter]);

  const handleRemove = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
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

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
        >
          <option value="All">Role: All</option>
          <option value="Owner">Owner</option>
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="Employee">Employee</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
        >
          <option value="All">Status: All</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <select
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
        >
          <option value="All">Module: All</option>
          <option value="HRIS">HRIS</option>
          <option value="Accounting">Accounting</option>
          <option value="Payroll">Payroll</option>
        </select>
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
            {filtered.map((user) => (
              <tr key={user.id} className="border-b border-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${user.initialsColor}`}
                    >
                      {user.initials}
                    </span>
                    <div>
                      <p className="font-medium text-slate-800">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${roleBadgeColor[user.role]}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {user.modules.map((mod) => (
                      <span
                        key={mod}
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${moduleBadgeColor[mod] ?? "bg-slate-100 text-slate-600"}`}
                      >
                        {mod}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      user.status === "Active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {user.lastActive}
                </td>
                <td className="px-4 py-3 text-right">
                  <RowActionsMenu
                    onEditAccess={() => {
                      // placeholder for edit-access flow
                    }}
                    onRemove={() => handleRemove(user.id)}
                  />
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm text-slate-400"
                >
                  No users match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}