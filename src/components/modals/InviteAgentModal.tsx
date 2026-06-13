"use client";

import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function InviteAgentModal({ open, onClose }: Props) {
  const [form, setForm] = useState({
    fullName: "",
    emailAddress: "",
    phoneNumber: "",
    role: "",
  });

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Invite Agent</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none"
          >
            ×
          </button>
        </div>
        <p className="mb-5 text-sm text-slate-500">
          An invitation email will be sent to the agent.
        </p>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-slate-600">Full Name</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600">Email Address</label>
            <input
              name="emailAddress"
              type="email"
              value={form.emailAddress}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600">Phone Number</label>
            <input
              name="phoneNumber"
              type="tel"
              value={form.phoneNumber}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600">Role</label>
            <input
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-400"
            />
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
            onClick={onClose}
            className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
          >
            Send Invite
          </button>
        </div>
      </div>
    </div>
  );
}