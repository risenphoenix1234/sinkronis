// src/components/employee/profile/BankDetails.tsx
"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { BankDetailsData } from "@/lib/api/employee";
import BankUpdateRequestModal from "./BankUpdaterequestModal";

interface BankDetailsProps {
  data: BankDetailsData;
  onRequestSubmitted?: () => void;
}

export default function BankDetails({
  data,
  onRequestSubmitted,
}: BankDetailsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const hasPendingRequest =
    isSubmitted || data.pendingUpdateRequest?.status === "PENDING";

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
            onClick={() => setIsModalOpen(true)}
            className="rounded-lg border border-sky-200 px-4 py-2 text-sm font-medium text-sky-600 transition hover:bg-sky-50"
          >
            Request Update
          </button>
        )}
      </div>

      {isModalOpen && (
        <BankUpdateRequestModal
          initialData={data}
          onClose={() => setIsModalOpen(false)}
          onSubmitted={() => {
            setIsSubmitted(true);
            onRequestSubmitted?.();
          }}
        />
      )}
    </div>
  );
}