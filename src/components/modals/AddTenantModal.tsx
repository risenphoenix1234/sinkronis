// src/components/modals/AddTenantModal.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { verifyCompany } from "@/lib/api/platform-admin";
import type {
  CompanyRegistrationType,
  VerifyCompanyData,
} from "@/lib/api/types/platform-admin.types";

const PLAN_MODULES: Record<string, string[]> = {
  HRIS: ["HRIS"],
  PAYROLL: ["Payroll"],
  ACCOUNTING: ["Accounting"],
  ALL_IN_ONE: ["HRIS", "Payroll", "Accounting"],
};

const ALL_PLANS = ["HRIS", "PAYROLL", "ACCOUNTING", "ALL_IN_ONE"];

const COUNTRIES = [
  { code: "NG", name: "Nigeria" },
  { code: "GH", name: "Ghana" },
  { code: "KE", name: "Kenya" },
  { code: "ZA", name: "South Africa" },
];

const REGISTRATION_TYPES: { value: CompanyRegistrationType; label: string }[] = [
  { value: "RC", label: "RC – Limited company" },
  { value: "BN", label: "BN – Business name" },
  { value: "LP", label: "LP – Limited partnership" },
  { value: "LLP", label: "LLP – Limited liability partnership" },
];

const VERIFY_TIMEOUT_MS = 30000;
const EVIDENCE_VALIDITY_MS = 30 * 60 * 1000;

export interface NewTenantInput {
  companyName: string;
  adminEmail: string;
  subscriptionPlan: string;
  country: string;
  industry?: string;
  registrationType?: CompanyRegistrationType;
  registrationNumber?: string;
  verificationReference?: string;
}

interface AddTenantModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (input: NewTenantInput) => Promise<void>;
}

type Tone = "red" | "amber" | "slate";

type VerifyState =
  | { kind: "idle" }
  | { kind: "verifying" }
  | { kind: "verified"; data: VerifyCompanyData; reference: string; expiresAt: string }
  | { kind: "failed"; badge: string; message: string; tone: Tone }
  | { kind: "expired" };

const TONE_STYLES: Record<Tone, string> = {
  red: "bg-red-50 text-red-600",
  amber: "bg-amber-50 text-amber-600",
  slate: "bg-slate-100 text-slate-600",
};

function classifyFailure(
  code: string | undefined,
  fallback: string | undefined,
  registeredName?: string | null
): { badge: string; message: string; tone: Tone } {
  switch (code) {
    case "VERIFICATION_MISMATCH":
      return {
        badge: "Company details mismatch",
        message: registeredName
          ? `The registry lists this number under "${registeredName}", which doesn't match the company name entered.`
          : "The company name doesn't match the registry record for this registration number.",
        tone: "red",
      };
    case "NOT_FOUND":
      return {
        badge: "Company not found",
        message: "No company was found for this registration type and number.",
        tone: "red",
      };
    case "INVALID_INPUT":
    case "UNSUPPORTED_REGISTRATION_TYPE":
      return {
        badge: "Invalid registration details",
        message:
          fallback || "Check the company name, registration type and registration number.",
        tone: "red",
      };
    case "PROVIDER_PERMISSION_DENIED":
      return {
        badge: "Provider permission denied",
        message: "The verification provider denied this lookup. Contact the backend team.",
        tone: "amber",
      };
    case "PROVIDER_RATE_LIMITED":
      return {
        badge: "Rate limited",
        message: "Too many verification requests. Wait a moment and try again.",
        tone: "amber",
      };
    case "PROVIDER_OUTCOME_UNKNOWN":
      return {
        badge: "Verification outcome unknown",
        message:
          "We couldn't confirm the result. Try again; the same request will not be duplicated.",
        tone: "amber",
      };
    case "PROVIDER_UNAVAILABLE":
    case "PROVIDER_AUTHENTICATION_FAILED":
    case "INSUFFICIENT_BALANCE":
      return {
        badge: "Provider unavailable",
        message: "The verification service is unavailable right now. Try again later.",
        tone: "amber",
      };
    default:
      return {
        badge: "Verification failed",
        message: fallback || "Verification could not be completed.",
        tone: "red",
      };
  }
}

function newIdempotencyKey(registrationNumber: string) {
  const uid =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `tenant-cac-${registrationNumber.toLowerCase()}-${uid}`;
}

function normaliseRegistrationNumber(raw: string) {
  return raw.replace(/[\s_-]/g, "").toUpperCase();
}

