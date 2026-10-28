// src/app/platform-admin/settings/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  getPlatformSettings,
  updatePlatformConfiguration,
  updatePasswordPolicy,
  updateFeatureFlag,
  updateEmailTemplate,
  updateMaintenanceMode,
} from "@/lib/api/platform-admin";
import {
  PlatformConfiguration,
  PasswordPolicy,
  FeatureFlag,
  EmailTemplate,
  MaintenanceMode,
} from "@/lib/api/types/platform-admin.types";
import EditEmailTemplateModal from "@/components/modals/EditEmailTemplateModal";
import Loader from "@/components/ui/Loader";

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      role="switch"
      aria-checked={on}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        on ? "bg-sky-600" : "bg-slate-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          on ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [config, setConfig] = useState<PlatformConfiguration | null>(null);
  const [policy, setPolicy] = useState<PasswordPolicy | null>(null);
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceMode | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingConfig, setSavingConfig] = useState(false);
  const [savingPolicy, setSavingPolicy] = useState(false);
  const [togglingMaintenance, setTogglingMaintenance] = useState(false);

  const [editingTemplateKey, setEditingTemplateKey] = useState<string | null>(null);
  const editingTemplate = templates.find((t) => t.key === editingTemplateKey) ?? null;

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getPlatformSettings();
        setConfig(res.data.configuration);
        setPolicy(res.data.passwordPolicy);
        setFlags(res.data.featureFlags);
        setTemplates(res.data.emailTemplates);
        setMaintenance(res.data.maintenance);
      } catch (err) {
        setError("Failed to load settings.");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSaveConfig = async () => {
    if (!config) return;
    setSavingConfig(true);
    try {
      const res = await updatePlatformConfiguration({
        defaultCurrency: config.defaultCurrency,
        vatRate: config.vatRate,
        defaultTimezone: config.defaultTimezone,
        supportEmail: config.supportEmail,
      });
      setConfig(res.data);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to save configuration.");
    } finally {
      setSavingConfig(false);
    }
  };

  const handleSavePolicy = async () => {
    if (!policy) return;
    setSavingPolicy(true);
    try {
      const res = await updatePasswordPolicy({
        minimumLength: policy.minimumLength,
        passwordExpiryDays: policy.passwordExpiryDays,
        accountLockoutAttempts: policy.accountLockoutAttempts,
        requireUppercase: policy.requireUppercase,
        requireLowercase: policy.requireLowercase,
        requireNumber: policy.requireNumber,
        requireSpecialCharacter: policy.requireSpecialCharacter,
      });
      setPolicy(res.data);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to save password policy.");
    } finally {
      setSavingPolicy(false);
    }
  };

  const handleToggleFlag = async (key: string, currentValue: boolean) => {
    try {
      const res = await updateFeatureFlag(key, !currentValue);
      setFlags((prev) => prev.map((f) => (f.key === key ? res.data : f)));
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to update feature flag.");
    }
  };

  const handleSaveTemplate = async (key: string, subject: string, body: string) => {
    try {
      const res = await updateEmailTemplate(key, { subject, body });
      setTemplates((prev) => prev.map((t) => (t.key === key ? res.data : t)));
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to save template.");
    }
  };

  const handleToggleMaintenance = async () => {
    if (!maintenance) return;
    setTogglingMaintenance(true);
    try {
      const res = await updateMaintenanceMode({
        enabled: !maintenance.enabled,
        message: maintenance.message,
      });
      setMaintenance(res.data);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to update maintenance mode.");
    } finally {
      setTogglingMaintenance(false);
    }
  };

  if (loading) {
    return (
      <section className="p-6">
        <Loader variant="section" label="Loading settings" />
      </section>
    );
  }

  if (error || !config || !policy) {
    return (
      <section className="p-6">
        <p className="text-sm text-red-500">{error ?? "No data available."}</p>
      </section>
    );
  }

  return (
    <section className="space-y-5 bg-slate-50 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Platform Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Configure platform-wide settings, feature flags and communication templates.
        </p>
      </div>

      {/* Platform Configuration */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-800">Platform Configuration</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-slate-700">Default Currency</label>
            <input
              type="text"
              value={config.defaultCurrency}
              onChange={(e) => setConfig({ ...config, defaultCurrency: e.target.value })}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700">VAT Rate (%)</label>
            <input
              type="number"
              value={config.vatRate}
              onChange={(e) => setConfig({ ...config, vatRate: Number(e.target.value) })}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700">Default Timezone</label>
            <input
              type="text"
              value={config.defaultTimezone}
              onChange={(e) => setConfig({ ...config, defaultTimezone: e.target.value })}
              placeholder="e.g. Africa/Lagos"
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700">Support Email</label>
            <input
              type="email"
              value={config.supportEmail}
              onChange={(e) => setConfig({ ...config, supportEmail: e.target.value })}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSaveConfig}
            disabled={savingConfig}
            className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60"
          >
            {savingConfig ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Password Requirements */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-800">Password Requirements</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Minimum Length
            </label>
            <input
              type="number"
              value={policy.minimumLength}
              onChange={(e) => setPolicy({ ...policy, minimumLength: Number(e.target.value) })}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Password Expiry (days)
            </label>
            <input
              type="number"
              value={policy.passwordExpiryDays}
              onChange={(e) => setPolicy({ ...policy, passwordExpiryDays: Number(e.target.value) })}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Lockout After (attempts)
            </label>
            <input
              type="number"
              value={policy.accountLockoutAttempts}
              onChange={(e) => setPolicy({ ...policy, accountLockoutAttempts: Number(e.target.value) })}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>

        <div className="mt-5">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Complexity Requirements
          </p>
          <div className="mt-2 divide-y divide-slate-100">
            <div className="flex items-center justify-between py-2.5">
              <span className="text-sm text-slate-700">Require uppercase letter</span>
              <Toggle
                on={policy.requireUppercase}
                onClick={() => setPolicy({ ...policy, requireUppercase: !policy.requireUppercase })}
              />
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-sm text-slate-700">Require lowercase letter</span>
              <Toggle
                on={policy.requireLowercase}
                onClick={() => setPolicy({ ...policy, requireLowercase: !policy.requireLowercase })}
              />
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-sm text-slate-700">Require number</span>
              <Toggle
                on={policy.requireNumber}
                onClick={() => setPolicy({ ...policy, requireNumber: !policy.requireNumber })}
              />
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-sm text-slate-700">Require special character</span>
              <Toggle
                on={policy.requireSpecialCharacter}
                onClick={() => setPolicy({ ...policy, requireSpecialCharacter: !policy.requireSpecialCharacter })}
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={handleSavePolicy}
            disabled={savingPolicy}
            className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60"
          >
            {savingPolicy ? "Saving..." : "Save Policy"}
          </button>
        </div>
      </div>

      {/* Feature Flags */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-800">Feature Flags</h2>
        <p className="text-xs text-slate-500">Toggle experimental features globally across all tenants.</p>
        <div className="mt-3 divide-y divide-slate-100">
          {flags.map((flag) => (
            <div key={flag.key} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-slate-800">{flag.name}</p>
                <p className="text-xs text-slate-500">{flag.description}</p>
              </div>
              <Toggle on={flag.enabled} onClick={() => handleToggleFlag(flag.key, flag.enabled)} />
            </div>
          ))}
        </div>
      </div>

      {/* Email Templates */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-800">Email Templates</h2>
        <p className="text-xs text-slate-500">
          Customise notification emails sent to tenants. Use {"{{variable}}"} placeholders.
        </p>
        <div className="mt-3 divide-y divide-slate-100">
          {templates.map((template) => (
            <div key={template.key} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-slate-800">{template.name}</p>
                <p className="text-xs text-slate-500">{template.subject}</p>
              </div>
              <button
                onClick={() => setEditingTemplateKey(template.key)}
                className="rounded-md border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Maintenance Mode */}
      {maintenance && (
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">Maintenance Mode</h2>
              <p className="text-xs text-slate-500">
                When enabled, all tenants will see a maintenance banner and cannot access the platform.
              </p>
            </div>
            <button
              onClick={handleToggleMaintenance}
              disabled={togglingMaintenance}
              className={`rounded-md px-4 py-2 text-sm font-medium text-white disabled:opacity-60 ${
                maintenance.enabled ? "bg-slate-600 hover:bg-slate-700" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {togglingMaintenance
                ? "Updating..."
                : maintenance.enabled
                ? "Disable Maintenance"
                : "Enable Maintenance"}
            </button>
          </div>
        </div>
      )}

      <EditEmailTemplateModal
        template={editingTemplate}
        onClose={() => setEditingTemplateKey(null)}
        onSave={handleSaveTemplate}
      />
    </section>
  );
}