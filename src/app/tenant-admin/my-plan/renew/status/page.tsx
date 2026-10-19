// src/app/tenant-admin/my-plan/renew/status/page.tsx
"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getSubscriptionPayment, verifySubscriptionPayment } from "@/lib/api/admin";
import {
  SubscriptionPaymentAttempt,
  SubscriptionPaymentStatus,
} from "@/lib/api/types/renewal.types";

const PAYMENT_REF_KEY = "sinkronis:renewal-reference";
const INTENT_PREFIX = "sinkronis:renewal-intent:";
const POLL_MS = 5000;

const copy: Record<SubscriptionPaymentStatus, { title: string; body: string }> = {
  CREATED: {
    title: "Payment pending",
    body: "Your payment has been created and is waiting to be started.",
  },
  INITIALIZING: {
    title: "Payment pending",
    body: "We are setting up your checkout.",
  },
  INITIALIZED: {
    title: "Payment pending",
    body: "Your checkout is ready. Complete the payment to renew.",
  },
  UNKNOWN: {
    title: "Payment verification pending",
    body: "We could not confirm this payment yet. Please do not pay again. We will keep checking this reference.",
  },
  FAILED: {
    title: "Payment failed",
    body: "This payment did not go through.",
  },
  VERIFIED: {
    title: "Finalizing your renewal",
    body: "Your payment is verified. We are finishing the renewal.",
  },
  COMPLETED: {
    title: "Renewal complete",
    body: "Your subscription has been renewed.",
  },
};

function extractPayment(res: any): SubscriptionPaymentAttempt | null {
  const root = res?.data ?? res;
  const p = root?.payment ?? root;
  if (p && typeof p === "object" && typeof p.status === "string") {
    return p as SubscriptionPaymentAttempt;
  }
  return null;
}

function clearIntentKeys() {
  try {
    sessionStorage.removeItem(PAYMENT_REF_KEY);
    Object.keys(sessionStorage)
      .filter((k) => k.startsWith(INTENT_PREFIX))
      .forEach((k) => sessionStorage.removeItem(k));
  } catch {
    // ignore storage failures
  }
}

function StatusContent() {
  const params = useSearchParams();
  const [reference, setReference] = useState<string | null>(null);
  const [payment, setPayment] = useState<SubscriptionPaymentAttempt | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const autoVerified = useRef(false);

  useEffect(() => {
    const fromUrl = params.get("reference") || params.get("trxref");
    if (fromUrl) {
      setReference(fromUrl);
      return;
    }
    try {
      setReference(sessionStorage.getItem(PAYMENT_REF_KEY));
    } catch {
      setReference(null);
    }
  }, [params]);

  const refresh = useCallback(async () => {
    if (!reference) return;
    try {
      const res = await getSubscriptionPayment(reference);
      const next = extractPayment(res);
      if (next) setPayment(next);
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not load payment status.");
    }
  }, [reference]);

  const verify = useCallback(async () => {
    if (!reference) return;
    setVerifying(true);
    try {
      const res = await verifySubscriptionPayment(reference);
      const next = extractPayment(res);
      if (next) setPayment(next);
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Verification request failed.");
    } finally {
      setVerifying(false);
    }
  }, [reference]);

  useEffect(() => {
    if (!reference) return;
    refresh();
  }, [reference, refresh]);

  useEffect(() => {
    if (!reference || !payment) return;
    if (payment.status === "COMPLETED") {
      clearIntentKeys();
      return;
    }
    if (payment.status === "FAILED") return;

    const returnedFromCheckout = params.has("reference") || params.has("trxref");
    if (returnedFromCheckout && !autoVerified.current) {
      autoVerified.current = true;
      verify();
    }

    const timer = setInterval(refresh, POLL_MS);
    return () => clearInterval(timer);
  }, [reference, payment, params, refresh, verify]);

  if (!reference) {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
        No payment reference found.{" "}
        <Link href="/tenant-admin/my-plan" className="font-medium text-sky-600">
          Back to My Plan
        </Link>
      </div>
    );
  }

  const status = payment?.status;
  const text = status ? copy[status] : { title: "Checking payment", body: "Loading status..." };

  return (
    <div className="mx-auto max-w-xl space-y-4 rounded-xl border border-slate-200 bg-white p-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{text.title}</h2>
        <p className="mt-1 text-sm text-slate-600">{text.body}</p>
      </div>

      <div className="rounded-md bg-slate-50 p-3 text-xs text-slate-600">
        <p>
          Reference: <span className="font-mono text-slate-800">{reference}</span>
        </p>
        {status && <p className="mt-1">Status: {status}</p>}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex flex-wrap gap-3">
        {status === "COMPLETED" && (
          <button
            type="button"
            onClick={() => {
              window.location.href = "/tenant-admin/my-plan";
            }}
            className="rounded-md bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700"
          >
            Continue
          </button>
        )}

        {(status === "INITIALIZED" || status === "CREATED") && payment?.authorizationUrl && (
          <a
            href={payment.authorizationUrl}
            className="rounded-md bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700"
          >
            Continue to payment
          </a>
        )}

        {status && status !== "COMPLETED" && status !== "FAILED" && (
          <button
            type="button"
            onClick={verify}
            disabled={verifying}
            className="rounded-md border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            {verifying ? "Verifying..." : "Verify payment"}
          </button>
        )}

        {status === "FAILED" && (
          <Link
            href="/tenant-admin/my-plan/renew"
            className="rounded-md bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700"
          >
            Try again
          </Link>
        )}
      </div>
    </div>
  );
}

export default function RenewalStatusPage() {
  return (
    <Suspense fallback={<p className="p-6 text-sm text-slate-400">Loading...</p>}>
      <StatusContent />
    </Suspense>
  );
}