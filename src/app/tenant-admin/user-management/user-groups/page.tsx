// src/app/tenant-admin/user-management/user-groups/page.tsx
"use client";

import { useState } from "react";
import CreateGroupModal from "@/components/modals/CreateGroupModal";

type GroupType = "Department" | "Function";

type UserGroup = {
  id: string;
  name: string;
  type: GroupType;
  memberInitials: { label: string; color: string }[];
  memberCount: number;
};

const initialGroups: UserGroup[] = [
  {
    id: "grp-1",
    name: "Engineering",
    type: "Department",
    memberInitials: [
      { label: "BO", color: "bg-rose-100 text-rose-700" },
      { label: "EO", color: "bg-sky-100 text-sky-700" },
    ],
    memberCount: 12,
  },
  {
    id: "grp-2",
    name: "Finance",
    type: "Department",
    memberInitials: [{ label: "FB", color: "bg-amber-100 text-amber-700" }],
    memberCount: 6,
  },
  {
    id: "grp-3",
    name: "HR & People Ops",
    type: "Function",
    memberInitials: [
      { label: "TA", color: "bg-sky-100 text-sky-700" },
      { label: "NE", color: "bg-emerald-100 text-emerald-700" },
    ],
    memberCount: 5,
  },
];

const typeBadgeColor: Record<GroupType, string> = {
  Department: "bg-emerald-50 text-emerald-700",
  Function: "bg-violet-50 text-violet-700",
};

export default function UserGroupsPage() {
  const [groups, setGroups] = useState<UserGroup[]>(initialGroups);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreate = (group: { name: string; type: GroupType }) => {
    setGroups((prev) => [
      ...prev,
      {
        id: `grp-${Date.now()}`,
        name: group.name,
        type: group.type,
        memberInitials: [],
        memberCount: 0,
      },
    ]);
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 rounded-md bg-[#2183C6] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1c70ab]"
        >
          <span className="text-base leading-none">+</span> Create Group
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => (
          <div
            key={group.id}
            className="rounded-lg border border-slate-100 p-4"
          >
            <div className="mb-2 flex items-start justify-between">
              <p className="font-medium text-slate-800">{group.name}</p>
              <div className="flex items-center gap-3 text-xs">
                <button className="text-slate-400 hover:text-sky-600">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(group.id)}
                  className="text-slate-400 hover:text-rose-600"
                >
                  🗑
                </button>
              </div>
            </div>

            <span
              className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${typeBadgeColor[group.type]}`}
            >
              {group.type}
            </span>

            <div className="mt-4 flex items-center gap-2">
              <div className="flex -space-x-2">
                {group.memberInitials.map((m, i) => (
                  <span
                    key={i}
                    className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[10px] font-semibold ${m.color}`}
                  >
                    {m.label}
                  </span>
                ))}
              </div>
              <span className="text-sm text-slate-500">
                {group.memberCount} member{group.memberCount === 1 ? "" : "s"}
              </span>
            </div>
          </div>
        ))}

        {groups.length === 0 && (
          <p className="col-span-full py-8 text-center text-sm text-slate-400">
            No groups created yet.
          </p>
        )}
      </div>

      <CreateGroupModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}