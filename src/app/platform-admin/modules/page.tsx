// src/app/platform-admin/modules/page.tsx
"use client";

import { useMemo, useState } from "react";
import { Box } from "lucide-react";
import {
  ALL_MODULES,
  tenantModuleRows,
  ModuleName,
  TenantModuleRow,
} from "@/lib/platform-modules-data";

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      role="switch"
      aria-checked={on}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
        on ? "bg-blue-600" : "bg-slate-200"
      }`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
          on ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export default function ModuleManagementPage() {
  const [rows, setRows] = useState<TenantModuleRow[]>(tenantModuleRows);

  const toggleModule = (tenantId: string, mod: ModuleName) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === tenantId ? { ...r, modules: { ...r.modules, [mod]: !r.modules[mod] } } : r
      )
    );
  };

  const setAllForModule = (mod: ModuleName, value: boolean) => {
    setRows((prev) => prev.map((r) => ({ ...r, modules: { ...r.modules, [mod]: value } })));
  };

  const summary = useMemo(() => {
    const totals: Record<ModuleName, { tenantsOn: number; activeUsers: number }> = {
      HRIS: { tenantsOn: 0, activeUsers: 0 },
      Accounting: { tenantsOn: 0, activeUsers: 0 },
      Payroll: { tenantsOn: 0, activeUsers: 0 },
    };
    for (const row of rows) {
      for (const mod of ALL_MODULES) {
        if (row.modules[mod]) {
          totals[mod].tenantsOn += 1;
          totals[mod].activeUsers += row.moduleUsers[mod];
        }
      }
    }
    return totals;
  }, [rows]);

  const rowUsage = (row: TenantModuleRow) =>
    ALL_MODULES.reduce((sum, mod) => (row.modules[mod] ? sum + row.moduleUsers[mod] : sum), 0);

  const totalUsage = rows.reduce((sum, row) => sum + rowUsage(row), 0);

  return (
    <section className="space-y-5 bg-slate-50 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Module Management</h1>
        <p className="mt-1 text-sm text-slate-500">
          Enable or disable modules per tenant. Changes apply immediately.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {ALL_MODULES.map((mod) => (
          <div key={mod} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100">
                <Box className="h-4 w-4 text-slate-500" />
              </span>
              <span className="text-sm text-slate-600">{mod}</span>
            </div>
            <p className="mt-3 text-2xl font-semibold text-slate-900">
              {summary[mod].tenantsOn}
              <span className="text-base font-normal text-slate-400">/{rows.length} tenants</span>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {summary[mod].activeUsers.toLocaleString()} active users
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-500">
                <th className="px-5 py-3 font-medium">Tenant</th>
                {ALL_MODULES.map((mod) => (
                  <th key={mod} className="px-5 py-3 text-center font-medium">
                    <div className="flex flex-col items-center gap-1.5">
                      <span>{mod}</span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => setAllForModule(mod, true)}
                          className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600 hover:bg-blue-100"
                        >
                          Enable All
                        </button>
                        <button
                          onClick={() => setAllForModule(mod, false)}
                          className="rounded border border-red-200 bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-600 hover:bg-red-100"
                        >
                          Disable All
                        </button>
                      </div>
                    </div>
                  </th>
                ))}
                <th className="px-5 py-3 text-right font-medium">Usage</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <p className="font-medium text-slate-800">{row.tenant}</p>
                    <p className="text-xs text-slate-400">{row.industry}</p>
                  </td>
                  {ALL_MODULES.map((mod) => (
                    <td key={mod} className="px-5 py-3">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-2">
                          <Toggle on={row.modules[mod]} onClick={() => toggleModule(row.id, mod)} />
                          <span
                            className={`text-xs font-medium ${
                              row.modules[mod] ? "text-blue-600" : "text-slate-400"
                            }`}
                          >
                            {row.modules[mod] ? "ON" : "OFF"}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {row.modules[mod] ? `${row.moduleUsers[mod]} users` : "\u00A0"}
                        </span>
                      </div>
                    </td>
                  ))}
                  <td className="px-5 py-3 text-right">
                    <p className="font-semibold text-slate-800">{rowUsage(row)}</p>
                    <p className="text-[11px] text-slate-400">active users</p>
                  </td>
                </tr>
              ))}

              {/* Totals row */}
              <tr className="bg-slate-50 font-medium text-slate-800">
                <td className="px-5 py-3">Total Active</td>
                {ALL_MODULES.map((mod) => (
                  <td key={mod} className="px-5 py-3 text-center">
                    <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                      {summary[mod].tenantsOn}/{rows.length}
                    </span>
                  </td>
                ))}
                <td className="px-5 py-3 text-right">{totalUsage.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}