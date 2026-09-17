// src/app/platform-admin/tenants/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Users, Boxes, Clock } from "lucide-react";
import {
  getTenantById,
  getTenantUsers,
  getTenantModules,
  getTenantBilling,
  getTenantActivity,
  getTenantSupportTickets,
  suspendTenant,
  activateTenant,
  impersonateTenant,
  enableTenantModule,
  disableTenantModule,
} from "@/lib/api/platform-admin";
import {
  TenantDetailResponse,
  TenantUsersResponse,
  TenantModulesResponse,
  TenantBillingResponse,
  TenantActivityResponse,
  TenantSupportResponse,
} from "@/lib/api/types/platform-admin.types";

type Tab = "overview" | "users" | "modules" | "billing" | "activity" | "support";

const TABS: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "users", label: "Users" },
  { key: "modules", label: "Modules" },
  { key: "billing", label: "Billing" },
  { key: "activity", label: "Activity Log" },
  { key: "support", label: "Support" },
];

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-green-50 text-green-700",
  TRIAL: "bg-amber-50 text-amber-700",
  SUSPENDED: "bg-red-50 text-red-700",
};

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function TenantDetailPage({ params }: { params: { id: string } }) {
  const tenantId = params.id;

  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const [overview, setOverview] = useState<TenantDetailResponse["data"] | null>(null);
  const [users, setUsers] = useState<TenantUsersResponse["data"] | null>(null);
  const [modules, setModules] = useState<TenantModulesResponse["data"] | null>(null);
  const [billing, setBilling] = useState<TenantBillingResponse["data"] | null>(null);
  const [activity, setActivity] = useState<TenantActivityResponse["data"]>([]);
  const [support, setSupport] = useState<TenantSupportResponse["data"]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ov, us, mo, bi, ac, su] = await Promise.all([
        getTenantById(tenantId),
        getTenantUsers(tenantId),
        getTenantModules(tenantId),
        getTenantBilling(tenantId),
        getTenantActivity(tenantId),
        getTenantSupportTickets(tenantId),
      ]);
      setOverview(ov.data);
      setUsers(us.data);
      setModules(mo.data);
      setBilling(bi.data);
      setActivity(ac.data);
      setSupport(su.data);
    } catch (err) {
      setError("Failed to load tenant details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [tenantId]);

  const handleSuspendToggle = async () => {
    if (!overview) return;
    setActionLoading(true);
    try {
      if (overview.organization.subscriptionStatus === "SUSPENDED") {
        await activateTenant(tenantId);
      } else {
        await suspendTenant(tenantId);
      }
      await fetchAll();
    } catch (err) {
      alert("Action failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEnableModule = async (moduleKey: string) => {
  setActionLoading(true);
  try {
    await enableTenantModule(tenantId, moduleKey);
    await fetchAll();
  } catch (err: any) {
    alert(err?.response?.data?.message || "Failed to enable module.");
  } finally {
    setActionLoading(false);
  }
};

const handleDisableModule = async (moduleKey: string, moduleName: string) => {
  const reason = window.prompt(`Reason for disabling ${moduleName}:`);
  if (!reason) return;

  setActionLoading(true);
  try {
    await disableTenantModule(tenantId, moduleKey, reason);
    await fetchAll();
  } catch (err: any) {
    alert(err?.response?.data?.message || "Failed to disable module — it may conflict with the current plan or have active dependencies.");
  } finally {
    setActionLoading(false);
  }
};

  const handleImpersonate = async () => {
    setActionLoading(true);
    try {
      await impersonateTenant(tenantId);
      alert("Impersonation started.");
    } catch (err) {
      alert("Failed to start impersonation.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="p-6">
        <p className="text-sm text-slate-400">Loading tenant...</p>
      </section>
    );
  }

  if (error || !overview) {
    return (
      <section className="p-6">
        <p className="text-sm text-red-500">{error ?? "Tenant not found."}</p>
      </section>
    );
  }

  const { organization, summary } = overview;

  return (
    <section className="space-y-4 bg-slate-50 p-6">
      <Link
        href="/platform-admin/tenants"
        className="inline-flex items-center gap-1 text-sm text-sky-600 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Tenants
      </Link>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-slate-900">{organization.organizationName}</h1>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                {organization.currentPlan.name}
              </span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[organization.subscriptionStatus]}`}>
                {organization.subscriptionStatus}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-500">
              <span>Industry: <span className="text-slate-700">{organization.industry ?? "—"}</span></span>
              <span>Admin: <span className="text-slate-700">{organization.companyEmail}</span></span>
              <span>MRR: <span className="text-slate-700">₦{organization.monthlyRecurringRevenue.toLocaleString()}</span></span>
              <span>Country: <span className="text-slate-700">{organization.country}</span></span>
              <span>Created: <span className="text-slate-700">{formatDate(organization.createdAt)}</span></span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleImpersonate}
              disabled={actionLoading}
              className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              Impersonate Admin
            </button>
            <button
              onClick={handleSuspendToggle}
              disabled={actionLoading}
              className={`rounded-md px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60 ${
                organization.subscriptionStatus === "SUSPENDED"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {organization.subscriptionStatus === "SUSPENDED" ? "Activate Tenant" : "Suspend Tenant"}
            </button>
          </div>
        </div>

        <div className="mt-5 flex gap-6 border-b border-slate-100 text-sm">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`-mb-px border-b-2 pb-2 font-medium transition-colors ${
                activeTab === tab.key
                  ? "border-sky-600 text-sky-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-100 p-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Users className="h-4 w-4 text-sky-600" />
                Total Users
              </div>
              <p className="mt-2 text-2xl font-bold text-sky-600">{summary.totalUsers}</p>
            </div>
            <div className="rounded-lg border border-slate-100 p-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Boxes className="h-4 w-4 text-purple-600" />
                Active Modules
              </div>
              <p className="mt-2 text-2xl font-bold text-purple-600">{summary.activeModules.length}</p>
            </div>
            <div className="rounded-lg border border-slate-100 p-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="h-4 w-4 text-amber-600" />
                Days Since Last Login
              </div>
              <p className="mt-2 text-2xl font-bold text-amber-600">{summary.daysSinceLastLogin}</p>
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-slate-50 p-4">
            <h4 className="text-xs font-semibold text-slate-700">Primary Admin Contact</h4>
            <p className="mt-1 text-sm text-slate-600">
              Email: <span className="font-medium text-slate-800">{organization.companyEmail}</span>
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Last login: <span className="font-medium text-slate-800">{formatDate(summary.lastLoginDate)}</span>
            </p>
          </div>
        </div>
      )}

      {activeTab === "users" && users && (
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Users ({users.totalUsers})</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-500">
                  <th className="py-2 font-medium">Name</th>
                  <th className="py-2 font-medium">Email</th>
                  <th className="py-2 font-medium">Role</th>
                  <th className="py-2 font-medium">Last Active</th>
                  <th className="py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.users.map((user) => (
                  <tr key={user.userId} className="border-b border-slate-50 last:border-0">
                    <td className="py-3 font-medium text-slate-800">{user.fullName}</td>
                    <td className="py-3 text-slate-600">{user.email}</td>
                    <td className="py-3 text-slate-600">{user.role}</td>
                    <td className="py-3 text-slate-500">{formatDate(user.lastActive)}</td>
                    <td className="py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${user.accountStatus === "ACTIVE" ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                        {user.accountStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

<div className="mt-4  grid gap-4 sm:grid-cols-3">
  {modules.modules.map((mod) => {
    const isOn = mod.status === "ACTIVE";
    return (
      <div key={mod.moduleId} className="rounded-lg border border-slate-100 bg-white p-4">
        <div className="flex items-start justify-between">
          <h4 className="text-sm font-medium text-slate-800">{mod.moduleName}</h4>
          <button
            onClick={() =>
              isOn
                ? handleDisableModule(mod.moduleId, mod.moduleName)
                : handleEnableModule(mod.moduleId)
            }
            disabled={actionLoading}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-60 ${
              isOn ? "bg-sky-600" : "bg-slate-200"
            }`}
            aria-pressed={isOn}
            aria-label={`Toggle ${mod.moduleName}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                isOn ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          {mod.includedInPlan ? "Included in current plan" : "Add-on module"}
        </p>
        <span
          className={`mt-3 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
            isOn ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"
          }`}
        >
          {mod.status}
        </span>
      </div>
    );
  })}
</div>
      {activeTab === "billing" && billing && (
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Billing</h3>
          <p className="text-xs text-slate-500">
            Current plan: {billing.currentSubscription.currentPlan.name} — ₦{billing.currentSubscription.monthlyCost.toLocaleString()}/month ({billing.currentSubscription.billingCycle})
          </p>
          <p className="mt-1 text-xs text-slate-500">Renews: {formatDate(billing.currentSubscription.renewalDate)}</p>

          <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
  <thead>
    <tr className="border-b border-slate-100 text-xs text-slate-500">
      <th className="py-2 font-medium">Invoice</th>
      <th className="py-2 font-medium">Period</th>
      <th className="py-2 font-medium">Amount</th>
      <th className="py-2 font-medium">Status</th>
      <th className="py-2 font-medium">Date</th>
    </tr>
  </thead>
  <tbody>
    {billing.invoices.length === 0 ? (
      <tr>
        <td colSpan={5} className="py-6 text-center text-sm text-slate-400">No invoices yet.</td>
      </tr>
    ) : (
      billing.invoices.map((invoice) => (
        <tr key={invoice.invoiceId} className="border-b border-slate-50 last:border-0">
          <td className="py-3 font-medium text-sky-600">{invoice.invoiceIdentifier}</td>
          <td className="py-3 text-slate-600">{invoice.billingPeriod}</td>
          <td className="py-3 text-slate-700">₦{invoice.amount.toLocaleString()}</td>
          <td className="py-3">
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              invoice.paymentStatus === "PAID" ? "bg-green-50 text-green-700" :
              invoice.paymentStatus === "PENDING" ? "bg-amber-50 text-amber-700" :
              "bg-red-50 text-red-700"
            }`}>
              {invoice.paymentStatus}
            </span>
          </td>
          <td className="py-3 text-slate-500">{formatDate(invoice.invoiceDate)}</td>
        </tr>
      ))
    )}
  </tbody>
