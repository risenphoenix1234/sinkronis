"use client";

import { useState } from "react";
import InviteAgentModal from "@/components/modals/InviteAgentModal";

type Agent = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  invoices: number;
  status: "Active" | "Inactive" | "Pending";
  invited: string;
};

const staticAgents: Agent[] = [
  {
    id: "AGT-001",
    name: "Emeka Okafor",
    email: "emeka.okafor@company.com",
    phone: "08012334566",
    role: "Senior Sales Agent",
    invoices: 3,
    status: "Active",
    invited: "10 Jan 2026",
  },
  {
    id: "AGT-002",
    name: "Sade Williams",
    email: "sade.williams@company.com",
    phone: "09022334465",
    role: "Sales Agent",
    invoices: 1,
    status: "Inactive",
    invited: "11 Feb 2026",
  },
  {
    id: "AGT-003",
    name: "Kola Adeyinka",
    email: "kola.adeyinka@company.com",
    phone: "09032445566",
    role: "Sales Agent",
    invoices: 0,
    status: "Pending",
    invited: "10 May 2026",
  },
];

const statusStyles: Record<Agent["status"], string> = {
  Active: "bg-emerald-50 text-emerald-700",
  Inactive: "bg-slate-100 text-slate-500",
  Pending: "bg-amber-50 text-amber-700",
};

type Filter = "All" | "Active" | "Pending" | "Inactive";

export default function AgentsPage() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>("All");

  const filters: Filter[] = ["All", "Active", "Pending", "Inactive"];

  const filtered =
    filter === "All"
      ? staticAgents
      : staticAgents.filter((a) => a.status === filter);

  const total = staticAgents.length;
  const active = staticAgents.filter((a) => a.status === "Active").length;
  const pending = staticAgents.filter((a) => a.status === "Pending").length;
  const inactive = staticAgents.filter((a) => a.status === "Inactive").length;

  return (
    <section className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Agents</h1>
          <p className="mt-1 text-sm text-slate-500">
            {total} total · {active} active
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
            ⬆ Bulk Invite
          </button>
          <button
            onClick={() => setInviteOpen(true)}
            className="rounded-md bg-sky-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-700 whitespace-nowrap"
          >
            + Invite Agent
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Agents", value: total },
          { label: "Active", value: active },
          { label: "Pending Invites", value: pending },
          { label: "Inactive", value: inactive },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white px-5 py-4"
          >
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="mt-1 text-3xl font-semibold text-slate-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search + filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search agents…"
            className="w-full rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            🔍
          </span>
        </div>
        <div className="flex items-center gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                filter === f
                  ? "border-sky-200 bg-sky-50 font-medium text-sky-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-3 font-medium">Agent ID</th>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Email</th>
              <th className="px-6 py-3 font-medium">Phone</th>
              <th className="px-6 py-3 font-medium">Role</th>
              <th className="px-6 py-3 font-medium">Invoices</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Invited</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((agent) => (
              <tr key={agent.id} className="hover:bg-slate-50">
                <td className="px-6 py-3 text-sm font-medium text-sky-600 whitespace-nowrap">
                  {agent.id}
                </td>
                <td className="px-6 py-3 text-base font-medium text-slate-800 whitespace-nowrap">
                  {agent.name}
                </td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">
                  {agent.email}
                </td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">
                  {agent.phone}
                </td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">
                  {agent.role}
                </td>
                <td className="px-6 py-3 text-base tabular-nums text-slate-800">
                  {agent.invoices}
                </td>
                <td className="px-6 py-3">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${statusStyles[agent.status]}`}
                  >
                    {agent.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">
                  {agent.invited}
                </td>
                <td className="px-6 py-3 text-right whitespace-nowrap">
                  <button className="rounded px-3 py-1.5 text-sm text-slate-500 hover:bg-sky-50 hover:text-sky-600 mr-2">
                    Edit
                  </button>
                  <button className="rounded px-3 py-1.5 text-sm text-rose-500 hover:bg-rose-50">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <InviteAgentModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
      />
    </section>
  );
}
