// src/app/platform-admin/support/page.tsx
"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  initialTickets,
  priorityStyles,
  statusStyles,
  SupportTicket,
} from "@/lib/platform-support-data";
import OpenTicketModal, { NewTicketInput } from "@/components/modals/OpenTicketModal";
import TicketDetailPanel from "@/components/modals/TicketDetailPanel";

type Tab = "All" | "Open" | "In Progress" | "Resolved" | "Critical";

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [nextNum, setNextNum] = useState(6);

  const counts = useMemo(
    () => ({
      Open: tickets.filter((t) => t.status === "Open").length,
      "In Progress": tickets.filter((t) => t.status === "In Progress").length,
      Resolved: tickets.filter((t) => t.status === "Resolved").length,
      Critical: tickets.filter((t) => t.priority === "Critical").length,
    }),
    [tickets]
  );

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchesSearch =
        !searchTerm ||
        t.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTab =
        activeTab === "All" ||
        (activeTab === "Critical" ? t.priority === "Critical" : t.status === activeTab);

      return matchesSearch && matchesTab;
    });
  }, [tickets, searchTerm, activeTab]);

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) ?? null;

  const handleOpenTicket = (input: NewTicketInput) => {
    const id = `TKT-${String(nextNum).padStart(3, "0")}`;
    setNextNum((n) => n + 1);
    const today = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const newTicket: SupportTicket = {
      id,
      tenant: input.tenant,
      subject: input.subject,
      priority: input.priority,
      status: "Open",
      assignedTo: "Unassigned",
      updated: today,
      opened: today,
      description: input.description,
      resolutionNotes: "",
    };
    setTickets((prev) => [newTicket, ...prev]);
  };

  const handleResolve = (ticketId: string, resolutionNotes: string) => {
    const today = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, status: "Resolved", resolutionNotes, updated: today } : t
      )
    );
    setSelectedTicketId(null);
  };

  const tabs: Tab[] = ["All", "Open", "In Progress", "Resolved", "Critical"];

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
          className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Open Ticket
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium ${
              activeTab === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
            {tab !== "All" && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs ${
                  activeTab === tab ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"
                }`}
              >
                {counts[tab]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search tickets or tenants..."
          className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
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
              {filteredTickets.map((t) => (
                <tr key={t.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <span className="font-medium text-blue-600">{t.id}</span>
                  </td>
                  <td className="px-5 py-3 text-slate-700">{t.tenant}</td>
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
                  <td className="px-5 py-3 text-slate-500">{t.assignedTo}</td>
                  <td className="px-5 py-3 text-slate-500">{t.updated}</td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => setSelectedTicketId(t.id)}
                      className="text-xs font-medium text-blue-600 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}

              {filteredTickets.length === 0 && (
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

      <OpenTicketModal open={showModal} onClose={() => setShowModal(false)} onSubmit={handleOpenTicket} />

      <TicketDetailPanel
        key={selectedTicket?.id}
        ticket={selectedTicket}
        onClose={() => setSelectedTicketId(null)}
        onResolve={handleResolve}
      />
    </section>
  );
}