// src/components/modals/EditProjectModal.tsx
"use client";

import { useEffect, useState } from "react";
import { ProjectListItem, CreateProjectPayload } from "@/lib/api/types/accounting.types";

type Props = {
  open: boolean;
  project: ProjectListItem | null;
  onClose: () => void;
  onSave: (id: string, payload: Partial<CreateProjectPayload>) => Promise<void>;
};

export default function EditProjectModal({ open, project, onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<"ACTIVE" | "ON_HOLD" | "COMPLETED">("ACTIVE");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && project) {
      setName(project.name);
      setValue(String(project.value));
      setStartDate(project.startDate ? project.startDate.slice(0, 10) : "");
      setEndDate(project.endDate ? project.endDate.slice(0, 10) : "");
      setStatus(project.status);
    }
  }, [open, project]);

  if (!open || !project) return null;

  const handleSubmit = async () => {
    if (!name.trim() || !value.trim() || !startDate) return;
    setSaving(true);
    try {
      await onSave(project.id, {
        name: name.trim(),
        value: value.trim(),
        startDate,
        endDate: endDate || undefined,
        status,
      });
      onClose();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to update project.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-md border border-[#E5E8EB] bg-white px-3 py-2 text-sm text-[#212B36] outline-none focus:border-[#2183C6]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#212B36]">Edit Project</h2>
          <button onClick={onClose} className="text-xl leading-none text-[#919EAB] hover:text-[#637381]">
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-[#637381]">Project Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className="mb-1 block text-sm text-[#637381]">Client</label>
            <input value={project.clientName} disabled className={`${inputClass} bg-[#F4F6F8] text-[#919EAB]`} />
          </div>

          <div>
            <label className="mb-1 block text-sm text-[#637381]">Project Value (₦)</label>
            <input value={value} onChange={(e) => setValue(e.target.value)} className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-[#637381]">Start Date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm text-[#637381]">End Date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-[#637381]">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className={inputClass}>
              <option value="ACTIVE">Active</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md border border-[#E5E8EB] px-4 py-2 text-sm text-[#637381] hover:bg-[#F4F6F8]"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !name.trim() || !value.trim() || !startDate}
            className="rounded-md bg-[#2183C6] px-4 py-2 text-sm font-medium text-white hover:bg-[#1976B8] disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}