// src/app/platform-admin/pricing-plans/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Users, Zap, Calculator, Layers, Check } from "lucide-react";
import { getPricingPlans } from "@/lib/api/platform-admin";
import { PricingModule, PricingOverview } from "@/lib/api/types/platform-admin.types";

const moduleIcons: Record<string, { icon: React.ElementType; bg: string; color: string }> = {
  hris: { icon: Users, bg: "bg-green-50", color: "text-green-600" },
  payroll: { icon: Zap, bg: "bg-blue-50", color: "text-blue-600" },
  accounting: { icon: Calculator, bg: "bg-amber-50", color: "text-amber-600" },
  "all-in-one": { icon: Layers, bg: "bg-purple-50", color: "text-purple-600" },
};

const distributionBarColors: Record<string, string> = {
  hris: "bg-green-500",
  payroll: "bg-blue-500",
  accounting: "bg-amber-500",
  "all-in-one": "bg-purple-500",
};

function formatNaira(value: number) {
  return `₦${value.toLocaleString()}`;
}

export default function PricingPlansPage() {
  const [overview, setOverview] = useState<PricingOverview | null>(null);
  const [modules, setModules] = useState<PricingModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPricing = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getPricingPlans();
        setOverview(res.data.overview);
        setModules(res.data.modules);
      } catch (err) {
        setError("Failed to load pricing data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();
  }, []);

  if (loading) {
    return (
      <section className="p-6">
        <p className="text-sm text-slate-400">Loading pricing...</p>
      </section>
    );
  }

  if (error || !overview) {
    return (
      <section className="p-6">
        <p className="text-sm text-red-500">{error ?? "No data available."}</p>
      </section>
    );
  }

  const totalTenants = modules.reduce((sum, m) => sum + m.activeTenantCount, 0);

  return (
    <section className="space-y-4 bg-slate-50 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Pricing & Plans</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage subscription tiers and module pricing
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500">Total Monthly Revenue</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {formatNaira(overview.totalRevenue)}
            </p>
          </div>

          <div className="flex flex-1 flex-col gap-2 sm:min-w-[320px]">
            <div className="flex h-2 w-full overflow-hidden rounded-full">
              {modules.map((mod) => (
                <div
                  key={mod.id}
                  className={distributionBarColors[mod.key] ?? "bg-slate-400"}
                  style={{
                    width: overview.totalRevenue > 0 ? `${(mod.monthlyRevenue / overview.totalRevenue) * 100}%` : "0%",
                  }}
                  title={`${mod.name} — ${formatNaira(mod.monthlyRevenue)}`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
              {modules.map((mod) => (
                <span key={mod.id} className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${distributionBarColors[mod.key] ?? "bg-slate-400"}`} />
                  {mod.name} — {formatNaira(mod.monthlyRevenue)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {modules.map((mod) => {
          const iconInfo = moduleIcons[mod.key] ?? { icon: Layers, bg: "bg-slate-50", color: "text-slate-600" };
          const isAllInOne = mod.key === "all-in-one";
          return (
            <div
              key={mod.id}
              className={`overflow-hidden rounded-lg border bg-white shadow-sm ${
                isAllInOne ? "border-purple-200" : "border-slate-200"
              }`}
            >
              {isAllInOne && (
                <div className="bg-purple-600 py-1.5 text-center text-xs font-semibold uppercase tracking-wide text-white">
                  Best Value — All-in-One
                </div>
              )}

              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-md ${iconInfo.bg}`}>
                      <iconInfo.icon className={`h-5 w-5 ${iconInfo.color}`} />
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">{mod.name}</h3>
                      <p className="text-xs text-slate-500">{mod.description}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                    {mod.activeTenantCount} tenants
                  </span>
                </div>

                <div className="mt-4">
                  <span className="text-2xl font-bold text-slate-900">{formatNaira(mod.monthlyPrice)}</span>
                  <span className="text-sm text-slate-500">/month</span>
                  {mod.pricingModel === "PER_EMPLOYEE" && (
                    <p className="mt-0.5 text-xs text-slate-500">Per-employee pricing applies</p>
                  )}
                </div>

                <ul className="mt-4 space-y-2">
                  {mod.features.map((feature) => (
                    <li key={feature.id} className="flex items-start gap-2 text-sm text-slate-600">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                      {feature.name}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <p className="text-xs text-slate-500">
                    Monthly revenue —{" "}
                    <span className="font-medium text-slate-700">{formatNaira(mod.monthlyRevenue)}</span>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">Subscription Distribution</h3>
        <p className="text-xs text-slate-500">Tenants per module and revenue contribution</p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-500">
                <th className="py-2 font-medium">Module</th>
                <th className="py-2 font-medium">Base Price</th>
                <th className="py-2 font-medium">Active Tenants</th>
                <th className="py-2 font-medium">Revenue Share</th>
                <th className="py-2 font-medium">Monthly Revenue</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((mod) => {
                const iconInfo = moduleIcons[mod.key] ?? { icon: Layers, bg: "bg-slate-50", color: "text-slate-600" };
                return (
                  <tr key={mod.id} className="border-b border-slate-50">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className={`flex h-6 w-6 items-center justify-center rounded-md ${iconInfo.bg}`}>
                          <iconInfo.icon className={`h-3.5 w-3.5 ${iconInfo.color}`} />
                        </span>
                        <span className="font-medium text-slate-800">{mod.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-slate-600">{formatNaira(mod.baseMonthlyPrice)}/mo</td>
                    <td className="py-3 text-slate-700">{mod.activeTenantCount}</td>
                    <td className="py-3 text-slate-600">{mod.revenueContributionPercentage}%</td>
                    <td className="py-3 font-medium text-green-700">{formatNaira(mod.monthlyRevenue)}/mo</td>
                  </tr>
                );
              })}
              <tr>
                <td className="py-3 font-semibold text-slate-800" colSpan={2}>
                  {totalTenants} total
                </td>
                <td />
                <td />
                <td className="py-3 font-semibold text-sky-600">{formatNaira(overview.totalRevenue)}/mo</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}