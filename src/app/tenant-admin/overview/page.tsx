// src/app/tenant-admin/dashboard/page.tsx
"use client";

type ActivityItem = {
  id: string;
  initials: string;
  initialsColor: string;
  text: string;
  actor: string;
  tag: string;
  time: string;
};

type ActiveModule = {
  id: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  name: string;
  status: "Active" | "Coming Soon";
  description: string;
};

type SystemAlert = {
  id: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
};

const recentActivity: ActivityItem[] = [
  {
    id: "act-1",
    initials: "AO",
    initialsColor: "bg-sky-100 text-sky-700",
    text: "Approved leave request for Emeka Nwosu",
    actor: "Amara Okafor",
    tag: "HRIS",
    time: "2 min ago",
  },
  {
    id: "act-2",
    initials: "AD",
    initialsColor: "bg-emerald-100 text-emerald-700",
    text: "Invited chukwudi@novapay.ng to platform",
    actor: "Admin",
    tag: "Admin",
    time: "18 min ago",
  },
  {
    id: "act-3",
    initials: "JM",
    initialsColor: "bg-amber-100 text-amber-700",
    text: "Raised payment request — ₦420,000",
    actor: "Jide Mensah",
    tag: "Accounting",
    time: "1 hr ago",
  },
  {
    id: "act-4",
    initials: "CO",
    initialsColor: "bg-violet-100 text-violet-700",
    text: "Updated department: Finance",
    actor: "Chiamaka Obi",
    tag: "Admin",
    time: "3 hrs ago",
  },
  {
    id: "act-5",
    initials: "BL",
    initialsColor: "bg-rose-100 text-rose-700",
    text: "Submitted conduct report for CS-004",
    actor: "Babajide Lawson",
    tag: "HRIS",
    time: "Yesterday",
  },
];

const activeModules: ActiveModule[] = [
  {
    id: "mod-hris",
    icon: "👥",
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    name: "HRIS",
    status: "Active",
    description: "Employee management, attendance, leave, appraisals",
  },
  {
    id: "mod-accounting",
    icon: "📈",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    name: "Accounting",
    status: "Active",
    description: "Invoicing, expenses, payments, tax, reports",
  },
  {
    id: "mod-payroll",
    icon: "📄",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-500",
    name: "Payroll",
    status: "Coming Soon",
    description: "Salary processing, deductions, payslips",
  },
];

const systemAlerts: SystemAlert[] = [
  {
    id: "alert-1",
    icon: "⚠️",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    title: "2 pending user invitations",
    subtitle: "Sent over 48 hours ago and not yet accepted.",
  },
  {
    id: "alert-2",
    icon: "🔔",
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    title: "Sinkronis v2.4 released",
    subtitle: "New features: Payroll module preview, audit log improvements.",
  },
  {
    id: "alert-3",
    icon: "✅",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    title: "Subscription active",
    subtitle: "Business plan · Renews 1 January 2027.",
  },
];

export default function TenantAdminDashboardPage() {
  return (
    <section className="space-y-6">
      {/* Welcome banner */}
      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-600">
            <span className="text-base font-semibold text-white">B</span>
          </div>
          <div>
            <p className="text-sm text-slate-500">Welcome back</p>
            <h1 className="text-xl font-semibold text-slate-900">
              Bravo Admin
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Sinkronis Tenant Admin · Last login: today at 08:47 AM
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm text-slate-500">Monday, 8 June 2026</p>
          <p className="mt-1 flex items-center justify-end gap-1.5 text-sm text-emerald-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            System operational
          </p>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>Total Users</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-sky-600">
              👤
            </span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900">48</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>Active Users</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              ✓
            </span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900">44</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>Active Modules</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-50 text-violet-600">
              ▦
            </span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900">2</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>Pending Invitations</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600">
              ✉
            </span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900">2</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-slate-800">
          Quick Actions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <button className="flex flex-col items-center justify-center gap-2 rounded-lg border border-sky-100 bg-sky-50 py-6 text-sm font-medium text-slate-700 hover:bg-sky-100">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sky-600 shadow-sm">
              ✉
            </span>
            Invite User
          </button>
          <button className="flex flex-col items-center justify-center gap-2 rounded-lg border border-violet-100 bg-violet-50 py-6 text-sm font-medium text-slate-700 hover:bg-violet-100">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-violet-600 shadow-sm">
              ▦
            </span>
            Manage Modules
          </button>
          <button className="flex flex-col items-center justify-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 py-6 text-sm font-medium text-slate-700 hover:bg-emerald-100">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
              📄
            </span>
            View Audit Log
          </button>
          <button className="flex flex-col items-center justify-center gap-2 rounded-lg border border-amber-100 bg-amber-50 py-6 text-sm font-medium text-slate-700 hover:bg-amber-100">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-amber-600 shadow-sm">
              🛡
            </span>
            Security Settings
          </button>
        </div>
      </div>

      {/* Recent Activity + right rail */}
      <div className="grid gap-4 xl:grid-cols-3">
        {/* Recent Activity */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm xl:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-semibold text-slate-800">
              Recent Activity
            </span>
            <button className="text-sm text-sky-600">View Audit Log &gt;</button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-3 py-3">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${item.initialsColor}`}
                >
                  {item.initials}
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-slate-800">
                    <span className="font-medium">{item.actor}</span>{" "}
                    {item.text}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {item.tag} · {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right rail */}
        <div className="space-y-4">
          {/* Active Modules */}
          <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-semibold text-slate-800">
                Active Modules
              </span>
            </div>
            <div className="space-y-2">
              {activeModules.map((mod) => (
                <div
                  key={mod.id}
                  className="flex items-center justify-between rounded-md border border-slate-100 px-3 py-2.5"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${mod.iconBg} ${mod.iconColor}`}
                    >
                      {mod.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-800">
                          {mod.name}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            mod.status === "Active"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {mod.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {mod.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-slate-300">&gt;</span>
                </div>
              ))}
            </div>
          </div>

          {/* System Alerts */}
          <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-semibold text-slate-800">
                System Alerts
              </span>
            </div>
            <div className="space-y-2">
              {systemAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 rounded-md border border-slate-100 px-3 py-2.5"
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${alert.iconBg} ${alert.iconColor} text-xs`}
                  >
                    {alert.icon}
                  </span>
                  <div>
                    <p className="font-medium text-slate-800">
                      {alert.title}
                    </p>
                    <p className="text-xs text-slate-500">{alert.subtitle}</p>
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