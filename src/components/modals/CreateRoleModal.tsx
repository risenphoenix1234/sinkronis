// src/components/modal/CreateRoleModal.tsx
"use client";

import { useState } from "react";

interface CreateRoleModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (role: {
    name: string;
    description: string;
    cloneFrom: string;
  }) => void;
  cloneOptions: string[];
}

export default function CreateRoleModal({
  open,
  onClose,
  onCreate,
  cloneOptions,
}: CreateRoleModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cloneFrom, setCloneFrom] = useState(cloneOptions[0] ?? "");

  if (!open) return null;

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate({ name: name.trim(), description: description.trim(), cloneFrom });
    setName("");
    setDescription("");
    setCloneFrom(cloneOptions[0] ?? "");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">
            Create Role
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-slate-400 hover:text-slate-600"
          >
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
              Clone Permissions From
            </label>
            <select
              value={cloneFrom}
              onChange={(e) => setCloneFrom(e.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
            >
              {cloneOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
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