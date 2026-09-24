"use client";

import { useEffect, useState } from "react";
import { getOrganizationProfile, updateOrganizationProfile, verifyCacNumber } from "@/lib/api/admin";
import { CacVerificationData } from "@/lib/api/types/admin.types";

const industryOptions = [
  "Technology",
  "Finance",
  "Healthcare",
  "Manufacturing",
  "Retail",
  "Education",
  "Restaurant",
  "Other",
];

const companySizeOptions = ["1 - 4", "5 - 10", "11 - 50", "51 - 200", "200+"];

const monthOptions = [
  { label: "January", value: "01-01" },
  { label: "February", value: "02-01" },
  { label: "March", value: "03-01" },
  { label: "April", value: "04-01" },
  { label: "May", value: "05-01" },
  { label: "June", value: "06-01" },
  { label: "July", value: "07-01" },
  { label: "August", value: "08-01" },
  { label: "September", value: "09-01" },
  { label: "October", value: "10-01" },
  { label: "November", value: "11-01" },
  { label: "December", value: "12-01" },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-slate-500">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400";

export default function CompanyProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [cacNumber, setCacNumber] = useState("");
  const [taxId, setTaxId] = useState("");
  const [industry, setIndustry] = useState("Technology");
  const [companySize, setCompanySize] = useState("5 - 10");
  const [address, setAddress] = useState("");
  const [fiscalYearStart, setFiscalYearStart] = useState("01-01");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<CacVerificationData | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const profile = await getOrganizationProfile();
        setName(profile.name);
        setEmail(profile.email);
        setPhone(profile.phone ?? "");
        setWebsite(profile.website ?? "");
        setCacNumber(profile.cacNumber ?? "");
        setTaxId(profile.taxId ?? "");
        setIndustry(profile.industry ?? "Technology");
        setCompanySize(profile.companySize ?? "5 - 10");
        setAddress(profile.address ?? "");
        setFiscalYearStart(profile.fiscalYearStart ?? "01-01");
      } catch (err) {
        setError("Failed to load company profile.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaveMessage(null);
    try {
      await updateOrganizationProfile({
        name,
        phone: phone || undefined,
        website: website || undefined,
        cacNumber: cacNumber || undefined,
        taxId: taxId || undefined,
        industry,
        companySize,
        address: address || undefined,
        fiscalYearStart,
      });
      setSaveMessage("Company profile saved.");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyCac = async () => {
    if (!cacNumber.trim() || verifying) return;
    setVerifying(true);
    setVerifyError(null);
    setVerifyResult(null);
    try {
      const res = await verifyCacNumber({ cacNumber: cacNumber.trim() });
      setVerifyResult(res.data);
    } catch (err: any) {
      setVerifyError(err?.response?.data?.message || "Failed to verify CAC number.");
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl rounded-lg border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-400">Loading company profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="mb-5 text-base font-semibold text-slate-900">Company Information</h2>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</div>
      )}
      {saveMessage && (
        <div className="mb-4 rounded-md bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
          {saveMessage}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Company Name">
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
        </Field>

        <Field label="Company Email">
          <input
            type="email"
            className={`${inputClass} cursor-not-allowed bg-slate-50 text-slate-500`}
            value={email}
            readOnly
            disabled
          />
          <p className="mt-1 text-xs text-slate-400">
            This is the email used to register your account and can&apos;t be changed here.
          </p>
        </Field>

        <Field label="Phone Number">
          <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} />
        </Field>

        <Field label="Website">
          <input className={inputClass} value={website} onChange={(e) => setWebsite(e.target.value)} />
        </Field>

        <Field label="CAC Number">
          <div className="flex gap-2">
            <input
              className={inputClass}
              value={cacNumber}
              onChange={(e) => {
                setCacNumber(e.target.value);
                setVerifyResult(null);
                setVerifyError(null);
              }}
              placeholder="e.g. RC-1234567"
            />
            <button
              type="button"
              onClick={handleVerifyCac}
              disabled={verifying || !cacNumber.trim()}
              className="shrink-0 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {verifying ? "Verifying..." : "Verify CAC"}
            </button>
          </div>

          {verifyError && (
            <p className="mt-1.5 text-xs text-red-600">{verifyError}</p>
          )}

          {verifyResult && (
            <div className="mt-1.5">
              {verifyResult.verificationStatus === "VERIFIED" && (
                <p className="text-xs text-emerald-600">
                  ✓ Verified — matches "{verifyResult.registeredName}"
                </p>
              )}
              {verifyResult.verificationStatus === "MISMATCH" && (
                <p className="text-xs text-amber-600">
                  ⚠ Record found, but company details don't match{verifyResult.registeredName ? ` (registered as "${verifyResult.registeredName}")` : ""}.
                </p>
              )}
              {verifyResult.verificationStatus === "FAILED" && (
                <p className="text-xs text-red-600">
                  ✕ Verification failed.{verifyResult.retryable ? " You can try again." : ""}
                </p>
              )}
              {verifyResult.verificationStatus === "PROVIDER_UNAVAILABLE" && (
                <p className="text-xs text-slate-500">
                  CAC service is currently unavailable. Please try again later.
                </p>
              )}
            </div>
          )}
        </Field>

        <Field label="Tax ID (TIN)">
          <input className={inputClass} value={taxId} onChange={(e) => setTaxId(e.target.value)} />
        </Field>

        <Field label="Industry">
          <select
            className={inputClass}
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          >
            {industryOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Company Size">
          <select
            className={inputClass}
            value={companySize}
            onChange={(e) => setCompanySize(e.target.value)}
          >
            {companySizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </Field>

        <div className="sm:col-span-2">
          <Field label="Registered Address">
            <input
              className={inputClass}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Field>
        </div>

        <Field label="Fiscal Year Start">
          <select
            className={inputClass}
            value={fiscalYearStart}
            onChange={(e) => setFiscalYearStart(e.target.value)}
          >
            {monthOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-6 rounded-md bg-[#2183C6] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1c70ab] disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}