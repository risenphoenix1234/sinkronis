"use client";

import { useParams } from "next/navigation";
import ReviewPage from "@/components/hris/appraisal-details/ReviewPage";

export default function Page() {
  const params = useParams();
  const id =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
        ? params.id[0]
        : "";

  return (
    <main className="min-h-screen bg-[#F8FAFC] py-6">
      <ReviewPage appraisalId={id} />
    </main>
  );
}
