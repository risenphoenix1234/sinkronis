"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import {
  getPlatformSupportTickets,
  createSupportTicket,
  getSupportTicketDetail,
  updateTicketResolutionNotes,
  updateTicketStatus,
  resolveSupportTicket,
  getTenants,
} from "@/lib/api/platform-admin";
import { PlatformSupportTicket, SupportTicketDetail } from "@/lib/api/types/platform-admin.types";
import OpenTicketModal, { NewTicketInput } from "@/components/modals/OpenTicketModal";
import TicketDetailPanel from "@/components/modals/TicketDetailPanel";
import Loader from "@/components/ui/Loader";

type Tab = "All" | "OPEN" | "IN_PROGRESS" | "RESOLVED";

const priorityStyles: Record<string, string> = {
  MEDIUM: "bg-amber-50 text-amber-700",
  HIGH: "bg-orange-50 text-orange-700",
  CRITICAL: "bg-red-50 text-red-700",
};

const statusStyles: Record<string, string> = {
  OPEN: "bg-amber-50 text-amber-700",
  IN_PROGRESS: "bg-sky-50 text-sky-700",
  RESOLVED: "bg-green-50 text-green-700",
};

const tabLabels: Record<Tab, string> = {
  All: "All",
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<PlatformSupportTicket[]>([]);
  const [tenantOptions, setTenantOptions] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicketDetail | null>(null);

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPlatformSupportTickets({
        search: searchTerm || undefined,
        status: activeTab === "All" ? undefined : activeTab,
      });
      setTickets(res.data);
    } catch (err) {
      setError("Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(fetchTickets, 400);
    return () => clearTimeout(debounce);
  }, [searchTerm, activeTab]);

  useEffect(() => {
    getTenants({ page: 1, limit: 100 }).then((res) => {
      setTenantOptions(res.data.map((t) => ({ id: t.organizationId, name: t.organizationName })));
    });
  }, []);

  const handleOpenTicket = async (input: NewTicketInput) => {
    try {
      await createSupportTicket(input);
      setShowModal(false);
      await fetchTickets();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to create ticket.");
    }
  };

  const handleViewTicket = async (ticketId: string) => {
    try {
      const res = await getSupportTicketDetail(ticketId);
      setSelectedTicket(res.data);
    } catch (err: any) {
      alert("Failed to load ticket details.");
    }
  };

  const handleUpdateNotes = async (ticketId: string, notes: string) => {
    try {
      const res = await updateTicketResolutionNotes(ticketId, { resolutionNotes: notes });
      setSelectedTicket(res.data);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to save notes.");
    }
  };

  const handleUpdateStatus = async (ticketId: string, status: "OPEN" | "IN_PROGRESS" | "RESOLVED") => {
    try {
      const res = await updateTicketStatus(ticketId, { status });
      setSelectedTicket(res.data);
      await fetchTickets();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to update status.");
    }
  };

  const handleResolve = async (ticketId: string) => {
    try {
      const res = await resolveSupportTicket(ticketId);
      setSelectedTicket(res.data);
      await fetchTickets();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to resolve ticket.");
    }
  };

  const tabs: Tab[] = ["All", "OPEN", "IN_PROGRESS", "RESOLVED"];

  return (
    <section className="space-y-4 bg-slate-50 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Support</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage tenant support tickets and escalations
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
        >
          + Open Ticket
        </button>
      </div>

      <div className="flex items-center gap-1 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`border-b-2 px-3 py-2 text-sm font-medium ${
              activeTab === tab
                ? "border-sky-600 text-sky-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search tickets or tenants..."
          className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
        />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-500">
                <th className="px-5 py-3 font-medium">Ticket ID</th>
                <th className="px-5 py-3 font-medium">Tenant</th>
                <th className="px-5 py-3 font-medium">Subject</th>
                <th className="px-5 py-3 font-medium">Priority</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Assigned To</th>
                <th className="px-5 py-3 font-medium">Updated</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-sm text-slate-400"><Loader variant="inline" label="Loading tickets" /></td>
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
                tickets.map((t) => (
                  <tr key={t.ticketId} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <span className="font-medium text-sky-600">{t.ticketId}</span>
                    </td>
                    <td className="px-5 py-3 text-slate-700">{t.tenant.name}</td>
                    <td className="px-5 py-3 text-slate-700">{t.subject}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityStyles[t.priority]}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[t.status]}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-500">{t.assignedTo?.name ?? "Unassigned"}</td>
                    <td className="px-5 py-3 text-slate-500">{formatDate(t.updatedAt)}</td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleViewTicket(t.ticketId)}
                        className="text-xs font-medium text-sky-600 hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}

              {!loading && !error && tickets.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-sm text-slate-400">
                    No tickets match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <OpenTicketModal
        open={showModal}
        tenants={tenantOptions}
        onClose={() => setShowModal(false)}
        onSubmit={handleOpenTicket}
      />

      <TicketDetailPanel
        key={selectedTicket?.ticketId}
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onUpdateNotes={handleUpdateNotes}
        onUpdateStatus={handleUpdateStatus}
        onResolve={handleResolve}
      />
    </section>
  );
}