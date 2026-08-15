import StatusBadge from "../appraisal/StatusBadge";
import RatingScale from "./RatingScale";

export default function GoalCard() {
  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            Process Optimisation Initiative
          </h2>

          <p className="mt-2 text-gray-500">
            Identify and eliminate 3 operational inefficiencies.
          </p>

          <p className="mt-2 text-[#7A8DA8]">
            ✓ 3 documented bottlenecks resolved.
          </p>

          <p className="mt-2 text-sm text-gray-500">Target: 30 Jun 2026</p>
        </div>

        <StatusBadge text="Completed" />
      </div>

      <hr className="my-8" />

      <div className="grid grid-cols-2 gap-20">
        <div>
          <RatingScale
            title="Employee"
            selected={4}
            subtitle="Exceeds Expectations"
          />

          <p className="mt-4 text-gray-600">
            Identified and resolved 3 bottlenecks, saving ~5 hrs/week.
          </p>
        </div>

        <div>
          <RatingScale
            title="Manager"
            selected={3}
            subtitle="Meets Expectations"
          />

          <p className="mt-4 text-gray-600">
            Good outcome but took longer than expected.
          </p>
        </div>
      </div>
    </div>
  );
}
