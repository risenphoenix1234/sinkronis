"use client";

import { useEffect, useState } from "react";
import { Box } from "lucide-react";
import { getModuleManagement, enableTenantModule, disableTenantModule } from "@/lib/api/platform-admin";
import { ModuleManagementAnalyticsItem, TenantModuleRow } from "@/lib/api/types/platform-admin.types";
import Loader from "@/components/ui/Loader";

const ALL_MODULES = ["HRIS", "ACCOUNTING", "PAYROLL"];

function Toggle({ on, onClick, disabled }: { on: boolean; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      role="switch"
      aria-checked={on}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
        on ? "bg-sky-600" : "bg-slate-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          on ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function ModuleManagementPage() {
  const [analytics, setAnalytics] = useState<ModuleManagementAnalyticsItem[]>([]);
  const [tenants, setTenants] = useState<TenantModuleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingKey, setTogglingKey] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getModuleManagement({ page: 1, limit: 25 });
      setAnalytics(res.data.analytics.modules);
      setTenants(res.data.tenants);
    } catch (err) {
      setError("Failed to load module data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggle = async (tenantId: string, mod: string, currentlyEnabled: boolean) => {
    const key = `${tenantId}-${mod}`;
    setTogglingKey(key);
    try {
      if (currentlyEnabled) {
        const reason = window.prompt(`Reason for disabling ${mod}:`);
        if (!reason) {
          setTogglingKey(null);
          return;
        }
        await disableTenantModule(tenantId, mod, reason);
      } else {
        await enableTenantModule(tenantId, mod);
      }
      await fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to update module — it may conflict with the tenant's plan.");
    } finally {
      setTogglingKey(null);
    }
  };

  const rowUsage = (row: TenantModuleRow) => row.modules.reduce((sum, m) => (m.enabled ? sum + m.activeUserCount : sum), 0);
  const totalUsage = tenants.reduce((sum, row) => sum + rowUsage(row), 0);

  if (loading) {
    return (
      <section className="p-6">
        <Loader variant="section" label="Loading modules" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="p-6">
        <p className="text-sm text-red-500">{error}</p>
      </section>
    );
  }

  return (
    <section className="space-y-5 bg-slate-50 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Module Management</h1>
        <p className="mt-1 text-sm text-slate-500">
          Enable or disable modules per tenant. Changes apply immediately.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {analytics.map((mod) => (
          <div key={mod.module} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100">
                <Box className="h-4 w-4 text-slate-500" />
              </span>
              <span className="text-sm text-slate-600">{mod.module}</span>
            </div>
            <p className="mt-3 text-2xl font-semibold text-slate-900">
              {mod.tenantCount}
              <span className="text-base font-normal text-slate-400">/{tenants.length} tenants</span>
            </p>
            <p className="mt-1 text-xs text-slate-500">{mod.activeUserCount.toLocaleString()} active users</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-500">
                <th className="px-5 py-3 font-medium">Tenant</th>
                {ALL_MODULES.map((mod) => (
                  <th key={mod} className="px-5 py-3 text-center font-medium">{mod}</th>
                ))}
                <th className="px-5 py-3 text-right font-medium">Usage</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((row) => (
                <tr key={row.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <p className="font-medium text-slate-800">{row.name}</p>
                    <p className="text-xs text-slate-400">{row.email}</p>
                  </td>
                  {ALL_MODULES.map((mod) => {
                    const modStatus = row.modules.find((m) => m.module === mod);
                    const enabled = modStatus?.enabled ?? false;
                    const key = `${row.id}-${mod}`;
                    return (
                      <td key={mod} className="px-5 py-3">
                        <div className="flex flex-col items-center gap-1">
                          <Toggle
                            on={enabled}
                            disabled={togglingKey === key}
                            onClick={() => handleToggle(row.id, mod, enabled)}
                          />
                          <span className="text-[11px] text-slate-400">
                            {enabled ? `${modStatus?.activeUserCount ?? 0} users` : "\u00A0"}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                  <td className="px-5 py-3 text-right">
                    <p className="font-semibold text-slate-800">{rowUsage(row)}</p>
                    <p className="text-[11px] text-slate-400">active users</p>
                  </td>
                </tr>
              ))}

              <tr className="bg-slate-50 font-medium text-slate-800">
                <td className="px-5 py-3">Total Active</td>
                {ALL_MODULES.map((mod) => {
                  const stat = analytics.find((a) => a.module === mod);
                  return (
                    <td key={mod} className="px-5 py-3 text-center">
                      <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                        {stat?.tenantCount ?? 0}/{tenants.length}
                      </span>
                    </td>
                  );
                })}
                <td className="px-5 py-3 text-right">{totalUsage.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}