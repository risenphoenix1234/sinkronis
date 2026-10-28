"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  CheckCircle2,
  Users,
  Wallet,
  Boxes,
} from "lucide-react";
import { getPlatformDashboard } from "@/lib/api/platform-admin";
import { PlatformDashboard } from "@/lib/api/types/platform-admin.types";
import Loader from "@/components/ui/Loader";

function formatNaira(value: number) {
  return `₦${(value / 1_000_000).toFixed(1)}M`;
}

function RevenueTrendChart({ months }: { months: { month: string; monthlyRevenue: number }[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  const width = 640;
  const height = 220;
  const paddingLeft = 56;
  const paddingBottom = 24;
  const chartWidth = width - paddingLeft;
  const chartHeight = height - paddingBottom;
  const barGap = 24;
  const barWidth = (chartWidth - barGap * (months.length - 1)) / months.length;

  const max = Math.max(...months.map((m) => m.monthlyRevenue), 1);
  const yTicks = [0, max * 0.25, max * 0.5, max * 0.75, max];

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="Monthly revenue trend">
        {yTicks.map((tick, i) => {
          const y = chartHeight - (tick / max) * chartHeight;
          return (
            <g key={i}>
              <line x1={paddingLeft} x2={width} y1={y} y2={y} stroke="#f1f5f9" strokeWidth={1} />
              <text x={paddingLeft - 8} y={y + 4} textAnchor="end" fontSize={11} fill="#94a3b8">
                {formatNaira(tick)}
              </text>
            </g>
          );
        })}

        {months.map((point, i) => {
          const barHeight = (point.monthlyRevenue / max) * chartHeight;
          const x = paddingLeft + i * (barWidth + barGap);
          const y = chartHeight - barHeight;
          const isHovered = hovered === i;

          return (
            <g key={point.month}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={4}
                fill={isHovered ? "#0369A1" : "#0284C7"}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer transition-colors"
              />
              <text x={x + barWidth / 2} y={height - 6} textAnchor="middle" fontSize={11} fill="#94a3b8">
                {point.month.slice(0, 3)}
              </text>
            </g>
          );
        })}
      </svg>

      {hovered !== null && (
        <div
          className="pointer-events-none absolute -top-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs shadow-sm"
          style={{
            left: `${((paddingLeft + hovered * (barWidth + barGap) + barWidth / 2) / width) * 100}%`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <p className="font-medium text-slate-700">{months[hovered].month}</p>
          <p className="text-slate-500">₦{months[hovered].monthlyRevenue.toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-green-50 text-green-700",
  TRIAL: "bg-amber-50 text-amber-700",
  SUSPENDED: "bg-red-50 text-red-700",
};

const moduleStyles: Record<string, string> = {
  hris: "bg-brand-50 text-brand-700",
  accounting: "bg-purple-50 text-purple-700",
  payroll: "bg-green-50 text-green-700",
};

function timeAgo(timestamp: string) {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}

export default function PlatformAdminOverviewPage() {
  const [dashboard, setDashboard] = useState<PlatformDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getPlatformDashboard({ page: 1, limit: 25, activityLimit: 10 });
        setDashboard(res.data);
      } catch (err) {
        setError("Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <section className="p-6">
        <Loader variant="section" label="Loading dashboard" />
      </section>
    );
  }

  if (error || !dashboard) {
    return (
      <section className="p-6">
        <p className="text-sm text-red-500">{error ?? "No data available."}</p>
      </section>
    );
  }

  const { analytics, revenueTrend, moduleAdoption, recentActivity, tenantHealth } = dashboard;

  const stats = [
    { label: "Total Tenants", value: analytics.totalTenants, icon: Building2, iconBg: "bg-brand-50", iconColor: "text-brand-600" },
    { label: "Active This Month", value: analytics.activeTenants, icon: CheckCircle2, iconBg: "bg-green-50", iconColor: "text-green-600" },
    { label: "Total Users", value: analytics.totalUsers, icon: Users, iconBg: "bg-purple-50", iconColor: "text-purple-600" },
    { label: "Platform MRR", value: `₦${analytics.platformMrr.toLocaleString()}`, icon: Wallet, iconBg: "bg-amber-50", iconColor: "text-amber-600" },
    { label: "Avg Modules/Tenant", value: analytics.averageModulesPerTenant, icon: Boxes, iconBg: "bg-indigo-50", iconColor: "text-indigo-600" },
  ];

  return (
    <section className="space-y-6 bg-slate-50 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Platform Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Sinkronis tenant overview</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className={`flex h-7 w-7 items-center justify-center rounded-md ${stat.iconBg}`}>
                <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
              </span>
              <h2 className="text-xs font-medium text-slate-500">{stat.label}</h2>
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr_1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Revenue Trend</h3>
          <p className="text-xs text-slate-500">Monthly MRR — last 6 months</p>
          <div className="mt-4">
            <RevenueTrendChart months={revenueTrend.months} />
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Module Adoption</h3>
          <p className="text-xs text-slate-500">Tenants using each module</p>
          <div className="mt-5 space-y-4">
            {moduleAdoption.modules.map((mod) => (
              <div key={mod.moduleId}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">{mod.moduleName}</span>
                  <span className="text-slate-500">
                    {mod.tenantCount}/{moduleAdoption.totalActiveTenants} ({Math.round(mod.percentageAdoption)}%)
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-100">
                  <div className="h-1.5 rounded-full bg-brand-600" style={{ width: `${mod.percentageAdoption}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Recent Activity</h3>
          <p className="text-xs text-slate-500">Latest platform events</p>
          <ul className="mt-4 space-y-4">
            {recentActivity.length === 0 && (
              <li className="text-sm text-slate-400">No recent activity.</li>
            )}
            {recentActivity.map((item) => (
              <li key={item.activityId} className="flex items-start gap-3">
                <div>
                  <p className="text-sm text-slate-700">{item.description}</p>
                  <p className="text-xs text-slate-400">{timeAgo(item.timestamp)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">Tenant Health</h3>
        <p className="text-xs text-slate-500">Click a row to view full tenant details</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-500">
                <th className="py-2 font-medium">Company</th>
                <th className="py-2 font-medium">Plan</th>
                <th className="py-2 font-medium">Users</th>
                <th className="py-2 font-medium">Modules</th>
                <th className="py-2 font-medium">Last Active</th>
                <th className="py-2 font-medium">MRR ₦</th>
                <th className="py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {tenantHealth.records.map((tenant) => (
                <tr key={tenant.organizationId} className="cursor-pointer border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <td className="py-3 font-medium text-slate-800">{tenant.organizationName}</td>
                  <td className="py-3 text-slate-700">{tenant.currentPlan.name}</td>
                  <td className="py-3 text-slate-700">{tenant.userCount}</td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-1">
                      {tenant.activeModules.length === 0 && <span className="text-xs text-slate-400">—</span>}
                      {tenant.activeModules.map((mod) => (
                        <span key={mod.key} className={`rounded-full px-2 py-0.5 text-xs font-medium ${moduleStyles[mod.key] ?? "bg-slate-100 text-slate-600"}`}>
                          {mod.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 text-slate-500">
                    {tenant.lastActiveDate
                      ? new Date(tenant.lastActiveDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                      : "—"}
                  </td>
                  <td className="py-3 text-slate-700">₦{tenant.monthlyRecurringRevenue.toLocaleString()}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[tenant.subscriptionStatus]}`}>
                      {tenant.subscriptionStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}