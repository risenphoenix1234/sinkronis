// src/components/modal/InviteUserModal.tsx
"use client";

import { useState } from "react";

type Role = "Employee" | "Manager" | "Admin";
type Module = "HRIS" | "Accounting";

interface InviteUserModalProps {
  open: boolean;
  onClose: () => void;
  onSend: (invite: { email: string; role: Role; modules: Module[] }) => void;
}

const roleOptions: Role[] = ["Employee", "Manager", "Admin"];
const moduleOptions: Module[] = ["HRIS", "Accounting"];

export default function InviteUserModal({
  open,
  onClose,
  onSend,
}: InviteUserModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("Employee");
  const [selectedModules, setSelectedModules] = useState<Module[]>(["HRIS"]);

  if (!open) return null;

  const toggleModule = (mod: Module) => {
    setSelectedModules((prev) =>
      prev.includes(mod) ? prev.filter((m) => m !== mod) : [...prev, mod]
    );
  };

  const handleSend = () => {
    if (!email.trim()) return;
    onSend({ email: email.trim(), role, modules: selectedModules });
    setEmail("");
    setRole("Employee");
    setSelectedModules(["HRIS"]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl">
        <div className="mb-1 flex items-start justify-between">
          <h2 className="text-base font-semibold text-slate-900">
            Invite User
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>
        <p className="mb-4 text-sm text-slate-500">
          Send an invitation to join this workspace.
        </p>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-slate-500">
              Email Address
            </label>
            <input
              type="email"
              placeholder="colleague@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-slate-500">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
            >
              {roleOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-slate-500">
              Module Access
            </label>
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
            className="rounded-md bg-[#2183C6] px-4 py-2 text-sm font-medium text-white hover:bg-[#1c70ab]"
          >
            Send Invite
          </button>
        </div>
      </div>
    </div>
  );
}