// src/app/platform-admin/tenants/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Plus, Eye, Ban } from "lucide-react";
import {
  allTenants,
  naira,
  planStyles,
  statusStyles,
  moduleStyles,
  Plan,
  ModuleName,
  Tenant,
} from "@/lib/pa-tenants-data";
import AddTenantModal, { NewTenantInput } from "@/components/modals/AddTenantModal";

const ALL_MODULES: ModuleName[] = ["HRIS", "Accounting", "Payroll"];
const ALL_PLANS: Plan[] = ["Starter", "Growth", "Enterprise", "Trial"];

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>(allTenants);
  const [searchTerm, setSearchTerm] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filteredTenants = useMemo(() => {
    return tenants.filter((tenant) => {
      const matchesSearch =
        !searchTerm ||
        tenant.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.adminEmail.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPlan = !planFilter || tenant.plan === planFilter;
      const matchesStatus = !statusFilter || tenant.status === statusFilter;
      const enabledModules = (Object.keys(tenant.activeModules) as ModuleName[]).filter(
        (m) => tenant.activeModules[m]
      );
      const matchesModule = !moduleFilter || enabledModules.includes(moduleFilter as ModuleName);
      return matchesSearch && matchesPlan && matchesStatus && matchesModule;
    });
  }, [tenants, searchTerm, planFilter, statusFilter, moduleFilter]);

  const handleAddTenant = (input: NewTenantInput) => {
    const newTenant: Tenant = {
      id: input.companyName.toLowerCase().trim().replace(/\s+/g, "-"),
      company: input.companyName,
      industry: "—",
      adminEmail: input.adminEmail,
      plan: input.plan,
      status: input.plan === "Trial" ? "Trial" : "Active",
      mrr: 0,
      country: input.country,
      createdDate: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      about: `${input.companyName} was just added to the platform.`,
      activeModules: {
        HRIS: input.modules.includes("HRIS"),
        Accounting: input.modules.includes("Accounting"),
        Payroll: input.modules.includes("Payroll"),
      },
      users: [],
      activity: [],
      invoices: [],
      tickets: [],
    };
    setTenants((prev) => [newTenant, ...prev]);
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
          className="flex items-center gap-1.5 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white bg-sky-600  hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" />
          Add Tenant
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr_1fr]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by company, email or industry..."
            className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        >
          <option value="">All Plans</option>
          {ALL_PLANS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Trial">Trial</option>
          <option value="Suspended">Suspended</option>
        </select>

        <select
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
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
              <th className="px-5 py-3 font-medium">Modules</th>
              <th className="px-5 py-3 font-medium">Users</th>
              <th className="px-5 py-3 font-medium">MRR ₦</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Last Active</th>
              <th className="px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTenants.map((tenant) => {
              const enabledModules = (Object.keys(tenant.activeModules) as ModuleName[]).filter(
                (m) => tenant.activeModules[m]
              );
              return (
                <tr
                  key={tenant.id}
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50"
                >
                  <td className="px-5 py-3">
                    <p className="font-medium text-slate-800">{tenant.company}</p>
                    <p className="text-xs text-slate-400">{tenant.adminEmail}</p>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {enabledModules.map((mod) => (
                        <span
                          key={mod}
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${moduleStyles[mod]}`}
                        >
                          {mod}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-700">{tenant.users.length}</td>
                  <td className="px-5 py-3 text-slate-700">{naira(tenant.mrr)}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[tenant.status]}`}
                    >
                      {tenant.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-500">{tenant.createdDate}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/platform-admin/tenants/${tenant.id}`}
                        className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Link>
                      <button className="flex items-center gap-1 text-xs font-medium text-red-600 hover:underline">
                        <Ban className="h-3.5 w-3.5" />
                        Suspend
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {filteredTenants.length === 0 && (
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