import CurrentPhaseCard from "@/components/employee/appraisal/CurrentPhasecard";
import PastAppraisalTable from "@/components/employee/appraisal/PastAppraisalTable";
import ReviewProgress from "@/components/employee/appraisal/ReviewProgress";
import StatusBadge from "@/components/employee/appraisal/StatusBadge";

export default function AppraisalPage() {
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold">My Appraisal</h1>

          <p className="mt-2 text-gray-500">
            Track your performance goals and appraisal cycles
          </p>
        </div>

        <div className="rounded-xl border bg-white p-8">
          <div className="flex justify-between">
            <div>
              <h2 className="text-xl font-semibold">Q2 2026 Review</h2>

              <p className="mt-1 text-sm text-gray-500">
                Period: 1 Apr – 30 Jun 2026 • Deadline: 15 July 2026
              </p>
            </div>

            <StatusBadge />
          </div>

          <div className="mt-8">
            <ReviewProgress />
          </div>

          <CurrentPhaseCard />
        </div>

        <PastAppraisalTable />
      </div>
    </div>
  );
}
