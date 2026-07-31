// src/app/tenant-admin/user-management/pending-invitations/page.tsx
"use client";

import { useState } from "react";

type Invitation = {
  id: string;
  email: string;
  role: "Manager" | "Employee" | "Admin";
  modules: string[];
  sent: string;
  status: "Pending" | "Expired";
};

const initialInvitations: Invitation[] = [
  {
    id: "inv-1",
    email: "k.adewale@sinkronis.com",
    role: "Manager",
    modules: ["HRIS", "Accounting"],
    sent: "Jun 6, 2026",
    status: "Pending",
  },
  {
    id: "inv-2",
    email: "o.ibrahim@sinkronis.com",
    role: "Employee",
    modules: ["HRIS"],
    sent: "Jun 5, 2026",
    status: "Pending",
  },
  {
    id: "inv-3",
    email: "r.thomas@sinkronis.com",
    role: "Employee",
    modules: ["Accounting"],
    sent: "May 25, 2026",
    status: "Expired",
  },
];

const moduleBadgeColor: Record<string, string> = {
  HRIS: "bg-emerald-50 text-emerald-700",
  Accounting: "bg-sky-50 text-sky-700",
  Payroll: "bg-violet-50 text-violet-700",
};

export default function PendingInvitationsPage() {
  const [invitations, setInvitations] =
    useState<Invitation[]>(initialInvitations);

  const handleResend = (id: string) => {
    setInvitations((prev) =>
      prev.map((inv) =>
        inv.id === id ? { ...inv, status: "Pending" as const } : inv
      )
    );
  };

  const handleDelete = (id: string) => {
    setInvitations((prev) => prev.filter((inv) => inv.id !== id));
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-100 text-slate-500">
            <tr>
              <th className="px-4 py-2.5 font-medium">Email</th>
              <th className="px-4 py-2.5 font-medium">Role</th>
              <th className="px-4 py-2.5 font-medium">Modules</th>
              <th className="px-4 py-2.5 font-medium">Sent</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invitations.map((inv) => (
              <tr key={inv.id} className="border-b border-slate-50">
                <td className="px-4 py-3 text-slate-800">{inv.email}</td>
                <td className="px-4 py-3 text-slate-600">{inv.role}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {inv.modules.map((mod) => (
                      <span
                        key={mod}
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${moduleBadgeColor[mod] ?? "bg-slate-100 text-slate-600"}`}
                      >
                        {mod}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500">{inv.sent}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      inv.status === "Pending"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-rose-50 text-rose-600"
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3 text-sm">
                    <button
                      onClick={() => handleResend(inv.id)}
                      className="text-sky-600 hover:underline"
                    >
                      Resend
                    </button>
                    <button
                      onClick={() => handleDelete(inv.id)}
                      className="text-rose-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {invitations.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm text-slate-400"
                >
                  No pending invitations.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}