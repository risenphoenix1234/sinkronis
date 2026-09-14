// src/app/tenant-admin/user-management/user-groups/page.tsx
"use client";

import { useEffect, useState } from "react";
import CreateGroupModal from "@/components/modals/CreateGroupModal";
import { getUserGroups, createUserGroup, deleteUserGroup } from "@/lib/api/admin";
import { TenantUserGroup } from "@/lib/api/types/admin.types";

const typeBadgeColor: Record<string, string> = {
  DEPARTMENT: "bg-emerald-50 text-emerald-700",
  FUNCTION: "bg-violet-50 text-violet-700",
};

export default function UserGroupsPage() {
  const [groups, setGroups] = useState<TenantUserGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUserGroups();
      setGroups(res.data);
    } catch (err) {
      setError("Failed to load groups.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreate = async (group: { name: string; type: "DEPARTMENT" | "FUNCTION" }) => {
    try {
      await createUserGroup(group);
      setModalOpen(false);
      await fetchGroups();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to create group.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this group?")) return;
    try {
      await deleteUserGroup(id);
      await fetchGroups();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete group.");
    }
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

      {loading && <p className="py-8 text-center text-sm text-slate-400">Loading groups...</p>}

      {!loading && error && <p className="py-8 text-center text-sm text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => (
            <div key={group.id} className="rounded-lg border border-slate-100 p-4">
              <div className="mb-2 flex items-start justify-between">
                <p className="font-medium text-slate-800">{group.name}</p>
                <div className="flex items-center gap-3 text-xs">
                  <button
                    onClick={() => handleDelete(group.id)}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    🗑
                  </button>
                </div>
              </div>

              <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${typeBadgeColor[group.type]}`}>
                {group.type === "DEPARTMENT" ? "Department" : "Function"}
              </span>

              <div className="mt-4 flex items-center gap-2">
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
      )}

      <CreateGroupModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={handleCreate} />
    </div>
  );
}