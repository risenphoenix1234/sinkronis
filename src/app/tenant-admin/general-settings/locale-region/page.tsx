// app/tenant-admin/general-settings/locale-region/page.tsx
"use client";

import { useMemo, useState } from "react";

const timezones = [
  "Africa/Lagos (WAT, UTC+1)",
  "Africa/Accra (GMT, UTC+0)",
  "Europe/London (GMT, UTC+0)",
  "America/New_York (EST, UTC-5)",
];

const dateFormats = ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"];

const languages = ["English (Nigeria)", "English (UK)", "English (US)", "French"];

const currencies = [
  { code: "NGN", label: "NGN — Nigerian Naira (₦)", symbol: "₦" },
  { code: "USD", label: "USD — US Dollar ($)", symbol: "$" },
  { code: "GBP", label: "GBP — British Pound (£)", symbol: "£" },
  { code: "EUR", label: "EUR — Euro (€)", symbol: "€" },
];

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
  const [timezone, setTimezone] = useState(timezones[0]);
  const [dateFormat, setDateFormat] = useState(dateFormats[0]);
  const [language, setLanguage] = useState(languages[0]);
  const [currency, setCurrency] = useState(currencies[0].code);

  const selectedCurrency = currencies.find((c) => c.code === currency) ?? currencies[0];
  const previewDate = useMemo(() => formatPreviewDate(dateFormat), [dateFormat]);
  const previewTimezone = timezone.split(" ")[0];

  const handleSave = () => {
    // Hook up to API call to persist locale settings here.
    console.log("Saving locale settings:", { timezone, dateFormat, language, currency });
  };

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Locale & Region</h1>
        <p className="mt-1 text-sm text-slate-500">
          Set platform-wide defaults for timezone, date format, language, and currency
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs text-slate-500">Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-400"
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-500">Date Format</label>
            <select
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-400"
            >
              {dateFormats.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-500">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-400"
            >
              {languages.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-500">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-400"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
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
              {selectedCurrency.symbol}1,500,000.00
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Preview Timezone</p>
            <p className="mt-0.5 text-sm font-medium text-slate-800">{previewTimezone}</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="rounded-md bg-sky-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-700"
      >
        Save Settings
      </button>
    </div>
  );
}