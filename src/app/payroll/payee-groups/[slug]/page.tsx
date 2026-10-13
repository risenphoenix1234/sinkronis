// src/app/payroll/payee-groups/[slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getApiErrorMessage, getPayeeGroups, updatePayeeGroup } from "@/lib/api/payroll";

const inputCls =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#2183C6]";

export default function EditPayeeGroupPage() {
  const { slug: groupId } = useParams<{ slug: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const groups = await getPayeeGroups();
        const group = groups.find((g) => g.id === groupId);
        if (cancelled) return;
        if (!group) {
          setMissing(true);
        } else {
          setName(group.name);
          setDescription(group.description ?? "");
          setColor(group.displayColor ?? "");
          setActive(group.active);
        }
      } catch (e) {
        if (!cancelled) setError(getApiErrorMessage(e, "Could not load this group."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [groupId]);

  const save = async () => {
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
    setSaved(false);
    try {
      await updatePayeeGroup(groupId, {
        name: trimmed,
        description: description.trim() || null,
        displayColor: color || null,
        active,
      });
      setSaved(true);
    } catch (e) {
      setError(getApiErrorMessage(e, "Could not save changes."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-sm text-slate-400">Loading...</div>;
  if (missing) return <div className="p-6 text-sm text-slate-500">This payee group was not found.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-slate-900">Edit Payee Group</h1>

      <div className="mt-6 max-w-xl space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-xs text-slate-500">Group Name</span>
          <input className={inputCls} value={name} onChange={(e) => { setSaved(false); setName(e.target.value); }} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs text-slate-500">Description</span>
          <textarea className={inputCls} rows={3} value={description} onChange={(e) => { setSaved(false); setDescription(e.target.value); }} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs text-slate-500">Colour</span>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={/^#[0-9a-fA-F]{6}$/.test(color) ? color : "#2183C6"}
              onChange={(e) => { setSaved(false); setColor(e.target.value); }}
              className="h-9 w-12 cursor-pointer rounded border border-slate-300 bg-white p-1"
            />
            <input className={inputCls} placeholder="#2183C6" value={color} onChange={(e) => { setSaved(false); setColor(e.target.value); }} />
          </div>
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => { setSaved(false); setActive(e.target.checked); }}
            className="h-4 w-4 accent-[#2183C6]"
          />
          Group is active
        </label>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && <span className="text-sm text-green-600">Saved</span>}
          <button
            type="button"
            onClick={() => router.push("/payroll/payee-groups")}
            className="rounded-md bg-slate-100 px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            Back
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-md bg-[#2183C6] px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}