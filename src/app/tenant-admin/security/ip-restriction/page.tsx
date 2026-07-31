// src/app/tenant-admin/security/ip-restriction/page.tsx
"use client";

import { useState } from "react";
import Toggle from "@/components/ui/Toggle";

type IpEntry = {
  id: string;
  cidr: string;
  label: string;
};

const initialEntries: IpEntry[] = [
  { id: "ip-1", cidr: "197.210.0.0/24", label: "Lagos HQ" },
  { id: "ip-2", cidr: "105.112.0.0/24", label: "Abuja Office" },
  { id: "ip-3", cidr: "41.184.0.0/24", label: "Port Harcourt Branch" },
];

export default function IpRestrictionPage() {
  const [enabled, setEnabled] = useState(false);
  const [entries, setEntries] = useState<IpEntry[]>(initialEntries);
  const [newCidr, setNewCidr] = useState("");
  const [newLabel, setNewLabel] = useState("");

  const handleAdd = () => {
    if (!newCidr.trim()) return;
    setEntries((prev) => [
      ...prev,
      {
        id: `ip-${Date.now()}`,
        cidr: newCidr.trim(),
        label: newLabel.trim() || "Unlabeled",
      },
    ]);
    setNewCidr("");
    setNewLabel("");
  };

  const handleRemove = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="max-w-2xl rounded-lg border border-slate-200 bg-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            IP Allowlist
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Restrict login to these IP addresses or CIDR ranges only.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">
            {enabled ? "Enabled" : "Disabled"}
          </span>
          <Toggle
            checked={enabled}
            onChange={setEnabled}
            ariaLabel="IP Allowlist"
          />
        </div>
      </div>

      <div className="mt-5 space-y-2">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between rounded-md border border-slate-100 px-4 py-3"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-slate-400">📍</span>
              <div>
                <p className="font-mono text-sm text-slate-800">
                  {entry.cidr}
                </p>
                <p className="text-xs text-slate-400">{entry.label}</p>
              </div>
            </div>
            <button
              onClick={() => handleRemove(entry.id)}
              aria-label={`Remove ${entry.cidr}`}
              className="text-slate-400 hover:text-rose-600"
            >
              ✕
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
        className="mt-3 flex items-center gap-1.5 text-sm font-medium text-sky-600 hover:underline"
      >
        <span className="text-base leading-none">+</span> Add IP Address
      </button>
    </div>
  );
}