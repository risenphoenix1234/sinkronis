// src/app/tenant-admin/security/password-policy/page.tsx
"use client";

import { useState } from "react";
import Toggle from "@/components/ui/Toggle";

type ComplexityKey =
  | "uppercase"
  | "lowercase"
  | "number"
  | "specialChar";

const complexityLabels: Record<ComplexityKey, string> = {
  uppercase: "Require uppercase letter (A-Z)",
  lowercase: "Require lowercase letter (a-z)",
  number: "Require at least one number (0-9)",
  specialChar: "Require special character (!@#$...)",
};

const minLengthOptions = ["6 characters", "8 characters", "10 characters", "12 characters"];
const expiryOptions = ["30 days", "60 days", "90 days", "180 days", "Never"];
const lockoutOptions = [
  "3 failed attempts",
  "5 failed attempts",
  "10 failed attempts",
];

export default function PasswordPolicyPage() {
  const [minLength, setMinLength] = useState("8 characters");
  const [expiry, setExpiry] = useState("90 days");
  const [lockoutAfter, setLockoutAfter] = useState("5 failed attempts");
  const [complexity, setComplexity] = useState<Record<ComplexityKey, boolean>>({
    uppercase: true,
    lowercase: true,
    number: true,
    specialChar: false,
  });
  const [saving, setSaving] = useState(false);

  const toggleComplexity = (key: ComplexityKey) => {
    setComplexity((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 600);
  };

  return (
    <div className="max-w-2xl rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="mb-5 text-base font-semibold text-slate-900">
        Password Requirements
      </h2>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
            Minimum Length
          </label>
          <select
            value={minLength}
            onChange={(e) => setMinLength(e.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
          >
            {minLengthOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
            Password Expiry
          </label>
          <select
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
          >
            {expiryOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
            Account Lockout After
          </label>
          <select
            value={lockoutAfter}
            onChange={(e) => setLockoutAfter(e.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
          >
            {lockoutOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Complexity Requirements
        </p>
        <div className="divide-y divide-slate-100 rounded-md border border-slate-100">
          {(Object.keys(complexityLabels) as ComplexityKey[]).map((key) => (
            <div
              key={key}
              className="flex items-center justify-between px-4 py-3"
            >
              <span className="text-sm text-slate-700">
                {complexityLabels[key]}
              </span>
              <Toggle
                checked={complexity[key]}
                onChange={() => toggleComplexity(key)}
                ariaLabel={complexityLabels[key]}
              />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-6 rounded-md bg-[#2183C6] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1c70ab] disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save Policy"}
      </button>
    </div>
  );
}