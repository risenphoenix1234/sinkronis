// app/tenant-admin/general-settings/locale-region/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { getLocaleSettings, saveLocaleSettings, getLocaleOptions } from "@/lib/api/admin";
import { GeneralLocaleSettings, GeneralLocaleOptions } from "@/lib/api/types/admin.types";
import Loader from "@/components/ui/Loader";

function formatPreviewDate(format: string) {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  if (format === "MM/DD/YYYY") return `${mm}/${dd}/${yyyy}`;
  if (format === "YYYY-MM-DD") return `${yyyy}-${mm}-${dd}`;
  return `${dd}/${mm}/${yyyy}`;
}

export default function LocaleRegionPage() {
  const [settings, setSettings] = useState<GeneralLocaleSettings | null>(null);
  const [options, setOptions] = useState<GeneralLocaleOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [localeRes, optionsRes] = await Promise.all([
          getLocaleSettings(),
          getLocaleOptions(),
        ]);
        setSettings(localeRes.data);
        setOptions(optionsRes.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || err?.message || "Failed to load settings");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function updateField(field: keyof GeneralLocaleSettings, value: string) {
    setSettings((prev) => (prev ? { ...prev, [field]: value } : prev));
    setSavedMessage(null);
  }

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    setError(null);
    setSavedMessage(null);
    try {
      const res = await saveLocaleSettings(settings);
      setSettings(res.data);
      setSavedMessage("Settings saved");
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  const selectedCurrency = useMemo(
    () => options?.currencies.find((c) => c.code === settings?.currency) ?? null,
    [options, settings]
  );
  const previewDate = useMemo(
    () => (settings ? formatPreviewDate(settings.dateFormat) : ""),
    [settings]
  );

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Locale & Region</h1>
        <p className="mt-1 text-sm text-slate-500">
          Set platform-wide defaults for timezone, date format, language, and currency
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        {loading && <Loader variant="section" label="Loading" />}
        {error && (
          <p className="mb-3 rounded-md bg-rose-50 px-3 py-2 text-xs text-rose-600">{error}</p>
        )}

        {!loading && settings && options && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs text-slate-500">Timezone</label>
                <select
                  value={settings.timeZone}
                  onChange={(e) => updateField("timeZone", e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-400"
                >
                  {options.timeZones.map((tz) => (
                    <option key={tz.identifier} value={tz.identifier}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs text-slate-500">Date Format</label>
                <select
                  value={settings.dateFormat}
                  onChange={(e) => updateField("dateFormat", e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-400"
                >
                  {options.dateFormats.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs text-slate-500">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => updateField("language", e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-400"
                >
                  {options.languages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs text-slate-500">Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => updateField("currency", e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-400"
                >
                  {options.currencies.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Preview */}
            <div className="mt-5 grid grid-cols-3 gap-4 rounded-lg bg-slate-50 px-5 py-4">
              <div>
                <p className="text-xs text-slate-400">Preview Date</p>
                <p className="mt-0.5 text-sm font-medium text-slate-800">{previewDate}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Preview Currency</p>
                <p className="mt-0.5 text-sm font-medium text-slate-800">
                  {selectedCurrency?.code ?? settings.currency} 1,500,000.00
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Preview Timezone</p>
                <p className="mt-0.5 text-sm font-medium text-slate-800">{settings.timeZone}</p>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="rounded-md bg-sky-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Settings"}
        </button>
        {savedMessage && <span className="text-xs text-emerald-600">{savedMessage}</span>}
      </div>
    </div>
  );
}