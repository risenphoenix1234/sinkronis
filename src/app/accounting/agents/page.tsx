"use client";

import { useEffect, useState } from "react";
import InviteAgentModal from "@/components/modals/InviteAgentModal";
import { getAgents, inviteAgent, inviteAgentsBulk } from "@/lib/api/accounting";
import { AgentListItem, AgentSummary, InviteAgentPayload, InviteAgentsBulkPayload } from "@/lib/api/types/accounting.types";
import EditAgentModal from "@/components/modals/EditAgentModal";
import { updateAgent } from "@/lib/api/accounting";
import { UpdateAgentPayload } from "@/lib/api/types/accounting.types";




const statusStyles: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700",
  INACTIVE: "bg-slate-100 text-slate-500",
  PENDING: "bg-amber-50 text-amber-700",
};

const statusLabels: Record<string, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  PENDING: "Pending",
};

type Filter = "All" | "ACTIVE" | "PENDING" | "INACTIVE";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentListItem[]>([]);
  const [summary, setSummary] = useState<AgentSummary>({ totalAgents: 0, active: 0, pendingInvites: 0, inactive: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [activeAgent, setActiveAgent] = useState<AgentListItem | null>(null);
  const [filter, setFilter] = useState<Filter>("All");

  const fetchAgents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAgents({ search: search || undefined });
      setAgents(res.data.agents);
      setSummary(res.data.summary);
    } catch (err) {
      setError("Failed to load agents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(fetchAgents, 400);
    return () => clearTimeout(debounce);
  }, [search]);

  const handleInvite = async (payload: InviteAgentPayload) => {
    await inviteAgent(payload);
    await fetchAgents();
  };

  const handleBulkInvite = async (payload: InviteAgentsBulkPayload) => {
    const res = await inviteAgentsBulk(payload);
    await fetchAgents();
    return res;
  };

  const filters: Filter[] = ["All", "ACTIVE", "PENDING", "INACTIVE"];

  const filtered = filter === "All" ? agents : agents.filter((a) => a.status === filter);
  
  const handleSaveAgent = async (id: string, payload: UpdateAgentPayload) => {
  await updateAgent(id, payload);
  await fetchAgents();
};

  return (
    <section className="space-y-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Agents</h1>
          <p className="mt-1 text-sm text-slate-500">
            {summary.totalAgents} total · {summary.active} active
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setInviteOpen(true)}
            className="rounded-md bg-sky-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-700 whitespace-nowrap"
          >
            + Invite Agent
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Agents", value: summary.totalAgents },
          { label: "Active", value: summary.active },
          { label: "Pending Invites", value: summary.pendingInvites },
          { label: "Inactive", value: summary.inactive },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-white px-5 py-4">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="mt-1 text-3xl font-semibold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search agents…"
            className="w-full rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
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
              {f === "All" ? "All" : statusLabels[f]}
            </button>
          ))}
        </div>
      </div>

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
            {loading && (
              <tr>
                <td colSpan={9} className="px-6 py-8 text-center text-sm text-slate-400">Loading agents...</td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={9} className="px-6 py-8 text-center text-sm text-red-500">{error}</td>
              </tr>
            )}

            {!loading && !error && filtered.map((agent) => (
              <tr key={agent.id} className="hover:bg-slate-50">
                <td className="px-6 py-3 text-sm font-medium text-sky-600 whitespace-nowrap">{agent.agentId ?? "—"}</td>
                <td className="px-6 py-3 text-base font-medium text-slate-800 whitespace-nowrap">{agent.name}</td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">{agent.email}</td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">{agent.phone ?? "—"}</td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">{agent.role?.name ?? "—"}</td>
                <td className="px-6 py-3 text-base tabular-nums text-slate-800">{agent.invoiceCount}</td>
                <td className="px-6 py-3">
                  <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${statusStyles[agent.status]}`}>
                    {statusLabels[agent.status]}
                  </span>
                </td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">{formatDate(agent.invitedAt)}</td>
                <td className="px-6 py-3 text-right whitespace-nowrap">
                  {agent.status !== "PENDING" ? (
                    <button
                      onClick={() => { setActiveAgent(agent); setEditOpen(true); }}
                      className="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
                    >
                      Edit
                    </button>
                  ) : (
                    <span className="text-sm text-slate-300">—</span>
                  )}
                </td>
              </tr>
            ))}

            {!loading && !error && filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-6 py-8 text-center text-sm text-slate-400">No agents yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <InviteAgentModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onInvite={handleInvite}
        onBulkInvite={handleBulkInvite}
      />

      <EditAgentModal
      open={editOpen}
      onClose={() => setEditOpen(false)}
      agent={activeAgent}
      onSave={handleSaveAgent}
      />
    </section>
  );
}