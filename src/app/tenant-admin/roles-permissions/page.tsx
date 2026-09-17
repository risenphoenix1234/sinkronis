"use client";

import { useEffect, useMemo, useState } from "react";
import Toggle from "@/components/ui/Toggle";
import CreateRoleModal from "@/components/modals/CreateRoleModal";
import { getRoleDetails, getRoleTemplates, createRole, updateRole } from "@/lib/api/admin";
import { RoleDetail, RoleTemplate, PermissionItem } from "@/lib/api/types/admin.types";

export default function RolesPermissionsPage() {
  const [roles, setRoles] = useState<RoleDetail[]>([]);
  const [templates, setTemplates] = useState<RoleTemplate[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const [rolesRes, templatesRes] = await Promise.all([getRoleDetails(), getRoleTemplates()]);
      setRoles(rolesRes);
      setTemplates(templatesRes);
      setSelectedRoleId((prev) => prev ?? rolesRes[0]?.id ?? null);
    } catch (err) {
      setError("Failed to load roles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const selectedRole = roles.find((r) => r.id === selectedRoleId);

  // Build a unique set of modules and actions from the selected role's own permissionGroups


// Replace the useMemo block with this:
const catalogSource = roles.find((r) => r.permissionGroups.length > 0) ?? roles[0];

const { moduleList, actionList, permByModuleAction } = useMemo(() => {
  if (!catalogSource) return { moduleList: [], actionList: [], permByModuleAction: {} as Record<string, PermissionItem> };

  const modules = catalogSource.permissionGroups;
  const actionsSet = new Set<string>();
  const map: Record<string, PermissionItem> = {};

  modules.forEach((group) => {
    group.permissions.forEach((perm) => {
      actionsSet.add(perm.action);
      map[`${group.module}:${perm.action}`] = perm;
    });
  });

  return {
    moduleList: modules.map((m) => ({ module: m.module, label: m.label })),
    actionList: Array.from(actionsSet),
    permByModuleAction: map,
  };
}, [catalogSource]);




  // const { moduleList, actionList, permByModuleAction } = useMemo(() => {
  //   if (!selectedRole) return { moduleList: [], actionList: [], permByModuleAction: {} as Record<string, PermissionItem> };

  //   const modules = selectedRole.permissionGroups;
  //   const actionsSet = new Set<string>();
  //   const map: Record<string, PermissionItem> = {};

  //   modules.forEach((group) => {
  //     group.permissions.forEach((perm) => {
  //       actionsSet.add(perm.action);
  //       map[`${group.module}:${perm.action}`] = perm;
  //     });
  //   });

  //   return {
  //     moduleList: modules.map((m) => ({ module: m.module, label: m.label })),
  //     actionList: Array.from(actionsSet),
  //     permByModuleAction: map,
  //   };
  // }, [selectedRole]);

  const hasPermission = (key: string) => selectedRole?.permissions.includes(key) ?? false;

  const togglePermission = async (permKey: string) => {
    if (!selectedRole || !selectedRole.canModify) return;
    const current = selectedRole.permissions;
    const next = current.includes(permKey)
      ? current.filter((p) => p !== permKey)
      : [...current, permKey];

    setSaving(true);
    try {
      const updated = await updateRole(selectedRole.id, { permissionKeys: next });
      setRoles((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to update permission.");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateRole = async (input: { name: string; description: string; cloneFromRoleId?: string; templateKey?: string }) => {
    try {
      const newRole = await createRole(input);
      setRoles((prev) => [...prev, newRole]);
      setSelectedRoleId(newRole.id);
      setModalOpen(false);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to create role.");
    }
  };

  if (loading) {
    return (
      <section className="p-6">
        <p className="text-sm text-slate-400">Loading roles...</p>
      </section>
    );
  }

  if (error || !selectedRole) {
    return (
      <section className="p-6">
        <p className="text-sm text-red-500">{error ?? "No roles found."}</p>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Roles &amp; Permissions</h1>
          <p className="mt-1 text-sm text-slate-500">Define what each role can do across every module.</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 rounded-md bg-[#2183C6] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1c70ab]"
        >
          <span className="text-base leading-none">+</span> Create Role
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Roles ({roles.length})
          </p>
          <div className="space-y-1">
            {roles.map((role) => {
              const isActive = role.id === selectedRoleId;
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRoleId(role.id)}
                  className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left transition-colors ${
                    isActive ? "bg-sky-50 text-slate-900" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className={`text-base ${isActive ? "text-sky-600" : "text-slate-400"}`}>🔒</span>
                  <span>
                    <span className="block text-sm font-medium">{role.name}</span>
                    {role.isSystem && <span className="block text-xs text-slate-400">System</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-slate-900">{selectedRole.name}</h2>
                {selectedRole.isSystem && (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
                    System Role
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {!selectedRole.canModify
                  ? selectedRole.lockedReason ?? "This role cannot be modified."
                  : "Configure module-level permissions for this role."}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="px-4 py-2 font-medium">Module</th>
                  {actionList.map((action) => (
                    <th key={action} className="px-4 py-2 font-medium capitalize">{action}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {moduleList.map(({ module, label }) => (
                  <tr key={module} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-medium text-slate-800">{label}</td>
                    {actionList.map((action) => {
                      const perm = permByModuleAction[`${module}:${action}`];
                      if (!perm) return <td key={action} className="px-4 py-3 text-slate-300">—</td>;
                      return (
                        <td key={action} className="px-4 py-3">
                          <Toggle
                            checked={hasPermission(perm.key)}
                            disabled={!selectedRole.canModify || saving}
                            onChange={() => togglePermission(perm.key)}
                            ariaLabel={perm.label}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!selectedRole.canModify && (
            <div className="mt-4 rounded-md border border-amber-100 bg-amber-50 px-4 py-2.5 text-sm text-amber-700">
              {selectedRole.lockedReason ?? "This role has unrestricted access and cannot be modified."}
            </div>
          )}
        </div>
      </div>

      <CreateRoleModal
        open={modalOpen}
        existingRoles={roles}
        templates={templates}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateRole}
      />
    </section>
  );
}