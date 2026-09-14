// components/employee/profile/BankDetails.tsx
"use client";

import { useState } from "react";
import { formatDate } from "@/lib/format";
import { BankDetailsData } from "@/lib/api/employee";
import BankUpdateRequestModal from "./BankUpdaterequestModal";

interface BankDetailsProps {
  data: BankDetailsData;
  onRequestSubmitted: () => void; // parent refetches the profile
}

export default function BankDetails({
  data,
  onRequestSubmitted,
}: BankDetailsProps) {
  const [showModal, setShowModal] = useState(false);
  const hasPendingRequest = data.pendingUpdateRequest?.status === "PENDING";

  return (
    <div className="space-y-6 py-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="text-xs text-gray-400">Bank Name</p>
          <p className="mt-2 font-medium">{data.bank.name}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Account Number</p>
          <p className="mt-2 font-medium">{data.accountNumberMasked}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Account Name</p>
          <p className="mt-2 font-medium">{data.accountName}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Account Type</p>
          <p className="mt-2 font-medium">{data.accountType}</p>
        </div>
      </div>

      {data.pendingUpdateRequest && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            hasPendingRequest
              ? "border-amber-200 bg-amber-50 text-amber-800"
              : "border-gray-200 bg-gray-50 text-gray-600"
          }`}
        >
          An update request submitted on{" "}
          {formatDate(data.pendingUpdateRequest.submittedAt)} is{" "}
          {data.pendingUpdateRequest.status.toLowerCase()}.
        </div>
      )}

      <div>
        <button
          onClick={() => setShowModal(true)}
          disabled={hasPendingRequest}
          className="rounded-lg border border-sky-200 px-4 py-2 text-sm font-medium text-sky-600 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Request Bank Details Update
        </button>
        {hasPendingRequest && (
          <p className="mt-2 text-xs text-gray-400">
            You already have a pending request — wait for it to be resolved
            before submitting another.
          </p>
        )}
      </div>

      {showModal && (
        <BankUpdateRequestModal
          onClose={() => setShowModal(false)}
          onSubmitted={onRequestSubmitted}
        />
      )}
    </div>
  );
}
