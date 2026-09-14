"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const PLAN_MODULES: Record<string, string[]> = {
  HRIS: ["HRIS"],
  PAYROLL: ["Payroll"],
  ACCOUNTING: ["Accounting"],
  ALL_IN_ONE: ["HRIS", "Payroll", "Accounting"],
};

const ALL_PLANS = ["HRIS", "PAYROLL", "ACCOUNTING", "ALL_IN_ONE"];

const COUNTRIES = [
  { code: "NG", name: "Nigeria" },
  { code: "GH", name: "Ghana" },
  { code: "KE", name: "Kenya" },
  { code: "ZA", name: "South Africa" },
];

export interface NewTenantInput {
  companyName: string;
  adminEmail: string;
  subscriptionPlan: string;
  country: string;
  industry?: string;
}

interface AddTenantModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (input: NewTenantInput) => Promise<void>;
}

export default function AddTenantModal({ open, onClose, onAdd }: AddTenantModalProps) {
  const [companyName, setCompanyName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [subscriptionPlan, setSubscriptionPlan] = useState("");
  const [country, setCountry] = useState("NG");
  const [industry, setIndustry] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setCompanyName("");
      setAdminEmail("");
      setSubscriptionPlan("");
      setCountry("NG");
      setIndustry("");
      setFormError(null);
      setSubmitting(false);
    }
  }, [open]);

  if (!open) return null;

  const derivedModules = subscriptionPlan ? PLAN_MODULES[subscriptionPlan] ?? [] : [];

  const handleSubmit = async () => {
    if (!companyName || !adminEmail || !subscriptionPlan) {
      setFormError("Please fill in all required fields.");
      return;
    }

    setFormError(null);
    setSubmitting(true);
    try {
      await onAdd({
        companyName,
        adminEmail,
        subscriptionPlan,
        country,
        industry: industry || undefined,
      });
    } catch (err: any) {
      setFormError(
        err?.response?.data?.message || "Failed to add tenant. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
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

        {formError && (
          <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">
            {formError}
          </div>
        )}

        <div className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-700">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Acme Nigeria Limited"
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
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
              placeholder="admin@acme.example"
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700">
              Subscription Plan <span className="text-red-500">*</span>
            </label>
            <select
              value={subscriptionPlan}
              onChange={(e) => setSubscriptionPlan(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
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
            <div className="mt-2 flex flex-wrap gap-2">
              {derivedModules.length === 0 && (
                <span className="text-xs text-slate-400">Select a plan to see included modules</span>
              )}
              {derivedModules.map((mod) => (
                <span
                  key={mod}
                  className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                >
                  {mod}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700">Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700">Industry</label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g. Technology"
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 rounded-md bg-sky-600 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60"
          >
            {submitting ? "Adding..." : "Add Tenant"}
          </button>
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 rounded-md border border-slate-200 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}