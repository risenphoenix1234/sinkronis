// src/app/tenant-admin/roles-permissions/page.tsx
"use client";

import { useState } from "react";
import Toggle from "@/components/ui/Toggle";
import CreateRoleModal from "@/components/modals/CreateRoleModal";

type PermissionAction = "view" | "create" | "edit" | "delete" | "approve";

type ModulePermissions = Record<PermissionAction, boolean>;

type Role = {
  id: string;
  name: string;
  isSystem: boolean;
  isOwner: boolean; // Owner role: fully locked, cannot be modified
  permissions: Record<string, ModulePermissions>; // keyed by module name
};

const modules = ["HRIS", "Accounting", "Payroll", "Admin"];

const actionColumns: { key: PermissionAction; label: string }[] = [
  { key: "view", label: "View" },
  { key: "create", label: "Create" },
  { key: "edit", label: "Edit" },
  { key: "delete", label: "Delete" },
  { key: "approve", label: "Approve" },
];

function fullAccess(): ModulePermissions {
  return { view: true, create: true, edit: true, delete: true, approve: true };
}

function noAccess(): ModulePermissions {
  return {
    view: false,
    create: false,
    edit: false,
    delete: false,
    approve: false,
  };
}

function buildModulePerms(
  fn: (mod: string) => ModulePermissions
): Record<string, ModulePermissions> {
  return Object.fromEntries(modules.map((mod) => [mod, fn(mod)]));
}

const initialRoles: Role[] = [
  {
    id: "role-owner",
    name: "Owner",
    isSystem: true,
    isOwner: true,
    permissions: buildModulePerms(() => fullAccess()),
  },
  {
    id: "role-admin",
    name: "Admin",
    isSystem: true,
    isOwner: false,
    permissions: buildModulePerms(() => fullAccess()),
  },
  {
    id: "role-manager",
    name: "Manager",
    isSystem: true,
    isOwner: false,
    permissions: buildModulePerms((mod) =>
      mod === "Admin"
        ? noAccess()
        : { view: true, create: true, edit: true, delete: false, approve: true }
    ),
  },
  {
    id: "role-employee",
    name: "Employee",
    isSystem: true,
    isOwner: false,
    permissions: buildModulePerms((mod) =>
      mod === "HRIS"
        ? { view: true, create: false, edit: false, delete: false, approve: false }
        : noAccess()
    ),
  },
];

export default function RolesPermissionsPage() {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [selectedRoleId, setSelectedRoleId] = useState(initialRoles[0].id);
  const [modalOpen, setModalOpen] = useState(false);

  const selectedRole = roles.find((r) => r.id === selectedRoleId)!;

  const togglePermission = (
    roleId: string,
    moduleName: string,
    action: PermissionAction
  ) => {
    setRoles((prev) =>
      prev.map((role) => {
        if (role.id !== roleId || role.isOwner) return role;
        return {
          ...role,
          permissions: {
            ...role.permissions,
            [moduleName]: {
              ...role.permissions[moduleName],
              [action]: !role.permissions[moduleName][action],
            },
          },
        };
      })
    );
  };

  const toggleAll = (roleId: string, moduleName: string) => {
    setRoles((prev) =>
      prev.map((role) => {
        if (role.id !== roleId || role.isOwner) return role;
        const current = role.permissions[moduleName];
        const allOn = Object.values(current).every(Boolean);
        const next: ModulePermissions = allOn ? noAccess() : fullAccess();
        return {
          ...role,
          permissions: { ...role.permissions, [moduleName]: next },
        };
      })
    );
  };

  const handleCreateRole = (input: {
    name: string;
    description: string;
    cloneFrom: string;
  }) => {
    const source = roles.find((r) => r.name === input.cloneFrom);
    const newRole: Role = {
      id: `role-${Date.now()}`,
      name: input.name,
      isSystem: false,
      isOwner: false,
      permissions: source
        ? JSON.parse(JSON.stringify(source.permissions))
        : buildModulePerms(() => noAccess()),
    };
    setRoles((prev) => [...prev, newRole]);
    setSelectedRoleId(newRole.id);
    setModalOpen(false);
  };

  return (
    <section className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Roles &amp; Permissions
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Define what each role can do across every module.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 rounded-md bg-[#2183C6] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1c70ab]"
        >
          <span className="text-base leading-none">+</span> Create Role
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        {/* Roles list */}
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
                    isActive
                      ? "bg-sky-50 text-slate-900"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`text-base ${isActive ? "text-sky-600" : "text-slate-400"}`}
                  >
                    🔒
                  </span>
                  <span>
                    <span className="block text-sm font-medium">
                      {role.name}
                    </span>
                    {role.isSystem && (
                      <span className="block text-xs text-slate-400">
                        System
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Permissions matrix */}
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-slate-900">
                  {selectedRole.name}
                </h2>
                {selectedRole.isOwner && (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
                    System Role
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {selectedRole.isOwner
                  ? "Full control over all modules and settings. Cannot be modified."
                  : "Configure module-level permissions for this role."}
              </p>
            </div>

            {!selectedRole.isOwner && (
              <button className="flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
                📋 Clone
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="px-4 py-2 font-medium">Module</th>
                  {actionColumns.map((col) => (
                    <th key={col.key} className="px-4 py-2 font-medium">
                      {col.label}
                    </th>
                  ))}
                  <th className="px-4 py-2 font-medium">All</th>
                </tr>
              </thead>
              <tbody>
                {modules.map((mod) => {
                  const perms = selectedRole.permissions[mod];
                  const allOn = Object.values(perms).every(Boolean);
                  return (
                    <tr key={mod} className="border-t border-slate-100">
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {mod}
                      </td>
                      {actionColumns.map((col) => (
                        <td key={col.key} className="px-4 py-3">
                          <Toggle
                            checked={perms[col.key]}
                            disabled={selectedRole.isOwner}
                            onChange={() =>
                              togglePermission(selectedRole.id, mod, col.key)
                            }
                            ariaLabel={`${selectedRole.name} ${mod} ${col.label}`}
                          />
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        <Toggle
                          checked={allOn}
                          disabled={selectedRole.isOwner}
                          onChange={() => toggleAll(selectedRole.id, mod)}
                          ariaLabel={`${selectedRole.name} ${mod} all permissions`}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {selectedRole.isOwner && (
            <div className="mt-4 rounded-md border border-amber-100 bg-amber-50 px-4 py-2.5 text-sm text-amber-700">
              The Owner role has unrestricted access and cannot be modified.
            </div>
          )}
        </div>
      </div>

      <CreateRoleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateRole}
        cloneOptions={roles.map((r) => r.name)}
      />
    </section>
  );
}