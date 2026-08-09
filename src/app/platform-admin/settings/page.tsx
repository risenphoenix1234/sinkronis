// src/app/platform-admin/settings/page.tsx
"use client";

import { useState } from "react";
import {
  initialPlatformConfig,
  initialComplexityRules,
  initialFeatureFlags,
  initialEmailTemplates,
  PlatformConfig,
  PasswordComplexityRule,
  FeatureFlag,
  EmailTemplate,
} from "@/lib/platform-settings-data";
import EditEmailTemplateModal from "@/components/modals/EditEmailTemplateModal";

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      role="switch"
      aria-checked={on}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
        on ? "bg-sky-600" : "bg-slate-200"
      }`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
          on ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [config, setConfig] = useState<PlatformConfig>(initialPlatformConfig);
  const [minLength, setMinLength] = useState("8 characters");
  const [passwordExpiry, setPasswordExpiry] = useState("90 days");
  const [lockoutAfter, setLockoutAfter] = useState("5 failed attempts");
  const [complexityRules, setComplexityRules] = useState<PasswordComplexityRule[]>(
    initialComplexityRules
  );
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>(initialFeatureFlags);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>(initialEmailTemplates);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);

  const editingTemplate = emailTemplates.find((t) => t.id === editingTemplateId) ?? null;

  const toggleComplexityRule = (id: string) => {
    setComplexityRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const toggleFeatureFlag = (id: string) => {
    setFeatureFlags((prev) => prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f)));
  };

  const handleSaveTemplate = (id: string, subject: string, body: string) => {
    setEmailTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, subject, body, description: subject } : t))
    );
  };

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
              type="text"
              value={config.vatRate}
              onChange={(e) => setConfig({ ...config, vatRate: e.target.value })}
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
          <button className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700">
            Save Changes
          </button>
        </div>
      </div>

      {/* Password Requirements */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-800">Password Requirements</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Minimum Length
            </label>
            <select
              value={minLength}
              onChange={(e) => setMinLength(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            >
              <option>6 characters</option>
              <option>8 characters</option>
              <option>10 characters</option>
              <option>12 characters</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Password Expiry
            </label>
            <select
              value={passwordExpiry}
              onChange={(e) => setPasswordExpiry(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            >
              <option>30 days</option>
              <option>60 days</option>
              <option>90 days</option>
              <option>Never</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Account Lockout After
            </label>
            <select
              value={lockoutAfter}
              onChange={(e) => setLockoutAfter(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            >
              <option>3 failed attempts</option>
              <option>5 failed attempts</option>
              <option>10 failed attempts</option>
            </select>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Complexity Requirements
          </p>
          <div className="mt-2 divide-y divide-slate-100">
            {complexityRules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between py-2.5">
                <span className="text-sm text-slate-700">{rule.label}</span>
                <Toggle on={rule.enabled} onClick={() => toggleComplexityRule(rule.id)} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <button className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700">
            Save Policy
          </button>
        </div>
      </div>

      {/* Feature Flags */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-800">Feature Flags</h2>
        <p className="text-xs text-slate-500">Toggle experimental features globally across all tenants.</p>
        <div className="mt-3 divide-y divide-slate-100">
          {featureFlags.map((flag) => (
            <div key={flag.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-slate-800">{flag.name}</p>
                <p className="text-xs text-slate-500">{flag.description}</p>
              </div>
              <Toggle on={flag.enabled} onClick={() => toggleFeatureFlag(flag.id)} />
            </div>
          ))}
        </div>
      </div>

      {/* Email Templates */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-800">Email Templates</h2>
        <p className="text-xs text-slate-500">
          Customize notification emails sent to tenants. Use {"{{variable}}"} placeholders.
        </p>
        <div className="mt-3 divide-y divide-slate-100">
          {emailTemplates.map((template) => (
            <div key={template.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-slate-800">{template.name}</p>
                <p className="text-xs text-slate-500">{template.description}</p>
              </div>
              <button
                onClick={() => setEditingTemplateId(template.id)}
                className="rounded-md border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      <EditEmailTemplateModal
        template={editingTemplate}
        onClose={() => setEditingTemplateId(null)}
        onSave={handleSaveTemplate}
      />
    </section>
  );
}