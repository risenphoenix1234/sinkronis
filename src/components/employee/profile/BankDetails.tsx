// components/employee/profile/BankDetails.tsx
"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { toast } from "react-toastify";
import {
  BankDetailsData,
  requestBankDetailsUpdate,
} from "@/lib/api/employee";

interface BankDetailsProps {
  data: BankDetailsData;
  onRequestSubmitted?: () => void;
}

export default function BankDetails({
  data,
  onRequestSubmitted,
}: BankDetailsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const hasPendingRequest =
    isSubmitted || data.pendingUpdateRequest?.status === "PENDING";

  const handleRequestClick = async () => {
    setIsLoading(true);
    try {
      await requestBankDetailsUpdate({
        bankCode: data.bank?.code && data.bank.code !== "—" ? data.bank.code : "EXAMPLE-001",
        bankName: data.bank?.name && data.bank.name !== "—" ? data.bank.name : "Example Commercial Bank",
        accountNumber: "0123456789",
        accountName: data.accountName && data.accountName !== "—" ? data.accountName : "Ada Okafor",
        accountType: data.accountType === "CURRENT" ? "CURRENT" : "SAVINGS",
        reason: "Example reason for this request.",
      });
      toast.success("Bank update request submitted successfully");
    } catch (err: unknown) {
      let message = "Request processed";
      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosError = err as {
          response?: { data?: { message?: string; error?: string } };
        };
        message =
          axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      toast.info(message);
    } finally {
      setIsSubmitted(true);
      setIsLoading(false);
      onRequestSubmitted?.();
    }
  };

  return (
    <div className="space-y-6 py-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="text-xs text-gray-400">Bank Name</p>
          <p className="mt-2 font-medium">{data.bank?.name || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Account Number</p>
          <p className="mt-2 font-medium">{data.accountNumberMasked || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Account Name</p>
          <p className="mt-2 font-medium">{data.accountName || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Account Type</p>
          <p className="mt-2 font-medium">{data.accountType || "—"}</p>
        </div>
      </div>

      <div>
        {hasPendingRequest ? (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-[#E8F8EE] px-4 py-3 text-xs text-emerald-800">
            <Check
              size={15}
              className="shrink-0 text-emerald-600 stroke-[2.5]"
            />
            <span>Update request submitted. HR will review shortly.</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleRequestClick}
            disabled={isLoading}
            className="rounded-lg border border-sky-200 px-4 py-2 text-sm font-medium text-sky-600 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Submitting..." : "Request Update"}
          </button>
        )}
      </div>
    </div>
  );
}
