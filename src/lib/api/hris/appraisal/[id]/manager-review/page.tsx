"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ManagerReview from "@/components/hris/appraisal-details/ManagerReview";

export default function ManagerReviewRoutePage() {
  const params = useParams();
  const router = useRouter();
  const id =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
        ? params.id[0]
        : "";

  return (
    <main className="min-h-screen bg-[#F8FAFC] py-6 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-4">
        <button
          type="button"
          onClick={() => router.push(`/hris/appraisal/${id || ""}`)}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Appraisal Overview</span>
        </button>
        <ManagerReview
          appraisalId={id}
          onReviewSubmitted={() => {
            router.push(`/hris/appraisal/${id || ""}`);
          }}
        />
      </div>
    </main>
  );
}
