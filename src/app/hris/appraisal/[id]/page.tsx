// app/appraisal/[id]/page.tsx
"use client";
import EmployeeHeader from "@/components/appraisal-details/EmployeeHeader";
import GoalsSection from "@/components/appraisal-details/GoalsSection";
import ReviewTimeline from "@/components/appraisal-details/ReviewTimeline";

export default function AppraisalDetailsPage() {
  return (
    <div className="min-h-screen bg-[#f7f8fa] p-6">
      <EmployeeHeader />

      <div className="mt-4">
        <ReviewTimeline />
      </div>
      <div className="mt-6">
        <GoalsSection />
      </div>
    </div>
  );
}
