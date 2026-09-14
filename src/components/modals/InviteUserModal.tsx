// src/components/modal/InviteUserModal.tsx
"use client";

import { useState } from "react";
import { RoleDetail } from "@/lib/api/types/admin.types";

type ModuleKey = "HRIS" | "ACCOUNTING" | "PAYROLL";

const moduleOptions: ModuleKey[] = ["HRIS", "ACCOUNTING", "PAYROLL"];

interface InviteUserModalProps {
  open: boolean;
  roles: RoleDetail[];
  onClose: () => void;
  onSend: (invite: { email: string; roleId: string; modules: ModuleKey[] }) => void;
}

export default function InviteUserModal({
  open,
  roles,
  onClose,
  onSend,
}: InviteUserModalProps) {
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("");
  const [selectedModules, setSelectedModules] = useState<ModuleKey[]>(["HRIS"]);

  if (!open) return null;

  const toggleModule = (mod: ModuleKey) => {
    setSelectedModules((prev) =>
      prev.includes(mod) ? prev.filter((m) => m !== mod) : [...prev, mod]
    );
  };

  const handleSend = () => {
    if (!email.trim() || !roleId) return;
    onSend({ email: email.trim(), roleId, modules: selectedModules });
    setEmail("");
    setRoleId("");
    setSelectedModules(["HRIS"]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl">
        <div className="mb-1 flex items-start justify-between">
          <h2 className="text-base font-semibold text-slate-900">Invite User</h2>
          <button onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>
        <p className="mb-4 text-sm text-slate-500">Send an invitation to join this workspace.</p>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-slate-500">Email Address</label>
            <input
              type="email"
              placeholder="colleague@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-slate-500">Role</label>
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
            >
              <option value="">Select a role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id} disabled={r.isSystem}>
                  {r.name}{r.isSystem ? " (system)" : ""}
                </option>
              ))}
            </select>
            {roles.every((r) => r.isSystem) && (
              <p className="mt-1 text-xs text-amber-600">
                No assignable roles yet — create a custom role first.
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-slate-500">Module Access</label>
            <div className="flex gap-2">
              {moduleOptions.map((mod) => (
                <button
                  key={mod}
                  onClick={() => toggleModule(mod)}
                  className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                    selectedModules.includes(mod)
                      ? "border-sky-400 bg-sky-50 text-sky-700"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {mod}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={roles.every((r) => r.isSystem)}
            className="rounded-md bg-[#2183C6] px-4 py-2 text-sm font-medium text-white hover:bg-[#1c70ab] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            Send Invite
          </button>
        </div>
      </div>
    </div>
  );
}