// app/tenant-admin/general-settings/branding/page.tsx
"use client";

import { useState } from "react";
import { FiUpload } from "react-icons/fi";

const presetColors = [
  "#2563EB", // blue
  "#7C3AED", // violet
  "#16A34A", // green
  "#A16207", // gold/brown
  "#DC2626", // red
  "#0D9488", // teal
  "#EA580C", // orange
  "#1E293B", // slate/dark
];

export default function BrandingPage() {
  const [logoName, setLogoName] = useState<string | null>(null);
  const [accentColor, setAccentColor] = useState(presetColors[0]);
  const [hexInput, setHexInput] = useState(presetColors[0]);

  const handleColorPick = (color: string) => {
    setAccentColor(color);
    setHexInput(color);
  };

  const handleHexChange = (value: string) => {
    setHexInput(value);
    if (/^#([0-9A-Fa-f]{6})$/.test(value)) {
      setAccentColor(value);
    }
  };

  const handleSave = () => {
    // Hook up to API call to persist branding here.
    console.log("Saving branding:", { logoName, accentColor });
  };

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Branding</h1>
        <p className="mt-1 text-sm text-slate-500">
          Customize the platform logo and primary accent colour
        </p>
      </div>

      <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6">
        {/* Logo upload */}
        <div>
          <label className="mb-2 block text-xs text-slate-500">Organisation Logo</label>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-lg font-semibold text-slate-400">
              {logoName ? "✓" : "S"}
            </div>
            <label className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
              <FiUpload size={14} />
              {logoName ?? "Upload Logo"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setLogoName(e.target.files?.[0]?.name ?? null)}
              />
            </label>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Recommended PNG or SVG, min 200×200px, max 2MB.
          </p>
        </div>

        {/* Accent color */}
        <div>
          <label className="mb-2 block text-xs text-slate-500">Accent Colour</label>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {presetColors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorPick(color)}
                  className={`h-7 w-7 rounded-full border-2 ${
                    accentColor === color ? "border-slate-900" : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={color}
                />
              ))}
            </div>
            <input
              type="text"
              value={hexInput}
              onChange={(e) => handleHexChange(e.target.value)}
              className="w-28 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-400"
              placeholder="#2563EB"
            />
          </div>
        </div>

        {/* Preview */}
        <div>
          <label className="mb-2 block text-xs text-slate-500">Preview</label>
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-5 py-4">
            <button
              className="rounded-md px-4 py-2 text-sm font-medium text-white"
              style={{ backgroundColor: accentColor }}
            >
              Primary Button
            </button>
            <span
              className="rounded-full px-2.5 py-1 text-xs font-medium"
              style={{ backgroundColor: `${accentColor}1A`, color: accentColor }}
            >
              Badge
            </span>
            <span className="text-sm font-medium underline" style={{ color: accentColor }}>
              Link text
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="rounded-md bg-sky-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-700"
      >
        Save Branding
      </button>
    </div>
  );
}