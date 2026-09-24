"use client";

import { useEffect, useState } from "react";
import { getCustomers } from "@/lib/api/accounting";
import { Customer, CreateProjectPayload } from "@/lib/api/types/accounting.types";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: CreateProjectPayload) => void;
};

export default function NewProjectModal({ open, onClose, onCreate }: Props) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [name, setName] = useState("");
  const [clientId, setClientId] = useState("");
  const [value, setValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<"ACTIVE" | "ON_HOLD" | "COMPLETED">("ACTIVE");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      getCustomers().then((res) => setCustomers(res.data.customers)).catch(() => {});
    }
  }, [open]);

  if (!open) return null;

  const resetForm = () => {
    setName("");
    setClientId("");
    setValue("");
    setStartDate("");
    setEndDate("");
    setStatus("ACTIVE");
  };

  const handleSubmit = async () => {
    if (!name.trim() || !clientId || !value.trim() || !startDate) return;
    setSaving(true);
    try {
      await onCreate({
        name: name.trim(),
        clientId,
        value: value.trim(),
        startDate,
        endDate: endDate || undefined,
        status,
      });
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">New Project</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-slate-600">Project Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-600">Client</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 bg-white"
            >
              <option value="">Select a client</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.companyName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-600">Project Value (₦)</label>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400"
              placeholder="2500000.00"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-slate-600">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-600">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-600">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 bg-white"
            >
              <option value="ACTIVE">Active</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !name.trim() || !clientId || !value.trim() || !startDate}
            className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60"
          >
            {saving ? "Creating..." : "Create Project"}
          </button>
        </div>
      </div>
    </div>
  );
}