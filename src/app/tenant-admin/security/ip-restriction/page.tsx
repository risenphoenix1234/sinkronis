// src/app/tenant-admin/security/ip-restriction/page.tsx
"use client";

import { useEffect, useState } from "react";
import Toggle from "@/components/ui/Toggle";
import {
  getIpAllowlist,
  addIpAllowlistEntry,
  toggleIpAllowlist,
  removeIpAllowlistEntry,
} from "@/lib/api/admin";
import { SecurityIpAllowlistEntry } from "@/lib/api/types/admin.types";
import Loader from "@/components/ui/Loader";

export default function IpRestrictionPage() {
  const [enabled, setEnabled] = useState(false);
  const [entries, setEntries] = useState<SecurityIpAllowlistEntry[]>([]);
  const [newCidr, setNewCidr] = useState("");
  const [newLabel, setNewLabel] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [togglingEnabled, setTogglingEnabled] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetchAllowlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getIpAllowlist();
      setEnabled(res.enabled);
      setEntries(res.entries);
    } catch (err) {
      setError("Failed to load IP allowlist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllowlist();
  }, []);

  const handleToggle = async (next: boolean) => {
    setTogglingEnabled(true);
    setError(null);
    const previous = enabled;
    setEnabled(next);
    try {
      await toggleIpAllowlist({ enabled: next });
    } catch (err: any) {
      setEnabled(previous);
      setError(err?.response?.data?.message || "Failed to update allowlist enforcement.");
    } finally {
      setTogglingEnabled(false);
    }
  };

  const handleAdd = async () => {
    if (!newCidr.trim()) return;
    setAdding(true);
    setError(null);
    try {
      await addIpAllowlistEntry({
        value: newCidr.trim(),
        label: newLabel.trim() || undefined,
      });
      setNewCidr("");
      setNewLabel("");
      await fetchAllowlist();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to add IP entry.");
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (id: string) => {
    setRemovingId(id);
    setError(null);
    try {
      await removeIpAllowlistEntry(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to remove entry.");
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl rounded-lg border border-slate-200 bg-white p-6">
        <Loader variant="section" label="Loading IP allowlist" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl rounded-lg border border-slate-200 bg-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">IP Allowlist</h2>
          <p className="mt-1 text-sm text-slate-500">
            Restrict login to these IP addresses or CIDR ranges only.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">{enabled ? "Enabled" : "Disabled"}</span>
          <Toggle
            checked={enabled}
            onChange={handleToggle}
            disabled={togglingEnabled}
            ariaLabel="IP Allowlist"
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mt-5 space-y-2">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between rounded-md border border-slate-100 px-4 py-3"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-slate-400">📍</span>
              <div>
                <p className="font-mono text-sm text-slate-800">{entry.value}</p>
                <p className="text-xs text-slate-400">{entry.label || "Unlabeled"}</p>
              </div>
            </div>
            <button
              onClick={() => handleRemove(entry.id)}
              disabled={removingId === entry.id}
              aria-label={`Remove ${entry.value}`}
              className="text-slate-400 hover:text-rose-600 disabled:opacity-50"
            >
              {removingId === entry.id ? "…" : "✕"}
            </button>
          </div>
        ))}

        {entries.length === 0 && (
          <p className="py-6 text-center text-sm text-slate-400">
            No IP addresses added yet.
          </p>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="e.g. 197.210.0.0/24"
          value={newCidr}
          onChange={(e) => setNewCidr(e.target.value)}
          className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
        />
        <input
          type="text"
          placeholder="Label (optional)"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
        />
      </div>

      <button
        onClick={handleAdd}
        disabled={adding}
        className="mt-3 flex items-center gap-1.5 text-sm font-medium text-sky-600 hover:underline disabled:opacity-60"
      >
        <span className="text-base leading-none">+</span> {adding ? "Adding..." : "Add IP Address"}
      </button>
    </div>
  );
}