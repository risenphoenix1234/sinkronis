// src/components/modals/TicketDetailPanel.tsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { SupportTicketDetail } from "@/lib/api/types/platform-admin.types";

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

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface TicketDetailPanelProps {
  ticket: SupportTicketDetail | null;
  onClose: () => void;
  onUpdateNotes: (ticketId: string, notes: string) => void;
  onUpdateStatus: (ticketId: string, status: "OPEN" | "IN_PROGRESS" | "RESOLVED") => void;
  onResolve: (ticketId: string) => void;
}

export default function TicketDetailPanel({
  ticket,
  onClose,
  onUpdateNotes,
  onUpdateStatus,
  onResolve,
}: TicketDetailPanelProps) {
  const [notes, setNotes] = useState(ticket?.resolutionNotes ?? "");

  if (!ticket) return null;

  const isResolved = ticket.status === "RESOLVED";

  const nextStatusOptions =
    ticket.status === "OPEN" ? ["OPEN", "IN_PROGRESS", "RESOLVED"] : ["IN_PROGRESS", "RESOLVED"];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40">
      <div className="flex h-full w-full max-w-sm flex-col overflow-y-auto bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">{ticket.ticketId}</p>
            <h2 className="mt-0.5 text-base font-semibold text-slate-900">{ticket.subject}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityStyles[ticket.priority]}`}>
            {ticket.priority}
          </span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[ticket.status]}`}>
            {ticket.status}
          </span>
        </div>

        <div className="mt-4 space-y-1 text-sm text-slate-600">
          <p>
            Tenant: <span className="font-medium text-slate-800">{ticket.tenant.name}</span>
          </p>
          <p>
            Assigned: <span className="font-medium text-slate-800">{ticket.assignedTo?.name ?? "Unassigned"}</span>
          </p>
          <p>
            Opened: <span className="font-medium text-slate-800">{formatDate(ticket.openedAt)}</span>
          </p>
        </div>

        <div className="mt-4 rounded-md bg-slate-50 p-3 text-sm text-slate-600">
          {ticket.description}
        </div>

        {!isResolved && (
          <div className="mt-4">
            <label className="text-xs font-medium text-slate-700">Status</label>
            <select
              value={ticket.status}
              onChange={(e) => onUpdateStatus(ticket.ticketId, e.target.value as any)}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            >
              {nextStatusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mt-5 flex-1">
          <label className="text-xs font-medium text-slate-700">Resolution Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Document the resolution or next steps..."
            rows={5}
            disabled={isResolved}
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:bg-slate-50 disabled:text-slate-500"
          />
          {!isResolved && (
            <button
              onClick={() => onUpdateNotes(ticket.ticketId, notes.trim())}
              className="mt-2 text-xs font-medium text-sky-600 hover:underline"
            >
              Save Notes
            </button>
          )}
        </div>

        {isResolved ? (
          <div className="mt-4 rounded-md bg-emerald-50 px-3 py-2 text-center text-sm font-medium text-emerald-700">
            Resolved {ticket.resolvedBy ? `by ${ticket.resolvedBy.name}` : ""}
          </div>
        ) : (
          <button
            onClick={() => onResolve(ticket.ticketId)}
            className="mt-4 rounded-md bg-emerald-600 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Mark Resolved
          </button>
        )}
      </div>
    </div>
  );
}