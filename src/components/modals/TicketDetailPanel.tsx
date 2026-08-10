// src/components/modals/TicketDetailPanel.tsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
  SupportTicket,
  priorityStyles,
  statusStyles,
} from "@/lib/platform-support-data";

interface TicketDetailPanelProps {
  ticket: SupportTicket | null;
  onClose: () => void;
  onResolve: (ticketId: string, resolutionNotes: string) => void;
}

// Render with key={ticket.id} from the parent so this component remounts
// (and resets its notes state) whenever a different ticket is selected.
export default function TicketDetailPanel({ ticket, onClose, onResolve }: TicketDetailPanelProps) {
  const [notes, setNotes] = useState(ticket?.resolutionNotes ?? "");

  if (!ticket) return null;

  const isResolved = ticket.status === "Resolved";

  const handleResolve = () => {
    onResolve(ticket.id, notes.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40">
      <div className="flex h-full w-full max-w-sm flex-col bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">{ticket.id}</p>
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
            Tenant: <span className="font-medium text-slate-800">{ticket.tenant}</span>
          </p>
          <p>
            Assigned: <span className="font-medium text-slate-800">{ticket.assignedTo}</span>
          </p>
          <p>
            Opened: <span className="font-medium text-slate-800">{ticket.opened}</span>
          </p>
        </div>

        <div className="mt-4 rounded-md bg-slate-50 p-3 text-sm text-slate-600">
          {ticket.description}
        </div>

        <div className="mt-5 flex-1">
          <label className="text-xs font-medium text-slate-700">Resolution Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Document the resolution or next steps..."
            rows={5}
            disabled={isResolved}
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-l-blue-400 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
          />
        </div>

        {isResolved ? (
          <div className="mt-4 rounded-md bg-emerald-50 px-3 py-2 text-center text-sm font-medium text-emerald-700">
            Resolved
          </div>
        ) : (
          <button
            onClick={handleResolve}
            className="mt-4 rounded-md bg-emerald-600 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Mark Resolved
          </button>
        )}
      </div>
    </div>
  );
}