"use client";

import { useEffect, useState } from "react";
import { AdminRole, AgentListItem, UpdateAgentPayload } from "@/lib/api/types/accounting.types";
import { getAccountingRoles } from "@/lib/api/accounting";

type Props = {
  open: boolean;
  onClose: () => void;
  agent: AgentListItem | null;
  onSave: (id: string, payload: UpdateAgentPayload) => Promise<void>;
};

export default function EditAgentModal({ open, onClose, agent, onSave }: Props) {
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [roleId, setRoleId] = useState("");
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    getAccountingRoles().then((r) => setRoles(r)).catch(() => setRoles([]));
  }, [open]);

  useEffect(() => {
    if (agent) {
      setFullName(agent.name);
      setPhone(agent.phone ?? "");
      setRoleId(agent.role?.id ?? "");
      setStatus(agent.status === "INACTIVE" ? "INACTIVE" : "ACTIVE");
      setError(null);
    }
  }, [agent]);

  if (!open || !agent) return null;

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload: UpdateAgentPayload = {};
      if (fullName.trim() && fullName.trim() !== agent.name) payload.fullName = fullName.trim();
      if (phone.trim() !== (agent.phone ?? "")) payload.phone = phone.trim() || null;
      if (roleId && roleId !== agent.role?.id) payload.roleId = roleId;
      if (status !== agent.status) payload.status = status;

      if (Object.keys(payload).length === 0) {
        onClose();
        return;
      }

      await onSave(agent.id, payload);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update agent.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Edit Agent</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
        </div>
        <p className="mb-5 text-sm text-slate-500">{agent.agentId ?? agent.email}</p>

        {error && <div className="mb-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</div>}

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-slate-600">Full Name</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-600">Email</label>
            <input
              value={agent.email}
              disabled
              className="w-full cursor-not-allowed rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-400 outline-none"
            />
            <p className="mt-1 text-xs text-slate-400">Email cannot be changed here.</p>
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-600">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+2348012345678"
              className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-600">Role</label>
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-400"
            >
              <option value="">Select a role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-600">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "ACTIVE" | "INACTIVE")}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-400"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}