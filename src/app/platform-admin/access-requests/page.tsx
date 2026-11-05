// src/app/platform-admin/access-requests/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import {
  getAccessRequests,
  getAccessRequestById,
  approveAccessRequest,
  rejectAccessRequest,
  verifyCompany,
} from "@/lib/api/platform-admin";
import { AccessRequest, AccessRequestStatus } from "@/lib/api/types/platform-admin.types";
import Loader from "@/components/ui/Loader";

const TABS: { label: string; value: AccessRequestStatus }[] = [
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

const statusStyles: Record<string, string> = {
  PENDING: "bg-[#FFF3CD] text-[#856404]",
  APPROVED: "bg-[#D8F3DC] text-[#1B7A34]",
  REJECTED: "bg-[#FFE5E5] text-[#FF3B30]",
};

const deliveryStyles: Record<string, string> = {
  SENT: "bg-[#D8F3DC] text-[#1B7A34]",
  FAILED: "bg-[#FFE5E5] text-[#FF3B30]",
  UNKNOWN: "bg-[#FFF3CD] text-[#856404]",
};

const label = (s: string) => (s ? s.charAt(0) + s.slice(1).toLowerCase() : "—");

const money = (amount: number, currency = "NGN") =>
  currency === "NGN" ? `₦${amount.toLocaleString()}` : `${currency} ${amount.toLocaleString()}`;

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

// Returns the first string value found under a key matching the pattern.
function findByKey(obj: unknown, pattern: RegExp): string | null {
  if (!obj || typeof obj !== "object") return null;
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (pattern.test(key) && typeof value === "string") return value;
    const nested = findByKey(value, pattern);
    if (nested) return nested;
  }
  return null;
}

function CacBadge({ status }: { status: string | null | undefined }) {
  if (!status) return <span className="text-[#919EAB]">—</span>;
  const unverified = status === "SUBMITTED_UNVERIFIED";
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium ${
        unverified ? "bg-[#FFF3CD] text-[#856404]" : "bg-[#F4F6F8] text-[#637381]"
      }`}
    >
      {unverified ? "Submitted · unverified" : status.replace(/_/g, " ").toLowerCase()}
    </span>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#F2F3F5] py-2.5 text-sm last:border-0">
      <span className="text-[#637381]">{k}</span>
      <span className="text-right font-medium text-[#212B36]">{v}</span>
    </div>
  );
}

const EVIDENCE_VALIDITY_MS = 30 * 60 * 1000;

type VerifyState =
  | { kind: "idle" }
  | { kind: "verifying" }
  | { kind: "verified"; reference: string; expiresAt: number }
  | { kind: "needsConfirm"; reason: string }
  | { kind: "failed"; message: string };

const displayCac = (type: string, number: string) =>
  number.toUpperCase().startsWith(type.toUpperCase()) ? number : `${type} ${number}`;

const verifyFailureMessage = (
  code: string | undefined,
  fallback?: string,
  registeredName?: string | null,
): string => {
  switch (code) {
    case "VERIFICATION_MISMATCH":
      return registeredName
        ? `The registry lists this number under "${registeredName}", which doesn't match the company name on the request.`
        : "The registry lists this number under a different company name.";
    case "NOT_FOUND":
      return "No company was found for this registration type and number.";
    case "PROVIDER_PERMISSION_DENIED":
      return "The verification provider denied this lookup. Contact the backend team.";
    case "PROVIDER_RATE_LIMITED":
      return "Too many verification requests. Wait a moment and try again.";
    case "PROVIDER_OUTCOME_UNKNOWN":
      return "We couldn't confirm the result. Try again; the same request will not be duplicated.";
    default:
      return fallback || "Verification failed.";
  }
};

type Result = { message: string; delivery: string | null; approved: boolean };

