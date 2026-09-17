// src/components/modals/CreateRoleModal.tsx
"use client";

import { useState } from "react";
import { RoleDetail, RoleTemplate } from "@/lib/api/types/admin.types";

interface CreateRoleModalProps {
  open: boolean;
  existingRoles: RoleDetail[];
  templates: RoleTemplate[];
  onClose: () => void;
  onCreate: (role: { name: string; description: string; cloneFromRoleId?: string; templateKey?: string }) => void;
}

export default function CreateRoleModal({
  open,
  existingRoles,
  templates,
  onClose,
  onCreate,
}: CreateRoleModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [source, setSource] = useState(""); // format: "role:<id>" or "template:<key>"

  if (!open) return null;

  const handleCreate = () => {
    if (!name.trim()) return;

    const [type, value] = source.split(":");
    onCreate({
      name: name.trim(),
      description: description.trim(),
      cloneFromRoleId: type === "role" ? value : undefined,
      templateKey: type === "template" ? value : undefined,
    });
    setName("");
    setDescription("");
    setSource("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Create Role</h2>
          <button onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Role Name
            </label>
            <input
              type="text"
              placeholder="e.g. Accountant"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Description
            </label>
            <input
              type="text"
              placeholder="Briefly describe this role's purpose"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Start From
            </label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
            >
              <option value="">Blank (no permissions)</option>
              {templates.length > 0 && (
                <optgroup label="Templates">
                  {templates.map((t) => (
                    <option key={t.key} value={`template:${t.key}`}>
                      {t.name}
                    </option>
                  ))}
                </optgroup>
              )}
              {existingRoles.length > 0 && (
                <optgroup label="Existing Roles">
                  {existingRoles.map((r) => (
                    <option key={r.id} value={`role:${r.id}`}>
                      {r.name}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
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
            onClick={handleCreate}
            className="rounded-md bg-[#2183C6] px-4 py-2 text-sm font-medium text-white hover:bg-[#1c70ab]"
          >
            Create Role
          </button>
        </div>
      </div>
    </div>
  );
}