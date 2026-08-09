// src/app/platform-admin/analytics/page.tsx
"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  newTenantsOverTime,
  mrrGrowth,
  moduleUsageByMonth,
  churnByPlan,
  totalChurnNote,
  topTenantsByActivity,
  atRiskTenants,
} from "@/lib/platform-analytics-data";

const naira = (n: number) => `\u20A6${n.toLocaleString("en-NG")}`;

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
      <p className="text-xs text-slate-500">{subtitle}</p>
      <div className="mt-4 h-56">{children}</div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const totalChurn = churnByPlan.reduce((sum, c) => sum + c.count, 0);

  return (
    <section className="space-y-5 bg-slate-50 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Analytics</h1>
          <p className="mt-1 text-sm text-slate-500">Platform-wide usage and growth metrics</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>From</span>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <span>To</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Chart grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="New Tenants Over Time" subtitle="Month-by-month onboarding">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={newTenantsOverTime}>
              <CartesianGrid vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} allowDecimals={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: "#e2e8f0" }} />
              <Line
                type="monotone"
                dataKey="tenants"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 4, fill: "#2563eb" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="MRR Growth" subtitle="Monthly recurring revenue trend">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mrrGrowth}>
              <defs>
                <linearGradient id="mrrFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickFormatter={(v) => `₦${(v / 1_000_000).toFixed(1)}M`}
              />
              <Tooltip formatter={(v: number) => naira(v)} contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: "#e2e8f0" }} />
              <Area type="monotone" dataKey="mrr" stroke="#2563eb" strokeWidth={2} fill="url(#mrrFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Module Usage by Month" subtitle="Tenants with each module active">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={moduleUsageByMonth} barSize={18}>
              <CartesianGrid vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} allowDecimals={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: "#e2e8f0" }} />
              <Bar dataKey="HRIS" fill="#60a5fa" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Accounting" fill="#a78bfa" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Payroll" fill="#fb923c" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 flex justify-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#60a5fa]" /> HRIS
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#a78bfa]" /> Accounting
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#fb923c]" /> Payroll
            </span>
          </div>
        </ChartCard>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800">Churn by Plan</h2>
          <p className="text-xs text-slate-500">Number of churned tenants per plan</p>
          <div className="mt-2 flex items-center gap-4">
            <div className="h-40 w-40 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={churnByPlan}
                    dataKey="count"
                    nameKey="plan"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={totalChurn > 0 ? 2 : 0}
                  >
                    {churnByPlan.map((entry) => (
                      <Cell key={entry.plan} fill={entry.count > 0 ? entry.color : "#e2e8f0"} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5">
              {churnByPlan.map((c) => (
                <div key={c.plan} className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  {c.plan}: <span className="font-medium text-slate-800">{c.count}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-400">{totalChurnNote}</p>
        </div>
      </div>

      {/* Top tenants by activity */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-800">Top Tenants by Activity</h2>
          <p className="text-xs text-slate-500">Most active companies this month</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-500">
                <th className="px-5 py-3 font-medium">#</th>
                <th className="px-5 py-3 font-medium">Company</th>
                <th className="px-5 py-3 font-medium">Last Login</th>
                <th className="px-5 py-3 font-medium">Sessions This Month</th>
                <th className="px-5 py-3 font-medium">Pages Visited</th>
              </tr>
            </thead>
            <tbody>
              {topTenantsByActivity.map((t) => {
                const maxSessions = topTenantsByActivity[0].sessionsThisMonth;
                const pct = Math.round((t.sessionsThisMonth / maxSessions) * 100);
                return (
                  <tr key={t.rank} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                    <td className="px-5 py-3 text-slate-400">#{t.rank}</td>
                    <td className="px-5 py-3 font-medium text-slate-800">{t.company}</td>
                    <td className="px-5 py-3 text-slate-500">{t.lastLogin}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-8 text-slate-700">{t.sessionsThisMonth}</span>
                        <div className="h-1.5 w-32 rounded-full bg-slate-100">
                          <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-700">{t.pagesVisited.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* At-risk tenants */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            At-Risk Tenants
          </h2>
          <p className="text-xs text-slate-500">Tenants with no activity in the last 3+ days</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-500">
                <th className="px-5 py-3 font-medium">Company</th>
                <th className="px-5 py-3 font-medium">Plan</th>
                <th className="px-5 py-3 font-medium">Last Active</th>
                <th className="px-5 py-3 font-medium">Days Inactive</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {atRiskTenants.map((t) => (
                <tr key={t.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <td className="px-5 py-3 font-medium text-slate-800">{t.company}</td>
                  <td className="px-5 py-3 text-slate-600">{t.plan}</td>
                  <td className="px-5 py-3 text-slate-500">{t.lastActive}</td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      {t.daysInactive} days
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                      {t.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button className="rounded-md bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100">
                      Send Check-in
                    </button>
                  </td>
                </tr>
              ))}

              {atRiskTenants.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-slate-400">
                    No at-risk tenants right now.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}