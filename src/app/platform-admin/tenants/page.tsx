// src/app/platform-admin/tenants/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus } from "lucide-react";
import { getTenants, createTenant, suspendTenant } from "@/lib/api/platform-admin";
import { Tenant } from "@/lib/api/types/platform-admin.types";
import AddTenantModal, { NewTenantInput } from "@/components/modals/AddTenantModal";
import Loader from "@/components/ui/Loader";

const ALL_MODULES = ["HRIS", "Accounting", "Payroll"];

const naira = (n: number) => `₦${n.toLocaleString()}`;

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-[#E8F5E9] text-[#2E7D32]",
  TRIAL: "bg-[#FFF8E1] text-[#F57F17]",
  SUSPENDED: "bg-[#FFEBEE] text-[#C62828]",
  EXPIRED: "bg-[#F2F3F5] text-[#637381]",
};

const statusLabel = (status: string) =>
  status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : "—";

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
      registrationType: input.registrationType,
      registrationNumber: input.registrationNumber,
      verificationReference: input.verificationReference,
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
    <section className="min-h-[calc(100vh-5rem)] space-y-4 bg-[#F4F6F8] p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#212B36]">Tenants</h1>
          <p className="mt-1 text-sm text-[#637381]">
            All companies on the Sinkronis platform
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-md bg-[#2183C6] px-4 py-2 text-sm font-medium text-white hover:bg-[#1c72ab]"
        >
          <Plus className="h-4 w-4" />
          Add Tenant
        </button>
      </div>

      {successMessage && (
        <div className="rounded-md bg-[#E8F5E9] px-4 py-3 text-sm text-[#2E7D32]">
          {successMessage}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#919EAB]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by company, email or industry..."
            className="w-full rounded-md border border-[#F2F3F5] bg-white py-2 pl-9 pr-3 text-sm text-[#212B36] outline-none placeholder:text-[#919EAB] focus:border-[#2183C6] focus:ring-1 focus:ring-[#2183C6]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-[#F2F3F5] bg-white px-3 py-2 text-sm text-[#637381] outline-none focus:border-[#2183C6] focus:ring-1 focus:ring-[#2183C6]"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="TRIAL">Trial</option>
          <option value="SUSPENDED">Suspended</option>
        </select>

        <select
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          className="rounded-md border border-[#F2F3F5] bg-white px-3 py-2 text-sm text-[#637381] outline-none focus:border-[#2183C6] focus:ring-1 focus:ring-[#2183C6]"
        >
          <option value="">All Modules</option>
          {ALL_MODULES.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#F2F3F5] bg-white p-6 shadow-sm">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#EBEEF0] text-xs text-[#637381] [&>th:first-child]:pl-3">
              <th className="px-5 py-3 font-medium">Company</th>
              <th className="px-5 py-3 font-medium">Modules</th>
              <th className="px-5 py-3 font-medium">Users</th>
              <th className="px-5 py-3 font-medium">MRR ₦</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Last Active</th>
              <th className="px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-400"><Loader variant="inline" label="Loading tenants" /></td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-sm text-red-500">
                  {error}
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              tenants.map((tenant) => (
                <tr
                  key={tenant.organizationId}
                  className="even:bg-[#F2F2F7] [&>td:first-child]:pl-3 [&>td:last-child]:pr-3"
                >
                  <td className="px-5 py-3">
                    <p className="font-medium text-[#212B36]">{tenant.organizationName}</p>
                    <p className="text-xs text-[#919EAB]">{tenant.companyEmail}</p>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {tenant.activeModules.length === 0 && (
                        <span className="text-xs text-[#919EAB]">—</span>
                      )}
                      {tenant.activeModules.map((mod) => (
                        <span
                          key={mod.id}
                          className="rounded-full bg-[#E3F2FD] px-2 py-0.5 text-xs font-medium text-[#2183C6]"
                        >
                          {mod.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[#212B36]">{tenant.totalUsers}</td>
                  <td className="px-5 py-3 text-[#212B36]">{naira(tenant.monthlyRecurringRevenue)}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[tenant.subscriptionStatus] ?? "bg-[#F2F3F5] text-[#637381]"}`}
                    >
                      {statusLabel(tenant.subscriptionStatus)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-[#637381]">
                    {tenant.lastActiveAt
                      ? new Date(tenant.lastActiveAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/platform-admin/tenants/${tenant.organizationId}`}
                        className="rounded bg-[#E3F2FD] px-3 py-1 text-xs font-medium text-[#2183C6] hover:bg-[#d3e9fb]"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleSuspend(tenant.organizationId)}
                        className="rounded bg-[#FFEBEE] px-3 py-1 text-xs font-medium text-[#C62828] hover:bg-[#fcdde2]"
                      >
                        Suspend
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            {!loading && !error && tenants.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-400">
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