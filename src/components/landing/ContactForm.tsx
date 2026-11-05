// src/components/landing/ContactForm.tsx
"use client";

import { FormEvent, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, Check } from "lucide-react";
import {
  MODULES,
  ModuleKey,
  formatMoney,
  modulesForPlanId,
  monthlyPrice,
  planDisplayName,
  planIdForModules,
  usePublicPlans,
} from "@/lib/plans";
import {
  CompanyRegistrationType,
  PublicPlanId,
  submitTenantAccessRequest,
} from "@/lib/api/public";

const CONTACT_EMAIL = "info@peopleadvisor.org";

const COUNTRIES = [
  { code: "NG", label: "Nigeria" },
  { code: "GH", label: "Ghana" },
  { code: "KE", label: "Kenya" },
  { code: "ZA", label: "South Africa" },
  { code: "GB", label: "United Kingdom" },
  { code: "US", label: "United States" },
];

const inputClass =
  "h-12 w-full rounded-lg border border-[#E5E9F0] bg-white px-4 text-[15px] text-[#1F2937] outline-none placeholder:text-[#98A2B3] focus:border-[#2388D0]";

const labelClass = "mb-2 block text-[13px] font-medium text-[#344054]";

function newIdempotencyKey(company: string) {
  const slug = company
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);
  const uid =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `access-request-${slug || "company"}-${uid}`;
}

function normaliseRegistrationNumber(raw: string) {
  return raw.replace(/\s+/g, "").toUpperCase();
}