</table>
          </div>
        </div>
      )}

      {activeTab === "activity" && (
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Activity Log</h3>
          <ul className="mt-4 space-y-4">
            {activity.length === 0 && <li className="text-sm text-slate-400">No activity yet.</li>}
            {activity.map((event) => (
              <li key={event.activityId} className="flex items-start justify-between gap-4 border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                <div className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-600" />
                  <div>
                    <p className="text-sm text-slate-700">{event.description}</p>
                    <p className="text-xs italic text-slate-400">by {event.performedBy.name}</p>
                  </div>
                </div>
                <span className="whitespace-nowrap text-xs text-slate-400">{formatDate(event.timestamp)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
{activeTab === "support" && (
  <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <h3 className="text-sm font-semibold text-slate-900">Support Tickets ({support.length})</h3>
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-xs text-slate-500">
            <th className="py-2 font-medium">Ticket</th>
            <th className="py-2 font-medium">Subject</th>
            <th className="py-2 font-medium">Priority</th>
            <th className="py-2 font-medium">Status</th>
            <th className="py-2 font-medium">Assigned To</th>
            <th className="py-2 font-medium">Updated</th>
          </tr>
        </thead>
        <tbody>
          {support.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-6 text-center text-sm text-slate-400">No support tickets.</td>
            </tr>
          ) : (
            support.map((ticket) => (
              <tr key={ticket.ticketId} className="border-b border-slate-50 last:border-0">
                <td className="py-3 font-medium text-sky-600">{ticket.ticketNumber}</td>
                <td className="py-3 text-slate-700">{ticket.subject}</td>
                <td className="py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    ticket.priority === "HIGH" ? "bg-red-50 text-red-700" :
                    ticket.priority === "MEDIUM" ? "bg-amber-50 text-amber-700" :
                    "bg-slate-100 text-slate-600"
                  }`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ticket.status === "OPEN" ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="py-3 text-slate-500">{ticket.assignedTo.name}</td>
                <td className="py-3 text-slate-500">{formatDate(ticket.updatedAt)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
)}
    </section>
  );
}