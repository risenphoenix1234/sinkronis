// src/app/hris/settings/page.tsx

"use client";

import { useState } from "react";
import { Building2, FileText, SlidersHorizontal, Save } from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type TabKey = "company" | "statutory" | "payroll";

type CompanyProfile = {
  companyName: string;
  rcNumber: string;
  industry: string;
  companySize: string;
  registeredAddress: string;
};

type StatutoryIds = {
  tin: string;
  payeRef: string;
  pensionPin: string;
  nhfCode: string;
  nsitfNumber: string;
  itfNumber: string;
};

type PayrollConfig = {
  paySchedule: "Monthly" | "Bi-weekly" | "Weekly";
  payDay: string;
  currency: string;
  basicPercent: string;
  housingPercent: string;
  transportPercent: string;
  overtimeRate: string;
  probationMonths: string;
};

/* =========================================================
   DEFAULT STATE
========================================================= */

const defaultCompany: CompanyProfile = {
  companyName: "Sinkronis Technologies Ltd",
  rcNumber: "",
  industry: "",
  companySize: "",
  registeredAddress: "",
};

const defaultStatutory: StatutoryIds = {
  tin: "",
  payeRef: "",
  pensionPin: "",
  nhfCode: "",
  nsitfNumber: "",
  itfNumber: "",
};

const defaultPayroll: PayrollConfig = {
  paySchedule: "Monthly",
  payDay: "25",
  currency: "NGN",
  basicPercent: "60",
  housingPercent: "20",
  transportPercent: "20",
  overtimeRate: "1.5",
  probationMonths: "3",
};

/* =========================================================
   TAB CONFIG
========================================================= */

const tabs: { key: TabKey; label: string; icon: typeof Building2 }[] = [
  { key: "company", label: "Company Profile", icon: Building2 },
  { key: "statutory", label: "Statutory IDs", icon: FileText },
  { key: "payroll", label: "Payroll Configuration", icon: SlidersHorizontal },
];

/* =========================================================
   PAGE
========================================================= */

