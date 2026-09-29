"use client";

import { useEffect, useState } from "react";
import {
  AdminRole,
  InviteAgentPayload,
  InviteAgentsBulkPayload,
  InviteAgentsBulkResponse,
} from "@/lib/api/types/accounting.types";
import { getAccountingRoles } from "@/lib/api/accounting";

type Mode = "single" | "bulk";

type Props = {
  open: boolean;
  onClose: () => void;
  onInvite: (payload: InviteAgentPayload) => Promise<void>;
  onBulkInvite: (payload: InviteAgentsBulkPayload) => Promise<InviteAgentsBulkResponse>;
};

export default function InviteAgentModal({ open, onClose, onInvite, onBulkInvite }: Props) {
  const [mode, setMode] = useState<Mode>("single");
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [roleId, setRoleId] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [bulkEmails, setBulkEmails] = useState("");
  const [bulkResult, setBulkResult] = useState<InviteAgentsBulkResponse["data"] | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    getAccountingRoles()
      .then((r) => setRoles(r))
      .catch(() => setRoles([]));
  }, [open]);

  if (!open) return null;

  const resetAndClose = () => {
    setFullName("");
    setEmail("");
    setPhone("");
    setBulkEmails("");
    setBulkResult(null);
    setRoleId("");
    setError(null);
    setMode("single");
    onClose();
  };

  const handleSingleSubmit = async () => {
    if (!fullName.trim() || !email.trim() || !roleId) {
      setError("Full name, email, and role are required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onInvite({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        roleId,
      });
      resetAndClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to send invite.");
    } finally {
      setSaving(false);
    }
  };

  const handleBulkSubmit = async () => {
    if (!bulkEmails.trim() || !roleId) {
      setError("At least one email and a role are required.");
      return;
    }
    setSaving(true);
    setError(null);
    setBulkResult(null);
    try {
      const res = await onBulkInvite({ entries: bulkEmails.trim(), roleId });
      setBulkResult(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to process bulk invites.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Invite Agent</h2>
          <button onClick={resetAndClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
        </div>
        <p className="mb-4 text-sm text-slate-500">An invitation email will be sent to the agent.</p>

        <div className="mb-4 flex gap-1 rounded-md bg-slate-100 p-1 text-sm">
          <button
            onClick={() => { setMode("single"); setError(null); }}
            className={`flex-1 rounded px-3 py-1.5 font-medium ${mode === "single" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"}`}
          >
            Single
          </button>
          <button
            onClick={() => { setMode("bulk"); setError(null); }}
            className={`flex-1 rounded px-3 py-1.5 font-medium ${mode === "bulk" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"}`}
          >
            Bulk
          </button>
        </div>

        {error && <div className="mb-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</div>}

        {mode === "single" && (
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
              <label className="mb-1 block text-sm text-slate-600">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-600">Phone Number (optional)</label>
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
          </div>
        )}

        {mode === "bulk" && (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-slate-600">
                Emails (one per line, or comma-separated)
              </label>
              <textarea
                value={bulkEmails}
                onChange={(e) => setBulkEmails(e.target.value)}
                rows={5}
                placeholder={"amina.yusuf@example.com\nchidi.okafor@example.com"}
                className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-400 resize-none"
              />
              <p className="mt-1 text-xs text-slate-400">
                Names are generated from each email. Phone numbers aren't supported in bulk invites.
              </p>
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

            {bulkResult && (
              <div className="space-y-2 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs">
                <p className="font-medium text-emerald-700">Invited ({bulkResult.invited.length})</p>
                {bulkResult.invited.map((r, i) => <p key={i} className="text-slate-600">{r.email}</p>)}
                {bulkResult.skipped.length > 0 && (
                  <>
                    <p className="font-medium text-amber-700">Skipped ({bulkResult.skipped.length})</p>
                    {bulkResult.skipped.map((r, i) => <p key={i} className="text-slate-600">{r.email} {r.reason ? `— ${r.reason}` : ""}</p>)}
                  </>
                )}
                {bulkResult.failed.length > 0 && (
                  <>
                    <p className="font-medium text-rose-700">Failed ({bulkResult.failed.length})</p>
                    {bulkResult.failed.map((r, i) => <p key={i} className="text-slate-600">{r.email} {r.reason ? `— ${r.reason}` : ""}</p>)}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={resetAndClose} className="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
            {bulkResult ? "Close" : "Cancel"}
          </button>
          {!bulkResult && (
            <button
              onClick={mode === "single" ? handleSingleSubmit : handleBulkSubmit}
              disabled={saving}
              className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60"
            >
              {saving ? "Sending..." : mode === "single" ? "Send Invite" : "Send Invites"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}