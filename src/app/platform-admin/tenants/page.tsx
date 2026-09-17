"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus, Eye, Ban } from "lucide-react";
import { getTenants, createTenant, suspendTenant } from "@/lib/api/platform-admin";
import { Tenant } from "@/lib/api/types/platform-admin.types";
import AddTenantModal, { NewTenantInput } from "@/components/modals/AddTenantModal";

const ALL_MODULES = ["HRIS", "Accounting", "Payroll"];

const naira = (n: number) => `₦${n.toLocaleString()}`;

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-600",
  TRIAL: "bg-amber-50 text-amber-600",
  SUSPENDED: "bg-red-50 text-red-600",
};

const moduleStyles: Record<string, string> = {
  HRIS: "bg-sky-50 text-sky-600",
  Accounting: "bg-violet-50 text-violet-600",
  Payroll: "bg-orange-50 text-orange-600",
};

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchTenants = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTenants({
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        module: moduleFilter || undefined,
      });
      setTenants(res.data);
    } catch (err) {
      setError("Failed to load tenants.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(fetchTenants, 400);
    return () => clearTimeout(debounce);
  }, [searchTerm, statusFilter, moduleFilter]);

  useEffect(() => {
    if (!successMessage) return;
    const timeout = setTimeout(() => setSuccessMessage(null), 6000);
    return () => clearTimeout(timeout);
  }, [successMessage]);

  const handleAddTenant = async (input: NewTenantInput) => {
    await createTenant({
      companyName: input.companyName,
      adminEmail: input.adminEmail,
      subscriptionPlan: input.subscriptionPlan as any,
      country: input.country,
      industry: input.industry,
    });
    setShowModal(false);
    setSuccessMessage(
      "Tenant created successfully. Password setup instructions would be sent to the Tenant Admin."
    );
    fetchTenants();
  };

  const handleSuspend = async (tenantId: string) => {
    try {
      await suspendTenant(tenantId);
      fetchTenants();
    } catch (err) {
      alert("Failed to suspend tenant.");
    }
  };

  return (
    <section className="space-y-4 bg-slate-50 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Tenants</h1>
          <p className="mt-1 text-sm text-slate-500">
            All companies on the Sinkronis platform
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
        >
          <Plus className="h-4 w-4" />
          Add Tenant
        </button>
      </div>

      {successMessage && (
        <div className="rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by company, email or industry..."
            className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="TRIAL">Trial</option>
          <option value="SUSPENDED">Suspended</option>
        </select>

        <select
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
        >
          <option value="">All Modules</option>
          {ALL_MODULES.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs text-slate-500">
              <th className="px-5 py-3 font-medium">Company</th>
              <th className="px-5 py-3 font-medium">Plan</th>
              <th className="px-5 py-3 font-medium">Modules</th>
              <th className="px-5 py-3 font-medium">Users</th>
              <th className="px-5 py-3 font-medium">MRR</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Last Active</th>
              <th className="px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="px-5 py-10 text-center text-sm text-slate-400">
                  Loading tenants...
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={8} className="px-5 py-10 text-center text-sm text-red-500">
                  {error}
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              tenants.map((tenant) => (
                <tr
                  key={tenant.organizationId}
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50"
                >
                  <td className="px-5 py-3">
                    <p className="font-medium text-slate-800">{tenant.organizationName}</p>
                    <p className="text-xs text-slate-400">{tenant.companyEmail}</p>
                  </td>
                  <td className="px-5 py-3 text-slate-700">{tenant.currentPlan.name}</td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {tenant.activeModules.length === 0 && (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                      {tenant.activeModules.map((mod) => (
                        <span
                          key={mod.id}
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${moduleStyles[mod.key] ?? "bg-slate-50 text-slate-600"}`}
                        >
                          {mod.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-700">{tenant.totalUsers}</td>
                  <td className="px-5 py-3 text-slate-700">{naira(tenant.monthlyRecurringRevenue)}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[tenant.subscriptionStatus]}`}
                    >
                      {tenant.subscriptionStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-500">
<<<<<<< HEAD
                    {tenant.lastActiveAt
                      ? new Date(tenant.lastActiveAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
=======
  {tenant.lastActiveAt
    ? new Date(tenant.lastActiveAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—"}
</td>
>>>>>>> origin/platform-admin
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/platform-admin/tenants/${tenant.organizationId}`}
                        className="flex items-center gap-1 text-xs font-medium text-sky-600 hover:underline"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Link>
                      <button
                        onClick={() => handleSuspend(tenant.organizationId)}
                        className="flex items-center gap-1 text-xs font-medium text-red-600 hover:underline"
                      >
                        <Ban className="h-3.5 w-3.5" />
                        Suspend
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            {!loading && !error && tenants.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-10 text-center text-sm text-slate-400">
                  No tenants match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddTenantModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAddTenant}
      />
    </section>
  );
}