export default function HrisSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("company");

  const [company, setCompany] = useState<CompanyProfile>(defaultCompany);
  const [statutory, setStatutory] = useState<StatutoryIds>(defaultStatutory);
  const [payroll, setPayroll] = useState<PayrollConfig>(defaultPayroll);

  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const markDirty = () => setIsDirty(true);

  const handleSave = async () => {
    setIsSaving(true);

    // Replace with your real persistence call, e.g.:
    // await fetch("/api/hris/settings", { method: "PUT", body: JSON.stringify({ company, statutory, payroll }) });
    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsSaving(false);
    setIsDirty(false);
    setSavedAt(
      new Date().toLocaleTimeString("en-NG", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    );
  };

  const splitTotal =
    Number(payroll.basicPercent || 0) +
    Number(payroll.housingPercent || 0) +
    Number(payroll.transportPercent || 0);

  return (
    <main
      className="
        min-h-screen
        bg-[#f8fafc]
        px-6
        py-7
        text-[#263447]
        lg:px-8
        lg:py-8
      "
    >
      {/* ===================================================
          HEADER
      ================================================== */}

      <header className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="
              text-[34px]
              font-bold
              leading-tight
              tracking-[-0.8px]
              text-[#263447]
            "
          >
            Settings
          </h1>

          <p className="mt-2 text-[14px] leading-5 text-[#718096]">
            Company details, statutory IDs, and payroll configuration.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {savedAt && !isDirty && (
            <span className="text-[12.5px] text-[#8994a3]">
              Saved at {savedAt}
            </span>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className="
              flex
              h-11
              items-center
              gap-2
              rounded-md
              bg-[#1683d8]
              px-5
              text-[14px]
              font-semibold
              text-white
              transition
              hover:bg-[#1274c2]
              disabled:cursor-not-allowed
              disabled:bg-[#a9c9e0]
            "
          >
            <Save size={16} strokeWidth={2} />
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </header>

      {/* ===================================================
          TABS
      ================================================== */}

      <div
        className="
          mt-6
          flex
          w-fit
          items-center
          gap-1
          rounded-lg
          border
          border-[#dce2e8]
          bg-white
          p-1
        "
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.key === activeTab;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`
                flex
                items-center
                gap-2
                rounded-md
                px-4
                py-2
                text-[13.5px]
                font-semibold
                transition
                ${
                  isActive
                    ? "bg-[#1683d8] text-white"
                    : "text-[#617287] hover:bg-[#f1f5f9]"
                }
              `}
            >
              <Icon size={15} strokeWidth={2} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ===================================================
          TAB PANELS
      ================================================== */}

      <section
        className="
          mt-5
          overflow-hidden
          rounded-lg
          border
          border-[#dce2e8]
          bg-white
        "
      >
        {activeTab === "company" && (
          <SectionPanel
            title="Company Profile"
            description="Basic details used across payslips, contracts, and reports."
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field
                label="Company Name"
                value={company.companyName}
                onChange={(v) => {
                  setCompany((c) => ({ ...c, companyName: v }));
                  markDirty();
                }}
              />

              <Field
                label="RC Number"
                placeholder="e.g. RC1234567"
                value={company.rcNumber}
                onChange={(v) => {
                  setCompany((c) => ({ ...c, rcNumber: v }));
                  markDirty();
                }}
              />

              <Field
                label="Industry"
                placeholder="e.g. Technology"
                value={company.industry}
                onChange={(v) => {
                  setCompany((c) => ({ ...c, industry: v }));
                  markDirty();
                }}
              />

              <Field
                label="Company Size"
                placeholder="e.g. 1–10 employees"
                value={company.companySize}
                onChange={(v) => {
                  setCompany((c) => ({ ...c, companySize: v }));
                  markDirty();
                }}
              />

              <Field
                label="Registered Address"
                placeholder="Street, City, State"
                value={company.registeredAddress}
                onChange={(v) => {
                  setCompany((c) => ({ ...c, registeredAddress: v }));
                  markDirty();
                }}
                className="sm:col-span-2"
              />
            </div>
          </SectionPanel>
        )}

        {activeTab === "statutory" && (
          <SectionPanel
            title="Statutory IDs"
            description="Registration numbers used when filing PAYE, pension, and other statutory remittances."
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field
                label="Tax Identification Number (TIN)"
                placeholder="e.g. 12345678-0001"
                value={statutory.tin}
                onChange={(v) => {
                  setStatutory((s) => ({ ...s, tin: v }));
                  markDirty();
                }}
              />

              <Field
                label="PAYE Reference Number"
                value={statutory.payeRef}
                onChange={(v) => {
                  setStatutory((s) => ({ ...s, payeRef: v }));
                  markDirty();
                }}
              />

              <Field
                label="Pension PIN (PenCom Code)"
                value={statutory.pensionPin}
                onChange={(v) => {
                  setStatutory((s) => ({ ...s, pensionPin: v }));
                  markDirty();
                }}
              />

              <Field
                label="NHF Employer Code"
                value={statutory.nhfCode}
                onChange={(v) => {
                  setStatutory((s) => ({ ...s, nhfCode: v }));
                  markDirty();
                }}
              />

              <Field
                label="NSITF Number"
                value={statutory.nsitfNumber}
                onChange={(v) => {
                  setStatutory((s) => ({ ...s, nsitfNumber: v }));
                  markDirty();
                }}
              />

              <Field
                label="ITF Number"
                value={statutory.itfNumber}
                onChange={(v) => {
                  setStatutory((s) => ({ ...s, itfNumber: v }));
                  markDirty();
                }}
              />
            </div>
          </SectionPanel>
        )}

        {activeTab === "payroll" && (
          <SectionPanel
            title="Payroll Configuration"
            description="Pay schedule, salary structure split, and overtime rules."
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <SelectField
                label="Pay Schedule"
                value={payroll.paySchedule}
                options={["Monthly", "Bi-weekly", "Weekly"]}
                onChange={(v) => {
                  setPayroll((p) => ({
                    ...p,
                    paySchedule: v as PayrollConfig["paySchedule"],
                  }));
                  markDirty();
                }}
              />

              <Field
                label="Pay Day"
                placeholder="Day of month, e.g. 25"
                value={payroll.payDay}
                onChange={(v) => {
                  setPayroll((p) => ({ ...p, payDay: v }));
                  markDirty();
                }}
              />

              <Field
                label="Currency"
                value={payroll.currency}
                onChange={(v) => {
                  setPayroll((p) => ({ ...p, currency: v }));
                  markDirty();
                }}
              />

              <Field
                label="Overtime Rate (× hourly)"
                value={payroll.overtimeRate}
                onChange={(v) => {
                  setPayroll((p) => ({ ...p, overtimeRate: v }));
                  markDirty();
                }}
              />

              <Field
                label="Probation Period (months)"
                value={payroll.probationMonths}
                onChange={(v) => {
                  setPayroll((p) => ({ ...p, probationMonths: v }));
                  markDirty();
                }}
              />
            </div>

            {/* Salary structure split */}
            <div className="mt-7 border-t border-[#e5e9ed] pt-6">
              <p className="text-[13.5px] font-semibold text-[#263447]">
                Default Salary Structure Split
              </p>
              <p className="mt-1 text-[12.5px] text-[#8994a3]">
                Percentages should add up to 100%.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <Field
                  label="Basic (%)"
                  value={payroll.basicPercent}
                  onChange={(v) => {
                    setPayroll((p) => ({ ...p, basicPercent: v }));
                    markDirty();
                  }}
                />

                <Field
                  label="Housing (%)"
                  value={payroll.housingPercent}
                  onChange={(v) => {
                    setPayroll((p) => ({ ...p, housingPercent: v }));
                    markDirty();
                  }}
                />

                <Field
                  label="Transport (%)"
                  value={payroll.transportPercent}
                  onChange={(v) => {
                    setPayroll((p) => ({ ...p, transportPercent: v }));
                    markDirty();
                  }}
                />
              </div>

              <p
                className={`mt-3 text-[12.5px] font-medium ${
                  splitTotal === 100 ? "text-[#16823b]" : "text-[#e8384f]"
                }`}
              >
                Total: {splitTotal}% {splitTotal !== 100 && "— must equal 100%"}
              </p>
            </div>
          </SectionPanel>
        )}
      </section>
    </main>
  );
}

/* =========================================================
   SECTION PANEL
========================================================= */

type SectionPanelProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

function SectionPanel({ title, description, children }: SectionPanelProps) {
  return (
    <div>
      <header className="border-b border-[#e5e9ed] px-6 py-4">
        <h2 className="text-[15px] font-bold text-[#263447]">{title}</h2>
        <p className="mt-0.5 text-[12.5px] text-[#8994a3]">{description}</p>
      </header>

      <div className="px-6 py-6">{children}</div>
    </div>
  );
}

/* =========================================================
   FIELD
========================================================= */

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

function Field({
  label,
  value,
  onChange,
  placeholder,
  className = "",
}: FieldProps) {
  return (
    <label className={`block ${className}`}>
      <span className="text-[12.5px] font-medium text-[#617287]">{label}</span>

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="
          mt-1.5
          h-10
          w-full
          rounded-md
          border
          border-[#dce2e8]
          bg-white
          px-3
          text-[13.5px]
          text-[#263447]
          outline-none
          transition
          placeholder:text-[#a9b4c0]
          focus:border-[#1683d8]
          focus:ring-2
          focus:ring-[#1683d8]/15
        "
      />
    </label>
  );
}

/* =========================================================
   SELECT FIELD
========================================================= */

type SelectFieldProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  return (
    <label className="block">
      <span className="text-[12.5px] font-medium text-[#617287]">{label}</span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          mt-1.5
          h-10
          w-full
          rounded-md
          border
          border-[#dce2e8]
          bg-white
          px-3
          text-[13.5px]
          text-[#263447]
          outline-none
          transition
          focus:border-[#1683d8]
          focus:ring-2
          focus:ring-[#1683d8]/15
        "
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
