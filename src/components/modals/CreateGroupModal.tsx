// src/components/modal/CreateGroupModal.tsx
"use client";

import { useState } from "react";

type GroupType = "Department" | "Function";

interface CreateGroupModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (group: { name: string; type: GroupType }) => void;
}

export default function CreateGroupModal({
  open,
  onClose,
  onCreate,
}: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState("");
  const [type, setType] = useState<GroupType>("Department");

  if (!open) return null;

  const handleCreate = () => {
    if (!groupName.trim()) return;
    onCreate({ name: groupName.trim(), type });
    setGroupName("");
    setType("Department");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">
            Create Group
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
            <label className="mb-1.5 block text-sm text-slate-500">
              Group Name
            </label>
            <input
              type="text"
              placeholder="e.g. Engineering"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-slate-500">
              Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(["Department", "Function"] as GroupType[]).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setType(opt)}
                  className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                    type === opt
                      ? "border-sky-400 bg-sky-50 text-sky-700"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {opt}
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
            onClick={handleCreate}
            className="rounded-md bg-[#2183C6] px-4 py-2 text-sm font-medium text-white hover:bg-[#1c70ab]"
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
}