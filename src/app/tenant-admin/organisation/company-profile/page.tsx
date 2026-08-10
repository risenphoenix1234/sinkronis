// src/app/tenant-admin/organisation/company-profile/page.tsx
"use client";

import { useState } from "react";

type CompanyInfo = {
  companyName: string;
  companyEmail: string;
  phoneNumber: string;
  website: string;
  cacNumber: string;
  taxId: string;
  industry: string;
  companySize: string;
  registeredAddress: string;
  fiscalYearStart: string;
};

const initialInfo: CompanyInfo = {
  companyName: "Sinkronis Technologies Ltd",
  companyEmail: "admin@sinkronis.com",
  phoneNumber: "+234 1 234 5678",
  website: "www.sinkronis.com",
  cacNumber: "RC-1234567",
  taxId: "TIN-987654321",
  industry: "Technology",
  companySize: "5 - 10",
  registeredAddress: "14 Adeola Odeku Street, Victoria Island, Lagos",
  fiscalYearStart: "January",
};

const industryOptions = [
  "Technology",
  "Finance",
  "Healthcare",
  "Manufacturing",
  "Retail",
  "Education",
  "Other",
];

const companySizeOptions = ["1 - 4", "5 - 10", "11 - 50", "51 - 200", "200+"];

const monthOptions = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
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
  const [info, setInfo] = useState<CompanyInfo>(initialInfo);
  const [saving, setSaving] = useState(false);

  // companyEmail intentionally excluded — it's the account's registration
  // email and shouldn't be editable from this form.
  const update = (key: Exclude<keyof CompanyInfo, "companyEmail">, value: string) => {
    setInfo((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setSaving(true);
    // Placeholder for real persistence
    setTimeout(() => setSaving(false), 600);
  };

  return (
    <div className="max-w-3xl rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="mb-5 text-base font-semibold text-slate-900">
        Company Information
      </h2>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Company Name">
          <input
            className={inputClass}
            value={info.companyName}
            onChange={(e) => update("companyName", e.target.value)}
          />
        </Field>

        <Field label="Company Email">
          <input
            type="email"
            className={`${inputClass} cursor-not-allowed bg-slate-50 text-slate-500`}
            value={info.companyEmail}
            readOnly
            disabled
          />
          <p className="mt-1 text-xs text-slate-400">
            This is the email used to register your account and can&apos;t be changed here.
          </p>
        </Field>

        <Field label="Phone Number">
          <input
            className={inputClass}
            value={info.phoneNumber}
            onChange={(e) => update("phoneNumber", e.target.value)}
          />
        </Field>

        <Field label="Website">
          <input
            className={inputClass}
            value={info.website}
            onChange={(e) => update("website", e.target.value)}
          />
        </Field>

        <Field label="CAC Number">
          <input
            className={inputClass}
            value={info.cacNumber}
            onChange={(e) => update("cacNumber", e.target.value)}
          />
        </Field>

        <Field label="Tax ID (TIN)">
          <input
            className={inputClass}
            value={info.taxId}
            onChange={(e) => update("taxId", e.target.value)}
          />
        </Field>

        <Field label="Industry">
          <select
            className={inputClass}
            value={info.industry}
            onChange={(e) => update("industry", e.target.value)}
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
            value={info.companySize}
            onChange={(e) => update("companySize", e.target.value)}
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
              value={info.registeredAddress}
              onChange={(e) => update("registeredAddress", e.target.value)}
            />
          </Field>
        </div>

        <Field label="Fiscal Year Start">
          <select
            className={inputClass}
            value={info.fiscalYearStart}
            onChange={(e) => update("fiscalYearStart", e.target.value)}
          >
            {monthOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
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