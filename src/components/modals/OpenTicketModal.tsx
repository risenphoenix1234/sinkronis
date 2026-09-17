// src/components/modals/OpenTicketModal.tsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";

const PRIORITIES = ["MEDIUM", "HIGH", "CRITICAL"] as const;
type Priority = (typeof PRIORITIES)[number];

export interface NewTicketInput {
  tenantId: string;
  subject: string;
  priority: Priority;
  description: string;
}

interface TenantOption {
  id: string;
  name: string;
}

interface OpenTicketModalProps {
  open: boolean;
  tenants: TenantOption[];
  onClose: () => void;
  onSubmit: (input: NewTicketInput) => void;
}

export default function OpenTicketModal({ open, tenants, onClose, onSubmit }: OpenTicketModalProps) {
  const [tenantId, setTenantId] = useState("");
  const [subject, setSubject] = useState("");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [description, setDescription] = useState("");

  if (!open) return null;

  const isValid =
    tenantId && subject.trim().length >= 3 && description.trim().length >= 10;

  const resetForm = () => {
    setTenantId("");
    setSubject("");
    setPriority("MEDIUM");
    setDescription("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit({
      tenantId,
      subject: subject.trim(),
      priority,
      description: description.trim(),
    });
    resetForm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <h2 className="text-base font-semibold text-slate-900">Open Support Ticket</h2>
          <button
            onClick={handleClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-700">
              Tenant <span className="text-red-500">*</span>
            </label>
            <select
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            >
              <option value="">Select a tenant</option>
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of the issue"
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of the issue... (min 10 characters)"
              rows={3}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            Open Ticket
          </button>
        </div>
      </div>
    </div>
  );
}