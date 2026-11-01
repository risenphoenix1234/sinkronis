// src/app/accounting/agents/page.tsx
"use client";

import { useEffect, useState } from "react";
import { FiEdit2, FiSearch, FiUpload, FiUserCheck, FiUserX } from "react-icons/fi";
import InviteAgentModal from "@/components/modals/InviteAgentModal";
import { getAgents, inviteAgent, inviteAgentsBulk } from "@/lib/api/accounting";
import { AgentListItem, AgentSummary, InviteAgentPayload, InviteAgentsBulkPayload } from "@/lib/api/types/accounting.types";
import EditAgentModal from "@/components/modals/EditAgentModal";
import { updateAgent } from "@/lib/api/accounting";
import { UpdateAgentPayload } from "@/lib/api/types/accounting.types";
import Loader from "@/components/ui/Loader";




const statusStyles: Record<string, string> = {
  ACTIVE: "bg-[#D8F3DC] text-[#1B7A34]",
  INACTIVE: "bg-[#F4F6F8] text-[#637381]",
  PENDING: "bg-[#FFF3CD] text-[#856404]",
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
  const [inviteMode, setInviteMode] = useState<"single" | "bulk">("single");
  const [togglingId, setTogglingId] = useState<string | null>(null);
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

  const handleToggleStatus = async (agent: AgentListItem) => {
    setTogglingId(agent.id);
    try {
      await updateAgent(agent.id, { status: agent.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" });
      await fetchAgents();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to update agent status.");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <section className="min-h-[calc(100vh-5rem)] space-y-6 bg-[#F4F6F8] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-[#212B36]">Agents</h1>
          <p className="mt-2 text-sm text-[#637381]">
            {summary.totalAgents} total · {summary.active} active
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setInviteMode("bulk");
              setInviteOpen(true);
            }}
            className="flex items-center gap-2 whitespace-nowrap rounded-md border border-[#E5E8EB] bg-[#F9FAFB] px-4 py-3 text-sm font-medium text-[#212B36] hover:bg-white"
          >
            <FiUpload size={14} /> Bulk Invite
          </button>
          <button
            onClick={() => {
              setInviteMode("single");
              setInviteOpen(true);
            }}
            className="whitespace-nowrap rounded-md bg-[#2183C6] px-4 py-3 text-sm font-medium text-white hover:bg-[#1976B8]"
          >
            + Invite Agent
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {[
          { label: "Total Agents", value: summary.totalAgents, color: "text-[#212B36]" },
          { label: "Active", value: summary.active, color: "text-[#1B7A34]" },
          { label: "Pending Invites", value: summary.pendingInvites, color: "text-[#856404]" },
          { label: "Inactive", value: summary.inactive, color: "text-[#919EAB]" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-md border border-[#F2F3F5] bg-white p-6">
            <p className="text-xs text-[#637381]">{stat.label}</p>
            <p className={`mt-3 text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <FiSearch size={16} className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-[#919EAB]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search agents..."
            className="w-full border-b border-[#E5E8EB] bg-transparent py-2.5 pl-8 text-sm text-[#212B36] outline-none placeholder:text-[#919EAB] focus:border-[#2183C6]"
          />
        </div>
        <div className="flex items-center gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-4 py-1.5 text-xs transition-colors ${
                filter === f
                  ? "border-[#2183C6] bg-[#2183C6] font-medium text-white"
                  : "border-[#E5E8EB] bg-transparent text-[#637381] hover:bg-white"
              }`}
            >
              {f === "All" ? "All" : statusLabels[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border border-[#F2F3F5] bg-white">
        <table className="min-w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-dotted border-[#EBEEF0] text-[#637381] [&>th:first-child]:pl-4 [&>th:last-child]:pr-4">
              <th className="px-3 py-3.5 font-normal">Agent ID</th>
              <th className="px-3 py-3.5 font-normal">Name</th>
              <th className="px-3 py-3.5 font-normal">Email</th>
              <th className="px-3 py-3.5 font-normal">Phone</th>
              <th className="px-3 py-3.5 font-normal">Role</th>
              <th className="px-3 py-3.5 font-normal">Invoices</th>
              <th className="px-3 py-3.5 font-normal">Status</th>
              <th className="px-3 py-3.5 font-normal">Invited</th>
              <th className="px-3 py-3.5 text-right font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={9} className="px-6 py-8 text-center text-sm text-[#919EAB]">
                  <Loader variant="inline" label="Loading agents" />
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={9} className="px-6 py-8 text-center text-sm text-[#FF3B30]">{error}</td>
              </tr>
            )}

            {!loading &&
              !error &&
              filtered.map((agent) => (
                <tr key={agent.id} className="text-[#212B36] even:bg-[#F2F2F7] [&>td:first-child]:pl-4 [&>td:last-child]:pr-4">
                  <td className="whitespace-nowrap px-3 py-3.5 font-medium text-[#2183C6]">{agent.agentId ?? "—"}</td>
                  <td className="whitespace-nowrap px-3 py-3.5 font-medium">{agent.name}</td>
                  <td className="whitespace-nowrap px-3 py-3.5 text-[#637381]">{agent.email}</td>
                  <td className="whitespace-nowrap px-3 py-3.5 text-[#637381]">{agent.phone ?? "—"}</td>
                  <td className="whitespace-nowrap px-3 py-3.5 text-[#637381]">{agent.role?.name ?? "—"}</td>
                  <td className="px-3 py-3.5 font-medium tabular-nums">{agent.invoiceCount}</td>
                  <td className="px-3 py-3.5">
                    <span
                      className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${statusStyles[agent.status]}`}
                    >
                      {statusLabels[agent.status]}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3.5 text-[#637381]">{formatDate(agent.invitedAt)}</td>
                  <td className="whitespace-nowrap px-3 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {agent.status !== "PENDING" && (
                        <>
                          <button
                            onClick={() => {
                              setActiveAgent(agent);
                              setEditOpen(true);
                            }}
                            aria-label={`Edit ${agent.name}`}
                            className="rounded p-1.5 text-[#637381] hover:bg-[#E5E8EB]"
                          >
                            <FiEdit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(agent)}
                            disabled={togglingId === agent.id}
                            aria-label={agent.status === "ACTIVE" ? `Deactivate ${agent.name}` : `Activate ${agent.name}`}
                            title={agent.status === "ACTIVE" ? "Deactivate" : "Activate"}
                            className={`rounded p-1.5 hover:bg-[#E5E8EB] disabled:opacity-50 ${
                              agent.status === "ACTIVE" ? "text-[#FF3B30]" : "text-[#1B7A34]"
                            }`}
                          >
                            {agent.status === "ACTIVE" ? <FiUserX size={14} /> : <FiUserCheck size={14} />}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

            {!loading && !error && filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-6 py-8 text-center text-sm text-[#919EAB]">No agents yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <InviteAgentModal
        open={inviteOpen}
        initialMode={inviteMode}
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