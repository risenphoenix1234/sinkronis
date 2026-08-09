// src/components/modals/AddTenantModal.tsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Plan, ModuleName } from "@/lib/pa-tenants-data";

const ALL_PLANS: Plan[] = ["Starter", "Growth", "Enterprise", "Trial"];
const ALL_MODULES: ModuleName[] = ["HRIS", "Accounting", "Payroll"];

interface AddTenantModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddTenantModal({ open, onClose }: AddTenantModalProps) {
  const [companyName, setCompanyName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [plan, setPlan] = useState<Plan | "">("");
  const [modules, setModules] = useState<ModuleName[]>([]);
  const [country, setCountry] = useState("Nigeria");

  if (!open) return null;

  const toggleModule = (mod: ModuleName) => {
    setModules((prev) =>
      prev.includes(mod) ? prev.filter((m) => m !== mod) : [...prev, mod]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Add Tenant</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Create a new company on the platform
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-700">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Acme Corp"
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700">
              Admin Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="admin@company.ng"
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700">Plan</label>
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value as Plan)}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            >
              <option value="">Select a plan</option>
              {ALL_PLANS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700">Modules</label>
            <div className="mt-2 flex gap-4">
              {ALL_MODULES.map((mod) => (
                <label key={mod} className="flex items-center gap-1.5 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={modules.includes(mod)}
                    onChange={() => toggleModule(mod)}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  {mod}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700">Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            >
              <option value="Nigeria">Nigeria</option>
              <option value="Ghana">Ghana</option>
              <option value="Kenya">Kenya</option>
              <option value="South Africa">South Africa</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-md bg-brand-600 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Add Tenant
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-md border border-slate-200 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}