export default function AccessRequestsPage() {
  const [tab, setTab] = useState<AccessRequestStatus>("PENDING");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useState<AccessRequest | null>(null);
  const [mode, setMode] = useState<"view" | "reject">("view");
  const [reason, setReason] = useState("");
  const [acting, setActing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [priceChange, setPriceChange] = useState<string | null>(null);
  const [priceConfirmed, setPriceConfirmed] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verify, setVerify] = useState<VerifyState>({ kind: "idle" });
  const [freshConfirmed, setFreshConfirmed] = useState(false);
  const verifyKeyRef = useRef<{ fingerprint: string; key: string } | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAccessRequests({
        status: tab,
        search: search || undefined,
        page,
        limit: 25,
      });
      setRequests(res.data);
      setTotalPages(res.pagination?.totalPages ?? 1);
      setTotal(res.pagination?.total ?? res.data.length);
    } catch {
      setError("Failed to load access requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(fetchRequests, 400);
    return () => clearTimeout(debounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, search, page]);

  const closePanel = () => {
    setSelected(null);
    setMode("view");
    setReason("");
    setActionError(null);
    setPriceChange(null);
    setPriceConfirmed(false);
    setResult(null);
    setNeedsVerification(false);
    setVerify({ kind: "idle" });
    verifyKeyRef.current = null;
  };

  const handleVerify = async (confirmFresh = false) => {
    if (!selected) return;
    const { registrationType, registrationNumber, name } = selected.company;
    if (!registrationType || !registrationNumber) return;
    const fingerprint = `${name}|${registrationType}|${registrationNumber}|${confirmFresh ? "fresh" : "std"}`;
    if (!verifyKeyRef.current || verifyKeyRef.current.fingerprint !== fingerprint) {
      verifyKeyRef.current = {
        fingerprint,
        key: `approve-${selected.requestId}-${Date.now().toString(36)}${confirmFresh ? "-fresh" : ""}`,
      };
    }
    setVerify({ kind: "verifying" });
    setActionError(null);
    try {
      const res = await verifyCompany({
        companyName: name,
        registrationType: registrationType as "RC" | "BN" | "LP" | "LLP",
        registrationNumber,
        idempotencyKey: verifyKeyRef.current.key,
        ...(confirmFresh ? { freshLookupConfirmed: true } : {}),
      });
      const data = res.data;
      if (data?.verified === true && data.verificationReference) {
        setVerify({
          kind: "verified",
          reference: data.verificationReference,
          expiresAt: data.expiresAt
            ? new Date(data.expiresAt).getTime()
            : Date.now() + EVIDENCE_VALIDITY_MS,
        });
        return;
      }
      verifyKeyRef.current = null;
      setVerify({
        kind: "failed",
        message: verifyFailureMessage(
          data?.reasonCode ?? data?.verificationStatus,
          res.message,
          data?.registeredCompanyName,
        ),
      });
    } catch (err: any) {
      const body = err?.response?.data;
      const code: string | undefined = body?.data?.reasonCode ?? body?.errorCode;
      if (err?.response) verifyKeyRef.current = null;
      if (code === "COMPANY_VERIFICATION_FRESH_LOOKUP_CONFIRMATION_REQUIRED") {
        setFreshConfirmed(false);
        setVerify({
          kind: "needsConfirm",
          reason:
            "Earlier verification evidence for this company has expired. A new lookup is required.",
        });
        return;
      }
      setVerify({
        kind: "failed",
        message: err?.response
          ? verifyFailureMessage(code, body?.message)
          : "No response from the server. Try again.",
      });
    }
  };

  const openRequest = async (req: AccessRequest) => {
    closePanel();
    setSelected(req);
    setNeedsVerification(
      req.status === "PENDING" && Boolean(req.company.registrationType && req.company.registrationNumber),
    );
    try {
      const res = await getAccessRequestById(req.requestId);
      const detail = res.data as Partial<AccessRequest> | undefined;
      if (detail && typeof detail === "object" && detail.requestId === req.requestId) {
        setSelected({ ...req, ...detail } as AccessRequest);
      }
    } catch {
      // The list row already carries everything we need to review.
    }
  };

  useEffect(() => {
    if (verify.kind !== "verified") return;
    const ms = verify.expiresAt - Date.now();
    const timer = setTimeout(
      () => {
        setFreshConfirmed(false);
        setVerify({
          kind: "needsConfirm",
          reason: "The verification evidence has expired. A new lookup is required.",
        });
      },
      Math.max(ms, 0),
    );
    return () => clearTimeout(timer);
  }, [verify]);

  const handleApprove = async () => {
    if (!selected) return;
    setActing(true);
    setActionError(null);
    try {
      const evidence =
        verify.kind === "verified" && verify.expiresAt > Date.now()
          ? { verificationReference: verify.reference }
          : {};
      const res = await approveAccessRequest(selected.requestId, {
        expectedVersion: selected.version,
        acceptCurrentPricing: priceChange ? priceConfirmed : false,
        ...evidence,
      });
      setResult({
        message: res.message || "Request approved",
        delivery: findByKey(res, /delivery/i),
        approved: true,
      });
      setPriceChange(null);
      setPriceConfirmed(false);
      await fetchRequests();
    } catch (err: any) {
      const body = err?.response?.data;
      const code: string | undefined = body?.errorCode ?? body?.code ?? body?.error?.code;
      if (code === "COMPANY_VERIFICATION_REQUIRED") {
        setNeedsVerification(true);
        setVerify((v) => (v.kind === "verified" ? { kind: "idle" } : v));
        setActionError(null);
      } else if (err?.response?.status === 409 && code === "REQUESTED_PLAN_PRICING_CHANGED") {
        setPriceChange(
          body?.message || "The price of the requested plan has changed since this request was made.",
        );
        setPriceConfirmed(false);
      } else if (err?.response?.status === 409) {
        setActionError(
          (body?.message || "This request was changed by someone else.") +
            " The list has been refreshed; close this panel to see the latest status.",
        );
        await fetchRequests();
      } else {
        setActionError(body?.message || "Failed to approve request.");
      }
    } finally {
      setActing(false);
    }
  };

  const handleReject = async () => {
    if (!selected) return;
    const trimmed = reason.trim();
    if (trimmed.length < 10 || trimmed.length > 2000) {
      setActionError("Enter a reason between 10 and 2,000 characters.");
      return;
    }
    setActing(true);
    setActionError(null);
    try {
      const res = await rejectAccessRequest(selected.requestId, {
        expectedVersion: selected.version,
        reason: trimmed,
      });
      setResult({ message: res.message || "Request rejected", delivery: null, approved: false });
      await fetchRequests();
    } catch (err: any) {
      setActionError(err?.response?.data?.message || "Failed to reject request.");
    } finally {
      setActing(false);
    }
  };

  const isPending = selected?.status === "PENDING";

  return (
    <section className="min-h-[calc(100vh-5rem)] space-y-6 bg-[#F4F6F8] p-6">
      <div>
        <h1 className="text-4xl font-bold text-[#212B36]">Access Requests</h1>
        <p className="mt-2 text-sm text-[#637381]">
          Review companies that asked to join Sinkronis. Approving creates the organisation and sends the
          admin invitation.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-8 border-b border-[#E5E8EB]">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => {
                setTab(t.value);
                setPage(1);
              }}
              className={`-mb-px border-b-2 px-2 py-3 text-sm transition-colors ${
                tab === t.value
                  ? "border-[#2183C6] font-medium text-[#2183C6]"
                  : "border-transparent text-[#637381] hover:text-[#212B36]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative w-full max-w-xs">
          <Search size={16} className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-[#919EAB]" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search company or applicant..."
            className="w-full border-b border-[#E5E8EB] bg-transparent py-2.5 pl-7 text-sm text-[#212B36] outline-none placeholder:text-[#919EAB] focus:border-[#2183C6]"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border border-[#F2F3F5] bg-white p-6">
        <table className="min-w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-dotted border-[#EBEEF0] text-[#637381] [&>th:first-child]:pl-3 [&>th:last-child]:pr-3">
              <th className="px-2 py-3.5 font-normal">Company</th>
              <th className="px-2 py-3.5 font-normal">Applicant</th>
              <th className="px-2 py-3.5 font-normal">Plan</th>
              <th className="px-2 py-3.5 font-normal">CAC</th>
              <th className="px-2 py-3.5 font-normal">Submitted</th>
              <th className="px-2 py-3.5 font-normal">Status</th>
              <th className="px-2 py-3.5 font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-sm text-[#919EAB]">
                  <Loader variant="inline" label="Loading requests" />
                </td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-sm text-[#FF3B30]">{error}</td>
              </tr>
            )}
            {!loading && !error && requests.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-sm text-[#919EAB]">
                  No {label(tab).toLowerCase()} requests.
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              requests.map((req) => (
                <tr
                  key={req.requestId}
                  onClick={() => openRequest(req)}
                  className="cursor-pointer text-[#212B36] even:bg-[#F2F2F7] hover:bg-[#EDF1F5] [&>td:first-child]:pl-3 [&>td:last-child]:pr-3"
                >
                  <td className="whitespace-nowrap px-2 py-3.5 font-medium">{req.company.name}</td>
                  <td className="px-2 py-3.5">
                    <p className="whitespace-nowrap">
                      {req.applicant.firstName} {req.applicant.lastName}
                    </p>
                    <p className="text-xs text-[#919EAB]">{req.applicant.email}</p>
                  </td>
                  <td className="whitespace-nowrap px-2 py-3.5">
                    {req.requestedPlan.snapshot?.name ?? req.requestedPlan.key}
                    <span className="ml-2 text-[#637381]">
                      {money(req.requestedPlan.price, req.requestedPlan.currency)}
                    </span>
                  </td>
                  <td className="px-2 py-3.5">
                    <CacBadge status={req.company.cacStatus} />
                  </td>
                  <td className="whitespace-nowrap px-2 py-3.5 text-[#637381]">{formatDate(req.createdAt)}</td>
                  <td className="px-2 py-3.5">
                    <span
                      className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium ${
                        statusStyles[req.status] ?? "bg-[#F4F6F8] text-[#637381]"
                      }`}
                    >
                      {label(req.status)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-2 py-3.5 text-right text-[#2183C6]">Review →</td>
                </tr>
              ))}
          </tbody>
        </table>

        <div className="mt-4 flex items-center justify-between text-sm text-[#637381]">
          <span>
            {total} request{total === 1 ? "" : "s"}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded border border-[#E5E8EB] px-3 py-1 disabled:opacity-40"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="rounded border border-[#E5E8EB] px-3 py-1 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
          <div className="flex h-full w-full max-w-lg flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#F2F3F5] px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-[#212B36]">{selected.company.name}</h2>
                <p className="text-xs text-[#919EAB]">Ref: {selected.requestReference}</p>
              </div>
              <button onClick={closePanel} aria-label="Close" className="text-[#919EAB] hover:text-[#212B36]">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {result ? (
                <div className="space-y-4">
                  <div
                    className={`rounded-md px-4 py-3 text-sm ${
                      result.approved ? "bg-[#D8F3DC] text-[#1B7A34]" : "bg-[#F4F6F8] text-[#212B36]"
                    }`}
                  >
                    {result.message}
                  </div>
                  {result.approved && (
                    <div className="rounded-md border border-[#F2F3F5] p-4 text-sm">
                      <p className="text-[#637381]">Invitation delivery</p>
                      {result.delivery ? (
                        <span
                          className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                            deliveryStyles[result.delivery.toUpperCase()] ?? "bg-[#F4F6F8] text-[#637381]"
                          }`}
                        >
                          {label(result.delivery)}
                        </span>
                      ) : (
                        <p className="mt-2 text-[#856404]">
                          The server did not return a delivery status. Check the tenant before telling the
                          applicant.
                        </p>
                      )}
                      {result.delivery && result.delivery.toUpperCase() !== "SENT" && (
                        <p className="mt-3 text-xs text-[#637381]">
                          The organisation was created, but the invitation may not have reached the applicant.
                          Do not resend automatically; confirm with the email provider first.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="rounded-md border border-[#F2F3F5] px-4">
                    <Row
                      k="Status"
                      v={
                        <span
                          className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-medium ${
                            statusStyles[selected.status] ?? "bg-[#F4F6F8] text-[#637381]"
                          }`}
                        >
                          {label(selected.status)}
                        </span>
                      }
                    />
                    <Row
                      k="Applicant"
                      v={`${selected.applicant.firstName} ${selected.applicant.lastName}`}
                    />
                    <Row k="Email" v={selected.applicant.email} />
                    <Row k="Phone" v={selected.applicant.phone || "—"} />
                    <Row k="Country" v={selected.company.country || "—"} />
                    <Row k="Industry" v={selected.company.industry || "—"} />
                    <Row
                      k="CAC"
                      v={
                        <span className="flex flex-col items-end gap-1">
                          <span>
                            {selected.company.registrationType && selected.company.registrationNumber
                              ? displayCac(selected.company.registrationType, selected.company.registrationNumber)
                              : "Not provided"}
                          </span>
                          {selected.company.registrationNumber && (
                            <CacBadge status={selected.company.cacStatus} />
                          )}
                        </span>
                      }
                    />
                    <Row
                      k="Plan"
                      v={selected.requestedPlan.snapshot?.name ?? selected.requestedPlan.key}
                    />
                    <Row
                      k="Price"
                      v={`${money(selected.requestedPlan.price, selected.requestedPlan.currency)} / ${selected.requestedPlan.billingCycle.toLowerCase()}`}
                    />
                    {selected.requestedPlan.snapshot?.includedModules && (
                      <Row k="Modules" v={selected.requestedPlan.snapshot.includedModules.join(", ")} />
                    )}
                    <Row k="Submitted" v={formatDate(selected.createdAt)} />
                    {selected.review?.decisionReason && (
                      <Row k="Decision reason" v={selected.review.decisionReason} />
                    )}
                  </div>

                  {selected.message && (
                    <div className="mt-4 rounded-md bg-[#F4F6F8] p-4 text-sm text-[#212B36]">
                      <p className="mb-1 text-xs text-[#637381]">Applicant message</p>
                      {selected.message}
                    </div>
                  )}

                  <p className="mt-4 text-xs text-[#637381]">
                    CAC is shown as submitted by the applicant. Approval does not mean it was verified.
                  </p>

                  {needsVerification && (
                    <div className="mt-4 rounded-md border border-[#BBDEFB] bg-[#E3F2FD] p-4 text-sm text-[#1565C0]">
                      <p className="font-semibold">Step 1: Verify the company</p>
                      {selected.company.registrationType && selected.company.registrationNumber ? (
                        <>
                          <p className="mt-1">
                            Verify{" "}
                            {displayCac(selected.company.registrationType, selected.company.registrationNumber)}{" "}
                            against the CAC registry before approving. The registered name must match{" "}
                            <span className="font-semibold">{selected.company.name}</span>.
                          </p>
                          {verify.kind === "needsConfirm" ? (
                            <div className="mt-3 rounded-md border border-[#FFE4A8] bg-[#FFF8E1] p-3 text-[#856404]">
                              <p>{verify.reason}</p>
                              <p className="mt-1 font-medium">
                                A fresh lookup is billable and may incur another Mono charge.
                              </p>
                              <label className="mt-2 flex items-start gap-2">
                                <input
                                  type="checkbox"
                                  checked={freshConfirmed}
                                  onChange={(e) => setFreshConfirmed(e.target.checked)}
                                  className="mt-0.5"
                                />
                                <span>I understand and want to run a new billable lookup.</span>
                              </label>
                              <button
                                onClick={() => handleVerify(true)}
                                disabled={!freshConfirmed}
                                className="mt-3 rounded-md bg-[#2183C6] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#1976B8] disabled:opacity-60"
                              >
                                Confirm and verify
                              </button>
                            </div>
                          ) : verify.kind === "verified" ? (
                            <p className="mt-3 font-medium text-[#1B7A34]">
                              Verified. The evidence is valid for 30 minutes and can be used once. Step 2: press Approve.
                            </p>
                          ) : (
                            <button
                              onClick={() => handleVerify(false)}
                              disabled={verify.kind === "verifying"}
                              className="mt-3 rounded-md bg-[#2183C6] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#1976B8] disabled:opacity-60"
                            >
                              {verify.kind === "verifying" ? "Verifying..." : "Verify with CAC"}
                            </button>
                          )}
                          {verify.kind === "failed" && (
                            <p className="mt-2 text-[#C62828]">{verify.message}</p>
                          )}
                        </>
                      ) : (
                        <p className="mt-1">
                          This applicant did not submit a CAC number, so there is nothing to verify. Reject the
                          request, or ask the backend team to allow approval without it.
                        </p>
                      )}
                    </div>
                  )}

                  {priceChange && (
                    <div className="mt-4 rounded-md border border-[#FFE4A8] bg-[#FFF8E1] p-4 text-sm text-[#856404]">
                      <p className="font-semibold">Price has changed</p>
                      <p className="mt-1">{priceChange}</p>
                      <p className="mt-2">
                        Requested at {money(selected.requestedPlan.price, selected.requestedPlan.currency)}.
                      </p>
                      <label className="mt-3 flex items-start gap-2">
                        <input
                          type="checkbox"
                          checked={priceConfirmed}
                          onChange={(e) => setPriceConfirmed(e.target.checked)}
                          className="mt-0.5"
                        />
                        <span>I confirm the applicant should be approved at the current price.</span>
                      </label>
                    </div>
                  )}

                  {mode === "reject" && (
                    <div className="mt-4">
                      <label className="mb-1 block text-sm font-medium text-[#212B36]">Reason for rejection</label>
                      <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows={4}
                        placeholder="The submitted information could not be validated."
                        className="w-full rounded-md border border-[#E5E8EB] px-3 py-2 text-sm outline-none focus:border-[#2183C6]"
                      />
                      <p className="mt-1 text-xs text-[#919EAB]">{reason.trim().length} / 2000 (minimum 10)</p>
                    </div>
                  )}

                  {actionError && <p className="mt-4 text-sm text-[#FF3B30]">{actionError}</p>}
                </>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-[#F2F3F5] px-6 py-4">
              {result ? (
                <button
                  onClick={closePanel}
                  className="rounded-md bg-[#2183C6] px-4 py-2 text-sm font-medium text-white hover:bg-[#1976B8]"
                >
                  Done
                </button>
              ) : isPending && mode === "view" ? (
                <>
                  <button
                    onClick={() => {
                      setMode("reject");
                      setActionError(null);
                    }}
                    className="rounded-md border border-[#FFC9C5] px-4 py-2 text-sm font-medium text-[#FF3B30] hover:bg-[#FFF5F5]"
                  >
                    Reject
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={acting || (priceChange !== null && !priceConfirmed) || (needsVerification && verify.kind !== "verified")}
                    className="rounded-md bg-[#2183C6] px-4 py-2 text-sm font-medium text-white hover:bg-[#1976B8] disabled:opacity-60"
                  >
                    {acting ? "Approving..." : priceChange ? "Approve at current price" : "Approve"}
                  </button>
                </>
              ) : isPending && mode === "reject" ? (
                <>
                  <button
                    onClick={() => {
                      setMode("view");
                      setActionError(null);
                    }}
                    className="rounded-md border border-[#E5E8EB] px-4 py-2 text-sm text-[#637381] hover:bg-[#F4F6F8]"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={acting}
                    className="rounded-md bg-[#FF3B30] px-4 py-2 text-sm font-medium text-white hover:bg-[#E5342A] disabled:opacity-60"
                  >
                    {acting ? "Rejecting..." : "Confirm rejection"}
                  </button>
                </>
              ) : (
                <button
                  onClick={closePanel}
                  className="rounded-md border border-[#E5E8EB] px-4 py-2 text-sm text-[#637381] hover:bg-[#F4F6F8]"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}