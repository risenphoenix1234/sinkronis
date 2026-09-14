"use client";

import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onApply: (filters: { department: string }) => void;
};

export default function FilterEmployeeModal({ open, onClose, onApply }: Props) {
  const [department, setDepartment] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Filter</h2>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-slate-600">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-400"
            >
              <option value="">All Departments</option>
              <option>Service Department</option>
              <option>Finance Department</option>
              <option>Specialist Department</option>
              <option>Marketing Department</option>
              <option>HR Department</option>
              <option>IT Department</option>
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
            onClick={() => { onApply({ department }); onClose(); }}
            className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}