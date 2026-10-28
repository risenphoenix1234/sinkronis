"use client";

import { useEffect, useState } from "react";
import Toggle from "@/components/ui/Toggle";
import { getSecurityPolicy, updatePasswordPolicy } from "@/lib/api/admin";
import Loader from "@/components/ui/Loader";

type ComplexityKey = "uppercase" | "lowercase" | "number" | "specialChar";

const complexityLabels: Record<ComplexityKey, string> = {
  uppercase: "Require uppercase letter (A-Z)",
  lowercase: "Require lowercase letter (a-z)",
  number: "Require at least one number (0-9)",
  specialChar: "Require special character (!@#$...)",
};

const minLengthOptions = [6, 8, 10, 12];
const expiryOptions: { label: string; value: number | null }[] = [
  { label: "30 days", value: 30 },
  { label: "60 days", value: 60 },
  { label: "90 days", value: 90 },
  { label: "180 days", value: 180 },
  { label: "Never", value: null },
];
const lockoutOptions = [3, 5, 10];

export default function PasswordPolicyPage() {
  const [minLength, setMinLength] = useState(8);
  const [expiry, setExpiry] = useState<number | null>(90);
  const [lockoutAfter, setLockoutAfter] = useState(5);
  const [complexity, setComplexity] = useState<Record<ComplexityKey, boolean>>({
    uppercase: true,
    lowercase: true,
    number: true,
    specialChar: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const policy = await getSecurityPolicy();
        setMinLength(policy.minPasswordLength);
        setExpiry(policy.passwordExpiryDays);
        setLockoutAfter(policy.lockoutMaxAttempts);
        setComplexity({
          uppercase: policy.requireUppercase,
          lowercase: policy.requireLowercase,
          number: policy.requireNumber,
          specialChar: policy.requireSpecialCharacter,
        });
      } catch (err) {
        setError("Failed to load password policy.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleComplexity = (key: ComplexityKey) => {
    setComplexity((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaveMessage(null);
    try {
      await updatePasswordPolicy({
        minPasswordLength: minLength,
        passwordExpiryDays: expiry,
        lockoutMaxAttempts: lockoutAfter,
        requireUppercase: complexity.uppercase,
        requireLowercase: complexity.lowercase,
        requireNumber: complexity.number,
        requireSpecialCharacter: complexity.specialChar,
      });
      setSaveMessage("Password policy saved.");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to save policy.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl rounded-lg border border-slate-200 bg-white p-6">
        <Loader variant="section" label="Loading password policy" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="mb-5 text-base font-semibold text-slate-900">
        Password Requirements
      </h2>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {error}
        </div>
      )}

      {saveMessage && (
        <div className="mb-4 rounded-md bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
          {saveMessage}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
            Minimum Length
          </label>
          <select
            value={minLength}
            onChange={(e) => setMinLength(Number(e.target.value))}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
          >
            {minLengthOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt} characters
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
            Password Expiry
          </label>
          <select
            value={expiry === null ? "null" : expiry}
            onChange={(e) =>
              setExpiry(e.target.value === "null" ? null : Number(e.target.value))
            }
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
          >
            {expiryOptions.map((opt) => (
              <option key={opt.label} value={opt.value === null ? "null" : opt.value}>
                {opt.label}
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
            onChange={(e) => setLockoutAfter(Number(e.target.value))}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
          >
            {lockoutOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt} failed attempts
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
            <div key={key} className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-slate-700">{complexityLabels[key]}</span>
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