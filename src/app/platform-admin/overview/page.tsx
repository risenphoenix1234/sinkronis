// src/app/platform-admin/overview/page.tsx
"use client";

import { useState } from "react";
import {
  Building2,
  CheckCircle2,
  Users,
  Wallet,
  Boxes,
  Plus,
  RefreshCcw,
  UserPlus2,
  FlaskConical,
} from "lucide-react";

const stats = [
  { label: "Total Tenants", value: "6", icon: Building2, iconBg: "bg-brand-50", iconColor: "text-brand-600" },
  { label: "Active This Month", value: "5", icon: CheckCircle2, iconBg: "bg-green-50", iconColor: "text-green-600" },
  { label: "Total Users", value: "519", icon: Users, iconBg: "bg-purple-50", iconColor: "text-purple-600" },
  { label: "Platform MRR", value: "₦1,670,000", icon: Wallet, iconBg: "bg-amber-50", iconColor: "text-amber-600" },
  { label: "Avg Modules/Tenant", value: "2.5", icon: Boxes, iconBg: "bg-indigo-50", iconColor: "text-indigo-600" },
];

const revenueTrend = [
  { month: "Feb", mrr: 1150000 },
  { month: "Mar", mrr: 1250000 },
  { month: "Apr", mrr: 1350000 },
  { month: "May", mrr: 1500000 },
  { month: "Jun", mrr: 1600000 },
  { month: "Jul", mrr: 1670000 },
];

const REVENUE_MAX = 1800000;
const Y_TICKS = [0, 500000, 900000, 1400000, 1800000];

function formatNaira(value: number) {
  return `₦${(value / 1_000_000).toFixed(1)}M`;
}

function RevenueTrendChart() {
  const [hovered, setHovered] = useState<number | null>(null);

  const width = 640;
  const height = 220;
  const paddingLeft = 56;
  const paddingBottom = 24;
  const chartWidth = width - paddingLeft;
  const chartHeight = height - paddingBottom;
  const barGap = 24;
  const barWidth =
    (chartWidth - barGap * (revenueTrend.length - 1)) / revenueTrend.length;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        role="img"
        aria-label="Monthly revenue trend"
      >
        {Y_TICKS.map((tick) => {
          const y = chartHeight - (tick / REVENUE_MAX) * chartHeight;
          return (
            <g key={tick}>
              <line x1={paddingLeft} x2={width} y1={y} y2={y} stroke="#f1f5f9" strokeWidth={1} />
              <text x={paddingLeft - 8} y={y + 4} textAnchor="end" fontSize={11} fill="#94a3b8">
                {formatNaira(tick)}
              </text>
            </g>
          );
        })}

        {revenueTrend.map((point, i) => {
          const barHeight = (point.mrr / REVENUE_MAX) * chartHeight;
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
                {point.month}
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
          <p className="font-medium text-slate-700">{revenueTrend[hovered].month}</p>
          <p className="text-slate-500">₦{revenueTrend[hovered].mrr.toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}

const moduleAdoption = [
  { name: "HRIS", used: 5, total: 6 },
  { name: "Accounting", used: 4, total: 6 },
  { name: "Payroll", used: 4, total: 6 },
];

const recentActivity = [
  { icon: Building2, iconColor: "text-brand-600", text: "Nova Healthcare upgraded to Enterprise", time: "2 days ago" },
  { icon: FlaskConical, iconColor: "text-amber-600", text: "Sterling Logistics started a Trial", time: "9 days ago" },
  { icon: Plus, iconColor: "text-green-600", text: "Kainos Technologies added Payroll module", time: "12 days ago" },
  { icon: RefreshCcw, iconColor: "text-brand-600", text: "Pinnacle Foods renewed Growth plan", time: "17 days ago" },
  { icon: UserPlus2, iconColor: "text-indigo-600", text: "Bravo Group added 8 new users", time: "21 days ago" },
];

type Plan = "Growth" | "Enterprise" | "Starter" | "Trial";

const planStyles: Record<Plan, string> = {
  Growth: "bg-brand-50 text-brand-700",
  Enterprise: "bg-purple-50 text-purple-700",
  Starter: "bg-slate-100 text-slate-600",
  Trial: "bg-amber-50 text-amber-700",
};

const moduleStyles: Record<string, string> = {
  HRIS: "bg-brand-50 text-brand-700",
  Accounting: "bg-purple-50 text-purple-700",
  Payroll: "bg-green-50 text-green-700",
};

const tenants: {
  company: string;
  plan: Plan;
  users: number;
  modules: string[];
  lastActive: string;
  mrr: string;
  status: "Active" | "Trial";
}[] = [
  { company: "Bravo Group", plan: "Growth", users: 42, modules: ["HRIS", "Accounting", "Payroll"], lastActive: "7 Jul 2026", mrr: "₦185,000", status: "Active" },
  { company: "Kainos Technologies", plan: "Enterprise", users: 180, modules: ["HRIS", "Accounting", "Payroll"], lastActive: "6 Jul 2026", mrr: "₦540,000", status: "Active" },
  { company: "Zenith Ventures", plan: "Starter", users: 12, modules: ["HRIS"], lastActive: "5 Jul 2026", mrr: "₦45,000", status: "Active" },
  { company: "Pinnacle Foods", plan: "Growth", users: 67, modules: ["HRIS", "Payroll"], lastActive: "7 Jul 2026", mrr: "₦220,000", status: "Active" },
  { company: "Sterling Logistics", plan: "Trial", users: 8, modules: ["Accounting"], lastActive: "2 Jul 2026", mrr: "₦0", status: "Trial" },
  { company: "Nova Healthcare", plan: "Enterprise", users: 210, modules: ["HRIS", "Accounting", "Payroll"], lastActive: "7 Jul 2026", mrr: "₦680,000", status: "Active" },
];

export default function PlatformAdminOverviewPage() {
  return (
    <section className="space-y-6 bg-slate-50 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Platform Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Sinkronis tenant overview — July 2026</p>
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
            <RevenueTrendChart />
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Module Adoption</h3>
          <p className="text-xs text-slate-500">Tenants using each module</p>
          <div className="mt-5 space-y-4">
            {moduleAdoption.map((mod) => {
              const pct = Math.round((mod.used / mod.total) * 100);
              return (
                <div key={mod.name}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{mod.name}</span>
                    <span className="text-slate-500">{mod.used}/{mod.total} ({pct}%)</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-100">
                    <div className="h-1.5 rounded-full bg-brand-600" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Recent Activity</h3>
          <p className="text-xs text-slate-500">Latest platform events</p>
          <ul className="mt-4 space-y-4">
            {recentActivity.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5">
                  <item.icon className={`h-4 w-4 ${item.iconColor}`} />
                </span>
                <div>
                  <p className="text-sm text-slate-700">{item.text}</p>
                  <p className="text-xs text-slate-400">{item.time}</p>
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
              {tenants.map((tenant) => (
                <tr key={tenant.company} className="cursor-pointer border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <td className="py-3 font-medium text-slate-800">{tenant.company}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${planStyles[tenant.plan]}`}>
                      {tenant.plan}
                    </span>
                  </td>
                  <td className="py-3 text-slate-700">{tenant.users}</td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-1">
                      {tenant.modules.map((mod) => (
                        <span key={mod} className={`rounded-full px-2 py-0.5 text-xs font-medium ${moduleStyles[mod]}`}>
                          {mod}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 text-slate-500">{tenant.lastActive}</td>
                  <td className="py-3 text-slate-700">{tenant.mrr}</td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        tenant.status === "Active" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {tenant.status}
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