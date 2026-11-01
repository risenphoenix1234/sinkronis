// src/app/platform-admin/overview/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowUpCircle,
  Boxes,
  Building2,
  CheckCircle2,
  Plus,
  RefreshCw,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getPlatformDashboard } from "@/lib/api/platform-admin";
import { PlatformDashboard } from "@/lib/api/types/platform-admin.types";
import Loader from "@/components/ui/Loader";

function formatNaira(value: number) {
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `₦${Math.round(value / 1_000)}K`;
  return `₦${Math.round(value)}`;
}

function RevenueTrendChart({ months }: { months: { month: string; monthlyRevenue: number }[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [width, setWidth] = useState(560);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setWidth(el.clientWidth);
    const observer = new ResizeObserver(() => setWidth(el.clientWidth));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const height = 260;
  const paddingLeft = 64;
  const paddingBottom = 28;
  const paddingTop = 12;
  const chartWidth = Math.max(width - paddingLeft, 1);
  const chartHeight = height - paddingBottom - paddingTop;
  const slot = chartWidth / Math.max(months.length, 1);
  const barWidth = Math.min(slot * 0.5, 40);

  const max = Math.max(...months.map((m) => m.monthlyRevenue), 1);
  const yTicks = [0, max * 0.25, max * 0.5, max * 0.75, max];

  return (
    <div ref={containerRef} className="relative">
      <svg width={width} height={height} role="img" aria-label="Monthly revenue trend">
        {yTicks.map((tick, i) => {
          const y = paddingTop + chartHeight - (tick / max) * chartHeight;
          return (
            <text key={i} x={paddingLeft - 10} y={y + 4} textAnchor="end" fontSize={12} fill="#919EAB">
              {formatNaira(tick)}
            </text>
          );
        })}

        {months.map((point, i) => {
          const barHeight = (point.monthlyRevenue / max) * chartHeight;
          const x = paddingLeft + i * slot + (slot - barWidth) / 2;
          const y = paddingTop + chartHeight - barHeight;
          const isHovered = hovered === i;

          return (
            <g key={point.month}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(barHeight, 2)}
                rx={3}
                fill={isHovered ? "#1c72ab" : "#2183C6"}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer transition-colors"
              />
              <text x={x + barWidth / 2} y={height - 8} textAnchor="middle" fontSize={12} fill="#919EAB">
                {point.month.slice(0, 3)}
              </text>
            </g>
          );
        })}
      </svg>

      {hovered !== null && (
        <div
          className="pointer-events-none absolute top-0 rounded-md border border-[#F2F3F5] bg-white px-3 py-1.5 text-xs shadow-sm"
          style={{
            left: paddingLeft + hovered * slot + slot / 2,
            transform: "translate(-50%, 0)",
          }}
        >
          <p className="font-medium text-[#212B36]">{months[hovered].month}</p>
          <p className="text-[#637381]">₦{months[hovered].monthlyRevenue.toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-[#E8F5E9] text-[#2E7D32]",
  TRIAL: "bg-[#FFF8E1] text-[#F57F17]",
  SUSPENDED: "bg-[#FFEBEE] text-[#C62828]",
  EXPIRED: "bg-[#F2F3F5] text-[#637381]",
};

const statusLabel = (status: string) =>
  status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : "—";

function planStyle(name: string) {
  const key = name.toLowerCase();
  if (key.includes("enterprise")) return "bg-[#F3E5F5] text-[#7B1FA2]";
  if (key.includes("growth")) return "bg-[#E3F2FD] text-[#2183C6]";
  if (key.includes("trial")) return "bg-[#FFF8E1] text-[#F57F17]";
  return "bg-[#F4F6F8] text-[#637381]";
}

function activityIcon(eventType: string): LucideIcon {
  const type = eventType.toUpperCase();
  if (type.includes("UPGRADE")) return ArrowUpCircle;
  if (type.includes("TRIAL") || type.includes("CREATED") || type.includes("ONBOARD")) return Sparkles;
  if (type.includes("MODULE")) return Plus;
  if (type.includes("RENEW")) return RefreshCw;
  if (type.includes("USER")) return Users;
  return Activity;
}

function timeAgo(timestamp: string) {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}

export default function PlatformAdminOverviewPage() {
  const router = useRouter();
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
      <section className="min-h-[calc(100vh-5rem)] bg-[#F4F6F8] p-6">
        <Loader variant="section" label="Loading dashboard" />
      </section>
    );
  }

  if (error || !dashboard) {
    return (
      <section className="min-h-[calc(100vh-5rem)] bg-[#F4F6F8] p-6">
        <p className="text-sm text-red-500">{error ?? "No data available."}</p>
      </section>
    );
  }

  const { analytics, revenueTrend, moduleAdoption, recentActivity, tenantHealth } = dashboard;

  const stats = [
    { label: "Total Tenants", value: analytics.totalTenants, icon: Building2, iconBg: "bg-[#2183C6]/10", iconColor: "text-[#2183C6]" },
    { label: "Active This Month", value: analytics.activeTenants, icon: CheckCircle2, iconBg: "bg-[#2E7D32]/10", iconColor: "text-[#2E7D32]" },
    { label: "Total Users", value: analytics.totalUsers, icon: Users, iconBg: "bg-[#7B1FA2]/10", iconColor: "text-[#7B1FA2]" },
    { label: "Platform MRR", value: `₦${analytics.platformMrr.toLocaleString()}`, icon: Wallet, iconBg: "bg-[#F57F17]/10", iconColor: "text-[#F57F17]" },
    { label: "Avg Modules/Tenant", value: analytics.averageModulesPerTenant, icon: Boxes, iconBg: "bg-[#0288D1]/10", iconColor: "text-[#0288D1]" },
  ];

  return (
    <section className="min-h-[calc(100vh-5rem)] space-y-8 bg-[#F4F6F8] p-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#212B36]">Platform Dashboard</h1>
        <p className="mt-1 text-sm text-[#637381]">Sinkronis tenant overview</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-[#F2F3F5] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.iconBg}`}>
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </span>
              <h2 className="text-xs font-medium text-[#637381]">{stat.label}</h2>
            </div>
            <p className="mt-3 text-2xl font-bold text-[#212B36]">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.85fr_1fr_1fr]">
        <div className="rounded-lg border border-[#F2F3F5] bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-[#212B36]">Revenue Trend</h3>
          <p className="text-xs text-[#637381]">Monthly MRR — last 6 months</p>
          <div className="mt-4">
            <RevenueTrendChart months={revenueTrend.months} />
          </div>
        </div>

        <div className="rounded-lg border border-[#F2F3F5] bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-[#212B36]">Module Adoption</h3>
          <p className="text-xs text-[#637381]">Tenants using each module</p>
          <div className="mt-5 space-y-4">
            {moduleAdoption.modules.map((mod) => (
              <div key={mod.moduleId}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#212B36]">{mod.moduleName}</span>
                  <span className="text-[#637381]">
                    {mod.tenantCount}/{moduleAdoption.totalActiveTenants} ({Math.round(mod.percentageAdoption)}%)
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-[#F4F6F8]">
                  <div className="h-1.5 rounded-full bg-[#2183C6]" style={{ width: `${mod.percentageAdoption}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-[#F2F3F5] bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-[#212B36]">Recent Activity</h3>
          <p className="text-xs text-[#637381]">Latest platform events</p>
          <ul className="mt-2">
            {recentActivity.length === 0 && (
              <li className="py-3 text-sm text-[#919EAB]">No recent activity.</li>
            )}
            {recentActivity.map((item) => {
              const Icon = activityIcon(item.eventType);
              return (
                <li
                  key={item.activityId}
                  className="flex items-start gap-3 border-b border-dotted border-[#EBEEF0] py-3.5 last:border-0"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-[#2183C6]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm text-[#212B36]">{item.description}</p>
                    <p className="text-xs text-[#919EAB]">{timeAgo(item.timestamp)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="rounded-lg border border-[#F2F3F5] bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-[#212B36]">Tenant Health</h3>
        <p className="text-xs text-[#637381]">Click a row to view full tenant details</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#EBEEF0] text-xs text-[#637381]">
                <th className="px-3 py-2 font-medium">Company</th>
                <th className="px-3 py-2 font-medium">Plan</th>
                <th className="px-3 py-2 font-medium">Users</th>
                <th className="px-3 py-2 font-medium">Modules</th>
                <th className="px-3 py-2 font-medium">Last Active</th>
                <th className="px-3 py-2 font-medium">MRR ₦</th>
                <th className="px-3 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {tenantHealth.records.map((tenant) => (
                <tr
                  key={tenant.organizationId}
                  onClick={() => router.push(`/platform-admin/tenants/${tenant.organizationId}`)}
                  className="cursor-pointer even:bg-[#F2F2F7]"
                >
                  <td className="px-3 py-3 font-medium text-[#212B36]">{tenant.organizationName}</td>
                  <td className="px-3 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${planStyle(tenant.currentPlan.name)}`}>
                      {tenant.currentPlan.name}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-[#212B36]">{tenant.userCount}</td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1">
                      {tenant.activeModules.length === 0 && <span className="text-xs text-[#919EAB]">—</span>}
                      {tenant.activeModules.map((mod) => (
                        <span key={mod.key} className="rounded-full bg-[#E3F2FD] px-2 py-1 text-xs font-medium text-[#2183C6]">
                          {mod.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-[#637381]">
                    {tenant.lastActiveDate
                      ? new Date(tenant.lastActiveDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                      : "—"}
                  </td>
                  <td className="px-3 py-3 text-[#212B36]">₦{tenant.monthlyRecurringRevenue.toLocaleString()}</td>
                  <td className="px-3 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusStyles[tenant.subscriptionStatus] ?? "bg-[#F2F3F5] text-[#637381]"}`}>
                      {statusLabel(tenant.subscriptionStatus)}
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