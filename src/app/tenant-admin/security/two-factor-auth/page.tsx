"use client";

import { useEffect, useState } from "react";
import Toggle from "@/components/ui/Toggle";
import { getSecurityPolicy, updateTwoFactorPolicy } from "@/lib/api/admin";

type MethodKey = "authenticatorApp" | "sms" | "emailOtp";

const methods: { key: MethodKey; title: string; subtitle: string }[] = [
  {
    key: "authenticatorApp",
    title: "Authenticator App",
    subtitle: "Google Authenticator, Authy, etc.",
  },
  {
    key: "sms",
    title: "SMS / Text Message",
    subtitle: "One-time code via mobile number",
  },
  {
    key: "emailOtp",
    title: "Email OTP",
    subtitle: "One-time code via registered email",
  },
];

export default function TwoFactorAuthPage() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [enforceForAll, setEnforceForAll] = useState(false);
  const [methodState, setMethodState] = useState<Record<MethodKey, boolean>>({
    authenticatorApp: true,
    sms: false,
    emailOtp: true,
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
        setTwoFactorEnabled(policy.twoFactorEnabled);
        setEnforceForAll(policy.enforceTwoFactorForAllUsers);
        setMethodState({
          authenticatorApp: policy.allowAuthenticatorApp,
          sms: policy.allowSmsOtp,
          emailOtp: policy.allowEmailOtp,
        });
      } catch (err) {
        setError("Failed to load two-factor settings.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleMethod = (key: MethodKey) => {
    setMethodState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaveMessage(null);
    try {
      await updateTwoFactorPolicy({
        twoFactorEnabled,
        enforceTwoFactorForAllUsers: enforceForAll,
        allowAuthenticatorApp: methodState.authenticatorApp,
        allowSmsOtp: methodState.sms,
        allowEmailOtp: methodState.emailOtp,
      });
      setSaveMessage("Two-factor settings saved.");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl rounded-lg border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-400">Loading two-factor settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl rounded-lg border border-slate-200 bg-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Two-Factor Authentication
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Add an extra layer of security to all accounts.
          </p>
        </div>
        <Toggle
          checked={twoFactorEnabled}
          onChange={setTwoFactorEnabled}
          ariaLabel="Two-Factor Authentication"
        />
      </div>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {error}
        </div>
      )}

      {saveMessage && (
        <div className="mt-4 rounded-md bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
          {saveMessage}
        </div>
      )}

      <div className="mt-4 flex items-start justify-between border-t border-slate-100 pt-4">
        <div>
          <p className="text-sm font-medium text-slate-800">
            Enforce for all users
          </p>
          <p className="mt-0.5 text-sm text-slate-500">
            Users cannot skip 2FA setup at login.
          </p>
        </div>
        <Toggle
          checked={enforceForAll}
          onChange={setEnforceForAll}
          disabled={!twoFactorEnabled}
          ariaLabel="Enforce for all users"
        />
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Allowed Methods
        </p>
        <div className="divide-y divide-slate-100 rounded-md border border-slate-100">
          {methods.map((method) => (
            <div key={method.key} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium text-slate-800">{method.title}</p>
                <p className="text-sm text-slate-500">{method.subtitle}</p>
              </div>
              <Toggle
                checked={methodState[method.key]}
                onChange={() => toggleMethod(method.key)}
                disabled={!twoFactorEnabled}
                ariaLabel={method.title}
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
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
}