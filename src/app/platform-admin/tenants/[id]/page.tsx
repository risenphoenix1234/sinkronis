// src/app/platform-admin/tenants/[id]/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Boxes,
  Clock,
  KeyRound,
  UserX,
  UserCheck,
} from "lucide-react";
import {
  getTenant,
  planStyles,
  statusStyles,
  naira,
  ModuleName,
  Plan,
} from "@/lib/pa-tenants-data";
import OverridePlanModal from "@/components/modals/OverridePlanModal";

type Tab = "overview" | "users" | "modules" | "billing" | "activity" | "support";

const moduleInfo: Record<ModuleName, { label: string; description: string }> = {
  HRIS: {
    label: "HRIS",
    description: "Employee records, leave management, onboarding workflows",
  },
  Accounting: {
    label: "Accounting",
    description: "Invoicing, chart of accounts, financial reporting",
  },
  Payroll: {
    label: "Payroll",
    description: "Salary processing, PAYE calculations, payslip generation",
  },
};

const invoiceStatusStyles: Record<string, string> = {
  Paid: "bg-green-50 text-green-700",
  Pending: "bg-amber-50 text-amber-700",
  Failed: "bg-red-50 text-red-700",
};

const priorityStyles: Record<string, string> = {
  Low: "bg-slate-100 text-slate-600",
  Medium: "bg-amber-50 text-amber-700",
  High: "bg-red-50 text-red-700",
};

const ticketStatusStyles: Record<string, string> = {
  Open: "bg-amber-50 text-amber-700",
  Closed: "bg-green-50 text-green-700",
};

const TABS: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "users", label: "Users" },
  { key: "modules", label: "Modules" },
  { key: "billing", label: "Billing" },
  { key: "activity", label: "Activity Log" },
  { key: "support", label: "Support" },
];

