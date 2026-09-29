"use client";

import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function NewProjectModal({ open, onClose }: Props) {
  const [form, setForm] = useState({
    projectName: "",
    client: "",
    assignedAgent: "",
    projectValue: "",
    startDate: "",
    endDate: "",
    status: "",
  });

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // hook up to your API here
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">New Project</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-slate-600">
              Project Name
            </label>
            <input
              name="projectName"
              value={form.projectName}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-600">Client</label>
            <input
              name="client"
              value={form.client}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-600">
              Assigned Agent
            </label>
            <input
              name="assignedAgent"
              value={form.assignedAgent}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-600">
              Project Value (₦)
            </label>
            <input
              name="projectValue"
              value={form.projectValue}
              onChange={handleChange}
              type="number"
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-slate-600">
                Start Date
              </label>
              <input
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                type="date"
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-600">
                End Date
              </label>
              <input
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                type="date"
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-600">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 bg-white"
            >
              <option value="">Select status</option>
              <option value="Active">Active</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
}