export default function ContactForm() {
  const searchParams = useSearchParams();
  const { plans, loading: plansLoading, error: plansError } = usePublicPlans();
  const [modules, setModules] = useState<ModuleKey[]>(() => modulesForPlanId(searchParams.get("plan")));

  const toggleModule = (key: ModuleKey) => {
    setModules((prev) => (prev.includes(key) ? prev.filter((m) => m !== key) : [...prev, key]));
  };

  const [company, setCompany] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("NG");
  const [industry, setIndustry] = useState("");
  const [regType, setRegType] = useState<CompanyRegistrationType>("RC");
  const [regNumber, setRegNumber] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  // One key per submission; reused only when retrying the exact same request.
  const keyRef = useRef<{ fingerprint: string; key: string } | null>(null);

  const planId = planIdForModules(modules);
  const selectedPlan = plans.find((p) => p.id === planId) ?? null;
  const selectedPrice = monthlyPrice(selectedPlan ?? undefined);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setUnavailable(false);

    if (!company.trim() || !firstName.trim() || !lastName.trim() || !email.trim()) {
      setError("Please fill in your company name, first name, last name and work email.");
      return;
    }
    if (!planId) {
      setError("Select at least one module you would like to subscribe to.");
      return;
    }
    if (!selectedPlan || !selectedPrice) {
      setError(
        plansLoading
          ? "Plans are still loading. Please try again in a moment."
          : "That plan is currently unavailable. Please choose a different combination.",
      );
      return;
    }

    const number = normaliseRegistrationNumber(regNumber);
    if (number && !new RegExp(`^(?:${regType})?\\d{1,10}$`).test(number)) {
      setError(
        `Enter a valid ${regType} registration number (1–10 digits, optionally starting with ${regType}).`,
      );
      return;
    }

    const payload = {
      companyName: company.trim(),
      applicantFirstName: firstName.trim(),
      applicantLastName: lastName.trim(),
      applicantEmail: email.trim(),
      applicantPhone: phone.trim() || undefined,
      country,
      industry: industry.trim() || undefined,
      message: message.trim() || undefined,
      planId: planId as PublicPlanId,
      billingCycle: "MONTHLY" as const,
      // CAC type and number are sent together, or both omitted.
      ...(number ? { registrationType: regType, registrationNumber: number } : {}),
    };

    const fingerprint = JSON.stringify(payload);
    if (!keyRef.current || keyRef.current.fingerprint !== fingerprint) {
      keyRef.current = { fingerprint, key: newIdempotencyKey(company) };
    }

    setSubmitting(true);
    try {
      const res = await submitTenantAccessRequest({
        ...payload,
        idempotencyKey: keyRef.current.key,
      });
      keyRef.current = null;
      setReference(res.data.requestReference);
    } catch (err: any) {
      const status = err?.response?.status;
      const body = err?.response?.data;
      const code: string | undefined = body?.errorCode ?? body?.code ?? body?.error?.code;

      if (status === 503 || code === "PUBLIC_ONBOARDING_DISABLED") {
        setUnavailable(true);
      } else if (!err?.response) {
        // Network/timeout: keep the same key so a retry is safe.
        setError("We couldn't reach the server. Check your connection and try again.");
      } else {
        // The backend answered, so a changed request gets a fresh key.
        if (status !== 409) keyRef.current = null;
        setError(body?.message || "Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-[#F5FAFE] px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-[1440px] lg:px-[80px]">
        <div className="mx-auto max-w-[720px] text-center">
          <h2 className="text-[32px] font-bold leading-[40px] text-[#1F2937] sm:text-[44px] sm:leading-[52px]">
            Request access
          </h2>
          <p className="mt-5 text-[16px] leading-[26px] text-[#667085] sm:text-[18px] sm:leading-[28px]">
            Tell us about your company and the plan you want. Our team will review your request,
            set up your organisation and send your admin invitation.
          </p>
        </div>

        {reference ? (
          <div className="mx-auto mt-12 max-w-[760px] rounded-2xl border border-[#E5E9F0] bg-white p-8 text-center sm:p-12">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#D8F3DC] text-[#1B7A34]">
              <Check className="h-7 w-7" strokeWidth={3} />
            </span>
            <h3 className="mt-6 text-[24px] font-bold text-[#1F2937]">Registration submitted</h3>
            <p className="mt-3 text-[16px] leading-[26px] text-[#667085]">
              Your request is now under review. We will email {email.trim()} once it has been
              processed.
            </p>
            <p className="mt-4 text-[13px] text-[#98A2B3]">
              Reference: <span className="font-mono text-[#667085]">{reference}</span>
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-12 max-w-[760px] rounded-2xl border border-[#E5E9F0] bg-white p-6 sm:p-10"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>Company name</label>
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Acme Nigeria Limited"
                  className={inputClass}
                />
                <div className="mt-2 flex items-center gap-2 rounded-md border border-[#FFE4A8] bg-[#FFF8E1] px-3 py-2 text-[13px] font-medium text-[#856404]">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  Company name must match your CAC registered name.
                </div>
              </div>
              <div>
                <label className={labelClass}>First name</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Amina"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Last name</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Bello"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Work email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>
                  Phone <span className="font-normal text-[#98A2B3]">(optional)</span>
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+2348012345678"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className={inputClass}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>
                  Industry <span className="font-normal text-[#98A2B3]">(optional)</span>
                </label>
                <input
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="Technology"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-5">
              <label className={labelClass}>
                CAC registration <span className="font-normal text-[#98A2B3]">(optional)</span>
              </label>
              <div className="grid grid-cols-[110px_1fr] gap-3">
                <select
                  value={regType}
                  onChange={(e) => setRegType(e.target.value as CompanyRegistrationType)}
                  className={inputClass}
                >
                  <option value="RC">RC</option>
                  <option value="BN">BN</option>
                  <option value="LP">LP</option>
                  <option value="LLP">LLP</option>
                </select>
                <input
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  placeholder="Registration number, e.g. 1234567"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-6">
              <label className={labelClass}>Selected plan</label>
              <input
                readOnly
                value={
                  planId
                    ? `${planDisplayName(planId, plans)}${
                        selectedPrice ? ` · ${formatMoney(selectedPrice.price, selectedPrice.currency)}/month` : ""
                      }`
                    : ""
                }
                placeholder="Choose the modules you need below"
                className={`${inputClass} mb-3 bg-[#F9FAFB] font-semibold text-[#2388D0]`}
              />
              {plansError && (
                <p className="mb-3 text-[13px] text-[#D92D20]">
                  We couldn&apos;t load current prices. Please refresh the page.
                </p>
              )}
              <div className="flex flex-wrap gap-3">
                {MODULES.map((mod) => {
                  const active = modules.includes(mod.key);
                  return (
                    <button
                      key={mod.key}
                      type="button"
                      onClick={() => toggleModule(mod.key)}
                      aria-pressed={active}
                      className={`flex items-center gap-2 rounded-full border-2 px-4 py-2 text-[14px] font-semibold transition ${
                        active
                          ? "border-[#2388D0] bg-[#2388D0] text-white"
                          : "border-[#2388D0] text-[#2388D0] hover:bg-[#F5FAFE]"
                      }`}
                    >
                      {active && <Check className="h-4 w-4" strokeWidth={3} />}
                      {mod.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6">
              <label className={labelClass}>
                Message <span className="font-normal text-[#98A2B3]">(optional)</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Anything we should know? Number of employees, go-live date, etc."
                className="w-full rounded-lg border border-[#E5E9F0] bg-white px-4 py-3 text-[15px] text-[#1F2937] outline-none placeholder:text-[#98A2B3] focus:border-[#2388D0]"
              />
            </div>

            {error && <p className="mt-4 text-[14px] text-[#D92D20]">{error}</p>}
            {unavailable && (
              <div className="mt-4 rounded-lg border border-[#FFE4A8] bg-[#FFF8E1] px-4 py-3 text-[14px] text-[#856404]">
                Access requests are temporarily unavailable. Please try again later, or email us at{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold underline">
                  {CONTACT_EMAIL}
                </a>
                .
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-8 flex h-[56px] w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#1F88C7] to-[#0CB4D1] px-8 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit request"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}