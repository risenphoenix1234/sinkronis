// src/app/manager/appraisal/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ManagerReview from "@/components/hris/appraisal-details/ManagerReview";

export default function ManagerAppraisalReviewPage() {
  const params = useParams();
  const router = useRouter();
  const id =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
        ? params.id[0]
        : "";

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => router.push("/manager/appraisal")}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
      >
        <ArrowLeft size={16} />
        <span>Back to Appraisals</span>
      </button>
      <ManagerReview
        appraisalId={id}
        onReviewSubmitted={() => router.push("/manager/appraisal")}
      />
    </div>
  );
}