export default function AddTenantModal({ open, onClose, onAdd }: AddTenantModalProps) {
  const [companyName, setCompanyName] = useState("");
  const [registrationType, setRegistrationType] =
    useState<CompanyRegistrationType>("RC");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [subscriptionPlan, setSubscriptionPlan] = useState("");
  const [country, setCountry] = useState("NG");
  const [industry, setIndustry] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [verify, setVerify] = useState<VerifyState>({ kind: "idle" });

  const keyRef = useRef<{ fingerprint: string; key: string } | null>(null);
  const uncertainRef = useRef(false);

  useEffect(() => {
    if (open) {
      setCompanyName("");
      setRegistrationType("RC");
      setRegistrationNumber("");
      setAdminEmail("");
      setSubscriptionPlan("");
      setCountry("NG");
      setIndustry("");
      setFormError(null);
      setSubmitting(false);
      setVerify({ kind: "idle" });
      keyRef.current = null;
      uncertainRef.current = false;
    }
  }, [open]);

  useEffect(() => {
    if (verify.kind !== "verified") return;
    const ms = new Date(verify.expiresAt).getTime() - Date.now();
    if (Number.isNaN(ms)) return;
    if (ms <= 0) {
      setVerify({ kind: "expired" });
      return;
    }
    const timer = setTimeout(
      () => setVerify({ kind: "expired" }),
      Math.min(ms, 2147483647)
    );
    return () => clearTimeout(timer);
  }, [verify]);

  if (!open) return null;

  const derivedModules = subscriptionPlan ? PLAN_MODULES[subscriptionPlan] ?? [] : [];
  const verifying = verify.kind === "verifying";
  const verified = verify.kind === "verified";

  const invalidateVerification = () => {
    setVerify((prev) => (prev.kind === "verifying" ? prev : { kind: "idle" }));
  };

  const handleVerify = async () => {
    const name = companyName.trim();
    const number = normaliseRegistrationNumber(registrationNumber);

    if (name.length < 2 || name.length > 150) {
      setFormError("Enter the company name (2–150 characters) before verifying.");
      return;
    }
    if (!new RegExp(`^(?:${registrationType})?\\d{1,10}$`).test(number)) {
      setFormError(
        `Enter a valid ${registrationType} registration number (1–10 digits, optionally starting with ${registrationType}).`
      );
      return;
    }

    setFormError(null);
    setVerify({ kind: "verifying" });

    const fingerprint = `${name}|${registrationType}|${number}`;
    const reuseKey =
      uncertainRef.current && keyRef.current?.fingerprint === fingerprint;
    if (!reuseKey) {
      keyRef.current = { fingerprint, key: newIdempotencyKey(number) };
    }
    const idempotencyKey = keyRef.current!.key;

    try {
      const res = await verifyCompany({
        companyName: name,
        registrationType,
        registrationNumber: number,
        idempotencyKey,
      });
      const data = res.data;

      if (data?.verified === true && data.verificationReference) {
        uncertainRef.current = false;
        setVerify({
          kind: "verified",
          data,
          reference: data.verificationReference,
          expiresAt:
            data.expiresAt ?? new Date(Date.now() + EVIDENCE_VALIDITY_MS).toISOString(),
        });
        return;
      }

      const code = data?.reasonCode ?? data?.verificationStatus;
      uncertainRef.current =
        data?.outcomeCertain === false || code === "PROVIDER_OUTCOME_UNKNOWN";
      setVerify({
        kind: "failed",
        ...classifyFailure(code, res.message, data?.registeredCompanyName),
      });
    } catch (err: any) {
      const status = err?.response?.status;
      const body = err?.response?.data;

      if (!err?.response) {
        uncertainRef.current = true;
        setVerify({
          kind: "failed",
          ...classifyFailure(
            "PROVIDER_OUTCOME_UNKNOWN",
            "No response from the server."
          ),
        });
        return;
      }

      uncertainRef.current = false;
      const code: string | undefined = body?.data?.reasonCode ?? body?.errorCode;

      if (status === 409) {
        keyRef.current = null;
        setVerify({
          kind: "failed",
          badge: "Verification conflict",
          message:
            body?.message ||
            "This verification request conflicts with an earlier one. Try again.",
          tone: "amber",
        });
      } else if (status === 403 && !code) {
        setVerify({
          kind: "failed",
          badge: "Access denied",
          message: "You don't have permission to verify companies.",
          tone: "red",
        });
      } else if (status === 401) {
        setVerify({
          kind: "failed",
          badge: "Session expired",
          message: "Your session has expired. Sign in again to continue.",
          tone: "amber",
        });
      } else {
        setVerify({
          kind: "failed",
          ...classifyFailure(code, body?.message),
        });
      }
    }
  };

  const handleSubmit = async () => {
    if (!companyName || !adminEmail || !subscriptionPlan) {
      setFormError("Please fill in all required fields.");
      return;
    }

    setFormError(null);
    setSubmitting(true);
    try {
      const evidence =
        verify.kind === "verified"
          ? {
              registrationType,
              registrationNumber: normaliseRegistrationNumber(registrationNumber),
              verificationReference: verify.reference,
            }
          : {};

      await onAdd({
        companyName: companyName.trim(),
        adminEmail,
        subscriptionPlan,
        country,
        industry: industry || undefined,
        ...evidence,
      });
    } catch (err: any) {
      setFormError(
        err?.response?.data?.message || "Failed to add tenant. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const statusBadge = (() => {
    switch (verify.kind) {
      case "verifying":
        return { label: "Verifying…", className: TONE_STYLES.slate };
      case "verified":
        return { label: "Verified", className: "bg-emerald-50 text-emerald-600" };
      case "expired":
        return { label: "Verification expired", className: TONE_STYLES.amber };
      case "failed":
        return { label: verify.badge, className: TONE_STYLES[verify.tone] };
      default:
        return { label: "Not verified", className: TONE_STYLES.slate };
    }
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Add Tenant</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Create a new company on the platform
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {formError && (
          <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">
            {formError}
          </div>
        )}

        <div className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-700">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={companyName}
              disabled={verifying}
              onChange={(e) => {
                setCompanyName(e.target.value);
                invalidateVerification();
              }}
              placeholder="e.g. Acme Nigeria Limited"
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:opacity-60"
            />
          </div>

          <div className="rounded-md border border-slate-200 p-3">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-medium text-slate-700">
                CAC Registration{" "}
                <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${statusBadge.className}`}
              >
                {statusBadge.label}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-[1fr_1.2fr] gap-2">
              <select
                value={registrationType}
                disabled={verifying}
                onChange={(e) => {
                  setRegistrationType(e.target.value as CompanyRegistrationType);
                  invalidateVerification();
                }}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:opacity-60"
              >
                {REGISTRATION_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={registrationNumber}
                disabled={verifying}
                onChange={(e) => {
                  setRegistrationNumber(e.target.value);
                  invalidateVerification();
                }}
                placeholder="e.g. RC1234567"
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:opacity-60"
              />
            </div>

            <button
              type="button"
              onClick={handleVerify}
              disabled={verifying || submitting}
              className="mt-3 w-full rounded-md border border-sky-600 py-2 text-sm font-medium text-sky-600 hover:bg-sky-50 disabled:opacity-60"
            >
              {verifying
                ? "Verifying…"
                : verified
                ? "Verify again"
                : "Verify Company"}
            </button>

            {verify.kind === "verified" && (
              <div className="mt-3 rounded-md bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                <p className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Company verified
                </p>
                <dl className="mt-2 space-y-1">
                  <div className="flex justify-between gap-3">
                    <dt className="text-emerald-600">Registered name</dt>
                    <dd className="text-right font-medium">
                      {verify.data.registeredCompanyName}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-emerald-600">Registration</dt>
                    <dd className="font-medium">
                      {verify.data.registrationType} · {verify.data.registrationNumber}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-emerald-600">Registry status</dt>
                    <dd className="font-medium">{verify.data.registryStatus}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-emerald-600">Valid until</dt>
                    <dd className="font-medium">
                      {new Date(verify.expiresAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </dd>
                  </div>
                </dl>
              </div>
            )}

            {verify.kind === "failed" && (
              <div
                className={`mt-3 rounded-md px-3 py-2 text-xs ${TONE_STYLES[verify.tone]}`}
              >
                {verify.message}
              </div>
            )}

            {verify.kind === "expired" && (
              <div className={`mt-3 rounded-md px-3 py-2 text-xs ${TONE_STYLES.amber}`}>
                The verification has expired. Verify the company again, or create the
                tenant without it.
              </div>
            )}

            {verify.kind !== "verified" && (
              <p className="mt-3 text-[11px] text-slate-400">
                You can create the tenant without CAC verification for now.
              </p>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700">
              Admin Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="admin@acme.example"
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700">
              Subscription Plan <span className="text-red-500">*</span>
            </label>
            <select
              value={subscriptionPlan}
              onChange={(e) => setSubscriptionPlan(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            >
              <option value="">Select a plan</option>
              {ALL_PLANS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700">Modules</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {derivedModules.length === 0 && (
                <span className="text-xs text-slate-400">Select a plan to see included modules</span>
              )}
              {derivedModules.map((mod) => (
                <span
                  key={mod}
                  className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                >
                  {mod}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700">Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700">Industry</label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g. Technology"
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={submitting || verifying}
            className="flex-1 rounded-md bg-sky-600 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60"
          >
            {submitting ? "Adding..." : "Add Tenant"}
          </button>
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 rounded-md border border-slate-200 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}