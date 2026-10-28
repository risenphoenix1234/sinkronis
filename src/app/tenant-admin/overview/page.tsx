"use client";

import { useEffect, useState } from "react";
import { getTenantDashboard } from "@/lib/api/admin";
import { TenantDashboardResponse } from "@/lib/api/types/admin.types";
import Loader from "@/components/ui/Loader";

const moduleIconStyles: Record<string, { bg: string; color: string; icon: string }> = {
  admin: { bg: "bg-slate-100", color: "text-slate-600", icon: "⚙" },
  hris: { bg: "bg-sky-50", color: "text-sky-600", icon: "👥" },
  accounting: { bg: "bg-emerald-50", color: "text-emerald-600", icon: "📈" },
  payroll: { bg: "bg-violet-50", color: "text-violet-600", icon: "📄" },
};

const quickActionStyles: Record<string, { border: string; bg: string; hover: string; iconColor: string; icon: string }> = {
  "invite-user": { border: "border-sky-100", bg: "bg-sky-50", hover: "hover:bg-sky-100", iconColor: "text-sky-600", icon: "✉" },
  "manage-modules": { border: "border-violet-100", bg: "bg-violet-50", hover: "hover:bg-violet-100", iconColor: "text-violet-600", icon: "▦" },
  "view-audit-log": { border: "border-emerald-100", bg: "bg-emerald-50", hover: "hover:bg-emerald-100", iconColor: "text-emerald-600", icon: "📄" },
  "security-settings": { border: "border-amber-100", bg: "bg-amber-50", hover: "hover:bg-amber-100", iconColor: "text-amber-600", icon: "🛡" },
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function timeAgo(timestamp: string) {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs} hr${diffHrs > 1 ? "s" : ""} ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}

export default function TenantAdminDashboardPage() {
  const [data, setData] = useState<TenantDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getTenantDashboard();
        setData(res);
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

  if (error || !data) {
    return (
      <section className="p-6">
        <p className="text-sm text-red-500">{error ?? "No data available."}</p>
      </section>
    );
  }

  const { welcome, analytics, quickActions, activeModules, recentActivities, systemAlerts } = data;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-600">
            <span className="text-base font-semibold text-white">{getInitials(welcome.tenantAdminName)}</span>
          </div>
          <div>
            <p className="text-sm text-slate-500">Welcome back</p>
            <h1 className="text-xl font-semibold text-slate-900">{welcome.tenantAdminName}</h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Sinkronis Tenant Admin · Last login: {new Date(welcome.lastLoginAt).toLocaleString("en-GB", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm text-slate-500">
            {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
          <p className="mt-1 flex items-center justify-end gap-1.5 text-sm text-emerald-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            System operational
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>Total Users</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-sky-600">👤</span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{analytics.totalUsers}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>Active Users</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">✓</span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{analytics.activeUsers}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>Active Modules</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-50 text-violet-600">▦</span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{analytics.activeModules}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>Pending Invitations</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600">✉</span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{analytics.pendingInvitations}</p>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-slate-800">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions
            .filter((action) => action.allowed)
            .map((action) => {
              const style = quickActionStyles[action.key] ?? quickActionStyles["invite-user"];
              return (
                <button
                  key={action.key}
                  className={`flex flex-col items-center justify-center gap-2 rounded-lg border ${style.border} ${style.bg} py-6 text-sm font-medium text-slate-700 ${style.hover}`}
                >
                  <span className={`flex h-9 w-9 items-center justify-center rounded-full bg-white ${style.iconColor} shadow-sm`}>
                    {style.icon}
                  </span>
                  {action.title}
                </button>
              );
            })}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm xl:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-semibold text-slate-800">Recent Activity</span>
            <button className="text-sm text-sky-600">View Audit Log &gt;</button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentActivities.length === 0 && (
              <p className="py-4 text-sm text-slate-400">No recent activity.</p>
            )}
            {recentActivities.map((item) => (
              <div key={item.id} className="flex items-start gap-3 py-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700">
                  {getInitials(item.actorName)}
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-slate-800">
                    <span className="font-medium">{item.actorName}</span> {item.summary}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {item.resource} · {timeAgo(item.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-semibold text-slate-800">Active Modules</span>
            </div>
            <div className="space-y-2">
              {activeModules.map((mod) => {
                const style = moduleIconStyles[mod.key] ?? { bg: "bg-slate-100", color: "text-slate-500", icon: "▦" };
                return (
                  <div key={mod.key} className="flex items-center justify-between rounded-md border border-slate-100 px-3 py-2.5">
                    <div className="flex items-center gap-3">
                      <span className={`flex h-8 w-8 items-center justify-center rounded-full ${style.bg} ${style.color}`}>
                        {style.icon}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-800">{mod.name}</span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              mod.enabled ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {mod.enabled ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-slate-300">&gt;</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-semibold text-slate-800">System Alerts</span>
            </div>
            <div className="space-y-2">
              {systemAlerts.length === 0 && (
                <p className="text-sm text-slate-400">No alerts right now.</p>
              )}
              {systemAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 rounded-md border border-slate-100 px-3 py-2.5">
                  <div>
                    <p className="font-medium text-slate-800">{alert.title}</p>
                    <p className="text-xs text-slate-500">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}