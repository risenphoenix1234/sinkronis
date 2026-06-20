// app/appraisal/page.tsx

import ReviewsTable from "@/components/ReviewsTable";

export default function AppraisalReviewPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] space-y-6">
      {/* Filters */}
      <div className="mt-3 flex gap-4">
        <input
          placeholder="Search employee..."
          className="h-10 w-64 rounded-md border border-gray-300 px-4 text-sm"
        />

        <select className="h-10 w-48 rounded-md border border-gray-300 px-3 text-sm">
          <option>All Departments</option>
        </select>
      </div>

      {/* Table */}
      <div className="mt-3">
        <ReviewsTable />
      </div>
    </div>
  );
}
