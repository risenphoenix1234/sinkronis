// src/app/tenant-admin/general-settings/branding/page.tsx
"use client";

import { useEffect, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { getBrandingSettings, updateBrandingSettings, uploadBrandingLogo } from "@/lib/api/admin";
import { GeneralBrandingSettings } from "@/lib/api/types/admin.types";
import { refreshBranding } from "@/hooks/useBranding";

const presetColors = [
  "#2183c6",
  "#7C3AED",
  "#16A34A",
  "#A16207",
  "#DC2626",
  "#0D9488",
  "#EA580C",
  "#1E293B",
];

export default function BrandingPage() {
  const [branding, setBranding] = useState<GeneralBrandingSettings | null>(null);
  const [hexInput, setHexInput] = useState("");
  const [linkText, setLinkText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await getBrandingSettings();
      setBranding(res.data);
      setHexInput(res.data.accentColor);
      setLinkText(res.data.linkText ?? "");
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to load branding");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const handleColorPick = (color: string) => setHexInput(color);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSavedMessage(null);
    try {
      const payload: { accentColor?: string; linkText?: string } = {};
      if (hexInput && hexInput !== branding?.accentColor) payload.accentColor = hexInput;
      if (linkText !== (branding?.linkText ?? "")) payload.linkText = linkText;

      if (Object.keys(payload).length === 0) {
        setSavedMessage("Nothing changed");
        return;
      }

      const res = await updateBrandingSettings(payload);
      setBranding(res.data);
      setSavedMessage("Branding saved");
      refreshBranding();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to save branding");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogoUpload(file: File) {
    setUploading(true);
    setError(null);
    setSavedMessage(null);
    try {
      await uploadBrandingLogo(file);
      await load(); // response schema for upload is undocumented — refetch instead of trusting it
      setSavedMessage("Logo updated");
      refreshBranding();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to upload logo");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Branding</h1>
        <p className="mt-1 text-sm text-slate-500">
          Customize the platform logo and primary accent colour
        </p>
      </div>

      {error && (
        <p className="rounded-md bg-rose-50 px-3 py-2 text-xs text-rose-600">{error}</p>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : (
        <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6">
          {/* Logo upload */}
          <div>
            <label className="mb-2 block text-xs text-slate-500">Organisation Logo</label>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-lg font-semibold text-slate-400 overflow-hidden">
                {branding?.logoUrl ? (
                  <img src={branding.logoUrl} alt="Logo" style={{ width: "auto", height: "auto", maxWidth: "100%", maxHeight: "100%" }} />
                ) : (
                  "S"
                )}
              </div>
              <label className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                <FiUpload size={14} />
                {uploading ? "Uploading…" : branding?.fileName ?? "Upload Logo"}
                <input
                  type="file"
                  accept="image/png,image/svg+xml"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleLogoUpload(file);
                  }}
                />
              </label>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              PNG or SVG only, min 200×200px recommended, max 2MB.
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
                      hexInput === color ? "border-slate-900" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={color}
                  />
                ))}
              </div>
              <input
                type="text"
                value={hexInput}
                onChange={(e) => setHexInput(e.target.value)}
                className="w-28 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-400"
                placeholder="#2563EB"
              />
            </div>
          </div>

          {/* Link text */}
          <div>
            <label className="mb-2 block text-xs text-slate-500">Link Text</label>
            <input
              type="text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-400"
              placeholder="e.g. Learn more"
            />
          </div>

          {/* Preview */}
          <div>
            <label className="mb-2 block text-xs text-slate-500">Preview</label>
            <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-5 py-4">
              <button
                className="rounded-md px-4 py-2 text-sm font-medium text-white"
                style={{ backgroundColor: hexInput }}
              >
                Primary Button
              </button>
              <span
                className="rounded-full px-2.5 py-1 text-xs font-medium"
                style={{ backgroundColor: `${hexInput}1A`, color: hexInput }}
              >
                Badge
              </span>
              <span className="text-sm font-medium underline" style={{ color: hexInput }}>
                {linkText || "Link text"}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="rounded-md bg-sky-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Branding"}
        </button>
        {savedMessage && <span className="text-xs text-emerald-600">{savedMessage}</span>}
      </div>
    </div>
  );
}