export default function TenantDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const seed = getTenant(params.id) ?? getTenant("zenith-ventures")!;

  const [tenant, setTenant] = useState(seed);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [showOverrideModal, setShowOverrideModal] = useState(false);

  const activeModuleCount = useMemo(
    () => Object.values(tenant.activeModules).filter(Boolean).length,
    [tenant.activeModules]
  );

  const toggleSuspend = () => {
    setTenant((prev) => ({
      ...prev,
      status: prev.status === "Suspended" ? "Active" : "Suspended",
    }));
  };

  const toggleModule = (mod: ModuleName) => {
    setTenant((prev) => ({
      ...prev,
      activeModules: {
        ...prev.activeModules,
        [mod]: !prev.activeModules[mod],
      },
    }));
  };

  const toggleUserStatus = (email: string) => {
    setTenant((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.email === email
          ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" }
          : u
      ),
    }));
  };

  const applyOverride = (newPlan: string) => {
    setTenant((prev) => ({ ...prev, plan: newPlan as Plan }));
  };

  return (
    <section className="space-y-4 bg-slate-50 p-6">
      <Link
        href="/platform-admin/tenants"
        className="inline-flex items-center gap-1 text-sm text-brand-600 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Tenants
      </Link>

      {/* Tenant header */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-slate-900">
                {tenant.company}
              </h1>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${planStyles[tenant.plan]}`}
              >
                {tenant.plan}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[tenant.status]}`}
              >
                {tenant.status}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-500">
              <span>
                Industry: <span className="text-slate-700">{tenant.industry}</span>
              </span>
              <span>
                Admin: <span className="text-slate-700">{tenant.adminEmail}</span>
              </span>
              <span>
                MRR: <span className="text-slate-700">{naira(tenant.mrr)}</span>
              </span>
              <span>
                Country: <span className="text-slate-700">{tenant.country}</span>
              </span>
              <span>
                Created: <span className="text-slate-700">{tenant.createdDate}</span>
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
              Impersonate Admin
            </button>
            <button
              onClick={toggleSuspend}
              className={`rounded-md px-3 py-1.5 text-xs font-medium text-white ${
                tenant.status === "Suspended"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {tenant.status === "Suspended" ? "Activate Tenant" : "Suspend Tenant"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-5 flex gap-6 border-b border-slate-100 text-sm">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`-mb-px border-b-2 pb-2 font-medium transition-colors ${
                activeTab === tab.key
                  ? "border-brand-600 text-brand-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-100 p-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Users className="h-4 w-4 text-brand-600" />
                Total Users
              </div>
              <p className="mt-2 text-2xl font-bold text-brand-600">
                {tenant.users.length}
              </p>
            </div>
            <div className="rounded-lg border border-slate-100 p-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Boxes className="h-4 w-4 text-purple-600" />
                Active Modules
              </div>
              <p className="mt-2 text-2xl font-bold text-purple-600">
                {activeModuleCount}
              </p>
            </div>
            <div className="rounded-lg border border-slate-100 p-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="h-4 w-4 text-amber-600" />
                Days Since Last Login
              </div>
              <p className="mt-2 text-2xl font-bold text-amber-600">2</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-900">
              About {tenant.company}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {tenant.about}
            </p>
          </div>

          <div className="mt-6 rounded-lg bg-slate-50 p-4">
            <h4 className="text-xs font-semibold text-slate-700">
              Primary Admin Contact
            </h4>
            <p className="mt-1 text-sm text-slate-600">
              Email:{" "}
              <span className="font-medium text-slate-800">
                {tenant.adminEmail}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Users */}
      {activeTab === "users" && (
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">
            Users ({tenant.users.length})
          </h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-500">
                  <th className="py-2 font-medium">Name</th>
                  <th className="py-2 font-medium">Email</th>
                  <th className="py-2 font-medium">Role</th>
                  <th className="py-2 font-medium">Last Active</th>
                  <th className="py-2 font-medium">Status</th>
                  <th className="py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tenant.users.map((user) => (
                  <tr key={user.email} className="border-b border-slate-50 last:border-0">
                    <td className="py-3 font-medium text-slate-800">{user.name}</td>
                    <td className="py-3 text-slate-600">{user.email}</td>
                    <td className="py-3 text-slate-600">{user.role}</td>
                    <td className="py-3 text-slate-500">{user.lastActive}</td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          user.status === "Active"
                            ? "bg-green-50 text-green-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleUserStatus(user.email)}
                          className="flex items-center gap-1 text-xs font-medium text-amber-600 hover:underline"
                        >
                          {user.status === "Active" ? (
                            <>
                              <UserX className="h-3.5 w-3.5" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-3.5 w-3.5" />
                              Activate
                            </>
                          )}
                        </button>
                        <button className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline">
                          <KeyRound className="h-3.5 w-3.5" />
                          Reset PW
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modules */}
      {activeTab === "modules" && (
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Module Access</h3>
          <p className="text-xs text-slate-500">
            Toggle modules on or off for this tenant. Changes apply immediately.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {(Object.keys(moduleInfo) as ModuleName[]).map((mod) => {
              const enabled = tenant.activeModules[mod];
              return (
                <div key={mod} className="rounded-lg border border-slate-100 p-4">
                  <div className="flex items-start justify-between">
                    <h4 className="text-sm font-medium text-slate-800">
                      {moduleInfo[mod].label}
                    </h4>
                    <button
                      onClick={() => toggleModule(mod)}
                      className={`relative h-5 w-9 rounded-full transition-colors ${
                        enabled ? "bg-brand-600" : "bg-slate-200"
                      }`}
                      aria-pressed={enabled}
                      aria-label={`Toggle ${mod}`}
                    >
                      <span
                        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                          enabled ? "translate-x-4" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    {moduleInfo[mod].description}
                  </p>
                  <span
                    className={`mt-3 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      enabled
                        ? "bg-green-50 text-green-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {enabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Billing */}
      {activeTab === "billing" && (
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Billing History</h3>
              <p className="text-xs text-slate-500">
                Current plan: {tenant.plan} — {naira(tenant.mrr)}/month
              </p>
            </div>
            <button
              onClick={() => setShowOverrideModal(true)}
              className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Override Plan
            </button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-500">
                  <th className="py-2 font-medium">Invoice ID</th>
                  <th className="py-2 font-medium">Period</th>
                  <th className="py-2 font-medium">Amount ₦</th>
                  <th className="py-2 font-medium">Status</th>
                  <th className="py-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {tenant.invoices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-sm text-slate-400">
                      No invoices yet.
                    </td>
                  </tr>
                ) : (
                  tenant.invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-slate-50 last:border-0">
                      <td className="py-3 font-medium text-brand-600">{invoice.id}</td>
                      <td className="py-3 text-slate-600">{invoice.period}</td>
                      <td className="py-3 text-slate-700">{naira(invoice.amount)}</td>
                      <td className="py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${invoiceStatusStyles[invoice.status]}`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td className="py-3 text-slate-500">{invoice.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Activity Log */}
      {activeTab === "activity" && (
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Activity Log</h3>
          <ul className="mt-4 space-y-4">
            {tenant.activity.map((event, i) => (
              <li
                key={i}
                className="flex items-start justify-between gap-4 border-b border-slate-50 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                  <div>
                    <p className="text-sm text-slate-700">{event.text}</p>
                    <p className="text-xs italic text-slate-400">by {event.by}</p>
                  </div>
                </div>
                <span className="whitespace-nowrap text-xs text-slate-400">{event.at}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Support */}
      {activeTab === "support" && (
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">
            Support Tickets ({tenant.tickets.length})
          </h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-500">
                  <th className="py-2 font-medium">Ticket ID</th>
                  <th className="py-2 font-medium">Subject</th>
                  <th className="py-2 font-medium">Priority</th>
                  <th className="py-2 font-medium">Status</th>
                  <th className="py-2 font-medium">Assigned To</th>
                  <th className="py-2 font-medium">Updated</th>
                </tr>
              </thead>
              <tbody>
                {tenant.tickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-sm text-slate-400">
                      No support tickets.
                    </td>
                  </tr>
                ) : (
                  tenant.tickets.map((ticket) => (
                    <tr key={ticket.id} className="border-b border-slate-50 last:border-0">
                      <td className="py-3 font-medium text-brand-600">{ticket.id}</td>
                      <td className="py-3 text-slate-700">{ticket.subject}</td>
                      <td className="py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityStyles[ticket.priority]}`}
                        >
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${ticketStatusStyles[ticket.status]}`}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td className="py-3 text-slate-500">{ticket.assignedTo}</td>
                      <td className="py-3 text-slate-500">{ticket.updated}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showOverrideModal && (
       <OverridePlanModal
  open={showOverrideModal}
  currentPlanLabel={`${tenant.plan} — ${naira(tenant.mrr)}/month`}
  onClose={() => setShowOverrideModal(false)}
  onApply={applyOverride}
/>
      )}
    </section>
  );
}