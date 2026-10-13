// src/app/payroll/payee-groups/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPayeeGroup, getApiErrorMessage } from "@/lib/api/payroll";

const inputCls =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#2183C6]";

export default function NewPayeeGroupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Enter a group name.");
      return;
    }
    if (color && !/^#[0-9a-fA-F]{6}$/.test(color)) {
      setError("Colour must be a hex value like #2183C6.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await createPayeeGroup({
        name: trimmed,
        ...(description.trim() ? { description: description.trim() } : {}),
        ...(color ? { displayColor: color } : {}),
      });
      router.push("/payroll/payee-groups");
    } catch (e) {
      setError(getApiErrorMessage(e, "Could not create the group."));
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-slate-900">New Payee Group</h1>

      <div className="mt-6 max-w-xl space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-xs text-slate-500">Group Name</span>
          <input className={inputCls} placeholder="-input group name-" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs text-slate-500">Description (optional)</span>
          <textarea className={inputCls} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs text-slate-500">Colour (optional)</span>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={/^#[0-9a-fA-F]{6}$/.test(color) ? color : "#2183C6"}
              onChange={(e) => setColor(e.target.value)}
              className="h-9 w-12 cursor-pointer rounded border border-slate-300 bg-white p-1"
            />
            <input className={inputCls} placeholder="#2183C6" value={color} onChange={(e) => setColor(e.target.value)} />
          </div>
        </label>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.push("/payroll/payee-groups")}
            className="rounded-md bg-slate-100 px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={saving}
            className="rounded-md bg-[#2183C6] px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Creating..." : "Create Group"}
          </button>
        </div>
      </div>
    </div>
  );
}